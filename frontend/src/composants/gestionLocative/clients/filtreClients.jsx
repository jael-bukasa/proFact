import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const THEME = {
  fondCarte: '#1E1E1E',
  accentuation: '#AEEA00',
  textePrincipal: '#FFFFFF',
  texteSecondaire: '#888888',
  bordure: '#2A2A2A',
  fondChamp: '#121212',
};

const PanneauFiltres = styled(motion.div)`
  background-color: ${THEME.fondCarte};
  border: 1px solid ${THEME.bordure};
  border-radius: 12px;
  padding: 1.2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: flex-end;
`;

const GroupeFiltre = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  flex: 1;
  min-width: 180px;
`;

const Etiquette = styled.label`
  color: ${THEME.texteSecondaire};
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
`;

const ChampSaisie = styled.input`
  background-color: ${THEME.fondChamp};
  color: ${THEME.textePrincipal};
  border: 1px solid ${THEME.bordure};
  border-radius: 8px;
  padding: 0.65rem 0.8rem;
  font-size: 0.85rem;
  outline: none;
  width: 100%;

  &:focus {
    border-color: ${THEME.accentuation};
  }

  /* Style pour l'icône du calendrier sur Chrome/Safari/Edge */
  &::-webkit-calendar-picker-indicator {
    filter: invert(1);
    cursor: pointer;
  }
`;

const BoutonReinitialiser = styled.button`
  background-color: transparent;
  color: ${THEME.accentuation};
  border: 1px solid ${THEME.accentuation};
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  height: 38px;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${THEME.accentuation};
    color: #000000;
  }
`;

const variantesAnimationScroll = {
  cache: { opacity: 0, y: 25 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } }
};

export default function FiltreClients({
  rechercheTexte,
  setRechercheTexte,
  filtreDateExacte,
  setFiltreDateExacte,
  reinitialiserFiltres
}) {
  return (
    <PanneauFiltres
      initial="cache"
      whileInView="visible"
      viewport={{ once: false, amount: 0.15 }}
      variants={variantesAnimationScroll}
    >
      <GroupeFiltre style={{ flex: 2, minWidth: '220px' }}>
        <Etiquette>Recherche</Etiquette>
        <ChampSaisie 
          type="text" 
          placeholder="Nom, prénom ou matricule..." 
          value={rechercheTexte} 
          onChange={(e) => setRechercheTexte(e.target.value)} 
        />
      </GroupeFiltre>

      <GroupeFiltre style={{ flex: 1.5, minWidth: '180px' }}>
        <Etiquette>Date de filtrage</Etiquette>
        <ChampSaisie 
          type="date" 
          value={filtreDateExacte} 
          onChange={(e) => setFiltreDateExacte(e.target.value)} 
        />
      </GroupeFiltre>

      <BoutonReinitialiser onClick={reinitialiserFiltres}>
        Réinitialiser
      </BoutonReinitialiser>
    </PanneauFiltres>
  );
}