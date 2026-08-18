import React, { useState, useMemo, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

import NouveauClient from './nouveauClient';
import TableauClients from './tableauClients';
import { 
  ajouterClientApi, 
  modifierClientApi 
} from '../../../../../backend/src/services/clientService';

const THEME = {
  fondCarte: '#1E1E1E',
  accentuation: '#AEEA00',
  textePrincipal: '#FFFFFF',
  texteSecondaire: '#888888',
  bordure: '#2A2A2A',
};

// --- FONCTION DE GÉNÉRATION DE MATRICULE À 10 CHIFFRES ---
const genererMatricule = (typeClient, devise, compteur = 1) => {
  let prefixe = 'CLI-';

  switch (typeClient) {
    case 'locataire':
      prefixe = (devise === 'CDF') ? 'LY-' : 'LOY-';
      break;
    case 'electricite':
      prefixe = 'ELE-';
      break;
    case 'eau':
      prefixe = 'EAU-';
      break;
    case 'divers':
      prefixe = 'DIV-';
      break;
    default:
      prefixe = 'CLI-';
  }

  const numeroA10Chiffres = String(compteur).padStart(10, '0');
  return `${prefixe}${numeroA10Chiffres}`;
};

const ConteneurActifs = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const BarreSuperieure = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const BoutonAction = styled.button`
  background-color: ${THEME.accentuation};
  color: #000000;
  border: none;
  padding: 0.65rem 1.2rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
`;

const PanneauFiltres = styled(motion.div)`
  background-color: ${THEME.fondCarte};
  border: 1px solid ${THEME.bordure};
  border-radius: 12px;
  padding: 1.2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: flex-end;
`;

const GroupeFiltre = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  flex: 1;
  min-width: 130px;
`;

const Etiquette = styled.label`
  color: ${THEME.texteSecondaire};
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
`;

const ChampSaisie = styled.input`
  background-color: #121212;
  color: ${THEME.textePrincipal};
  border: 1px solid ${THEME.bordure};
  border-radius: 8px;
  padding: 0.65rem 0.8rem;
  font-size: 0.85rem;
  outline: none;

  &:focus {
    border-color: ${THEME.accentuation};
  }
`;

const SelecteurFiltre = styled.select`
  background-color: #121212;
  color: ${THEME.textePrincipal};
  border: 1px solid ${THEME.bordure};
  border-radius: 8px;
  padding: 0.6rem 0.8rem;
  font-size: 0.85rem;
  outline: none;

  &:focus {
    border-color: ${THEME.accentuation};
  }
`;

const BoutonReinitialiser = styled.button`
  background-color: transparent;
  color: ${THEME.accentuation};
  border: 1px solid ${THEME.accentuation};
  padding: 0.6rem 1rem;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  height: 38px;

  &:hover {
    background-color: ${THEME.accentuation};
    color: #000000;
  }
`;

const variantesAnimationScroll = {
  cache: { opacity: 0, y: 25 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } }
};

export default function ClientsActifs({
  listeClients = [],
  setListeClients,
  supprimerClient,
  formaterDateFr,
  afficherNotificationProvisoire,
  allerAFacturation
}) {
  const [afficherFormulaire, setAfficherFormulaire] = useState(false);
  const [clientEnEdition, setClientEnEdition] = useState(null);

  const [formulaire, setFormulaire] = useState({ 
    nom: '', 
    postNom: '', 
    prenom: '',
    typeClient: 'locataire',
    devise: 'USD',
    heure: '' 
  });

  const [rechercheTexte, setRechercheTexte] = useState('');
  const [filtreJour, setFiltreJour] = useState('');
  const [filtreMois, setFiltreMois] = useState('');
  const [filtreAnnee, setFiltreAnnee] = useState('');
  const [filtreDateExacte, setFiltreDateExacte] = useState('');

  const formulaireRef = useRef(null);
  const champFocusRef = useRef(null);

  const changerChamp = (e) => {
    setFormulaire({ ...formulaire, [e.target.name]: e.target.value });
  };

  const reinitialiserFormulaire = () => {
    setFormulaire({ 
      nom: '', 
      postNom: '', 
      prenom: '', 
      typeClient: 'locataire',
      devise: 'USD',
      heure: '' 
    });
    setClientEnEdition(null);
    setAfficherFormulaire(false);
  };

  const ouvrirNouveauFormulaire = () => {
    const heureExacte = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    setClientEnEdition(null);
    setFormulaire({ 
      nom: '', 
      postNom: '', 
      prenom: '', 
      typeClient: 'locataire',
      devise: 'USD',
      heure: heureExacte 
    });
    setAfficherFormulaire(true);

    setTimeout(() => {
      if (formulaireRef.current) formulaireRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (champFocusRef.current) champFocusRef.current.focus();
    }, 120);
  };

  const editerClient = (client) => {
    const heureParDefaut = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    setClientEnEdition(client);
    setFormulaire({
      nom: client.nom || '',
      postNom: client.postNom || '',
      prenom: client.prenom || '',
      typeClient: client.typeClient || 'locataire',
      devise: client.devise || 'USD',
      heure: client.heure || heureParDefaut
    });
    setAfficherFormulaire(true);

    if (afficherNotificationProvisoire) {
      afficherNotificationProvisoire(
        `Mode Édition : Modification de ${client.nom} ${client.prenom}.`,
        'info'
      );
    }

    setTimeout(() => {
      if (formulaireRef.current) formulaireRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (champFocusRef.current) champFocusRef.current.focus();
    }, 120);
  };

  const soumettreFormulaire = async (e) => {
    e.preventDefault();
    if (!formulaire.nom.trim() || !formulaire.prenom.trim()) return;

    const maintenant = new Date();
    const dateAujourdhui = maintenant.toISOString().split('T')[0];
    const heureCourante = maintenant.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    const heureFinale = formulaire.heure || heureCourante;

    if (clientEnEdition) {
      const donnesFormulaireModifie = {
        ...formulaire,
        heure: heureFinale
      };

      setListeClients(prev => prev.map(cli => 
        String(cli.id) === String(clientEnEdition.id) 
          ? { ...cli, ...donnesFormulaireModifie }
          : cli
      ));

      if (afficherNotificationProvisoire) {
        afficherNotificationProvisoire(
          `Modification effectuée ! Le client ${formulaire.nom} ${formulaire.prenom} a été mis à jour.`,
          'succes'
        );
      }

      reinitialiserFormulaire();

      try {
        if (modifierClientApi) {
          const reponseApi = await modifierClientApi(clientEnEdition.id, donnesFormulaireModifie);
          if (reponseApi) {
            setListeClients(prev => prev.map(cli => 
              String(cli.id) === String(clientEnEdition.id) 
                ? { ...cli, ...reponseApi, heure: reponseApi.heure || heureFinale }
                : cli
            ));
          }
        }
      } catch (erreur) {
        // Silencieux pour garder l'UI fluide
      }

    } else {
      const idTemporaire = Date.now();
      const compteurClient = listeClients.length + 1;
      
      const matriculeGenere = genererMatricule(
        formulaire.typeClient || 'locataire', 
        formulaire.devise || 'USD',
        compteurClient
      );

      const nouveauClientObjet = {
        id: idTemporaire,
        matricule: matriculeGenere,
        ...formulaire,
        dateEnregistrement: dateAujourdhui,
        heure: heureFinale,
        estSupprime: false,
        statut: 'actif'
      };

      setListeClients(prev => [nouveauClientObjet, ...prev]);

      if (afficherNotificationProvisoire) {
        afficherNotificationProvisoire(
          `Nouveau client enregistré avec le matricule ${matriculeGenere}.`,
          'succes'
        );
      }

      reinitialiserFormulaire();

      try {
        if (ajouterClientApi) {
          const reponseBdd = await ajouterClientApi(nouveauClientObjet);
          
          if (reponseBdd && reponseBdd.id) {
            setListeClients(prev => prev.map(cli => 
              cli.id === idTemporaire 
                ? { ...nouveauClientObjet, ...reponseBdd, heure: reponseBdd.heure || heureFinale }
                : cli
            ));
          }
        }
      } catch (erreur) {
        // Silencieux pour garder l'UI fluide
      }
    }
  };

  const reinitialiserFiltres = () => {
    setRechercheTexte('');
    setFiltreJour('');
    setFiltreMois('');
    setFiltreAnnee('');
    setFiltreDateExacte('');
  };

  const clientsFiltres = useMemo(() => {
    return listeClients.filter(client => {
      if (rechercheTexte) {
        const terme = rechercheTexte.toLowerCase();
        const nomComplet = `${client.nom || ''} ${client.postNom || ''} ${client.prenom || ''} ${client.matricule || ''}`.toLowerCase();
        if (!nomComplet.includes(terme)) return false;
      }

      const rawDate = client.dateEnregistrement || client.created_at || client.createdAt;
      if (rawDate) {
        const dateSeule = String(rawDate).includes('T') 
          ? String(rawDate).split('T')[0] 
          : String(rawDate);

        const parts = dateSeule.split('-');
        if (parts.length === 3) {
          const [annee, mois, jour] = parts;
          if (filtreDateExacte && dateSeule !== filtreDateExacte) return false;
          if (filtreJour && jour !== filtreJour) return false;
          if (filtreMois && mois !== filtreMois) return false;
          if (filtreAnnee && annee !== filtreAnnee) return false;
        }
      }

      return true;
    });
  }, [listeClients, rechercheTexte, filtreJour, filtreMois, filtreAnnee, filtreDateExacte]);

  return (
    <ConteneurActifs>
      {!afficherFormulaire && (
        <BarreSuperieure>
          <BoutonAction onClick={ouvrirNouveauFormulaire}>
            + Nouveau Client
          </BoutonAction>
        </BarreSuperieure>
      )}

      {afficherFormulaire && (
        <div ref={formulaireRef}>
          <NouveauClient 
            formulaire={formulaire}
            changerChamp={changerChamp}
            soumettreFormulaire={soumettreFormulaire}
            reinitialiserFormulaire={reinitialiserFormulaire}
            clientEnEdition={clientEnEdition}
            champFocusRef={champFocusRef}
          />
        </div>
      )}

      <PanneauFiltres
        initial="cache"
        whileInView="visible"
        viewport={{ once: false, amount: 0.15 }}
        variants={variantesAnimationScroll}
      >
        <GroupeFiltre style={{ flex: 2, minWidth: '200px' }}>
          <Etiquette>Recherche</Etiquette>
          <ChampSaisie 
            type="text" 
            placeholder="Nom, prénom ou matricule..." 
            value={rechercheTexte} 
            onChange={(e) => setRechercheTexte(e.target.value)} 
          />
        </GroupeFiltre>

        <GroupeFiltre>
          <Etiquette>Date Exacte</Etiquette>
          <ChampSaisie 
            type="date" 
            value={filtreDateExacte} 
            onChange={(e) => {
              setFiltreDateExacte(e.target.value);
              setFiltreJour('');
              setFiltreMois('');
              setFiltreAnnee('');
            }} 
          />
        </GroupeFiltre>

        <GroupeFiltre>
          <Etiquette>Jour</Etiquette>
          <SelecteurFiltre 
            value={filtreJour} 
            onChange={(e) => setFiltreJour(e.target.value)}
            disabled={Boolean(filtreDateExacte)}
          >
            <option value="">Tous</option>
            {Array.from({ length: 31 }, (_, i) => {
              const d = String(i + 1).padStart(2, '0');
              return <option key={d} value={d}>{d}</option>;
            })}
          </SelecteurFiltre>
        </GroupeFiltre>

        <GroupeFiltre>
          <Etiquette>Mois</Etiquette>
          <SelecteurFiltre 
            value={filtreMois} 
            onChange={(e) => setFiltreMois(e.target.value)}
            disabled={Boolean(filtreDateExacte)}
          >
            <option value="">Tous</option>
            <option value="01">Janvier</option>
            <option value="02">Février</option>
            <option value="03">Mars</option>
            <option value="04">Avril</option>
            <option value="05">Mai</option>
            <option value="06">Juin</option>
            <option value="07">Juillet</option>
            <option value="08">Août</option>
            <option value="09">Septembre</option>
            <option value="10">Octobre</option>
            <option value="11">Novembre</option>
            <option value="12">Décembre</option>
          </SelecteurFiltre>
        </GroupeFiltre>

        <GroupeFiltre>
          <Etiquette>Année</Etiquette>
          <SelecteurFiltre 
            value={filtreAnnee} 
            onChange={(e) => setFiltreAnnee(e.target.value)}
            disabled={Boolean(filtreDateExacte)}
          >
            <option value="">Toutes</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
            <option value="2026">2026</option>
          </SelecteurFiltre>
        </GroupeFiltre>

        <BoutonReinitialiser onClick={reinitialiserFiltres}>
          Réinitialiser
        </BoutonReinitialiser>
      </PanneauFiltres>

      <TableauClients 
        clients={clientsFiltres}
        editerClient={editerClient}
        supprimerClient={supprimerClient}
        formaterDateFr={formaterDateFr}
        estCorbeille={false}
        allerAFacturation={allerAFacturation}
      />
    </ConteneurActifs>
  );
}