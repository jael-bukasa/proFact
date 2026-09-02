
// Fonction pour convertir un nombre en lettres (français)
export function nombreEnLettres(nombre) {
  if (isNaN(nombre)) return "zéro";
  
  const unite = ['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf'];
  const dizaine = ['', '', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante-dix', 'quatre-vingt', 'quatre-vingt-dix'];

  function convertirBloc(n) {
    if (n === 0) return '';
    if (n < 20) return unite[n];
    if (n < 100) {
      let d = Math.floor(n / 10);
      let r = n % 10;
      if (d === 7 || d === 9) {
        return dizaine[d - 1] + '-' + unite[10 + r];
      }
      return dizaine[d] + (r === 1 && d !== 8 ? '-et-un' : r > 0 ? '-' + unite[r] : d === 8 ? 's' : '');
    }
    if (n < 1000) {
      let c = Math.floor(n / 100);
      let r = n % 100;
      let cText = c === 1 ? 'cent' : unite[c] + ' cents';
      if (r === 0 && c > 1) cText += 's';
      return cText + (r > 0 ? ' ' + convertirBloc(r) : '');
    }
    return '';
  }

  const parties = Number(nombre).toFixed(2).split('.');
  let partieEntiere = parseInt(parties[0], 10);
  let partieDecimale = parseInt(parties[1], 10);

  if (partieEntiere === 0) return 'zéro';

  let resultat = '';
  let millions = Math.floor(partieEntiere / 1000000);
  partieEntiere %= 1000000;
  let milliers = Math.floor(partieEntiere / 1000);
  let reste = partieEntiere % 1000;

  if (millions > 0) {
    resultat += (millions === 1 ? 'un million' : convertirBloc(millions) + ' millions') + ' ';
  }
  if (milliers > 0) {
    resultat += (milliers === 1 ? 'mille' : convertirBloc(milliers) + ' mille') + ' ';
  }
  if (reste > 0) {
    resultat += convertirBloc(reste);
  }

  let texteFinal = resultat.trim();
  if (partieDecimale > 0) {
    texteFinal += ` et ${partieDecimale}/100`;
  }

  return texteFinal;
}

// Fonction pour obtenir le libellé de la devise en toutes lettres
export function obtenirLibelleDevise(devise) {
  const code = (devise || 'USD').toUpperCase();
  if (code === 'USD') return 'Dollars Américains';
  if (code === 'CDF') return 'Francs Congolais';
  return code;
}


// Liste des banques par défaut si l'API ne répond pas
export const banquesParDefaut = [
  { nomBanque: 'BCDC', numeroCompte: 'N° 00011-00130-00000856147-03', devise: 'CDF' },
  { nomBanque: 'BCDC', numeroCompte: 'N° 00011-00130-00000856151-88', devise: 'USD' },
  { nomBanque: 'RAWBANK', numeroCompte: 'N° 00016-05130-01002107502-77', devise: 'CDF' },
  { nomBanque: 'RAWBANK', numeroCompte: 'N° 00016-05130-01002107501-80', devise: 'USD' },
  { nomBanque: 'TMB', numeroCompte: 'N° 00017-25000-00015000000-87', devise: 'CDF' },
  { nomBanque: 'TMB', numeroCompte: 'N° 00017-25000-00187750001-35', devise: 'USD' }
];

/**
 * Récupère les banques depuis l'API ou retourne les valeurs par défaut
 */
export const chargerBanques = async () => {
  try {
    const res = await fetch('http://localhost:5000/api/banques');
    if (!res.ok) throw new Error("Erreur réseau");
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      return data;
    }
  } catch (error) {
    // En cas d'erreur, on utilise les valeurs par défaut silencieusement
  }
  return banquesParDefaut;
};



/**
 * Découpe un tableau de banques en deux colonnes égales pour l'affichage PDF
 */
export const preparerColonnesBanques = (listeBanques) => {
  const banquesUtilisées = listeBanques && listeBanques.length > 0 ? listeBanques : banquesParDefaut;
  const moitie = Math.ceil(banquesUtilisées.length / 2);
  return {
    colonne1: banquesUtilisées.slice(0, moitie),
    colonne2: banquesUtilisées.slice(moitie)
  };
};