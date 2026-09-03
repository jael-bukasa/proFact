import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const THEME = {
  fondCarte: '#1E1E1E',
  textePrincipal: '#FFFFFF',
  texteSecondaire: '#888888',
  bordure: '#2A2A2A',
  vert: '#22c55e'
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
    background-color: ${THEME.vert};
  }
`;

const EnTeteCarte = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TitreContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const TitreCarte = styled.span`
  color: ${THEME.texteSecondaire};
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const BadgeQuantieme = styled.span`
  font-size: 0.7rem;
  font-weight: 700;
  color: ${THEME.vert};
  background-color: rgba(34, 197, 94, 0.1);
  padding: 0.1rem 0.4rem;
  border-radius: 6px;
`;

const IconeWrapper = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background-color: rgba(34, 197, 94, 0.15);
  color: ${THEME.vert};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
`;

const EcranDefilant = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 55px;
  position: relative;
  overflow: hidden;
`;

const BlocClientInfo = styled(motion.div)`
  position: absolute;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`;

const LigneNom = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
  color: ${THEME.textePrincipal};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const LigneMoisFacture = styled.div`
  font-size: 0.8rem;
  color: ${THEME.vert};
  font-weight: 600;
  text-transform: capitalize;
`;

const AucunDossier = styled.span`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${THEME.texteSecondaire};
`;

const SousTexteCarte = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${THEME.texteSecondaire};
  font-size: 0.75rem;
`;

export default function DossiersSoldes({ totalRegle, totalDossiers, clientsSoldes = [] }) {
  const [indexActuel, setIndexActuel] = useState(0);

  useEffect(() => {
    if (clientsSoldes.length <= 1) return;

    const intervalle = setInterval(() => {
      setIndexActuel((prevIndex) => (prevIndex + 1) % clientsSoldes.length);
    }, 3000);

    return () => clearInterval(intervalle);
  }, [clientsSoldes.length]);

  // Sécurité pour éviter un index hors limites si la liste change dynamiquement
  const indexSecurise = clientsSoldes.length > 0 ? Math.min(indexActuel, clientsSoldes.length - 1) : 0;
  const clientActuel = clientsSoldes[indexSecurise];

  const obtenirMoisFacture = (client) => {
    if (!client) return '';
    const rawDate = client.creeLe || client.dateEnregistrement || client.date || client.dateComptable || client.dateEntree || client.created_at || client.createdAt;
    
    if (!rawDate) return 'Mois non spécifié';

    const dateObj = new Date(rawDate);
    if (isNaN(dateObj.getTime())) return 'Mois non spécifié';

    return dateObj.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  };

  const nombreClients = clientsSoldes.length;

  return (
    <CarteMetrique>
      <EnTeteCarte>
        <TitreContainer>
          <TitreCarte>Dossiers Soldés</TitreCarte>
          {nombreClients > 0 && (
            <BadgeQuantieme>
              {indexSecurise + 1} / {nombreClients}
            </BadgeQuantieme>
          )}
        </TitreContainer>
        <IconeWrapper>✅</IconeWrapper>
      </EnTeteCarte>

      <EcranDefilant>
        {nombreClients > 0 && clientActuel ? (
          <AnimatePresence mode="popLayout">
            <BlocClientInfo
              key={indexSecurise}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -30, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
            >
              <LigneNom>
                {clientActuel.nom} {clientActuel.postnom || clientActuel.postNom || ''}
              </LigneNom>
              <LigneMoisFacture>
                📅 Facturé en : {obtenirMoisFacture(clientActuel)}
              </LigneMoisFacture>
            </BlocClientInfo>
          </AnimatePresence>
        ) : (
          <AucunDossier>Aucun dossier soldé</AucunDossier>
        )}
      </EcranDefilant>

      <SousTexteCarte>
        <span>Paiements validés</span>
        <span style={{ fontWeight: '600', color: THEME.vert }}>
          {totalRegle} / {totalDossiers}
        </span>
      </SousTexteCarte>
    </CarteMetrique>
  );
}