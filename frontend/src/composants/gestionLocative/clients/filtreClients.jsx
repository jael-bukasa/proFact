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
  min-width: 130px;
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

  &:focus {
    border-color: ${THEME.accentuation};
  }
`;

const SelecteurFiltre = styled.select`
  background-color: ${THEME.fondChamp};
  color: ${THEME.textePrincipal};
  border: 1px solid ${THEME.bordure};
  border-radius: 8px;
  padding: 0.6rem 0.8rem;
  font-size: 0.85rem;
  outline: none;

  &:focus {
    border-color: ${THEME.accentuation};
  }
`;

const BoutonReinitialiser = styled.button`
  background-color: transparent;
  color: ${THEME.accentuation};
  border: 1px solid ${THEME.accentuation};
  padding: 0.6rem 1rem;
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
  filtreJour,
  setFiltreJour,
  filtreMois,
  setFiltreMois,
  filtreAnnee,
  setFiltreAnnee,
  reinitialiserFiltres
}) {
  return (
    <PanneauFiltres
      initial="cache"
      whileInView="visible"
      viewport={{ once: false, amount: 0.15 }}
      variants={variantesAnimationScroll}
    >
      <GroupeFiltre style={{ flex: 2, minWidth: '200px' }}>
        <Etiquette>Recherche</Etiquette>
        <ChampSaisie 
          type="text" 
          placeholder="Nom, prénom ou matricule..." 
          value={rechercheTexte} 
          onChange={(e) => setRechercheTexte(e.target.value)} 
        />
      </GroupeFiltre>

      <GroupeFiltre>
        <Etiquette>Date Exacte</Etiquette>
        <ChampSaisie 
          type="date" 
          value={filtreDateExacte} 
          onChange={(e) => {
            setFiltreDateExacte(e.target.value);
            setFiltreJour('');
            setFiltreMois('');
            setFiltreAnnee('');
          }} 
        />
      </GroupeFiltre>

      <GroupeFiltre>
        <Etiquette>Jour</Etiquette>
        <SelecteurFiltre 
          value={filtreJour} 
          onChange={(e) => setFiltreJour(e.target.value)}
          disabled={Boolean(filtreDateExacte)}
        >
          <option value="">Tous</option>
          {Array.from({ length: 31 }, (_, i) => {
            const d = String(i + 1).padStart(2, '0');
            return <option key={d} value={d}>{d}</option>;
          })}
        </SelecteurFiltre>
      </GroupeFiltre>

      <GroupeFiltre>
        <Etiquette>Mois</Etiquette>
        <SelecteurFiltre 
          value={filtreMois} 
          onChange={(e) => setFiltreMois(e.target.value)}
          disabled={Boolean(filtreDateExacte)}
        >
          <option value="">Tous</option>
          <option value="01">Janvier</option>
          <option value="02">Février</option>
          <option value="03">Mars</option>
          <option value="04">Avril</option>
          <option value="05">Mai</option>
          <option value="06">Juin</option>
          <option value="07">Juillet</option>
          <option value="08">Août</option>
          <option value="09">Septembre</option>
          <option value="10">Octobre</option>
          <option value="11">Novembre</option>
          <option value="12">Décembre</option>
        </SelecteurFiltre>
      </GroupeFiltre>

      <GroupeFiltre>
        <Etiquette>Année</Etiquette>
        <SelecteurFiltre 
          value={filtreAnnee} 
          onChange={(e) => setFiltreAnnee(e.target.value)}
          disabled={Boolean(filtreDateExacte)}
        >
          <option value="">Toutes</option>
          <option value="2024">2024</option>
          <option value="2025">2025</option>
          <option value="2026">2026</option>
        </SelecteurFiltre>
      </GroupeFiltre>

      <BoutonReinitialiser onClick={reinitialiserFiltres}>
        Réinitialiser
      </BoutonReinitialiser>
    </PanneauFiltres>
  );
}