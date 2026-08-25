import React, { useState, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

const THEME = {
  fondCarte: '#121826',
  fondInput: '#0B101B',
  accentuation: '#AEEA00',
  textePrincipal: '#FFFFFF',
  texteSecondaire: '#8A99AD',
  bordure: 'rgba(255, 255, 255, 0.08)',
  bordureFocus: '#AEEA00',
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
  border-radius: 14px;
  padding: 1.5rem;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
`;

const ColonneAide = styled.div`
  flex: 1;
  background: linear-gradient(145deg, rgba(18, 24, 38, 0.8) 0%, rgba(11, 16, 27, 0.9) 100%);
  border: 1px solid ${THEME.accentuation}33;
  border-radius: 14px;
  padding: 1.5rem;
  position: sticky;
  top: 1.5rem;
  box-shadow: 0 8px 32px 0 rgba(174, 234, 0, 0.05);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background-color: ${THEME.accentuation};
    border-top-left-radius: 14px;
    border-bottom-left-radius: 14px;
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
    box-shadow: 0 0 0 3px ${props => props.$enErreur ? 'rgba(239, 68, 68, 0.15)' : 'rgba(174, 234, 0, 0.15)'};
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
  border: 1px solid ${THEME.bordure};
  border-radius: 6px;
  color: ${THEME.textePrincipal};
  font-size: 0.9rem;
  transition: all 0.25s ease;

  &:focus {
    outline: none;
    border-color: ${THEME.bordureFocus};
    box-shadow: 0 0 0 3px rgba(174, 234, 0, 0.15);
  }

  option {
    background-color: ${THEME.fondInput};
    color: ${THEME.textePrincipal};
  }
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
  background-color: rgba(174, 234, 0, 0.1);
  border: 1px solid ${THEME.accentuation};
  color: ${THEME.accentuation};
  padding: 0.75rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  font-size: 0.85rem;
  text-align: center;
  animation: ${apparition} 0.3s ease forwards;
`;

const MessageErreur = styled.div`
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

const TitreAide = styled.h3`
  color: ${THEME.accentuation};
  font-size: 1rem;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const TexteAide = styled.p`
  color: ${THEME.textePrincipal};
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 1rem;
`;

const ListeCheck = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`;

const ElementCheck = styled.li`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: ${props => props.$valide ? THEME.accentuation : THEME.texteSecondaire};
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
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);
  const [champsInvalides, setChampsInvalides] = useState([]);

  const [voirMotDePasse, setVoirMotDePasse] = useState(false);
  const [voirConfirmation, setVoirConfirmation] = useState(false);

  const referenceErreur = useRef(null);

  const infosAide = {
    general: {
      titre: "💡 Guide de création de compte",
      description: "Remplissez les informations du formulaire pour attribuer un accès sécurisé (Admin ou Facturier) sur la plateforme ProFact.",
      etapes: [
        "Renseigner l'identité du collaborateur",
        "Définir un mot de passe sécurisé",
        "Sélectionner le profil d'accès adapté"
      ]
    },
    prenom: {
      titre: "👤 Prénom du collaborateur",
      description: "Entrez le prénom usuel de l'agent. Il sera affiché dans l'historique des quittances et des opérations.",
      etapes: [
        "Minimum 2 caractères requis",
        "Première lettre en majuscule recommandée"
      ]
    },
    nom: {
      titre: "🏷️ Nom de famille",
      description: "Indiquez le nom officiel de l'utilisateur pour l'identification claire dans les rapports et la gestion.",
      etapes: [
        "Nom officiel pour la traçabilité",
        "Associé au profil de connexion"
      ]
    },
    email: {
      titre: "✉️ Adresse E-mail",
      description: "Cette adresse servira d'identifiant unique pour se connecter au système ProFact.",
      etapes: [
        "Doit respecter le format valide (ex: nom@profact.com)",
        "Doit être unique pour chaque utilisateur"
      ]
    },
    role: {
      titre: "🛡️ Niveau d'accès",
      description: "Choisissez le type de privilèges accordé à ce compte :",
      etapes: [
        "• Facturier : Gestion des quittances, clients et paiements.",
        "• Admin : Accès complet incluant la gestion des comptes."
      ]
    },
    motDePasse: {
      titre: "🔒 Mot de passe sécurisé",
      description: "Définissez un mot de passe sécurisé que le collaborateur utilisera pour se connecter. Vous pouvez cliquer sur l'icône de l'œil pour vérifier la saisie.",
      etapes: [
        "Minimum de 6 caractères conseillé",
        "Associer lettres et chiffres pour plus de sécurité"
      ]
    },
    confirmationMotDePasse: {
      titre: "🔄 Confirmation du mot de passe",
      description: "Retapez exactement le même mot de passe pour valider qu'il n'y a pas d'erreur de saisie.",
      etapes: [
        "Doit correspondre parfaitement au champ précédent",
        "Valide l'activation sécurisée du compte"
      ]
    }
  };

  const infoActuelle = infosAide[champActif] || infosAide.general;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (champsInvalides.includes(name)) {
      setChampsInvalides(champsInvalides.filter(c => c !== name));
    }
    if (erreur) setErreur('');
  };

  const declencherErreur = (message, champsCibles = []) => {
    setErreur(message);
    setChampsInvalides(champsCibles);
    setSucces(false);
    
    if (referenceErreur.current) {
      referenceErreur.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur('');
    setChampsInvalides([]);

    if (!formData.prenom || !formData.nom || !formData.email || !formData.motDePasse || !formData.confirmationMotDePasse) {
      declencherErreur("Veuillez remplir tous les champs obligatoires du formulaire.");
      return;
    }

    if (formData.motDePasse !== formData.confirmationMotDePasse) {
      declencherErreur("Les mots de passe saisis ne correspondent pas.", ['motDePasse', 'confirmationMotDePasse']);
      return;
    }

    setChargement(true);

    try {
      // Détermination de l'URL selon le rôle choisi
      // Si c'est Admin -> /api/admin/inscription
      // Si c'est Facturier -> /api/facturiers
      const estAdmin = formData.role.toLowerCase() === 'admin';
      const urlEndpoint = estAdmin ? 'http://localhost:5000/api/admin/inscription' : 'http://localhost:5000/api/facturiers';

      // Pour l'admin, les clés attendues par ton back sont { nom, email, motDePasse, role }
      // Pour le facturier, les clés attendues sont { prenom, nom, email, motDePasse, role }
      const corpsRequete = estAdmin 
        ? { nom: `${formData.prenom} ${formData.nom}`, email: formData.email, motDePasse: formData.motDePasse, role: formData.role }
        : { prenom: formData.prenom, nom: formData.nom, email: formData.email, motDePasse: formData.motDePasse, role: formData.role };

      const reponse = await fetch(urlEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(corpsRequete),
      });

      const resultat = await reponse.json();

      if (!reponse.ok) {
        throw new Error(resultat.erreur || "Erreur lors de la création du compte.");
      }

      setSucces(true);

      // Si une fonction parente est fournie, on la prévient
      if (surAjoutFacturier && !estAdmin) {
        surAjoutFacturier(resultat.data || resultat.facturier);
      }

      // Réinitialisation du formulaire
      setFormData({
        prenom: '',
        nom: '',
        email: '',
        role: 'Facturier',
        motDePasse: '',
        confirmationMotDePasse: ''
      });

      if (referenceErreur.current) {
        referenceErreur.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      setTimeout(() => {
        setSucces(false);
      }, 4000);

    } catch (err) {
      declencherErreur(err.message || "Impossible de joindre le serveur backend.");
    } finally {
      setChargement(false);
    }
  };

  return (
    <ConteneurPrincipal>
      <ColonneFormulaire>
        <div ref={referenceErreur} tabIndex={-1} style={{ outline: 'none' }} />

        <TitreSection>Créer un nouveau compte</TitreSection>
        <SousTitre>Ajoutez un Admin ou un Facturier pour opérer sur la plateforme.</SousTitre>

        {succes && (
          <MessageSucces>
            🎉 Compte créé avec succès dans la base de données ! Le collaborateur peut désormais se connecter.
          </MessageSucces>
        )}

        {erreur && (
          <MessageErreur>
            <span>⚠️</span> {erreur}
          </MessageErreur>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <GrilleChamps>
            <GroupeChamp>
              <Label>Prénom</Label>
              <Input 
                type="text" 
                name="prenom" 
                value={formData.prenom} 
                onChange={handleChange}
                onFocus={() => setChampActif('prenom')}
                placeholder="Ex: Jean" 
              />
            </GroupeChamp>
            <GroupeChamp>
              <Label>Nom</Label>
              <Input 
                type="text" 
                name="nom" 
                value={formData.nom} 
                onChange={handleChange}
                onFocus={() => setChampActif('nom')}
                placeholder="Ex: Dupont" 
              />
            </GroupeChamp>
          </GrilleChamps>

          <GroupeChamp className="plein">
            <Label>Adresse E-mail</Label>
            <Input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange}
              onFocus={() => setChampActif('email')}
              placeholder="jean.dupont@profact.com" 
            />
          </GroupeChamp>

          <GroupeChamp className="plein">
            <Label>Rôle du compte</Label>
            <Select 
              name="role" 
              value={formData.role} 
              onChange={handleChange}
              onFocus={() => setChampActif('role')}
            >
              <option value="Facturier">Facturier</option>
              <option value="Admin">Admin</option>
            </Select>
          </GroupeChamp>

          <GrilleChamps>
            <GroupeChamp>
              <Label>Mot de passe</Label>
              <ConteneurInputMotDePasse>
                <Input 
                  type={voirMotDePasse ? "text" : "password"} 
                  name="motDePasse" 
                  value={formData.motDePasse} 
                  onChange={handleChange}
                  onFocus={() => setChampActif('motDePasse')}
                  placeholder="••••••••" 
                  $enErreur={champsInvalides.includes('motDePasse')}
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
            </GroupeChamp>

            <GroupeChamp>
              <Label>Confirmer le mot de passe</Label>
              <ConteneurInputMotDePasse>
                <Input 
                  type={voirConfirmation ? "text" : "password"} 
                  name="confirmationMotDePasse" 
                  value={formData.confirmationMotDePasse} 
                  onChange={handleChange}
                  onFocus={() => setChampActif('confirmationMotDePasse')}
                  placeholder="••••••••" 
                  $enErreur={champsInvalides.includes('confirmationMotDePasse')}
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
            </GroupeChamp>
          </GrilleChamps>

          <BoutonSoumettre type="submit" disabled={chargement}>
            {chargement ? "Enregistrement en cours..." : "Créer le compte utilisateur"}
          </BoutonSoumettre>
        </form>
      </ColonneFormulaire>

      <ColonneAide>
        <TitreAide>{infoActuelle.titre}</TitreAide>
        <TexteAide>{infoActuelle.description}</TexteAide>
        
        <TitreSection style={{ fontSize: '0.85rem', marginBottom: '0.6rem' }}>
          Détails & Instructions :
        </TitreSection>
        <ListeCheck>
          {infoActuelle.etapes.map((etape, index) => (
            <ElementCheck key={index} $valide={true}>
              <span>✔</span> {etape}
            </ElementCheck>
          ))}
        </ListeCheck>
      </ColonneAide>
    </ConteneurPrincipal>
  );
}