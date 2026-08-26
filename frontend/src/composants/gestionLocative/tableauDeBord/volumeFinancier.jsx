import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const THEME = {
  fondCarte: '#1E1E1E',
  textePrincipal: '#FFFFFF',
  texteSecondaire: '#888888',
  bordure: '#2A2A2A',
  orange: '#FF9800'
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
    background-color: ${THEME.orange};
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

const SelecteurDevise = styled(motion.button)`
  background-color: rgba(255, 255, 255, 0.08);
  color: ${THEME.textePrincipal};
  border: 1px solid ${THEME.bordure};
  padding: 0.25rem 0.6rem;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.3rem;

  &:hover {
    background-color: rgba(255, 255, 255, 0.15);
  }
`;

const IconeWrapper = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background-color: rgba(255, 152, 0, 0.15);
  color: ${THEME.orange};
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

export default function VolumeFinancier({ devise, basculerDevise, volumeFinancierAffiche }) {
  return (
    <CarteMetrique>
      <EnTeteCarte>
        <TitreCarte>Volume Financier Global</TitreCarte>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <SelecteurDevise 
            onClick={basculerDevise}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Cliquer pour changer de devise"
          >
            💱 {devise}
          </SelecteurDevise>
          <IconeWrapper>💰</IconeWrapper>
        </div>
      </EnTeteCarte>
      <ValeurCarte>
        {volumeFinancierAffiche.toLocaleString(undefined, { maximumFractionDigits: 2 })} {devise}
      </ValeurCarte>
      <SousTexteCarte>
        {devise === 'CDF' ? 'Converti en Franc Congolais' : 'Somme totale des montants'}
      </SousTexteCarte>
    </CarteMetrique>
  );
}