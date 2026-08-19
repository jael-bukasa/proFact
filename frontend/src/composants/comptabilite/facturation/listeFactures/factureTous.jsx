import React from 'react';
import styled from 'styled-components';

const THEME = {
  fondCarte: '#1E1E1E',
  textePrincipal: '#FFFFFF',
  texteSecondaire: '#888888',
  bordure: '#2A2A2A',
  fondChamp: '#121212',
  succes: '#81C784',
};

const ConteneurFactureTous = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const TableauFactures = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: ${THEME.fondCarte};
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid ${THEME.bordure};

  th, td {
    padding: 1rem;
    text-align: left;
    font-size: 0.85rem;
    border-bottom: 1px solid ${THEME.bordure};
  }

  th {
    background-color: ${THEME.fondChamp};
    color: ${THEME.texteSecondaire};
    text-transform: uppercase;
    font-size: 0.75rem;
  }

  td {
    color: ${THEME.textePrincipal};
  }
`;

export default function FactureTous({
  listeFactures = [],
  formaterDateFr
}) {
  return (
    <ConteneurFactureTous>
      <TableauFactures>
        <thead>
          <tr>
            <th>N° Facture</th>
            <th>Client / Locataire</th>
            <th>Type</th>
            <th>Date</th>
            <th>Montant</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          {listeFactures.length > 0 ? (
            listeFactures.map((f) => (
              <tr key={f.id || f.numero || Math.random()}>
                <td>{f.numero || f.bail || 'N/A'}</td>
                <td>{f.client || f.locataire || f.nom || 'N/A'}</td>
                <td>
                  <span style={{ padding: '0.2rem 0.5rem', backgroundColor: THEME.fondChamp, borderRadius: '4px', fontSize: '0.75rem' }}>
                    {f.typeFacture || f.type || f.categorie || 'Général'}
                  </span>
                </td>
                <td>{formaterDateFr && f.dateFacture ? formaterDateFr(f.dateFacture) : (f.dateFacture || 'N/A')}</td>
                <td>{f.montant !== undefined ? `${f.montant} USD` : (f.mont ? `${f.mont} USD` : 'N/A')}</td>
                <td style={{ color: f.statut === 'Payée' ? THEME.succes : '#FFB74D' }}>
                  {f.statut || 'En attente'}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center', padding: '1.5rem', color: THEME.texteSecondaire }}>
                Aucune facture enregistrée ne correspond à vos critères.
              </td>
            </tr>
          )}
        </tbody>
      </TableauFactures>
    </ConteneurFactureTous>
  );
}