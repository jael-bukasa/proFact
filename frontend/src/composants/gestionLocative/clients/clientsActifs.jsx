import React, { useState, useMemo, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

import TableauClients from './tableauClients';
import FiltreClients from './filtreClients';
import { ajouterClientApi, modifierClientApi } from '../../../../../backend/src/services/clientService';

const THEME = {
  fondCarte: '#1E1E1E',
  accentuation: '#AEEA00',
  textePrincipal: '#FFFFFF',
  texteSecondaire: '#888888',
  bordure: '#2A2A2A',
  erreur: '#FF5252',
};

const genererMatricule = (typeClient, devise, compteur = 1) => {
  const typeNormalise = (typeClient || '').toLowerCase().trim();
  let prefixe = 'CLI-';

  if (typeNormalise.includes('locataire') || typeNormalise.includes('loyer')) {
    prefixe = (devise === 'CDF') ? 'LY-' : 'LOY-';
  } else if (typeNormalise.includes('electricite') || typeNormalise.includes('elec')) {
    prefixe = 'ELE-';
  } else if (typeNormalise.includes('eau')) {
    prefixe = 'EAU-';
  } else if (typeNormalise.includes('divers')) {
    prefixe = 'DIV-';
  }

  const numero = String(compteur).padStart(10, '0');
  return `${prefixe}${numero}`;
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
  cursor: pointer;
  &:hover { opacity: 0.9; }
`;

const CardFormulaire = styled(motion.div)`
  background-color: ${THEME.fondCarte};
  border: 1px solid ${THEME.bordure};
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const GrilleChamps = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.2rem;
`;

const GroupeChamp = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  position: relative;
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
  border: 1px solid ${props => props.$enErreur ? THEME.erreur : THEME.bordure};
  border-radius: 8px;
  padding: 0.65rem 0.8rem;
  font-size: 0.85rem;
  outline: none;
  transition: border-color 0.2s;
  &:focus { border-color: ${props => props.$enErreur ? THEME.erreur : THEME.accentuation}; }
`;

const SelecteurSaisie = styled.select`
  background-color: #121212;
  color: ${THEME.textePrincipal};
  border: 1px solid ${THEME.bordure};
  border-radius: 8px;
  padding: 0.65rem 0.8rem;
  font-size: 0.85rem;
  outline: none;
  &:focus { border-color: ${THEME.accentuation}; }
`;

const MessageErreur = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  color: ${THEME.erreur};
  font-size: 0.75rem;
  font-weight: 500;
  margin-top: 0.1rem;

  svg {
    width: 12px;
    height: 12px;
    fill: ${THEME.erreur};
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
    matricule: '',
    nom: '', 
    postNom: '', 
    prenom: '',
    typeClient: 'locataire',
    devise: 'USD',
    typeFacture: 'Loyers',
    heure: '' 
  });

  const [erreurs, setErreurs] = useState({});
  const [rechercheTexte, setRechercheTexte] = useState('');
  
  const formulaireRef = useRef(null);
  
  // Références pour parcourir TOUS les champs du formulaire
  const inputNomRef = useRef(null);
  const inputPostNomRef = useRef(null);
  const inputPrenomRef = useRef(null);
  const selectTypeClientRef = useRef(null);
  const selectDeviseRef = useRef(null);
  const boutonSoumettreRef = useRef(null);

  const gererToucheEntree = (e, champSuivantRef) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (champSuivantRef && champSuivantRef.current) {
        champSuivantRef.current.focus();
      }
    }
  };

  const changerChamp = (e) => {
    const { name, value } = e.target;

    if (erreurs[name]) {
      setErreurs(prev => ({ ...prev, [name]: null }));
    }

    setFormulaire(prev => {
      let nouveauTypeClient = prev.typeClient;
      let nouvelleDevise = prev.devise;
      let nouveauTypeFacture = prev.typeFacture;

      if (name === 'typeClient') {
        nouveauTypeClient = value;
        if (value === 'electricite') nouveauTypeFacture = 'Électricité';
        else if (value === 'eau') nouveauTypeFacture = 'Eau';
        else if (value === 'divers') nouveauTypeFacture = 'Divers';
        else nouveauTypeFacture = 'Loyers';
      }

      if (name === 'devise') {
        nouvelleDevise = value;
      }

      const compteurActuel = listeClients.length + 1;
      const nouveauMatricule = genererMatricule(nouveauTypeClient, nouvelleDevise, compteurActuel);

      return {
        ...prev,
        [name]: value,
        typeClient: nouveauTypeClient,
        typeFacture: nouveauTypeFacture,
        matricule: nouveauMatricule
      };
    });
  };

  const ouvrirNouveauFormulaire = () => {
    const compteurActuel = listeClients.length + 1;
    const matriculeInitial = genererMatricule('locataire', 'USD', compteurActuel);

    setClientEnEdition(null);
    setErreurs({});
    setFormulaire({ 
      matricule: matriculeInitial,
      nom: '', 
      postNom: '', 
      prenom: '', 
      typeClient: 'locataire',
      devise: 'USD',
      typeFacture: 'Loyers',
      heure: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    });
    setAfficherFormulaire(true);

    setTimeout(() => {
      if (inputNomRef.current) inputNomRef.current.focus();
    }, 100);
  };

  const editerClient = (client) => {
    setClientEnEdition(client);
    setErreurs({});
    setFormulaire({
      matricule: client.matricule || '',
      nom: client.nom || '',
      postNom: client.postNom || '',
      prenom: client.prenom || '',
      typeClient: client.typeClient || 'locataire',
      devise: client.devise || 'USD',
      typeFacture: client.typeFacture || 'Loyers',
      heure: client.heure || ''
    });
    setAfficherFormulaire(true);

    setTimeout(() => {
      if (inputNomRef.current) inputNomRef.current.focus();
    }, 100);
  };

  const soumettreFormulaire = async (e) => {
    e.preventDefault();
    
    let nouvellesErreurs = {};
    if (!formulaire.nom.trim()) nouvellesErreurs.nom = "Veuillez renseigner le nom.";
    if (!formulaire.prenom.trim()) nouvellesErreurs.prenom = "Veuillez renseigner le prénom.";

    if (Object.keys(nouvellesErreurs).length > 0) {
      setErreurs(nouvellesErreurs);
      return;
    }

    const dateAujourdhui = new Date().toISOString().split('T')[0];
    const compteurActuel = listeClients.length + 1;
    const matriculeFinal = genererMatricule(formulaire.typeClient, formulaire.devise, compteurActuel);

    if (clientEnEdition) {
      const donnesFormulaireModifie = { ...formulaire, matricule: clientEnEdition.matricule };

      setListeClients(prev => prev.map(cli => 
        String(cli.id) === String(clientEnEdition.id) ? { ...cli, ...donnesFormulaireModifie } : cli
      ));

      if (afficherNotificationProvisoire) afficherNotificationProvisoire("Client modifié avec succès.", "succes");
      setAfficherFormulaire(false);

      try {
        if (modifierClientApi) await modifierClientApi(clientEnEdition.id, donnesFormulaireModifie);
      } catch (err) { console.error(err); }

    } else {
      const nouveauClientObjet = {
        ...formulaire,
        id: Date.now(),
        matricule: matriculeFinal,
        dateEnregistrement: dateAujourdhui,
        estSupprime: false,
        statut: 'actif'
      };

      setListeClients(prev => [nouveauClientObjet, ...prev]);
      if (afficherNotificationProvisoire) afficherNotificationProvisoire(`Client enregistré : ${matriculeFinal}`, "succes");
      setAfficherFormulaire(false);

      try {
        if (ajouterClientApi) await ajouterClientApi(nouveauClientObjet);
      } catch (err) { console.error(err); }
    }
  };

  const clientsFiltres = useMemo(() => {
    return listeClients.filter(client => {
      if (!rechercheTexte) return true;
      const terme = rechercheTexte.toLowerCase();
      const texteComplet = `${client.nom || ''} ${client.prenom || ''} ${client.matricule || ''}`.toLowerCase();
      return texteComplet.includes(terme);
    });
  }, [listeClients, rechercheTexte]);

  return (
    <ConteneurActifs>
      {!afficherFormulaire && (
        <BarreSuperieure>
          <BoutonAction onClick={ouvrirNouveauFormulaire}>+ Nouveau Client</BoutonAction>
        </BarreSuperieure>
      )}

      {afficherFormulaire && (
        <CardFormulaire ref={formulaireRef} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h3 style={{ color: THEME.accentuation }}>
            {clientEnEdition ? `Modifier (${formulaire.matricule})` : `Nouveau Client (${formulaire.matricule})`}
          </h3>
          <form onSubmit={soumettreFormulaire} noValidate>
            <GrilleChamps>
              {/* Champ Nom */}
              <GroupeChamp>
                <Etiquette>Nom</Etiquette>
                <ChampSaisie 
                  ref={inputNomRef}
                  type="text" 
                  name="nom" 
                  value={formulaire.nom} 
                  onChange={changerChamp} 
                  onKeyDown={(e) => gererToucheEntree(e, inputPostNomRef)}
                  $enErreur={!!erreurs.nom}
                />
                <AnimatePresence>
                  {erreurs.nom && (
                    <MessageErreur initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                      <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                      {erreurs.nom}
                    </MessageErreur>
                  )}
                </AnimatePresence>
              </GroupeChamp>

              {/* Champ Post-nom */}
              <GroupeChamp>
                <Etiquette>Post-nom</Etiquette>
                <ChampSaisie 
                  ref={inputPostNomRef}
                  type="text" 
                  name="postNom" 
                  value={formulaire.postNom} 
                  onChange={changerChamp} 
                  onKeyDown={(e) => gererToucheEntree(e, inputPrenomRef)}
                />
              </GroupeChamp>

              {/* Champ Prénom */}
              <GroupeChamp>
                <Etiquette>Prénom</Etiquette>
                <ChampSaisie 
                  ref={inputPrenomRef}
                  type="text" 
                  name="prenom" 
                  value={formulaire.prenom} 
                  onChange={changerChamp} 
                  onKeyDown={(e) => gererToucheEntree(e, selectTypeClientRef)}
                  $enErreur={!!erreurs.prenom}
                />
                <AnimatePresence>
                  {erreurs.prenom && (
                    <MessageErreur initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                      <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                      {erreurs.prenom}
                    </MessageErreur>
                  )}
                </AnimatePresence>
              </GroupeChamp>

              {/* Sélecteur Type de Client */}
              <GroupeChamp>
                <Etiquette>Type de Client</Etiquette>
                <SelecteurSaisie 
                  ref={selectTypeClientRef}
                  name="typeClient" 
                  value={formulaire.typeClient} 
                  onChange={changerChamp}
                  onKeyDown={(e) => gererToucheEntree(e, selectDeviseRef)}
                >
                  <option value="locataire">Locataire</option>
                  <option value="electricite">Électricité</option>
                  <option value="eau">Eau</option>
                  <option value="divers">Divers</option>
                </SelecteurSaisie>
              </GroupeChamp>

              {/* Sélecteur Devise */}
              <GroupeChamp>
                <Etiquette>Devise</Etiquette>
                <SelecteurSaisie 
                  ref={selectDeviseRef}
                  name="devise" 
                  value={formulaire.devise} 
                  onChange={changerChamp}
                  onKeyDown={(e) => gererToucheEntree(e, boutonSoumettreRef)}
                >
                  <option value="USD">USD ($)</option>
                  <option value="CDF">CDF (FC)</option>
                </SelecteurSaisie>
              </GroupeChamp>
            </GrilleChamps>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', marginTop: '1.5rem' }}>
              <BoutonAction type="button" onClick={() => setAfficherFormulaire(false)} style={{ background: 'transparent', color: '#fff', border: `1px solid ${THEME.bordure}` }}>Annuler</BoutonAction>
              <BoutonAction ref={boutonSoumettreRef} type="submit">Enregistrer</BoutonAction>
            </div>
          </form>
        </CardFormulaire>
      )}

      <FiltreClients rechercheTexte={rechercheTexte} setRechercheTexte={setRechercheTexte} />

      <TableauClients 
        clients={clientsFiltres}
        editerClient={editerClient}
        supprimerClient={supprimerClient}
        formaterDateFr={formaterDateFr}
        allerAFacturation={allerAFacturation}
      />
    </ConteneurActifs>
  );
}