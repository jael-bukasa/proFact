import React from 'react';
import styled from 'styled-components';

const THEME = {
  fondSidebar: '#000000',
  fondCarte: '#1E1E1E',
  accentuation: '#AEEA00',
  textePrincipal: '#FFFFFF',
  texteSecondaire: '#888888',
  bordure: '#2A2A2A'
};

const ConteneurBarreLaterale = styled.aside`
  width: 250px;
  flex-shrink: 0;
  background-color: ${THEME.fondSidebar};
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  border-right: 1px solid ${THEME.bordure};
  overflow-y: auto;
`;

const SectionProfil = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 1.5rem;
  width: 100%;
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
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const TexteProfil = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
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
    box-shadow: 0 4px 12px rgba(174, 234, 0, 0.25);

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
    case 'Clients': return '👥'; // 👈 Mis à jour
    case 'Logements': return '🏠';
    case 'Facturation': return '📄';
    case 'Paiements': return '💳';
    case 'Rapports': return '📈';
    default: return '📁';
  }
};

export default function BarreLaterale({ ongletActif, auChangementOnglet }) {
  const configurationMenu = [
    { 
      titre: 'GESTION LOCATIVE', 
      elements: ['Tableau de bord', 'Clients', 'Logements'] // 👈 Mis à jour
    },
    { 
      titre: 'COMPTABILITÉ', 
      elements: ['Facturation', 'Paiements', 'Rapports'] 
    }
  ];

  return (
    <ConteneurBarreLaterale>
      <SectionProfil>
        <Avatar>PF</Avatar>
        <TexteProfil>
          <Salutation>ProFact</Salutation>
          <NomUtilisateur>Mon profil</NomUtilisateur>
        </TexteProfil>
      </SectionProfil>

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
  );
}