import React, { useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const THEME = {
  fondCarte: '#1E1E1E',
  accentuation: '#AEEA00',
  textePrincipal: '#FFFFFF',
  texteSecondaire: '#888888',
  bordure: '#2A2A2A',
};

const CardFormulaire = styled(motion.div)`
  background-color: ${THEME.fondCarte};
  border: 1px solid ${THEME.bordure};
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  will-change: transform, opacity;
`;

const TitreFormulaire = styled.h2`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${THEME.accentuation};
`;

const GrilleChamps = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const GroupeChamp = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const Etiquette = styled.label`
  color: ${THEME.texteSecondaire};
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
`;

const ChampSaisie = styled.input`
  background-color: #121212;
  color: ${THEME.textePrincipal};
  border: 1px solid ${THEME.bordure};
  border-radius: 8px;
  padding: 0.65rem 0.8rem;
  font-size: 0.85rem;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    border-color: ${THEME.accentuation};
    box-shadow: 0 0 0 3px rgba(174, 234, 0, 0.15);
  }
`;

const SelecteurSaisie = styled.select`
  background-color: #121212;
  color: ${THEME.textePrincipal};
  border: 1px solid ${THEME.bordure};
  border-radius: 8px;
  padding: 0.65rem 0.8rem;
  font-size: 0.85rem;
  outline: none;
  cursor: pointer;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    border-color: ${THEME.accentuation};
    box-shadow: 0 0 0 3px rgba(174, 234, 0, 0.15);
  }

  option {
    background-color: #121212;
    color: ${THEME.textePrincipal};
  }
`;

/* Styles pour le groupe Radio (Devise USD / CDF) */
const ConteneurRadioGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  height: 100%;
  padding-top: 0.2rem;
`;

const OptionRadio = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${THEME.textePrincipal};
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;

  input[type='radio'] {
    appearance: none;
    width: 18px;
    height: 18px;
    border: 2px solid ${THEME.bordure};
    border-radius: 50%;
    outline: none;
    background-color: #121212;
    cursor: pointer;
    display: grid;
    place-content: center;
    transition: all 0.2s ease;

    &:checked {
      border-color: ${THEME.accentuation};
      background-color: ${THEME.accentuation};
    }

    &:checked::before {
      content: '';
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: #000000;
    }
  }
`;

const ZoneActionsFormulaire = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.8rem;
  margin-top: 1.2rem;
`;

const BoutonAction = styled(motion.button)`
  background-color: ${props => props.$variante === 'secondaire' ? 'transparent' : THEME.accentuation};
  color: ${props => props.$variante === 'secondaire' ? THEME.textePrincipal : '#000000'};
  border: ${props => props.$variante === 'secondaire' ? `1px solid ${THEME.bordure}` : 'none'};
  padding: 0.65rem 1.2rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: border-color 0.2s ease;

  &:hover {
    opacity: 0.95;
  }

  &:focus {
    outline: 2px solid ${THEME.textePrincipal};
  }
`;

const variantesAnimationDouce = {
  initial: { opacity: 0, y: -15, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -10, scale: 0.98, transition: { duration: 0.25, ease: 'easeInOut' } }
};

export default function NouveauClient({
  formulaire,
  changerChamp,
  soumettreFormulaire,
  reinitialiserFormulaire,
  clientEnEdition,
  champFocusRef
}) {
  const postNomRef = useRef(null);
  const prenomRef = useRef(null);
  const typeClientRef = useRef(null);
  const boutonSoumettreRef = useRef(null);

  const gererToucheEntree = (e, elementSuivantRef) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (elementSuivantRef && elementSuivantRef.current) {
        elementSuivantRef.current.focus();
      }
    }
  };

  return (
    <CardFormulaire
      variants={variantesAnimationDouce}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <TitreFormulaire>
        {clientEnEdition ? `Modifier Client (${clientEnEdition.matricule})` : 'Enregistrer un nouveau client'}
      </TitreFormulaire>

      <form onSubmit={soumettreFormulaire}>
        <GrilleChamps>
          <GroupeChamp>
            <Etiquette>Nom</Etiquette>
            <ChampSaisie 
              ref={champFocusRef}
              type="text" 
              name="nom" 
              value={formulaire.nom || ''} 
              onChange={changerChamp}
              onKeyDown={(e) => gererToucheEntree(e, postNomRef)}
              required 
              placeholder="Ex: Kabange"
            />
          </GroupeChamp>

          <GroupeChamp>
            <Etiquette>Post-nom</Etiquette>
            <ChampSaisie 
              ref={postNomRef}
              type="text" 
              name="postNom" 
              value={formulaire.postNom || ''} 
              onChange={changerChamp}
              onKeyDown={(e) => gererToucheEntree(e, prenomRef)}
              placeholder="Ex: Mukendi"
            />
          </GroupeChamp>

          <GroupeChamp>
            <Etiquette>Prénom</Etiquette>
            <ChampSaisie 
              ref={prenomRef}
              type="text" 
              name="prenom" 
              value={formulaire.prenom || ''} 
              onChange={changerChamp}
              onKeyDown={(e) => gererToucheEntree(e, typeClientRef)}
              required 
              placeholder="Ex: Christian"
            />
          </GroupeChamp>

          {/* 1. SÉLECTEUR DU TYPE DE CLIENT */}
          <GroupeChamp>
            <Etiquette>Type de Client</Etiquette>
            <SelecteurSaisie
              ref={typeClientRef}
              name="typeClient"
              value={formulaire.typeClient || 'locataire'}
              onChange={changerChamp}
            >
              <option value="locataire">Locataire</option>
              <option value="electricite">Électricité</option>
              <option value="eau">Eau</option>
              <option value="divers">Divers</option>
            </SelecteurSaisie>
          </GroupeChamp>

          {/* 2. BOUTONS RADIO POUR LA DEVISE (USD / CDF) */}
          <GroupeChamp>
            <Etiquette>Devise de paiement</Etiquette>
            <ConteneurRadioGroup>
              <OptionRadio>
                <input 
                  type="radio" 
                  name="devise" 
                  value="USD" 
                  checked={(formulaire.devise || 'USD') === 'USD'} 
                  onChange={changerChamp}
                />
                USD ($)
              </OptionRadio>

              <OptionRadio>
                <input 
                  type="radio" 
                  name="devise" 
                  value="CDF" 
                  checked={formulaire.devise === 'CDF'} 
                  onChange={changerChamp}
                />
                CDF (FC)
              </OptionRadio>
            </ConteneurRadioGroup>
          </GroupeChamp>
        </GrilleChamps>

        <ZoneActionsFormulaire>
          <BoutonAction 
            type="button" 
            $variante="secondaire" 
            onClick={reinitialiserFormulaire}
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.02 }}
          >
            Annuler
          </BoutonAction>
          <BoutonAction 
            ref={boutonSoumettreRef} 
            type="submit"
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.02 }}
          >
            {clientEnEdition ? 'Mettre à jour' : 'Enregistrer'}
          </BoutonAction>
        </ZoneActionsFormulaire>
      </form>
    </CardFormulaire>
  );
}