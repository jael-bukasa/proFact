import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';

// Imports des sous-composants
import InformationsPersonnelles from './parametres/informationsPersonnelles';
import Securite from './parametres/securite';

const ConteneurPage = styled.div`
  max-width: 900px;
  width: 100%;
  margin: 2rem auto;
  padding: 0 1rem;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  color: ${props => props.theme.textePrincipal};
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
  background: ${props => props.theme.fondBloc};
  border: 1px solid ${props => props.theme.bordure};
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
  background: linear-gradient(135deg, ${props => props.theme.primaire} 0%, #10b981 100%);
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
    color: ${props => props.theme.textePrincipal};
    margin: 0;
    text-transform: capitalize;
  }

  p {
    font-size: 0.85rem;
    color: ${props => props.theme.texteSecondaire};
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

const BarreOngletsBas = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  border-bottom: 1px solid ${props => props.theme.bordure};
  padding-bottom: 1rem;
  overflow-x: auto;
`;

const BoutonOnglet = styled.button`
  background: ${props => props.$actif ? 'rgba(34, 197, 94, 0.15)' : 'transparent'};
  color: ${props => props.$actif ? '#4ade80' : props.theme.texteSecondaire};
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
    color: ${props => props.$actif ? '#4ade80' : props.theme.textePrincipal};
  }
`;

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

const ConteneurOnglet = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  animation: ${fadeIn} 0.3s ease-in-out;
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

export default function Parametres({ utilisateurConnecte, surModificationUtilisateur }) {
  const user = utilisateurConnecte || {};
  const userId = user.id || user._id || user.uid;

  const [ongletParametreActif, setOngletParametreActif] = useState('profil');
  const [enCoursDeChargement, setEnCoursDeChargement] = useState(false);
  const [message, setMessage] = useState('');
  
  const [erreursSecurite, setErreursSecurite] = useState({});

  const [formData, setFormData] = useState({
    prenom: user.prenom || '',
    nom: user.nom || '',
    postnom: user.postnom || '',
    email: user.email || '',
    ancienMotDePasse: '',
    nouveauMotDePasse: '',
    confirmationMotDePasse: ''
  });

  const initiales = `${formData.prenom ? formData.prenom.charAt(0) : ''}${formData.nom ? formData.nom.charAt(0) : ''}`.toUpperCase() || 'U';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === 'ancienMotDePasse') setErreursSecurite(prev => ({ ...prev, ancien: '' }));
    if (e.target.name === 'nouveauMotDePasse') setErreursSecurite(prev => ({ ...prev, nouveau: '' }));
    if (e.target.name === 'confirmationMotDePasse') setErreursSecurite(prev => ({ ...prev, confirmation: '' }));
  };

  const handleSubmitProfil = async (e) => {
    e.preventDefault();
    console.log("-> Clic détecté sur Enregistrer le profil. ID utilisateur :", userId);

    if (!userId) {
      setMessage("Erreur : ID utilisateur introuvable. Veuillez vous reconnecter.");
      return;
    }
    if (!formData.nom || !formData.email) {
      setMessage("Veuillez remplir au moins le nom et l'e-mail.");
      return;
    }
    await envoyerRequeteAPI();
  };

  const handleSubmitSecurite = async (e) => {
    e.preventDefault();
    console.log("-> Clic détecté sur Sécurité. ID utilisateur :", userId);
    setErreursSecurite({});
    setMessage('');

    if (!userId) {
      setMessage("Erreur : ID utilisateur introuvable. Veuillez vous reconnecter.");
      return;
    }

    let nouvellesErreurs = {};

    if (!formData.ancienMotDePasse) nouvellesErreurs.ancien = "Champ requis";
    if (!formData.nouveauMotDePasse) nouvellesErreurs.nouveau = "Champ requis";
    if (!formData.confirmationMotDePasse) nouvellesErreurs.confirmation = "Champ requis";

    if (Object.keys(nouvellesErreurs).length > 0) {
      setErreursSecurite(nouvellesErreurs);
      return;
    }

    if (formData.nouveauMotDePasse !== formData.confirmationMotDePasse) {
      setErreursSecurite({
        nouveau: "Les mots de passe ne correspondent pas",
        confirmation: "Les mots de passe ne correspondent pas"
      });
      return;
    }

    await envoyerRequeteAPI();
  };

  const envoyerRequeteAPI = async () => {
    setEnCoursDeChargement(true);
    setMessage('');

    try {
      const routeApi = `http://localhost:5000/api/utilisateurs/${userId}`;
      
      // Adaptation propre pour que le backend reconnaisse 'admin' ou 'facturier' de façon fiable
      const roleActuel = (user.role || 'Facturier').toLowerCase();
      const ancienRoleFormate = roleActuel.includes('admin') ? 'admin' : 'facturier';

      const payload = {
        ...formData,
        role: user.role || 'Facturier',
        ancienRole: ancienRoleFormate
      };

      console.log("Envoi de la requête Axios vers :", routeApi, payload);
      const reponse = await axios.put(routeApi, payload);
      console.log("Réponse reçue du serveur :", reponse.data);

      if (surModificationUtilisateur) {
        surModificationUtilisateur(reponse.data || formData);
      }

      setFormData(prev => ({
        ...prev,
        ancienMotDePasse: '',
        nouveauMotDePasse: '',
        confirmationMotDePasse: ''
      }));

      setMessage("Vos informations ont été modifiées et enregistrées avec succès !");
    } catch (err) {
      console.error("Erreur lors de la mise à jour (Axios error) :", err);
      const msgErreurAPI = err.response?.data?.erreur || "";
      
      if (msgErreurAPI.toLowerCase().includes("ancien") || msgErreurAPI.toLowerCase().includes("incorrect")) {
        setErreursSecurite({ ancien: "Mot de passe incorrect" });
      } else {
        setMessage(msgErreurAPI || "Erreur lors de la mise à jour. Veuillez réessayer.");
      }
    } finally {
      setEnCoursDeChargement(false);
      setTimeout(() => setMessage(''), 5000);
    }
  };

  return (
    <ConteneurPage>
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

      <BarreOngletsBas>
        <BoutonOnglet 
          type="button" 
          $actif={ongletParametreActif === 'profil'} 
          onClick={() => { setOngletParametreActif('profil'); setMessage(''); }}
        >
          👤 Information profil
        </BoutonOnglet>
        <BoutonOnglet 
          type="button" 
          $actif={ongletParametreActif === 'securite'} 
          onClick={() => { setOngletParametreActif('securite'); setMessage(''); }}
        >
          🔒 Sécurité
        </BoutonOnglet>
      </BarreOngletsBas>

      {message && <NotificationMessage>{message}</NotificationMessage>}

      <ConteneurOnglet>
        {ongletParametreActif === 'profil' && (
          <InformationsPersonnelles 
            formData={formData} 
            handleChange={handleChange} 
            onSubmit={handleSubmitProfil} 
          />
        )}

        {ongletParametreActif === 'securite' && (
          <Securite 
            formData={formData} 
            handleChange={handleChange} 
            onSubmit={handleSubmitSecurite}
            erreurs={erreursSecurite} 
            enCoursDeChargement={enCoursDeChargement}
          />
        )}
      </ConteneurOnglet>
    </ConteneurPage>
  );
}