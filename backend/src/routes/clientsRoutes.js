const express = require('express');
const router = express.Router();

// Fonction utilitaire de formatage
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
  if (!matricule || matricule === 'TEMP' || matricule.startsWith('LOC-') || matricule.startsWith('LOY-') || matricule.startsWith('LY-') || matricule.startsWith('ELE-') || matricule.startsWith('ELEC-') || matricule.startsWith('EAU-') || matricule.startsWith('DIV-') || matricule.startsWith('PR-')) {
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
    } else if (typeFiltre.includes('proprio') || typeFiltre.includes('proprietaire')) {
      prefixe = 'PR-';
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

// Fonction utilitaire pour nettoyer les dates vides ou erronées
const nettoyerDate = (valeur) => {
  if (!valeur || valeur === '' || valeur === 'jj/mm/aaaa' || String(valeur).includes('111')) {
    return null;
  }
  return valeur;
};

module.exports = (db) => {

  // Route pour obtenir le prochain numéro indépendant selon le préfixe/type
  router.get('/prochain-id', (req, res) => {
    const typeClientReq = req.query.type || 'locataire';
    const typeFactureReq = req.query.typeFacture || '';
    const deviseReq = req.query.devise || 'USD';

    const typeFiltre = ((typeFactureReq) + ' ' + (typeClientReq))
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

    let prefixeCible = 'LOY-';
    if (typeFiltre.includes('elect') || typeFiltre.includes('snel')) {
      prefixeCible = 'ELE-';
    } else if (typeFiltre.includes('eau') || typeFiltre.includes('regideso')) {
      prefixeCible = 'EAU-';
    } else if (typeFiltre.includes('divers') || typeFiltre.includes('div')) {
      prefixeCible = 'DIV-';
    } else if (typeFiltre.includes('proprio') || typeFiltre.includes('proprietaire')) {
      prefixeCible = 'PR-';
    } else if (typeFiltre.includes('locat') || typeFiltre.includes('loyer')) {
      prefixeCible = (deviseReq === 'CDF') ? 'LY-' : 'LOY-';
    }

    const queryAll = 'SELECT matricule FROM clients';
    db.query(queryAll, (err, results) => {
      if (err) {
        console.error("Erreur lors du calcul du prochain ID par type :", err);
        return res.status(500).json({ erreur: "Erreur serveur" });
      }

      let maxNumero = 0;
      results.forEach(row => {
        if (row.matricule && row.matricule.startsWith(prefixeCible)) {
          const partieNumerique = parseInt(row.matricule.replace(prefixeCible, ''), 10);
          if (!isNaN(partieNumerique) && partieNumerique > maxNumero) {
            maxNumero = partieNumerique;
          }
        }
      });

      const prochainId = maxNumero + 1;
      res.json({ id: prochainId, prefixe: prefixeCible });
    });
  });

  // Récupérer la corbeille
  router.get('/corbeille', (req, res) => {
    const query = 'SELECT * FROM clients WHERE supprime = 1 ORDER BY id ASC';
    db.query(query, (err, results) => {
      if (err) {
        console.error("Erreur SQL corbeille :", err);
        return res.status(500).json({ erreur: 'Erreur lors de la récupération de la corbeille' });
      }
      res.json(results.map(formaterClient));
    });
  });

  // Récupérer uniquement les clients enregistrés
  router.get('/enregistres', (req, res) => {
    const query = 'SELECT * FROM clients WHERE supprime = 0 AND enregistre = 1 ORDER BY id DESC';
    db.query(query, (err, results) => {
      if (err) {
        console.error("Erreur SQL clients enregistrés :", err);
        return res.status(500).json({ erreur: 'Erreur lors de la récupération des clients enregistrés' });
      }
      res.json(results.map(formaterClient));
    });
  });

  // Récupérer TOUS les clients
  router.get('/', (req, res) => {
    const query = 'SELECT * FROM clients WHERE supprime = 0 ORDER BY id ASC';
    db.query(query, (err, results) => {
      if (err) {
        console.error("Erreur SQL clients :", err);
        return res.status(500).json({ erreur: 'Erreur lors de la récupération des clients' });
      }
      res.json(results.map(formaterClient));
    });
  });

  // Créer un nouveau client
  router.post('/', (req, res) => {
    const { 
      nom = '', postNom = '', prenom = '', bail = '', dateBail = null,
      logement = '', adresse = '', pays = 'RDC', designation = '',
      typeClient = 'locataire', typeFacture = 'Loyers', devise = 'USD',
      montant = 0, modePaiement = 'Virement', typePeriode = '1 mois', moisFacture = '',
      debutContrat = null, finContrat = null, dateComptable = null,
      compteur = '', imputation = '', dernierNumero = '', dernierMontant = 0,
      derniereDate = null, telephone = '', email = '', enregistre = true
    } = req.body;

    const nomClient = nom.trim() !== '' ? nom : (designation || 'Client');
    const prenomClient = prenom.trim() !== '' ? prenom : '-';

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
    } else if (typeFiltre.includes('proprio') || typeFiltre.includes('proprietaire')) {
      prefixe = 'PR-';
    } else if (typeFiltre.includes('locat') || typeFiltre.includes('loyer')) {
      prefixe = (devise === 'CDF') ? 'LY-' : 'LOY-';
    }

    const queryAll = 'SELECT id, matricule FROM clients ORDER BY id ASC';

    db.query(queryAll, (err, results) => {
      if (err) {
        console.error("Erreur lors de la préparation du matricule :", err);
        return res.status(500).json({ erreur: "Erreur serveur lors de la préparation du matricule" });
      }

      let maxNumeroPrefixe = 0;
      results.forEach(row => {
        if (row.matricule && row.matricule.startsWith(prefixe)) {
          const partieNumerique = parseInt(row.matricule.replace(prefixe, ''), 10);
          if (!isNaN(partieNumerique) && partieNumerique > maxNumeroPrefixe) {
            maxNumeroPrefixe = partieNumerique;
          }
        }
      });

      const prochainNumero = maxNumeroPrefixe + 1;
      const matricule = `${prefixe}${String(prochainNumero).padStart(10, '0')}`;

      const idsUtilises = new Set(results.map(r => r.id));
      let idDisponible = 1;
      while (idsUtilises.has(idDisponible)) {
        idDisponible++;
      }

      const dateEntree = new Date().toISOString().split('T')[0];
      const now = new Date();
      const creeLe = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

      const queryInsert = `
        INSERT INTO clients 
        (id, matricule, nom, postNom, prenom, bail, dateBail, logement, adresse, pays, designation, typeClient, typeFacture, devise, montant, modePaiement, typePeriode, moisFacture, debutContrat, finContrat, dateComptable, compteur, imputation, dernierNumero, dernierMontant, derniereDate, telephone, email, dateEntree, statut, supprime, enregistre, creeLe) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const valeurEnregistre = enregistre ? 1 : 0;

      const valeurs = [
        idDisponible, matricule, nomClient, postNom, prenomClient, bail, 
        nettoyerDate(dateBail), logement, adresse, pays, designation, typeClient, 
        typeFacture, devise, Number(montant) || 0, modePaiement, typePeriode, moisFacture, 
        nettoyerDate(debutContrat), nettoyerDate(finContrat), nettoyerDate(dateComptable), 
        compteur, imputation, dernierNumero, Number(dernierMontant) || 0, 
        nettoyerDate(derniereDate), telephone, email, dateEntree, 'Actif', 0, 
        valeurEnregistre, creeLe  
      ];

      db.query(queryInsert, valeurs, (insertErr) => {
        if (insertErr) {
          console.error("Erreur SQL lors de l'insertion :", insertErr);
          return res.status(500).json({ erreur: "Erreur lors de l'enregistrement : " + insertErr.message });
        }

        const nomComplet = `${nomClient} ${postNom || ''} ${prenomClient !== '-' ? prenomClient : ''}`.trim();
        const queryInsertFacture = `
          INSERT INTO factures (matricule, nom, typeFacture, montant, devise, dateCreation) 
          VALUES (?, ?, ?, ?, ?, NOW())
        `;

        const valeursFacture = [
          matricule,
          nomComplet,
          typeFacture || 'Loyers',
          Number(montant) || 0,
          devise || 'USD'
        ];

        db.query(queryInsertFacture, valeursFacture, (errFact) => {
          if (errFact) {
            console.error("Erreur lors de l'insertion dans la table factures :", errFact);
          }
        });

        const clientCree = formaterClient({
          id: idDisponible, matricule, nom: nomClient, postNom, prenom: prenomClient,
          bail, dateBail, logement, adresse, pays, designation, typeClient,
          typeFacture, devise, montant, modePaiement, typePeriode, moisFacture, debutContrat,
          finContrat, dateComptable, compteur, imputation, dernierNumero,
          dernierMontant, derniereDate, telephone, email, dateEntree,
          statut: 'Actif', supprime: 0, enregistre: valeurEnregistre, creeLe
        });

        res.status(201).json(clientCree);
      });
    });
  });

  // Valider / Enregistrer un client (Patch)
  router.patch('/:id/valider', (req, res) => {
    const { id } = req.params;
    const query = 'UPDATE clients SET enregistre = 1 WHERE id = ?';

    db.query(query, [id], (err) => {
      if (err) return res.status(500).json({ erreur: "Erreur lors de l'enregistrement du client" });
      res.json({ message: "Client enregistré avec succès" });
    });
  });

  // Modifier un client (Put)
  router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { 
      nom, postNom, prenom, bail, dateBail, logement, adresse, pays, designation, 
      typeClient, typeFacture, devise, montant, modePaiement, typePeriode, moisFacture, 
      debutContrat, finContrat, dateComptable, compteur, imputation, 
      dernierNumero, dernierMontant, derniereDate, telephone, email 
    } = req.body;

    const query = `
      UPDATE clients 
      SET nom = ?, postNom = ?, prenom = ?, bail = ?, dateBail = ?, logement = ?, adresse = ?, pays = ?, designation = ?, typeClient = ?, typeFacture = ?, devise = ?, montant = ?, modePaiement = ?, typePeriode = ?, moisFacture = ?, debutContrat = ?, finContrat = ?, dateComptable = ?, compteur = ?, imputation = ?, dernierNumero = ?, dernierMontant = ?, derniereDate = ?, telephone = ?, email = ?
      WHERE id = ?
    `;

    const valeurs = [
      nom, postNom, prenom, bail, nettoyerDate(dateBail), logement, adresse, pays, designation, 
      typeClient, typeFacture, devise, montant || 0, modePaiement, typePeriode, moisFacture, 
      nettoyerDate(debutContrat), nettoyerDate(finContrat), nettoyerDate(dateComptable), compteur, imputation, 
      dernierNumero, dernierMontant || 0, nettoyerDate(derniereDate), telephone, email, id
    ];

    db.query(query, valeurs, (err) => {
      if (err) return res.status(500).json({ erreur: "Erreur lors de la modification" });
      
      db.query('SELECT * FROM clients WHERE id = ?', [id], (errSelect, results) => {
        if (errSelect || results.length === 0) {
          return res.json({ message: "Client modifié avec succès" });
        }
        res.json(formaterClient(results[0]));
      });
    });
  });

  // Restaurer un client depuis la corbeille
  router.patch('/:id/restaurer', (req, res) => {
    const { id } = req.params;
    db.query('UPDATE clients SET supprime = 0 WHERE id = ?', [id], (err) => {
      if (err) return res.status(500).json({ erreur: "Erreur lors de la restauration" });
      res.json({ message: "Client restauré avec succès" });
    });
  });

  // Vider entièrement la corbeille
  router.delete('/corbeille/vider', (req, res) => {
    db.query('DELETE FROM clients WHERE supprime = 1', (err) => {
      if (err) return res.status(500).json({ erreur: "Erreur lors du vidage de la corbeille" });
      res.json({ message: "Corbeille vidée avec succès" });
    });
  });

  // Supprimer un client définitivement
  router.delete('/:id/definitif', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM clients WHERE id = ?', [id], (err) => {
      if (err) return res.status(500).json({ erreur: "Erreur lors de la suppression définitive" });
      res.json({ message: "Client supprimé définitivement" });
    });
  });

  // Envoyer un client dans la corbeille (Soft Delete)
  router.delete('/:id', (req, res) => {
    const { id } = req.params;
    db.query('UPDATE clients SET supprime = 1 WHERE id = ?', [id], (err) => {
      if (err) return res.status(500).json({ erreur: "Erreur lors de la mise en corbeille" });
      res.json({ message: "Client placé dans la corbeille" });
    });
  });

  return router;
};