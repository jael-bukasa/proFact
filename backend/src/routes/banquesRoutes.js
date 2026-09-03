const express = require('express');
const banqueService = require('../services/banqueService');

module.exports = function (db) {
  const router = express.Router();

  // Récupérer toutes les banques
  router.get('/', (req, res) => {
    banqueService.obtenirToutes(db, (err, results) => {
      if (err) {
        console.error("Erreur récupération banques :", err);
        return res.status(500).json({ erreur: "Erreur lors de la récupération des banques" });
      }
      res.json(results);
    });
  });

  // Ajouter une banque
  router.post('/', (req, res) => {
    const { nomBanque, numeroCompte, devise } = req.body;

    if (!nomBanque || !numeroCompte || !devise) {
      return res.status(400).json({ erreur: "Tous les champs sont obligatoires" });
    }

    banqueService.ajouter(db, nomBanque, numeroCompte, devise, (err, result) => {
      if (err) {
        console.error("Erreur ajout banque :", err);
        return res.status(500).json({ erreur: "Erreur lors de l'ajout de la banque" });
      }
      res.status(201).json({ id: result.insertId, nomBanque, numeroCompte, devise });
    });
  });

  // Modifier une banque (ROUTE PUT)
  router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { nomBanque, numeroCompte, devise } = req.body;

    if (!nomBanque || !numeroCompte || !devise) {
      return res.status(400).json({ erreur: "Tous les champs sont obligatoires" });
    }

    banqueService.modifier(db, id, nomBanque, numeroCompte, devise, (err, result) => {
      if (err) {
        console.error("Erreur modification banque :", err);
        return res.status(500).json({ erreur: "Erreur lors de la modification de la banque" });
      }
      res.json({ message: "Banque modifiée avec succès", id, nomBanque, numeroCompte, devise });
    });
  });

  // Supprimer une banque
  router.delete('/:id', (req, res) => {
    const { id } = req.params;

    banqueService.supprimer(db, id, (err) => {
      if (err) {
        console.error("Erreur suppression banque :", err);
        return res.status(500).json({ erreur: "Erreur lors de la suppression de la banque" });
      }
      res.json({ message: "Banque supprimée avec succès" });
    });
  });

  return router;
};