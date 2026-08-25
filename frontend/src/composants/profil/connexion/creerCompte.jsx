import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import VitrineProFact from '../vitrines/vitrineProFact';
import MessageAccueil from './messageAccueil';

const apparition = keyframes`
  0% { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const PageConteneur = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  background-color: #000000;
  color: #FFFFFF;
  font-family: 'Inter', system-ui, sans-serif;
  overflow: hidden;

  @media (max-width: 968px) {
    flex-direction: column;
    overflow-y: auto;
  }
`;

const SectionFormulaire = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem 3rem;
  background-color: #000000;
  z-index: 2;
  overflow-y: auto;
  animation: ${apparition} 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;

  @media (max-width: 968px) {
    padding: 2rem 1.5rem;
  }
`;

const FormulaireBoite = styled.div`
  width: 100%;
  max-width: 400px;
  margin: auto 0;
`;

const Titre = styled.h1`
  font-size: 1.85rem;
  font-weight: 700;
  margin-bottom: 0.4rem;
  color: #FFFFFF;
  letter-spacing: -0.02em;
`;

const SousTitre = styled.p`
  font-size: 0.85rem;
  color: #888888;
  margin-bottom: 1.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const GroupeChamp = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const Label = styled.label`
  font-size: 0.8rem;
  font-weight: 500;
  color: #CCCCCC;
`;

const Input = styled.input`
  padding: 0.8rem 1rem;
  background-color: #121212;
  border: 1px solid ${(props) => (props.$enErreur ? '#ef4444' : '#2A2A2A')};
  border-radius: 8px;
  color: #FFFFFF;
  font-size: 0.9rem;
  transition: all 0.25s ease;

  &:hover {
    border-color: ${(props) => (props.$enErreur ? '#ef4444' : '#444444')};
  }

  &:focus {
    outline: none;
    border-color: ${(props) => (props.$enErreur ? '#ef4444' : '#AEEA00')};
    box-shadow: 0 0 0 3px ${(props) => (props.$enErreur ? 'rgba(239, 68, 68, 0.15)' : 'rgba(174, 234, 0, 0.12)')};
  }
`;

const BoutonSoumettre = styled.button`
  margin-top: 0.5rem;
  padding: 0.85rem;
  background-color: #AEEA00;
  color: #000000;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #b8f500;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(174, 234, 0, 0.2);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const BoiteErreur = styled.div`
  background-color: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #ef4444;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LienBas = styled.p`
  margin-top: 1.2rem;
  text-align: center;
  font-size: 0.85rem;
  color: #888888;

  span {
    color: #AEEA00;
    cursor: pointer;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export default function CreerCompte({ surInscriptionReussie, allerVersConnexion }) {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    motDePasse: '',
    confirmationMotDePasse: ''
  });
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);
  const [redirectionEnCours, setRedirectionEnCours] = useState(false);
  const [donneesAdmin, setDonneesAdmin] = useState(null); // Stocke les données renvoyées par l'API

  const fonctionnalites = [
    { titre: "Gestion Locative Centralisée", description: "Suivez l'état de vos biens, l'historique et les informations de vos locataires en temps réel." },
    { titre: "Facturation & Paiements Automatisés", description: "Générez vos factures professionnelles en quelques clics et suivez les règlements en un coup d'œil." },
    { titre: "Rapports et Analyses Financières", description: "Visualisez vos performances de trésorerie grâce à des tableaux de bord clairs et dynamiques." }
  ];

  const [indexActif, setIndexActif] = useState(0);

  useEffect(() => {
    const intervalle = setInterval(() => {
      setIndexActif((prev) => (prev + 1) % fonctionnalites.length);
    }, 3500);
    return () => clearInterval(intervalle);
  }, [fonctionnalites.length]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (erreur) setErreur('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur('');

    if (formData.motDePasse !== formData.confirmationMotDePasse) {
      setErreur('Les mots de passe ne correspondent pas.');
      return;
    }

    setChargement(true);

    try {
      const reponse = await fetch('http://localhost:5000/api/admin/inscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom: formData.nom,
          email: formData.email,
          motDePasse: formData.motDePasse,
          role: 'Administrateur'
        }),
      });

      const resultat = await reponse.json();

      if (!reponse.ok) {
        setErreur(resultat.erreur || "Erreur lors de l'inscription.");
        setChargement(false);
        return;
      }

      setChargement(false);
      setDonneesAdmin(resultat.admin);
      setRedirectionEnCours(true); // Affiche le composant MessageAccueil sans le fermer automatiquement

    } catch (err) {
      setErreur("Impossible de contacter le serveur.");
      setChargement(false);
    }
  };

  return (
    <PageConteneur>
      {redirectionEnCours && (
        <MessageAccueil 
          nomUtilisateur={formData.nom} 
          surTerminer={() => {
            if (surInscriptionReussie) {
              surInscriptionReussie(donneesAdmin);
            }
          }}
        />
      )}

      <SectionFormulaire>
        <FormulaireBoite>
          <Titre>Créer un compte</Titre>
          <SousTitre>Commencez à gérer vos locations dès aujourd'hui.</SousTitre>

          <Form onSubmit={handleSubmit} noValidate>
            <GroupeChamp>
              <Label>Nom complet</Label>
              <Input 
                type="text" 
                name="nom" 
                placeholder="Ex: Bukasa Mulaji Jael" 
                value={formData.nom} 
                onChange={handleChange} 
                required 
              />
            </GroupeChamp>

            <GroupeChamp>
              <Label>Adresse e-mail</Label>
              <Input 
                type="email" 
                name="email" 
                placeholder="nom@exemple.com" 
                value={formData.email} 
                onChange={handleChange} 
                required 
              />
            </GroupeChamp>

            <GroupeChamp>
              <Label>Mot de passe</Label>
              <Input 
                type="password" 
                name="motDePasse" 
                placeholder="••••••••" 
                value={formData.motDePasse} 
                onChange={handleChange} 
                required 
              />
            </GroupeChamp>

            <GroupeChamp>
              <Label>Confirmer le mot de passe</Label>
              <Input 
                type="password" 
                name="confirmationMotDePasse" 
                placeholder="••••••••" 
                value={formData.confirmationMotDePasse} 
                onChange={handleChange} 
                $enErreur={Boolean(erreur && formData.motDePasse !== formData.confirmationMotDePasse)}
                required 
              />
            </GroupeChamp>

            {erreur && <BoiteErreur>⚠️ {erreur}</BoiteErreur>}

            <BoutonSoumettre type="submit" disabled={chargement}>
              {chargement ? "Création en cours..." : "S'inscrire"}
            </BoutonSoumettre>
          </Form>

          <LienBas>
            Vous avez déjà un compte ? <span onClick={allerVersConnexion}>Se connecter</span>
          </LienBas>
        </FormulaireBoite>
      </SectionFormulaire>

      <VitrineProFact 
        fonctionnaliteActive={fonctionnalites[indexActif]} 
        indexActif={indexActif} 
        totalIndicateurs={fonctionnalites.length} 
      />
    </PageConteneur>
  );
}