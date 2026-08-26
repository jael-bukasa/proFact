import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import VitrineProFact from '../vitrines/vitrineProFact';
import MessageBienvenue from './messageBienvenue';

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

const ConteneurInput = styled.div`
  position: relative;
  width: 100%;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem 2.5rem 0.8rem 1rem;
  background-color: #121212;
  border: 1px solid #2A2A2A;
  border-radius: 8px;
  color: #FFFFFF;
  font-size: 0.9rem;
  transition: all 0.25s ease;

  &:hover {
    border-color: #444444;
  }

  &:focus {
    outline: none;
    border-color: #AEEA00;
    box-shadow: 0 0 0 3px rgba(174, 234, 0, 0.12);
  }
`;

const BoutonOeil = styled.button`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #888888;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.2rem;
  transition: color 0.2s ease;

  &:hover {
    color: #AEEA00;
  }
`;

const Select = styled.select`
  padding: 0.8rem 1rem;
  background-color: #121212;
  border: 1px solid #2A2A2A;
  border-radius: 8px;
  color: #FFFFFF;
  font-size: 0.9rem;
  transition: all 0.25s ease;
  cursor: pointer;

  &:hover {
    border-color: #444444;
  }

  &:focus {
    outline: none;
    border-color: #AEEA00;
    box-shadow: 0 0 0 3px rgba(174, 234, 0, 0.12);
  }

  option {
    background-color: #121212;
    color: #FFFFFF;
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

export default function Connexion({ surConnexionReussie, allerVersInscription }) {
  const [formData, setFormData] = useState({ 
    email: '', 
    motDePasse: '', 
    role: 'Administrateur'
  });
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);
  const [redirectionEnCours, setRedirectionEnCours] = useState(false);
  const [nomAdminConnecte, setNomAdminConnecte] = useState('');

  // État pour afficher/masquer le mot de passe
  const [voirMotDePasse, setVoirMotDePasse] = useState(false);

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
    setChargement(true);

    try {
      const reponse = await fetch('http://localhost:5000/api/admin/connexion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: formData.email, 
          motDePasse: formData.motDePasse,
          role: formData.role 
        }),
      });

      const resultat = await reponse.json();

      if (!reponse.ok) {
        setErreur(resultat.erreur || "Identifiants incorrects.");
        setChargement(false);
        return;
      }

      setChargement(false);
      setNomAdminConnecte(resultat.admin?.nom || resultat.nom || '');
      setRedirectionEnCours(true);

      setTimeout(() => {
        if (surConnexionReussie) {
          surConnexionReussie(resultat.admin || { role: formData.role });
        }
      }, 1500);

    } catch (err) {
      setErreur("Impossible de contacter le serveur.");
      setChargement(false);
    }
  };

  return (
    <PageConteneur>
      {redirectionEnCours && (
        <MessageBienvenue nomUtilisateur={nomAdminConnecte} />
      )}

      <SectionFormulaire>
        <FormulaireBoite>
          <Titre>Connexion</Titre>
          <SousTitre>Bon retour parmi nous, gérez vos biens.</SousTitre>

          <Form onSubmit={handleSubmit} noValidate>
            <GroupeChamp>
              <Label>Type d'utilisateur</Label>
              <Select 
                name="role" 
                value={formData.role} 
                onChange={handleChange}
              >
                <option value="Administrateur">Administrateur</option>
                <option value="Facturier">Facturier</option>
              </Select>
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
              <ConteneurInput>
                <Input 
                  type={voirMotDePasse ? "text" : "password"} 
                  name="motDePasse" 
                  placeholder="••••••••" 
                  value={formData.motDePasse} 
                  onChange={handleChange} 
                  required 
                />
                <BoutonOeil type="button" onClick={() => setVoirMotDePasse(!voirMotDePasse)}>
                  {voirMotDePasse ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </BoutonOeil>
              </ConteneurInput>
            </GroupeChamp>

            {erreur && <BoiteErreur>⚠️ {erreur}</BoiteErreur>}

            <BoutonSoumettre type="submit" disabled={chargement}>
              {chargement ? "Connexion..." : "Se connecter"}
            </BoutonSoumettre>
          </Form>

          <LienBas>
            Pas encore de compte ? <span onClick={allerVersInscription}>Créer un compte</span>
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