import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const THEME = {
  fondCarte: '#1E1E1E',
  accentuation: '#AEEA00', // Loyers / Vert citron
  textePrincipal: '#FFFFFF',
  texteSecondaire: '#888888',
  bordure: '#2A2A2A',
  survol: '#262626',
  orange: '#FF9800',       // Électricité
  bleu: '#2196F3',         // Eau
  vert: '#22c55e',         // Dossiers Soldés / Succès
  violet: '#a855f7'        // Divers
};

const ConteneurSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
`;

const ConteneurEnTete = styled(motion.header)`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
`;

const SelecteurMois = styled(motion.div)`
  background-color: ${THEME.fondCarte};
  color: ${THEME.textePrincipal};
  border: 1px solid ${THEME.bordure};
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  text-transform: capitalize;
  cursor: pointer;
`;

const GrilleMetriques = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.2rem;
  width: 100%;
`;

const CarteMetrique = styled(motion.div)`
  background-color: ${THEME.fondCarte};
  border-radius: 12px;
  padding: 1.2rem;
  border: 1px solid ${THEME.bordure};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 0.8rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background-color: ${props => props.$couleurBordure || THEME.accentuation};
  }
`;

const EnTeteCarte = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TitreCarte = styled.span`
  color: ${THEME.texteSecondaire};
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const SelecteurDevise = styled(motion.button)`
  background-color: rgba(255, 255, 255, 0.08);
  color: ${THEME.textePrincipal};
  border: 1px solid ${THEME.bordure};
  padding: 0.25rem 0.6rem;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.3rem;

  &:hover {
    background-color: rgba(255, 255, 255, 0.15);
  }
`;

const IconeWrapper = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background-color: ${props => props.$bg || 'rgba(174, 234, 0, 0.1)'};
  color: ${props => props.$couleur || THEME.accentuation};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
`;

const ValeurCarte = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  color: ${THEME.textePrincipal};
  margin: 0;
`;

const SousTexteCarte = styled.span`
  color: ${THEME.texteSecondaire};
  font-size: 0.75rem;
`;

const ConteneurGraphiqueCirculaire = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin: 0.5rem 0;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
`;

const WrapperSvg = styled.div`
  position: relative;
  width: 110px;
  height: 110px;
  flex-shrink: 0;
`;

const TexteCentreSvg = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  
  span.total-chiffre {
    font-size: 1.3rem;
    font-weight: 800;
    color: ${THEME.textePrincipal};
    line-height: 1;
  }
  span.total-label {
    font-size: 0.65rem;
    color: ${THEME.texteSecondaire};
    text-transform: uppercase;
  }
`;

const LegendeCirculaire = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  width: 100%;
`;

const ElementLegende = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.75rem;
  gap: 0.5rem;

  .gauche {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    color: ${THEME.textePrincipal};
  }

  .droite {
    font-weight: 600;
    color: ${THEME.texteSecondaire};
  }
`;

const PastilleCouleur = styled.span`
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background-color: ${props => props.$couleur};
  flex-shrink: 0;
`;

const SectionCategories = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const TitreSection = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${THEME.textePrincipal};
`;

/* CORRECTION : Forcé à 2 colonnes par ligne sur les grands écrans */
const GrilleCategories = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CarteCategorie = styled(motion.div)`
  background-color: ${THEME.fondCarte};
  border: 1px solid ${THEME.bordure};
  border-radius: 12px;
  padding: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  transition: border-color 0.2s;

  &:hover {
    border-color: ${props => props.$couleur || THEME.accentuation};
  }
`;

const LigneCategorieEnTete = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NomCategorie = styled.span`
  font-weight: 600;
  font-size: 0.95rem;
  color: ${THEME.textePrincipal};
`;

const BadgeNombre = styled.span`
  background-color: rgba(255, 255, 255, 0.08);
  color: ${THEME.textePrincipal};
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.25rem 0.7rem;
  border-radius: 20px;
`;

const BarreProgressionConteneur = styled.div`
  width: 100%;
  height: 6px;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 3px;
  overflow: hidden;
`;

const BarreProgressionRemplissage = styled(motion.div)`
  height: 100%;
  background-color: ${props => props.$couleur || THEME.accentuation};
  border-radius: 3px;
`;

const BlocVolumeCategorie = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 0.2rem;

  .label-volume {
    font-size: 0.75rem;
    color: ${THEME.texteSecondaire};
    text-transform: uppercase;
    font-weight: 600;
    line-height: 1.2;
  }

  .pourcentage-volume {
    font-size: 0.75rem;
    color: ${THEME.texteSecondaire};
    text-align: right;
    line-height: 1.2;
    font-weight: 600;
  }

  .montant-volume {
    font-size: 1.25rem;
    font-weight: 800;
    color: ${THEME.textePrincipal};
    margin-top: 0.1rem;
    letter-spacing: -0.5px;
  }
`;

const obtenirMoisCourant = () => {
  const date = new Date();
  const moisAnnee = date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  return moisAnnee.charAt(0).toUpperCase() + moisAnnee.slice(1);
};

export default function TableauDeBord({ clientsEnregistres = [] }) {
  const [moisSelectionne] = useState(obtenirMoisCourant());
  const [devise, setDevise] = useState('USD');
  const tauxChangeCDF = 2800;

  const basculerDevise = () => {
    setDevise(prev => (prev === 'USD' ? 'CDF' : 'USD'));
  };

  const statistiques = useMemo(() => {
    const totalDossiers = clientsEnregistres.length;
    let montantTotalGlobalUSD = 0;
    let totalRegle = 0;

    const statsTypes = {
      Loyers: { count: 0, montantUSD: 0, couleur: THEME.accentuation, icon: '🏠', label: 'Loyers' },
      Eau: { count: 0, montantUSD: 0, couleur: THEME.bleu, icon: '💧', label: 'Eau' },
      Électricité: { count: 0, montantUSD: 0, couleur: THEME.orange, icon: '⚡', label: 'Électricité' },
      Divers: { count: 0, montantUSD: 0, couleur: THEME.violet, icon: '📦', label: 'Divers' }
    };

    clientsEnregistres.forEach((cli) => {
      let montantBrut = parseFloat(cli.montant) || 0;
      let montantEnUSD = montantBrut;
      if (cli.devise && cli.devise.toUpperCase() === 'CDF') {
        montantEnUSD = montantBrut / tauxChangeCDF;
      }

      montantTotalGlobalUSD += montantEnUSD;

      const estPaye = Boolean(cli.modePaiement && cli.modePaiement !== '-' && cli.modePaiement !== '');
      if (estPaye) totalRegle++;

      const matriculeBrut = (cli.matricule || cli.numero || '').toUpperCase();
      let typeDetecte = (cli.type || cli.typeFacture || '').toLowerCase();

      if (!typeDetecte || typeDetecte === 'locataire') {
        if (matriculeBrut.startsWith('DIV')) typeDetecte = 'Divers';
        else if (matriculeBrut.startsWith('EAU')) typeDetecte = 'Eau';
        else if (matriculeBrut.startsWith('ELE') || matriculeBrut.startsWith('ELEC')) typeDetecte = 'Électricité';
        else typeDetecte = 'Loyers';
      } else {
        if (typeDetecte.includes('eau')) typeDetecte = 'Eau';
        else if (typeDetecte.includes('elect')) typeDetecte = 'Électricité';
        else if (typeDetecte.includes('diver')) typeDetecte = 'Divers';
        else typeDetecte = 'Loyers';
      }

      if (statsTypes[typeDetecte]) {
        statsTypes[typeDetecte].count += 1;
        statsTypes[typeDetecte].montantUSD += montantEnUSD;
      } else {
        statsTypes.Loyers.count += 1;
        statsTypes.Loyers.montantUSD += montantEnUSD;
      }
    });

    return {
      totalDossiers,
      montantTotalGlobalUSD,
      totalRegle,
      statsTypes
    };
  }, [clientsEnregistres, tauxChangeCDF]);

  const donneesDonut = useMemo(() => {
    const total = statistiques.totalDossiers;
    if (total === 0) return [];

    let angleCumule = 0;
    const rayon = 40;
    const circonference = 2 * Math.PI * rayon;

    return Object.entries(statistiques.statsTypes).map(([nom, data]) => {
      const pourcentage = (data.count / total);
      const longueurTrait = pourcentage * circonference;
      const decalage = -angleCumule;
      angleCumule += longueurTrait;

      return {
        nom,
        ...data,
        pourcentageArrondi: Math.round(pourcentage * 100),
        strokeDasharray: `${longueurTrait} ${circonference - longueurTrait}`,
        strokeDashoffset: decalage
      };
    });
  }, [statistiques]);

  const volumeFinancierAffiche = devise === 'USD' 
    ? statistiques.montantTotalGlobalUSD 
    : statistiques.montantTotalGlobalUSD * tauxChangeCDF;

  return (
    <ConteneurSection>
      
      {/* En-tête */}
      <ConteneurEnTete
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.4 }}
      >
        <SelecteurMois
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
        >
          📅 Période : {moisSelectionne}
        </SelecteurMois>
      </ConteneurEnTete>

      {/* Cartes de Synthèse Principales */}
      <GrilleMetriques>
        
        {/* Total Enregistrements (Donut Chart animé) */}
        <CarteMetrique 
          $couleurBordure={THEME.accentuation}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          whileHover={{ scale: 1.02, y: -4 }}
          whileTap={{ scale: 0.98 }}
        >
          <EnTeteCarte>
            <TitreCarte>Total Enregistrements</TitreCarte>
            <IconeWrapper $bg="rgba(174, 234, 0, 0.15)" $couleur={THEME.accentuation}>📊</IconeWrapper>
          </EnTeteCarte>

          <ConteneurGraphiqueCirculaire>
            <WrapperSvg>
              <motion.svg 
                width="110" 
                height="110" 
                viewBox="0 0 100 100" 
                style={{ transformOrigin: 'center' }}
                animate={{ rotate: [0, 360] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  repeatDelay: 2
                }}
              >
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="rgba(255, 255, 255, 0.05)"
                  strokeWidth="14"
                />
                {donneesDonut.map((item, idx) => (
                  <motion.circle
                    key={item.nom}
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke={item.couleur}
                    strokeWidth="14"
                    strokeDasharray={item.strokeDasharray}
                    initial={{ strokeDashoffset: 251.32 }}
                    whileInView={{ strokeDashoffset: item.strokeDashoffset }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.8, delay: idx * 0.15, ease: "easeOut" }}
                  />
                ))}
              </motion.svg>
              <TexteCentreSvg>
                <span className="total-chiffre">{statistiques.totalDossiers}</span>
                <span className="total-label">Total</span>
              </TexteCentreSvg>
            </WrapperSvg>

            <LegendeCirculaire>
              {Object.entries(statistiques.statsTypes).map(([nom, data]) => {
                const pourcentage = statistiques.totalDossiers > 0 
                  ? Math.round((data.count / statistiques.totalDossiers) * 100) 
                  : 0;

                return (
                  <ElementLegende key={nom}>
                    <div className="gauche">
                      <PastilleCouleur $couleur={data.couleur} />
                      <span>{data.icon} {nom}</span>
                    </div>
                    <div className="droite">
                      {data.count} ({pourcentage}%)
                    </div>
                  </ElementLegende>
                );
              })}
            </LegendeCirculaire>
          </ConteneurGraphiqueCirculaire>

          <SousTexteCarte>Ventilation par type de prestation</SousTexteCarte>
        </CarteMetrique>

        {/* Volume Financier Global avec sélecteur de devise interactif */}
        <CarteMetrique 
          $couleurBordure={THEME.orange}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          whileHover={{ scale: 1.02, y: -4 }}
          whileTap={{ scale: 0.98 }}
        >
          <EnTeteCarte>
            <TitreCarte>Volume Financier Global</TitreCarte>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <SelecteurDevise 
                onClick={basculerDevise}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Cliquer pour changer de devise"
              >
                💱 {devise}
              </SelecteurDevise>
              <IconeWrapper $bg="rgba(255, 152, 0, 0.15)" $couleur={THEME.orange}>💰</IconeWrapper>
            </div>
          </EnTeteCarte>
          <ValeurCarte>
            {volumeFinancierAffiche.toLocaleString(undefined, { maximumFractionDigits: 2 })} {devise}
          </ValeurCarte>
          <SousTexteCarte>
            {devise === 'CDF' ? 'Converti en Franc Congolais' : 'Somme totale des montants'}
          </SousTexteCarte>
        </CarteMetrique>

        {/* Dossiers Soldés */}
        <CarteMetrique 
          $couleurBordure={THEME.vert}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          whileHover={{ scale: 1.02, y: -4 }}
          whileTap={{ scale: 0.98 }}
        >
          <EnTeteCarte>
            <TitreCarte>Dossiers Soldés</TitreCarte>
            <IconeWrapper $bg="rgba(34, 197, 94, 0.15)" $couleur={THEME.vert}>✅</IconeWrapper>
          </EnTeteCarte>
          <ValeurCarte>{statistiques.totalRegle} / {statistiques.totalDossiers}</ValeurCarte>
          <SousTexteCarte>Paiements validés</SousTexteCarte>
        </CarteMetrique>
      </GrilleMetriques>

      {/* Répartition par Catégorie (Disposition fixe de 2 cartes par ligne) */}
      <SectionCategories
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.1 }}
        transition={{ duration: 0.4 }}
      >
        <TitreSection>Répartition par Type de Prestation</TitreSection>
        <GrilleCategories>
          {Object.entries(statistiques.statsTypes).map(([nom, data], index) => {
            const pourcentage = statistiques.totalDossiers > 0 
              ? Math.round((data.count / statistiques.totalDossiers) * 100) 
              : 0;
            
            const montantCategorieAffiche = devise === 'USD' 
              ? data.montantUSD 
              : data.montantUSD * tauxChangeCDF;

            return (
              <CarteCategorie 
                key={nom} 
                $couleur={data.couleur}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -3 }}
                whileTap={{ scale: 0.98 }}
              >
                <LigneCategorieEnTete>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.2rem' }}>{data.icon}</span>
                    <NomCategorie>{nom}</NomCategorie>
                  </div>
                  <BadgeNombre>{data.count} client{data.count > 1 ? 's' : ''}</BadgeNombre>
                </LigneCategorieEnTete>

                <BarreProgressionConteneur>
                  <BarreProgressionRemplissage 
                    $couleur={data.couleur}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${pourcentage}%` }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </BarreProgressionConteneur>

                <BlocVolumeCategorie>
                  <div>
                    <div className="label-volume">Volume :</div>
                    <div className="montant-volume">
                      {montantCategorieAffiche.toLocaleString(undefined, { maximumFractionDigits: 0 })} {devise}
                    </div>
                  </div>
                  <div className="pourcentage-volume">
                    {pourcentage}% du<br />total
                  </div>
                </BlocVolumeCategorie>
              </CarteCategorie>
            );
          })}
        </GrilleCategories>
      </SectionCategories>

    </ConteneurSection>
  );
}