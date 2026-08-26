import React from 'react';
import styled from 'styled-components';

const THEME = {
  accentuation: '#AEEA00',
  textePrincipal: '#FFFFFF',
  texteSecondaire: '#8A99AD'
};

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

const TitreSection = styled.h2`
  font-size: 0.85rem;
  color: ${THEME.textePrincipal};
  margin-bottom: 0.6rem;
  font-weight: 600;
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
  color: ${THEME.accentuation};
`;

// Dictionnaire des informations d'aide
export const infosAide = {
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

export default function GuideCreationComptes({ champActif }) {
  const infoActuelle = infosAide[champActif] || infosAide.general;

  return (
    <ColonneAide>
      <TitreAide>{infoActuelle.titre}</TitreAide>
      <TexteAide>{infoActuelle.description}</TexteAide>
      
      <TitreSection>
        Détails & Instructions :
      </TitreSection>
      <ListeCheck>
        {infoActuelle.etapes.map((etape, index) => (
          <ElementCheck key={index}>
            <span>✔</span> {etape}
          </ElementCheck>
        ))}
      </ListeCheck>
    </ColonneAide>
  );
}