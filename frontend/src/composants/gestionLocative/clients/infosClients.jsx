import React from 'react';
import styled from 'styled-components';

const THEME = {
  fondCarte: '#1E1E1E',
  accentuation: '#AEEA00',
  textePrincipal: '#FFFFFF',
  texteSecondaire: '#888888',
  bordure: '#2A2A2A',
  fondChamp: '#121212'
};

const CarteFormulaire = styled.form`
  background-color: ${THEME.fondCarte};
  padding: 1.8rem;
  border-radius: 16px;
  border: 1px solid ${THEME.bordure};
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const GroupeSection = styled.fieldset`
  border: 1px solid ${THEME.bordure};
  border-radius: 12px;
  padding: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const TitreSection = styled.legend`
  color: ${THEME.accentuation};
  font-size: 0.85rem;
  font-weight: 600;
  padding: 0 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const GrilleChamps = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
`;

const ChampConteneur = styled.div`
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

const EntreeTexte = styled.input`
  background-color: ${THEME.fondChamp};
  border: 1px solid ${props => props.$hasError ? '#FF5252' : THEME.bordure};
  border-radius: 8px;
  padding: 0.65rem 0.8rem;
  color: ${THEME.textePrincipal};
  font-size: 0.85rem;

  &:focus {
    outline: none;
    border-color: ${props => props.$hasError ? '#FF5252' : THEME.accentuation};
  }
`;

const SelectEntree = styled.select`
  background-color: ${THEME.fondChamp};
  border: 1px solid ${props => props.$hasError ? '#FF5252' : THEME.bordure};
  border-radius: 8px;
  padding: 0.65rem 0.8rem;
  color: ${THEME.textePrincipal};
  font-size: 0.85rem;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23888888' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.8rem center;
  background-size: 1rem;
  padding-right: 2.5rem;

  &:focus {
    outline: none;
    border-color: ${props => props.$hasError ? '#FF5252' : THEME.accentuation};
  }

  option {
    background-color: ${THEME.fondCarte};
    color: ${THEME.textePrincipal};
    padding: 0.5rem;
  }
`;

const MessageErreurChamp = styled.span`
  color: #FF5252;
  font-size: 0.7rem;
  font-weight: 600;
  margin-top: 0.1rem;
`;

const BarreBoutons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
`;

const BoutonEnregistrer = styled.button`
  background-color: ${THEME.accentuation};
  color: #000000;
  border: none;
  padding: 0.75rem 1.8rem;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  font-size: 0.9rem;

  &:hover {
    opacity: 0.9;
  }
`;

const BoutonReinitialiser = styled.button`
  background-color: transparent;
  color: ${THEME.texteSecondaire};
  border: 1px solid ${THEME.bordure};
  padding: 0.75rem 1.8rem;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  font-size: 0.9rem;

  &:hover {
    color: ${THEME.textePrincipal};
    border-color: #555;
  }
`;

export default function InfosClients({ formulaire, erreurs = {}, handleChange, onReset, onSubmit }) {
  
  const gererChangementLocal = (e) => {
    handleChange(e);
  };

  return (
    <CarteFormulaire onSubmit={onSubmit}>
      <GroupeSection>
        <TitreSection>Bail & Identification</TitreSection>
        <GrilleChamps>
          <ChampConteneur>
            <Etiquette>N° Bail</Etiquette>
            <EntreeTexte name="bail" value={formulaire?.bail ?? ''} onChange={gererChangementLocal} />
          </ChampConteneur>
          
          <ChampConteneur>
            <Etiquette>Date Bail</Etiquette>
            <EntreeTexte type="date" name="dateBail" value={formulaire?.dateBail ?? ''} onChange={gererChangementLocal} />
          </ChampConteneur>

          <ChampConteneur>
            <Etiquette>Matricule / Code Client</Etiquette>
            <EntreeTexte 
              name="matricule" 
              value={formulaire?.matricule ?? ''} 
              onChange={gererChangementLocal} 
              $hasError={!!erreurs.matricule}
            />
            {erreurs.matricule && <MessageErreurChamp>{erreurs.matricule}</MessageErreurChamp>}
          </ChampConteneur>

          <ChampConteneur>
            <Etiquette>Nom</Etiquette>
            <EntreeTexte 
              name="nom" 
              value={formulaire?.nom ?? ''} 
              onChange={gererChangementLocal} 
              placeholder="Ex: Mulaji" 
              $hasError={!!erreurs.nom}
            />
            {erreurs.nom && <MessageErreurChamp>{erreurs.nom}</MessageErreurChamp>}
          </ChampConteneur>

          <ChampConteneur>
            <Etiquette>Post-nom</Etiquette>
            <EntreeTexte name="postNom" value={formulaire?.postNom ?? ''} onChange={gererChangementLocal} placeholder="Ex: Jael" />
          </ChampConteneur>
          
          <ChampConteneur>
            <Etiquette>Prénom</Etiquette>
            <EntreeTexte name="prenom" value={formulaire?.prenom ?? ''} onChange={gererChangementLocal} placeholder="Ex: Bukasa" />
          </ChampConteneur>

          <ChampConteneur>
            <Etiquette>Logement (LOC)</Etiquette>
            <EntreeTexte name="logement" value={formulaire?.logement ?? ''} onChange={gererChangementLocal} />
          </ChampConteneur>

          <ChampConteneur>
            <Etiquette>Adresse (ADRES)</Etiquette>
            <EntreeTexte name="adresse" value={formulaire?.adresse ?? ''} onChange={gererChangementLocal} />
          </ChampConteneur>

          <ChampConteneur>
            <Etiquette>Pays</Etiquette>
            <EntreeTexte name="pays" value={formulaire?.pays ?? 'RDC'} onChange={gererChangementLocal} />
          </ChampConteneur>
        </GrilleChamps>
      </GroupeSection>

      <GroupeSection>
        <TitreSection>Détails Facture & Période</TitreSection>
        <GrilleChamps>
          <ChampConteneur>
            <Etiquette>Désignation (DESIGNAT)</Etiquette>
            <EntreeTexte name="designation" value={formulaire?.designation ?? ''} onChange={gererChangementLocal} />
          </ChampConteneur>

          <ChampConteneur>
            <Etiquette>Type de Facture (Automatique)</Etiquette>
            <SelectEntree name="typeFacture" value={formulaire?.typeFacture ?? 'Loyers'} onChange={gererChangementLocal}>
              <option value="Loyers">Loyers</option>
              <option value="Electricite">Electricite</option>
              <option value="Eau">Eau</option>
              <option value="Divers">Divers</option>
            </SelectEntree>
          </ChampConteneur>

          <ChampConteneur>
            <Etiquette>Devise</Etiquette>
            <SelectEntree name="devise" value={formulaire?.devise ?? 'USD'} onChange={gererChangementLocal}>
              <option value="USD">USD ($)</option>
              <option value="CDF">CDF (FC)</option>
            </SelectEntree>
          </ChampConteneur>

          <ChampConteneur>
            <Etiquette>Montant ({formulaire?.devise || 'USD'})</Etiquette>
            <EntreeTexte type="number" name="montant" value={formulaire?.montant ?? ''} onChange={gererChangementLocal} />
          </ChampConteneur>

          <ChampConteneur>
            <Etiquette>Mode de paiement</Etiquette>
            <SelectEntree name="modePaiement" value={formulaire?.modePaiement ?? 'Virement'} onChange={gererChangementLocal}>
              <option value="Virement">Virement</option>
              <option value="Espèces">Espèces</option>
              <option value="Chèque">Chèque</option>
              <option value="Mobile Money">Mobile Money</option>
            </SelectEntree>
          </ChampConteneur>

          <ChampConteneur>
            <Etiquette>Mois Facturé</Etiquette>
            <SelectEntree name="moisFacture" value={formulaire?.moisFacture ?? ''} onChange={gererChangementLocal}>
              <option value="">-- Sélectionner un mois --</option>
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
          </ChampConteneur>

          <ChampConteneur>
            <Etiquette>Début Contrat</Etiquette>
            <EntreeTexte type="date" name="debutContrat" value={formulaire?.debutContrat ?? ''} onChange={gererChangementLocal} />
          </ChampConteneur>

          <ChampConteneur>
            <Etiquette>Fin Contrat</Etiquette>
            <EntreeTexte type="date" name="finContrat" value={formulaire?.finContrat ?? ''} onChange={gererChangementLocal} />
          </ChampConteneur>

          <ChampConteneur>
            <Etiquette>Date Comptable</Etiquette>
            <EntreeTexte type="date" name="dateComptable" value={formulaire?.dateComptable ?? ''} onChange={gererChangementLocal} />
          </ChampConteneur>
        </GrilleChamps>
      </GroupeSection>

      <GroupeSection>
        <TitreSection>Compteurs & Suivi Index</TitreSection>
        <GrilleChamps>
          <ChampConteneur>
            <Etiquette>N° Compteur (CPT)</Etiquette>
            <EntreeTexte name="compteur" value={formulaire?.compteur ?? ''} onChange={gererChangementLocal} />
          </ChampConteneur>

          <ChampConteneur>
            <Etiquette>Imputation (IMP.)</Etiquette>
            <EntreeTexte name="imputation" value={formulaire?.imputation ?? ''} onChange={gererChangementLocal} />
          </ChampConteneur>

          <ChampConteneur>
            <Etiquette>Dernier N° (DER N°)</Etiquette>
            <EntreeTexte name="dernierNumero" value={formulaire?.dernierNumero ?? ''} onChange={gererChangementLocal} />
          </ChampConteneur>

          <ChampConteneur>
            <Etiquette>Dernier Montant (DER Mt)</Etiquette>
            <EntreeTexte type="number" name="dernierMontant" value={formulaire?.dernierMontant ?? ''} onChange={gererChangementLocal} />
          </ChampConteneur>

          <ChampConteneur>
            <Etiquette>Dernière Date (DER Dt)</Etiquette>
            <EntreeTexte type="date" name="derniereDate" value={formulaire?.derniereDate ?? ''} onChange={gererChangementLocal} />
          </ChampConteneur>
        </GrilleChamps>
      </GroupeSection>

      <BarreBoutons>
        <BoutonReinitialiser type="button" onClick={onReset}>Réinitialiser</BoutonReinitialiser>
        <BoutonEnregistrer type="submit">Enregistrer les informations</BoutonEnregistrer>
      </BarreBoutons>
    </CarteFormulaire>
  );
}