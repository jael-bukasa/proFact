const factureService = {
  // Récupérer toutes les factures
  obtenirTous: (db, callback) => {
    const query = `SELECT * FROM factures WHERE supprime = 0 OR supprime IS NULL`;
    db.query(query, (err, results) => {
      if (err) {
        return callback(err);
      }
      callback(null, results);
    });
  },

  // Enregistrer une facture unique
  ajouter: (db, factureData, callback) => {
    const queryCount = `SELECT COUNT(*) as total FROM factures`;

    db.query(queryCount, (errCount, resultsCount) => {
      if (errCount) {
        return callback(errCount);
      }

      const prochainNumero = (resultsCount[0].total + 1).toString().padStart(5, '0');

      const completerEtInserer = (dataClient = {}) => {
        const query = `
          INSERT INTO factures (
            numero, bail, dateBail, clientCode, nomLocataire, logement, adresse, 
            pays, designation, typeFacture, modePaiement, reference, montant, 
            moisFacture, anneeFacturee, debutContrat, finContrat, dateComptable, compteur, 
            imputation, dernierNumero, dernierMontant, derniereDate, statut, supprime
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const nettoyerDate = (valeur) => {
          if (!valeur || valeur === '' || valeur === 'jj/mm/aaaa' || String(valeur).includes('111')) {
            return null;
          }
          return valeur;
        };

        const params = [
          prochainNumero,
          factureData.bail || dataClient.bail || '',
          nettoyerDate(factureData.dateBail || dataClient.dateBail),
          factureData.clientCode || dataClient.id || '',
          factureData.nomLocataire || `${dataClient.nom || ''} ${dataClient.postNom || ''}`.trim() || 'Client',
          factureData.logement || dataClient.logement || '',
          factureData.adresse || dataClient.adresse || '',
          factureData.pays || dataClient.pays || 'RDC',
          factureData.designation || dataClient.designation || '',
          factureData.typeFacture || dataClient.typeFacture || 'Loyers',
          factureData.modePaiement || dataClient.modePaiement || 'Virement',
          factureData.reference || null,
          Number(factureData.montant !== undefined ? factureData.montant : dataClient.montant) || 0,
          factureData.moisFacture || factureData.choixPeriodeSpecifique || '',
          Number(factureData.anneeFacturee || dataClient.anneeFacturee) || new Date().getFullYear(),
          nettoyerDate(factureData.debutContrat || dataClient.debutContrat),
          nettoyerDate(factureData.finContrat || dataClient.finContrat),
          nettoyerDate(factureData.dateComptable || dataClient.dateComptable),
          factureData.compteur || dataClient.compteur || '',
          factureData.imputation || dataClient.imputation || '',
          factureData.dernierNumero || dataClient.dernierNumero || '',
          Number(factureData.dernierMontant !== undefined ? factureData.dernierMontant : dataClient.dernierMontant) || 0,
          nettoyerDate(factureData.derniereDate || dataClient.derniereDate),
          factureData.statut || 'En attente',
          0
        ];

        db.query(query, params, (errInsert, result) => {
          if (errInsert) {
            return callback(errInsert);
          }
          callback(null, { ...result, numeroGenere: prochainNumero });
        });
      };

      if (factureData.clientCode) {
        const qClient = `SELECT * FROM clients WHERE id = ? OR matricule = ? LIMIT 1`;
        db.query(qClient, [factureData.clientCode, factureData.clientCode], (err, rows) => {
          if (!err && rows && rows.length > 0) {
            completerEtInserer(rows[0]);
          } else {
            completerEtInserer({});
          }
        });
      } else {
        completerEtInserer({});
      }
    });
  }
};

module.exports = factureService;