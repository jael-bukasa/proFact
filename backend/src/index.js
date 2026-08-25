const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

// Importation du service de gestion des banques
const banqueService = require('./services/banqueService');

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

  let matricule = cli.matricule;
  if (!matricule || matricule === 'TEMP' || matricule.startsWith('LOC-') || matricule.startsWith('LOY-') || matricule.startsWith('LY-') || matricule.startsWith('ELE-') || matricule.startsWith('ELEC-') || matricule.startsWith('EAU-') || matricule.startsWith('DIV-')) {
    const typeFiltre = ((cli.typeFacture || '') + ' ' + (cli.typeClient || ''))
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

    let prefixe = 'LOY-';

    if (typeFiltre.includes('elect') || typeFiltre.includes('snel')) {
      prefixe = 'ELE-';
    } else if (typeFiltre.includes('eau') || typeFiltre.includes('regideso')) {
      prefixe = 'EAU-';
    } else if (typeFiltre.includes('divers') || typeFiltre.includes('div')) {
      prefixe = 'DIV-';
    } else if (typeFiltre.includes('locat') || typeFiltre.includes('loyer')) {
      prefixe = (cli.devise === 'CDF') ? 'LY-' : 'LOY-';
    }

    matricule = `${prefixe}${String(cli.id || 1).padStart(10, '0')}`;
  }

  return {
    ...cli,
    matricule,
    dateEnregistrement,
    heure
  };
};

// ==========================================
// ROUTES API - CLIENTS
// ==========================================

app.get('/', (req, res) => {
  res.send('API proFact en cours de fonctionnement...');
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

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

app.post('/api/clients', (req, res) => {
  const { 
    nom = '', postNom = '', prenom = '', bail = '', dateBail = null,
    logement = '', adresse = '', pays = 'RDC', designation = '',
    typeClient = 'locataire', typeFacture = 'Loyers', devise = 'USD',
    montant = 0, modePaiement = 'Virement', moisFacture = '',
    debutContrat = null, finContrat = null, dateComptable = null,
    compteur = '', imputation = '', dernierNumero = '', dernierMontant = 0,
    derniereDate = null, telephone = '', email = '', enregistre = false 
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

    const typeFiltre = ((typeFacture || '') + ' ' + (typeClient || ''))
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

    let prefixe = 'LOY-';

    if (typeFiltre.includes('elect') || typeFiltre.includes('snel')) {
      prefixe = 'ELE-';
    } else if (typeFiltre.includes('eau') || typeFiltre.includes('regideso')) {
      prefixe = 'EAU-';
    } else if (typeFiltre.includes('divers') || typeFiltre.includes('div')) {
      prefixe = 'DIV-';
    } else if (typeFiltre.includes('locat') || typeFiltre.includes('loyer')) {
      prefixe = (devise === 'CDF') ? 'LY-' : 'LOY-';
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

    const valeurEnregistre = enregistre ? 1 : 0;

    const valeurs = [
      idDisponible, matricule, nomClient, postNom, prenomClient, bail, dateBail || null,
      logement, adresse, pays, designation, typeClient, typeFacture, devise,
      Number(montant) || 0, modePaiement, moisFacture, debutContrat || null,
      finContrat || null, dateComptable || null, compteur, imputation,
      dernierNumero, Number(dernierMontant) || 0, derniereDate || null,
      telephone, email, dateEntree, 'Actif', 0, valeurEnregistre, creeLe  
    ];

    db.query(queryInsert, valeurs, (insertErr) => {
      if (insertErr) {
        console.error("Erreur SQL lors de l'insertion :", insertErr);
        return res.status(500).json({ erreur: "Erreur lors de l'enregistrement dans MySQL : " + insertErr.message });
      }

      const clientCree = formaterClient({
        id: idDisponible, matricule, nom: nomClient, postNom, prenom: prenomClient,
        bail, dateBail, logement, adresse, pays, designation, typeClient,
        typeFacture, devise, montant, modePaiement, moisFacture, debutContrat,
        finContrat, dateComptable, compteur, imputation, dernierNumero,
        dernierMontant, derniereDate, telephone, email, dateEntree,
        statut: 'Actif', supprime: 0, enregistre: valeurEnregistre, creeLe
      });

      res.status(201).json(clientCree);
    });
  });
});

app.patch('/api/clients/:id/valider', (req, res) => {
  const { id } = req.params;
  const query = 'UPDATE clients SET enregistre = 1 WHERE id = ?';

  db.query(query, [id], (err) => {
    if (err) return res.status(500).json({ erreur: "Erreur lors de l'enregistrement du client" });
    res.json({ message: "Client enregistré avec succès" });
  });
});

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
    if (err) return res.status(500).json({ erreur: "Erreur lors de la modification" });
    res.json({ message: "Client modifié avec succès" });
  });
});

app.patch('/api/clients/:id/restaurer', (req, res) => {
  const { id } = req.params;
  db.query('UPDATE clients SET supprime = 0 WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ erreur: "Erreur lors de la restauration" });
    res.json({ message: "Client restauré avec succès" });
  });
});

app.delete('/api/clients/corbeille/vider', (req, res) => {
  db.query('DELETE FROM clients WHERE supprime = 1', (err) => {
    if (err) return res.status(500).json({ erreur: "Erreur lors du vidage de la corbeille" });
    res.json({ message: "Corbeille vidée avec succès" });
  });
});

app.delete('/api/clients/:id/definitif', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM clients WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ erreur: "Erreur lors de la suppression définitive" });
    res.json({ message: "Client supprimé définitivement" });
  });
});

app.delete('/api/clients/:id', (req, res) => {
  const { id } = req.params;
  db.query('UPDATE clients SET supprime = 1 WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ erreur: "Erreur lors de la mise en corbeille" });
    res.json({ message: "Client placé dans la corbeille" });
  });
});

// ==========================================
// ROUTES API - BANQUES
// ==========================================

app.get('/api/banques', (req, res) => {
  banqueService.obtenirToutes((err, results) => {
    if (err) {
      console.error("Erreur récupération banques :", err);
      return res.status(500).json({ erreur: "Erreur lors de la récupération des banques" });
    }
    res.json(results);
  });
});

app.post('/api/banques', (req, res) => {
  const { nomBanque, numeroCompte, devise } = req.body;

  if (!nomBanque || !numeroCompte || !devise) {
    return res.status(400).json({ erreur: "Tous les champs sont obligatoires" });
  }

  banqueService.ajouter(nomBanque, numeroCompte, devise, (err, result) => {
    if (err) {
      console.error("Erreur ajout banque :", err);
      return res.status(500).json({ erreur: "Erreur lors de l'ajout de la banque" });
    }
    res.status(201).json({ id: result.insertId, nomBanque, numeroCompte, devise });
  });
});

app.delete('/api/banques/:id', (req, res) => {
  const { id } = req.params;

  banqueService.supprimer(id, (err) => {
    if (err) {
      console.error("Erreur suppression banque :", err);
      return res.status(500).json({ erreur: "Erreur lors de la suppression de la banque" });
    }
    res.json({ message: "Banque supprimée avec succès" });
  });
});

// ==========================================
// ROUTES API - ADMIN / AUTHENTIFICATION
// ==========================================

app.post('/api/admin/inscription', (req, res) => {
  const { nom, email, motDePasse, role = 'Administrateur' } = req.body;

  if (!nom || !email || !motDePasse) {
    return res.status(400).json({ erreur: "Tous les champs obligatoires doivent être remplis." });
  }

  db.query('SELECT * FROM admin WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error("Erreur SQL vérification email :", err);
      return res.status(500).json({ erreur: "Erreur serveur lors de la vérification de l'email." });
    }

    if (results.length > 0) {
      return res.status(400).json({ erreur: "Cet email est déjà utilisé par un autre administrateur." });
    }

    const queryInsert = 'INSERT INTO admin (nom, email, motDePasse, role) VALUES (?, ?, ?, ?)';
    db.query(queryInsert, [nom, email, motDePasse, role], (errInsert, resultat) => {
      if (errInsert) {
        console.error("Erreur lors de l'inscription admin :", errInsert);
        return res.status(500).json({ erreur: "Erreur lors de la création du compte administrateur." });
      }

      res.status(201).json({
        message: "Compte administrateur créé avec succès.",
        admin: {
          id: resultat.insertId,
          nom,
          email,
          role
        }
      });
    });
  });
});

// Route de connexion unifiée (Administrateur & Facturier)
app.post('/api/admin/connexion', (req, res) => {
  const { email, motDePasse, role } = req.body;

  if (!email || !motDePasse) {
    return res.status(400).json({ erreur: "L'email et le mot de passe sont requis." });
  }

  const emailPropre = email.trim();
  const roleNormalise = role ? role.trim().toLowerCase() : '';

  if (roleNormalise === 'facturier') {
    db.query('SELECT * FROM facturiers WHERE email = ?', [emailPropre], (err, results) => {
      if (err) {
        console.error("Erreur SQL connexion facturier :", err);
        return res.status(500).json({ erreur: "Erreur serveur lors de la connexion." });
      }

      if (results.length === 0) {
        return res.status(404).json({ erreur: "Facturier introuvable avec cet email." });
      }

      const facturier = results[0];

      if (facturier.mot_de_passe !== motDePasse) {
        return res.status(401).json({ erreur: "Mot de passe incorrect." });
      }

      res.json({
        message: "Connexion réussie",
        admin: {
          id: facturier.id,
          nom: facturier.nom,
          prenom: facturier.prenom || '',
          email: facturier.email,
          role: facturier.role || 'Facturier'
        }
      });
    });
  } 
  else {
    db.query('SELECT * FROM admin WHERE email = ?', [emailPropre], (err, results) => {
      if (err) {
        console.error("Erreur SQL connexion admin :", err);
        return res.status(500).json({ erreur: "Erreur serveur lors de la connexion." });
      }

      if (results.length === 0) {
        return res.status(404).json({ erreur: "Administrateur introuvable avec cet email." });
      }

      const admin = results[0];

      if (admin.motDePasse !== motDePasse) {
        return res.status(401).json({ erreur: "Mot de passe incorrect." });
      }

      res.json({
        message: "Connexion réussie",
        admin: {
          id: admin.id,
          nom: admin.nom,
          email: admin.email,
          role: admin.role || 'Administrateur'
        }
      });
    });
  }
});

// ==========================================
// ROUTES API - FACTURIERS
// ==========================================

app.get('/api/facturiers', (req, res) => {
  const query = 'SELECT id, prenom, nom, email, role, creeLe FROM facturiers ORDER BY id DESC';
  db.query(query, (err, results) => {
    if (err) {
      console.error("Erreur SQL récupération facturiers :", err);
      return res.status(500).json({ erreur: "Erreur lors de la récupération des facturiers." });
    }
    res.json(results);
  });
});

app.post('/api/facturiers', (req, res) => {
  const { prenom, nom, email, motDePasse, role = 'Facturier' } = req.body;

  if (!prenom || !nom || !email || !motDePasse) {
    return res.status(400).json({ erreur: "Tous les champs obligatoires doivent être remplis." });
  }

  const emailPropre = email.trim();

  db.query('SELECT * FROM facturiers WHERE email = ?', [emailPropre], (err, results) => {
    if (err) {
      console.error("Erreur SQL vérification email facturier :", err);
      return res.status(500).json({ erreur: "Erreur serveur lors de la vérification de l'email." });
    }

    if (results.length > 0) {
      return res.status(400).json({ erreur: "Cette adresse e-mail est déjà utilisée." });
    }

    const queryInsert = 'INSERT INTO facturiers (prenom, nom, email, mot_de_passe, role) VALUES (?, ?, ?, ?, ?)';
    db.query(queryInsert, [prenom.trim(), nom.trim(), emailPropre, motDePasse, role], (errInsert, resultat) => {
      if (errInsert) {
        console.error("Erreur lors de l'insertion du facturier :", errInsert);
        return res.status(500).json({ erreur: "Erreur lors de la création du compte facturier." });
      }

      res.status(201).json({
        success: true,
        message: "Compte facturier créé avec succès.",
        data: {
          id: resultat.insertId,
          prenom: prenom.trim(),
          nom: nom.trim(),
          email: emailPropre,
          role
        }
      });
    });
  });
});

app.delete('/api/facturiers/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM facturiers WHERE id = ?', [id], (err) => {
    if (err) {
      console.error("Erreur suppression facturier :", err);
      return res.status(500).json({ erreur: "Erreur lors de la suppression du facturier" });
    }
    res.json({ message: "Facturier supprimé avec succès" });
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