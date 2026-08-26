import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const THEME = {
  fondCarte: '#1E1E1E',
  accentuation: '#AEEA00',
  textePrincipal: '#FFFFFF',
  texteSecondaire: '#888888',
  bordure: '#2A2A2A'
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

export default function TotalEnregistrements({ totalDossiers, statsTypes, donneesDonut }) {
  return (
    <CarteMetrique>
      <EnTeteCarte>
        <TitreCarte>Total Enregistrements</TitreCarte>
        <IconeWrapper>📊</IconeWrapper>
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
                animate={{ strokeDashoffset: item.strokeDashoffset }}
                transition={{ duration: 0.8, delay: idx * 0.15, ease: "easeOut" }}
              />
            ))}
          </motion.svg>
          <TexteCentreSvg>
            <span className="total-chiffre">{totalDossiers}</span>
            <span className="total-label">Total</span>
          </TexteCentreSvg>
        </WrapperSvg>

        <LegendeCirculaire>
          {Object.entries(statsTypes).map(([nom, data]) => {
            const pourcentage = totalDossiers > 0 
              ? Math.round((data.count / totalDossiers) * 100) 
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
  );
}