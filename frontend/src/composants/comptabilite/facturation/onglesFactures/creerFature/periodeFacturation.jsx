import React from 'react';
import styled from 'styled-components';

const GroupeChamp = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  grid-column: 1 / -1;
`;

const LabelChamp = styled.label`
  font-size: 0.82rem;
  font-weight: 600;
  color: #CCC;
`;

const LignePeriode = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 0.6rem;
`;

const SelectChamp = styled.select`
  background-color: #121212;
  border: 1px solid #2A2A2A;
  border-radius: 8px;
  padding: 0.75rem;
  color: #FFFFFF;
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s;
  width: 100%;

  &:focus {
    border-color: #AEEA00;
  }

  &:disabled {
    opacity: 0.8;
    cursor: not-allowed;
    background-color: #181818;
    color: #AEEA00;
    border-color: #333;
    font-weight: 600;
  }

  option {
    background-color: #121212;
    color: #FFFFFF;
    padding: 6px;
  }
`;

const InputChamp = styled.input`
  background-color: #121212;
  border: 1px solid #2A2A2A;
  border-radius: 8px;
  padding: 0.75rem;
  color: #FFFFFF;
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s;
  width: 100%;

  &:focus {
    border-color: #AEEA00;
  }
`;

export default function PeriodeFacturation({
  typePeriode,
  choixPeriodeSpecifique,
  anneeFactureChiffre,
  onChange,
  optionsPeriodeSpecifique,
  estVerrouille = false
}) {
  return (
    <GroupeChamp>
      <LabelChamp>
        3. Période de facturation {estVerrouille && <span style={{ color: '#AEEA00', fontWeight: 'normal' }}>(Client enregistré en paiement {typePeriode})</span>} *
      </LabelChamp>
      <LignePeriode>
        <SelectChamp 
          name="typePeriode" 
          value={typePeriode} 
          onChange={onChange}
          disabled={estVerrouille}
        >
          <option value="mois">Par mois</option>
          <option value="trimestre">Trimestre</option>
          <option value="semestre">Semestre</option>
        </SelectChamp>

        <SelectChamp name="choixPeriodeSpecifique" value={choixPeriodeSpecifique} onChange={onChange}>
          {optionsPeriodeSpecifique.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </SelectChamp>

        <InputChamp 
          type="number" 
          name="anneeFactureChiffre" 
          placeholder="Année" 
          value={anneeFactureChiffre} 
          onChange={onChange}
          required
        />
      </LignePeriode>
    </GroupeChamp>
  );
}