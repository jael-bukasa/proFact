import React from 'react';
import styled from 'styled-components';

const ConteneurPrincipal = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 800px;
  width: 100%;
  margin: 1.5rem auto;
  padding: 2rem;
  background-color: #1E1E1E;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
`;

const TitreSection = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #FFFFFF;
  margin-bottom: 0.5rem;
`;

const GrilleInfos = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.2rem;
  margin-top: 1rem;
`;

const CarteInfo = styled.div`
  background-color: #121212;
  padding: 1.2rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const LabelInfo = styled.span`
  font-size: 0.75rem;
  text-transform: uppercase;
  color: #888888;
  letter-spacing: 0.5px;
`;

const ValeurInfo = styled.span`
  font-size: 1rem;
  font-weight: 500;
  color: #FFFFFF;
  text-transform: capitalize;
`;

export default function Profil({ utilisateurConnecte }) {
  const prenom = utilisateurConnecte?.prenom || 'Jaël';
  const nom = utilisateurConnecte?.nom || 'Mulaji';
  const postnom = utilisateurConnecte?.postnom || 'Bukasa';
  const role = utilisateurConnecte?.role || 'Facturier';
  const email = utilisateurConnecte?.email || 'jaelbuk08@gmail.com';

  return (
    <ConteneurPrincipal>
      <TitreSection>Mon Profil</TitreSection>
      <p style={{ color: '#888888', fontSize: '0.9rem' }}>
        Informations relatives à votre session active sur ProFact.
      </p>

      <GrilleInfos>
        <CarteInfo>
          <LabelInfo>Prénom</LabelInfo>
          <ValeurInfo>{prenom}</ValeurInfo>
        </CarteInfo>

        <CarteInfo>
          <LabelInfo>Nom</LabelInfo>
          <ValeurInfo>{nom}</ValeurInfo>
        </CarteInfo>

        <CarteInfo>
          <LabelInfo>Postnom</LabelInfo>
          <ValeurInfo>{postnom}</ValeurInfo>
        </CarteInfo>

        <CarteInfo>
          <LabelInfo>Rôle Système</LabelInfo>
          <ValeurInfo>{role}</ValeurInfo>
        </CarteInfo>

        <CarteInfo style={{ gridColumn: '1 / -1' }}>
          <LabelInfo>Adresse Email</LabelInfo>
          <ValeurInfo style={{ textTransform: 'none' }}>{email}</ValeurInfo>
        </CarteInfo>
      </GrilleInfos>
    </ConteneurPrincipal>
  );
}