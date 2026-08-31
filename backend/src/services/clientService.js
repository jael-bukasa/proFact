import axios from 'axios';

const API_URL = 'http://localhost:5000/api/clients';

const PREFIXES_CLIENT = {
  locataire: 'LOY',
  electricite: 'ELE',
  eau: 'EAU',
  divers: 'DIV'
};

export const genererMatricule10Chiffres = (idOuCompteur = 1, typeClient = 'locataire', typeFacture = 'Loyers', devise = 'USD') => {
  let prefixe = 'CLI';
  const typeClean = (typeClient || '').toLowerCase();
  const deviseClean = (devise || '').toUpperCase();

  // Gestion spécifique pour les locataires / loyers selon la devise
  if (typeClean.includes('locat') || (typeFacture || '').toLowerCase().includes('loyer')) {
    prefixe = deviseClean.includes('CDF') ? 'LY' : 'LOY';
  } else {
    prefixe = PREFIXES_CLIENT[typeClean] || 'CLI';
  }

  const numeroFormate = String(idOuCompteur).padStart(10, '0');
  return `${prefixe}-${numeroFormate}`;
};

// 🌟 Récupération du prochain ID en envoyant les filtres au backend
export const obtenirProchainIDApi = async (typeClient = 'locataire', typeFacture = 'Loyers', devise = 'USD') => {
  try {
    const queryParams = new URLSearchParams({
      type: typeClient,
      typeFacture: typeFacture,
      devise: devise
    });

    const reponse = await axios.get(`${API_URL}/prochain-id?${queryParams.toString()}`);
    return reponse.data.id || 1;
  } catch (erreur) {
    console.error("Erreur lors de la récupération du prochain ID :", erreur);
    return 1; // Valeur par défaut en cas de panne
  }
};

export const obtenirClientsApi = async () => {
  try {
    const reponse = await axios.get(API_URL);
    return reponse.data;
  } catch (erreur) {
    console.error("Erreur lors de la récupération des clients :", erreur);
    throw erreur;
  }
};

export const obtenirCorbeilleApi = async () => {
  try {
    const reponse = await axios.get(`${API_URL}/corbeille`);
    return reponse.data;
  } catch (erreur) {
    console.error("Erreur lors de la récupération de la corbeille :", erreur);
    throw erreur;
  }
};

export const ajouterClientApi = async (nouveauClient) => {
  try {
    const payload = {
      ...nouveauClient,
      typeClient: nouveauClient.typeClient || 'locataire',
      devise: nouveauClient.devise || 'USD',
      enregistre: true,
    };

    const reponse = await axios.post(API_URL, payload);
    return reponse.data;
  } catch (erreur) {
    console.error("Erreur lors de l'ajout du client :", erreur);
    throw erreur;
  }
};

export const modifierClientApi = async (id, clientModifie) => {
  try {
    const reponse = await axios.put(`${API_URL}/${id}`, clientModifie);
    return reponse.data;
  } catch (erreur) {
    console.error("Erreur lors de la modification du client :", erreur);
    throw erreur;
  }
};

export const supprimerClientApi = async (id) => {
  try {
    const reponse = await axios.delete(`${API_URL}/${id}`);
    return reponse.data;
  } catch (erreur) {
    console.error("Erreur lors de l'envoi en corbeille :", erreur);
    throw erreur;
  }
};

export const restaurerClientApi = async (id) => {
  try {
    const reponse = await axios.patch(`${API_URL}/${id}/restaurer`);
    return reponse.data;
  } catch (erreur) {
    console.error("Erreur lors de la restauration du client :", erreur);
    throw erreur;
  }
};

export const supprimerDefinitivementClientApi = async (id) => {
  try {
    const reponse = await axios.delete(`${API_URL}/${id}/definitif`);
    return reponse.data;
  } catch (erreur) {
    console.error("Erreur lors de la suppression définitive :", erreur);
    throw erreur;
  }
};

export const viderCorbeilleApi = async () => {
  try {
    const reponse = await axios.delete(`${API_URL}/corbeille/vider`);
    return reponse.data;
  } catch (erreur) {
    console.error("Erreur lors du vidage de la corbeille :", erreur);
    throw erreur;
  }
};