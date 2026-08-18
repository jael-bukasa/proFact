const Database = require('better-sqlite3');
const path = require('path');

// Connexion à la base SQLite profact.db
const bdd = new Database(path.join(__dirname, '../profact.db'));

function initialiserBaseDeDonnees() {
  bdd.exec(`
    CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      matricule TEXT,
      typeClient TEXT DEFAULT 'locataire',
      nom TEXT NOT NULL,
      postNom TEXT DEFAULT '',
      prenom TEXT DEFAULT '',
      telephone TEXT DEFAULT '',
      email TEXT DEFAULT '',
      logement TEXT DEFAULT '',
      adresse TEXT DEFAULT '',
      devise TEXT DEFAULT 'USD',
      statut TEXT DEFAULT 'actif',
      est_supprime INTEGER DEFAULT 0,
      cree_le DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

// Initialisation au chargement
initialiserBaseDeDonnees();

// Helper pour adapter les champs SQLite aux attentes de React / Express
const formaterClient = (cli) => {
  if (!cli) return null;
  return {
    ...cli,
    supprime: cli.est_supprime,
    creeLe: cli.cree_le,
    dateEnregistrement: cli.cree_le ? cli.cree_le.split(' ')[0] : '',
    matricule: cli.matricule || `LOY-${String(cli.id).padStart(10, '0')}`
  };
};

// Opérations CRUD
const serviceClients = {
  obtenirTous: () => {
    const rows = bdd.prepare('SELECT * FROM clients ORDER BY id DESC').all();
    return rows.map(formaterClient);
  },

  obtenirActifs: () => {
    const rows = bdd.prepare('SELECT * FROM clients WHERE est_supprime = 0 ORDER BY id DESC').all();
    return rows.map(formaterClient);
  },

  obtenirCorbeille: () => {
    const rows = bdd.prepare('SELECT * FROM clients WHERE est_supprime = 1 ORDER BY id DESC').all();
    return rows.map(formaterClient);
  },

  obtenirParId: (id) => {
    const row = bdd.prepare('SELECT * FROM clients WHERE id = ?').get(id);
    return formaterClient(row);
  },

  ajouter: (donnees) => {
    const requete = bdd.prepare(`
      INSERT INTO clients (
        matricule, typeClient, nom, postNom, prenom, 
        telephone, email, logement, adresse, devise, statut, est_supprime
      )
      VALUES (
        @matricule, @typeClient, @nom, @postNom, @prenom, 
        @telephone, @email, @logement, @adresse, @devise, @statut, 0
      )
    `);

    // 1. Insertion en base de données
    const result = requete.run({
      matricule: donnees.matricule || null,
      typeClient: donnees.typeClient || 'locataire',
      nom: donnees.nom || '',
      postNom: donnees.postNom || '',
      prenom: donnees.prenom || '',
      telephone: donnees.telephone || '',
      email: donnees.email || '',
      logement: donnees.logement || '',
      adresse: donnees.adresse || '',
      devise: donnees.devise || 'USD',
      statut: donnees.statut || 'actif'
    });

    const nouvelId = result.lastInsertRowid;

    // 2. Génération automatique d'un matricule propre si non fourni
    if (!donnees.matricule) {
      const prefixe = donnees.typeClient === 'electricite' ? 'ELE-' : donnees.typeClient === 'eau' ? 'EAU-' : 'LOY-';
      const matriculeAuto = `${prefixe}${String(nouvelId).padStart(10, '0')}`;
      bdd.prepare('UPDATE clients SET matricule = ? WHERE id = ?').run(matriculeAuto, nouvelId);
    }

    // 3. RENVOIE LE CLIENT COMPLET CRÉÉ (Fix du problème React)
    return serviceClients.obtenirParId(nouvelId);
  },

  modifier: (id, donnees) => {
    const requete = bdd.prepare(`
      UPDATE clients 
      SET nom = @nom, postNom = @postNom, prenom = @prenom,
          telephone = @telephone, email = @email, logement = @logement, 
          adresse = @adresse, typeClient = @typeClient, devise = @devise, statut = @statut
      WHERE id = @id
    `);

    requete.run({
      id: id,
      nom: donnees.nom || '',
      postNom: donnees.postNom || '',
      prenom: donnees.prenom || '',
      telephone: donnees.telephone || '',
      email: donnees.email || '',
      logement: donnees.logement || '',
      adresse: donnees.adresse || '',
      typeClient: donnees.typeClient || 'locataire',
      devise: donnees.devise || 'USD',
      statut: donnees.statut || 'actif'
    });

    return serviceClients.obtenirParId(id);
  },

  mettreEnCorbeille: (id) => {
    bdd.prepare('UPDATE clients SET est_supprime = 1 WHERE id = ?').run(id);
    return { success: true };
  },

  restaurer: (id) => {
    bdd.prepare('UPDATE clients SET est_supprime = 0 WHERE id = ?').run(id);
    return { success: true };
  },

  supprimerDefinitivement: (id) => {
    bdd.prepare('DELETE FROM clients WHERE id = ?').run(id);
    return { success: true };
  },

  viderCorbeille: () => {
    bdd.prepare('DELETE FROM clients WHERE est_supprime = 1').run();
    return { success: true };
  }
};

module.exports = {
  initialiserBaseDeDonnees,
  serviceClients,
  serviceLocataires: serviceClients 
};