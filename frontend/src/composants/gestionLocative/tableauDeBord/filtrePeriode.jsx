import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiCalendar, FiChevronDown } from 'react-icons/fi';

const THEME = {
  fondCarte: '#1E1E1E',
  fondPopup: '#252525',
  textePrincipal: '#FFFFFF',
  texteSecondaire: '#888888',
  bordure: '#2A2A2A',
  accentuation: '#AEEA00',
};

const ConteneurFiltre = styled.div`
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  background-color: ${THEME.fondCarte};
  border: 1px solid ${THEME.bordure};
  padding: 0.6rem 1.2rem;
  border-radius: 12px;
  width: fit-content;

  @media (max-width: 500px) {
    width: 100%;
    justify-content: space-between;
  }
`;

const GroupeNavigation = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const BoutonNav = styled(motion.button)`
  background: transparent;
  border: none;
  color: ${THEME.texteSecondaire};
  cursor: pointer;
  padding: 0.4rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: ${THEME.textePrincipal};
  }
`;

const BoutonAffichagePeriode = styled(motion.button)`
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: ${THEME.textePrincipal};
  font-weight: 600;
  font-size: 0.95rem;
  text-transform: capitalize;
  cursor: pointer;
  padding: 0.2rem 0.5rem;
  border-radius: 6px;

  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }

  svg.icone-calendar {
    color: ${THEME.accentuation};
    font-size: 1.1rem;
  }

  svg.icone-arrow {
    font-size: 0.9rem;
    color: ${THEME.texteSecondaire};
  }
`;

const BoutonAujourdhui = styled(motion.button)`
  background-color: rgba(174, 234, 0, 0.1);
  color: ${THEME.accentuation};
  border: 1px solid rgba(174, 234, 0, 0.3);
  padding: 0.3rem 0.8rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: rgba(174, 234, 0, 0.2);
  }

  &:disabled {
    opacity: 0.4;
    cursor: default;
    background-color: transparent;
    border-color: ${THEME.bordure};
    color: ${THEME.texteSecondaire};
  }
`;

const MenuPopup = styled(motion.div)`
  position: absolute;
  top: 115%;
  left: 0;
  background-color: ${THEME.fondPopup};
  border: 1px solid ${THEME.bordure};
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
  z-index: 100;
  width: 280px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const EnTetePopup = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 700;
  font-size: 0.9rem;
  color: ${THEME.textePrincipal};
  border-bottom: 1px solid ${THEME.bordure};
  padding-bottom: 0.6rem;

  .annee-selecteur {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(255, 255, 255, 0.05);
    padding: 0.2rem 0.5rem;
    border-radius: 6px;
    border: 1px solid ${THEME.bordure};
    
    button {
      background: none;
      border: none;
      color: ${THEME.accentuation};
      cursor: pointer;
      font-weight: bold;
      font-size: 1rem;
      padding: 0 0.4rem;

      &:hover {
        opacity: 0.8;
      }
    }
    span {
      font-size: 0.9rem;
      min-width: 45px;
      text-align: center;
      color: ${THEME.accentuation};
      font-weight: 700;
    }
  }
`;

const GrilleMois = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
`;

const BoutonMois = styled.button`
  background: ${props => props.$actif ? 'rgba(174, 234, 0, 0.15)' : 'rgba(255, 255, 255, 0.03)'};
  border: 1px solid ${props => props.$actif ? THEME.accentuation : THEME.bordure};
  color: ${props => props.$actif ? THEME.accentuation : THEME.textePrincipal};
  padding: 0.5rem 0.2rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: ${props => props.$actif ? '700' : '400'};
  text-transform: capitalize;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(174, 234, 0, 0.1);
    border-color: ${THEME.accentuation};
  }
`;

export default function FiltrePeriode({ dateActuelle, onChangerMois, onChangerDateExacte, onReinitialiser }) {
  const [estOuvert, EstOuvertSet] = useState(false);
  const popupRef = useRef(null);

  const moisNoms = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const formaterDate = (date) => {
    return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  };

  const estMoisActuel = () => {
    const maintenant = new Date();
    return (
      dateActuelle.getMonth() === maintenant.getMonth() &&
      dateActuelle.getFullYear() === maintenant.getFullYear()
    );
  };

  // Fermer le popup si on clique en dehors
  useEffect(() => {
    const gererClicExterieur = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        EstOuvertSet(false);
      }
    };
    document.addEventListener('mousedown', gererClicExterieur);
    return () => document.removeEventListener('mousedown', gererClicExterieur);
  }, []);

  // Modification directe et sécurisée de l'année
  const modifierAnnee = (e, delta) => {
    e.stopPropagation();
    const nouvelleDate = new Date(dateActuelle);
    nouvelleDate.setFullYear(dateActuelle.getFullYear() + delta);
    onChangerDateExacte(nouvelleDate);
  };

  // Sélection directe d'un mois dans la grille
  const selectionnerMoisIndex = (indexMois) => {
    const nouvelleDate = new Date(dateActuelle);
    nouvelleDate.setMonth(indexMois);
    onChangerDateExacte(nouvelleDate);
    EstOuvertSet(false);
  };

  return (
    <ConteneurFiltre ref={popupRef}>
      
      {/* Bouton principal cliquable */}
      <BoutonAffichagePeriode 
        onClick={() => EstOuvertSet(prev => !prev)}
        whileTap={{ scale: 0.97 }}
      >
        <FiCalendar className="icone-calendar" />
        <span>{formaterDate(dateActuelle)}</span>
        <FiChevronDown className="icone-arrow" />
      </BoutonAffichagePeriode>

      {/* Menu Popup */}
      <AnimatePresence>
        {estOuvert && (
          <MenuPopup
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <EnTetePopup>
              <span>Année</span>
              <div className="annee-selecteur">
                <button 
                  type="button" 
                  onClick={(e) => modifierAnnee(e, -1)}
                >
                  -
                </button>
                <span>{dateActuelle.getFullYear()}</span>
                <button 
                  type="button" 
                  onClick={(e) => modifierAnnee(e, 1)}
                >
                  +
                </button>
              </div>
            </EnTetePopup>

            <GrilleMois>
              {moisNoms.map((nomMois, index) => {
                const estActif = dateActuelle.getMonth() === index;
                return (
                  <BoutonMois
                    key={nomMois}
                    $actif={estActif}
                    onClick={() => selectionnerMoisIndex(index)}
                  >
                    {nomMois.slice(0, 3)}
                  </BoutonMois>
                );
              })}
            </GrilleMois>
          </MenuPopup>
        )}
      </AnimatePresence>

      <GroupeNavigation>
        <BoutonNav 
          onClick={() => onChangerMois(-1)}
          whileTap={{ scale: 0.9 }}
          title="Mois précédent"
        >
          <FiChevronLeft />
        </BoutonNav>
        
        <BoutonAujourdhui
          onClick={onReinitialiser}
          disabled={estMoisActuel()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Actuel
        </BoutonAujourdhui>

        <BoutonNav 
          onClick={() => onChangerMois(1)}
          whileTap={{ scale: 0.9 }}
          title="Mois suivant"
        >
          <FiChevronRight />
        </BoutonNav>
      </GroupeNavigation>

    </ConteneurFiltre>
  );
}