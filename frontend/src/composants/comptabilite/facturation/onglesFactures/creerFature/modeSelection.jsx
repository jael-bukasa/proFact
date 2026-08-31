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

export default function ModeSelection({ modeSelection, onModeChange }) {
  return (
    <GroupeChamp>
      <LabelChamp>1. Mode de sélection *</LabelChamp>
      <SelectChamp value={modeSelection} onChange={onModeChange}>
        <option value="un">Un seul client</option>
        <option value="plusieurs">Plusieurs clients</option>
      </SelectChamp>
    </GroupeChamp>
  );
}