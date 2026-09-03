import React, { useState, useMemo } from 'react';
import styled from 'styled-components';

const ConteneurGestion = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;

const GrilleStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CarteStat = styled.div`
  background: #1E1E1E;
  border: 1px solid #2A2A2A;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

  .infos-stat {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;

    span.titre {
      color: #888888;
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.8px;
    }

    span.valeur {
      color: #FFFFFF;
      font-size: 2rem;
      font-weight: 700;
    }
  }

  .icone-stat {
    width: 46px;
    height: 46px;
    border-radius: 10px;
    background: #121212;
    color: #FFFFFF;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    border: 1px solid #2A2A2A;
  }
`;

const CarteListe = styled.div`
  background: #1E1E1E;
  border: 1px solid #2A2A2A;
  border-radius: 14px;
  padding: 2rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);

  .entete-carte {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    gap: 1rem;

    h3 {
      font-size: 1.25rem;
      color: #FFFFFF;
      font-weight: 600;
    }

    .barre-outils {
      display: flex;
      align-items: center;
      gap: 1rem;

      input.recherche {
        background: #121212;
        border: 1px solid #2A2A2A;
        padding: 0.6rem 1rem;
        border-radius: 8px;
        color: #FFFFFF;
        font-size: 0.9rem;
        outline: none;
        width: 250px;
        transition: border-color 0.2s;

        &:focus {
          border-color: #22c55e;
          box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.15);
        }
      }
    }
  }
`;

const SectionCategorie = styled.div`
  margin-bottom: 2.5rem;

  &:last-child {
    margin-bottom: 0;
  }

  h4.titre-categorie {
    color: #FFFFFF;
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 1.2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #2A2A2A;

    .badge-compte {
      background: #121212;
      color: #888888;
      font-size: 0.75rem;
      padding: 0.2rem 0.6rem;
      border-radius: 20px;
      border: 1px solid #2A2A2A;
    }
  }
`;

const TableauUtilisateurs = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const LigneUtilisateur = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #121212;
  border: 1px solid #2A2A2A;
  padding: 1rem 1.2rem;
  border-radius: 10px;
  transition: all 0.2s ease;

  &:hover {
    border-color: #22c55e;
    background: #161616;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const InfoUtilisateur = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const AvatarMini = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 8px;
  background: #1E1E1E;
  color: #22c55e;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.9rem;
  border: 1px solid #2A2A2A;
`;

const TexteInfos = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;

  h5 {
    color: #FFFFFF;
    font-size: 0.95rem;
    font-weight: 600;
  }

  span.email {
    color: #888888;
    font-size: 0.85rem;
  }
`;

const BadgeRole = styled.span`
  background: ${props => props.$isAdmin ? 'rgba(34, 197, 94, 0.1)' : 'rgba(34, 197, 94, 0.1)'};
  color: #22c55e;
  font-size: 0.75rem;
  padding: 0.15rem 0.6rem;
  border-radius: 6px;
  font-weight: 600;
  border: 1px solid rgba(34, 197, 94, 0.3);
  width: fit-content;
  margin-top: 0.2rem;
`;

const GroupeBoutons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const BoutonAction = styled.button`
  padding: 0.45rem 0.8rem;
  border-radius: 6px;
  font-size: 0.82rem;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid #2A2A2A;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.3rem;

  &.modifier {
    background: #121212;
    color: #22c55e;

    &:hover {
      background: #1E1E1E;
      border-color: #22c55e;
    }
  }

  &.supprimer {
    background: #121212;
    color: #ef4444;

    &:hover {
      background: rgba(239, 68, 68, 0.15);
      border-color: #ef4444;
    }
  }
`;

const MessageVide = styled.div`
  text-align: center;
  padding: 2rem;
  color: #888888;
  font-size: 0.88rem;
  background: #121212;
  border-radius: 8px;
  border: 1px dashed #2A2A2A;
`;

const FormulaireEdition = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  width: 100%;
  align-items: center;

  input, select {
    padding: 0.5rem 0.8rem;
    background: #1E1E1E;
    border: 1px solid #2A2A2A;
    color: #FFFFFF;
    border-radius: 6px;
    font-size: 0.85rem;
    outline: none;

    &:focus {
      border-color: #22c55e;
      box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.15);
    }
  }

  .groupe-actions-edit {
    display: flex;
    gap: 0.5rem;
    margin-left: auto;

    button {
      padding: 0.5rem 0.9rem;
      border-radius: 6px;
      font-size: 0.85rem;
      cursor: pointer;
      font-weight: 600;
      border: 1px solid #2A2A2A;

      &.sauvegarder {
        background: #22c55e;
        color: #000000;
        border-color: #22c55e;
        &:hover { opacity: 0.9; }
      }

      &.annuler {
        background: #121212;
        color: #FFFFFF;
        &:hover { background: #1E1E1E; }
      }
    }
  }
`;

const OverlayModal = styled.div`
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ContenuModal = styled.div`
  background: #1E1E1E;
  border: 1px solid #2A2A2A;
  padding: 2rem;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.4);

  h4 { color: #FFFFFF; font-size: 1.1rem; }
  p { color: #888888; font-size: 0.9rem; line-height: 1.4; }

  .actions-modal {
    display: flex;
    justify-content: flex-end;
    gap: 0.8rem;
    margin-top: 1rem;

    button {
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-size: 0.85rem;
      cursor: pointer;
      font-weight: 600;
      border: 1px solid #2A2A2A;

      &.btn-confirmer-suppr {
        background: #ef4444;
        color: #FFFFFF;
        border-color: #ef4444;
        &:hover { opacity: 0.9; }
      }
      &.btn-annuler-suppr {
        background: #121212;
        color: #FFFFFF;
        &:hover { background: #1E1E1E; }
      }
    }
  }
`;

export default function GererComptes({ facturiers = [], surSupprimerFacturier, surModifierFacturier }) {
  const [idEnEdition, setIdEnEdition] = useState(null);
  const [formDataEdit, setFormDataEdit] = useState({ 
    prenom: '', 
    nom: '', 
    email: '', 
    role: '', 
    motDePasse: '' 
  });
  const [recherche, setRecherche] = useState('');
  const [utilisateurASupprimer, setUtilisateurASupprimer] = useState(null);

  const utilisateursFiltres = useMemo(() => {
    return facturiers.filter(u => 
      `${u.prenom} ${u.nom} ${u.email}`.toLowerCase().includes(recherche.toLowerCase())
    );
  }, [facturiers, recherche]);

  const totalUtilisateurs = facturiers.length;
  const nombreAdmins = facturiers.filter(u => u.role?.toLowerCase() === 'admin').length;
  const nombreFacturiers = facturiers.filter(u => u.role?.toLowerCase() === 'facturier').length;

  const listeAdmins = utilisateursFiltres.filter(u => u.role?.toLowerCase() === 'admin');
  const listeFacturiersSeuls = utilisateursFiltres.filter(u => u.role?.toLowerCase() === 'facturier');

  const demarrerEdition = (utilisateur) => {
    setIdEnEdition(utilisateur.id);
    setFormDataEdit({
      prenom: utilisateur.prenom,
      nom: utilisateur.nom,
      email: utilisateur.email,
      role: utilisateur.role,
      motDePasse: utilisateur.mot_de_passe || utilisateur.motDePasse || ''
    });
  };

  const sauvegarderModification = (id) => {
    if (surModifierFacturier) {
      surModifierFacturier(id, formDataEdit);
    }
    setIdEnEdition(null);
  };

  const confirmerSuppression = () => {
    if (utilisateurASupprimer && surSupprimerFacturier) {
      surSupprimerFacturier(utilisateurASupprimer.id);
    }
    setUtilisateurASupprimer(null);
  };

  return (
    <ConteneurGestion>
      <GrilleStats>
        <CarteStat>
          <div className="infos-stat">
            <span className="titre">Total Utilisateurs</span>
            <span className="valeur">{totalUtilisateurs}</span>
          </div>
          <div className="icone-stat">👥</div>
        </CarteStat>

        <CarteStat>
          <div className="infos-stat">
            <span className="titre">Administrateurs</span>
            <span className="valeur">{nombreAdmins}</span>
          </div>
          <div className="icone-stat">🛡️</div>
        </CarteStat>

        <CarteStat>
          <div className="infos-stat">
            <span className="titre">Facturiers</span>
            <span className="valeur">{nombreFacturiers}</span>
          </div>
          <div className="icone-stat">📄</div>
        </CarteStat>
      </GrilleStats>

      <CarteListe>
        <div className="entete-carte">
          <h3>Répertoire des accès et rôles</h3>
          <div className="barre-outils">
            <input 
              type="text" 
              className="recherche" 
              placeholder="Rechercher par nom ou email..." 
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
            />
          </div>
        </div>

        {totalUtilisateurs === 0 ? (
          <MessageVide>Aucun compte utilisateur enregistré dans le système.</MessageVide>
        ) : (
          <>
            <SectionCategorie>
              <h4 className="titre-categorie">
                <span>🛡️ Administrateurs</span> 
                <span className="badge-compte">{listeAdmins.length}</span>
              </h4>
              {listeAdmins.length === 0 ? (
                <MessageVide>Aucun administrateur trouvé.</MessageVide>
              ) : (
                <TableauUtilisateurs>
                  {listeAdmins.map((admin) => renderLigneUtilisateur(admin))}
                </TableauUtilisateurs>
              )}
            </SectionCategorie>

            <SectionCategorie>
              <h4 className="titre-categorie">
                <span>📄 Facturiers</span> 
                <span className="badge-compte">{listeFacturiersSeuls.length}</span>
              </h4>
              {listeFacturiersSeuls.length === 0 ? (
                <MessageVide>Aucun facturier trouvé.</MessageVide>
              ) : (
                <TableauUtilisateurs>
                  {listeFacturiersSeuls.map((facturier) => renderLigneUtilisateur(facturier))}
                </TableauUtilisateurs>
              )}
            </SectionCategorie>
          </>
        )}
      </CarteListe>

      {utilisateurASupprimer && (
        <OverlayModal>
          <ContenuModal>
            <h4>Confirmer la suppression</h4>
            <p>Êtes-vous sûr de vouloir supprimer le compte de <strong>{utilisateurASupprimer.prenom} {utilisateurASupprimer.nom}</strong> ? Cette action est irréversible.</p>
            <div className="actions-modal">
              <button className="btn-annuler-suppr" onClick={() => setUtilisateurASupprimer(null)}>Annuler</button>
              <button className="btn-confirmer-suppr" onClick={confirmerSuppression}>Supprimer</button>
            </div>
          </ContenuModal>
        </OverlayModal>
      )}
    </ConteneurGestion>
  );

  function renderLigneUtilisateur(utilisateur) {
    const estEnCoursDedition = idEnEdition === utilisateur.id;
    const initiales = `${utilisateur.prenom?.charAt(0) || ''}${utilisateur.nom?.charAt(0) || ''}`.toUpperCase();
    const isAdmin = utilisateur.role?.toLowerCase() === 'admin';

    if (estEnCoursDedition) {
      return (
        <LigneUtilisateur key={utilisateur.id}>
          <FormulaireEdition>
            <input 
              type="text" 
              value={formDataEdit.prenom} 
              onChange={(e) => setFormDataEdit({ ...formDataEdit, prenom: e.target.value })}
              placeholder="Prénom"
            />
            <input 
              type="text" 
              value={formDataEdit.nom} 
              onChange={(e) => setFormDataEdit({ ...formDataEdit, nom: e.target.value })}
              placeholder="Nom"
            />
            <input 
              type="email" 
              value={formDataEdit.email} 
              onChange={(e) => setFormDataEdit({ ...formDataEdit, email: e.target.value })}
              placeholder="Email"
            />
            <select 
              value={formDataEdit.role} 
              onChange={(e) => setFormDataEdit({ ...formDataEdit, role: e.target.value })}
            >
              <option value="Facturier">Facturier</option>
              <option value="Admin">Admin</option>
            </select>

            <input 
              type="text" 
              value={formDataEdit.motDePasse} 
              onChange={(e) => setFormDataEdit({ ...formDataEdit, motDePasse: e.target.value })}
              placeholder="Mot de passe"
            />

            <div className="groupe-actions-edit">
              <button className="sauvegarder" onClick={() => sauvegarderModification(utilisateur.id)}>Enregistrer</button>
              <button className="annuler" onClick={() => setIdEnEdition(null)}>Annuler</button>
            </div>
          </FormulaireEdition>
        </LigneUtilisateur>
      );
    }

    return (
      <LigneUtilisateur key={utilisateur.id}>
        <InfoUtilisateur>
          <AvatarMini>{initiales}</AvatarMini>
          <TexteInfos>
            <h5>{utilisateur.prenom} {utilisateur.nom}</h5>
            <span className="email">{utilisateur.email}</span>
            <BadgeRole $isAdmin={isAdmin}>{utilisateur.role}</BadgeRole>
          </TexteInfos>
        </InfoUtilisateur>
        <GroupeBoutons>
          <BoutonAction className="modifier" onClick={() => demarrerEdition(utilisateur)}>
            ✏️ Modifier
          </BoutonAction>
          <BoutonAction className="supprimer" onClick={() => setUtilisateurASupprimer(utilisateur)}>
            🗑️ Supprimer
          </BoutonAction>
        </GroupeBoutons>
      </LigneUtilisateur>
    );
  }
}