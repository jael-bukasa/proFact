import React, { useState, useEffect, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';
import RepertoireAccesEtRoles from './gererComptes/repertoireAccesEtRoles';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

const ConteneurGestion = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Inter', system-ui, sans-serif;
  color: #FFFFFF;
  background-color: #000000;
  min-height: 100vh;
`;

const EntetePage = styled.div`
  margin-bottom: 0.5rem;

  h2 {
    font-size: 1.6rem;
    font-weight: 700;
    color: #FFFFFF;
    margin: 0 0 0.3rem 0;
    letter-spacing: -0.02em;
  }

  p {
    font-size: 0.85rem;
    color: #888888;
    margin: 0;
  }
`;

const GrilleStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
  animation: ${fadeIn} 0.3s ease-out;
`;

const CarteStatistique = styled.div`
  background: #121212;
  border: 1px solid #2A2A2A;
  border-radius: 12px;
  padding: 1.25rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background-color: #AEEA00;
  }

  .contenu-stat {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;

    span.titre {
      font-size: 0.75rem;
      font-weight: 600;
      color: #888888;
      letter-spacing: 0.05em;
    }

    span.valeur {
      font-size: 1.8rem;
      font-weight: 700;
      color: #FFFFFF;
    }
  }

  .conteneur-icone {
    background: rgba(174, 234, 0, 0.1);
    border: 1px solid rgba(174, 234, 0, 0.2);
    border-radius: 10px;
    padding: 0.6rem 0.8rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
  }
`;

const GrilleConfiguration = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.25rem;
  animation: ${fadeIn} 0.3s ease-out;
`;

const CarteQuota = styled.div`
  background: #121212;
  border: 1px solid #2A2A2A;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1.25rem;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: #444444;
  }
`;

const InfoConfiguration = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  h3 {
    font-size: 1rem;
    font-weight: 600;
    color: #FFFFFF;
    margin: 0;
  }

  p {
    font-size: 0.8rem;
    color: #888888;
    margin: 0;
    line-height: 1.4;
  }
`;

const FormulaireLimite = styled.form`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: auto;
`;

const ChampNombre = styled.input`
  background: #1a1a1a;
  border: 1px solid #333333;
  color: #FFFFFF;
  padding: 0.65rem 0.8rem;
  border-radius: 8px;
  font-size: 0.9rem;
  width: 80px;
  text-align: center;
  font-weight: 600;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #AEEA00;
    box-shadow: 0 0 0 3px rgba(174, 234, 0, 0.12);
  }
`;

const BoutonEnregistrer = styled.button`
  background-color: #AEEA00;
  color: #000000;
  border: none;
  border-radius: 8px;
  padding: 0.65rem 1.1rem;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;

  &:hover {
    background-color: #b8f500;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(174, 234, 0, 0.2);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const NotificationToast = styled.div`
  background: ${props => props.$type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(174, 234, 0, 0.1)'};
  border: 1px solid ${props => props.$type === 'error' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(174, 234, 0, 0.3)'};
  color: ${props => props.$type === 'error' ? '#ef4444' : '#AEEA00'};
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: space-between;
  animation: ${fadeIn} 0.2s ease;

  button {
    background: none;
    border: none;
    color: inherit;
    cursor: pointer;
    font-size: 1.1rem;
    padding: 0 0.25rem;
  }
`;

export default function GererComptes({ surSupprimerFacturier, surModifierFacturier }) {
  const [notification, setNotification] = useState(null);
  const [limiteAdmin, setLimiteAdmin] = useState(3);
  const [limiteFacturier, setLimiteFacturier] = useState(5);
  const [chargementAdmin, setChargementAdmin] = useState(false);
  const [chargementFacturier, setChargementFacturier] = useState(false);
  
  // État unique pour stocker l'ensemble des utilisateurs (Admins + Facturiers)
  const [utilisateurs, setUtilisateurs] = useState([]);

  const declencherNotification = (text, type = 'success') => {
    setNotification({ text, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Chargement automatique des limites et de la liste globale au montage
  useEffect(() => {
    axios.get('http://localhost:5000/api/admin/limite')
      .then(res => res.data?.valeur && setLimiteAdmin(res.data.valeur))
      .catch(err => console.error("Erreur limite admin :", err));

    axios.get('http://localhost:5000/api/facturier/limite')
      .then(res => res.data?.valeur && setLimiteFacturier(res.data.valeur))
      .catch(err => console.error("Erreur limite facturier :", err));

    // Récupération de tous les utilisateurs depuis la route unifiée du backend
    axios.get('http://localhost:5000/api/utilisateurs')
      .then(res => {
        if (res.data) {
          setUtilisateurs(res.data);
        }
      })
      .catch(err => console.error("Erreur chargement utilisateurs :", err));
  }, []);

  // Calcul dynamique instantané basé sur les vraies données de la base
  const stats = useMemo(() => {
    const total = utilisateurs.length;
    const administrateurs = utilisateurs.filter(u => u.typeRole === 'Admin' || u.role?.toLowerCase().includes('admin')).length;
    const facturiers = utilisateurs.filter(u => u.typeRole !== 'Admin' && !u.role?.toLowerCase().includes('admin')).length;
    return { total, administrateurs, facturiers };
  }, [utilisateurs]);

  const handleSubmitLimite = async (e, type, valeur, setChargement) => {
    e.preventDefault();
    setChargement(true);
    const endpoint = type === 'admin' ? 'admin' : 'facturier';

    try {
      const response = await axios.put(`http://localhost:5000/api/${endpoint}/limite`, {
        nouvelleLimite: parseInt(valeur, 10)
      });
      declencherNotification(response.data.message || "Mise à jour réussie !", "success");
    } catch (err) {
      const msg = err.response?.data?.erreur || "Erreur lors de la mise à jour.";
      declencherNotification(msg, "error");
    } finally {
      setChargement(false);
    }
  };

  return (
    <ConteneurGestion>
      <EntetePage>
        <h2>Gestion des Accès & Quotas</h2>
        <p>Contrôlez les restrictions d'inscription et les rôles utilisateurs.</p>
      </EntetePage>

      {notification && (
        <NotificationToast $type={notification.type}>
          <span>{notification.text}</span>
          <button onClick={() => setNotification(null)}>&times;</button>
        </NotificationToast>
      )}

      <GrilleConfiguration>
        {/* Quota Administrateurs */}
        <CarteQuota>
          <InfoConfiguration>
            <h3>Administrateurs</h3>
            <p>Nombre maximal de comptes administrateurs autorisés sur la plateforme.</p>
          </InfoConfiguration>
          <FormulaireLimite onSubmit={(e) => handleSubmitLimite(e, 'admin', limiteAdmin, setChargementAdmin)}>
            <ChampNombre 
              type="number" 
              min="1" 
              max="20" 
              value={limiteAdmin} 
              onChange={(e) => setLimiteAdmin(e.target.value)}
              disabled={chargementAdmin}
            />
            <BoutonEnregistrer type="submit" disabled={chargementAdmin}>
              {chargementAdmin ? "Patientez..." : "Enregistrer"}
            </BoutonEnregistrer>
          </FormulaireLimite>
        </CarteQuota>

        {/* Quota Facturiers */}
        <CarteQuota>
          <InfoConfiguration>
            <h3>Facturiers</h3>
            <p>Nombre maximal de comptes facturiers autorisés sur la plateforme.</p>
          </InfoConfiguration>
          <FormulaireLimite onSubmit={(e) => handleSubmitLimite(e, 'facturier', limiteFacturier, setChargementFacturier)}>
            <ChampNombre 
              type="number" 
              min="1" 
              max="50" 
              value={limiteFacturier} 
              onChange={(e) => setLimiteFacturier(e.target.value)}
              disabled={chargementFacturier}
            />
            <BoutonEnregistrer type="submit" disabled={chargementFacturier}>
              {chargementFacturier ? "Patientez..." : "Enregistrer"}
            </BoutonEnregistrer>
          </FormulaireLimite>
        </CarteQuota>
      </GrilleConfiguration>

      {/* Statistiques en temps réel basées sur le backend */}
      <GrilleStats>
        <CarteStatistique>
          <div className="contenu-stat">
            <span className="titre">TOTAL UTILISATEURS</span>
            <span className="valeur">{stats.total}</span>
          </div>
          <div className="contenu-icone">👥</div>
        </CarteStatistique>

        <CarteStatistique>
          <div className="contenu-stat">
            <span className="titre">ADMINISTRATEURS</span>
            <span className="valeur">{stats.administrateurs}</span>
          </div>
          <div className="contenu-icone">🛡️</div>
        </CarteStatistique>

        <CarteStatistique>
          <div className="contenu-stat">
            <span className="titre">FACTURIERS</span>
            <span className="valeur">{stats.facturiers}</span>
          </div>
          <div className="contenu-icone">📄</div>
        </CarteStatistique>
      </GrilleStats>

      <RepertoireAccesEtRoles 
        facturiers={utilisateurs}
        surSupprimerFacturier={surSupprimerFacturier}
        surModifierFacturier={surModifierFacturier}
        declencherNotification={declencherNotification}
      />
    </ConteneurGestion>
  );
}