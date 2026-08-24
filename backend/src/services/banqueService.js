// src/services/banqueService.js
const db = require('./baseDeDonnees'); // Ajuste selon l'export de ton fichier de connexion

const banqueService = {
  // Récupérer toutes les banques
  obtenirToutes: (callback) => {
    const query = 'SELECT * FROM banques ORDER BY id ASC';
    db.query(query, callback);
  },

  // Ajouter une banque
  ajouter: (nomBanque, numeroCompte, devise, callback) => {
    const query = 'INSERT INTO banques (nomBanque, numeroCompte, devise) VALUES (?, ?, ?)';
    db.query(query, [nomBanque, numeroCompte, devise], callback);
  },

  // Supprimer une banque (rupture de contrat)
  supprimer: (id, callback) => {
    const query = 'DELETE FROM banques WHERE id = ?';
    db.query(query, [id], callback);
  }
};

module.exports = banqueService;