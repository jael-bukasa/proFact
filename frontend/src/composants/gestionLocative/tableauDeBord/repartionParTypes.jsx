import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const THEME = {
  fondCarte: '#1E1E1E',
  accentuation: '#AEEA00',
  textePrincipal: '#FFFFFF',
  texteSecondaire: '#888888',
  bordure: '#2A2A2A',
  bleu: '#2196F3'
};

const SectionCategories = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const EnTeteSectionFlex = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
`;

const TitreSection = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${THEME.textePrincipal};
  margin: 0;
`;

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

const MessageAucuneDonnee = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  color: ${THEME.texteSecondaire};
  padding: 2rem;
  background-color: ${THEME.fondCarte};
  border: 1px solid ${THEME.bordure};
  border-radius: 12px;
  font-size: 0.9rem;
`;

export default function RepartionParTypes({ clientsFiltresGlobal = [], statsTypes, devise, tauxChangeCDF }) {
  // Calcul basé directement sur l'ensemble des données filtrées globales (sans sélecteur interne)
  const { statsParMois, totalDossiersMois } = useMemo(() => {
    let donneesCibles = clientsFiltresGlobal;

    const statsCourantes = JSON.parse(JSON.stringify(statsTypes));
    Object.keys(statsCourantes).forEach(k => {
      statsCourantes[k].count = 0;
      statsCourantes[k].montantUSD = 0;
    });

    donneesCibles.forEach((cli) => {
      let montantBrut = parseFloat(cli.montant) || 0;
      let montantEnUSD = montantBrut;
      if (cli.devise && cli.devise.toUpperCase() === 'CDF') {
        montantEnUSD = montantBrut / tauxChangeCDF;
      }

      const matriculeBrut = (cli.matricule || cli.numero || '').toUpperCase();
      const typeBrutSource = cli.typeClient || cli.typeFacture || cli.type || '';
      const typeBrut = String(typeBrutSource).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

      let typeDetecte = 'Loyers';
      if (typeBrut.includes('eau') || matriculeBrut.startsWith('EAU')) {
        typeDetecte = 'Eau';
      } else if (typeBrut.includes('elect') || typeBrut === 'elec' || matriculeBrut.startsWith('ELE')) {
        typeDetecte = 'Électricité';
      } else if (typeBrut.includes('diver') || matriculeBrut.startsWith('DIV')) {
        typeDetecte = 'Divers';
      }

      if (statsCourantes[typeDetecte]) {
        statsCourantes[typeDetecte].count += 1;
        statsCourantes[typeDetecte].montantUSD += montantEnUSD;
      } else {
        statsCourantes.Loyers.count += 1;
        statsCourantes.Loyers.montantUSD += montantEnUSD;
      }
    });

    return {
      statsParMois: statsCourantes,
      totalDossiersMois: donneesCibles.length
    };
  }, [clientsFiltresGlobal, statsTypes, tauxChangeCDF]);

  return (
    <SectionCategories
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.1 }}
      transition={{ duration: 0.4 }}
    >
      <EnTeteSectionFlex>
        <TitreSection>Répartition par Type</TitreSection>
      </EnTeteSectionFlex>

      <GrilleCategories>
        {Object.entries(statsParMois).map(([nom, data], index) => {
          const pourcentage = totalDossiersMois > 0 
            ? Math.round((data.count / totalDossiersMois) * 100) 
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

        {totalDossiersMois === 0 && (
          <MessageAucuneDonnee>
            Aucune donnée disponible.
          </MessageAucuneDonnee>
        )}
      </GrilleCategories>
    </SectionCategories>
  );
}