import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { FiCreditCard, FiPlus, FiX, FiAlertCircle, FiRotateCcw } from 'react-icons/fi';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

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

const rotation = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const vibration = keyframes`
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-4px); }
  40%, 80% { transform: translateX(4px); }
`;

const clignotement = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
`;

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

    .actions-entete {
      display: flex;
      gap: 0.5rem;
    }

    button.btn-annuler-edition, button.btn-reinitialiser {
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
      transition: background 0.2s ease;

      &:hover:not(:disabled) {
        background: rgba(248, 113, 113, 0.2);
      }

      &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
      }

      .icone-chargement-mini {
        animation: ${rotation} 1s linear infinite;
        font-size: 0.9rem;
      }
    }

    button.btn-reinitialiser {
      background: rgba(161, 161, 170, 0.1);
      border: 1px solid rgba(161, 161, 170, 0.2);
      color: ${THEME.texteSecondaire};

      &:hover:not(:disabled) {
        background: rgba(161, 161, 170, 0.2);
        color: ${THEME.textePrincipal};
      }
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
        transition: border-color 0.2s ease, box-shadow 0.2s ease;

        &.en-erreur {
          border-color: ${THEME.rouge};
          animation: ${vibration} 0.4s ease-in-out;
          box-shadow: 0 0 0 2px rgba(248, 113, 113, 0.15);
        }

        &:focus {
          border-color: ${THEME.bordureFocus};
          box-shadow: 0 0 0 2px rgba(174, 234, 0, 0.15);
        }
      }

      .message-erreur {
        display: flex;
        align-items: center;
        gap: 0.35rem;
        color: ${THEME.rouge};
        font-size: 0.75rem;
        font-weight: 500;
        margin-top: 0.15rem;
        animation: ${clignotement} 1.2s ease-in-out infinite;
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
      transition: opacity 0.2s ease;

      &:hover:not(:disabled) {
        opacity: 0.9;
      }

      &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
      }

      .icone-chargement {
        animation: ${rotation} 1s linear infinite;
        font-size: 1rem;
      }
    }
  }
`;

export default function NouvelleBanque({ form, setForm, onSubmit, idEnCoursDeModification, onAnnuler }) {
  const [enChargement, setEnChargement] = useState(false);
  const [enChargementReset, setEnChargementReset] = useState(false);
  const [erreurs, setErreurs] = useState({});
  const [cleAnimation, setCleAnimation] = useState(0);

  const validerEtSoumettre = async (e) => {
    e.preventDefault();
    
    let nouvellesErreurs = {};
    if (!form.nomBanque.trim()) {
      nouvellesErreurs.nomBanque = "Veuillez renseigner ce champ.";
    }
    if (!form.numeroCompte.trim()) {
      nouvellesErreurs.numeroCompte = "Veuillez renseigner ce champ.";
    }

    if (Object.keys(nouvellesErreurs).length > 0) {
      setErreurs(nouvellesErreurs);
      setCleAnimation(prev => prev + 1);
      return;
    }

    setErreurs({});
    setEnChargement(true);

    setTimeout(async () => {
      await onSubmit(e);
      setEnChargement(false);
    }, 600);
  };

  const gererReinitialisation = () => {
    setEnChargementReset(true);
    setErreurs({});

    setTimeout(() => {
      onAnnuler();
      setEnChargementReset(false);
    }, 500);
  };

  return (
    <CarteFormulaire>
      <div className="entete-form">
        <h3>
          <FiCreditCard />
          {idEnCoursDeModification !== null ? 'Modifier le compte' : 'Nouvelle Banque'}
        </h3>
        <div className="actions-entete">
          <button 
            type="button" 
            className="btn-reinitialiser" 
            onClick={gererReinitialisation} 
            disabled={enChargement || enChargementReset} 
            title="Réinitialiser le formulaire"
          >
            {enChargementReset ? (
              <AiOutlineLoading3Quarters className="icone-chargement-mini" />
            ) : (
              <FiRotateCcw />
            )}
            Réinitialiser
          </button>
          {idEnCoursDeModification !== null && (
            <button type="button" className="btn-annuler-edition" onClick={onAnnuler} disabled={enChargement || enChargementReset}>
              <FiX /> Annuler
            </button>
          )}
        </div>
      </div>
      <form onSubmit={validerEtSoumettre} noValidate>
        <div className="groupe-champ">
          <label>Nom de la banque</label>
          <input 
            key={`nom-${cleAnimation}`}
            type="text" 
            placeholder="Ex: Rawbank, TMB, Equity..." 
            value={form.nomBanque}
            onChange={(e) => {
              setForm({ ...form, nomBanque: e.target.value });
              if (erreurs.nomBanque) setErreurs({ ...erreurs, nomBanque: null });
            }}
            disabled={enChargement || enChargementReset}
            className={erreurs.nomBanque ? 'en-erreur' : ''}
          />
          {erreurs.nomBanque && (
            <span className="message-erreur">
              <FiAlertCircle size={13} /> {erreurs.nomBanque}
            </span>
          )}
        </div>

        <div className="groupe-champ">
          <label>Numéro de compte</label>
          <input 
            key={`compte-${cleAnimation}`}
            type="text" 
            placeholder="Ex: 00123456789" 
            value={form.numeroCompte}
            onChange={(e) => {
              setForm({ ...form, numeroCompte: e.target.value });
              if (erreurs.numeroCompte) setErreurs({ ...erreurs, numeroCompte: null });
            }}
            disabled={enChargement || enChargementReset}
            className={erreurs.numeroCompte ? 'en-erreur' : ''}
          />
          {erreurs.numeroCompte && (
            <span className="message-erreur">
              <FiAlertCircle size={13} /> {erreurs.numeroCompte}
            </span>
          )}
        </div>

        <div className="groupe-champ">
          <label>Devise</label>
          <select 
            value={form.devise}
            onChange={(e) => setForm({ ...form, devise: e.target.value })}
            disabled={enChargement || enChargementReset}
          >
            <option value="USD">USD ($)</option>
            <option value="CDF">CDF (FC)</option>
          </select>
        </div>

        <button type="submit" className="btn-soumettre" disabled={enChargement || enChargementReset}>
          {enChargement ? (
            <>
              <AiOutlineLoading3Quarters className="icone-chargement" />
              Traitement en cours...
            </>
          ) : (
            idEnCoursDeModification !== null ? 'Mettre à jour le compte' : <><FiPlus /> Enregistrer la banque</>
          )}
        </button>
      </form>
    </CarteFormulaire>
  );
}