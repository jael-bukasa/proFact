const express = require('express');
const factureService = require('../services/factureService');

module.exports = function(db) {
  const router = express.Router();

  // Route pour récupérer toutes les factures
  router.get('/', (req, res) => {
    factureService.obtenirTous(db, (err, factures) => {
      if (err) {
        console.error("Erreur récupération factures:", err);
        return res.status(500).json({ erreur: err.sqlMessage || "Erreur lors de la récupération des factures." });
      }
      res.status(200).json(factures);
    });
  });

  // Route pour un client unique (création)
  router.post('/', (req, res) => {
    factureService.ajouter(db, req.body, (err, result) => {
      if (err) {
        console.error("Erreur insertion facture:", err);
        return res.status(500).json({ erreur: err.sqlMessage || "Erreur lors de l'enregistrement de la facture." });
      }
      
      const numeroGenere = result.numeroGenere || 'N/A';

      res.status(201).json({ 
        message: `Facture numéro ${numeroGenere} enregistrée avec succès.`, 
        id: result.insertId,
        numero: numeroGenere 
      });
    });
  });

  // Route pour plusieurs clients (en masse)
  router.post('/masse', async (req, res) => {
    const { clientsCibles, ...baseData } = req.body;

    if (!Array.isArray(clientsCibles) || clientsCibles.length === 0) {
      return res.status(400).json({ erreur: "Aucun client sélectionné pour la génération en masse." });
    }

    const queryClients = `SELECT * FROM clients WHERE id IN (?) OR matricule IN (?)`;
    db.query(queryClients, [clientsCibles, clientsCibles], (err, clientsTrouves) => {
      if (err) {
        console.error("Erreur recherche clients en masse:", err);
        return res.status(500).json({ erreur: err.sqlMessage || "Erreur lors de la récupération des clients." });
      }

      let erreurs = 0;
      let inserés = 0;

      if (clientsTrouves.length === 0) {
        return res.status(400).json({ erreur: "Aucun client correspondant trouvé dans la base de données." });
      }

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
              res.status(207).json({ message: `${inserés} factures créées avec succès, ${erreurs} échec(s).` });
            } else {
              res.status(201).json({ message: `Lot de ${inserés} factures généré et enregistré avec succès !` });
            }
          }
        });
      });
    });
  });

  // Route pour supprimer une facture
  router.delete('/:id', (req, res) => {
    const factureId = req.params.id;
    const query = `DELETE FROM factures WHERE id = ?`;
    
    db.query(query, [factureId], (err, result) => {
      if (err) {
        console.error("Erreur suppression facture:", err);
        return res.status(500).json({ erreur: "Erreur lors de la suppression de la facture." });
      }
      res.status(200).json({ message: "Facture supprimée avec succès." });
    });
  });

  return router;
};