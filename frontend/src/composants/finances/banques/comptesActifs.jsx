import React from 'react';
import styled, { keyframes } from 'styled-components';
import { FiCreditCard } from 'react-icons/fi';

const THEME = {
  fondCarte: '#18181b',
  bordure: '#3f3f46',
  accent: '#aeea00',
  textePrincipal: '#f4f4f5',
  texteSecondaire: '#a1a1aa',
  fondInput: '#27272a'
};

const apparition = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const CarteStat = styled.div`
  background: ${THEME.fondCarte};
  border: 1px solid ${THEME.bordure};
  border-radius: 14px;
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
  
  animation: ${apparition} 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;

  &:hover {
    border-color: ${THEME.accent};
    box-shadow: 0 8px 30px rgba(174, 234, 0, 0.1);

    .icone-stat {
      background: rgba(174, 234, 0, 0.1);
    }
  }

  .infos-stat {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;

    span.titre {
      color: ${THEME.texteSecondaire};
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    span.valeur {
      color: ${THEME.textePrincipal};
      font-size: 1.5rem;
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
    transition: background 0.25s ease;
  }
`;

export default function ComptesActifs({ totalComptes }) {
  return (
    <CarteStat>
      <div className="infos-stat">
        <span className="titre">Comptes Actifs</span>
        <span className="valeur">{totalComptes}</span>
      </div>
      <div className="icone-stat">
        <FiCreditCard />
      </div>
    </CarteStat>
  );
}