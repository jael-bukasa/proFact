import React, { useState, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import GuideCreationComptes from './guideCreationComptes';

const THEME = {
  fondCarte: '#1E1E1E',
  fondInput: '#121212',
  accentuation: '#22c55e',
  textePrincipal: '#FFFFFF',
  texteSecondaire: '#888888',
  bordure: '#2A2A2A',
  bordureFocus: '#22c55e',
  erreur: '#ef4444'
};

const apparition = keyframes`
  from { opacity: 0; transform: translateY(-6px); }
  to { opacity: 1; transform: translateY(0); }
`;

const ConteneurPrincipal = styled.div`
  display: flex;
  gap: 1.5rem;
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  align-items: flex-start;

  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

const ColonneFormulaire = styled.div`
  flex: 1.4;
  background-color: ${THEME.fondCarte};
  border: 1px solid ${THEME.bordure};
  border-radius: 12px;
  padding: 1.5rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background-color: ${THEME.accentuation};
  }
`;

const TitreSection = styled.h2`
  font-size: 1.25rem;
  color: ${THEME.textePrincipal};
  margin-bottom: 0.25rem;
  font-weight: 600;
`;

const SousTitre = styled.p`
  color: ${THEME.texteSecondaire};
  font-size: 0.85rem;
  margin-bottom: 1.25rem;
`;

const GrilleChamps = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.8rem;
  margin-bottom: 0.8rem;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const GroupeChamp = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin-bottom: 0.8rem;

  &.plein {
    grid-column: span 2;
  }
`;

const Label = styled.label`
  font-size: 0.8rem;
  color: ${THEME.textePrincipal};
  font-weight: 500;
`;

const ConteneurInputMotDePasse = styled.div`
  position: relative;
  width: 100%;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.55rem 2.5rem 0.55rem 0.85rem;
  background-color: ${THEME.fondInput};
  border: 1px solid ${props => props.$enErreur ? THEME.erreur : THEME.bordure};
  border-radius: 6px;
  color: ${THEME.textePrincipal};
  font-size: 0.9rem;
  transition: all 0.25s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.$enErreur ? THEME.erreur : THEME.bordureFocus};
    box-shadow: 0 0 0 3px ${props => props.$enErreur ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)'};
  }

  &::placeholder {
    color: ${THEME.texteSecondaire};
    opacity: 0.5;
  }
`;

const BoutonOeil = styled.button`
  position: absolute;
  right: 0.6rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: ${THEME.texteSecondaire};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.2rem;
  transition: color 0.2s ease;

  &:hover {
    color: ${THEME.accentuation};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.55rem 0.85rem;
  background-color: ${THEME.fondInput};
  border: 1px solid ${props => props.$enErreur ? THEME.erreur : THEME.bordure};
  border-radius: 6px;
  color: ${THEME.textePrincipal};
  font-size: 0.9rem;
  transition: all 0.25s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.$enErreur ? THEME.erreur : THEME.bordureFocus};
    box-shadow: 0 0 0 3px ${props => props.$enErreur ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)'};
  }

  option {
    background-color: ${THEME.fondInput};
    color: ${THEME.textePrincipal};
  }
`;

const TexteErreurChamp = styled.span`
  color: ${THEME.erreur};
  font-size: 0.75rem;
  margin-top: 0.15rem;
  animation: ${apparition} 0.2s ease forwards;
`;

const BoutonSoumettre = styled.button`
  width: 100%;
  padding: 0.7rem;
  background-color: ${THEME.accentuation};
  color: #000000;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: transform 0.2s ease, opacity 0.2s ease;
  margin-top: 0.5rem;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const MessageSucces = styled.div`
  background-color: rgba(34, 197, 94, 0.1);
  border: 1px solid ${THEME.accentuation};
  color: ${THEME.accentuation};
  padding: 0.75rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  font-size: 0.85rem;
  text-align: center;
  animation: ${apparition} 0.3s ease forwards;
`;

const MessageErreurGlobal = styled.div`
  background-color: rgba(239, 68, 68, 0.1);
  border: 1px solid ${THEME.erreur};
  color: ${THEME.erreur};
  padding: 0.75rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  font-size: 0.85rem;
  text-align: center;
  animation: ${apparition} 0.3s ease forwards;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

export default function CreationsComptes({ surAjoutFacturier }) {
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    role: 'Facturier',
    motDePasse: '',
    confirmationMotDePasse: ''
  });

  const [champActif, setChampActif] = useState('general');
  const [succes, setSucces] = useState(false);
  const [erreurGlobale, setErreurGlobale] = useState('');
  const [erreursChamps, setErreursChamps] = useState({});
  const [chargement, setChargement] = useState(false);

  const [voirMotDePasse, setVoirMotDePasse] = useState(false);
  const [voirConfirmation, setVoirConfirmation] = useState(false);

  const refsChamps = {
    prenom: useRef(null),
    nom: useRef(null),
    email: useRef(null),
    role: useRef(null),
    motDePasse: useRef(null),
    confirmationMotDePasse: useRef(null),
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (erreursChamps[name]) {
      setErreursChamps({ ...erreursChamps, [name]: '' });
    }
    if (erreurGlobale) setErreurGlobale('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreurGlobale('');
    
    let nouvellesErreurs = {};
    let premierChampInvalide = null;

    if (!formData.prenom.trim()) {
      nouvellesErreurs.prenom = "Le prénom est requis.";
      if (!premierChampInvalide) premierChampInvalide = 'prenom';
    }
    if (!formData.nom.trim()) {
      nouvellesErreurs.nom = "Le nom est requis.";
      if (!premierChampInvalide) premierChampInvalide = 'nom';
    }
    if (!formData.email.trim()) {
      nouvellesErreurs.email = "L'adresse e-mail est requise.";
      if (!premierChampInvalide) premierChampInvalide = 'email';
    } else {
      const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!regexEmail.test(formData.email)) {
        nouvellesErreurs.email = "Format d'e-mail invalide.";
        if (!premierChampInvalide) premierChampInvalide = 'email';
      }
    }
    if (!formData.motDePasse) {
      nouvellesErreurs.motDePasse = "Le mot de passe est requis.";
      if (!premierChampInvalide) premierChampInvalide = 'motDePasse';
    } else if (formData.motDePasse.length < 6) {
      nouvellesErreurs.motDePasse = "Le mot de passe doit contenir au moins 6 caractères.";
      if (!premierChampInvalide) premierChampInvalide = 'motDePasse';
    }
    if (!formData.confirmationMotDePasse) {
      nouvellesErreurs.confirmationMotDePasse = "Veuillez confirmer le mot de passe.";
      if (!premierChampInvalide) premierChampInvalide = 'confirmationMotDePasse';
    } else if (formData.motDePasse !== formData.confirmationMotDePasse) {
      nouvellesErreurs.confirmationMotDePasse = "Les mots de passe ne correspondent pas.";
      if (!premierChampInvalide) premierChampInvalide = 'confirmationMotDePasse';
    }

    setErreursChamps(nouvellesErreurs);

    if (Object.keys(nouvellesErreurs).length > 0) {
      setErreurGlobale("Veuillez corriger les erreurs signalées dans le formulaire.");
      if (premierChampInvalide && refsChamps[premierChampInvalide]?.current) {
        refsChamps[premierChampInvalide].current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        refsChamps[premierChampInvalide].current.focus();
      }
      return;
    }

    setChargement(true);

    try {
      const estAdmin = formData.role.toLowerCase() === 'admin';
      const urlEndpoint = estAdmin ? 'http://localhost:5000/api/admin/inscription' : 'http://localhost:5000/api/facturiers';

      const corpsRequete = estAdmin 
        ? { nom: `${formData.prenom} ${formData.nom}`, email: formData.email, motDePasse: formData.motDePasse, role: formData.role }
        : { prenom: formData.prenom, nom: formData.nom, email: formData.email, motDePasse: formData.motDePasse, role: formData.role };

      const reponse = await fetch(urlEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(corpsRequete),
      });

      const resultat = await reponse.json();

      if (!reponse.ok) {
        throw new Error(resultat.erreur || "Erreur lors de la création du compte.");
      }

      setSucces(true);

      if (surAjoutFacturier && !estAdmin) {
        surAjoutFacturier(resultat.data || resultat.facturier);
      }

      setFormData({
        prenom: '',
        nom: '',
        email: '',
        role: 'Facturier',
        motDePasse: '',
        confirmationMotDePasse: ''
      });

      window.scrollTo({ top: 0, behavior: 'smooth' });

      setTimeout(() => {
        setSucces(false);
      }, 4000);

    } catch (err) {
      setErreurGlobale(err.message || "Impossible de joindre le serveur backend.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setChargement(false);
    }
  };

  return (
    <ConteneurPrincipal>
      <ColonneFormulaire>
        <TitreSection>Créer un nouveau compte</TitreSection>
        <SousTitre>Ajoutez un Admin ou un Facturier pour opérer sur la plateforme.</SousTitre>

        {succes && (
          <MessageSucces>
            🎉 Compte créé avec succès dans la base de données ! Le collaborateur peut désormais se connecter.
          </MessageSucces>
        )}

        {erreurGlobale && (
          <MessageErreurGlobal>
            <span>⚠️</span> {erreurGlobale}
          </MessageErreurGlobal>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <GrilleChamps>
            <GroupeChamp ref={refsChamps.prenom}>
              <Label>Prénom</Label>
              <Input 
                type="text" 
                name="prenom" 
                value={formData.prenom} 
                onChange={handleChange}
                onFocus={() => setChampActif('prenom')}
                placeholder="Ex: Jean" 
                $enErreur={!!erreursChamps.prenom}
              />
              {erreursChamps.prenom && <TexteErreurChamp>{erreursChamps.prenom}</TexteErreurChamp>}
            </GroupeChamp>
            
            <GroupeChamp ref={refsChamps.nom}>
              <Label>Nom</Label>
              <Input 
                type="text" 
                name="nom" 
                value={formData.nom} 
                onChange={handleChange}
                onFocus={() => setChampActif('nom')}
                placeholder="Ex: Dupont" 
                $enErreur={!!erreursChamps.nom}
              />
              {erreursChamps.nom && <TexteErreurChamp>{erreursChamps.nom}</TexteErreurChamp>}
            </GroupeChamp>
          </GrilleChamps>

          <GroupeChamp className="plein" ref={refsChamps.email}>
            <Label>Adresse E-mail</Label>
            <Input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange}
              onFocus={() => setChampActif('email')}
              placeholder="jean.dupont@profact.com" 
              $enErreur={!!erreursChamps.email}
            />
            {erreursChamps.email && <TexteErreurChamp>{erreursChamps.email}</TexteErreurChamp>}
          </GroupeChamp>

          <GroupeChamp className="plein" ref={refsChamps.role}>
            <Label>Rôle du compte</Label>
            <Select 
              name="role" 
              value={formData.role} 
              onChange={handleChange}
              onFocus={() => setChampActif('role')}
              $enErreur={!!erreursChamps.role}
            >
              <option value="Facturier">Facturier</option>
              <option value="Admin">Admin</option>
            </Select>
            {erreursChamps.role && <TexteErreurChamp>{erreursChamps.role}</TexteErreurChamp>}
          </GroupeChamp>

          <GrilleChamps>
            <GroupeChamp ref={refsChamps.motDePasse}>
              <Label>Mot de passe</Label>
              <ConteneurInputMotDePasse>
                <Input 
                  type={voirMotDePasse ? "text" : "password"} 
                  name="motDePasse" 
                  value={formData.motDePasse} 
                  onChange={handleChange}
                  onFocus={() => setChampActif('motDePasse')}
                  placeholder="••••••••" 
                  $enErreur={!!erreursChamps.motDePasse}
                />
                <BoutonOeil type="button" onClick={() => setVoirMotDePasse(!voirMotDePasse)}>
                  {voirMotDePasse ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </BoutonOeil>
              </ConteneurInputMotDePasse>
              {erreursChamps.motDePasse && <TexteErreurChamp>{erreursChamps.motDePasse}</TexteErreurChamp>}
            </GroupeChamp>

            <GroupeChamp ref={refsChamps.confirmationMotDePasse}>
              <Label>Confirmer le mot de passe</Label>
              <ConteneurInputMotDePasse>
                <Input 
                  type={voirConfirmation ? "text" : "password"} 
                  name="confirmationMotDePasse" 
                  value={formData.confirmationMotDePasse} 
                  onChange={handleChange}
                  onFocus={() => setChampActif('confirmationMotDePasse')}
                  placeholder="••••••••" 
                  $enErreur={!!erreursChamps.confirmationMotDePasse}
                />
                <BoutonOeil type="button" onClick={() => setVoirConfirmation(!voirConfirmation)}>
                  {voirConfirmation ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </BoutonOeil>
              </ConteneurInputMotDePasse>
              {erreursChamps.confirmationMotDePasse && <TexteErreurChamp>{erreursChamps.confirmationMotDePasse}</TexteErreurChamp>}
            </GroupeChamp>
          </GrilleChamps>

          <BoutonSoumettre type="submit" disabled={chargement}>
            {chargement ? "Enregistrement en cours..." : "Créer le compte utilisateur"}
          </BoutonSoumettre>
        </form>
      </ColonneFormulaire>

      <GuideCreationComptes champActif={champActif} />
    </ConteneurPrincipal>
  );
}