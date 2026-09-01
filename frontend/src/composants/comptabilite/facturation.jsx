import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCalendar, FiX, FiCheck, FiPlusCircle } from 'react-icons/fi';

import FiltreClients from "../gestionLocative/clients/filtreClients";
import CreerFacture from './facturation/onglesFactures/creerFacture';
import FactureTous from './facturation/onglesFactures/factureToutes';
import FactureLocataire from './facturation/onglesFactures/factureLocataire';
import FactureEau from './facturation/onglesFactures/factureEau';
import FactureElectricite from './facturation/onglesFactures/factureElectricite';
import { FactureDivers } from './facturation/onglesFactures/factureDivers';

const THEME = {
  accentuation: '#AEEA00',
  textePrincipal: '#FFFFFF',
  texteSecondaire: '#888888',
  bordure: '#2A2A2A',
  fondChamp: '#121212'
};

const ConteneurFactures = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
`;

const BarreOnglets = styled.div`
  display: flex;
  gap: 0.8rem;
  border-bottom: 2px solid ${THEME.bordure};
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
  
  position: sticky;
  top: 0;
  width: 100%;
  background-color: #0d0d0d;
  z-index: 100;
  padding: 1rem 0 0.8rem 0;
  margin-top: -1rem;
`;

const BoutonOnglet = styled.button`
  background-color: ${({ $actif }) => ($actif ? THEME.accentuation : THEME.fondChamp)};
  color: ${({ $actif }) => ($actif ? '#000000' : THEME.textePrincipal)};
  border: 1px solid ${({ $actif }) => ($actif ? THEME.accentuation : THEME.bordure)};
  padding: 0.7rem 1.2rem;
  border-radius: 10px;
  font-weight: ${({ $actif }) => ($actif ? '700' : '500')};
  font-size: 0.85rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${THEME.accentuation};
    opacity: 0.9;
  }

  svg {
    width: 16px;
    height: 16px;
    fill: currentColor;
  }
`;

export default function Facturation({ formaterDateFr, clientsEnregistres = [] }) {
  const [ongletActif, setOngletActif] = useState('creer');
  const [rechercheFacture, setRechercheFacture] = useState('');
  const [filtreDateExacte, setFiltreDateExacte] = useState('');

  const [clientPourFacture, setClientPourFacture] = useState(null);
  const [loadingGeneration, setLoadingGeneration] = useState(false);
  const [listeFacturesAPI, setListeFacturesAPI] = useState([]);

  useEffect(() => {
    chargerFacturesAPI();
  }, []);

  // Interrogation directe de la base de données via l'API
  const chargerFacturesAPI = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/factures');
      if (response.ok) {
        const data = await response.json();
        setListeFacturesAPI(data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des factures depuis l'API :", error);
    }
  };

  const reinitialiserFiltres = () => {
    setRechercheFacture('');
    setFiltreDateExacte('');
  };

  const onglets = [
    { id: 'creer', label: 'Créer Facture', icone: <FiPlusCircle style={{ width: '16px', height: '16px' }} /> },
    { id: 'toutes', label: 'Toutes', icone: <svg viewBox="0 0 24 24"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z"/></svg> },
    { id: 'locataire', label: 'Locataire', icone: <svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg> },
    { id: 'eau', label: 'Eau', icone: <svg viewBox="0 0 24 24"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg> },
    { id: 'electricite', label: 'Électricité', icone: <svg viewBox="0 0 24 24"><path d="M7 2v11h3v9l7-12h-4l4-8z"/></svg> },
    { id: 'divers', label: 'Divers', icone: <svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg> }
  ];

  const listeFactures = useMemo(() => {
    const source = listeFacturesAPI;
    if (!source || source.length === 0) return [];

    return source.map((cli, index) => {
      const nomComplet = `${cli.nom || ''} ${cli.postNom || ''} ${cli.prenom || ''}`.trim();
      const matriculeBrut = (cli.matricule || cli.numero || '').toUpperCase();
      let typeDetecte = (cli.type || cli.typeFacture || '').toLowerCase();

      if (!typeDetecte || typeDetecte === 'locataire') {
        if (matriculeBrut.startsWith('DIV')) {
          typeDetecte = 'divers';
        } else if (matriculeBrut.startsWith('EAU')) {
          typeDetecte = 'eau';
        } else if (matriculeBrut.startsWith('ELE') || matriculeBrut.startsWith('ELEC')) {
          typeDetecte = 'electricite';
        } else {
          typeDetecte = 'locataire';
        }
      }
      
      return {
        id: cli.id || index,
        numero: cli.bail || cli.numero || `FACT-${index + 1}`,
        client: nomComplet || cli.client || cli.locataire || 'Client Inconnu',
        locataire: nomComplet || cli.client || cli.locataire || 'Client Inconnu',
        type: typeDetecte,
        typeFacture: typeDetecte,
        devise: cli.devise || 'USD',
        montant: parseFloat(cli.montant) || 0,
        moisFacture: cli.moisFacture || cli.periode || cli.mois_facture || '',
        anneeFacturee: cli.anneeFacturee || cli.annee || (cli.moisFacture ? cli.moisFacture.split('-')[0] : new Date(cli.dateBail || cli.dateEnregistrement || Date.now()).getFullYear()),
        dateFacture: cli.dateBail || cli.dateEnregistrement || cli.dateFacture || new Date().toISOString().split('T')[0],
        statut: cli.statut || 'En attente',
        ...cli 
      };
    });
  }, [listeFacturesAPI]);

  const facturesFiltreesGlobal = useMemo(() => {
    if (ongletActif === 'creer') return [];

    return listeFactures.filter(facture => {
      const matricule = (facture.matricule || facture.numero || '').toUpperCase();
      const typeBrut = (facture.typeFacture || facture.type || '').toLowerCase();

      let categorieReelle = 'locataire';
      if (matricule.startsWith('DIV')) {
        categorieReelle = 'divers';
      } else if (matricule.startsWith('EAU')) {
        categorieReelle = 'eau';
      } else if (matricule.startsWith('ELE') || matricule.startsWith('ELEC')) {
        categorieReelle = 'electricite';
      } else if (matricule.startsWith('LOY') || matricule.startsWith('LY') || typeBrut.includes('loyer') || typeBrut.includes('locataire')) {
        categorieReelle = 'locataire';
      } else {
        categorieReelle = typeBrut;
      }

      if (ongletActif !== 'toutes' && categorieReelle !== ongletActif) {
        return false;
      }

      if (rechercheFacture) {
        const terme = rechercheFacture.toLowerCase();
        const num = matricule.toLowerCase();
        const clientNom = (facture.locataire || facture.client || facture.nom || '').toLowerCase();
        if (!num.includes(terme) && !clientNom.includes(terme)) return false;
      }

      if (filtreDateExacte) {
        const dateFacturePropre = facture.dateFacture ? facture.dateFacture.split('T')[0] : '';
        if (dateFacturePropre !== filtreDateExacte) return false;
      }

      return true;
    });
  }, [listeFactures, ongletActif, rechercheFacture, filtreDateExacte]);

  const RenduFactureActif = useMemo(() => {
    switch (ongletActif) {
      case 'creer': return CreerFacture;
      case 'locataire': return FactureLocataire;
      case 'eau': return FactureEau;
      case 'electricite': return FactureElectricite;
      case 'divers': return FactureDivers;
      case 'toutes':
      default: return FactureTous;
    }
  }, [ongletActif]);

  const handleOuvrirModalFacture = (cli) => {
    setClientPourFacture(cli);
  };

  const handleValiderGeneration = async (moisSelectionne) => {
    if (!clientPourFacture) return;
    setLoadingGeneration(true);

    try {
      const payload = {
        ...clientPourFacture,
        moisFacture: moisSelectionne,
        dateFacturation: new Date().toISOString().split('T')[0]
      };

      const response = await fetch('http://localhost:5000/api/factures', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la génération de la facture.");
      }

      alert(`Facture générée avec succès pour le mois : ${moisSelectionne} !`);
      setClientPourFacture(null);
      
      // Force l'interrogation immédiate de la base de données pour actualiser les données fraîches
      await chargerFacturesAPI(); 
    } catch (error) {
      console.error("Erreur :", error);
      alert("Erreur : " + error.message);
    } finally {
      setLoadingGeneration(false);
    }
  };

  const supprimerFacture = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/factures/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        // Recharge directement les données depuis la base après suppression
        await chargerFacturesAPI();
      }
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };

  return (
    <ConteneurFactures>
      <BarreOnglets>
        {onglets.map((onglet) => (
          <BoutonOnglet
            key={onglet.id}
            $actif={ongletActif === onglet.id}
            onClick={() => setOngletActif(onglet.id)}
            type="button"
          >
            {onglet.icone}
            {onglet.label}
          </BoutonOnglet>
        ))}
      </BarreOnglets>

      {ongletActif !== 'creer' && (
        <div style={{ marginBottom: '0.5rem' }}>
          <FiltreClients
            rechercheTexte={rechercheFacture}
            setRechercheTexte={setRechercheFacture}
            filtreDateExacte={filtreDateExacte}
            setFiltreDateExacte={setFiltreDateExacte}
            reinitialiserFiltres={reinitialiserFiltres}
          />
        </div>
      )}

      {/* La clé dynamique `${ongletActif}-${listeFacturesAPI.length}` force le rechargement immédiat de l'affichage */}
      <RenduFactureActif
        key={`${ongletActif}-${listeFacturesAPI.length}`}
        listeFactures={facturesFiltreesGlobal}
        formaterDateFr={formaterDateFr}
        onGenererFacture={handleOuvrirModalFacture}
        supprimerFacture={supprimerFacture}
        clientsEnregistres={clientsEnregistres}
      />

      <ModalChoixMois 
        isOpen={Boolean(clientPourFacture)}
        onClose={() => setClientPourFacture(null)}
        client={clientPourFacture}
        onValider={handleValiderGeneration}
        loading={loadingGeneration}
      />
    </ConteneurFactures>
  );
}

function ModalChoixMois({ isOpen, onClose, client, onValider, loading }) {
  const [moisSelectionne, setMoisSelectionne] = useState(new Date().toISOString().slice(0, 7));

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000, padding: '1rem'
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          style={{
            backgroundColor: '#1E1E1E',
            border: '1px solid #2A2A2A',
            borderRadius: '12px',
            padding: '1.5rem',
            width: '100%',
            maxWidth: '400px',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.2rem',
            color: '#FFFFFF',
            boxShadow: '0 15px 30px rgba(0,0,0,0.5)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FiCalendar style={{ color: '#AEEA00' }} /> Choisir le mois de facturation
            </h3>
            <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', fontSize: '1.2rem' }}>
              <FiX />
            </button>
          </div>

          <div style={{ fontSize: '0.82rem', color: '#888', background: '#121212', padding: '0.7rem', borderRadius: '8px', border: '1px solid #2A2A2A' }}>
            Client : <strong style={{ color: '#FFF' }}>{client?.nom} {client?.prenom || client?.client}</strong><br />
            Matricule : <strong style={{ color: '#AEEA00' }}>{client?.matricule || client?.numero}</strong>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#CCC' }}>
              Mois cible :
            </label>
            <input 
              type="month" 
              value={moisSelectionne} 
              onChange={(e) => setMoisSelectionne(e.target.value)}
              style={{
                backgroundColor: '#121212',
                border: '1px solid #3A3A3A',
                borderRadius: '8px',
                padding: '0.7rem',
                color: '#FFF',
                fontSize: '0.9rem',
                outline: 'none',
                width: '100%'
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button 
              type="button" 
              onClick={onClose}
              style={{
                backgroundColor: '#121212',
                color: '#FFF',
                border: '1px solid #3A3A3A',
                padding: '0.55rem 1.1rem',
                borderRadius: '8px',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '0.82rem'
              }}
            >
              Annuler
            </button>

            <button 
              type="button" 
              onClick={() => onValider(moisSelectionne)}
              disabled={loading}
              style={{
                backgroundColor: '#AEEA00',
                color: '#000',
                border: '1px solid #3A3A3A',
                padding: '0.55rem 1.2rem',
                borderRadius: '8px',
                fontWeight: 700,
                cursor: 'pointer',
                fontSize: '0.82rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                opacity: loading ? 0.7 : 1
              }}
            >
              <FiCheck /> {loading ? "Génération..." : "Générer"}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}