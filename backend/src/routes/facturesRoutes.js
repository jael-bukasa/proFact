const express = require('express');
const router = express.Router();
const factureService = require('../services/factureService');

// Route pour un client unique
router.post('/', (req, res) => {
  const db = req.app.get('db'); // Récupération de l'instance de connexion MySQL
  factureService.ajouter(db, req.body, (err, result) => {
    if (err) {
      console.error("Erreur insertion facture:", err);
      return res.status(500).json({ erreur: "Erreur lors de l'enregistrement de la facture." });
    }
    res.status(201).json({ message: "Facture enregistrée avec succès", id: result.insertId });
  });
});

// Route pour plusieurs clients (en masse)
router.post('/masse', async (req, res) => {
  const db = req.app.get('db');
  const { clientsCibles, ...baseData } = req.body;

  if (!Array.isArray(clientsCibles) || clientsCibles.length === 0) {
    return res.status(400).json({ erreur: "Aucun client sélectionné pour la génération en masse." });
  }

  // Récupération des détails de chaque client pour les insérer un par un
  const queryClients = `SELECT * FROM clients WHERE id IN (?) OR matricule IN (?)`;
  db.query(queryClients, [clientsCibles, clientsCibles], (err, clientsTrouves) => {
    if (err) {
      console.error("Erreur recherche clients en masse:", err);
      return res.status(500).json({ erreur: "Erreur lors de la récupération des clients." });
    }

    let erreurs = 0;
    let inserés = 0;

    clientsTrouves.forEach((cli) => {
      const nomComplet = `${cli.nom || ''} ${cli.postNom || ''} ${cli.prenom || ''}`.trim();
      const payloadFacture = {
        ...baseData,
        clientCode: cli.id || cli.matricule || '',
        nomLocataire: nomComplet,
        logement: cli.logement || '',
        adresse: cli.adresse || ''
      };

      factureService.ajouter(db, payloadFacture, (errInsert) => {
        if (errInsert) erreurs++;
        else inserés++;

        if (inserés + erreurs === clientsTrouves.length) {
          if (erreurs > 0) {
            res.status(207).json({ message: `${inserés} factures créées, ${erreurs} échecs.` });
          } else {
            res.status(201).json({ message: `${inserés} factures générées et enregistrées avec succès !` });
          }
        }
      });
    });
  });
});

module.exports = router;