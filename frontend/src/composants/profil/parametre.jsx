import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';

// Imports des composants en camelCase
import InformationsPersonnelles from './parametres/informationsPersonnelles';
import Securite from './parametres/securite';
import Apparence from './parametres/apparence';

const ConteneurPage = styled.div`
  max-width: 900px;
  width: 100%;
  margin: 2rem auto;
  padding: 0 1rem;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  color: #f1f5f9;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const SectionEnTete = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1.5rem;
  background: linear-gradient(135deg, rgba(20, 20, 25, 0.6) 0%, rgba(10, 10, 12, 0.8) 100%);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 1.5rem 2rem;
  backdrop-filter: blur(16px);
`;

const BlocIdentite = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const AvatarCercle = styled.div`
  width: 65px;
  height: 65px;
  border-radius: 50%;
  background: linear-gradient(135deg, #22c55e 0%, #10b981 100%);
  color: #052e16;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.4rem;
  box-shadow: 0 8px 20px rgba(34, 197, 94, 0.25);
`;

const InfosTexte = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;

  h2 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #ffffff;
    margin: 0;
    text-transform: capitalize;
  }

  p {
    font-size: 0.85rem;
    color: #94a3b8;
    margin: 0;
  }
`;

const BadgeStatut = styled.span`
  background: rgba(34, 197, 94, 0.1);
  color: #4ade80;
  border: 1px solid rgba(34, 197, 94, 0.2);
  padding: 0.35rem 0.85rem;
  border-radius: 30px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

/* Barre d'onglets centrée située sous l'en-tête */
const BarreOngletsBas = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding-bottom: 1rem;
  overflow-x: auto;
`;

const BoutonOnglet = styled.button`
  background: ${props => props.$actif ? 'rgba(34, 197, 94, 0.15)' : 'transparent'};
  color: ${props => props.$actif ? '#4ade80' : '#94a3b8'};
  border: 1px solid ${props => props.$actif ? 'rgba(34, 197, 94, 0.3)' : 'transparent'};
  border-radius: 10px;
  padding: 0.75rem 1.25rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  white-space: nowrap;
  transition: all 0.25s ease;

  &:hover {
    background: ${props => props.$actif ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255, 255, 255, 0.04)'};
    color: ${props => props.$actif ? '#4ade80' : '#ffffff'};
  }
`;

/* Animation de transition fluide (style SPA dynamique) */
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const SectionFormulaire = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  animation: ${fadeIn} 0.3s ease-in-out;
`;

const PiedFormulaire = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
`;

const rotationAnimation = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerChargement = styled.span`
  width: 16px;
  height: 16px;
  border: 2px solid #052e16;
  border-top: 2px solid transparent;
  border-radius: 50%;
  display: inline-block;
  animation: ${rotationAnimation} 0.8s linear infinite;
`;

const BoutonAction = styled.button`
  background: #22c55e;
  color: #052e16;
  font-weight: 600;
  font-size: 0.95rem;
  padding: 0.85rem 1.75rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  box-shadow: 0 4px 14px rgba(34, 197, 94, 0.3);

  &:hover {
    background: #16a34a;
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(34, 197, 94, 0.4);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const NotificationMessage = styled.div`
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  color: #4ade80;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
`;

export default function Paramettre({ utilisateurConnecte, surModificationUtilisateur, themeActuel, surChangementTheme }) {
  const user = utilisateurConnecte || {};
  // Récupération sécurisée de l'ID utilisateur (prend en charge id, _id ou uid)
  const userId = user.id || user._id || user.uid;
  const roleUtilisateur = (user.role || '').toLowerCase();
  const isAdmin = roleUtilisateur.includes('admin');

  const [ongletParametreActif, setOngletParametreActif] = useState('profil');
  const [enCoursDeChargement, setEnCoursDeChargement] = useState(false);
  const [message, setMessage] = useState('');

  const [formData, setFormData] = useState({
    prenom: user.prenom || '',
    nom: user.nom || '',
    postnom: user.postnom || '',
    email: user.email || '',
    ancienMotDePasse: '',
    nouveauMotDePasse: ''
  });

  const [estSombre, setEstSombre] = useState(themeActuel !== 'clair');

  const initiales = `${formData.prenom ? formData.prenom.charAt(0) : ''}${formData.nom ? formData.nom.charAt(0) : ''}`.toUpperCase() || 'U';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleToggleTheme = () => {
    const nouvelEtat = !estSombre;
    setEstSombre(nouvelEtat);
    const themeStr = nouvelEtat ? 'sombre' : 'clair';
    if (surChangementTheme) surChangementTheme(themeStr);
  };

const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      setMessage("Erreur : ID utilisateur introuvable. Veuillez vous reconnecter.");
      return;
    }

    setEnCoursDeChargement(true);
    setMessage('');

    try {
      // Utilisation de la route unique définie dans ton backend
      const routeApi = `http://localhost:5000/api/utilisateurs/${userId}`;

      const payload = {
        ...formData,
        role: user.role || 'Facturier',
        ancienRole: user.role || 'Facturier'
      };

      const reponse = await axios.put(routeApi, payload);

      if (surModificationUtilisateur) {
        surModificationUtilisateur(reponse.data || formData);
      }

      setMessage("Vos informations ont été modifiées et enregistrées avec succès !");
    } catch (err) {
      console.error("Erreur lors de la mise à jour du profil :", err);
      setMessage(err.response?.data?.erreur || "Erreur lors de la mise à jour. Veuillez réessayer.");
    } finally {
      setEnCoursDeChargement(false);
      setTimeout(() => setMessage(''), 5000);
    }
  };

  return (
    <ConteneurPage>
      {/* 1. En-tête d'informations en haut */}
      <SectionEnTete>
        <BlocIdentite>
          <AvatarCercle>{initiales}</AvatarCercle>
          <InfosTexte>
            <h2>{`${formData.prenom} ${formData.nom} ${formData.postnom}`.trim() || 'Mon Profil'}</h2>
            <p>{formData.email || 'Aucune adresse e-mail'}</p>
          </InfosTexte>
        </BlocIdentite>
        <BadgeStatut>{user.role || 'Utilisateur'}</BadgeStatut>
      </SectionEnTete>

      {/* 2. Barre d'onglets centrée positionnée sous l'en-tête */}
      <BarreOngletsBas>
        <BoutonOnglet 
          type="button" 
          $actif={ongletParametreActif === 'profil'} 
          onClick={() => setOngletParametreActif('profil')}
        >
          👤 Information profil
        </BoutonOnglet>
        <BoutonOnglet 
          type="button" 
          $actif={ongletParametreActif === 'securite'} 
          onClick={() => setOngletParametreActif('securite')}
        >
          🔒 Sécurité
        </BoutonOnglet>
        <BoutonOnglet 
          type="button" 
          $actif={ongletParametreActif === 'apparence'} 
          onClick={() => setOngletParametreActif('apparence')}
        >
          🎨 Apparence
        </BoutonOnglet>
      </BarreOngletsBas>

      {/* 3. Contenu du formulaire avec la clé pour déclencher l'animation fluide */}
      <SectionFormulaire onSubmit={handleSubmit} key={ongletParametreActif}>
        {ongletParametreActif === 'apparence' && (
          <Apparence estSombre={estSombre} handleToggleTheme={handleToggleTheme} />
        )}

        {ongletParametreActif === 'profil' && (
          <InformationsPersonnelles formData={formData} handleChange={handleChange} />
        )}

        {ongletParametreActif === 'securite' && (
          <Securite formData={formData} handleChange={handleChange} />
        )}

        <PiedFormulaire>
          {message ? <NotificationMessage>{message}</NotificationMessage> : <div />}
          <BoutonAction type="submit" disabled={enCoursDeChargement}>
            {enCoursDeChargement ? (
              <>
                <SpinnerChargement />
                <span>Enregistrement en cours...</span>
              </>
            ) : (
              'Enregistrer les modifications'
            )}
          </BoutonAction>
        </PiedFormulaire>
      </SectionFormulaire>
    </ConteneurPage>
  );
}