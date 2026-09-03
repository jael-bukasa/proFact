import React from 'react';
import styled from 'styled-components';
import { FiCreditCard, FiPlus, FiX } from 'react-icons/fi';

const THEME = {
  fondCarte: '#18181b',
  fondInput: '#27272a',
  bordure: '#3f3f46',
  bordureFocus: '#aeea00',
  accent: '#aeea00',
  textePrincipal: '#f4f4f5',
  texteSecondaire: '#a1a1aa',
  rouge: '#f87171'
};

const CarteFormulaire = styled.div`
  background: ${THEME.fondCarte};
  border: 1px solid ${THEME.bordure};
  border-radius: 14px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
  height: fit-content;

  .entete-form {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.25rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid ${THEME.bordure};

    h3 {
      font-size: 1rem;
      color: ${THEME.textePrincipal};
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    button.btn-annuler-edition {
      background: rgba(248, 113, 113, 0.1);
      border: 1px solid rgba(248, 113, 113, 0.2);
      color: ${THEME.rouge};
      font-size: 0.75rem;
      padding: 0.3rem 0.6rem;
      border-radius: 6px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.3rem;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .groupe-champ {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;

      label {
        color: ${THEME.texteSecondaire};
        font-size: 0.78rem;
        font-weight: 500;
      }

      input, select {
        background: ${THEME.fondInput};
        border: 1px solid ${THEME.bordure};
        padding: 0.65rem 0.9rem;
        border-radius: 8px;
        color: ${THEME.textePrincipal};
        font-size: 0.88rem;
        outline: none;

        &:focus {
          border-color: ${THEME.bordureFocus};
          box-shadow: 0 0 0 2px rgba(174, 234, 0, 0.15);
        }
      }
    }

    button.btn-soumettre {
      background: ${THEME.accent};
      color: #000000;
      border: none;
      padding: 0.75rem;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.88rem;
      cursor: pointer;
      margin-top: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;

      &:hover {
        opacity: 0.9;
      }
    }
  }
`;

export default function NouvelleBanque({ form, setForm, onSubmit, idEnCoursDeModification, onAnnuler }) {
  return (
    <CarteFormulaire>
      <div className="entete-form">
        <h3>
          <FiCreditCard />
          {idEnCoursDeModification !== null ? 'Modifier le compte' : 'Nouvelle Banque'}
        </h3>
        {idEnCoursDeModification !== null && (
          <button type="button" className="btn-annuler-edition" onClick={onAnnuler}>
            <FiX /> Annuler
          </button>
        )}
      </div>
      <form onSubmit={onSubmit}>
        <div className="groupe-champ">
          <label>Nom de la banque</label>
          <input 
            type="text" 
            placeholder="Ex: Rawbank, TMB, Equity..." 
            value={form.nom}
            onChange={(e) => setForm({ ...form, nom: e.target.value })}
            required
          />
        </div>

        <div className="groupe-champ">
          <label>Numéro de compte</label>
          <input 
            type="text" 
            placeholder="Ex: 00123456789" 
            value={form.numeroCompte}
            onChange={(e) => setForm({ ...form, numeroCompte: e.target.value })}
            required
          />
        </div>

        <div className="groupe-champ">
          <label>Devise</label>
          <select 
            value={form.devise}
            onChange={(e) => setForm({ ...form, devise: e.target.value })}
          >
            <option value="USD">USD ($)</option>
            <option value="CDF">CDF (FC)</option>
          </select>
        </div>

        <div className="groupe-champ">
          <label>Solde {idEnCoursDeModification !== null ? '(actuel)' : 'initial'}</label>
          <input 
            type="number" 
            step="0.01" 
            placeholder="0.00" 
            value={form.soldeInitiale}
            onChange={(e) => setForm({ ...form, soldeInitiale: e.target.value })}
          />
        </div>

        <button type="submit" className="btn-soumettre">
          {idEnCoursDeModification !== null ? 'Mettre à jour le compte' : <><FiPlus /> Enregistrer la banque</>}
        </button>
      </form>
    </CarteFormulaire>
  );
}