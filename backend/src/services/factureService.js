const factureService = {
  // Enregistrer une facture unique
  ajouter: (db, factureData, callback) => {
    const query = `
      INSERT INTO factures (
        numero, clientCode, nomLocataire, logement, adresse, 
        typeFacture, montant, moisFacture, anneeFactureChiffre
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      factureData.numero || `FAC-${Date.now()}`,
      factureData.clientCode || '',
      factureData.nomLocataire || '',
      factureData.logement || '',
      factureData.adresse || '',
      factureData.typeFacture || 'locataire',
      factureData.montant || 0,
      factureData.moisFacture || '',
      factureData.anneeFactureChiffre || ''
    ];
    db.query(query, params, callback);
  }
};

module.exports = factureService;