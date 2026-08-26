import React from 'react';
import styled from 'styled-components';

const CarteProfil = styled.div`
  background: rgba(30, 30, 30, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 2rem;
  max-width: 600px;
  backdrop-filter: blur(12px);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 1.5rem;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
`;

const EnTeteProfil = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding-bottom: 1.5rem;
`;

const AvatarGrand = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: linear-gradient(135deg, #AEEA00 0%, #769b00 100%);
  color: #000000;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.5rem;
  box-shadow: 0 4px 14px rgba(174, 234, 0, 0.3);
`;

const InfoUtilisateur = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`;

const NomComplet = styled.h2`
  font-size: 1.4rem;
  color: #FFFFFF;
  font-weight: 600;
  text-transform: capitalize;
`;

const BadgeRole = styled.span`
  background-color: rgba(174, 234, 0, 0.1);
  color: #AEEA00;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  width: fit-content;
  border: 1px solid rgba(174, 234, 0, 0.2);
`;

const GrilleDetails = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.2rem;
`;

const ChampDetail = styled.div`
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 1rem;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`;

const Label = styled.span`
  font-size: 0.75rem;
  color: #888888;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Valeur = styled.span`
  font-size: 0.95rem;
  color: #FFFFFF;
  font-weight: 500;
  text-transform: capitalize;
`;

export default function Profil({ utilisateur }) {
  // Sécurisation et fusion intelligente des données
  const prenomBrut = utilisateur?.prenom || 'Jaël';
  const nomBrut = utilisateur?.nom || 'Mulaji';
  const postnomBrut = utilisateur?.postnom || 'Bukasa';

  const utilisateurSecours = {
    prenom: prenomBrut,
    nom: nomBrut,
    postnom: postnomBrut,
    role: utilisateur?.role || 'Administrateur',
    email: utilisateur?.email || 'jaelbuk08@gmail.com',
  };

  const initiales = `${utilisateurSecours.prenom?.charAt(0) || ''}${utilisateurSecours.nom?.charAt(0) || ''}`.toUpperCase();

  return (
    <CarteProfil>
      <EnTeteProfil>
        <AvatarGrand>{initiales}</AvatarGrand>
        <InfoUtilisateur>
          <NomComplet>{`${utilisateurSecours.prenom} ${utilisateurSecours.nom} ${utilisateurSecours.postnom}`}</NomComplet>
          <BadgeRole>{utilisateurSecours.role}</BadgeRole>
        </InfoUtilisateur>
      </EnTeteProfil>

      <GrilleDetails>
        <ChampDetail>
          <Label>Prénom</Label>
          <Valeur>{utilisateurSecours.prenom}</Valeur>
        </ChampDetail>
        <ChampDetail>
          <Label>Nom</Label>
          <Valeur>{utilisateurSecours.nom}</Valeur>
        </ChampDetail>
        <ChampDetail>
          <Label>Postnom</Label>
          <Valeur>{utilisateurSecours.postnom}</Valeur>
        </ChampDetail>
        <ChampDetail>
          <Label>Adresse e-mail</Label>
          <Valeur style={{ textTransform: 'none' }}>{utilisateurSecours.email}</Valeur>
        </ChampDetail>
      </GrilleDetails>
    </CarteProfil>
  );
}