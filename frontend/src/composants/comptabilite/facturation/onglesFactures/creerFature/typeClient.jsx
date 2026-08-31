import React from 'react';
import styled from 'styled-components';

const GroupeChamp = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const LabelChamp = styled.label`
  font-size: 0.82rem;
  font-weight: 600;
  color: #CCC;
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

  option {
    background-color: #121212;
    color: #FFFFFF;
    padding: 6px;
  }
`;

export default function TypeClient({ typeFacture, onChange }) {
  return (
    <GroupeChamp>
      <LabelChamp>2. Type de client / Catégorie *</LabelChamp>
      <SelectChamp name="typeFacture" value={typeFacture} onChange={onChange}>
        <option value="locataire">Locataire (Loyer)</option>
        <option value="eau">Eau</option>
        <option value="electricite">Électricité</option>
        <option value="divers">Divers / Autre</option>
      </SelectChamp>
    </GroupeChamp>
  );
}