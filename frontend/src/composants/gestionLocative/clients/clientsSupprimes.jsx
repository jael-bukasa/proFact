import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

import TableauClients from './tableauClients';
import FiltreClients from './filtreClients'; // <-- Importation du composant de filtre

// --- THÈME SOMBRE HOMOGÈNE ---
const THEME = {
  fondCarte: '#1E1E1E',
  accentuation: '#AEEA00',
  textePrincipal: '#FFFFFF',
  texteSecondaire: '#888888',
  bordure: '#2A2A2A',
  rouge: '#FF5252',
  vert: '#4CAF50',
  fondChamps: '#121212'
};

const ConteneurCorbeille = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const BarreSuperieure = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TitreSection = styled.h3`
  color: ${THEME.textePrincipal};
  font-size: 1.1rem;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const BoutonViderCorbeille = styled.button`
  background-color: transparent;
  color: ${THEME.rouge};
  border: 1px solid ${THEME.rouge};
  padding: 0.65rem 1.2rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${THEME.rouge};
    color: #FFFFFF;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
    border-color: ${THEME.bordure};
    color: ${THEME.texteSecondaire};
  }
`;

/* --- MODALE ET ÉCRANS UI EN ÉTAPES --- */
const OverlayModal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
`;

const BoiteModal = styled(motion.div)`
  background-color: ${THEME.fondCarte};
  border: 1px solid ${THEME.bordure};
  border-radius: 14px;
  padding: 1.8rem;
  max-width: 460px;
  width: 100%;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const EnTeteModal = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  h4 {
    font-size: 1.1rem;
    color: ${THEME.textePrincipal};
    font-weight: 700;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const IndicateurEtapes = styled.div`
  display: flex;
  gap: 0.4rem;
`;

const PuceEtape = styled.div`
  width: 24px;
  height: 6px;
  border-radius: 3px;
  background-color: ${props => props.$actif ? (props.$succes ? THEME.vert : THEME.rouge) : THEME.bordure};
  transition: all 0.3s ease;
`;

const CarteRisque = styled(motion.div)`
  background-color: rgba(255, 82, 82, 0.08);
  border: 1px solid rgba(255, 82, 82, 0.25);
  border-radius: 10px;
  padding: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`;

const CarteSucces = styled(motion.div)`
  background-color: rgba(76, 175, 80, 0.08);
  border: 1px solid rgba(76, 175, 80, 0.25);
  border-radius: 10px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.8rem;

  .icone {
    font-size: 2.5rem;
  }

  h4 {
    color: ${THEME.vert};
    margin: 0;
    font-size: 1.1rem;
  }

  p {
    color: ${THEME.textePrincipal};
    font-size: 0.85rem;
    margin: 0;
  }
`;

const TitreRisque = styled.div`
  color: ${THEME.rouge};
  font-weight: 700;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const DescriptionRisque = styled.p`
  color: ${THEME.textePrincipal};
  font-size: 0.85rem;
  line-height: 1.5;
  margin: 0;
`;

const GroupeBoutonsModal = styled.div`
  display: flex;
  justify-content: ${props => props.$centre ? 'center' : 'space-between'};
  align-items: center;
  margin-top: 0.5rem;
`;

const BoutonSecondaire = styled.button`
  background: transparent;
  border: 1px solid ${THEME.bordure};
  color: ${THEME.textePrincipal};
  padding: 0.6rem 1.1rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background-color: rgba(255, 255, 255, 0.08);
  }
`;

const BoutonSuivant = styled.button`
  background-color: ${THEME.accentuation};
  border: 1px solid ${THEME.accentuation};
  color: #000000;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

const BoutonSupprimerFinal = styled.button`
  background-color: ${THEME.rouge};
  border: 1px solid ${THEME.rouge};
  color: #ffffff;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background-color: #e04848;
  }

  &:disabled {
    opacity: 0.6;
    cursor: wait;
  }
`;

const BoutonTerminerSucces = styled.button`
  background-color: ${THEME.vert};
  border: 1px solid ${THEME.vert};
  color: #ffffff;
  padding: 0.65rem 1.8rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    background-color: #43a047;
  }
`;

export default function ClientsSupprimes({
  listeClientsSupprimes = [],
  restaurerClient,
  supprimerDefinitif,
  viderCorbeille,
  formaterDateFr,
  afficherNotificationProvisoire
}) {
  const [rechercheTexte, setRechercheTexte] = useState('');
  const [filtreJour, setFiltreJour] = useState('');
  const [filtreMois, setFiltreMois] = useState('');
  const [filtreAnnee, setFiltreAnnee] = useState('');
  const [filtreDateExacte, setFiltreDateExacte] = useState('');

  // 🔴 Gestion de la Modale à 4 étapes (1-3: Risques, 4: Succès UI)
  const [modalOuverte, setModalOuverte] = useState(false);
  const [etapeCourante, setEtapeCourante] = useState(1);
  const [estEnTraitement, setEstEnTraitement] = useState(false);

  const reinitialiserFiltres = () => {
    setRechercheTexte('');
    setFiltreJour('');
    setFiltreMois('');
    setFiltreAnnee('');
    setFiltreDateExacte('');
  };

  // 🔍 FILTRAGE DE LA LISTE DES CLIENTS EN CORBEILLE
  const clientsFiltres = useMemo(() => {
    return listeClientsSupprimes.filter(client => {
      if (rechercheTexte) {
        const terme = rechercheTexte.toLowerCase();
        const nomComplet = `${client.nom || ''} ${client.postNom || ''} ${client.prenom || ''} ${client.matricule || ''}`.toLowerCase();
        if (!nomComplet.includes(terme)) return false;
      }

      const rawDate = client.dateEnregistrement || client.dateEntree || client.creeLe || client.createdAt;
      if (rawDate) {
        const dateSeule = String(rawDate).replace(' ', 'T').split('T')[0];
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
  }, [listeClientsSupprimes, rechercheTexte, filtreJour, filtreMois, filtreAnnee, filtreDateExacte]);

  const ouvrirAvertissement = () => {
    setEtapeCourante(1);
    setModalOuverte(true);
  };

  const fermerAvertissement = () => {
    setModalOuverte(false);
    setEtapeCourante(1);
    setEstEnTraitement(false);
  };

  // ⚡ EXÉCUTION DU VIDAGE + PASSAGE À L'ÉCRAN DE SUCCÈS UI
  const confirmerEtVider = async () => {
    try {
      setEstEnTraitement(true);
      if (viderCorbeille) {
        await viderCorbeille();
      }
      setEstEnTraitement(false);
      setEtapeCourante(4); // Affiche l'étape Succès UI
    } catch (erreur) {
      console.error("Erreur vidage :", erreur);
      setEstEnTraitement(false);
    }
  };

  return (
    <ConteneurCorbeille>
      <BarreSuperieure>
        <TitreSection>
          🗑️ Corbeille ({listeClientsSupprimes.length} client{listeClientsSupprimes.length > 1 ? 's' : ''})
        </TitreSection>

        {viderCorbeille && (
          <BoutonViderCorbeille 
            onClick={ouvrirAvertissement}
            disabled={listeClientsSupprimes.length === 0}
          >
            Vider la corbeille
          </BoutonViderCorbeille>
        )}
      </BarreSuperieure>

      {/* Remplacement par le composant FiltreClients */}
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

      {/* TABLEAU DES CLIENTS SUPPRIMÉS */}
      <TableauClients 
        clients={clientsFiltres}
        restaurerClient={restaurerClient}
        supprimerDefinitif={supprimerDefinitif}
        formaterDateFr={formaterDateFr}
        estCorbeille={true}
      />

      {/* 🔴 INTERFACE MULTI-ÉTAPES 100% UI (SANS ALERT BROWSER) */}
      <AnimatePresence>
        {modalOuverte && (
          <OverlayModal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={estEnTraitement ? null : fermerAvertissement}
          >
            <BoiteModal
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <EnTeteModal>
                <h4>
                  {etapeCourante === 4 ? '🎉 Operation Réussie' : `⚠️ Risques - Étape ${etapeCourante}/3`}
                </h4>
                <IndicateurEtapes>
                  <PuceEtape $actif={etapeCourante >= 1} $succes={etapeCourante === 4} />
                  <PuceEtape $actif={etapeCourante >= 2} $succes={etapeCourante === 4} />
                  <PuceEtape $actif={etapeCourante >= 3} $succes={etapeCourante === 4} />
                </IndicateurEtapes>
              </EnTeteModal>

              {/* CONTENU SELON L'ÉTAPE */}
              <AnimatePresence mode="wait">
                {etapeCourante === 1 && (
                  <CarteRisque
                    key="etape1"
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                  >
                    <TitreRisque>🚨 Risque #1 : Perte définitive des données</TitreRisque>
                    <DescriptionRisque>
                      En vidant la corbeille, vous effacez définitivement <strong>{listeClientsSupprimes.length} client(s)</strong> de la base de données. 
                      Aucune restauration ne sera possible ultérieurement.
                    </DescriptionRisque>
                  </CarteRisque>
                )}

                {etapeCourante === 2 && (
                  <CarteRisque
                    key="etape2"
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                  >
                    <TitreRisque>🔗 Risque #2 : Perte de l'historique associé</TitreRisque>
                    <DescriptionRisque>
                      Toutes les transactions, contrats ou historiques de paiement liés à ces matricules clients risquent d'être définitivement rompus.
                    </DescriptionRisque>
                  </CarteRisque>
                )}

                {etapeCourante === 3 && (
                  <CarteRisque
                    key="etape3"
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                  >
                    <TitreRisque>⚡ Risque #3 : Confirmation finale requise</TitreRisque>
                    <DescriptionRisque>
                      Avez-vous bien vérifié votre liste ? Si vous êtes totalement sûr de vouloir purger définitivement la corbeille, cliquez ci-dessous.
                    </DescriptionRisque>
                  </CarteRisque>
                )}

                {/* ✅ ÉTAPE 4 : INTERFACE DE CONFIRMATION DE SUCCÈS SUR ÉCRAN */}
                {etapeCourante === 4 && (
                  <CarteSucces
                    key="etape4"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <span className="icone">✅</span>
                    <h4>Corbeille vidée avec succès !</h4>
                    <p>Tous les enregistrements en corbeille ont été définitivement supprimés de la base de données.</p>
                  </CarteSucces>
                )}
              </AnimatePresence>

              {/* NAVIGATION INTER-ÉTAPES */}
              {etapeCourante < 4 ? (
                <GroupeBoutonsModal>
                  {etapeCourante === 1 ? (
                    <BoutonSecondaire onClick={fermerAvertissement}>
                      Annuler
                    </BoutonSecondaire>
                  ) : (
                    <BoutonSecondaire onClick={() => setEtapeCourante(prev => prev - 1)}>
                      Précédent
                    </BoutonSecondaire>
                  )}

                  {etapeCourante < 3 ? (
                    <BoutonSuivant onClick={() => setEtapeCourante(prev => prev + 1)}>
                      Compris, étape suivante ➔
                    </BoutonSuivant>
                  ) : (
                    <BoutonSupprimerFinal 
                      onClick={confirmerEtVider} 
                      disabled={estEnTraitement}
                    >
                      {estEnTraitement ? 'Suppression en cours...' : "J'assume les risques, vider"}
                    </BoutonSupprimerFinal>
                  )}
                </GroupeBoutonsModal>
              ) : (
                <GroupeBoutonsModal $centre>
                  <BoutonTerminerSucces onClick={fermerAvertissement}>
                    Fermer
                  </BoutonTerminerSucces>
                </GroupeBoutonsModal>
              )}
            </BoiteModal>
          </OverlayModal>
        )}
      </AnimatePresence>
    </ConteneurCorbeille>
  );
}