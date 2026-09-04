const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

// Importation des services
const banqueService = require('./services/banqueService');
const compteService = require('./services/compteService');
const factureService = require('./services/factureService');

// Importation des routeurs
const clientsRoutes = require('./routes/clientsRoutes');
const facturesRoutes = require('./routes/facturesRoutes');
const banquesRoutes = require('./routes/banquesRoutes');
const compteRoutes = require('./routes/compteRoutes'); // <--- Ajouté ici

const app = express();
const PORT = 5000;

// ==========================================
// MIDDLEWARES
// ==========================================
app.use(cors());
app.use(express.json());

// ==========================================
// CONFIGURATION BASE DE DONNÉES MYSQL
// ==========================================
const dbRoot = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: ''
});

dbRoot.query('CREATE DATABASE IF NOT EXISTS proFactDB', (err) => {
  if (err) {
    console.error('Erreur lors de la création de la base de données proFactDB :', err);
  } else {
    console.log('Base de données proFactDB vérifiée/créée avec succès.');
  }
  dbRoot.end();
});

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'proFactDB'
});

db.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à proFactDB :', err);
    return;
  }
  console.log('Connecté avec succès à la base de données MySQL : proFactDB');

  // Table clients
  const sqlClients = `
    CREATE TABLE IF NOT EXISTS clients (
      id INT PRIMARY KEY,
      matricule VARCHAR(30) NOT NULL,
      nom VARCHAR(100) NOT NULL,
      postNom VARCHAR(100) DEFAULT '',
      prenom VARCHAR(100) NOT NULL,
      bail VARCHAR(50) DEFAULT '',
      dateBail DATE NULL,
      logement VARCHAR(100) DEFAULT '',
      adresse VARCHAR(255) DEFAULT '',
      pays VARCHAR(50) DEFAULT 'RDC',
      designation VARCHAR(255) DEFAULT '',
      typeClient VARCHAR(50) DEFAULT 'locataire',
      typeFacture VARCHAR(50) DEFAULT 'Loyers',
      devise VARCHAR(10) DEFAULT 'USD',
      montant DECIMAL(12,2) DEFAULT 0,
      modePaiement VARCHAR(50) DEFAULT 'Virement',
      moisFacture VARCHAR(20) DEFAULT '',
      debutContrat DATE NULL,
      finContrat DATE NULL,
      dateComptable DATE NULL,
      compteur VARCHAR(50) DEFAULT '',
      imputation VARCHAR(50) DEFAULT '',
      dernierNumero VARCHAR(50) DEFAULT '',
      dernierMontant DECIMAL(12,2) DEFAULT 0,
      derniereDate DATE NULL,
      telephone VARCHAR(50) DEFAULT '',
      email VARCHAR(100) DEFAULT '',
      dateEntree DATE NULL,
      statut VARCHAR(50) DEFAULT 'Actif',
      supprime TINYINT(1) DEFAULT 0,
      enregistre TINYINT(1) DEFAULT 0,
      creeLe DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `;

  db.query(sqlClients, (errCli) => {
    if (errCli) console.error("Erreur lors de la création de la table clients :", errCli);
    else console.log("Table clients vérifiée/créée avec succès.");
  });

  // Table factures
  const sqlFactures = `
    CREATE TABLE IF NOT EXISTS factures (
      id INT AUTO_INCREMENT PRIMARY KEY,
      numero VARCHAR(50) NOT NULL,
      bail VARCHAR(50) DEFAULT NULL,
      dateBail DATE DEFAULT NULL,
      clientCode VARCHAR(50) DEFAULT NULL,
      nomLocataire VARCHAR(150) NOT NULL,
      logement VARCHAR(100) DEFAULT NULL,
      adresse TEXT DEFAULT NULL,
      pays VARCHAR(50) DEFAULT 'RDC',
      designation TEXT DEFAULT NULL,
      typeFacture VARCHAR(50) DEFAULT 'Loyers',
      modePaiement VARCHAR(50) DEFAULT 'Virement',
      reference VARCHAR(100) DEFAULT NULL,
      montant DECIMAL(12,2) NOT NULL DEFAULT 0.00,
      moisFacture VARCHAR(50) DEFAULT NULL,
      anneeFactureChiffre VARCHAR(10) DEFAULT NULL,
      debutContrat DATE DEFAULT NULL,
      finContrat DATE DEFAULT NULL,
      dateComptable DATE DEFAULT NULL,
      compteur VARCHAR(50) DEFAULT NULL,
      imputation VARCHAR(50) DEFAULT NULL,
      dernierNumero VARCHAR(50) DEFAULT NULL,
      dernierMontant DECIMAL(12,2) DEFAULT NULL,
      derniereDate DATE DEFAULT NULL,
      statut VARCHAR(30) DEFAULT 'En attente',
      supprime TINYINT(1) DEFAULT 0,
      creeLe TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  db.query(sqlFactures, (errFac) => {
    if (errFac) console.error("Erreur lors de la création de la table factures :", errFac);
    else console.log("Table factures vérifiée/créée avec succès.");
  });

  // Table banques
  const sqlBanques = `
    CREATE TABLE IF NOT EXISTS banques (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nomBanque VARCHAR(100) NOT NULL,
      numeroCompte VARCHAR(100) NOT NULL,
      devise VARCHAR(10) NOT NULL
    );
  `;

  db.query(sqlBanques, (errBq) => {
    if (errBq) {
      console.error("Erreur lors de la création de la table banques :", errBq);
    } else {
      console.log("Table banques vérifiée/créée avec succès.");
      db.query('SELECT COUNT(*) as count FROM banques', (errCount, resCount) => {
        if (!errCount && resCount[0].count === 0) {
          const banquesInitiales = [
            ['BCDC', 'N° 00011-00130-00000856147-03', 'CDF'],
            ['BCDC', 'N° 00011-00130-00000856151-88', 'USD'],
            ['RAWBANK', 'N° 00016-05130-01002107502-77', 'CDF'],
            ['RAWBANK', 'N° 00016-05130-01002107501-80', 'USD'],
            ['TMB', 'N° 00017-25000-00015000000-87', 'CDF'],
            ['TMB', 'N° 00017-25000-00187750001-35', 'USD']
          ];
          db.query('INSERT INTO banques (nomBanque, numeroCompte, devise) VALUES ?', [banquesInitiales], (errIns) => {
            if (errIns) console.error("Erreur insertion banques par défaut :", errIns);
            else console.log("Banques initiales insérées avec succès.");
          });
        }
      });
    }
  });

  // Table admin
  const sqlAdmin = `
    CREATE TABLE IF NOT EXISTS admin (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nom VARCHAR(100) NOT NULL,
      email VARCHAR(150) NOT NULL UNIQUE,
      motDePasse VARCHAR(255) NOT NULL,
      role VARCHAR(50) DEFAULT 'Administrateur',
      creeLe DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `;

  db.query(sqlAdmin, (errAdmin) => {
    if (errAdmin) {
      console.error("Erreur lors de la création de la table admin :", errAdmin);
    } else {
      console.log("Table admin vérifiée/créée avec succès.");
    }
  });

  // Table facturiers
  const sqlFacturiers = `
    CREATE TABLE IF NOT EXISTS facturiers (
      id INT AUTO_INCREMENT PRIMARY KEY,
      prenom VARCHAR(100) NOT NULL,
      nom VARCHAR(100) NOT NULL,
      email VARCHAR(150) NOT NULL UNIQUE,
      mot_de_passe VARCHAR(255) NOT NULL,
      role VARCHAR(50) DEFAULT 'Facturier',
      creeLe DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `;

  db.query(sqlFacturiers, (errFacturiers) => {
    if (errFacturiers) {
      console.error("Erreur lors de la création de la table facturiers :", errFacturiers);
    } else {
      console.log("Table facturiers vérifiée/créée avec succès.");
    }
  });
});

// ==========================================
// ROUTES DE BASE
// ==========================================
app.get('/', (req, res) => {
  res.send('API proFact en cours de fonctionnement...');
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// ==========================================
// BRANCHEMENT DES ROUTEURS MODULAIRES
// ==========================================
app.use('/api/clients', clientsRoutes(db));
app.use('/api/factures', facturesRoutes(db));
app.use('/api/banques', banquesRoutes(db));
app.use('/api', compteRoutes(db)); // <--- Gère /api/admin, /api/facturiers, etc.

// ==========================================
// ROUTES SPÉCIFIQUES - FACTURES (Électricité & Eau)
// ==========================================
app.get('/api/factures-electricite', (req, res) => {
  factureService.obtenirParType(db, 'Électricité', (err, results) => {
    if (err) {
      console.error("Erreur récupération factures électricité :", err);
      return res.status(500).json({ erreur: "Erreur serveur lors de la récupération des factures d'électricité" });
    }
    res.json(results);
  });
});

app.get('/api/factures-eau', (req, res) => {
  factureService.obtenirParType(db, 'Eau', (err, results) => {
    if (err) {
      console.error("Erreur récupération factures eau :", err);
      return res.status(500).json({ erreur: "Erreur serveur lors de la récupération des factures d'eau" });
    }
    res.json(results);
  });
});

// ==========================================
// DÉMARRAGE DU SERVEUR
// ==========================================
app.listen(PORT, () => {
  console.log(`===========================================`);
  console.log(`Serveur Backend ProFact démarré sur le port ${PORT}`);
  console.log(`URL de l'API : http://localhost:${PORT}`);
  console.log(`===========================================`);
});