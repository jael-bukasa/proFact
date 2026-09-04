import React from 'react';
import styled from 'styled-components';

const BlocBlocSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  background: rgba(255, 255, 255, 0.015);
  border: 1px solid rgba(255, 255, 255, 0.04);
  padding: 1.5rem;
  border-radius: 14px;
`;

const TitreSection = styled.h3`
  font-size: 1.05rem;
  font-weight: 600;
  color: #ffffff;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin: 0;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
`;

const LigneThemeContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`;

const InfoTheme = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  span.titre {
    font-size: 0.95rem;
    font-weight: 600;
    color: #ffffff;
  }

  span.description {
    font-size: 0.8rem;
    color: #94a3b8;
  }
`;

const BoutonBasculeTheme = styled.button`
  background: rgba(15, 15, 18, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 30px;
  padding: 0.4rem 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  cursor: pointer;
  transition: all 0.25s ease;

  span.icone-rond {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: ${props => props.$estSombre ? '#22c55e' : '#eab308'};
    color: #000000;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }

  span.texte-etat {
    font-size: 0.85rem;
    font-weight: 600;
    color: #e2e8f0;
    padding-right: 0.4rem;
  }

  &:hover {
    border-color: #22c55e;
    background: rgba(15, 15, 18, 1);
  }
`;

export default function Apparence({ estSombre, handleToggleTheme }) {
  return (
    <BlocBlocSection>
      <TitreSection>🎨 Apparence</TitreSection>
      <LigneThemeContainer>
        <InfoTheme>
          <span className="titre">Mode d'affichage</span>
          <span className="description">Basculez entre le thème sombre et le thème clair</span>
        </InfoTheme>
        <BoutonBasculeTheme 
          type="button" 
          $estSombre={estSombre} 
          onClick={handleToggleTheme}
          title="Changer de thème"
        >
          <span className="icone-rond">
            {estSombre ? '🌙' : '☀️'}
          </span>
          <span className="texte-etat">
            {estSombre ? 'Sombre' : 'Clair'}
          </span>
        </BoutonBasculeTheme>
      </LigneThemeContainer>
    </BlocBlocSection>
  );
}