import React, { useState } from 'react';
import styled from 'styled-components';
import Deconnexion from './profil/deconnexion/deconnexion';

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
  overflow-y: auto;
  box-sizing: border-box;

  /* Empêche les micro-sauts de mise en page quand la scrollbar apparaît */
  scrollbar-gutter: stable;

  /* --- SUPPORT FIREFOX --- */
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.2) transparent;

  /* --- SCROLLBAR WEBKIT (Chrome, Edge, Safari) --- */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
    margin: 8px 0;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.25);
    border-radius: 20px;
    min-height: 40px;
    transition: background 0.2s ease;
  }

  /* Devient vert au survol, au clic et pendant le défilement */
  &::-webkit-scrollbar-thumb:hover,
  &::-webkit-scrollbar-thumb:active {
    background: ${THEME.accentuation};
  }
`;

const SectionProfil = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.6rem;
  margin-bottom: 0.5rem;
  width: 100%;
  border-radius: 12px;
  cursor: pointer;
  background-color: ${props => props.$ouvert ? 'rgba(255, 255, 255, 0.08)' : 'transparent'};
  transition: background-color 0.2s ease, transform 0.2s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.08);
    transform: translateX(4px);
  }
`;

const Avatar = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background-color: #222;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.85rem;
  color: ${THEME.accentuation};
  border: 1px solid ${THEME.bordure};
`;

const TexteProfil = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex: 1;
`;

const Salutation = styled.span`
  color: ${THEME.texteSecondaire};
  font-size: 0.75rem;
`;

const NomUtilisateur = styled.span`
  font-weight: 600;
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${THEME.textePrincipal};
`;

const MenuDeroulantProfil = styled.div`
  margin-left: 1rem;
  padding-left: 1rem;
  border-left: 2px solid ${THEME.bordure};
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  animation: fadeIn 0.25s ease-in-out;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-5px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const OptionProfil = styled.div`
  padding: 0.5rem 0.7rem;
  border-radius: 8px;
  font-size: 0.85rem;
  color: ${THEME.texteSecondaire};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: rgba(34, 197, 94, 0.1);
    color: ${THEME.accentuation};
    transform: translateX(4px);
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
  color: ${props => props.$actif ? '#000' : THEME.texteSecondaire};
  transition: transform 0.25s ease, color 0.2s ease;
`;

const Fleche = styled.span`
  font-size: 0.8rem;
  color: ${THEME.texteSecondaire};
  opacity: ${props => (props.$actif ? '1' : '0.5')};
  transition: transform 0.25s ease, opacity 0.2s ease, color 0.2s ease;
`;

const ElementNav = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.75rem 0.9rem;
  border-radius: 12px;
  cursor: pointer;
  margin-bottom: 0.3rem;
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1),
              background-color 0.25s ease,
              box-shadow 0.25s ease,
              color 0.2s ease;

  ${props => props.$actif && `
    background-color: ${THEME.accentuation};
    color: #000000;
    font-weight: 600;
    box-shadow: 0 4px 12px rgba(34, 197, 94, 0.25);

    & span {
      color: #000000 !important;
    }
  `}

  ${props => !props.$actif && `
    color: ${THEME.textePrincipal};
    
    &:hover {
      background-color: rgba(255, 255, 255, 0.08);
      transform: translateX(6px);

      ${Icone} {
        transform: scale(1.18) rotate(-5deg);
        color: ${THEME.accentuation};
      }

      ${Fleche} {
        transform: translateX(3px);
        opacity: 1;
        color: ${THEME.accentuation};
      }
    }
  `}
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
  surDeconnexionEffective,
  utilisateurConnecte 
}) {
  const [profilOuvert, setProfilOuvert] = useState(false);
  const [enDeconnexion, setEnDeconnexion] = useState(false);

  const roleBrut = utilisateurConnecte?.role || 'Admin';
  const estAdmin = roleBrut.toLowerCase().includes('admin');

  const configurationMenu = estAdmin ? [
    { 
      titre: 'GESTION LOCATIVE', 
      elements: ['Tableau de bord'] 
    },
    { 
      titre: 'GESTION UTILISATEURS', 
      elements: ['Créer un compte', 'Gérer les comptes'] 
    },
    {
      titre: 'FINANCES',
      elements: ['Banques']
    }
  ] : [
    { 
      titre: 'ESPACE FACTURIER', 
      elements: ['Clients', 'Facturation'] 
    }
  ];

  const declencherDeconnexion = () => {
    setEnDeconnexion(true);
    setTimeout(() => {
      if (surDeconnexionEffective) {
        surDeconnexionEffective();
      }
    }, 1200);
  };

  return (
    <>
      {enDeconnexion && (
        <Deconnexion surDeconnexion={() => {}} />
      )}

      <ConteneurBarreLaterale>
        <SectionProfil 
          $ouvert={profilOuvert}
          onClick={() => setProfilOuvert(!profilOuvert)}
        >
          <Avatar>BJ</Avatar>
          <TexteProfil>
            <Salutation>ProFact</Salutation>
            <NomUtilisateur>Mon profil</NomUtilisateur>
          </TexteProfil>
          <span style={{ color: THEME.texteSecondaire, fontSize: '0.8rem', transform: profilOuvert ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>›</span>
        </SectionProfil>

        {profilOuvert && (
          <MenuDeroulantProfil>
            <OptionProfil onClick={() => auChangementOnglet('Voir Profil')}>👤 Voir les détails</OptionProfil>
            <OptionProfil onClick={() => auChangementOnglet('Parametres')}>⚙️ Paramètres</OptionProfil>
            <OptionProfil onClick={declencherDeconnexion}>🚪 Déconnexion</OptionProfil>
          </MenuDeroulantProfil>
        )}

        {configurationMenu.map(section => (
          <div key={section.titre}>
            <TitreSectionNav>{section.titre}</TitreSectionNav>
            {section.elements.map(element => (
              <ElementNav 
                key={element} 
                $actif={ongletActif === element} 
                onClick={() => auChangementOnglet(element)}
              >
                <Icone $actif={ongletActif === element}>
                  {obtenirIconeNav(element)}
                </Icone>
                <Libelle>{element}</Libelle>
                <Fleche $actif={ongletActif === element}>›</Fleche>
              </ElementNav>
            ))}
          </div>
        ))}
      </ConteneurBarreLaterale>
    </>
  );
}