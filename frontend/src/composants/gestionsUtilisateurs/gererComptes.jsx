import React, { useState } from 'react';
import styled from 'styled-components';
import RepertoireAccesEtRoles from './gererComptes/repertoireAccesEtRoles';

const ConteneurGestion = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;

const NotificationToast = styled.div`
  background: ${props => props.$type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)'};
  border: 1px solid ${props => props.$type === 'error' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(34, 197, 94, 0.3)'};
  color: ${props => props.$type === 'error' ? '#ef4444' : '#22c55e'};
  padding: 0.75rem 1rem;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  animation: fadeIn 0.2s ease;
`;

export default function GererComptes({ facturiers = [], surSupprimerFacturier, surModifierFacturier }) {
  const [notification, setNotification] = useState(null);

  const declencherNotification = (text, type = 'success') => {
    setNotification({ text, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  return (
    <ConteneurGestion>
      {notification && (
        <NotificationToast $type={notification.type}>
          <span>{notification.text}</span>
          <button 
            onClick={() => setNotification(null)} 
            style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: '1rem' }}
          >
            &times;
          </button>
        </NotificationToast>
      )}

      <RepertoireAccesEtRoles 
        facturiers={facturiers}
        surSupprimerFacturier={surSupprimerFacturier}
        surModifierFacturier={surModifierFacturier}
        declencherNotification={declencherNotification}
      />
    </ConteneurGestion>
  );
}