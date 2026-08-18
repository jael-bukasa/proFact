import React from 'react';
import styled from 'styled-components';

const THEME = {
  fondCarte: '#1E1E1E',
  accentuation: '#AEEA00',
  textePrincipal: '#FFFFFF',
  texteSecondaire: '#888888',
  bordure: '#2A2A2A'
};

const ConteneurEnTete = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
`;

const TitrePage = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.4rem;
`;

const SousTitrePage = styled.p`
  color: ${THEME.texteSecondaire};
  font-size: 0.95rem;
`;

const BoutonAction = styled.button`
  background-color: ${THEME.accentuation};
  color: #000000;
  border: none;
  padding: 0.7rem 1.4rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  font-size: 0.9rem;

  &:hover {
    opacity: 0.9;
  }
`;

const CarteContenu = styled.div`
  background-color: ${THEME.fondCarte};
  padding: 2rem;
  border-radius: 16px;
  border: 1px solid ${THEME.bordure};
  color: ${THEME.texteSecondaire};
`;

export default function Rapports() {
  return (
    <>
      <ConteneurEnTete>
        <div>
          <TitrePage>Rapports</TitrePage>
          <SousTitrePage>Bilan financier, impayés et statistiques d’occupation.</SousTitrePage>
        </div>
        <BoutonAction>Exporter en PDF</BoutonAction>
      </ConteneurEnTete>

      <CarteContenu>
        <p>Rapports comptables, relevés des revenus locatifs et bilans périodiques.</p>
      </CarteContenu>
    </>
  );
}