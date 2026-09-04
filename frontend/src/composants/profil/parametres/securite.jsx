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

const LigneChampsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const GroupeChamp = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  label {
    font-size: 0.825rem;
    font-weight: 500;
    color: #94a3b8;
  }

  input {
    background: rgba(15, 15, 18, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    padding: 0.85rem 1rem;
    color: #ffffff;
    font-size: 0.95rem;
    transition: all 0.25s ease;

    &:focus {
      outline: none;
      border-color: #22c55e;
      background: rgba(15, 15, 18, 0.9);
      box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.15);
    }

    &::placeholder {
      color: #475569;
    }
  }
`;

export default function Securite({ formData, handleChange }) {
  return (
    <BlocBlocSection>
      <TitreSection>🔒 Sécurité et Mot de passe</TitreSection>
      <LigneChampsGrid>
        <GroupeChamp>
          <label>Ancien mot de passe</label>
          <input type="password" name="ancienMotDePasse" value={formData.ancienMotDePasse} onChange={handleChange} placeholder="••••••••••••" />
        </GroupeChamp>
        <GroupeChamp>
          <label>Nouveau mot de passe</label>
          <input type="password" name="nouveauMotDePasse" value={formData.nouveauMotDePasse} onChange={handleChange} placeholder="••••••••••••" />
        </GroupeChamp>
      </LigneChampsGrid>
    </BlocBlocSection>
  );
}