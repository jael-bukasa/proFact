import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const THEME = {
  fondCarte: '#1E1E1E',
  accentuation: '#AEEA00',
  textePrincipal: '#FFFFFF',
  texteSecondaire: '#888888',
  bordure: '#2A2A2A',
  survolLigne: '#262626',
  succes: '#22c55e',
  danger: '#ef4444',
  avertissement: '#eab308'
};

const ConteneurPage = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
`;

const ConteneurEnTete = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.8rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const TitrePage = styled.h1`
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 0.2rem;
  color: ${THEME.textePrincipal};

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const SousTitrePage = styled.p`
  color: ${THEME.texteSecondaire};
  font-size: 0.8rem;
`;

const GrilleStatistiques = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 0.8rem;
`;

const CarteStat = styled(motion.div)`
  background-color: ${THEME.fondCarte};
  border: 1px solid ${THEME.bordure};
  border-radius: 10px;
  padding: 0.8rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`;

const LabelStat = styled.span`
  font-size: 0.68rem;
  color: ${THEME.texteSecondaire};
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
`;

const ValeurStat = styled.span`
  font-size: 1.15rem;
  font-weight: 700;
  color: ${props => props.$couleur || THEME.textePrincipal};
`;

const PanneauFiltres = styled(motion.div)`
  background-color: ${THEME.fondCarte};
  border: 1px solid ${THEME.bordure};
  border-radius: 10px;
  padding: 0.8rem 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  align-items: flex-end;
`;

const GroupeFiltre = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  flex: 1;
  min-width: 150px;

  @media (max-width: 768px) {
    min-width: 100%;
  }
`;

const Etiquette = styled.label`
  color: ${THEME.texteSecondaire};
  font-size: 0.68rem;
  font-weight: 600;
  text-transform: uppercase;
`;

const ChampSaisie = styled.input`
  background-color: #121212;
  color: ${THEME.textePrincipal};
  border: 1px solid ${THEME.bordure};
  border-radius: 6px;
  padding: 0.45rem 0.65rem;
  font-size: 0.8rem;
  outline: none;

  &:focus {
    border-color: ${THEME.accentuation};
  }
`;

const Selecteur = styled.select`
  background-color: #121212;
  color: ${THEME.textePrincipal};
  border: 1px solid ${THEME.bordure};
  border-radius: 6px;
  padding: 0.45rem 0.65rem;
  font-size: 0.8rem;
  outline: none;

  &:focus {
    border-color: ${THEME.accentuation};
  }
`;

const ConteneurTableau = styled(motion.div)`
  background-color: ${THEME.fondCarte};
  border: 1px solid ${THEME.bordure};
  border-radius: 10px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
`;

const Tableau = styled.table`
  width: 100%;
  min-width: 700px;
  border-collapse: collapse;
  text-align: left;
`;

const EnTeteTableau = styled.thead`
  background-color: #151515;
  border-bottom: 1px solid ${THEME.bordure};
`;

const CelluleEnTete = styled.th`
  padding: 0.6rem 0.8rem;
  color: ${THEME.texteSecondaire};
  font-size: 0.68rem;
  font-weight: 600;
  text-transform: uppercase;
  white-space: nowrap;
`;

const LigneTableau = styled(motion.tr)`
  border-bottom: 1px solid ${THEME.bordure};

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: ${THEME.survolLigne};
  }
`;

const Cellule = styled.td`
  padding: 0.55rem 0.8rem;
  font-size: 0.78rem;
  color: ${THEME.textePrincipal};
  white-space: nowrap;
`;

const BadgeMatricule = styled.span`
  background-color: rgba(174, 234, 0, 0.1);
  color: ${THEME.accentuation};
  border: 1px solid rgba(174, 234, 0, 0.25);
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.72rem;
  display: inline-block;
  white-space: nowrap;
`;

const BadgeStatut = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.18rem 0.45rem;
  border-radius: 12px;
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  white-space: nowrap;
  background-color: ${props => {
    if (props.$statut === 'paye' || props.$statut === 'Payé') return 'rgba(34, 197, 94, 0.12)';
    if (props.$statut === 'retard' || props.$statut === 'Retard') return 'rgba(239, 68, 68, 0.12)';
    return 'rgba(234, 179, 8, 0.12)';
  }};
  color: ${props => {
    if (props.$statut === 'paye' || props.$statut === 'Payé') return THEME.succes;
    if (props.$statut === 'retard' || props.$statut === 'Retard') return THEME.danger;
    return THEME.avertissement;
  }};
  border: 1px solid ${props => {
    if (props.$statut === 'paye' || props.$statut === 'Payé') return 'rgba(34, 197, 94, 0.25)';
    if (props.$statut === 'retard' || props.$statut === 'Retard') return 'rgba(239, 68, 68, 0.25)';
    return 'rgba(234, 179, 8, 0.25)';
  }};
`;

const BoutonLigne = styled.button`
  background: transparent;
  border: 1px solid ${THEME.bordure};
  color: ${THEME.textePrincipal};
  padding: 0.25rem 0.55rem;
  border-radius: 5px;
  font-size: 0.7rem;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background-color: ${THEME.accentuation};
    color: #000;
    border-color: transparent;
  }
`;

const variantesAnimationScroll = {
  cache: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } }
};

export default function Paiements({ listeFactures = [], onMettreAJourPaiement }) {
  const [elementsPaiements, setElementsPaiements] = useState(listeFactures);
  const [recherche, setRecherche] = useState('');
  const [filtreStatut, setFiltreStatut] = useState('tous');

  // Synchronisation automatique si les props de facturation changent
  React.useEffect(() => {
    setElementsPaiements(listeFactures);
  }, [listeFactures]);

  const stats = useMemo(() => {
    const totalEncaisse = elementsPaiements
      .filter(p => p.statut === 'paye' || p.statut === 'Payé')
      .reduce((sum, p) => sum + (parseFloat(p.montant) || 0), 0);
      
    const enOrdre = elementsPaiements.filter(p => p.statut === 'paye' || p.statut === 'Payé').length;
    const enRetard = elementsPaiements.filter(p => p.statut === 'retard' || p.statut === 'Retard').length;
    const enAttente = elementsPaiements.filter(p => !['paye', 'Payé', 'retard', 'Retard'].includes(p.statut)).length;
    
    return { totalEncaisse, enOrdre, enRetard, enAttente };
  }, [elementsPaiements]);

  const paiementsFiltres = useMemo(() => {
    return elementsPaiements.filter(item => {
      const nomClient = item.client || item.locataire || '';
      const numMatricule = item.numero || item.matricule || '';
      const typeF = item.type || item.typeFacture || '';

      const correspondRecherche = nomClient.toLowerCase().includes(recherche.toLowerCase()) || 
                                 numMatricule.toLowerCase().includes(recherche.toLowerCase()) ||
                                 typeF.toLowerCase().includes(recherche.toLowerCase());
      
      const estPaye = item.statut === 'paye' || item.statut === 'Payé';
      const estRetard = item.statut === 'retard' || item.statut === 'Retard';
      const estAttente = !estPaye && !estRetard;

      let correspondStatut = true;
      if (filtreStatut === 'paye') correspondStatut = estPaye;
      if (filtreStatut === 'retard') correspondStatut = estRetard;
      if (filtreStatut === 'en_attente') correspondStatut = estAttente;

      return correspondRecherche && correspondStatut;
    });
  }, [elementsPaiements, recherche, filtreStatut]);

  const validerPaiementSysteme = (id) => {
    const dateActuelle = new Date().toISOString().split('T')[0];
    const nouvelleListe = elementsPaiements.map(item => {
      if (item.id === id || String(item.id) === String(id)) {
        return {
          ...item,
          statut: 'paye',
          datePaiement: dateActuelle,
          mode: 'Espèces'
        };
      }
      return item;
    });

    setElementsPaiements(nouvelleListe);
    if (onMettreAJourPaiement) {
      onMettreAJourPaiement(nouvelleListe);
    }
  };

  return (
    <ConteneurPage>

      <GrilleStatistiques>
        <CarteStat
          initial="cache"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          variants={variantesAnimationScroll}
        >
          <LabelStat>Total Encaissé</LabelStat>
          <ValeurStat $couleur={THEME.accentuation}>{stats.totalEncaisse} $</ValeurStat>
        </CarteStat>

        <CarteStat
          initial="cache"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          variants={variantesAnimationScroll}
        >
          <LabelStat>En Règle</LabelStat>
          <ValeurStat $couleur={THEME.succes}>{stats.enOrdre} / {elementsPaiements.length}</ValeurStat>
        </CarteStat>

        <CarteStat
          initial="cache"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          variants={variantesAnimationScroll}
        >
          <LabelStat>En Retard</LabelStat>
          <ValeurStat $couleur={THEME.danger}>{stats.enRetard}</ValeurStat>
        </CarteStat>

        <CarteStat
          initial="cache"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          variants={variantesAnimationScroll}
        >
          <LabelStat>En Attente</LabelStat>
          <ValeurStat $couleur={THEME.avertissement}>{stats.enAttente}</ValeurStat>
        </CarteStat>
      </GrilleStatistiques>

      <PanneauFiltres
        initial="cache"
        whileInView="visible"
        viewport={{ once: false, amount: 0.15 }}
        variants={variantesAnimationScroll}
      >
        <GroupeFiltre style={{ flex: 2 }}>
          <Etiquette>Rechercher</Etiquette>
          <ChampSaisie 
            type="text" 
            placeholder="Nom, matricule, type..." 
            value={recherche} 
            onChange={(e) => setRecherche(e.target.value)} 
          />
        </GroupeFiltre>

        <GroupeFiltre>
          <Etiquette>Statut</Etiquette>
          <Selecteur value={filtreStatut} onChange={(e) => setFiltreStatut(e.target.value)}>
            <option value="tous">Tous</option>
            <option value="paye">En ordre</option>
            <option value="retard">En retard</option>
            <option value="en_attente">En attente</option>
          </Selecteur>
        </GroupeFiltre>
      </PanneauFiltres>

      <ConteneurTableau
        initial="cache"
        whileInView="visible"
        viewport={{ once: false, amount: 0.05 }}
        variants={variantesAnimationScroll}
      >
        <Tableau>
          <EnTeteTableau>
            <tr>
              <CelluleEnTete>Matricule</CelluleEnTete>
              <CelluleEnTete>Client / Locataire</CelluleEnTete>
              <CelluleEnTete>Type</CelluleEnTete>
              <CelluleEnTete>Montant</CelluleEnTete>
              <CelluleEnTete>Statut</CelluleEnTete>
              <CelluleEnTete>Date Règlement</CelluleEnTete>
              <CelluleEnTete>Mode</CelluleEnTete>
              <CelluleEnTete style={{ textAlign: 'right' }}>Action</CelluleEnTete>
            </tr>
          </EnTeteTableau>
          <tbody>
            {paiementsFiltres.length > 0 ? (
              paiementsFiltres.map((item) => {
                const estPaye = item.statut === 'paye' || item.statut === 'Payé';
                return (
                  <LigneTableau
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.2 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                  >
                    <Cellule><BadgeMatricule>{item.numero || item.matricule}</BadgeMatricule></Cellule>
                    <Cellule style={{ fontWeight: 600 }}>{item.client || item.locataire}</Cellule>
                    <Cellule style={{ textTransform: 'capitalize' }}>{item.type || item.typeFacture}</Cellule>
                    <Cellule style={{ fontWeight: 600, color: THEME.accentuation }}>{item.montant} {item.devise || '$'}</Cellule>
                    <Cellule>
                      <BadgeStatut $statut={item.statut}>
                        {estPaye ? 'En ordre' : (item.statut === 'retard' || item.statut === 'Retard' ? 'En retard' : 'En attente')}
                      </BadgeStatut>
                    </Cellule>
                    <Cellule style={{ color: THEME.texteSecondaire }}>{item.datePaiement || '-'}</Cellule>
                    <Cellule>{item.mode || '-'}</Cellule>
                    <Cellule style={{ textAlign: 'right' }}>
                      {!estPaye ? (
                        <BoutonLigne onClick={() => validerPaiementSysteme(item.id)}>
                          Marquer Payé
                        </BoutonLigne>
                      ) : (
                        <span style={{ fontSize: '0.68rem', color: THEME.succes, fontWeight: 600 }}>✓ En ordre</span>
                      )}
                    </Cellule>
                  </LigneTableau>
                );
              })
            ) : (
              <tr>
                <Cellule colSpan="8" style={{ textAlign: 'center', color: THEME.texteSecondaire, padding: '1.5rem' }}>
                  Aucune facture ou paiement trouvé.
                </Cellule>
              </tr>
            )}
          </tbody>
        </Tableau>
      </ConteneurTableau>
    </ConteneurPage>
  );
}