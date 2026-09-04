import React, { useState } from 'react';
import styled from 'styled-components';
import Paramettre from './paramettre';
import Deconnexion from './deconnexion';

const ConteneurPrincipal = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 800px;
  width: 100%;
  margin: 1.5rem auto;
`;

const BarreOngletsProfil = styled.div`
  display: flex;
  gap: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding-bottom: 0.5rem;
`;

const BoutonOnglet = styled.button`
  background: transparent;
  border: none;
  color: ${props => props.$actif ? '#22c55e' : '#888888'};
  font-weight: ${props => props.$actif ? '600' : '400'};
  font-size: 0.95rem;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  background-color: ${props => props.$actif ? 'rgba(34, 197, 94, 0.1)' : 'transparent'};

  &:hover {
    color: #22c55e;
    background-color: rgba(34, 197, 94, 0.05);
  }
`;

export default function Profil({ utilisateurConnecte, surDeconnexion }) {
  const [sousOngletActif, setSousOngletActif] = useState('parametres');

  return (
    <ConteneurPrincipal>
      <BarreOngletsProfil>
        <BoutonOnglet 
          $actif={sousOngletActif === 'parametres'} 
          onClick={() => setSousOngletActif('parametres')}
        >
          ⚙️ Paramètres
        </BoutonOnglet>
        <BoutonOnglet 
          $actif={sousOngletActif === 'deconnexion'} 
          onClick={() => {
            setSousOngletActif('deconnexion');
            if (surDeconnexion) surDeconnexion();
          }}
        >
          🚪 Déconnexion
        </BoutonOnglet>
      </BarreOngletsProfil>

      {sousOngletActif === 'parametres' && (
        <Paramettre utilisateurConnecte={utilisateurConnecte} />
      )}

      {sousOngletActif === 'deconnexion' && (
        <Deconnexion surDeconnexion={surDeconnexion} />
      )}
    </ConteneurPrincipal>
  );
}