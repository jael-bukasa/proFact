// src/services/banqueService.js

const banqueService = {
  // Récupérer toutes les banques
  obtenirToutes: (db, callback) => {
    const query = 'SELECT * FROM banques ORDER BY id ASC';
    db.query(query, callback);
  },

  // Ajouter une banque
  ajouter: (db, nomBanque, numeroCompte, devise, callback) => {
    const query = 'INSERT INTO banques (nomBanque, numeroCompte, devise) VALUES (?, ?, ?)';
    db.query(query, [nomBanque, numeroCompte, devise], callback);
  },

  // Modifier une banque (Indispensable pour que le bouton de modification fonctionne)
  modifier: (db, id, nomBanque, numeroCompte, devise, callback) => {
    const query = 'UPDATE banques SET nomBanque = ?, numeroCompte = ?, devise = ? WHERE id = ?';
    db.query(query, [nomBanque, numeroCompte, devise, id], callback);
  },

  // Supprimer une banque
  supprimer: (db, id, callback) => {
    const query = 'DELETE FROM banques WHERE id = ?';
    db.query(query, [id], callback);
  }
};

module.exports = banqueService;