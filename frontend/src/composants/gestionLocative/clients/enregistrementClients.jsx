import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle } from 'react-icons/fi';
import BailETidentification from './enregistrementClients/bailETidentification';
import DelaisFactureEtPeriode from './enregistrementClients/delaisFactureEtPeriode';
import CompteursETsuivis from './enregistrementClients/compteursETsuivis';
import { genererMatricule10Chiffres } from '../../../../../backend/src/services/clientService';

export default function EnregistrementClients({ onClientAjoute }) {
  const [formulaire, setFormulaire] = useState({
    nom: '',
    postNom: '',
    prenom: '',
    telephone: '',
    typeClient: 'locataire',
    matricule: 'LOY-0000000001',
    bail: '',
    dateBail: '',
    logement: '',
    adresse: '',
    pays: 'RDC',
    designation: '',
    typeFacture: 'locataire',
    devise: 'USD',
    montant: '',
    modePaiement: 'Virement',
    typePeriode: 'mois',
    moisFacture: '',
    debutContrat: '',
    finContrat: '',
    dateComptable: '',
    compteur: '',
    imputation: '',
    dernierNumero: '',
    dernierMontant: '',
    derniereDate: '',
    id: 1
  });

  const [erreurs, setErreurs] = useState({});
  const [loading, setLoading] = useState(false);
  const [messageSucces, setMessageSucces] = useState(false);
  
  const refs = useRef({});
  const MAX_CARACTERES_DESIGNATION = 500;
  const longueurDesignation = (formulaire.designation ?? '').length;
  const limiteAtteinte = longueurDesignation >= MAX_CARACTERES_DESIGNATION;

  // 🌟 Fonction pour récupérer dynamiquement le prochain ID/Matricule selon le type et la devise
  const fetchProchainMatricule = async (typeClient, typeFacture, devise) => {
    try {
      const queryParams = new URLSearchParams({
        type: typeClient || 'locataire',
        typeFacture: typeFacture || 'locataire',
        devise: devise || 'USD'
      });

      const response = await fetch(`http://localhost:5000/api/clients/prochain-id?${queryParams.toString()}`);
      if (response.ok) {
        const data = await response.json();
        const prochainId = data.id || 1;
        const matriculeGenere = genererMatricule10Chiffres(prochainId, typeClient, typeFacture, devise);
        
        setFormulaire(prev => ({
          ...prev,
          id: prochainId,
          matricule: matriculeGenere
        }));
      }
    } catch (error) {
      console.error("Impossible de récupérer le prochain ID:", error);
    }
  };

  // 🌟 Récupération automatique au chargement initial du composant
  useEffect(() => {
    fetchProchainMatricule(formulaire.typeClient, formulaire.typeFacture, formulaire.devise);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let nouveauFormulaire = { ...formulaire, [name]: value };

    // Si on change le type de client, on met automatiquement à jour le type de facture pour qu'ils soient identiques partout
    if (name === 'typeClient') {
      nouveauFormulaire.typeFacture = value;
    }

    if (name === 'typePeriode') {
      nouveauFormulaire.moisFacture = '';
    }

    setFormulaire(nouveauFormulaire);

    const clientActuel = name === 'typeClient' ? value : formulaire.typeClient;
    const factureActuelle = name === 'typeClient' ? value : (name === 'typeFacture' ? value : formulaire.typeFacture);
    const deviseActuelle = name === 'devise' ? value : formulaire.devise;

    // 🌟 Dès que le type de client, le type de facture ou la devise change, on interroge le backend
    if (name === 'typeClient' || name === 'typeFacture' || name === 'devise') {
      fetchProchainMatricule(clientActuel, factureActuelle, deviseActuelle);
    }

    if (erreurs[name] && value.trim() !== '') {
      setErreurs({ ...erreurs, [name]: null });
    }
  };

  const gererChangementDate = (e) => {
    const { name, value } = e.target;
    if (value) {
      const parties = value.split('-');
      const annee = parties[0];
      if (annee && annee.length > 4) {
        parties[0] = annee.slice(0, 4);
        e.target.value = parties.join('-');
      }
    }
    handleChange(e);

    if (erreurs[name] && value.trim() !== '') {
      setErreurs({ ...erreurs, [name]: null });
    }
  };

  const gererToucheEntree = (e) => {
    if (e.target.tagName === 'TEXTAREA') return;

    if (e.key === 'Enter') {
      const listeChamps = Object.keys(refs.current).filter(k => k !== 'submitButton');
      const nomChampActuel = e.target.name;
      const indexActuel = listeChamps.indexOf(nomChampActuel);
      
      if (indexActuel > -1 && indexActuel < listeChamps.length - 1) {
        e.preventDefault();
        refs.current[listeChamps[indexActuel + 1]]?.focus();
      } else if (indexActuel === listeChamps.length - 1) {
        e.preventDefault();
        refs.current['submitButton']?.focus();
      }
    }
  };

  const handleReset = () => {
    fetchProchainMatricule('locataire', 'locataire', 'USD');
    setFormulaire({
      nom: '',
      postNom: '',
      prenom: '',
      telephone: '',
      typeClient: 'locataire',
      matricule: 'LOY-0000000001',
      bail: '',
      dateBail: '',
      logement: '',
      adresse: '',
      pays: 'RDC',
      designation: '',
      typeFacture: 'locataire',
      devise: 'USD',
      montant: '',
      modePaiement: 'Virement',
      typePeriode: 'mois',
      moisFacture: '',
      debutContrat: '',
      finContrat: '',
      dateComptable: '',
      compteur: '',
      imputation: '',
      dernierNumero: '',
      dernierMontant: '',
      derniereDate: '',
      id: 1
    });
    setErreurs({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nouvellesErreurs = {};

    if (!formulaire.nom || formulaire.nom.trim() === '') nouvellesErreurs.nom = 'Requis';
    if (!formulaire.postNom || formulaire.postNom.trim() === '') nouvellesErreurs.postNom = 'Requis';
    if (!formulaire.prenom || formulaire.prenom.trim() === '') nouvellesErreurs.prenom = 'Requis';
    if (!formulaire.telephone || formulaire.telephone.trim() === '') nouvellesErreurs.telephone = 'Requis';
    if (!formulaire.logement || formulaire.logement.trim() === '') nouvellesErreurs.logement = 'Requis';
    if (!formulaire.dateBail || formulaire.dateBail.trim() === '') nouvellesErreurs.dateBail = 'Requis';
    if (!formulaire.debutContrat || formulaire.debutContrat.trim() === '') nouvellesErreurs.debutContrat = 'Requis';
    if (!formulaire.finContrat || formulaire.finContrat.trim() === '') nouvellesErreurs.finContrat = 'Requis';
    if (!formulaire.moisFacture || formulaire.moisFacture.trim() === '') nouvellesErreurs.moisFacture = 'Requis';
    if (!formulaire.montant || String(formulaire.montant).trim() === '' || Number(formulaire.montant) <= 0) {
      nouvellesErreurs.montant = 'Requis';
    }

    if (Object.keys(nouvellesErreurs).length > 0) {
      setErreurs(nouvellesErreurs);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formulaire),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.erreur || "Erreur lors de l'enregistrement dans la base de données.");
      }

      setMessageSucces(true);
      setTimeout(() => {
        setMessageSucces(false);
      }, 4000);

      if (onClientAjoute) {
        onClientAjoute();
      }

      handleReset();

    } catch (error) {
      console.error("Erreur réseau ou serveur :", error);
      alert("Erreur : " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const clesErreurs = Object.keys(erreurs || {}).filter(k => erreurs[k]);
    if (clesErreurs.length > 0) {
      const premierChamp = clesErreurs[0];
      if (refs.current[premierChamp]) {
        refs.current[premierChamp].scrollIntoView({ behavior: 'smooth', block: 'center' });
        refs.current[premierChamp].focus();
      }
    }
  }, [erreurs]);

  return (
    <div style={{ position: 'relative' }}>
      <motion.form 
        onSubmit={handleSubmit} 
        noValidate 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        style={{ backgroundColor: '#1E1E1E', padding: '1.2rem', borderRadius: '12px', border: '1px solid #2A2A2A', display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '950px', margin: '0 auto' }}
      >
        
        {/* 1. Bloc Bail & Identification */}
        <BailETidentification 
          formulaire={formulaire} 
          erreurs={erreurs} 
          handleChange={handleChange} 
          gererChangementDate={gererChangementDate} 
          gererToucheEntree={gererToucheEntree} 
          refs={refs} 
        />

        {/* 2. Bloc Détails Facture & Période */}
        <DelaisFactureEtPeriode 
          formulaire={formulaire} 
          erreurs={erreurs} 
          handleChange={handleChange} 
          gererChangementDate={gererChangementDate} 
          gererToucheEntree={gererToucheEntree} 
          refs={refs} 
          longueurDesignation={longueurDesignation} 
          limiteAtteinte={limiteAtteinte} 
          MAX_CARACTERES_DESIGNATION={MAX_CARACTERES_DESIGNATION} 
        />

        {/* 3. Bloc Compteurs & Suivi Index */}
        <CompteursETsuivis 
          formulaire={formulaire} 
          handleChange={handleChange} 
          gererChangementDate={gererChangementDate} 
          gererToucheEntree={gererToucheEntree} 
          refs={refs} 
        />

        {/* Barre de boutons finale */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
          <button type="button" onClick={handleReset} style={{ backgroundColor: 'transparent', color: '#888888', border: '1px solid #2A2A2A', padding: '0.55rem 1.4rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.82rem' }}>
            Réinitialiser
          </button>
          <button 
            type="submit" 
            name="submitButton" 
            disabled={loading}
            ref={el => refs.current.submitButton = el} 
            style={{ backgroundColor: '#AEEA00', color: '#000000', border: 'none', padding: '0.55rem 1.4rem', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '0.82rem', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>

      </motion.form>

      {/* 🌟 Toast de succès élégant */}
      <AnimatePresence>
        {messageSucces && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            style={{
              position: 'fixed',
              bottom: '30px',
              right: '30px',
              backgroundColor: '#1E1E1E',
              color: '#FFFFFF',
              border: '1px solid #AEEA00',
              padding: '0.9rem 1.4rem',
              borderRadius: '10px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              zIndex: 9999,
              fontWeight: 600,
              fontSize: '0.9rem'
            }}
          >
            <FiCheckCircle style={{ color: '#AEEA00', fontSize: '1.3rem' }} />
            <span>Client enregistré</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}