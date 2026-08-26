import React from 'react';
import styled from 'styled-components';

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

const ValeurCarte = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  color: ${THEME.textePrincipal};
  margin: 0;
`;

const SousTexteCarte = styled.span`
  color: ${THEME.texteSecondaire};
  font-size: 0.75rem;
`;

export default function DossiersSoldes({ totalRegle, totalDossiers }) {
  return (
    <CarteMetrique>
      <EnTeteCarte>
        <TitreCarte>Dossiers Soldés</TitreCarte>
        <IconeWrapper>✅</IconeWrapper>
      </EnTeteCarte>
      <ValeurCarte>{totalRegle} / {totalDossiers}</ValeurCarte>
      <SousTexteCarte>Paiements validés</SousTexteCarte>
    </CarteMetrique>
  );
}