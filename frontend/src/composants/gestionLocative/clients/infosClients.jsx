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
  border: 1px solid ${THEME.bordure};
  border-radius: 8px;
  padding: 0.65rem 0.8rem;
  color: ${THEME.textePrincipal};
  font-size: 0.85rem;

  &:focus {
    outline: none;
    border-color: ${THEME.accentuation};
  }
`;

const SelectEntree = styled.select`
  background-color: ${THEME.fondChamp};
  border: 1px solid ${THEME.bordure};
  border-radius: 8px;
  padding: 0.65rem 0.8rem;
  color: ${THEME.textePrincipal};
  font-size: 0.85rem;

  &:focus {
    outline: none;
    border-color: ${THEME.accentuation};
  }
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

export default function InfosClients({ formulaire, handleChange, onReset, onSubmit }) {
  
  const gererChangementLocal = (e) => {
    const { name, value } = e.target;
    handleChange(e);

    if (name === 'designat') {
      const valLower = value.toLowerCase();
      let typeAuto = 'divers';

      if (valLower.includes('eau') || valLower.includes('regideso')) {
        typeAuto = 'eau';
      } else if (valLower.includes('elect') || valLower.includes('snel') || valLower.includes('courant')) {
        typeAuto = 'electricite';
      } else if (valLower.includes('loyer') || valLower.includes('locat') || valLower.includes('bail')) {
        typeAuto = 'locataire';
      }

      const eventTypeSimule = {
        target: { name: 'type', value: typeAuto }
      };
      handleChange(eventTypeSimule);
    }
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
            <Etiquette>Code Client</Etiquette>
            <EntreeTexte name="client" value={formulaire?.client ?? ''} onChange={gererChangementLocal} />
          </ChampConteneur>
          <ChampConteneur>
            <Etiquette>Nom</Etiquette>
            <EntreeTexte name="nom" value={formulaire?.nom ?? ''} onChange={gererChangementLocal} />
          </ChampConteneur>
          <ChampConteneur>
            <Etiquette>Local / Logement (LOC)</Etiquette>
            <EntreeTexte name="loc" value={formulaire?.loc ?? ''} onChange={gererChangementLocal} />
          </ChampConteneur>
          <ChampConteneur>
            <Etiquette>Adresse (ADRES)</Etiquette>
            <EntreeTexte name="adres" value={formulaire?.adres ?? ''} onChange={gererChangementLocal} />
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
            <EntreeTexte name="designat" value={formulaire?.designat ?? ''} onChange={gererChangementLocal} />
          </ChampConteneur>
          <ChampConteneur>
            <Etiquette>Type (Automatique)</Etiquette>
            <SelectEntree name="type" value={formulaire?.type ?? 'locataire'} onChange={gererChangementLocal}>
              <option value="locataire">locataire</option>
              <option value="electricite">electricite</option>
              <option value="eau">eau</option>
              <option value="divers">divers</option>
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
            <EntreeTexte type="number" name="mont" value={formulaire?.mont ?? ''} onChange={gererChangementLocal} />
          </ChampConteneur>
          <ChampConteneur>
            <Etiquette>Mode de paiement</Etiquette>
            <SelectEntree name="mode" value={formulaire?.mode ?? 'Virement'} onChange={gererChangementLocal}>
              <option value="Virement">Virement</option>
              <option value="Espèces">Espèces</option>
              <option value="Chèque">Chèque</option>
              <option value="Mobile Money">Mobile Money</option>
            </SelectEntree>
          </ChampConteneur>
          <ChampConteneur>
            <Etiquette>Référence</Etiquette>
            <EntreeTexte name="reference" value={formulaire?.reference ?? ''} onChange={gererChangementLocal} />
          </ChampConteneur>
          <ChampConteneur>
            <Etiquette>Mois Facturé</Etiquette>
            <EntreeTexte name="moisF" value={formulaire?.moisF ?? ''} onChange={gererChangementLocal} />
          </ChampConteneur>
          <ChampConteneur>
            <Etiquette>Début Contrat</Etiquette>
            <EntreeTexte type="date" name="debCt" value={formulaire?.debCt ?? ''} onChange={gererChangementLocal} />
          </ChampConteneur>
          <ChampConteneur>
            <Etiquette>Fin Contrat</Etiquette>
            <EntreeTexte type="date" name="finCt" value={formulaire?.finCt ?? ''} onChange={gererChangementLocal} />
          </ChampConteneur>
          <ChampConteneur>
            <Etiquette>Date Comptable</Etiquette>
            <EntreeTexte type="date" name="dateC" value={formulaire?.dateC ?? ''} onChange={gererChangementLocal} />
          </ChampConteneur>
        </GrilleChamps>
      </GroupeSection>

      <GroupeSection>
        <TitreSection>Compteurs & Suivi Index</TitreSection>
        <GrilleChamps>
          <ChampConteneur>
            <Etiquette>N° Compteur (CPT)</Etiquette>
            <EntreeTexte name="cpt" value={formulaire?.cpt ?? ''} onChange={gererChangementLocal} />
          </ChampConteneur>
          <ChampConteneur>
            <Etiquette>Imputation (IMP.)</Etiquette>
            <EntreeTexte name="imp" value={formulaire?.imp ?? ''} onChange={gererChangementLocal} />
          </ChampConteneur>
          <ChampConteneur>
            <Etiquette>Dernier N° (DER N°)</Etiquette>
            <EntreeTexte name="derN" value={formulaire?.derN ?? ''} onChange={gererChangementLocal} />
          </ChampConteneur>
          <ChampConteneur>
            <Etiquette>Dernier Montant (DER Mt)</Etiquette>
            <EntreeTexte type="number" name="derMt" value={formulaire?.derMt ?? ''} onChange={gererChangementLocal} />
          </ChampConteneur>
          <ChampConteneur>
            <Etiquette>Dernière Date (DER Dt)</Etiquette>
            <EntreeTexte type="date" name="derDt" value={formulaire?.derDt ?? ''} onChange={gererChangementLocal} />
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