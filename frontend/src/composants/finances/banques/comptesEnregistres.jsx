import React from 'react';
import styled, { keyframes, css } from 'styled-components';
import { FiSearch, FiCreditCard, FiEdit2, FiTrash2 } from 'react-icons/fi';

const THEME = {
  fondPrincipal: '#121212',
  fondCarte: '#18181b',
  fondInput: '#27272a',
  bordure: '#3f3f46',
  bordureFocus: '#aeea00',
  accent: '#aeea00',
  textePrincipal: '#f4f4f5',
  texteSecondaire: '#a1a1aa',
  rouge: '#f87171',
  bleu: '#38bdf8'
};

const apparition = keyframes`
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const CarteListe = styled.div`
  background: ${THEME.fondCarte};
  border: 1px solid ${THEME.bordure};
  border-radius: 14px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
  animation: ${apparition} 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;

  .entete-liste {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.25rem;
    gap: 1.0rem;
    flex-wrap: wrap;

    h3 {
      font-size: 1rem;
      color: ${THEME.textePrincipal};
      font-weight: 600;
    }

    .conteneur-recherche {
      position: relative;
      display: flex;
      align-items: center;

      svg {
        position: absolute;
        left: 0.8rem;
        color: ${THEME.texteSecondaire};
        font-size: 0.9rem;
      }

      input.recherche {
        background: ${THEME.fondInput};
        border: 1px solid ${THEME.bordure};
        padding: 0.5rem 0.8rem 0.5rem 2.2rem;
        border-radius: 8px;
        color: ${THEME.textePrincipal};
        font-size: 0.85rem;
        outline: none;
        width: 220px;

        &:focus {
          border-color: ${THEME.bordureFocus};
        }
      }
    }
  }
`;

const SectionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-height: 480px;
  overflow-y: auto;
  padding-right: 4px;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: ${THEME.fondPrincipal};
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${THEME.bordure};
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: ${THEME.accent};
  }
`;

const BlocDevise = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  .titre-bloc {
    font-size: 0.85rem;
    font-weight: 700;
    color: ${THEME.accent};
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding-bottom: 0.25rem;
    border-bottom: 1px solid ${THEME.bordure};
  }
`;

const ListeBanquesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

// Application dynamique de la couleur si la banque vient d'être modifiée
const ElementBanque = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${props => props.$estModifie ? 'rgba(174, 234, 0, 0.08)' : THEME.fondPrincipal};
  border: 1px solid ${props => props.$estModifie ? THEME.accent : THEME.bordure};
  padding: 0.9rem 1rem;
  border-radius: 10px;

  animation: ${apparition} 0.4s ease forwards;
  transition: all 0.4s ease;

  &:hover {
    border-color: ${THEME.accent};
    transform: translateX(4px);
    background: rgba(174, 234, 0, 0.04);

    .icone-banque {
      background: rgba(174, 234, 0, 0.1);
    }
  }

  .infos-banque {
    display: flex;
    align-items: center;
    gap: 0.85rem;

    .icone-banque {
      width: 38px;
      height: 38px;
      background: ${THEME.fondCarte};
      border: 1px solid ${THEME.bordure};
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${THEME.accent};
      font-size: 1.05rem;
      transition: background 0.25s ease;
    }

    .details {
      display: flex;
      flex-direction: column;
      gap: 0.15rem;

      h4 {
        color: ${THEME.textePrincipal};
        font-size: 0.9rem;
        font-weight: 600;
      }

      span {
        color: ${THEME.texteSecondaire};
        font-size: 0.75rem;
        font-family: monospace;
      }
    }
  }

  .actions-banque {
    display: flex;
    align-items: center;
    gap: 1.25rem;

    .conteneur-solde {
      display: flex;
      align-items: center;
      gap: 0.4rem;

      .badge-devise {
        font-size: 0.65rem;
        background: rgba(174, 234, 0, 0.1);
        color: ${THEME.accent};
        padding: 0.1rem 0.35rem;
        border-radius: 4px;
        font-weight: 600;
      }
    }

    .groupe-btn {
      display: flex;
      gap: 0.3rem;

      button {
        background: transparent;
        border: 1px solid transparent;
        cursor: pointer;
        font-size: 0.9rem;
        padding: 0.35rem;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.2s ease;

        &.btn-modifier {
          color: ${THEME.bleu};
          &:hover { background: rgba(56, 189, 248, 0.15); }
        }

        &.btn-supprimer {
          color: ${THEME.rouge};
          &:hover { background: rgba(248, 113, 113, 0.15); }
        }
      }
    }
  }
`;

const MessageVide = styled.div`
  text-align: center;
  padding: 2.5rem;
  color: ${THEME.texteSecondaire};
  font-size: 0.85rem;
  background: ${THEME.fondPrincipal};
  border-radius: 10px;
  border: 1px dashed ${THEME.bordure};
`;

export default function ComptesEnregistres({ banquesFiltrees, recherche, setRecherche, onModifier, onSupprimer, idModifieRecent }) {
  // Séparation des comptes par devise
  const comptesUSD = banquesFiltrees.filter(b => (b.devise || 'USD').toUpperCase() === 'USD');
  const comptesCDF = banquesFiltrees.filter(b => (b.devise || '').toUpperCase() === 'CDF');

  return (
    <CarteListe>
      <div className="entete-liste">
        <h3>Comptes enregistrés</h3>
        <div className="conteneur-recherche">
          <FiSearch />
          <input 
            type="text" 
            className="recherche" 
            placeholder="Rechercher par nom ou n°..." 
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
          />
        </div>
      </div>

      {banquesFiltrees.length === 0 ? (
        <MessageVide>Aucun compte bancaire ne correspond à votre recherche.</MessageVide>
      ) : (
        <SectionsContainer>
          {/* Bloc USD */}
          {comptesUSD.length > 0 && (
            <BlocDevise>
              <div className="titre-bloc">Comptes USD ($)</div>
              <ListeBanquesContainer>
                {comptesUSD.map((banque) => (
                  <ElementBanque key={banque.id} $estModifie={banque.id === idModifieRecent}>
                    <div className="infos-banque">
                      <div className="icone-banque"><FiCreditCard /></div>
                      <div className="details">
                        <h4>{banque.nomBanque}</h4>
                        <span>N° {banque.numeroCompte.replace(/^N°\s*/i, '')}</span>
                      </div>
                    </div>
                    <div className="actions-banque">
                      <div className="conteneur-solde">
                        <span className="badge-devise">{banque.devise || 'USD'}</span>
                      </div>
                      <div className="groupe-btn">
                        <button className="btn-modifier" onClick={() => onModifier(banque)} title="Modifier"><FiEdit2 /></button>
                        <button className="btn-supprimer" onClick={() => onSupprimer(banque.id)} title="Supprimer"><FiTrash2 /></button>
                      </div>
                    </div>
                  </ElementBanque>
                ))}
              </ListeBanquesContainer>
            </BlocDevise>
          )}

          {/* Bloc CDF */}
          {comptesCDF.length > 0 && (
            <BlocDevise>
              <div className="titre-bloc">Comptes CDF (FC)</div>
              <ListeBanquesContainer>
                {comptesCDF.map((banque) => (
                  <ElementBanque key={banque.id} $estModifie={banque.id === idModifieRecent}>
                    <div className="infos-banque">
                      <div className="icone-banque"><FiCreditCard /></div>
                      <div className="details">
                        <h4>{banque.nomBanque}</h4>
                        <span>N° {banque.numeroCompte.replace(/^N°\s*/i, '')}</span>
                      </div>
                    </div>
                    <div className="actions-banque">
                      <div className="conteneur-solde">
                        <span className="badge-devise">{banque.devise || 'CDF'}</span>
                      </div>
                      <div className="groupe-btn">
                        <button className="btn-modifier" onClick={() => onModifier(banque)} title="Modifier"><FiEdit2 /></button>
                        <button className="btn-supprimer" onClick={() => onSupprimer(banque.id)} title="Supprimer"><FiTrash2 /></button>
                      </div>
                    </div>
                  </ElementBanque>
                ))}
              </ListeBanquesContainer>
            </BlocDevise>
          )}
        </SectionsContainer>
      )}
    </CarteListe>
  );
}