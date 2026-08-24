import React, { useRef, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';

const THEME = {
  fondCarte: '#1E1E1E',
  accentuation: '#AEEA00',
  textePrincipal: '#FFFFFF',
  texteSecondaire: '#888888',
  bordure: '#2A2A2A',
  fondChamp: '#121212'
};

const vibrationEtClignotement = keyframes`
  0% { transform: translateX(0); border-color: #FF5252; background-color: rgba(255, 82, 82, 0.2); }
  25% { transform: translateX(-4px); border-color: #FFAAAA; background-color: #121212; }
  50% { transform: translateX(4px); border-color: #FF5252; background-color: rgba(255, 82, 82, 0.2); }
  75% { transform: translateX(-2px); border-color: #FFAAAA; background-color: #121212; }
  100% { transform: translateX(0); border-color: #FF5252; background-color: rgba(255, 82, 82, 0.1); }
`;

const CarteFormulaire = styled.form`
  background-color: ${THEME.fondCarte};
  padding: 1.2rem;
  border-radius: 12px;
  border: 1px solid ${THEME.bordure};
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 950px;
  margin: 0 auto;
`;

const GroupeSection = styled.fieldset`
  border: 1px solid ${THEME.bordure};
  border-radius: 10px;
  padding: 0.9rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const TitreSection = styled.legend`
  color: ${THEME.accentuation};
  font-size: 0.78rem;
  font-weight: 600;
  padding: 0 0.4rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const GrilleChamps = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.75rem;
  align-items: stretch;
`;

const ChampConteneur = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  gap: 0.2rem;
  
  ${props => props.$pleinLargeur && css`
    grid-column: 1 / -1;
  `}
`;

const EnteteEtiquette = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Etiquette = styled.label`
  color: ${THEME.texteSecondaire};
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  line-height: 1.1;
`;

const CompteurCaracteres = styled.span`
  font-size: 0.65rem;
  font-weight: 600;
  color: ${props => props.$limiteAtteinte ? '#FF5252' : THEME.texteSecondaire};
`;

const ChampInterneWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
`;

const EntreeTexte = styled.input`
  width: 100%;
  background-color: ${props => props.$readOnly ? '#181818' : THEME.fondChamp};
  border: 1px solid ${props => props.$hasError ? '#FF5252' : THEME.bordure};
  border-radius: 6px;
  padding: 0.45rem ${props => props.$hasError ? '6.5rem' : '0.6rem'} 0.45rem 0.6rem;
  color: ${props => props.$readOnly ? '#AAAAAA' : THEME.textePrincipal};
  font-size: 0.8rem;
  cursor: ${props => props.$readOnly ? 'not-allowed' : 'text'};
  opacity: ${props => props.$readOnly ? '0.8' : '1'};

  ${props => props.$hasError && css`
    animation: ${vibrationEtClignotement} 0.5s ease-in-out;
  `}

  &::placeholder {
    color: ${props => props.$hasError ? '#FF5252' : '#666666'};
    opacity: 1;
  }

  &:focus {
    outline: none;
    border-color: ${props => props.$readOnly ? THEME.bordure : (props.$hasError ? '#FF5252' : THEME.accentuation)};
  }
`;

const ZoneTexte = styled.textarea`
  width: 100%;
  background-color: ${THEME.fondChamp};
  border: 1px solid ${props => props.$hasError ? '#FF5252' : THEME.bordure};
  border-radius: 6px;
  padding: 0.5rem;
  color: ${THEME.textePrincipal};
  font-size: 0.8rem;
  font-family: inherit;
  min-height: 56px;
  max-height: 110px;
  resize: vertical;
  word-break: break-word;
  overflow-wrap: break-word;

  ${props => props.$hasError && css`
    animation: ${vibrationEtClignotement} 0.5s ease-in-out;
  `}

  &::placeholder {
    color: ${props => props.$hasError ? '#FF5252' : '#666666'};
    opacity: 1;
  }

  &:focus {
    outline: none;
    border-color: ${props => props.$hasError ? '#FF5252' : THEME.accentuation};
  }
`;

const SelectEntree = styled.select`
  width: 100%;
  background-color: ${THEME.fondChamp};
  border: 1px solid ${props => props.$hasError ? '#FF5252' : THEME.bordure};
  border-radius: 6px;
  padding: 0.45rem ${props => props.$hasError ? '6.5rem' : '2.2rem'} 0.45rem 0.6rem;
  color: ${THEME.textePrincipal};
  font-size: 0.8rem;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23888888' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.6rem center;
  background-size: 0.9rem;

  &:focus {
    outline: none;
    border-color: ${props => props.$hasError ? '#FF5252' : THEME.accentuation};
  }

  option {
    background-color: #121212;
    color: ${THEME.textePrincipal};
  }
`;

const MessageErreurInterne = styled.span`
  position: absolute;
  right: ${props => props.$isSelect ? '2rem' : '0.6rem'};
  color: #FF5252;
  font-size: 0.6rem;
  font-weight: 600;
  pointer-events: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 50%;
  background-color: rgba(18, 18, 18, 0.85);
  padding: 0.1rem 0.2rem;
  border-radius: 3px;
`;

const BarreBoutons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 0.5rem;
`;

const BoutonEnregistrer = styled.button`
  background-color: ${THEME.accentuation};
  color: #000000;
  border: none;
  padding: 0.55rem 1.4rem;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  font-size: 0.82rem;
  &:hover { opacity: 0.9; }
`;

const BoutonReinitialiser = styled.button`
  background-color: transparent;
  color: ${THEME.texteSecondaire};
  border: 1px solid ${THEME.bordure};
  padding: 0.55rem 1.4rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  font-size: 0.82rem;
  &:hover { color: ${THEME.textePrincipal}; border-color: #555; }
`;

export default function EnregistrementClients({ 
  formulaire = {}, 
  erreurs = {}, 
  handleChange, 
  onReset, 
  onSubmit 
}) {
  const refs = useRef({});
  const MAX_CARACTERES_DESIGNATION = 500;
  const longueurDesignation = (formulaire.designation ?? '').length;
  const limiteAtteinte = longueurDesignation >= MAX_CARACTERES_DESIGNATION;

  const gererToucheEntree = (e) => {
    if (e.target.tagName === 'TEXTAREA') return;

    if (e.key === 'Enter') {
      const listeChamps = Object.keys(refs.current).filter(k => k !== 'submitButton');
      const nomChampActuel = e.target.name;
      const indexActuel = listeChamps.indexOf(nomChampActuel);
      
      if (indexActuel > -1 && indexActuel < listeChamps.length - 1) {
        e.preventDefault();
        refs.current[listeChamps[indexActuel + 1]]?.focus();
      } else if (indexActuel === listeChamps.length - 1) {
        e.preventDefault();
        refs.current['submitButton']?.focus();
      }
    }
  };

  useEffect(() => {
    const clesErreurs = Object.keys(erreurs || {}).filter(k => erreurs[k]);
    if (clesErreurs.length > 0) {
      const premierChamp = clesErreurs[0];
      if (refs.current[premierChamp]) {
        refs.current[premierChamp].scrollIntoView({ behavior: 'smooth', block: 'center' });
        refs.current[premierChamp].focus();
      }
    }
  }, [erreurs]);

  return (
    <CarteFormulaire onSubmit={onSubmit} noValidate>
      <GroupeSection>
        <TitreSection>Bail & Identification</TitreSection>
        <GrilleChamps>
          <ChampConteneur>
            <Etiquette>N° Bail *</Etiquette>
            <ChampInterneWrapper>
              <EntreeTexte ref={el => refs.current.bail = el} name="bail" value={formulaire.bail ?? ''} onChange={handleChange} onKeyDown={gererToucheEntree} placeholder="Ex: BAIL-001" $hasError={!!erreurs.bail} />
              {erreurs.bail && <MessageErreurInterne>{typeof erreurs.bail === 'string' ? erreurs.bail : "Requis"}</MessageErreurInterne>}
            </ChampInterneWrapper>
          </ChampConteneur>
          
          <ChampConteneur>
            <Etiquette>Date Bail * (AAAA-MM-JJ)</Etiquette>
            <ChampInterneWrapper>
              <EntreeTexte ref={el => refs.current.dateBail = el} type="date" name="dateBail" value={formulaire.dateBail ?? ''} onChange={handleChange} onKeyDown={gererToucheEntree} $hasError={!!erreurs.dateBail} />
              {erreurs.dateBail && <MessageErreurInterne>{typeof erreurs.dateBail === 'string' ? erreurs.dateBail : "Requis"}</MessageErreurInterne>}
            </ChampInterneWrapper>
          </ChampConteneur>

                    <ChampConteneur>
            <Etiquette>Logement (LOC) *</Etiquette>
            <ChampInterneWrapper>
              <EntreeTexte ref={el => refs.current.logement = el} name="logement" value={formulaire.logement ?? ''} onChange={handleChange} onKeyDown={gererToucheEntree} placeholder="Ex: A12" $hasError={!!erreurs.logement} />
              {erreurs.logement && <MessageErreurInterne>{typeof erreurs.logement === 'string' ? erreurs.logement : "Requis"}</MessageErreurInterne>}
            </ChampInterneWrapper>
          </ChampConteneur>

          <ChampConteneur>
            <Etiquette>Matricule *</Etiquette>
            <ChampInterneWrapper>
              <EntreeTexte name="matricule" value={formulaire.matricule ?? 'MAT-001'} readOnly $readOnly={true} />
            </ChampInterneWrapper>
          </ChampConteneur>

          <ChampConteneur>
            <Etiquette>Nom *</Etiquette>
            <ChampInterneWrapper>
              <EntreeTexte ref={el => refs.current.nom = el} name="nom" value={formulaire.nom ?? ''} onChange={handleChange} onKeyDown={gererToucheEntree} placeholder="Ex: Mulaji" $hasError={!!erreurs.nom} />
              {erreurs.nom && <MessageErreurInterne>{typeof erreurs.nom === 'string' ? erreurs.nom : "Requis"}</MessageErreurInterne>}
            </ChampInterneWrapper>
          </ChampConteneur>

          <ChampConteneur>
            <Etiquette>Post-nom *</Etiquette>
            <ChampInterneWrapper>
              <EntreeTexte ref={el => refs.current.postNom = el} name="postNom" value={formulaire.postNom ?? ''} onChange={handleChange} onKeyDown={gererToucheEntree} placeholder="Ex: Jael" $hasError={!!erreurs.postNom} />
              {erreurs.postNom && <MessageErreurInterne>{typeof erreurs.postNom === 'string' ? erreurs.postNom : "Requis"}</MessageErreurInterne>}
            </ChampInterneWrapper>
          </ChampConteneur>
          
          <ChampConteneur>
            <Etiquette>Prénom *</Etiquette>
            <ChampInterneWrapper>
              <EntreeTexte ref={el => refs.current.prenom = el} name="prenom" value={formulaire.prenom ?? ''} onChange={handleChange} onKeyDown={gererToucheEntree} placeholder="Ex: Bukasa" $hasError={!!erreurs.prenom} />
              {erreurs.prenom && <MessageErreurInterne>{typeof erreurs.prenom === 'string' ? erreurs.prenom : "Requis"}</MessageErreurInterne>}
            </ChampInterneWrapper>
          </ChampConteneur>

          <ChampConteneur>
            <Etiquette>Adresse</Etiquette>
            <ChampInterneWrapper>
              <EntreeTexte ref={el => refs.current.adresse = el} name="adresse" value={formulaire.adresse ?? ''} onChange={handleChange} onKeyDown={gererToucheEntree} />
            </ChampInterneWrapper>
          </ChampConteneur>

          <ChampConteneur>
            <Etiquette>Pays</Etiquette>
            <ChampInterneWrapper>
              <EntreeTexte ref={el => refs.current.pays = el} name="pays" value={formulaire.pays ?? 'RDC'} onChange={handleChange} onKeyDown={gererToucheEntree} />
            </ChampInterneWrapper>
          </ChampConteneur>
        </GrilleChamps>
      </GroupeSection>

      <GroupeSection>
        <TitreSection>Détails Facture & Période</TitreSection>
        <GrilleChamps>
          <ChampConteneur $pleinLargeur={true}>
            <EnteteEtiquette>
              <Etiquette>Désignation</Etiquette>
              <CompteurCaracteres $limiteAtteinte={limiteAtteinte}>
                {limiteAtteinte ? "⚠️ Limite atteinte (500 max)" : `${longueurDesignation} / ${MAX_CARACTERES_DESIGNATION}`}
              </CompteurCaracteres>
            </EnteteEtiquette>
            <ZoneTexte 
              ref={el => refs.current.designation = el} 
              name="designation" 
              value={formulaire.designation ?? ''} 
              onChange={handleChange} 
              maxLength={MAX_CARACTERES_DESIGNATION}
              placeholder="Détails de la désignation..."
              $hasError={!!erreurs.designation} 
            />
          </ChampConteneur>

          <ChampConteneur>
            <Etiquette>Type de Client / Facture *</Etiquette>
            <ChampInterneWrapper>
              <EntreeTexte 
                ref={el => refs.current.typeFacture = el} 
                name="typeFacture" 
                value={formulaire.typeFacture ?? formulaire.typeClient ?? 'Loyers'} 
                readOnly 
                $readOnly={true} 
              />
            </ChampInterneWrapper>
          </ChampConteneur>

          <ChampConteneur>
            <Etiquette>Devise</Etiquette>
            <ChampInterneWrapper>
              <SelectEntree ref={el => refs.current.devise = el} name="devise" value={formulaire.devise ?? 'USD'} onChange={handleChange} onKeyDown={gererToucheEntree} $hasError={!!erreurs.devise}>
                <option value="USD">USD ($)</option>
                <option value="CDF">CDF (FC)</option>
              </SelectEntree>
              {erreurs.devise && <MessageErreurInterne $isSelect={true}>{typeof erreurs.devise === 'string' ? erreurs.devise : "Invalide"}</MessageErreurInterne>}
            </ChampInterneWrapper>
          </ChampConteneur>

          <ChampConteneur>
            <Etiquette>Montant *</Etiquette>
            <ChampInterneWrapper>
              <EntreeTexte ref={el => refs.current.montant = el} type="number" name="montant" value={formulaire.montant ?? ''} onChange={handleChange} onKeyDown={gererToucheEntree} placeholder="0.00" $hasError={!!erreurs.montant} />
              {erreurs.montant && <MessageErreurInterne>{typeof erreurs.montant === 'string' ? erreurs.montant : "Requis"}</MessageErreurInterne>}
            </ChampInterneWrapper>
          </ChampConteneur>

          <ChampConteneur>
            <Etiquette>Mode de paiement</Etiquette>
            <ChampInterneWrapper>
              <SelectEntree ref={el => refs.current.modePaiement = el} name="modePaiement" value={formulaire.modePaiement ?? 'Virement'} onChange={handleChange} onKeyDown={gererToucheEntree} $hasError={!!erreurs.modePaiement}>
                <option value="Virement">Virement</option>
                <option value="Espèces">Espèces</option>
                <option value="Chèque">Chèque</option>
                <option value="Mobile Money">Mobile Money</option>
              </SelectEntree>
              {erreurs.modePaiement && <MessageErreurInterne $isSelect={true}>{typeof erreurs.modePaiement === 'string' ? erreurs.modePaiement : "Invalide"}</MessageErreurInterne>}
            </ChampInterneWrapper>
          </ChampConteneur>

          <ChampConteneur>
            <Etiquette>Mois Facturé</Etiquette>
            <ChampInterneWrapper>
              <SelectEntree ref={el => refs.current.moisFacture = el} name="moisFacture" value={formulaire.moisFacture ?? ''} onChange={handleChange} onKeyDown={gererToucheEntree} $hasError={!!erreurs.moisFacture}>
                <option value="">-- Choisir --</option>
                <option value="Janvier">Janvier</option>
                <option value="Février">Février</option>
                <option value="Mars">Mars</option>
                <option value="Avril">Avril</option>
                <option value="Mai">Mai</option>
                <option value="Juin">Juin</option>
                <option value="Juillet">Juillet</option>
                <option value="Août">Août</option>
                <option value="Septembre">Septembre</option>
                <option value="Octobre">Octobre</option>
                <option value="Novembre">Novembre</option>
                <option value="Décembre">Décembre</option>
              </SelectEntree>
              {erreurs.moisFacture && <MessageErreurInterne $isSelect={true}>{typeof erreurs.moisFacture === 'string' ? erreurs.moisFacture : "Invalide"}</MessageErreurInterne>}
            </ChampInterneWrapper>
          </ChampConteneur>

          <ChampConteneur>
            <Etiquette>Début Contrat * (AAAA-MM-JJ)</Etiquette>
            <ChampInterneWrapper>
              <EntreeTexte ref={el => refs.current.debutContrat = el} type="date" name="debutContrat" value={formulaire.debutContrat ?? ''} onChange={handleChange} onKeyDown={gererToucheEntree} $hasError={!!erreurs.debutContrat} />
              {erreurs.debutContrat && <MessageErreurInterne>{typeof erreurs.debutContrat === 'string' ? erreurs.debutContrat : "Invalide"}</MessageErreurInterne>}
            </ChampInterneWrapper>
          </ChampConteneur>

          <ChampConteneur>
            <Etiquette>Fin Contrat * (AAAA-MM-JJ)</Etiquette>
            <ChampInterneWrapper>
              <EntreeTexte ref={el => refs.current.finContrat = el} type="date" name="finContrat" value={formulaire.finContrat ?? ''} onChange={handleChange} onKeyDown={gererToucheEntree} $hasError={!!erreurs.finContrat} />
              {erreurs.finContrat && <MessageErreurInterne>{typeof erreurs.finContrat === 'string' ? erreurs.finContrat : "Invalide"}</MessageErreurInterne>}
            </ChampInterneWrapper>
          </ChampConteneur>

          <ChampConteneur>
            <Etiquette>Date Comptable (AAAA-MM-JJ)</Etiquette>
            <ChampInterneWrapper>
              <EntreeTexte ref={el => refs.current.dateComptable = el} type="date" name="dateComptable" value={formulaire.dateComptable ?? ''} onChange={handleChange} onKeyDown={gererToucheEntree} $hasError={!!erreurs.dateComptable} />
              {erreurs.dateComptable && <MessageErreurInterne>{typeof erreurs.dateComptable === 'string' ? erreurs.dateComptable : "Invalide"}</MessageErreurInterne>}
            </ChampInterneWrapper>
          </ChampConteneur>
        </GrilleChamps>
      </GroupeSection>

      <GroupeSection>
        <TitreSection>Compteurs & Suivi Index</TitreSection>
        <GrilleChamps>
          <ChampConteneur>
            <Etiquette>N° Compteur (CPT)</Etiquette>
            <ChampInterneWrapper>
              <EntreeTexte ref={el => refs.current.compteur = el} name="compteur" value={formulaire.compteur ?? ''} onChange={handleChange} onKeyDown={gererToucheEntree} />
            </ChampInterneWrapper>
          </ChampConteneur>
          <ChampConteneur>
            <Etiquette>Imputation (IMP.)</Etiquette>
            <ChampInterneWrapper>
              <EntreeTexte ref={el => refs.current.imputation = el} name="imputation" value={formulaire.imputation ?? ''} onChange={handleChange} onKeyDown={gererToucheEntree} />
            </ChampInterneWrapper>
          </ChampConteneur>
          <ChampConteneur>
            <Etiquette>Dernier N° (DER N°)</Etiquette>
            <ChampInterneWrapper>
              <EntreeTexte ref={el => refs.current.dernierNumero = el} name="dernierNumero" value={formulaire.dernierNumero ?? ''} onChange={handleChange} onKeyDown={gererToucheEntree} />
            </ChampInterneWrapper>
          </ChampConteneur>
          <ChampConteneur>
            <Etiquette>Dernier Montant (DER Mt)</Etiquette>
            <ChampInterneWrapper>
              <EntreeTexte ref={el => refs.current.dernierMontant = el} type="number" name="dernierMontant" value={formulaire.dernierMontant ?? ''} onChange={handleChange} onKeyDown={gererToucheEntree} />
            </ChampInterneWrapper>
          </ChampConteneur>
          <ChampConteneur>
            <Etiquette>Dernière Date (DER Dt) (AAAA-MM-JJ)</Etiquette>
            <ChampInterneWrapper>
              <EntreeTexte ref={el => refs.current.derniereDate = el} type="date" name="derniereDate" value={formulaire.derniereDate ?? ''} onChange={handleChange} onKeyDown={gererToucheEntree} />
            </ChampInterneWrapper>
          </ChampConteneur>
        </GrilleChamps>
      </GroupeSection>

      <BarreBoutons>
        <BoutonReinitialiser type="button" onClick={onReset}>
          Réinitialiser
        </BoutonReinitialiser>
        <BoutonEnregistrer type="submit" name="submitButton" ref={el => refs.current.submitButton = el}>
          {formulaire.id ? "Modifier" : "Enregistrer"}
        </BoutonEnregistrer>
      </BarreBoutons>
    </CarteFormulaire>
  );
}