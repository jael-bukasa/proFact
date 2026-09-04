import React from 'react';
import styled from 'styled-components';

const TableauUtilisateurs = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const LigneUtilisateur = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #18181b;
  border: 1px solid rgba(255, 255, 255, 0.06);
  padding: 1rem 1.25rem;
  border-radius: 12px;
  transition: all 0.2s ease;

  &:hover {
    border-color: rgba(34, 197, 94, 0.3);
    background: #1c1c21;
    transform: translateX(2px);
  }
`;

const InfoUtilisateur = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const AvatarMini = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.9rem;
  border: 1px solid rgba(34, 197, 94, 0.2);
`;

const TexteInfos = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  h5 {
    color: #f8fafc;
    font-size: 0.95rem;
    font-weight: 600;
  }

  span.email {
    color: #94a3b8;
    font-size: 0.825rem;
  }

  .meta-ligne {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-top: 0.15rem;
  }
`;

const BadgeRole = styled.span`
  background: rgba(59, 130, 246, 0.1);
  color: #60a5fa;
  font-size: 0.7rem;
  padding: 0.15rem 0.55rem;
  border-radius: 6px;
  font-weight: 600;
  border: 1px solid rgba(59, 130, 246, 0.2);
  text-transform: uppercase;
`;

const GroupeBoutons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const BoutonAction = styled.button`
  padding: 0.5rem 0.85rem;
  border-radius: 8px;
  font-size: 0.8rem;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.08);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: rgba(255, 255, 255, 0.03);
  color: #cbd5e1;

  &.supprimer:hover {
    background: rgba(239, 68, 68, 0.15);
    color: #ef4444;
    border-color: rgba(239, 68, 68, 0.3);
  }
`;

const MessageVide = styled.div`
  text-align: center;
  padding: 2.5rem;
  color: #64748b;
  font-size: 0.875rem;
  background: #18181b;
  border-radius: 12px;
  border: 1px dashed rgba(255, 255, 255, 0.08);
`;

export default function RepertoireAdministrateurs({ admins = [], surSupprimer }) {
  return (
    <>
      {admins.length === 0 ? (
        <MessageVide>Aucun administrateur trouvé.</MessageVide>
      ) : (
        <TableauUtilisateurs>
          {admins.map(admin => {
            const initiales = `${admin.prenom?.charAt(0) || ''}${admin.nom?.charAt(0) || ''}`.toUpperCase();
            return (
              <LigneUtilisateur key={admin.id}>
                <InfoUtilisateur>
                  <AvatarMini>{initiales}</AvatarMini>
                  <TexteInfos>
                    <h5>{admin.prenom} {admin.nom}</h5>
                    <span className="email">{admin.email}</span>
                    <div className="meta-ligne">
                      <BadgeRole>{admin.role}</BadgeRole>
                    </div>
                  </TexteInfos>
                </InfoUtilisateur>
                <GroupeBoutons>
                  <BoutonAction className="supprimer" onClick={() => surSupprimer(admin)}>
                    🗑️ Supprimer
                  </BoutonAction>
                </GroupeBoutons>
              </LigneUtilisateur>
            );
          })}
        </TableauUtilisateurs>
      )}
    </>
  );
}