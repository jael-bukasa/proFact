import axios from 'axios';

const API_URL = 'http://localhost:5000/api/clients'; // Ajustez selon votre route backend

// Dictionnaire des préfixes par type de client
const PREFIXES_CLIENT = {
  locataire: 'LOY',
  electricite: 'ELE',
  eau: 'EAU',
  divers: 'DIV'
};

/**
 * Helper utilitaire : génère un matricule formaté à 10 chiffres
 * Ex: (1, 'locataire') -> "LOY-0000000001"
 */
export const genererMatricule10Chiffres = (idOuCompteur = 1, typeClient = 'locataire') => {
  const prefixe = PREFIXES_CLIENT[typeClient?.toLowerCase()] || 'CLI';
  const numeroFormate = String(idOuCompteur).padStart(10, '0');
  return `${prefixe}-${numeroFormate}`;
};

/**
 * Récupérer tous les clients (actifs et/ou supprimés selon l'API backend)
 */
export const obtenirClientsApi = async () => {
  try {
    const reponse = await axios.get(API_URL);
    return reponse.data;
  } catch (erreur) {
    console.error("Erreur lors de la récupération des clients :", erreur);
    throw erreur;
  }
};

/**
 * Ajouter un nouveau client
 */
export const ajouterClientApi = async (nouveauClient) => {
  try {
    const payload = {
      ...nouveauClient,
      typeClient: nouveauClient.typeClient || 'locataire',
      devise: nouveauClient.devise || 'USD',
    };

    const reponse = await axios.post(API_URL, payload);
    return reponse.data;
  } catch (erreur) {
    console.error("Erreur lors de l'ajout du client :", erreur);
    throw erreur;
  }
};

/**
 * Modifier les informations d'un client
 */
export const modifierClientApi = async (id, clientModifie) => {
  try {
    const reponse = await axios.put(`${API_URL}/${id}`, clientModifie);
    return reponse.data;
  } catch (erreur) {
    console.error("Erreur lors de la modification du client :", erreur);
    throw erreur;
  }
};

/**
 * Envoyer un client vers la corbeille (Archivage / Corbeille)
 */
export const supprimerClientApi = async (id) => {
  try {
    // Si votre API fait un soft-delete direct via DELETE ou un PUT statut
    const reponse = await axios.delete(`${API_URL}/${id}`);
    return reponse.data;
  } catch (erreur) {
    console.error("Erreur lors de l'envoi en corbeille :", erreur);
    throw erreur;
  }
};

/**
 * Restaurer un client depuis la corbeille
 */
export const restaurerClientApi = async (id) => {
  try {
    // Si votre backend a une route dédiée /restaurer ou accepte un PUT de mise à jour de statut
    const reponse = await axios.put(`${API_URL}/${id}/restaurer`).catch(() => {
      // Fallback : mise à jour directe des propriétés de statut si la route spécifique n'existe pas
      return axios.put(`${API_URL}/${id}`, { estSupprime: false, statut: 'actif' });
    });
    return reponse.data;
  } catch (erreur) {
    console.error("Erreur lors de la restauration du client :", erreur);
    throw erreur;
  }
};

/**
 * Supprimer définitivement un client de la base de données
 */
export const supprimerDefinitivementClientApi = async (id) => {
  try {
    const reponse = await axios.delete(`${API_URL}/${id}/definitivement`).catch(() => {
      // Fallback vers le DELETE classique si route unique
      return axios.delete(`${API_URL}/${id}`);
    });
    return reponse.data;
  } catch (erreur) {
    console.error("Erreur lors de la suppression définitive :", erreur);
    throw erreur;
  }
};