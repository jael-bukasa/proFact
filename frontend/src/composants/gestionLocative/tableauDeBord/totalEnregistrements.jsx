import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const THEME = {
  fondCarte: '#1E1E1E',
  accentuation: '#AEEA00',
  textePrincipal: '#FFFFFF',
  texteSecondaire: '#888888',
  bordure: '#2A2A2A',
  bleu: '#2196F3',
  orange: '#FF9800',
  violet: '#a855f7'
};

const CarteMetrique = styled.div`
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
  height: 100%;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background-color: ${THEME.accentuation};
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

const IconeWrapper = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background-color: rgba(174, 234, 0, 0.15);
  color: ${THEME.accentuation};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
`;

const SousTexteCarte = styled.span`
  color: ${THEME.texteSecondaire};
  font-size: 0.75rem;
  text-align: center;
  margin-top: 0.2rem;
`;

const ConteneurGraphiqueCirculaire = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  margin: 0.2rem 0;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
`;

const WrapperSvg = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
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
    font-size: 1.2rem;
    font-weight: 800;
    color: ${THEME.textePrincipal};
    line-height: 1;
  }
  span.total-label {
    font-size: 0.6rem;
    color: ${THEME.texteSecondaire};
    text-transform: uppercase;
  }
`;

const LegendeCirculaire = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  width: 100%;
`;

const ElementLegende = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.72rem;
  gap: 0.4rem;

  .gauche {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    color: ${THEME.textePrincipal};
  }

  .droite {
    font-weight: 600;
    color: ${THEME.texteSecondaire};
  }
`;

const PastilleCouleur = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => props.$couleur};
  flex-shrink: 0;
`;

export default function TotalEnregistrements({ totalDossiers = 0, statsTypes = {} }) {
  const statsSecurisees = statsTypes && typeof statsTypes === 'object' && Object.keys(statsTypes).length > 0 
    ? statsTypes 
    : {
        Loyers: { count: 0, montantUSD: 0, couleur: THEME.accentuation, icon: '🏠', label: 'Loyers' },
        Eau: { count: 0, montantUSD: 0, couleur: THEME.bleu, icon: '💧', label: 'Eau' },
        Électricité: { count: 0, montantUSD: 0, couleur: THEME.orange, icon: '⚡', label: 'Électricité' },
        Divers: { count: 0, montantUSD: 0, couleur: THEME.violet, icon: '📦', label: 'Divers' }
      };

  const rayon = 38;
  const circonference = 2 * Math.PI * rayon;

  let longueurAcumulee = 0;
  const entreesStats = Object.entries(statsSecurisees);

  const donneesDonut = entreesStats.map(([nom, data]) => {
    const count = data?.count || 0;
    const pourcentage = totalDossiers > 0 ? count / totalDossiers : 0;
    const longueurTrait = pourcentage * circonference;
    const decalageTrait = -longueurAcumulee;
    
    longueurAcumulee += longueurTrait;

    return {
      nom,
      couleur: data?.couleur || THEME.accentuation,
      strokeDasharray: `${longueurTrait} ${circonference - longueurTrait}`,
      strokeDashoffset: decalageTrait
    };
  });

  return (
    <CarteMetrique>
      <EnTeteCarte>
        <TitreCarte>Total Enregistrements</TitreCarte>
        <IconeWrapper>📊</IconeWrapper>
      </EnTeteCarte>

      <ConteneurGraphiqueCirculaire>
        <WrapperSvg>
          <motion.div
            style={{ width: '100%', height: '100%' }}
            animate={{ rotate: 360 }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "linear",
              delay: 4
            }}
          >
            <svg 
              width="100" 
              height="100" 
              viewBox="0 0 100 100" 
              style={{ transform: 'rotate(-90deg)', transformOrigin: 'center', width: '100%', height: '100%' }}
            >
              <circle
                cx="50"
                cy="50"
                r={rayon}
                fill="transparent"
                stroke="rgba(255, 255, 255, 0.05)"
                strokeWidth="12"
              />
              {donneesDonut.map((item, idx) => (
                <motion.circle
                  key={item.nom || idx}
                  cx="50"
                  cy="50"
                  r={rayon}
                  fill="transparent"
                  stroke={item.couleur}
                  strokeWidth="12"
                  strokeDasharray={item.strokeDasharray}
                  initial={{ strokeDashoffset: circonference }}
                  animate={{ strokeDashoffset: item.strokeDashoffset }}
                  transition={{ duration: 1.2, delay: idx * 0.15, ease: [0.25, 1, 0.5, 1] }}
                />
              ))}
            </svg>
          </motion.div>
          <TexteCentreSvg>
            <span className="total-chiffre">{totalDossiers}</span>
            <span className="total-label">Total</span>
          </TexteCentreSvg>
        </WrapperSvg>

        <LegendeCirculaire>
          {entreesStats.map(([nom, data]) => {
            const count = data?.count || 0;
            const pourcentage = totalDossiers > 0 
              ? Math.round((count / totalDossiers) * 100) 
              : 0;

            return (
              <ElementLegende key={nom}>
                <div className="gauche">
                  <PastilleCouleur $couleur={data?.couleur || THEME.accentuation} />
                  <span>{data?.icon || '📁'} {data?.label || nom}</span>
                </div>
                <div className="droite">
                  {count} ({pourcentage}%)
                </div>
              </ElementLegende>
            );
          })}
        </LegendeCirculaire>
      </ConteneurGraphiqueCirculaire>

      <SousTexteCarte>Ventilation par type de prestation</SousTexteCarte>
    </CarteMetrique>
  );
}