const factureService = {
  // Enregistrer une facture unique
  ajouter: (db, factureData, callback) => {
    // Étape 1 : Récupérer le nombre total de factures pour déterminer le prochain numéro séquentiel
    const queryCount = `SELECT COUNT(*) as total FROM factures`;

    db.query(queryCount, (errCount, resultsCount) => {
      if (errCount) {
        return callback(errCount);
      }

      // Génère le numéro séquentiel formaté sur 5 chiffres minimum (ex: 00001, 00002...)
      const prochainNumero = (resultsCount[0].total + 1).toString().padStart(5, '0');

      // Si un clientCode est fourni mais que le montant ou le logement sont absents, on va les chercher dans la table clients
      const completerEtInserer = (dataClient = {}) => {
        const query = `
          INSERT INTO factures (
            numero, bail, dateBail, clientCode, nomLocataire, logement, adresse, 
            pays, designation, typeFacture, modePaiement, reference, montant, 
            moisFacture, debutContrat, finContrat, dateComptable, compteur, 
            imputation, dernierNumero, dernierMontant, derniereDate, statut, supprime
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const nettoyerDate = (valeur) => {
          if (!valeur || valeur === '' || valeur === 'jj/mm/aaaa' || String(valeur).includes('111')) {
            return null;
          }
          return valeur;
        };

        const params = [
          prochainNumero, // Utilisation du numéro automatique à 5 chiffres généré
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
          // On renvoie le résultat avec le numéro généré pour que la route puisse l'afficher dans la réponse
          callback(null, { ...result, numeroGenere: prochainNumero });
        });
      };

      // Si on a un code client ou ID, on essaie de récupérer ses infos de base pour compléter la facture
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