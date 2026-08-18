import React, { useState, useMemo, useRef } from 'react';
import styled from 'styled-components';

import NouveauClient from './nouveauClient';
import TableauClients from './tableauClients';
import FiltreClients from './filtreClients'; // <-- Importation du composant de filtre unifié
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
        console.error("Erreur lors de la modification en BDD :", erreur);
        if (afficherNotificationProvisoire) {
          afficherNotificationProvisoire("Erreur de mise à jour dans la base de données.", "erreur");
        }
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
        console.error("Erreur critique lors de l'enregistrement en BDD :", erreur);
        if (afficherNotificationProvisoire) {
          afficherNotificationProvisoire("Erreur d'enregistrement dans la base de données.", "erreur");
        }
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

      {/* Remplacement du PanneauFiltres par le composant externe FiltreClients */}
      <FiltreClients 
        rechercheTexte={rechercheTexte}
        setRechercheTexte={setRechercheTexte}
        filtreDateExacte={filtreDateExacte}
        setFiltreDateExacte={setFiltreDateExacte}
        filtreJour={filtreJour}
        setFiltreJour={setFiltreJour}
        filtreMois={filtreMois}
        setFiltreMois={setFiltreMois}
        filtreAnnee={filtreAnnee}
        setFiltreAnnee={setFiltreAnnee}
        reinitialiserFiltres={reinitialiserFiltres}
      />

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