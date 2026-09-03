import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ComptesActifs from './banques/comptesActifs';
import NouvelleBanque from './banques/nouvelleBanque';
import ComptesEnregistres from './banques/comptesEnregistres';

const ConteneurBanques = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  max-width: 1300px;
  margin: 0 auto;
`;

const GrillePrincipale = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 1.5rem;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const ColonneGauche = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export default function Banques() {
  const [banques, setBanques] = useState([]);
  const [form, setForm] = useState({
    nomBanque: '',
    numeroCompte: '',
    devise: 'USD'
  });

  const [idEnCoursDeModification, setIdEnCoursDeModification] = useState(null);
  const [idModifieRecent, setIdModifieRecent] = useState(null); 
  const [recherche, setRecherche] = useState('');

  // 1. Charger les banques depuis le backend au démarrage
  const chargerBanques = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/banques');
      if (response.ok) {
        const data = await response.json();
        setBanques(data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des banques :", error);
    }
  };

  useEffect(() => {
    chargerBanques();
  }, []);

  // 2. Gérer l'ajout ou la modification
  const gererSoumission = async (e) => {
    e.preventDefault();
    if (!form.nomBanque || !form.numeroCompte) return;

    try {
      if (idEnCoursDeModification !== null) {
        const idModifie = idEnCoursDeModification; 
        
        // ENVOI DE LA REQUÊTE DE MISE À JOUR (PUT)
        const response = await fetch(`http://localhost:5000/api/banques/${idModifie}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        });

        if (response.ok) {
          chargerBanques(); 
          
          // Activer la surbrillance pour cette banque précise
          setIdModifieRecent(idModifie);

          // Retirer la surbrillance après 10 secondes (10000 ms)
          setTimeout(() => {
            setIdModifieRecent(null);
          }, 10000);
        }
      } else {
        // ENVOI DE LA REQUÊTE D'AJOUT (POST)
        const response = await fetch('http://localhost:5000/api/banques', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        });

        if (response.ok) {
          chargerBanques(); 
        }
      }
      reinitialiserFormulaire();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la banque :", error);
    }
  };

  const preparerModification = (banque) => {
    setIdEnCoursDeModification(banque.id);
    setForm({
      nomBanque: banque.nomBanque,
      numeroCompte: banque.numeroCompte,
      devise: banque.devise
    });
  };

  // 3. Supprimer une banque via l'API
  const supprimerBanque = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/banques/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setBanques(banques.filter(b => b.id !== id));
        if (idEnCoursDeModification === id) {
          reinitialiserFormulaire();
        }
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de la banque :", error);
    }
  };

  const reinitialiserFormulaire = () => {
    setIdEnCoursDeModification(null);
    setForm({ nomBanque: '', numeroCompte: '', devise: 'USD' });
  };

  // Filtrage sécurisé
  const banquesFiltrees = banques.filter(b => 
    (b.nomBanque && b.nomBanque.toLowerCase().includes(recherche.toLowerCase())) ||
    (b.numeroCompte && b.numeroCompte.includes(recherche))
  );

  const totalComptes = banques.length;

  return (
    <ConteneurBanques>
      <GrillePrincipale>
        {/* Colonne de gauche : Comptes Actifs + Formulaire Nouvelle Banque */}
        <ColonneGauche>
          <ComptesActifs totalComptes={totalComptes} />
          <NouvelleBanque 
            form={form}
            setForm={setForm}
            onSubmit={gererSoumission}
            idEnCoursDeModification={idEnCoursDeModification}
            onAnnuler={reinitialiserFormulaire}
          />
        </ColonneGauche>

        {/* Colonne de droite : Comptes enregistrés */}
        <ComptesEnregistres 
          banquesFiltrees={banquesFiltrees}
          recherche={recherche}
          setRecherche={setRecherche}
          onModifier={preparerModification}
          onSupprimer={supprimerBanque}
          idModifieRecent={idModifieRecent}
        />
      </GrillePrincipale>
    </ConteneurBanques>
  );
}