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
    : `LOC-${String(cli.id).padStart(10, '0')}`;

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

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// 1. Récupérer la CORBEILLE
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

// 2. Récupérer les clients ENREGISTRÉS (enregistre = 1)
app.get('/api/clients/enregistres', (req, res) => {
  const query = 'SELECT * FROM clients WHERE supprime = 0 AND enregistre = 1 ORDER BY id DESC';
  db.query(query, (err, results) => {
    if (err) {
      console.error("Erreur SQL clients enregistrés :", err);
      return res.status(500).json({ erreur: 'Erreur lors de la récupération des clients enregistrés' });
    }
    res.json(results.map(formaterClient));
  });
});

// 3. Récupérer les clients ACTIFS
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

// 4. AJOUTER UN CLIENT
app.post('/api/clients', (req, res) => {
  const { 
    nom = '', 
    postNom = '', 
    prenom = '', 
    bail = '',
    dateBail = null,
    logement = '',
    adresse = '',
    pays = 'RDC',
    designation = '',
    typeClient = 'locataire',
    typeFacture = 'Loyers',
    devise = 'USD',
    montant = 0,
    modePaiement = 'Virement',
    moisFacture = '',
    debutContrat = null,
    finContrat = null,
    dateComptable = null,
    compteur = '',
    imputation = '',
    dernierNumero = '',
    dernierMontant = 0,
    derniereDate = null,
    telephone = '',
    email = '',
    enregistre = false // Récupération dynamique de la valeur envoyée par le frontend
  } = req.body;

  const nomClient = nom.trim() !== '' ? nom : (designation || 'Client');
  const prenomClient = prenom.trim() !== '' ? prenom : '-';

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

    const typeFiltre = (typeFacture || typeClient || '').toLowerCase();
    let prefixe = 'LOC-';
    if (typeFiltre.includes('elect') || typeFiltre.includes('snel') || typeFiltre.includes('elec')) {
      prefixe = 'ELEC-';
    } else if (typeFiltre.includes('eau') || typeFiltre.includes('regideso')) {
      prefixe = 'EAU-';
    } else if (typeFiltre.includes('divers') || typeFiltre.includes('div')) {
      prefixe = 'DIV-';
    } else if (typeFiltre.includes('loyer') || typeFiltre.includes('locat')) {
      prefixe = 'LOC-';
    }

    const matricule = `${prefixe}${String(idDisponible).padStart(10, '0')}`;
    const dateEntree = new Date().toISOString().split('T')[0];
    
    const now = new Date();
    const creeLe = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    const queryInsert = `
      INSERT INTO clients 
      (id, matricule, nom, postNom, prenom, bail, dateBail, logement, adresse, pays, designation, typeClient, typeFacture, devise, montant, modePaiement, moisFacture, debutContrat, finContrat, dateComptable, compteur, imputation, dernierNumero, dernierMontant, derniereDate, telephone, email, dateEntree, statut, supprime, enregistre, creeLe) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const valeurEnregistre = enregistre ? 1 : 0; // Conversion du booléen en 1 ou 0 pour MySQL

    const valeurs = [
      idDisponible, 
      matricule, 
      nomClient, 
      postNom, 
      prenomClient, 
      bail, 
      dateBail || null, 
      logement, 
      adresse, 
      pays, 
      designation, 
      typeClient, 
      typeFacture, 
      devise, 
      Number(montant) || 0, 
      modePaiement, 
      moisFacture, 
      debutContrat || null, 
      finContrat || null, 
      dateComptable || null, 
      compteur, 
      imputation, 
      dernierNumero, 
      Number(dernierMontant) || 0, 
      derniereDate || null, 
      telephone, 
      email, 
      dateEntree, 
      'Actif', 
      0,      // supprime
      valeurEnregistre, // Utilisation de la valeur dynamique
      creeLe   
    ];

    db.query(queryInsert, valeurs, (insertErr) => {
      if (insertErr) {
        console.error("Erreur SQL lors de l'insertion :", insertErr);
        return res.status(500).json({ erreur: "Erreur lors de l'enregistrement dans MySQL : " + insertErr.message });
      }

      const clientCree = formaterClient({
        id: idDisponible,
        matricule,
        nom: nomClient,
        postNom,
        prenom: prenomClient,
        bail,
        dateBail,
        logement,
        adresse,
        pays,
        designation,
        typeClient,
        typeFacture,
        devise,
        montant,
        modePaiement,
        moisFacture,
        debutContrat,
        finContrat,
        dateComptable,
        compteur,
        imputation,
        dernierNumero,
        dernierMontant,
        derniereDate,
        telephone,
        email,
        dateEntree,
        statut: 'Actif',
        supprime: 0,
        enregistre: valeurEnregistre,
        creeLe
      });

      res.status(201).json(clientCree);
    });
  });
});

// 5. VALIDER / ENREGISTRER UN CLIENT (passe enregistre à 1)
app.patch('/api/clients/:id/valider', (req, res) => {
  const { id } = req.params;
  const query = 'UPDATE clients SET enregistre = 1 WHERE id = ?';

  db.query(query, [id], (err) => {
    if (err) {
      console.error("Erreur SQL lors de la validation du client :", err);
      return res.status(500).json({ erreur: "Erreur lors de l'enregistrement du client" });
    }
    res.json({ message: "Client enregistré avec succès" });
  });
});

// 6. Modifier un client (PUT)
app.put('/api/clients/:id', (req, res) => {
  const { id } = req.params;
  const { 
    nom, postNom, prenom, bail, dateBail, logement, adresse, pays, designation, 
    typeClient, typeFacture, devise, montant, modePaiement, moisFacture, 
    debutContrat, finContrat, dateComptable, compteur, imputation, 
    dernierNumero, dernierMontant, derniereDate, telephone, email 
  } = req.body;

  const query = `
    UPDATE clients 
    SET nom = ?, postNom = ?, prenom = ?, bail = ?, dateBail = ?, logement = ?, adresse = ?, pays = ?, designation = ?, typeClient = ?, typeFacture = ?, devise = ?, montant = ?, modePaiement = ?, moisFacture = ?, debutContrat = ?, finContrat = ?, dateComptable = ?, compteur = ?, imputation = ?, dernierNumero = ?, dernierMontant = ?, derniereDate = ?, telephone = ?, email = ?
    WHERE id = ?
  `;

  const valeurs = [
    nom, postNom, prenom, bail, dateBail || null, logement, adresse, pays, designation, 
    typeClient, typeFacture, devise, montant || 0, modePaiement, moisFacture, 
    debutContrat || null, finContrat || null, dateComptable || null, compteur, imputation, 
    dernierNumero, dernierMontant || 0, derniereDate || null, telephone, email, id
  ];

  db.query(query, valeurs, (err) => {
    if (err) {
      console.error("Erreur SQL lors de la modification :", err);
      return res.status(500).json({ erreur: "Erreur lors de la modification" });
    }
    res.json({ message: "Client modifié avec succès" });
  });
});

// 7. RESTAURER un client (PATCH)
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

// 8. VIDER LA CORBEILLE
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

// 9. SUPPRESSION DÉFINITIVE D'UN CLIENT
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

// 10. ENVOYER EN CORBEILLE (Soft Delete)
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