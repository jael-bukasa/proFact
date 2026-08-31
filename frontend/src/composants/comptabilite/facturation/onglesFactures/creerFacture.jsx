import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { FiSave, FiCheckCircle, FiLoader } from 'react-icons/fi';

const THEME = {
  accentuation: '#AEEA00',
  textePrincipal: '#FFFFFF',
  texteSecondaire: '#888888',
  bordure: '#2A2A2A',
  fondChamp: '#121212',
  fondCarte: '#1E1E1E'
};

const fadeInOut = keyframes`
  from {
    opacity: 0;
    transform: translateY(-6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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
`;

const GroupeChamp = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  position: relative;
  grid-column: ${({ $plein }) => ($plein ? '1 / -1' : 'auto')};
`;

const LabelChamp = styled.label`
  font-size: 0.82rem;
  font-weight: 600;
  color: #CCC;
`;

const SelectChamp = styled.select`
  background-color: ${THEME.fondChamp};
  border: 1px solid ${THEME.bordure};
  border-radius: 8px;
  padding: 0.75rem;
  color: ${THEME.textePrincipal};
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s;
  width: 100%;

  &:focus {
    border-color: ${THEME.accentuation};
  }

  option {
    background-color: ${THEME.fondChamp};
    color: ${THEME.textePrincipal};
    padding: 6px;
  }
`;

const ConteneurInputRecherche = styled.div`
  position: relative;
  width: 100%;
`;

const InputChamp = styled.input`
  background-color: ${THEME.fondChamp};
  border: 1px solid ${THEME.bordure};
  border-radius: 8px;
  padding: 0.75rem;
  padding-right: 2.5rem;
  color: ${THEME.textePrincipal};
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s;
  width: 100%;

  &:focus {
    border-color: ${THEME.accentuation};
  }
`;

const IconeChargementRecherche = styled.div`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: ${THEME.accentuation};
  display: flex;
  align-items: center;
  animation: rotation 1s linear infinite;

  @keyframes rotation {
    from { transform: translateY(-50%) rotate(0deg); }
    to { transform: translateY(-50%) rotate(360deg); }
  }
`;

const ListeSuggestions = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: ${THEME.fondChamp};
  border: 1px solid ${THEME.bordure};
  border-radius: 8px;
  max-height: 180px;
  overflow-y: auto;
  list-style: none;
  padding: 4px;
  margin: 6px 0 0 0;
  z-index: 10;
  box-shadow: 0 8px 24px rgba(0,0,0,0.6);
  animation: ${fadeInOut} 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
`;

const ElementSuggestion = styled.li`
  padding: 0.7rem 0.9rem;
  font-size: 0.9rem;
  cursor: pointer;
  color: ${THEME.textePrincipal};
  border-radius: 6px;
  transition: background-color 0.15s ease, color 0.15s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    background-color: rgba(174, 234, 0, 0.12);
    color: ${THEME.accentuation};
  }
`;

const TexteSurligne = styled.span`
  color: ${THEME.accentuation};
  font-weight: 700;
`;

const LignePeriode = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 0.6rem;
`;

const ConteneurListeCases = styled.div`
  background-color: ${THEME.fondChamp};
  border: 1px solid ${THEME.bordure};
  border-radius: 8px;
  padding: 0.75rem;
  max-height: 130px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const LabelCheckbox = styled.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.9rem;
  color: ${THEME.textePrincipal};
  cursor: pointer;

  input {
    accent-color: ${THEME.accentuation};
    width: 16px;
    height: 16px;
    cursor: pointer;
  }
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
  gap: 0.5rem;
  transition: opacity 0.2s;
  width: 100%;
  margin-top: 1rem;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export default function CreerFacture() {
  const [modeSelection, setModeSelection] = useState('un');
  const [clientsEnregistres, setClientsEnregistres] = useState([]);
  const [saisieRechercheClient, setSaisieRechercheClient] = useState('');
  const [afficherSuggestions, setAfficherSuggestions] = useState(false);
  const [enCoursDeRecherche, setEnCoursDeRecherche] = useState(false);
  
  const wrapperRef = useRef(null);
  const timeoutRechercheRef = useRef(null);

  const dateActuelle = new Date();
  const anneeCourante = dateActuelle.getFullYear();
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
    anneeFactureChiffre: anneeCourante.toString()
  });

  const [loading, setLoading] = useState(false);
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
    if (formData.typePeriode === 'mois') {
      setFormData((prev) => ({ ...prev, choixPeriodeSpecifique: listeMoisEnLettres[moisCourantIndex] }));
    } else if (formData.typePeriode === 'trimestre') {
      setFormData((prev) => ({ ...prev, choixPeriodeSpecifique: 'Janvier - Mars (T1)' }));
    } else if (formData.typePeriode === 'semestre') {
      setFormData((prev) => ({ ...prev, choixPeriodeSpecifique: 'Janvier - Juin (S1)' }));
    }
  }, [formData.typePeriode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleModeChange = (e) => {
    setModeSelection(e.target.value);
    setSaisieRechercheClient('');
    setFormData((prev) => ({ ...prev, clientCode: '', nomLocataire: '', clientsCibles: [] }));
  };

  const handleSaisieRechercheChange = (e) => {
    const valeur = e.target.value;
    setSaisieRechercheClient(valeur);
    setAfficherSuggestions(true);
    setEnCoursDeRecherche(true);

    if (timeoutRechercheRef.current) {
      clearTimeout(timeoutRechercheRef.current);
    }

    timeoutRechercheRef.current = setTimeout(() => {
      setEnCoursDeRecherche(false);
    }, 300);
  };

  const formaterTexteAvecSurlignage = (texteComplet, query) => {
    if (!query.trim()) return texteComplet;
    
    const index = texteComplet.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) return texteComplet;

    const avant = texteComplet.substring(0, index);
    const correspondance = texteComplet.substring(index, index + query.length);
    const apres = texteComplet.substring(index + query.length);

    return (
      <>
        {avant}
        <TexteSurligne>{correspondance}</TexteSurligne>
        {apres}
      </>
    );
  };

  const handleSelectionClientUnique = (cli) => {
    const nomComplet = `${cli.nom || ''} ${cli.postNom || ''} ${cli.prenom || ''}`.trim();
    setSaisieRechercheClient(nomComplet);
    setFormData((prev) => ({
      ...prev,
      clientCode: cli.id || cli.matricule || '',
      nomLocataire: nomComplet,
      logement: cli.logement || '',
      adresse: cli.adresse || ''
    }));
    setAfficherSuggestions(false);
  };

  const handleCheckboxChange = (identifiant) => {
    setFormData((prev) => {
      const exists = prev.clientsCibles.includes(identifiant);
      if (exists) {
        return {
          ...prev,
          clientsCibles: prev.clientsCibles.filter((id) => id !== identifiant)
        };
      } else {
        return {
          ...prev,
          clientsCibles: [...prev.clientsCibles, identifiant]
        };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (modeSelection === 'un' && !formData.nomLocataire.trim()) {
      alert("Veuillez sélectionner ou saisir un client valide.");
      return;
    }
    if (modeSelection === 'plusieurs' && formData.clientsCibles.length === 0) {
      alert("Veuillez cocher au moins un client dans la liste.");
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
      
      const payload = {
        ...formData,
        moisFacture: formData.choixPeriodeSpecifique
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'enregistrement dans la table factures.");
      }

      setMessageSucces("Facture(s) enregistrée(s) avec succès dans la table factures !");
      setSaisieRechercheClient('');
      setFormData((prev) => ({
        ...prev,
        clientCode: '',
        nomLocataire: '',
        clientsCibles: []
      }));
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConteneurFormulaire>
      <TitreSection>
        Générer et Enregistrer une Facture
      </TitreSection>

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
        <GrilleFormulaire>
          {/* Champ 1 : Mode de sélection */}
          <GroupeChamp>
            <LabelChamp>1. Mode de sélection *</LabelChamp>
            <SelectChamp value={modeSelection} onChange={handleModeChange}>
              <option value="un">Un seul client</option>
              <option value="plusieurs">Plusieurs clients</option>
            </SelectChamp>
          </GroupeChamp>

          {/* Champ 2 : Type de client / Catégorie */}
          <GroupeChamp>
            <LabelChamp>2. Type de client / Catégorie *</LabelChamp>
            <SelectChamp 
              name="typeFacture" 
              value={formData.typeFacture} 
              onChange={handleChange}
            >
              <option value="locataire">Locataire (Loyer)</option>
              <option value="eau">Eau</option>
              <option value="electricite">Électricité</option>
              <option value="divers">Divers / Autre</option>
            </SelectChamp>
          </GroupeChamp>

          {/* Champ 3 : Sélection du client avec affichage global au focus */}
          <GroupeChamp $plein={true} ref={wrapperRef}>
            {modeSelection === 'un' ? (
              <>
                <LabelChamp>Rechercher le client (Nom, Postnom, Prénom) *</LabelChamp>
                <ConteneurInputRecherche>
                  <InputChamp 
                    type="text" 
                    placeholder="Tapez le nom, postnom ou prénom..." 
                    value={saisieRechercheClient} 
                    onChange={handleSaisieRechercheChange}
                    onFocus={() => setAfficherSuggestions(true)}
                    required
                  />
                  {enCoursDeRecherche && (
                    <IconeChargementRecherche>
                      <FiLoader size={16} />
                    </IconeChargementRecherche>
                  )}
                </ConteneurInputRecherche>

                {/* MODIFICATION ICI : On affiche la liste dès que 'afficherSuggestions' est vrai, peu importe si le champ est vide */}
                {afficherSuggestions && (
                  <ListeSuggestions>
                    {enCoursDeRecherche ? (
                      <ElementSuggestion style={{ justifyContent: 'center', color: '#888' }}>
                        Chargement des clients...
                      </ElementSuggestion>
                    ) : clientsFiltresParRecherche.length === 0 ? (
                      <ElementSuggestion style={{ justifyContent: 'center', color: '#888', cursor: 'default' }}>
                        Aucun client trouvé
                      </ElementSuggestion>
                    ) : (
                      clientsFiltresParRecherche.map((cli, index) => {
                        const nomComplet = `${cli.nom || ''} ${cli.postNom || ''} ${cli.prenom || ''}`.trim();
                        const texteAffichage = `${nomComplet} ${cli.matricule ? `(${cli.matricule})` : ''}`;
                        return (
                          <ElementSuggestion 
                            key={cli.id || index}
                            onClick={() => handleSelectionClientUnique(cli)}
                          >
                            <span>{formaterTexteAvecSurlignage(texteAffichage, saisieRechercheClient)}</span>
                          </ElementSuggestion>
                        );
                      })
                    )}
                  </ListeSuggestions>
                )}
              </>
            ) : (
              <>
                <LabelChamp>Cochez les clients correspondants à la catégorie *</LabelChamp>
                <ConteneurListeCases>
                  {clientsFiltresParType.length === 0 ? (
                    <span style={{ color: '#888', fontSize: '0.85rem' }}>Aucun client trouvé pour cette catégorie.</span>
                  ) : (
                    clientsFiltresParType.map((cli, index) => {
                      const nomComplet = `${cli.nom || ''} ${cli.postNom || ''} ${cli.prenom || ''}`.trim();
                      const identifiant = cli.id || cli.matricule || index;
                      const estCoche = formData.clientsCibles.includes(identifiant);
                      return (
                        <LabelCheckbox key={identifiant}>
                          <input 
                            type="checkbox" 
                            checked={estCoche} 
                            onChange={() => handleCheckboxChange(identifiant)} 
                          />
                          {nomComplet} {cli.matricule ? `(${cli.matricule})` : ''}
                        </LabelCheckbox>
                      );
                    })
                  )}
                </ConteneurListeCases>
              </>
            )}
          </GroupeChamp>

          {/* Champ 4 : Période de facturation */}
          <GroupeChamp $plein={true}>
            <LabelChamp>3. Période de facturation *</LabelChamp>
            <LignePeriode>
              <SelectChamp 
                name="typePeriode" 
                value={formData.typePeriode} 
                onChange={handleChange}
              >
                <option value="mois">Par mois</option>
                <option value="trimestre">Trimestre</option>
                <option value="semestre">Semestre</option>
              </SelectChamp>

              <SelectChamp 
                name="choixPeriodeSpecifique" 
                value={formData.choixPeriodeSpecifique} 
                onChange={handleChange}
              >
                {optionsPeriodeSpecifique.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </SelectChamp>

              <InputChamp 
                type="number" 
                name="anneeFactureChiffre" 
                placeholder="Année" 
                value={formData.anneeFactureChiffre} 
                onChange={handleChange}
                required
              />
            </LignePeriode>
          </GroupeChamp>
        </GrilleFormulaire>

        <BoutonSoumettre type="submit" disabled={loading}>
          <FiSave size={18} /> {loading ? "Enregistrement..." : "Enregistrer la facture"}
        </BoutonSoumettre>
      </form>
    </ConteneurFormulaire>
  );
}