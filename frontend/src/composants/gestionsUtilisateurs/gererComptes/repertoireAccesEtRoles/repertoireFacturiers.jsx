import React from 'react';
import styled from 'styled-components';

const TableauUtilisateurs = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const LigneUtilisateur = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #18181b;
  border: 1px solid rgba(255, 255, 255, 0.06);
  padding: 1rem 1.25rem;
  border-radius: 12px;
  transition: all 0.2s ease;

  &:hover {
    border-color: rgba(34, 197, 94, 0.3);
    background: #1c1c21;
    transform: translateX(2px);
  }
`;

const InfoUtilisateur = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const AvatarMini = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.9rem;
  border: 1px solid rgba(34, 197, 94, 0.2);
`;

const TexteInfos = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  h5 {
    color: #f8fafc;
    font-size: 0.95rem;
    font-weight: 600;
  }

  span.email {
    color: #94a3b8;
    font-size: 0.825rem;
  }

  .meta-ligne {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-top: 0.15rem;

    .bloc-mdp {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      background: rgba(255, 255, 255, 0.04);
      padding: 0.1rem 0.5rem;
      border-radius: 6px;
      border: 1px solid rgba(255, 255, 255, 0.06);
      font-size: 0.75rem;
      color: #cbd5e1;

      .texte-mdp {
        font-family: monospace;
        letter-spacing: 0.5px;
        color: #e2e8f0;
      }

      button.btn-voir-mdp {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 0.75rem;
        padding: 0;
        display: flex;
        align-items: center;
        opacity: 0.8;
        &:hover { opacity: 1; }
      }
    }
  }
`;

const BadgeRole = styled.span`
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
  font-size: 0.7rem;
  padding: 0.15rem 0.55rem;
  border-radius: 6px;
  font-weight: 600;
  border: 1px solid rgba(34, 197, 94, 0.2);
  text-transform: uppercase;
`;

const GroupeBoutons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const BoutonAction = styled.button`
  padding: 0.5rem 0.85rem;
  border-radius: 8px;
  font-size: 0.8rem;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.08);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: rgba(255, 255, 255, 0.03);
  color: #cbd5e1;

  &.modifier:hover {
    background: rgba(34, 197, 94, 0.15);
    color: #22c55e;
    border-color: rgba(34, 197, 94, 0.3);
  }

  &.supprimer:hover {
    background: rgba(239, 68, 68, 0.15);
    color: #ef4444;
    border-color: rgba(239, 68, 68, 0.3);
  }
`;

const FormulaireEdition = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  width: 100%;
  align-items: center;

  .info-fixe {
    color: #94a3b8;
    font-size: 0.85rem;
    font-weight: 500;
    margin-right: 0.5rem;
  }

  select {
    padding: 0.6rem 0.9rem;
    background: #121214;
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #f8fafc;
    border-radius: 8px;
    font-size: 0.85rem;
    outline: none;
    min-width: 140px;
    &:focus { border-color: #22c55e; }
  }

  .conteneur-input-mdp {
    position: relative;
    display: flex;
    align-items: center;
    flex: 1;
    min-width: 180px;

    input {
      width: 100%;
      padding: 0.6rem 2.4rem 0.6rem 0.9rem;
      background: #121214;
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #f8fafc;
      border-radius: 8px;
      font-size: 0.85rem;
      outline: none;
      &:focus { border-color: #22c55e; }
    }

    button.btn-toggle-input {
      position: absolute;
      right: 10px;
      background: none;
      border: none;
      cursor: pointer;
      font-size: 0.9rem;
      color: #94a3b8;
    }
  }

  .groupe-actions-edit {
    display: flex;
    gap: 0.5rem;
    margin-left: auto;

    button {
      padding: 0.6rem 1rem;
      border-radius: 8px;
      font-size: 0.825rem;
      cursor: pointer;
      font-weight: 600;

      &.sauvegarder {
        background: #22c55e;
        color: #000;
        &:hover { background: #16a34a; }
      }

      &.annuler {
        background: rgba(255, 255, 255, 0.05);
        color: #cbd5e1;
        &:hover { background: rgba(255, 255, 255, 0.1); }
      }
    }
  }
`;

const MessageVide = styled.div`
  text-align: center;
  padding: 2.5rem;
  color: #64748b;
  font-size: 0.875rem;
  background: #18181b;
  border-radius: 12px;
  border: 1px dashed rgba(255, 255, 255, 0.08);
`;

export default function RepertoireFacturiers({ 
  facturiers = [], 
  idEnEdition, 
  formDataEdit, 
  setFormDataEdit, 
  demarrerEdition, 
  sauvegarderModification, 
  annulerEdition, 
  surSupprimer, 
  motsDePasseVisibles, 
  basculerVisibiliteMdp, 
  voirMdpEdition, 
  setVoirMdpEdition 
}) {
  return (
    <>
      {facturiers.length === 0 ? (
        <MessageVide>Aucun facturier trouvé.</MessageVide>
      ) : (
        <TableauUtilisateurs>
          {facturiers.map(facturier => {
            const estEnCoursDedition = idEnEdition === facturier.id;
            const initiales = `${facturier.prenom?.charAt(0) || ''}${facturier.nom?.charAt(0) || ''}`.toUpperCase();
            const motDePasseClair = facturier.mot_de_passe || facturier.motDePasse || 'Non défini';
            const estVisible = motsDePasseVisibles[facturier.id];

            if (estEnCoursDedition) {
              return (
                <LigneUtilisateur key={facturier.id}>
                  <FormulaireEdition>
                    <span className="info-fixe">{facturier.prenom} {facturier.nom}</span>
                    <select 
                      value={formDataEdit.role} 
                      onChange={(e) => setFormDataEdit({ ...formDataEdit, role: e.target.value })}
                    >
                      <option value="Facturier">Facturier</option>
                      <option value="Admin">Admin</option>
                    </select>

                    <div className="conteneur-input-mdp">
                      <input 
                        type={voirMdpEdition ? "text" : "password"} 
                        value={formDataEdit.motDePasse} 
                        onChange={(e) => setFormDataEdit({ ...formDataEdit, motDePasse: e.target.value })}
                        placeholder="Mot de passe"
                      />
                      <button 
                        type="button"
                        className="btn-toggle-input" 
                        onClick={() => setVoirMdpEdition(!voirMdpEdition)}
                      >
                        {voirMdpEdition ? "🙈" : "👁️"}
                      </button>
                    </div>

                    <div className="groupe-actions-edit">
                      <button className="sauvegarder" onClick={() => sauvegarderModification(facturier)}>Enregistrer</button>
                      <button className="annuler" onClick={annulerEdition}>Annuler</button>
                    </div>
                  </FormulaireEdition>
                </LigneUtilisateur>
              );
            }

            return (
              <LigneUtilisateur key={facturier.id}>
                <InfoUtilisateur>
                  <AvatarMini>{initiales}</AvatarMini>
                  <TexteInfos>
                    <h5>{facturier.prenom} {facturier.nom}</h5>
                    <span className="email">{facturier.email}</span>
                    <div className="meta-ligne">
                      <BadgeRole>{facturier.role}</BadgeRole>
                      <div className="bloc-mdp">
                        <span>MDP :</span>
                        <span className="texte-mdp">{estVisible ? motDePasseClair : '••••••••'}</span>
                        <button className="btn-voir-mdp" onClick={() => basculerVisibiliteMdp(facturier.id)}>
                          {estVisible ? "🙈" : "👁️"}
                        </button>
                      </div>
                    </div>
                  </TexteInfos>
                </InfoUtilisateur>

                <GroupeBoutons>
                  <BoutonAction className="modifier" onClick={() => demarrerEdition(facturier)}>
                    ✏️ Modifier
                  </BoutonAction>
                  <BoutonAction className="supprimer" onClick={() => surSupprimer(facturier)}>
                    🗑️ Supprimer
                  </BoutonAction>
                </GroupeBoutons>
              </LigneUtilisateur>
            );
          })}
        </TableauUtilisateurs>
      )}
    </>
  );
}