import React, { useState } from 'react';
import styled from 'styled-components';
import ComptesActifs from './banques/comptesActifs';
import Tresorerie from './banques/tresorerie';
import NouvelleBanque from './banques/nouvelleBanque';
import ComptesEnregistres from './banques/comptesEnregistres';

const ConteneurBanques = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
  max-width: 1300px;
  margin: 0 auto;
`;

const GrilleStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3 colonnes pour nos 3 cartes de stats */
  gap: 1.25rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const GrillePrincipale = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 1.5rem;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

export default function Banques() {
  const [banques, setBanques] = useState([
    { id: 1, nom: 'Rawbank', numeroCompte: '0123456789', devise: 'USD', solde: 15450.00 },
    { id: 2, nom: 'TMB', numeroCompte: '9876543210', devise: 'CDF', solde: 4230000.00 }
  ]);

  const [form, setForm] = useState({
    nom: '',
    numeroCompte: '',
    devise: 'USD',
    soldeInitiale: ''
  });

  const [idEnCoursDeModification, setIdEnCoursDeModification] = useState(null);
  const [recherche, setRecherche] = useState('');

  const gererSoumission = (e) => {
    e.preventDefault();
    if (!form.nom || !form.numeroCompte) return;

    if (idEnCoursDeModification !== null) {
      setBanques(banques.map(b => {
        if (b.id === idEnCoursDeModification) {
          return {
            ...b,
            nom: form.nom,
            numeroCompte: form.numeroCompte,
            devise: form.devise,
            solde: form.soldeInitiale !== '' ? parseFloat(form.soldeInitiale) : b.solde
          };
        }
        return b;
      }));
      setIdEnCoursDeModification(null);
    } else {
      const nouvelleBanque = {
        id: Date.now(),
        nom: form.nom,
        numeroCompte: form.numeroCompte,
        devise: form.devise,
        solde: parseFloat(form.soldeInitiale) || 0
      };
      setBanques([...banques, nouvelleBanque]);
    }

    reinitialiserFormulaire();
  };

  const preparerModification = (banque) => {
    setIdEnCoursDeModification(banque.id);
    setForm({
      nom: banque.nom,
      numeroCompte: banque.numeroCompte,
      devise: banque.devise,
      soldeInitiale: banque.solde
    });
  };

  const supprimerBanque = (id) => {
    setBanques(banques.filter(b => b.id !== id));
    if (idEnCoursDeModification === id) {
      reinitialiserFormulaire();
    }
  };

  const reinitialiserFormulaire = () => {
    setIdEnCoursDeModification(null);
    setForm({ nom: '', numeroCompte: '', devise: 'USD', soldeInitiale: '' });
  };

  const banquesFiltrees = banques.filter(b => 
    b.nom.toLowerCase().includes(recherche.toLowerCase()) ||
    b.numeroCompte.includes(recherche)
  );

  const totalComptes = banques.length;
  const totalUSD = banques.filter(b => b.devise === 'USD').reduce((acc, b) => acc + b.solde, 0);
  const totalCDF = banques.filter(b => b.devise === 'CDF').reduce((acc, b) => acc + b.solde, 0);

  return (
    <ConteneurBanques>
      <GrilleStats>
        <ComptesActifs totalComptes={totalComptes} />
        <Tresorerie totalUSD={totalUSD} totalCDF={totalCDF} />
      </GrilleStats>

      <GrillePrincipale>
        <NouvelleBanque 
          form={form}
          setForm={setForm}
          onSubmit={gererSoumission}
          idEnCoursDeModification={idEnCoursDeModification}
          onAnnuler={reinitialiserFormulaire}
        />

        <ComptesEnregistres 
          banquesFiltrees={banquesFiltrees}
          recherche={recherche}
          setRecherche={setRecherche}
          onModifier={preparerModification}
          onSupprimer={supprimerBanque}
        />
      </GrillePrincipale>
    </ConteneurBanques>
  );
}