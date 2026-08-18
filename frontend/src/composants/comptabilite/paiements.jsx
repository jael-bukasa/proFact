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

const BoutonAction = styled.button`
  background-color: ${props => props.$variante === 'secondaire' ? 'transparent' : THEME.accentuation};
  color: ${props => props.$variante === 'secondaire' ? THEME.textePrincipal : '#000000'};
  border: ${props => props.$variante === 'secondaire' ? `1px solid ${THEME.bordure}` : 'none'};
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    width: 100%;
  }
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

const CardFormulaire = styled(motion.div)`
  background-color: ${THEME.fondCarte};
  border: 1px solid ${THEME.bordure};
  border-radius: 10px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const TitreFormulaire = styled.h2`
  font-size: 0.95rem;
  font-weight: 600;
  color: ${THEME.accentuation};
`;

const GrilleChamps = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 0.8rem;
`;

const GroupeChamp = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
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

const ZoneActionsFormulaire = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.6rem;
  margin-top: 0.5rem;

  @media (max-width: 768px) {
    flex-direction: column-reverse;
  }
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
    if (props.$statut === 'paye') return 'rgba(34, 197, 94, 0.12)';
    if (props.$statut === 'retard') return 'rgba(239, 68, 68, 0.12)';
    return 'rgba(234, 179, 8, 0.12)';
  }};
  color: ${props => {
    if (props.$statut === 'paye') return THEME.succes;
    if (props.$statut === 'retard') return THEME.danger;
    return THEME.avertissement;
  }};
  border: 1px solid ${props => {
    if (props.$statut === 'paye') return 'rgba(34, 197, 94, 0.25)';
    if (props.$statut === 'retard') return 'rgba(239, 68, 68, 0.25)';
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

const DONNEES_PAIEMENTS = [
  { id: 1, matricule: 'LOC-2026-001', nom: 'Kabange Mukendi', logement: 'Appartement A1', loyer: 250, mois: 'Août 2026', statut: 'paye', datePaiement: '2026-08-02', mode: 'Espèces' },
  { id: 2, matricule: 'LOC-2026-002', nom: 'Ilunga Tshilombo', logement: 'Studio B3', loyer: 180, mois: 'Août 2026', statut: 'paye', datePaiement: '2026-08-05', mode: 'Virement' },
  { id: 3, matricule: 'LOC-2026-003', nom: 'Mbuyi Kalonji', logement: 'Appartement C2', loyer: 300, mois: 'Août 2026', statut: 'retard', datePaiement: '-', mode: '-' },
  { id: 4, matricule: 'LOC-2026-004', nom: 'Kasongo Mwamba', logement: 'Maison M01', loyer: 450, mois: 'Août 2026', statut: 'en_attente', datePaiement: '-', mode: '-' },
  { id: 5, matricule: 'LOC-2026-005', nom: 'Ngalula Kamba', logement: 'Studio B1', loyer: 180, mois: 'Août 2026', statut: 'paye', datePaiement: '2026-08-01', mode: 'Mobile Money' },
  { id: 6, matricule: 'LOC-2026-006', nom: 'Banza Kipopo', logement: 'Appartement A2', loyer: 250, mois: 'Août 2026', statut: 'retard', datePaiement: '-', mode: '-' }
];

const variantesAnimationScroll = {
  cache: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } }
};

export default function Paiements() {
  const [listePaiements, setListePaiements] = useState(DONNEES_PAIEMENTS);
  const [afficherFormulaire, setAfficherFormulaire] = useState(false);
  
  const [recherche, setRecherche] = useState('');
  const [filtreStatut, setFiltreStatut] = useState('tous');

  const [formulaire, setFormulaire] = useState({
    locataireId: '',
    montant: '',
    mode: 'Virement',
    datePaiement: new Date().toISOString().split('T')[0]
  });

  const stats = useMemo(() => {
    const totalEncaisse = listePaiements.filter(p => p.statut === 'paye').reduce((sum, p) => sum + p.loyer, 0);
    const enOrdre = listePaiements.filter(p => p.statut === 'paye').length;
    const enRetard = listePaiements.filter(p => p.statut === 'retard').length;
    const enAttente = listePaiements.filter(p => p.statut === 'en_attente').length;
    return { totalEncaisse, enOrdre, enRetard, enAttente };
  }, [listePaiements]);

  const paiementsFiltres = useMemo(() => {
    return listePaiements.filter(item => {
      const correspondRecherche = item.nom.toLowerCase().includes(recherche.toLowerCase()) || 
                                   item.matricule.toLowerCase().includes(recherche.toLowerCase()) ||
                                   item.logement.toLowerCase().includes(recherche.toLowerCase());
      
      const correspondStatut = filtreStatut === 'tous' || item.statut === filtreStatut;

      return correspondRecherche && correspondStatut;
    });
  }, [listePaiements, recherche, filtreStatut]);

  const validerPaiementSysteme = (id) => {
    setListePaiements(prev => prev.map(item => {
      if (item.id === Number(id) || item.id === id) {
        return {
          ...item,
          statut: 'paye',
          datePaiement: formulaire.datePaiement || new Date().toISOString().split('T')[0],
          mode: formulaire.mode || 'Espèces'
        };
      }
      return item;
    }));
  };

  const soumettreFormulaire = (e) => {
    e.preventDefault();
    if (!formulaire.locataireId) return;
    validerPaiementSysteme(formulaire.locataireId);
    setAfficherFormulaire(false);
    setFormulaire({ locataireId: '', montant: '', mode: 'Virement', datePaiement: new Date().toISOString().split('T')[0] });
  };

  return (
    <ConteneurPage>
      <ConteneurEnTete>
        <div>
          <TitrePage>Paiements & Loyers</TitrePage>
          <SousTitrePage>Suivi du statut financier des locataires inscrits</SousTitrePage>
        </div>
        {!afficherFormulaire && (
          <BoutonAction onClick={() => setAfficherFormulaire(true)}>
            + Enregistrer un paiement
          </BoutonAction>
        )}
      </ConteneurEnTete>

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
          <LabelStat>Locataires en Règle</LabelStat>
          <ValeurStat $couleur={THEME.succes}>{stats.enOrdre} / {listePaiements.length}</ValeurStat>
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

      {afficherFormulaire && (
        <CardFormulaire
          initial="cache"
          whileInView="visible"
          viewport={{ once: false, amount: 0.15 }}
          variants={variantesAnimationScroll}
        >
          <TitreFormulaire>Enregistrer un règlement</TitreFormulaire>
          <form onSubmit={soumettreFormulaire}>
            <GrilleChamps>
              <GroupeChamp>
                <Etiquette>Locataire</Etiquette>
                <Selecteur 
                  value={formulaire.locataireId} 
                  onChange={(e) => {
                    const loc = listePaiements.find(p => p.id === Number(e.target.value));
                    setFormulaire({ 
                      ...formulaire, 
                      locataireId: e.target.value,
                      montant: loc ? loc.loyer : ''
                    });
                  }}
                  required
                >
                  <option value="">-- Sélectionner --</option>
                  {listePaiements.filter(p => p.statut !== 'paye').map(p => (
                    <option key={p.id} value={p.id}>
                      {p.nom} ({p.logement})
                    </option>
                  ))}
                </Selecteur>
              </GroupeChamp>

              <GroupeChamp>
                <Etiquette>Montant ($)</Etiquette>
                <ChampSaisie 
                  type="number" 
                  value={formulaire.montant} 
                  onChange={(e) => setFormulaire({ ...formulaire, montant: e.target.value })}
                  required
                />
              </GroupeChamp>

              <GroupeChamp>
                <Etiquette>Mode</Etiquette>
                <Selecteur 
                  value={formulaire.mode} 
                  onChange={(e) => setFormulaire({ ...formulaire, mode: e.target.value })}
                >
                  <option value="Virement">Virement bancaire</option>
                  <option value="Espèces">Espèces</option>
                  <option value="Mobile Money">Mobile Money</option>
                  <option value="Chèque">Chèque</option>
                </Selecteur>
              </GroupeChamp>

              <GroupeChamp>
                <Etiquette>Date</Etiquette>
                <ChampSaisie 
                  type="date" 
                  value={formulaire.datePaiement} 
                  onChange={(e) => setFormulaire({ ...formulaire, datePaiement: e.target.value })}
                  required
                />
              </GroupeChamp>
            </GrilleChamps>

            <ZoneActionsFormulaire>
              <BoutonAction type="button" $variante="secondaire" onClick={() => setAfficherFormulaire(false)}>
                Annuler
              </BoutonAction>
              <BoutonAction type="submit">
                Confirmer
              </BoutonAction>
            </ZoneActionsFormulaire>
          </form>
        </CardFormulaire>
      )}

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
            placeholder="Nom, matricule, logement..." 
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
              <CelluleEnTete>Nom</CelluleEnTete>
              <CelluleEnTete>Logement</CelluleEnTete>
              <CelluleEnTete>Loyer</CelluleEnTete>
              <CelluleEnTete>Statut</CelluleEnTete>
              <CelluleEnTete>Date Règlement</CelluleEnTete>
              <CelluleEnTete>Mode</CelluleEnTete>
              <CelluleEnTete style={{ textAlign: 'right' }}>Action</CelluleEnTete>
            </tr>
          </EnTeteTableau>
          <tbody>
            {paiementsFiltres.length > 0 ? (
              paiementsFiltres.map((item) => (
                <LigneTableau
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                >
                  <Cellule><BadgeMatricule>{item.matricule}</BadgeMatricule></Cellule>
                  <Cellule style={{ fontWeight: 600 }}>{item.nom}</Cellule>
                  <Cellule>{item.logement}</Cellule>
                  <Cellule style={{ fontWeight: 600, color: THEME.accentuation }}>{item.loyer} $</Cellule>
                  <Cellule>
                    <BadgeStatut $statut={item.statut}>
                      {item.statut === 'paye' && 'En ordre'}
                      {item.statut === 'retard' && 'En retard'}
                      {item.statut === 'en_attente' && 'En attente'}
                    </BadgeStatut>
                  </Cellule>
                  <Cellule style={{ color: THEME.texteSecondaire }}>{item.datePaiement}</Cellule>
                  <Cellule>{item.mode}</Cellule>
                  <Cellule style={{ textAlign: 'right' }}>
                    {item.statut !== 'paye' ? (
                      <BoutonLigne onClick={() => validerPaiementSysteme(item.id)}>
                        Marquer Payé
                      </BoutonLigne>
                    ) : (
                      <span style={{ fontSize: '0.68rem', color: THEME.succes, fontWeight: 600 }}>✓ En ordre</span>
                    )}
                  </Cellule>
                </LigneTableau>
              ))
            ) : (
              <tr>
                <Cellule colSpan="8" style={{ textAlign: 'center', color: THEME.texteSecondaire, padding: '1.5rem' }}>
                  Aucun locataire trouvé.
                </Cellule>
              </tr>
            )}
          </tbody>
        </Tableau>
      </ConteneurTableau>
    </ConteneurPage>
  );
}