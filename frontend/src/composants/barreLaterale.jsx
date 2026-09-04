import React, { useState } from 'react';
import styled from 'styled-components';

const THEME = {
  fondSidebar: '#000000',
  fondCarte: '#1E1E1E',
  accentuation: '#22c55e',
  textePrincipal: '#FFFFFF',
  texteSecondaire: '#888888',
  bordure: '#2A2A2A'
};

const ConteneurBarreLaterale = styled.aside`
  width: 250px;
  height: 100vh;
  position: sticky;
  top: 0;
  flex-shrink: 0;
  background-color: ${THEME.fondSidebar};
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  border-right: 1px solid ${THEME.bordure};
  box-sizing: border-box;
  overflow-y: auto;
`;

const SectionProfil = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.6rem;
  margin-bottom: 0.4rem;
  width: 100%;
  border-radius: 12px;
  cursor: pointer;
  background-color: ${props => props.$actif ? 'rgba(34, 197, 94, 0.1)' : 'transparent'};
  border: 1px solid ${props => props.$actif ? 'rgba(34, 197, 94, 0.3)' : 'transparent'};
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background-color: rgba(255, 255, 255, 0.06);
    border-color: rgba(255, 255, 255, 0.1);
  }
`;

const Avatar = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background-color: #1a1a1a;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.85rem;
  color: ${THEME.accentuation};
  border: 1px solid ${THEME.bordure};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
`;

const TexteProfil = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex: 1;
`;

const Salutation = styled.span`
  color: ${THEME.texteSecondaire};
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const NomUtilisateur = styled.span`
  font-weight: 600;
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${THEME.textePrincipal};
  text-transform: capitalize;
`;

const Fleche = styled.span`
  font-size: 0.85rem;
  color: ${THEME.texteSecondaire};
  display: inline-flex;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: ${props => props.$ouvert ? 'rotate(90deg)' : 'rotate(0deg)'};
`;

/* Menu déroulant élégant avec animation de glissement et d'opacité */
const MenuDeroulantProfil = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding-left: 1rem;
  margin-left: 1.2rem;
  margin-bottom: 1.2rem;
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  
  /* Animation d'apparition fluide */
  max-height: ${props => props.$ouvert ? '200px' : '0'};
  opacity: ${props => props.$ouvert ? '1' : '0'};
  overflow: hidden;
  transition: max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease-in-out;
`;

const SousElementNav = styled.div`
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.6rem 0.8rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.85rem;
  color: ${props => props.$actif ? '#000000' : THEME.textePrincipal};
  background-color: ${props => props.$actif ? THEME.accentuation : 'transparent'};
  font-weight: ${props => props.$actif ? '600' : '400'};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => props.$actif ? THEME.accentuation : 'rgba(255, 255, 255, 0.08)'};
    transform: translateX(3px);
  }
`;

const TitreSectionNav = styled.h3`
  color: ${THEME.texteSecondaire};
  text-transform: uppercase;
  font-size: 0.7rem;
  letter-spacing: 1px;
  margin-bottom: 0.6rem;
  margin-top: 1.2rem;
`;

const Icone = styled.span`
  font-size: 1.1rem;
`;

const ElementNav = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.75rem 0.9rem;
  border-radius: 12px;
  cursor: pointer;
  margin-bottom: 0.3rem;
  color: ${THEME.textePrincipal};
  transition: all 0.2s ease;

  ${props => props.$actif && `
    background-color: ${THEME.accentuation};
    color: #000000;
    font-weight: 600;
    box-shadow: 0 4px 12px rgba(34, 197, 94, 0.25);
  `}

  &:hover {
    background-color: ${props => props.$actif ? THEME.accentuation : 'rgba(255, 255, 255, 0.08)'};
  }
`;

const Libelle = styled.span`
  flex: 1;
  font-size: 0.9rem;
`;

const obtenirIconeNav = (element) => {
  switch (element) {
    case 'Tableau de bord': return '📊';
    case 'Clients': return '👥';
    case 'Facturation': return '📄';
    case 'Créer un compte': return '➕';
    case 'Gérer les comptes': return '⚙️';
    case 'Banques': return '🏦';
    default: return '📁';
  }
};

export default function BarreLaterale({ 
  ongletActif, 
  auChangementOnglet, 
  utilisateurConnecte 
}) {
  const [profilDeroule, setProfilDeroule] = useState(
    ongletActif === 'Parametres' || ongletActif === 'Deconnexion' || ongletActif === 'Profil'
  );

  const roleBrut = utilisateurConnecte?.role || 'Admin';
  const estAdmin = roleBrut.toLowerCase().includes('admin');

  const prenomUser = utilisateurConnecte?.prenom || '';
  const nomUser = utilisateurConnecte?.nom || '';
  const initiales = `${prenomUser.charAt(0)}${nomUser.charAt(0)}`.toUpperCase() || 'U';
  const nomAffichage = prenomUser ? `${prenomUser} ${nomUser}`.trim() : 'Mon profil';

  const configurationMenu = estAdmin ? [
    { titre: 'GESTION LOCATIVE', elements: ['Tableau de bord'] },
    { titre: 'GESTION UTILISATEURS', elements: ['Créer un compte', 'Gérer les comptes'] },
    { titre: 'FINANCES', elements: ['Banques'] }
  ] : [
    { titre: 'ESPACE FACTURIER', elements: ['Clients', 'Facturation'] }
  ];

  return (
    <ConteneurBarreLaterale>
      {/* Bloc principal du profil avec animation de la flèche */}
      <SectionProfil 
        $actif={ongletActif === 'Parametres' || ongletActif === 'Deconnexion' || ongletActif === 'Profil'}
        onClick={() => setProfilDeroule(!profilDeroule)}
      >
        <Avatar>{initiales}</Avatar>
        <TexteProfil>
          <Salutation>ProFact</Salutation>
          <NomUtilisateur>{nomAffichage}</NomUtilisateur>
        </TexteProfil>
        <Fleche $ouvert={profilDeroule}>›</Fleche>
      </SectionProfil>

      {/* Menu déroulant avec effet fluide d'ouverture et glissement latéral au survol */}
      <MenuDeroulantProfil $ouvert={profilDeroule}>
        <SousElementNav 
          $actif={ongletActif === 'Parametres' || ongletActif === 'Profil'}
          onClick={() => auChangementOnglet('Parametres')}
        >
          <span>⚙️</span>
          <span>Paramètres</span>
        </SousElementNav>

        <SousElementNav 
          $actif={ongletActif === 'Deconnexion'}
          onClick={() => auChangementOnglet('Deconnexion')}
        >
          <span>🚪</span>
          <span>Déconnexion</span>
        </SousElementNav>
      </MenuDeroulantProfil>

      {configurationMenu.map(section => (
        <div key={section.titre}>
          <TitreSectionNav>{section.titre}</TitreSectionNav>
          {section.elements.map(element => (
            <ElementNav 
              key={element} 
              $actif={ongletActif === element} 
              onClick={() => auChangementOnglet(element)}
            >
              <Icone>{obtenirIconeNav(element)}</Icone>
              <Libelle>{element}</Libelle>
            </ElementNav>
          ))}
        </div>
      ))}
    </ConteneurBarreLaterale>
  );
}