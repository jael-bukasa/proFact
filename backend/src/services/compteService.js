const mysql = require('mysql2');

// Connexion à la base de données MySQL proFactDB
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'proFactDB'
});

const compteService = {
  // Vérifier ou insérer un admin
  trouverAdminParEmail: (email, callback) => {
    const query = 'SELECT * FROM admin WHERE email = ?';
    db.query(query, [email], callback);
  },

  insererAdmin: (nom, email, motDePasse, role, callback) => {
    const query = 'INSERT INTO admin (nom, email, motDePasse, role) VALUES (?, ?, ?, ?)';
    db.query(query, [nom, email, motDePasse, role], callback);
  },

  // Gestion des facturiers
  trouverFacturierParEmail: (email, callback) => {
    const query = 'SELECT * FROM facturiers WHERE email = ?';
    db.query(query, [email], callback);
  },

  obtenirTousFacturiers: (callback) => {
    const query = 'SELECT id, prenom, nom, email, role, creeLe FROM facturiers ORDER BY id DESC';
    db.query(query, callback);
  },

  insererFacturier: (prenom, nom, email, motDePasse, role, callback) => {
    const query = 'INSERT INTO facturiers (prenom, nom, email, mot_de_passe, role) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [prenom, nom, email, motDePasse, role], callback);
  },

  supprimerFacturier: (id, callback) => {
    const query = 'DELETE FROM facturiers WHERE id = ?';
    db.query(query, [id], callback);
  }
};

module.exports = compteService;