import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import ClientsEnregistres from './ClientsEnregistres'; // Assurez-vous que le chemin d'accès est correct

const THEME = {
  fond: '#121212',
  fondCarte: '#1E1E1E',
  accentuation: '#AEEA00',
  bleu: '#00B0FF',
  orange: '#FFAB00',
  violet: '#AA00FF',
  textePrincipal: '#FFFFFF',
  texteSecondaire: '#888888',
  bordure: '#2A2A2A',
  survol: '#262626',
};

const ConteneurPage = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem;
  background-color: ${THEME.fond};
  min-height: 100vh;
  color: ${THEME.textePrincipal};
`;

const GrilleStatistiques = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.2rem;
`;

const CarteStat = styled(motion.div)`
  background-color: ${THEME.fondCarte};
  border: 1px solid ${THEME.bordure};
  border-radius: 12px;
  padding: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const HeaderCarte = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${THEME.texteSecondaire};
  font-size: 0.85rem;
  font-weight: 600;
`;

const ValeurCarte = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.couleur || THEME.textePrincipal};
`;

const SousValeurCarte = styled.div`
  font-size: 0.75rem;
  color: ${THEME.texteSecondaire};
`;

export default function TableauDeBord({ clientsEnregistres = [], tauxChangeCDF = 2800, onSelectClient }) {
  // Calculs statistiques mémorisés avec correction robuste des types
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
      
      // On teste à la fois cli.typeFacture et cli.type pour ne rien rater
      const typeBrutSource = cli.typeFacture || cli.type || '';
      const typeBrut = String(typeBrutSource).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

      let typeDetecte = 'Loyers';

      if (typeBrut.includes('eau')) {
        typeDetecte = 'Eau';
      } else if (typeBrut.includes('elect') || typeBrut.includes('electricite') || typeBrut.includes('electricité')) {
        typeDetecte = 'Électricité';
      } else if (typeBrut.includes('diver')) {
        typeDetecte = 'Divers';
      } else if (typeBrut.includes('loyer') || typeBrut === 'locataire' || typeBrut === '') {
        if (matriculeBrut.startsWith('DIV')) typeDetecte = 'Divers';
        else if (matriculeBrut.startsWith('EAU')) typeDetecte = 'Eau';
        else if (matriculeBrut.startsWith('ELE') || matriculeBrut.startsWith('ELEC')) typeDetecte = 'Électricité';
        else typeDetecte = 'Loyers';
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

  return (
    <ConteneurPage>
      {/* Grille des cartes de statistiques */}
      <GrilleStatistiques>
        {/* Carte Total Dossiers */}
        <CarteStat initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
          <HeaderCarte>
            <span>TOTAL DOSSIERS</span>
            <span>📂</span>
          </HeaderCarte>
          <ValeurCarte couleur={THEME.textePrincipal}>{statistiques.totalDossiers}</ValeurCarte>
          <SousValeurCarte>Règlé : {statistiques.totalRegle} / {statistiques.totalDossiers}</SousValeurCarte>
        </CarteStat>

        {/* Carte Montant Global */}
        <CarteStat initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: 0.05 }}>
          <HeaderCarte>
            <span>MONTANT GLOBAL</span>
            <span>💰</span>
          </HeaderCarte>
          <ValeurCarte couleur={THEME.accentuation}>
            {statistiques.montantTotalGlobalUSD.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} $
          </ValeurCarte>
          <SousValeurCarte>Équivalent converti en USD</SousValeurCarte>
        </CarteStat>

        {/* Cartes dynamiques par type (Loyers, Eau, Électricité, Divers) */}
        {Object.entries(statistiques.statsTypes).map(([key, data], index) => (
          <CarteStat 
            key={key} 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.2, delay: 0.1 + (index * 0.05) }}
          >
            <HeaderCarte>
              <span>{data.label.toUpperCase()}</span>
              <span>{data.icon}</span>
            </HeaderCarte>
            <ValeurCarte couleur={data.couleur}>
              {data.montantUSD.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} $
            </ValeurCarte>
            <SousValeurCarte>{data.count} enregistrement(s)</SousValeurCarte>
          </CarteStat>
        ))}
      </GrilleStatistiques>

      {/* Intégration de votre tableau des clients enregistrés */}
      <ClientsEnregistres 
        clientsEnregistres={clientsEnregistres} 
        onSelectClient={onSelectClient} 
      />
    </ConteneurPage>
  );
}