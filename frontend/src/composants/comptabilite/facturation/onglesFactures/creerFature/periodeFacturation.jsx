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
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23FFFFFF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1rem;
  padding-right: 2.5rem;
  cursor: pointer;

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
    background-image: none;
    padding-right: 0.75rem;
  }

  option {
    background-color: #121212;
    color: #FFFFFF;
    padding: 8px;
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
  // Fonction pour filtrer et limiter l'année à 4 chiffres maximum
  const handleAnneeChange = (e) => {
    const valeur = e.target.value.replace(/\D/g, ''); // Ne garde que les chiffres
    if (valeur.length <= 4) {
      // On simule un objet événement standard pour remonter la valeur modifiée au parent
      onChange({
        target: {
          name: 'anneeFactureChiffre',
          value: valeur
        }
      });
    }
  };

  return (
    <GroupeChamp>
      <LabelChamp id="label-periode-facturation">
        3. Période de facturation {estVerrouille && <span style={{ color: '#AEEA00', fontWeight: 'normal' }}>(Client enregistré en paiement {typePeriode})</span>} *
      </LabelChamp>
      <LignePeriode role="group" aria-labelledby="label-periode-facturation">
        <SelectChamp 
          id="type-periode-select"
          name="typePeriode" 
          value={typePeriode} 
          onChange={onChange}
          disabled={estVerrouille}
          aria-label="Type de période"
        >
          <option value="mois">Par mois</option>
          <option value="trimestre">Trimestre</option>
          <option value="semestre">Semestre</option>
        </SelectChamp>

        <SelectChamp 
          id="choix-periode-specifique-select"
          name="choixPeriodeSpecifique" 
          value={choixPeriodeSpecifique} 
          onChange={onChange}
          aria-label="Période spécifique"
        >
          {optionsPeriodeSpecifique.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </SelectChamp>

        <InputChamp 
          id="annee-facture-input"
          type="text" 
          inputMode="numeric"
          name="anneeFactureChiffre" 
          placeholder="Année (ex: 2026)" 
          value={anneeFactureChiffre} 
          onChange={handleAnneeChange}
          maxLength={4}
          aria-label="Année de facturation"
          required
        />
      </LignePeriode>
    </GroupeChamp>
  );
}