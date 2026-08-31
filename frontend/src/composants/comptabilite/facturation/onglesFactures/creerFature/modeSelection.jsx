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
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23FFFFFF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3cpolyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1rem;
  padding-right: 2.5rem;
  cursor: pointer;

  &:focus {
    border-color: #AEEA00;
  }

  option {
    background-color: #121212;
    color: #FFFFFF;
    padding: 8px;
  }
`;

export default function ModeSelection({ modeSelection, onModeChange }) {
  return (
    <GroupeChamp>
      <LabelChamp htmlFor="mode-selection-select">1. Mode de sélection *</LabelChamp>
      <SelectChamp 
        id="mode-selection-select"
        name="modeSelection"
        value={modeSelection} 
        onChange={onModeChange}
      >
        <option value="un">Un seul client</option>
        <option value="plusieurs">Plusieurs clients</option>
      </SelectChamp>
    </GroupeChamp>
  );
}