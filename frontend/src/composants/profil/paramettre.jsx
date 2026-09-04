import React, { useState } from 'react';
import styled from 'styled-components';

const ConteneurPage = styled.div`
  max-width: 900px;
  width: 100%;
  margin: 2rem auto;
  padding: 0 1rem;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  color: #f1f5f9;
`;

const CarteProfil = styled.div`
  background: linear-gradient(135deg, rgba(20, 20, 25, 0.75) 0%, rgba(10, 10, 12, 0.85) 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 2.5rem;
  backdrop-filter: blur(16px);
  box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.5);
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
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding-bottom: 2rem;
`;

const BlocIdentite = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const AvatarCercle = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #22c55e 0%, #10b981 100%);
  color: #052e16;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.75rem;
  box-shadow: 0 8px 20px rgba(34, 197, 94, 0.25);
  letter-spacing: -0.5px;
`;

const InfosTexte = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;

  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #ffffff;
    margin: 0;
    text-transform: capitalize;
    letter-spacing: -0.3px;
  }

  p {
    font-size: 0.9rem;
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

const SectionFormulaire = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2.2rem;
`;

const BlocBlocSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  background: rgba(255, 255, 255, 0.015);
  border: 1px solid rgba(255, 255, 255, 0.04);
  padding: 1.5rem;
  border-radius: 14px;
`;

const LigneThemeContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`;

const InfoTheme = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  span.titre {
    font-size: 0.95rem;
    font-weight: 600;
    color: #ffffff;
  }

  span.description {
    font-size: 0.8rem;
    color: #94a3b8;
  }
`;

const BoutonBasculeTheme = styled.button`
  background: rgba(15, 15, 18, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 30px;
  padding: 0.4rem 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  cursor: pointer;
  transition: all 0.25s ease;

  span.icone-rond {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: ${props => props.$estSombre ? '#22c55e' : '#eab308'};
    color: #000000;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    transition: all 0.3s ease;
  }

  span.texte-etat {
    font-size: 0.85rem;
    font-weight: 600;
    color: #e2e8f0;
    padding-right: 0.4rem;
  }

  &:hover {
    border-color: #22c55e;
    background: rgba(15, 15, 18, 1);
  }
`;

const TitreSection = styled.h3`
  font-size: 1.05rem;
  font-weight: 600;
  color: #ffffff;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin: 0;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
`;

const LigneChampsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const GroupeChamp = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  label {
    font-size: 0.825rem;
    font-weight: 500;
    color: #94a3b8;
  }

  input {
    background: rgba(15, 15, 18, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    padding: 0.85rem 1rem;
    color: #ffffff;
    font-size: 0.95rem;
    transition: all 0.25s ease;

    &:focus {
      outline: none;
      border-color: #22c55e;
      background: rgba(15, 15, 18, 0.9);
      box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.15);
    }

    &::placeholder {
      color: #475569;
    }
  }
`;

const PiedFormulaire = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 0.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
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
  transition: all 0.2s ease;
  box-shadow: 0 4px 14px rgba(34, 197, 94, 0.3);

  &:hover {
    background: #16a34a;
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(34, 197, 94, 0.4);
  }

  &:active {
    transform: translateY(0);
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
  const prenom = user.prenom || '';
  const nom = user.nom || '';
  const postnom = user.postnom || '';
  const role = user.role || 'Étudiant MSI';
  const email = user.email || '';

  const initiales = `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase() || 'U';

  const [formData, setFormData] = useState({
    prenom,
    nom,
    postnom,
    email,
    ancienMotDePasse: '',
    nouveauMotDePasse: ''
  });

  const [estSombre, setEstSombre] = useState(themeActuel !== 'clair');
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleToggleTheme = () => {
    const nouvelEtat = !estSombre;
    setEstSombre(nouvelEtat);
    const themeStr = nouvelEtat ? 'sombre' : 'clair';
    if (surChangementTheme) surChangementTheme(themeStr);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (surModificationUtilisateur) surModificationUtilisateur(formData);
    setMessage("Modifications enregistrées avec succès !");
    setTimeout(() => setMessage(''), 4000);
  };

  return (
    <ConteneurPage>
      <CarteProfil>
        {/* En-tête identité */}
        <SectionEnTete>
          <BlocIdentite>
            <AvatarCercle>{initiales}</AvatarCercle>
            <InfosTexte>
              <h2>{`${formData.prenom} ${formData.nom} ${formData.postnom}`.trim() || 'Mon Profil'}</h2>
              <p>{formData.email || 'Aucune adresse e-mail'}</p>
            </InfosTexte>
          </BlocIdentite>
          <BadgeStatut>{role}</BadgeStatut>
        </SectionEnTete>

        <SectionFormulaire onSubmit={handleSubmit}>
          {/* Bloc 1 : Thème clair / sombre avec bouton icône bascule */}
          <BlocBlocSection>
            <TitreSection>🎨 Apparence</TitreSection>
            <LigneThemeContainer>
              <InfoTheme>
                <span className="titre">Mode d'affichage</span>
                <span className="description">Basculez entre le thème sombre et le thème clair</span>
              </InfoTheme>
              <BoutonBasculeTheme 
                type="button" 
                $estSombre={estSombre} 
                onClick={handleToggleTheme}
                title="Changer de thème"
              >
                <span className="icone-rond">
                  {estSombre ? '🌙' : '☀️'}
                </span>
                <span className="texte-etat">
                  {estSombre ? 'Sombre' : 'Clair'}
                </span>
              </BoutonBasculeTheme>
            </LigneThemeContainer>
          </BlocBlocSection>

          {/* Bloc 2 : Informations personnelles */}
          <BlocBlocSection>
            <TitreSection>👤 Informations personnelles</TitreSection>
            <LigneChampsGrid>
              <GroupeChamp>
                <label>Prénom</label>
                <input type="text" name="prenom" value={formData.prenom} onChange={handleChange} placeholder="Ton prénom" />
              </GroupeChamp>
              <GroupeChamp>
                <label>Nom</label>
                <input type="text" name="nom" value={formData.nom} onChange={handleChange} placeholder="Ton nom" />
              </GroupeChamp>
              <GroupeChamp>
                <label>Postnom</label>
                <input type="text" name="postnom" value={formData.postnom} onChange={handleChange} placeholder="Ton postnom" />
              </GroupeChamp>
              <GroupeChamp>
                <label>Adresse e-mail</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="nom@exemple.com" />
              </GroupeChamp>
            </LigneChampsGrid>
          </BlocBlocSection>

          {/* Bloc 3 : Sécurité du compte */}
          <BlocBlocSection>
            <TitreSection>🔒 Sécurité et Mot de passe</TitreSection>
            <LigneChampsGrid>
              <GroupeChamp>
                <label>Ancien mot de passe</label>
                <input type="password" name="ancienMotDePasse" value={formData.ancienMotDePasse} onChange={handleChange} placeholder="••••••••••••" />
              </GroupeChamp>
              <GroupeChamp>
                <label>Nouveau mot de passe</label>
                <input type="password" name="nouveauMotDePasse" value={formData.nouveauMotDePasse} onChange={handleChange} placeholder="••••••••••••" />
              </GroupeChamp>
            </LigneChampsGrid>
          </BlocBlocSection>

          {/* Bouton global de validation */}
          <PiedFormulaire>
            {message ? <NotificationMessage>{message}</NotificationMessage> : <div />}
            <BoutonAction type="submit">Enregistrer les modifications</BoutonAction>
          </PiedFormulaire>
        </SectionFormulaire>
      </CarteProfil>
    </ConteneurPage>
  );
}