import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const THEME = {
  fondCarte: '#1E1E1E',
  textePrincipal: '#FFFFFF',
  texteSecondaire: '#888888',
  bordure: '#2A2A2A',
  vert: '#22c55e'
};

const CarteMetrique = styled.div`
  background-color: ${THEME.fondCarte};
  border-radius: 12px;
  padding: 1.2rem;
  border: 1px solid ${THEME.bordure};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 0.8rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background-color: ${THEME.vert};
  }
`;

const EnTeteCarte = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TitreCarte = styled.span`
  color: ${THEME.texteSecondaire};
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const IconeWrapper = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background-color: rgba(34, 197, 94, 0.15);
  color: ${THEME.vert};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
`;

// Conteneur pour l'effet d'écran défilant
const EcranDefilant = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 55px;
  position: relative;
`;

const LigneNom = styled(motion.div)`
  font-size: 1.2rem;
  font-weight: 700;
  color: ${THEME.textePrincipal};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const AucunDossier = styled.span`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${THEME.texteSecondaire};
`;

const SousTexteCarte = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${THEME.texteSecondaire};
  font-size: 0.75rem;
`;

export default function DossiersSoldes({ totalRegle, totalDossiers, clientsSoldes = [] }) {
  const [indexActuel, setIndexActuel] = useState(0);

  // Fait tourner les noms toutes les 3 secondes s'il y a des clients
  useEffect(() => {
    if (clientsSoldes.length <= 1) return;

    const intervalle = setInterval(() => {
      setIndexActuel((prevIndex) => (prevIndex + 1) % clientsSoldes.length);
    }, 3000);

    return () => clearInterval(intervalle);
  }, [clientsSoldes.length]);

  const clientActuel = clientsSoldes[indexActuel];

  return (
    <CarteMetrique>
      <EnTeteCarte>
        <TitreCarte>Dossiers Soldés</TitreCarte>
        <IconeWrapper>✅</IconeWrapper>
      </EnTeteCarte>

      <EcranDefilant>
        {clientsSoldes.length > 0 && clientActuel ? (
          <AnimatePresence mode="wait">
            <LigneNom
              key={indexActuel}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
            >
              {clientActuel.nom} {clientActuel.postnom || clientActuel.postNom || ''}
            </LigneNom>
          </AnimatePresence>
        ) : (
          <AucunDossier>Aucun dossier soldé</AucunDossier>
        )}
      </EcranDefilant>

      <SousTexteCarte>
        <span>Paiements validés</span>
        <span style={{ fontWeight: '600', color: THEME.vert }}>
          {totalRegle} / {totalDossiers}
        </span>
      </SousTexteCarte>
    </CarteMetrique>
  );
}