// src/services/compteService.js

const compteService = {
  // Vérifier ou trouver un admin par email
  trouverAdminParEmail: (db, email, callback) => {
    const query = 'SELECT * FROM admin WHERE email = ?';
    db.query(query, [email], callback);
  },

  // Insérer un nouvel administrateur
  insererAdmin: (db, nom, email, motDePasse, role, callback) => {
    const query = 'INSERT INTO admin (nom, email, motDePasse, role) VALUES (?, ?, ?, ?)';
    db.query(query, [nom, email, motDePasse, role], callback);
  },

  // Trouver un facturier par email
  trouverFacturierParEmail: (db, email, callback) => {
    const query = 'SELECT * FROM facturiers WHERE email = ?';
    db.query(query, [email], callback);
  },

  // Récupérer tous les facturiers (Alias de mot_de_passe en motDePasse pour le frontend)
  obtenirTousFacturiers: (db, callback) => {
    const query = "SELECT id, prenom, nom, email, role, mot_de_passe AS motDePasse, cree_le AS creeLe, 'Facturier' as typeRole FROM facturiers ORDER BY id DESC";
    db.query(query, callback);
  },

  // Insérer un nouveau facturier
  insererFacturier: (db, prenom, nom, email, motDePasse, role, callback) => {
    const query = 'INSERT INTO facturiers (prenom, nom, email, mot_de_passe, role) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [prenom, nom, email, motDePasse, role], callback);
  },

  // Supprimer un facturier
  supprimerFacturier: (db, id, callback) => {
    const query = 'DELETE FROM facturiers WHERE id = ?';
    db.query(query, [id], callback);
  },

  // Mettre à jour un facturier (met à jour le mot de passe seulement s'il est fourni)
  mettreAJourFacturier: (db, id, prenom, nom, postnom, email, role, nouveauMotDePasse, callback) => {
    let query = 'UPDATE facturiers SET prenom = ?, nom = ?, postnom = ?, email = ?, role = ?';
    let params = [prenom, nom, postnom, email, role];

    if (nouveauMotDePasse && nouveauMotDePasse.trim() !== '') {
      query += ', mot_de_passe = ?';
      params.push(nouveauMotDePasse);
    }

    query += ' WHERE id = ?';
    params.push(id);

    db.query(query, params, callback);
  },

  // Mettre à jour un admin (met à jour le mot de passe seulement s'il est fourni)
  mettreAJourAdmin: (db, id, nomComplet, email, role, nouveauMotDePasse, callback) => {
    let query = 'UPDATE admin SET nom = ?, email = ?, role = ?';
    let params = [nomComplet, email, role];

    if (nouveauMotDePasse && nouveauMotDePasse.trim() !== '') {
      query += ', motDePasse = ?';
      params.push(nouveauMotDePasse);
    }

    query += ' WHERE id = ?';
    params.push(id);

    db.query(query, params, callback);
  }
};

module.exports = compteService;