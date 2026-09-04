import React, { useState } from 'react';
import styled, { keyframes, css } from 'styled-components';

const shakeAnimation = keyframes`
  0%, 100% { transform: translateX(0); border-color: rgba(255, 255, 255, 0.1); }
  20%, 60% { transform: translateX(-6px); border-color: #ef4444; box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.2); }
  40%, 80% { transform: translateX(6px); border-color: #ef4444; box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.2); }
`;

const spinAnimation = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SectionFormulaire = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  transition: opacity 0.3s ease;
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
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  input {
    width: 100%;
    background: rgba(15, 15, 18, 0.6);
    border: 1px solid ${props => props.$enErreur ? '#ef4444' : 'rgba(255, 255, 255, 0.1)'};
    border-radius: 10px;
    padding: 0.85rem 3rem 0.85rem 1rem;
    color: #ffffff;
    font-size: 0.95rem;
    /* Transition douce sur les états du champ */
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    
    animation: ${props => props.$enErreur ? css`${shakeAnimation} 0.4s ease` : 'none'};

    &:focus {
      outline: none;
      border-color: ${props => props.$enErreur ? '#ef4444' : '#22c55e'};
      background: rgba(15, 15, 18, 0.9);
      box-shadow: ${props => props.$enErreur ? '0 0 0 4px rgba(239, 68, 68, 0.2)' : '0 0 0 4px rgba(34, 197, 94, 0.15)'};
    }

    /* Effet assoupli et élégant lors de la désactivation (chargement) */
    &:disabled {
      opacity: 0.5;
      background: rgba(15, 15, 18, 0.3);
      cursor: wait;
    }

    &::placeholder {
      color: ${props => props.$enErreur ? '#ef4444' : '#475569'};
      opacity: 1;
      font-weight: ${props => props.$enErreur ? '500' : 'normal'};
    }
  }
`;

const BoutonVisibilite = styled.button`
  position: absolute;
  right: 12px;
  background: transparent;
  border: none;
  color: #cbd5e1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  z-index: 2;
  transition: opacity 0.2s ease;

  &:hover:not(:disabled) {
    color: #ffffff;
  }

  &:disabled {
    opacity: 0.4;
    cursor: wait;
  }

  &:focus {
    outline: none;
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
  /* Transition fluide sur les changements de style du bouton */
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 14px rgba(34, 197, 94, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  min-width: 230px; /* Évite les sauts de largeur brusques du bouton au chargement */

  &:hover:not(:disabled) {
    background: #16a34a;
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(34, 197, 94, 0.4);
  }

  &:disabled {
    background: rgba(34, 197, 94, 0.5);
    color: rgba(5, 46, 22, 0.7);
    cursor: wait;
    transform: none;
    box-shadow: none;
  }
`;

const SpinnerChargement = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(5, 46, 22, 0.2);
  border-top-color: #052e16;
  border-radius: 50%;
  animation: ${spinAnimation} 0.8s cubic-bezier(0.5, 0, 0.5, 1) infinite;
`;

export default function Securite({ formData = {}, handleChange, onSubmit, erreurs = {}, enCoursDeChargement = false }) {
  const [voirAncien, setVoirAncien] = useState(false);
  const [voirNouveau, setVoirNouveau] = useState(false);
  const [voirConfirmation, setVoirConfirmation] = useState(false);

  return (
    <SectionFormulaire onSubmit={onSubmit} noValidate>
      <BlocBlocSection style={{ opacity: enCoursDeChargement ? 0.75 : 1, transition: 'opacity 0.3s ease' }}>
        <TitreSection>🔒 Sécurité et Mot de passe</TitreSection>
        <LigneChampsGrid>
          
          {/* Ancien mot de passe */}
          <GroupeChamp>
            <label>Ancien mot de passe</label>
            <InputWrapper $enErreur={!!erreurs.ancien}>
              <input 
                type={voirAncien ? "text" : "password"} 
                name="ancienMotDePasse" 
                value={formData.ancienMotDePasse || ''} 
                onChange={handleChange} 
                placeholder={erreurs.ancien || "••••••••••••"} 
                disabled={enCoursDeChargement}
              />
              <BoutonVisibilite type="button" onClick={() => setVoirAncien(!voirAncien)} tabIndex={-1} disabled={enCoursDeChargement}>
                {voirAncien ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                )}
              </BoutonVisibilite>
            </InputWrapper>
          </GroupeChamp>

          {/* Nouveau mot de passe */}
          <GroupeChamp>
            <label>Nouveau mot de passe</label>
            <InputWrapper $enErreur={!!erreurs.nouveau}>
              <input 
                type={voirNouveau ? "text" : "password"} 
                name="nouveauMotDePasse" 
                value={formData.nouveauMotDePasse || ''} 
                onChange={handleChange} 
                placeholder={erreurs.nouveau || "••••••••••••"} 
                disabled={enCoursDeChargement}
              />
              <BoutonVisibilite type="button" onClick={() => setVoirNouveau(!voirNouveau)} tabIndex={-1} disabled={enCoursDeChargement}>
                {voirNouveau ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                )}
              </BoutonVisibilite>
            </InputWrapper>
          </GroupeChamp>

          {/* Confirmation du mot de passe */}
          <GroupeChamp style={{ gridColumn: 'span 2' }}>
            <label>Confirmer le nouveau mot de passe</label>
            <InputWrapper $enErreur={!!erreurs.confirmation}>
              <input 
                type={voirConfirmation ? "text" : "password"} 
                name="confirmationMotDePasse" 
                value={formData.confirmationMotDePasse || ''} 
                onChange={handleChange} 
                placeholder={erreurs.confirmation || "••••••••••••"} 
                disabled={enCoursDeChargement}
              />
              <BoutonVisibilite type="button" onClick={() => setVoirConfirmation(!voirConfirmation)} tabIndex={-1} disabled={enCoursDeChargement}>
                {voirConfirmation ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                )}
              </BoutonVisibilite>
            </InputWrapper>
          </GroupeChamp>

        </LigneChampsGrid>
      </BlocBlocSection>
      
      <PiedFormulaire>
        <BoutonAction type="submit" disabled={enCoursDeChargement}>
          {enCoursDeChargement ? (
            <>
              <SpinnerChargement />
              Modification en cours...
            </>
          ) : (
            "Mettre à jour le mot de passe"
          )}
        </BoutonAction>
      </PiedFormulaire>
    </SectionFormulaire>
  );
}