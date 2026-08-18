const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

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
// 1. Connexion initiale au serveur MySQL pour garantir la création de la BDD
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

// 2. Connexion principale à proFactDB
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

  // Création automatique de la table clients
  const sqlClients = `
    CREATE TABLE IF NOT EXISTS clients (
      id INT PRIMARY KEY,
      matricule VARCHAR(30) NOT NULL,
      nom VARCHAR(100) NOT NULL,
      postNom VARCHAR(100) DEFAULT '',
      prenom VARCHAR(100) NOT NULL,
      typeClient VARCHAR(50) DEFAULT 'locataire',
      devise VARCHAR(10) DEFAULT 'USD',
      telephone VARCHAR(50) DEFAULT '',
      email VARCHAR(100) DEFAULT '',
      logement VARCHAR(100) DEFAULT '',
      adresse VARCHAR(255) DEFAULT '',
      dateEntree DATE,
      statut VARCHAR(50) DEFAULT 'Actif',
      supprime TINYINT(1) DEFAULT 0,
      creeLe DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const sqlFactures = `
    CREATE TABLE IF NOT EXISTS factures (
      id INT AUTO_INCREMENT PRIMARY KEY,
      numeroFacture VARCHAR(50) NOT NULL UNIQUE,
      clientId INT NOT NULL,
      montantTotal DECIMAL(10, 2) NOT NULL,
      statut VARCHAR(50) DEFAULT 'Non payée',
      dateEcheance DATE,
      supprime TINYINT(1) DEFAULT 0,
      creeLe DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `;

  db.query(sqlClients, (errCli) => {
    if (errCli) console.error("Erreur lors de la création de la table clients :", errCli);
  });

  db.query(sqlFactures, (errFac) => {
    if (errFac) console.error("Erreur lors de la création de la table factures :", errFac);
  });
});

// ==========================================
// FONCTIONS UTILITAIRES DE FORMATAGE
// ==========================================
const formaterClient = (cli) => {
  let dateEnregistrement = '';
  let heure = '';

  if (cli.creeLe) {
    const d = new Date(cli.creeLe);
    if (!isNaN(d.getTime())) {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      const seconds = String(d.getSeconds()).padStart(2, '0');

      dateEnregistrement = `${year}-${month}-${day}`;
      heure = `${hours}:${minutes}:${seconds}`;
    } else {
      const parts = String(cli.creeLe).split(' ');
      dateEnregistrement = parts[0] || '';
      heure = parts[1] || '';
    }
  }

  const matricule = cli.matricule && cli.matricule !== 'TEMP'
    ? cli.matricule
    : `LOY-${String(cli.id).padStart(10, '0')}`;

  return {
    ...cli,
    matricule,
    dateEnregistrement,
    heure
  };
};

// ==========================================
// ROUTES API
// ==========================================

app.get('/', (req, res) => {
  res.send('API proFact en cours de fonctionnement...');
});

// Route de santé pour le composant VoyantSignal de React
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// 1. Récupérer la CORBEILLE (Doit être avant toute route avec :id)
app.get('/api/clients/corbeille', (req, res) => {
  const query = 'SELECT * FROM clients WHERE supprime = 1 ORDER BY id ASC';
  db.query(query, (err, results) => {
    if (err) {
      console.error("Erreur SQL corbeille :", err);
      return res.status(500).json({ erreur: 'Erreur lors de la récupération de la corbeille' });
    }
    res.json(results.map(formaterClient));
  });
});

// 2. Récupérer les clients ACTIFS
app.get('/api/clients', (req, res) => {
  const query = 'SELECT * FROM clients WHERE supprime = 0 ORDER BY id ASC';
  db.query(query, (err, results) => {
    if (err) {
      console.error("Erreur SQL clients :", err);
      return res.status(500).json({ erreur: 'Erreur lors de la récupération des clients' });
    }
    res.json(results.map(formaterClient));
  });
});

// 3. AJOUTER UN CLIENT
app.post('/api/clients', (req, res) => {
  const { 
    nom, 
    postNom = '', 
    prenom = '', 
    typeClient = 'locataire', 
    devise = 'USD', 
    telephone = '', 
    email = '', 
    logement = '', 
    adresse = '' 
  } = req.body;

  if (!nom || !prenom) {
    return res.status(400).json({ erreur: "Le nom et le prénom sont obligatoires." });
  }

  // Sélection de TOUS les IDs (actifs + corbeille) pour éviter tout conflit de clé primaire
  const queryAllIds = 'SELECT id FROM clients ORDER BY id ASC';

  db.query(queryAllIds, (err, results) => {
    if (err) {
      console.error("Erreur lors du calcul de l'ID libre :", err);
      return res.status(500).json({ erreur: "Erreur serveur lors de la préparation de l'ID" });
    }

    const idsUtilises = new Set(results.map(r => r.id));
    let idDisponible = 1;
    while (idsUtilises.has(idDisponible)) {
      idDisponible++;
    }

    // Calcul du préfixe selon le type
    let prefixe = 'LOY-';
    if (typeClient === 'electricite') prefixe = 'ELE-';
    else if (typeClient === 'eau') prefixe = 'EAU-';
    else if (typeClient === 'divers') prefixe = 'DIV-';
    else if (typeClient === 'locataire' && devise === 'CDF') prefixe = 'LY-';

    const matricule = `${prefixe}${String(idDisponible).padStart(10, '0')}`;
    const dateEntree = new Date().toISOString().split('T')[0];
    
    // Date locale propre pour MySQL DATETIME
    const now = new Date();
    const creeLe = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    const queryInsert = `
      INSERT INTO clients 
      (id, matricule, nom, postNom, prenom, typeClient, devise, telephone, email, logement, adresse, dateEntree, statut, supprime, creeLe) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Actif', 0, ?)
    `;

    const valeurs = [
      idDisponible, 
      matricule, 
      nom, 
      postNom, 
      prenom, 
      typeClient, 
      devise, 
      telephone, 
      email, 
      logement, 
      adresse, 
      dateEntree, 
      creeLe
    ];

    db.query(queryInsert, valeurs, (insertErr) => {
      if (insertErr) {
        console.error("Erreur SQL lors de l'insertion :", insertErr);
        return res.status(500).json({ erreur: "Erreur lors de l'enregistrement dans MySQL" });
      }

      const clientCree = formaterClient({
        id: idDisponible,
        matricule,
        nom,
        postNom,
        prenom,
        typeClient,
        devise,
        telephone,
        email,
        logement,
        adresse,
        dateEntree,
        statut: 'Actif',
        supprime: 0,
        creeLe
      });

      res.status(201).json(clientCree);
    });
  });
});

// 4. Modifier un client (PUT)
app.put('/api/clients/:id', (req, res) => {
  const { id } = req.params;
  const { nom, postNom, prenom, typeClient, devise, telephone, email, logement, adresse } = req.body;

  const query = `
    UPDATE clients 
    SET nom = ?, postNom = ?, prenom = ?, typeClient = ?, devise = ?, telephone = ?, email = ?, logement = ?, adresse = ? 
    WHERE id = ?
  `;

  db.query(query, [nom, postNom, prenom, typeClient, devise, telephone, email, logement, adresse, id], (err) => {
    if (err) {
      console.error("Erreur SQL lors de la modification :", err);
      return res.status(500).json({ erreur: "Erreur lors de la modification" });
    }
    res.json({ message: "Client modifié avec succès" });
  });
});

// 5. RESTAURER un client (Placé AVANT les suppresions génériques par :id)
app.patch('/api/clients/:id/restaurer', (req, res) => {
  const { id } = req.params;
  const restoreQuery = 'UPDATE clients SET supprime = 0 WHERE id = ?';

  db.query(restoreQuery, [id], (errRestore) => {
    if (errRestore) {
      console.error("Erreur lors de la restauration :", errRestore);
      return res.status(500).json({ erreur: "Erreur lors de la restauration" });
    }
    res.json({ message: "Client restauré avec succès" });
  });
});

// 6. VIDER LA CORBEILLE (⚠️ Doit impérativement être AVANT DELETE /api/clients/:id)
app.delete('/api/clients/corbeille/vider', (req, res) => {
  const query = 'DELETE FROM clients WHERE supprime = 1';

  db.query(query, (err) => {
    if (err) {
      console.error("Erreur SQL lors du vidage de la corbeille :", err);
      return res.status(500).json({ erreur: "Erreur lors du vidage de la corbeille" });
    }
    res.json({ message: "Corbeille vidée avec succès" });
  });
});

// 7. SUPPRESSION DÉFINITIVE D'UN CLIENT (Depuis la corbeille)
app.delete('/api/clients/:id/definitif', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM clients WHERE id = ?';

  db.query(query, [id], (err) => {
    if (err) {
      console.error("Erreur SQL lors de la suppression définitive :", err);
      return res.status(500).json({ erreur: "Erreur lors de la suppression définitive" });
    }
    res.json({ message: "Client supprimé définitivement de la base de données" });
  });
});

// 8. ENVOYER EN CORBEILLE (Soft Delete)
// Cette route générique /:id est placée en DERNIER parmi les DELETE
app.delete('/api/clients/:id', (req, res) => {
  const { id } = req.params;
  const query = 'UPDATE clients SET supprime = 1 WHERE id = ?';

  db.query(query, [id], (err) => {
    if (err) {
      console.error("Erreur SQL lors du déplacement en corbeille :", err);
      return res.status(500).json({ erreur: "Erreur lors de la mise en corbeille" });
    }
    res.json({ message: "Client placé dans la corbeille" });
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