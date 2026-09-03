import React from 'react';
import styled from 'styled-components';
import { FiDollarSign, FiActivity } from 'react-icons/fi';

const THEME = {
  fondCarte: '#18181b',
  bordure: '#3f3f46',
  accent: '#aeea00',
  textePrincipal: '#f4f4f5',
  texteSecondaire: '#a1a1aa',
  fondInput: '#27272a'
};

const CarteStat = styled.div`
  background: ${THEME.fondCarte};
  border: 1px solid ${THEME.bordure};
  border-radius: 12px;
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);

  .infos-stat {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;

    span.titre {
      color: ${THEME.texteSecondaire};
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    span.valeur {
      color: ${THEME.textePrincipal};
      font-size: 1.6rem;
      font-weight: 700;
    }
  }

  .icone-stat {
    width: 42px;
    height: 42px;
    border-radius: 10px;
    background: ${THEME.fondInput};
    color: ${THEME.accent};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    border: 1px solid ${THEME.bordure};
  }
`;

export default function Tresorerie({ totalUSD, totalCDF }) {
  return (
    <>
      <CarteStat>
        <div className="infos-stat">
          <span className="titre">Trésorerie USD</span>
          <span className="valeur">${totalUSD.toLocaleString()}</span>
        </div>
        <div className="icone-stat"><FiDollarSign /></div>
      </CarteStat>

      <CarteStat>
        <div className="infos-stat">
          <span className="titre">Trésorerie CDF</span>
          <span className="valeur">{totalCDF.toLocaleString()} FC</span>
        </div>
        <div className="icone-stat"><FiActivity /></div>
      </CarteStat>
    </>
  );
}