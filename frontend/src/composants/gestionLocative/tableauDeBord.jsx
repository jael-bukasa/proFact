import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

// Importation des sous-composants
import TotalEnregistrements from './tableauDeBord/totalEnregistrements';
import VolumeFinancier from './tableauDeBord/volumeFinancier';
import DossiersSoldes from './tableauDeBord/dossiersSoldes';
import RepartionParTypes from './tableauDeBord/repartionParTypes';
import FiltrePeriode from './tableauDeBord/filtrePeriode';
import GenererStatistique from './tableauDeBord/genererStatistique';

const THEME = {
  fondCarte: '#1E1E1E',
  accentuation: '#AEEA00',
  textePrincipal: '#FFFFFF',
  bordure: '#2A2A2A',
  bleu: '#2196F3',
  orange: '#FF9800',
  violet: '#a855f7'
};

const ConteneurSection = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
`;

const BarreSuperieureFiltres = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const GrilleMetriques = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.2rem;
  width: 100%;
  align-items: stretch;
`;

const CarteAnimee = styled(motion.div)`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  & > * {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
  }
`;

export default function TableauDeBord({ clientsEnregistres = [], utilisateurConnecte }) {
  const [dateFiltre, setDateFiltre] = useState(new Date());
  const [devise, setDevise] = useState('USD');
  const tauxChangeCDF = 2800;

  const basculerDevise = () => {
    setDevise(prev => (prev === 'USD' ? 'CDF' : 'USD'));
  };

  const gererChangementMois = (deltaMois) => {
    setDateFiltre(prevDate => {
      const nouvelleDate = new Date(prevDate);
      nouvelleDate.setMonth(prevDate.getMonth() + deltaMois);
      return new Date(nouvelleDate);
    });
  };

  const gererChangementDateExacte = (nouvelleDate) => {
    setDateFiltre(new Date(nouvelleDate));
  };

  const gererReinitialiser = () => {
    setDateFiltre(new Date());
  };

  const convertirDate = (valeur) => {
    if (!valeur) return null;
    if (valeur instanceof Date) return valeur;
    
    if (typeof valeur === 'string' && (valeur.includes('/') || (valeur.includes('-') && valeur.indexOf('-') === 2))) {
      const separateur = valeur.includes('/') ? '/' : '-';
      const parties = valeur.split(separateur);
      if (parties.length === 3) {
        if (parties[0].length === 4) {
          return new Date(valeur);
        }
        return new Date(`${parties[2]}-${parties[1]}-${parties[0]}`);
      }
    }
    
    return new Date(valeur);
  };

  const statistiques = useMemo(() => {
    const clientsFiltres = clientsEnregistres.filter(cli => {
      const rawDate = cli.date || cli.dateComptable || cli.dateEnregistrement || cli.created_at || cli.createdAt;
      if (!rawDate) return false;

      const dateTransaction = convertirDate(rawDate);
      if (!dateTransaction || isNaN(dateTransaction.getTime())) return false;

      return (
        dateTransaction.getMonth() === dateFiltre.getMonth() &&
        dateTransaction.getFullYear() === dateFiltre.getFullYear()
      );
    });

    const totalDossiers = clientsFiltres.length;
    let montantTotalGlobalUSD = 0;
    let totalRegle = 0;

    // Liste des clients dont le dossier est soldé
    const clientsSoldesListe = [];

    const statsTypes = {
      Loyers: { count: 0, montantUSD: 0, couleur: THEME.accentuation, icon: '🏠', label: 'Loyers' },
      Eau: { count: 0, montantUSD: 0, couleur: THEME.bleu, icon: '💧', label: 'Eau' },
      Électricité: { count: 0, montantUSD: 0, couleur: THEME.orange, icon: '⚡', label: 'Électricité' },
      Divers: { count: 0, montantUSD: 0, couleur: THEME.violet, icon: '📦', label: 'Divers' }
    };

    clientsFiltres.forEach((cli) => {
      let montantBrut = parseFloat(cli.montant) || 0;
      let montantEnUSD = montantBrut;
      if (cli.devise && cli.devise.toUpperCase() === 'CDF') {
        montantEnUSD = montantBrut / tauxChangeCDF;
      }

      montantTotalGlobalUSD += montantEnUSD;

      const estPaye = Boolean(cli.modePaiement && cli.modePaiement !== '-' && cli.modePaiement !== '');
      if (estPaye) {
        totalRegle++;
        clientsSoldesListe.push(cli);
      }

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
      statsTypes,
      clientsSoldesListe
    };
  }, [clientsEnregistres, dateFiltre, tauxChangeCDF]);

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
    <ConteneurSection
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      
      <BarreSuperieureFiltres
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <FiltrePeriode 
          dateActuelle={dateFiltre}
          onChangerMois={gererChangementMois}
          onChangerDateExacte={gererChangementDateExacte}
          onReinitialiser={gererReinitialiser}
        />

        <GenererStatistique 
          dateFiltre={dateFiltre}
          statistiques={statistiques}
          devise={devise}
          tauxChangeCDF={tauxChangeCDF}
          utilisateurConnecte={utilisateurConnecte}
        />
      </BarreSuperieureFiltres>

      <GrilleMetriques>
        <CarteAnimee
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <TotalEnregistrements 
            totalDossiers={statistiques.totalDossiers}
            statsTypes={statistiques.statsTypes}
            donneesDonut={donneesDonut}
          />
        </CarteAnimee>

        <CarteAnimee
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <VolumeFinancier 
            devise={devise}
            basculerDevise={basculerDevise}
            volumeFinancierAffiche={volumeFinancierAffiche}
          />
        </CarteAnimee>

        <CarteAnimee
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <DossiersSoldes 
            totalRegle={statistiques.totalRegle}
            totalDossiers={statistiques.totalDossiers}
            clientsSoldes={statistiques.clientsSoldesListe}
          />
        </CarteAnimee>
      </GrilleMetriques>

      <CarteAnimee
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <RepartionParTypes 
          statsTypes={statistiques.statsTypes}
          totalDossiers={statistiques.totalDossiers}
          devise={devise}
          tauxChangeCDF={tauxChangeCDF}
        />
      </CarteAnimee>

    </ConteneurSection>
  );
}