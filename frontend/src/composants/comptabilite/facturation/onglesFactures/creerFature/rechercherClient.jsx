import React from 'react';
import styled, { keyframes } from 'styled-components';
import { FiLoader, FiCheckSquare } from 'react-icons/fi';

const fadeInOut = keyframes`
  from { opacity: 0; transform: translateY(-6px); }
  to { opacity: 1; transform: translateY(0); }
`;

const GroupeChamp = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  position: relative;
  grid-column: 1 / -1;
`;

const LabelChamp = styled.label`
  font-size: 0.82rem;
  font-weight: 600;
  color: #CCC;
`;

const ConteneurInputRecherche = styled.div`
  position: relative;
  width: 100%;
`;

const InputChamp = styled.input`
  background-color: #121212;
  border: 1px solid #2A2A2A;
  border-radius: 8px;
  padding: 0.75rem;
  padding-right: 2.5rem;
  color: #FFFFFF;
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s;
  width: 100%;

  &:focus {
    border-color: #AEEA00;
  }
`;

const IconeChargementRecherche = styled.div`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #AEEA00;
  display: flex;
  align-items: center;
  animation: rotation 1s linear infinite;

  @keyframes rotation {
    from { transform: translateY(-50%) rotate(0deg); }
    to { transform: translateY(-50%) rotate(360deg); }
  }
`;

const ListeSuggestions = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: #121212;
  border: 1px solid #2A2A2A;
  border-radius: 8px;
  max-height: 180px;
  overflow-y: auto;
  list-style: none;
  padding: 4px;
  margin: 6px 0 0 0;
  z-index: 10;
  box-shadow: 0 8px 24px rgba(0,0,0,0.6);
  animation: ${fadeInOut} 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
`;

const ElementSuggestion = styled.li`
  padding: 0.7rem 0.9rem;
  font-size: 0.9rem;
  cursor: pointer;
  color: #FFFFFF;
  border-radius: 6px;
  transition: background-color 0.15s ease, color 0.15s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    background-color: rgba(174, 234, 0, 0.12);
    color: #AEEA00;
  }
`;

const TexteSurligne = styled.span`
  color: #AEEA00;
  font-weight: 700;
`;

const InfoLotClient = styled.div`
  background-color: #121212;
  border: 1px solid #2A2A2A;
  border-radius: 8px;
  padding: 0.85rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #AEEA00;
  font-size: 0.9rem;
  font-weight: 500;

  span {
    color: #FFFFFF;
    font-weight: 700;
  }
`;

export default function RechercherClient({
  modeSelection,
  saisieRechercheClient,
  onSaisieChange,
  afficherSuggestions,
  onFocusSuggestions,
  enCoursDeRecherche,
  clientsFiltresParRecherche,
  clientsFiltresParType,
  onSelectClient
}) {
  const formaterTexteAvecSurlignage = (texteComplet, query) => {
    if (!query.trim()) return texteComplet;
    const index = texteComplet.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) return texteComplet;

    const avant = texteComplet.substring(0, index);
    const correspondance = texteComplet.substring(index, index + query.length);
    const apres = texteComplet.substring(index + query.length);

    return (
      <>
        {avant}
        <TexteSurligne>{correspondance}</TexteSurligne>
        {apres}
      </>
    );
  };

  return (
    <GroupeChamp>
      {modeSelection === 'un' ? (
        <>
          <LabelChamp>Rechercher le client (Nom, Postnom, Prénom) *</LabelChamp>
          <ConteneurInputRecherche>
            <InputChamp 
              type="text" 
              placeholder="Cliquez ou tapez pour chercher un client..." 
              value={saisieRechercheClient} 
              onChange={onSaisieChange}
              onFocus={onFocusSuggestions}
              required
            />
            {enCoursDeRecherche && (
              <IconeChargementRecherche>
                <FiLoader size={16} />
              </IconeChargementRecherche>
            )}
          </ConteneurInputRecherche>

          {afficherSuggestions && (
            <ListeSuggestions>
              {enCoursDeRecherche ? (
                <ElementSuggestion style={{ justifyContent: 'center', color: '#888' }}>
                  Chargement des clients...
                </ElementSuggestion>
              ) : clientsFiltresParRecherche.length === 0 ? (
                <ElementSuggestion style={{ justifyContent: 'center', color: '#888', cursor: 'default' }}>
                  Aucun client trouvé
                </ElementSuggestion>
              ) : (
                clientsFiltresParRecherche.map((cli, index) => {
                  const nomComplet = `${cli.nom || ''} ${cli.postNom || ''} ${cli.prenom || ''}`.trim();
                  const texteAffichage = `${nomComplet} ${cli.matricule ? `(${cli.matricule})` : ''}`;
                  return (
                    <ElementSuggestion 
                      key={cli.id || index}
                      onClick={() => onSelectClient(cli)}
                    >
                      <span>{formaterTexteAvecSurlignage(texteAffichage, saisieRechercheClient)}</span>
                    </ElementSuggestion>
                  );
                })
              )}
            </ListeSuggestions>
          )}
        </>
      ) : (
        <>
          <LabelChamp>Sélection globale par catégorie *</LabelChamp>
          <InfoLotClient>
            <FiCheckSquare size={18} />
            <div>
              Tous les clients de la catégorie <span>({clientsFiltresParType.length} client{clientsFiltresParType.length > 1 ? 's' : ''})</span> seront pris en compte pour la facturation en masse.
            </div>
          </InfoLotClient>
        </>
      )}
    </GroupeChamp>
  );
}