import React from 'react';
import styled from 'styled-components';

const SectionFormulaire = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
`;

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

const PiedFormulaire = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 0.5rem;
`;

const BoutonAction = styled.button`
  background: #22c55e;
  color: #052e16;
  font-weight: 600;
  font-size: 0.95rem;
  padding: 0.85rem 1.75rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 14px rgba(34, 197, 94, 0.3);

  &:hover {
    background: #16a34a;
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(34, 197, 94, 0.4);
  }
`;

export default function InformationsPersonnelles({ formData, handleChange, onSubmit }) {
  return (
    <SectionFormulaire onSubmit={onSubmit}>
      <BlocBlocSection>
        <TitreSection>👤 Information profil</TitreSection>
        <LigneChampsGrid>
          <GroupeChamp>
            <label htmlFor="prenom">Prénom</label>
            <input 
              type="text" 
              id="prenom" 
              name="prenom" 
              value={formData.prenom || ''} 
              onChange={handleChange} 
              placeholder="Ton prénom" 
              required 
            />
          </GroupeChamp>
          <GroupeChamp>
            <label htmlFor="nom">Nom</label>
            <input 
              type="text" 
              id="nom" 
              name="nom" 
              value={formData.nom || ''} 
              onChange={handleChange} 
              placeholder="Ton nom" 
              required 
            />
          </GroupeChamp>
          <GroupeChamp>
            <label htmlFor="postnom">Postnom</label>
            <input 
              type="text" 
              id="postnom" 
              name="postnom" 
              value={formData.postnom || ''} 
              onChange={handleChange} 
              placeholder="Ton postnom" 
            />
          </GroupeChamp>
          <GroupeChamp>
            <label htmlFor="email">Adresse e-mail</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={formData.email || ''} 
              onChange={handleChange} 
              placeholder="nom@exemple.com" 
              required 
            />
          </GroupeChamp>
        </LigneChampsGrid>
      </BlocBlocSection>
      <PiedFormulaire>
        <BoutonAction type="submit">Enregistrer le profil</BoutonAction>
      </PiedFormulaire>
    </SectionFormulaire>
  );
}