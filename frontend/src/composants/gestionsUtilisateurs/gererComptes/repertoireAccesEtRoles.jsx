import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import RepertoireAdministrateurs from './repertoireAccesEtRoles/repertoireAdministrateurs';
import RepertoireFacturiers from './repertoireAccesEtRoles/repertoireFacturiers';

const GrilleStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CarteStat = styled.div`
  background: linear-gradient(145deg, #18181b 0%, #121214 100%);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 1.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; width: 4px; height: 100%;
    background: #22c55e;
    opacity: 0.7;
  }

  .infos-stat {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    span.titre { color: #94a3b8; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }
    span.valeur { color: #f8fafc; font-size: 2.25rem; font-weight: 800; }
  }

  .icone-stat {
    width: 52px; height: 52px; border-radius: 12px;
    background: rgba(34, 197, 94, 0.1); color: #22c55e;
    display: flex; align-items: center; justify-content: center; font-size: 1.4rem;
    border: 1px solid rgba(34, 197, 94, 0.2);
  }
`;

const CarteListe = styled.div`
  background: #121214;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;

  .entete-carte {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);

    h3 { font-size: 1.2rem; color: #f8fafc; font-weight: 600; }

    .barre-outils input.recherche {
      background: #18181b;
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 0.7rem 1rem 0.7rem 2.4rem;
      border-radius: 10px;
      color: #f8fafc;
      font-size: 0.875rem;
      outline: none;
      width: 280px;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8' width='16' height='16'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'%3E%3C/path%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: 10px center;
      &:focus { border-color: #22c55e; }
    }
  }
`;

const OverlayModal = styled.div`
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.75); backdrop-filter: blur(6px);
  display: flex; align-items: center; justify-content: center; z-index: 1000;
`;

const ContenuModal = styled.div`
  background: #18181b; border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 2rem; border-radius: 16px; width: 100%; max-width: 420px;
  display: flex; flex-direction: column; gap: 1rem;

  h4 { color: #f8fafc; font-size: 1.15rem; font-weight: 600; } 
  p { color: #94a3b8; font-size: 0.875rem; line-height: 1.5; strong { color: #f8fafc; } }

  .actions-modal {
    display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1rem;
    button {
      padding: 0.6rem 1.1rem; border-radius: 8px; font-size: 0.85rem; cursor: pointer; font-weight: 600;
      &.btn-confirmer-suppr { background: #ef4444; color: #fff; &:hover { background: #dc2626; } }
      &.btn-annuler-suppr { background: rgba(255, 255, 255, 0.05); color: #cbd5e1; &:hover { background: rgba(255, 255, 255, 0.1); } }
    }
  }
`;

export default function RepertoireAccesEtRoles({ 
  facturiers = [], 
  surSupprimerFacturier, 
  surModifierFacturier, 
  declencherNotification 
}) {
  const [idEnEdition, setIdEnEdition] = useState(null);
  const [formDataEdit, setFormDataEdit] = useState({ prenom: '', nom: '', email: '', role: '', motDePasse: '' });
  const [recherche, setRecherche] = useState('');
  const [utilisateurASupprimer, setUtilisateurASupprimer] = useState(null);

  const [motsDePasseVisibles, setMotsDePasseVisibles] = useState({});
  const [voirMdpEdition, setVoirMdpEdition] = useState(false);

  const basculerVisibiliteMdp = (id) => {
    setMotsDePasseVisibles(prev => ({ ...prev, [id]: !prev[id] }));
  };

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
    setVoirMdpEdition(false);
    setFormDataEdit({
      prenom: utilisateur.prenom,
      nom: utilisateur.nom,
      email: utilisateur.email,
      role: utilisateur.role,
      motDePasse: utilisateur.mot_de_passe || utilisateur.motDePasse || ''
    });
  };

  const sauvegarderModification = async (utilisateur) => {
    if (surModifierFacturier) {
      try {
        const resultat = await surModifierFacturier(utilisateur.id, {
          ...formDataEdit,
          ancienRole: utilisateur.role 
        });

        const roleModifie = formDataEdit.role && formDataEdit.role !== utilisateur.role;
        const mdpActuel = utilisateur.mot_de_passe || utilisateur.motDePasse || '';
        const mdpModifie = formDataEdit.motDePasse && formDataEdit.motDePasse !== mdpActuel;

        let messageFinal = resultat?.message;
        if (!messageFinal) {
          if (roleModifie && mdpModifie) {
            messageFinal = `Rôle mis à jour (${formDataEdit.role}) et nouveau mot de passe enregistré.`;
          } else if (roleModifie) {
            messageFinal = `Nouveau rôle attribué (${formDataEdit.role}).`;
          } else if (mdpModifie) {
            messageFinal = `Mot de passe de ${utilisateur.prenom} mis à jour.`;
          } else {
            messageFinal = "Modification enregistrée avec succès.";
          }
        }
        declencherNotification(messageFinal, 'success');
      } catch (erreur) {
        const messageErr = erreur.response?.data?.erreur || erreur.message || "Erreur lors de la modification.";
        declencherNotification(messageErr, 'error');
      }
    }
    setIdEnEdition(null);
  };

  const confirmerSuppression = () => {
    if (utilisateurASupprimer && surSupprimerFacturier) {
      surSupprimerFacturier(utilisateurASupprimer.id);
      declencherNotification(`Compte de ${utilisateurASupprimer.prenom} ${utilisateurASupprimer.nom} supprimé.`, 'success');
    }
    setUtilisateurASupprimer(null);
  };

  return (
    <>
      <GrilleStats>
        <CarteStat>
          <div className="infos-stat"><span className="titre">Total Utilisateurs</span><span className="valeur">{totalUtilisateurs}</span></div>
          <div className="icone-stat">👥</div>
        </CarteStat>
        <CarteStat>
          <div className="infos-stat"><span className="titre">Administrateurs</span><span className="valeur">{nombreAdmins}</span></div>
          <div className="icone-stat">🛡️</div>
        </CarteStat>
        <CarteStat>
          <div className="infos-stat"><span className="titre">Facturiers</span><span className="valeur">{nombreFacturiers}</span></div>
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

        <RepertoireAdministrateurs 
          admins={listeAdmins} 
          surSupprimer={(admin) => setUtilisateurASupprimer(admin)} 
        />

        <RepertoireFacturiers 
          facturiers={listeFacturiersSeuls}
          idEnEdition={idEnEdition}
          formDataEdit={formDataEdit}
          setFormDataEdit={setFormDataEdit}
          demarrerEdition={demarrerEdition}
          sauvegarderModification={sauvegarderModification}
          annulerEdition={() => setIdEnEdition(null)}
          surSupprimer={(facturier) => setUtilisateurASupprimer(facturier)}
          motsDePasseVisibles={motsDePasseVisibles}
          basculerVisibiliteMdp={basculerVisibiliteMdp}
          voirMdpEdition={voirMdpEdition}
          setVoirMdpEdition={setVoirMdpEdition}
        />
      </CarteListe>

      {utilisateurASupprimer && (
        <OverlayModal>
          <ContenuModal>
            <h4>Confirmer la suppression</h4>
            <p>Êtes-vous sûr de vouloir supprimer le compte de <strong>{utilisateurASupprimer.prenom} {utilisateurASupprimer.nom}</strong> ?</p>
            <div className="actions-modal">
              <button className="btn-annuler-suppr" onClick={() => setUtilisateurASupprimer(null)}>Annuler</button>
              <button className="btn-confirmer-suppr" onClick={confirmerSuppression}>Supprimer</button>
            </div>
          </ContenuModal>
        </OverlayModal>
      )}
    </>
  );
}