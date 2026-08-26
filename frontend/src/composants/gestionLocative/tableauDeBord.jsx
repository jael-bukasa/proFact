import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

// Importation des sous-composants du tableau de bord
import TotalEnregistrements from './tableauDeBord/totalEnregistrements';
import VolumeFinancier from './tableauDeBord/volumeFinancier';
import DossiersSoldes from './tableauDeBord/dossiersSoldes';
import RepartionParTypes from './tableauDeBord/repartionParTypes';

const THEME = {
  fondCarte: '#1E1E1E',
  accentuation: '#AEEA00',
  textePrincipal: '#FFFFFF',
  bordure: '#2A2A2A',
  bleu: '#2196F3',
  orange: '#FF9800',
  violet: '#a855f7'
};

const ConteneurSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
`;

const ConteneurEnTete = styled(motion.header)`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
`;

const SelecteurMois = styled(motion.div)`
  background-color: ${THEME.fondCarte};
  color: ${THEME.textePrincipal};
  border: 1px solid ${THEME.bordure};
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  text-transform: capitalize;
  cursor: pointer;
`;

const GrilleMetriques = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.2rem;
  width: 100%;
`;

const obtenirMoisCourant = () => {
  const date = new Date();
  const moisAnnee = date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  return moisAnnee.charAt(0).toUpperCase() + moisAnnee.slice(1);
};

export default function TableauDeBord({ clientsEnregistres = [] }) {
  const [moisSelectionne] = useState(obtenirMoisCourant());
  const [devise, setDevise] = useState('USD');
  const tauxChangeCDF = 2800;

  const basculerDevise = () => {
    setDevise(prev => (prev === 'USD' ? 'CDF' : 'USD'));
  };

  const statistiques = useMemo(() => {
    const totalDossiers = clientsEnregistres.length;
    let montantTotalGlobalUSD = 0;
    let totalRegle = 0;

    const statsTypes = {
      Loyers: { count: 0, montantUSD: 0, couleur: THEME.accentuation, icon: '🏠', label: 'Loyers' },
      Eau: { count: 0, montantUSD: 0, couleur: THEME.bleu, icon: '💧', label: 'Eau' },
      Électricité: { count: 0, montantUSD: 0, couleur: THEME.orange, icon: '⚡', label: 'Électricité' },
      Divers: { count: 0, montantUSD: 0, couleur: THEME.violet, icon: '📦', label: 'Divers' }
    };

    clientsEnregistres.forEach((cli) => {
      let montantBrut = parseFloat(cli.montant) || 0;
      let montantEnUSD = montantBrut;
      if (cli.devise && cli.devise.toUpperCase() === 'CDF') {
        montantEnUSD = montantBrut / tauxChangeCDF;
      }

      montantTotalGlobalUSD += montantEnUSD;

      const estPaye = Boolean(cli.modePaiement && cli.modePaiement !== '-' && cli.modePaiement !== '');
      if (estPaye) totalRegle++;

      const matriculeBrut = (cli.matricule || cli.numero || '').toUpperCase();
      const typeBrutSource = cli.typeClient || cli.typeFacture || cli.type || '';
      const typeBrut = String(typeBrutSource).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

      let typeDetecte = 'Loyers';

      if (typeBrut.includes('eau') || matriculeBrut.startsWith('EAU')) {
        typeDetecte = 'Eau';
      } else if (typeBrut.includes('elect') || typeBrut === 'elec' || matriculeBrut.startsWith('ELE')) {
        typeDetecte = 'Électricité';
      } else if (typeBrut.includes('diver') || matriculeBrut.startsWith('DIV')) {
        typeDetecte = 'Divers';
      } else {
        typeDetecte = 'Loyers';
      }

      if (statsTypes[typeDetecte]) {
        statsTypes[typeDetecte].count += 1;
        statsTypes[typeDetecte].montantUSD += montantEnUSD;
      } else {
        statsTypes.Loyers.count += 1;
        statsTypes.Loyers.montantUSD += montantEnUSD;
      }
    });

    return {
      totalDossiers,
      montantTotalGlobalUSD,
      totalRegle,
      statsTypes
    };
  }, [clientsEnregistres, tauxChangeCDF]);

  const donneesDonut = useMemo(() => {
    const total = statistiques.totalDossiers;
    if (total === 0) return [];

    let angleCumule = 0;
    const rayon = 40;
    const circonference = 2 * Math.PI * rayon;

    return Object.entries(statistiques.statsTypes).map(([nom, data]) => {
      const pourcentage = (data.count / total);
      const longueurTrait = pourcentage * circonference;
      const decalage = -angleCumule;
      angleCumule += longueurTrait;

      return {
        nom,
        ...data,
        pourcentageArrondi: Math.round(pourcentage * 100),
        strokeDasharray: `${longueurTrait} ${circonference - longueurTrait}`,
        strokeDashoffset: decalage
      };
    });
  }, [statistiques]);

  const volumeFinancierAffiche = devise === 'USD' 
    ? statistiques.montantTotalGlobalUSD 
    : statistiques.montantTotalGlobalUSD * tauxChangeCDF;

  return (
    <ConteneurSection>
      
      {/* En-tête */}
      <ConteneurEnTete
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.4 }}
      >
        <SelecteurMois
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
        >
          📅 Période : {moisSelectionne}
        </SelecteurMois>
      </ConteneurEnTete>

      {/* Cartes de Synthèse Principales */}
      <GrilleMetriques>
        <TotalEnregistrements 
          totalDossiers={statistiques.totalDossiers}
          statsTypes={statistiques.statsTypes}
          donneesDonut={donneesDonut}
        />

        <VolumeFinancier 
          devise={devise}
          basculerDevise={basculerDevise}
          volumeFinancierAffiche={volumeFinancierAffiche}
        />

        <DossiersSoldes 
          totalRegle={statistiques.totalRegle}
          totalDossiers={statistiques.totalDossiers}
        />
      </GrilleMetriques>

      {/* Répartition par Type (Sous-composant modulaire) */}
      <RepartionParTypes 
        statsTypes={statistiques.statsTypes}
        totalDossiers={statistiques.totalDossiers}
        devise={devise}
        tauxChangeCDF={tauxChangeCDF}
      />

    </ConteneurSection>
  );
}