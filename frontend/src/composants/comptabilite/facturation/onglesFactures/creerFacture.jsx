import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { FiSave, FiRotateCcw, FiCheckCircle } from 'react-icons/fi';

import ModeSelection from './creerFature/modeSelection';
import TypeClient from './creerFature/typeClient';
import RechercherClient from './creerFature/rechercherClient';
import PeriodeFacturation from './creerFature/periodeFacturation';

const THEME = {
  accentuation: '#AEEA00',
  textePrincipal: '#FFFFFF',
  bordure: '#2A2A2A',
  fondCarte: '#1E1E1E'
};

const rotationAnimation = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const spinResetAnimation = keyframes`
  0% { transform: rotate(0deg) scale(1); }
  50% { transform: rotate(-180deg) scale(0.9); }
  100% { transform: rotate(-360deg) scale(1); }
`;

const SpinnerChargement = styled.div`
  width: 18px;
  height: 18px;
  border: 3px solid rgba(0, 0, 0, 0.2);
  border-top: 3px solid #000000;
  border-radius: 50%;
  animation: ${rotationAnimation} 0.8s linear infinite;
`;

const IconeReinitialisationAnimee = styled(FiRotateCcw)`
  animation: ${spinResetAnimation} 0.5s ease-in-out infinite;
`;

const ConteneurFormulaire = styled.div`
  background-color: ${THEME.fondCarte};
  border: 1px solid ${THEME.bordure};
  border-radius: 12px;
  padding: 2rem;
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  color: ${THEME.textePrincipal};
  box-shadow: 0 10px 25px rgba(0,0,0,0.4);
`;

const TitreSection = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: ${THEME.textePrincipal};
  border-bottom: 1px solid ${THEME.bordure};
  padding-bottom: 0.8rem;
`;

const GrilleFormulaire = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.2rem;
  margin-bottom: 1.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  ${props => props.$reinitialisationEnCours && `
    opacity: 0.2;
    transform: translateY(-6px);
    filter: blur(1px);
  `}

  ${props => props.$chargementSoumission && `
    opacity: 0.5;
  `}
`;

const ConteneurActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const BoutonSoumettre = styled.button`
  background-color: ${THEME.accentuation};
  color: #000000;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  transition: all 0.2s ease;
  width: auto;
  min-width: 220px;

  &:hover { opacity: 0.9; transform: translateY(-1px); }
  &:disabled { opacity: 0.8; cursor: not-allowed; transform: none; }
`;

const BoutonReinitialiser = styled.button`
  background-color: transparent;
  color: ${THEME.textePrincipal};
  border: 1px solid ${THEME.bordure};
  padding: 0.8rem 1.2rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background-color: rgba(255, 255, 255, 0.05);
    border-color: ${THEME.textePrincipal};
  }
  &:disabled { opacity: 0.7; cursor: not-allowed; }
`;

export default function CreerFacture() {
  const [modeSelection, setModeSelection] = useState('un');
  const [clientsEnregistres, setClientsEnregistres] = useState([]);
  const [saisieRechercheClient, setSaisieRechercheClient] = useState('');
  const [afficherSuggestions, setAfficherSuggestions] = useState(false);
  const [enCoursDeRecherche, setEnCoursDeRecherche] = useState(false);
  
  const [erreurValidationClient, setErreurValidationClient] = useState(false);
  
  const wrapperRef = useRef(null);
  const timeoutRechercheRef = useRef(null);

  const dateActuelle = new Date();
  const moisCourantIndex = dateActuelle.getMonth();

  const listeMoisEnLettres = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];

  const [formData, setFormData] = useState({
    clientCode: '',
    nomLocataire: '',
    clientsCibles: [],
    typeFacture: 'locataire',
    typePeriode: 'mois',
    choixPeriodeSpecifique: listeMoisEnLettres[moisCourantIndex],
    anneeFactureChiffre: ''
  });

  const [loading, setLoading] = useState(false);
  const [enTrainDeReinitialiser, setEnTrainDeReinitialiser] = useState(false);
  const [messageSucces, setMessageSucces] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/clients')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setClientsEnregistres(data);
      })
      .catch((err) => console.error("Erreur chargement clients:", err));
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setAfficherSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const clientsFiltresParType = clientsEnregistres.filter((cli) => {
    const catCli = (cli.type || cli.categorie || cli.typeFacture || 'locataire').toLowerCase();
    return catCli.includes(formData.typeFacture.toLowerCase());
  });

  const clientsFiltresParRecherche = clientsFiltresParType.filter((cli) => {
    const texte = `${cli.nom || ''} ${cli.postNom || ''} ${cli.prenom || ''}`.toLowerCase();
    const motsRecherche = saisieRechercheClient.toLowerCase().trim().split(/\s+/);
    return motsRecherche.every((mot) => texte.includes(mot));
  });

  useEffect(() => {
    if (modeSelection === 'plusieurs') {
      const tousLesIds = clientsFiltresParType.map(cli => cli.id || cli.matricule).filter(Boolean);
      setFormData(prev => ({ ...prev, clientsCibles: tousLesIds }));
    }
  }, [formData.typeFacture, clientsEnregistres, modeSelection]);

  let optionsPeriodeSpecifique = [];
  if (formData.typePeriode === 'mois') {
    optionsPeriodeSpecifique = listeMoisEnLettres.map((m) => ({ value: m, label: m }));
  } else if (formData.typePeriode === 'trimestre') {
    optionsPeriodeSpecifique = [
      { value: 'Janvier - Mars (T1)', label: 'Janvier - Mars (T1)' },
      { value: 'Avril - Juin (T2)', label: 'Avril - Juin (T2)' },
      { value: 'Juillet - Septembre (T3)', label: 'Juillet - Septembre (T3)' },
      { value: 'Octobre - Décembre (T4)', label: 'Octobre - Décembre (T4)' }
    ];
  } else if (formData.typePeriode === 'semestre') {
    optionsPeriodeSpecifique = [
      { value: 'Janvier - Juin (S1)', label: 'Janvier - Juin (S1)' },
      { value: 'Juillet - Décembre (S2)', label: 'Juillet - Décembre (S2)' }
    ];
  }

  useEffect(() => {
    if (modeSelection === 'plusieurs' || !formData.clientCode) {
      if (formData.typePeriode === 'mois') {
        setFormData((prev) => ({ ...prev, choixPeriodeSpecifique: listeMoisEnLettres[moisCourantIndex] }));
      } else if (formData.typePeriode === 'trimestre') {
        setFormData((prev) => ({ ...prev, choixPeriodeSpecifique: 'Janvier - Mars (T1)' }));
      } else if (formData.typePeriode === 'semestre') {
        setFormData((prev) => ({ ...prev, choixPeriodeSpecifique: 'Janvier - Juin (S1)' }));
      }
    }
  }, [formData.typePeriode, modeSelection]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleModeChange = (e) => {
    const nouveauMode = e.target.value;
    setModeSelection(nouveauMode);
    setSaisieRechercheClient('');
    setErreurValidationClient(false);
    
    let tousLesIds = [];
    if (nouveauMode === 'plusieurs') {
      tousLesIds = clientsFiltresParType.map(cli => cli.id || cli.matricule).filter(Boolean);
    }

    setFormData((prev) => ({ 
      ...prev, 
      clientCode: '', 
      nomLocataire: '', 
      clientsCibles: tousLesIds,
      typePeriode: 'mois' 
    }));
  };

  const handleSaisieRechercheChange = (e) => {
    const valeur = e.target.value;
    setSaisieRechercheClient(valeur);
    setAfficherSuggestions(true);
    setEnCoursDeRecherche(true);
    setErreurValidationClient(false);

    if (timeoutRechercheRef.current) clearTimeout(timeoutRechercheRef.current);
    timeoutRechercheRef.current = setTimeout(() => {
      setEnCoursDeRecherche(false);
    }, 300);
  };

  const handleSelectionClientUnique = (cli) => {
    const nomComplet = `${cli.nom || ''} ${cli.postNom || ''} ${cli.prenom || ''}`.trim();
    
    let periodeFrequence = 'mois';
    const brutePeriode = (cli.typePeriode || cli.periode || '').toLowerCase();
    
    if (brutePeriode.includes('trimestre')) {
      periodeFrequence = 'trimestre';
    } else if (brutePeriode.includes('semestre')) {
      periodeFrequence = 'semestre';
    } else {
      periodeFrequence = 'mois';
    }

    setSaisieRechercheClient(nomComplet);
    setErreurValidationClient(false);
    setFormData((prev) => ({
      ...prev,
      clientCode: cli.id || cli.matricule || '',
      nomLocataire: nomComplet,
      logement: cli.logement || '',
      adresse: cli.adresse || '',
      typePeriode: periodeFrequence 
    }));
    setAfficherSuggestions(false);
  };

  const handleCheckboxChange = (identifiant) => {
    setFormData((prev) => {
      const exists = prev.clientsCibles.includes(identifiant);
      if (exists) {
        return { ...prev, clientsCibles: prev.clientsCibles.filter((id) => id !== identifiant) };
      } else {
        return { ...prev, clientsCibles: [...prev.clientsCibles, identifiant] };
      }
    });
  };

  const handleReinitialiser = async () => {
    setEnTrainDeReinitialiser(true);
    setMessageSucces('');

    await new Promise(resolve => setTimeout(resolve, 500));

    setModeSelection('un');
    setSaisieRechercheClient('');
    setErreurValidationClient(false);
    setFormData({
      clientCode: '',
      nomLocataire: '',
      clientsCibles: [],
      typeFacture: 'locataire',
      typePeriode: 'mois',
      choixPeriodeSpecifique: listeMoisEnLettres[moisCourantIndex],
      anneeFactureChiffre: ''
    });

    setEnTrainDeReinitialiser(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (modeSelection === 'un' && !formData.nomLocataire.trim()) {
      setErreurValidationClient(true);
      return;
    }
    
    if (modeSelection === 'plusieurs' && formData.clientsCibles.length === 0) {
      alert("Aucun client trouvé dans cette catégorie pour effectuer la facturation en masse.");
      return;
    }
    
    if (!formData.anneeFactureChiffre.trim()) {
      alert("Veuillez renseigner l'année.");
      return;
    }

    setLoading(true);
    setMessageSucces('');

    try {
      const endpoint = modeSelection === 'un' 
        ? 'http://localhost:5000/api/factures' 
        : 'http://localhost:5000/api/factures/masse';
      
      // Transmission explicite du mois et de l'année au backend
      const payload = { 
        ...formData, 
        moisFacture: formData.choixPeriodeSpecifique,
        anneeFacturee: formData.anneeFactureChiffre 
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const dataResult = await response.json();

      if (!response.ok) {
        throw new Error(dataResult.erreur || "Erreur lors de l'enregistrement dans la table factures.");
      }

      setMessageSucces(dataResult.message || "Facture(s) enregistrée(s) avec succès !");
      
      setSaisieRechercheClient('');
      setErreurValidationClient(false);
      setFormData({
        clientCode: '',
        nomLocataire: '',
        clientsCibles: modeSelection === 'plusieurs' ? clientsFiltresParType.map(cli => cli.id || cli.matricule).filter(Boolean) : [],
        typeFacture: formData.typeFacture,
        typePeriode: 'mois',
        choixPeriodeSpecifique: listeMoisEnLettres[moisCourantIndex],
        anneeFactureChiffre: ''
      });

    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConteneurFormulaire ref={wrapperRef}>
      <TitreSection>Générer et Enregistrer une Facture</TitreSection>

      {messageSucces && (
        <div style={{
          backgroundColor: 'rgba(174, 234, 0, 0.1)',
          border: '1px solid #AEEA00',
          color: '#AEEA00',
          padding: '0.75rem',
          borderRadius: '8px',
          marginBottom: '1.2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.85rem',
          fontWeight: 600
        }}>
          <FiCheckCircle size={18} /> {messageSucces}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <GrilleFormulaire 
          $chargementSoumission={loading} 
          $reinitialisationEnCours={enTrainDeReinitialiser}
        >
          <ModeSelection 
            modeSelection={modeSelection} 
            onModeChange={handleModeChange} 
          />

          <TypeClient 
            typeFacture={formData.typeFacture} 
            onChange={handleChange} 
          />

          <RechercherClient 
            modeSelection={modeSelection}
            saisieRechercheClient={saisieRechercheClient}
            onSaisieChange={handleSaisieRechercheChange}
            afficherSuggestions={afficherSuggestions}
            onFocusSuggestions={() => setAfficherSuggestions(true)}
            enCoursDeRecherche={enCoursDeRecherche}
            clientsFiltresParRecherche={clientsFiltresParRecherche}
            clientsFiltresParType={clientsFiltresParType}
            onSelectClient={handleSelectionClientUnique}
            clientsCibles={formData.clientsCibles}
            onCheckboxChange={handleCheckboxChange}
            erreurValidation={erreurValidationClient}
          />

          <PeriodeFacturation 
            typePeriode={formData.typePeriode}
            choixPeriodeSpecifique={formData.choixPeriodeSpecifique}
            anneeFactureChiffre={formData.anneeFactureChiffre}
            onChange={handleChange}
            optionsPeriodeSpecifique={optionsPeriodeSpecifique}
            estVerrouille={modeSelection === 'un' && Boolean(formData.clientCode)}
          />
        </GrilleFormulaire>

        <ConteneurActions>
          <BoutonReinitialiser type="button" onClick={handleReinitialiser} disabled={loading || enTrainDeReinitialiser}>
            {enTrainDeReinitialiser ? <IconeReinitialisationAnimee size={16} /> : <FiRotateCcw size={16} />}
            {enTrainDeReinitialiser ? "Nettoyage..." : "Réinitialiser"}
          </BoutonReinitialiser>

          <BoutonSoumettre type="submit" disabled={loading || enTrainDeReinitialiser}>
            {loading ? (
              <>
                <SpinnerChargement /> Enregistrement...
              </>
            ) : (
              <>
                <FiSave size={18} /> Enregistrer la facture
              </>
            )}
          </BoutonSoumettre>
        </ConteneurActions>
      </form>
    </ConteneurFormulaire>
  );
}