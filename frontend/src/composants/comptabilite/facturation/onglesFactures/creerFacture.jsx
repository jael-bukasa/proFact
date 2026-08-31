import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiSave, FiCheckCircle } from 'react-icons/fi';

const THEME = {
  accentuation: '#AEEA00',
  textePrincipal: '#FFFFFF',
  texteSecondaire: '#888888',
  bordure: '#2A2A2A',
  fondChamp: '#121212',
  fondCarte: '#1E1E1E'
};

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

const InputChamp = styled.input`
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
  max-height: 120px;
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

export default function CreerFacture({ clientsEnregistres = [] }) {
  const [modeSelection, setModeSelection] = useState('un');
  
  const dateActuelle = new Date();
  const anneeCourante = dateActuelle.getFullYear();
  const moisCourantIndex = dateActuelle.getMonth();

  const listeMoisEnLettres = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];

  const [formData, setFormData] = useState({
    nomClientUnique: '',
    clientsCibles: [],
    typeFacture: 'locataire',
    typePeriode: 'mois', // 'mois', 'trimestre', 'semestre'
    choixPeriodeSpecifique: listeMoisEnLettres[moisCourantIndex],
    anneeFactureChiffre: anneeCourante.toString()
  });

  const [loading, setLoading] = useState(false);
  const [messageSucces, setMessageSucces] = useState('');

  // Définition des options groupées selon le type de période choisi
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

  // Réinitialiser la sélection spécifique si le type de période change
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
    setFormData((prev) => ({ ...prev, nomClientUnique: '', clientsCibles: [] }));
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
    if (modeSelection === 'un' && !formData.nomClientUnique.trim()) {
      alert("Veuillez saisir le nom du client.");
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
      const endpoint = modeSelection === 'un' ? 'http://localhost:5000/api/factures' : 'http://localhost:5000/api/factures/masse';
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la génération des factures.");
      }

      setMessageSucces("Facture(s) générée(s) avec succès !");
      setFormData((prev) => ({
        ...prev,
        nomClientUnique: '',
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
        Générer des factures
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
          {/* Champ 1 (Gauche) : Sélection du mode */}
          <GroupeChamp>
            <LabelChamp>1. Mode de sélection *</LabelChamp>
            <SelectChamp value={modeSelection} onChange={handleModeChange}>
              <option value="un">Un seul client</option>
              <option value="plusieurs">Plusieurs clients</option>
            </SelectChamp>
          </GroupeChamp>

          {/* Champ 2 (Droite) : Saisie du nom unique OU Liste à cocher */}
          <GroupeChamp>
            {modeSelection === 'un' ? (
              <>
                <LabelChamp>Nom du client *</LabelChamp>
                <InputChamp 
                  type="text" 
                  name="nomClientUnique" 
                  placeholder="Entrez le nom du client..." 
                  value={formData.nomClientUnique} 
                  onChange={handleChange}
                  required
                />
              </>
            ) : (
              <>
                <LabelChamp>Cochez les clients *</LabelChamp>
                <ConteneurListeCases>
                  {clientsEnregistres.length === 0 ? (
                    <span style={{ color: '#888', fontSize: '0.85rem' }}>Aucun client enregistré.</span>
                  ) : (
                    clientsEnregistres.map((cli, index) => {
                      const nomComplet = `${cli.nom || ''} ${cli.postNom || ''} ${cli.prenom || ''}`.trim() || cli.client || cli.locataire;
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

          {/* Champ 3 (Gauche) : Type de client / Catégorie */}
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

          {/* Champ 4 (Droite) : Période (Mois, Trimestre, Semestre) + Liste dynamique des mois regroupés + Année libre */}
          <GroupeChamp>
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
          <FiSave size={18} /> {loading ? "Génération en cours..." : "Générer la/les facture(s)"}
        </BoutonSoumettre>
      </form>
    </ConteneurFormulaire>
  );
}