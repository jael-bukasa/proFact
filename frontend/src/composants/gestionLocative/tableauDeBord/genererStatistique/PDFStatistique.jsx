import React from 'react';
import styled from 'styled-components';

const ModeleRapportPDF = styled.div`
  width: 794px; /* Format A4 en pixels à 96 DPI */
  background: #ffffff;
  color: #111111;
  padding: 40px;
  font-family: 'Inter', Arial, sans-serif;
  box-sizing: border-box;
  position: absolute;
  top: -9999px;
  left: -9999px;

  .pdf-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    border-bottom: 2px solid #111;
    padding-bottom: 20px;
    margin-bottom: 30px;

    .logo-titre {
      h1 {
        font-size: 24px;
        font-weight: 800;
        color: #111;
        margin: 0;
        letter-spacing: -0.5px;
      }
      p {
        font-size: 13px;
        color: #666;
        margin: 4px 0 0 0;
      }
    }

    .meta-info {
      text-align: right;
      p {
        font-size: 12px;
        color: #444;
        margin: 2px 0;
        strong {
          color: #111;
        }
      }
    }
  }

  .pdf-section-title {
    font-size: 14px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    background: #f8f9fa;
    color: #333;
    padding: 8px 12px;
    margin: 25px 0 15px 0;
    border-left: 4px solid #AEEA00;
  }

  .pdf-grid-stats {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
    margin-bottom: 20px;

    .pdf-card {
      background: #fdfdfd;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 16px;

      span {
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
        color: #6b7280;
        display: block;
      }
      strong {
        font-size: 18px;
        font-weight: 700;
        color: #111827;
        margin-top: 6px;
        display: block;
      }
    }
  }

  .pdf-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;

    th, td {
      border: 1px solid #e5e7eb;
      padding: 10px 14px;
      font-size: 12px;
      text-align: left;
    }

    th {
      background-color: #f3f4f6;
      color: #374151;
      font-weight: 700;
      text-transform: uppercase;
      font-size: 11px;
    }

    td {
      color: #1f2937;
    }
  }

  .pdf-footer {
    margin-top: 60px;
    display: flex;
    justify-content: flex-end;

    .pdf-signature-box {
      width: 280px;
      height: 90px;
      border-top: 1px solid #374151;
      padding-top: 8px;
      text-align: center;
      font-size: 12px;
      font-weight: 600;
      color: #374151;

      .nom-admin {
        margin-top: 6px;
        font-weight: 700;
        color: #111;
      }
    }
  }
`;

export default function PDFStatistique({ idRapport, moisAnneeTexte, statistiques, volumeAffiche, devise, tauxChangeCDF, nomAdministrateur }) {
  return (
    <ModeleRapportPDF id={idRapport}>
      <div className="pdf-header">
        <div className="logo-titre">
          <h1>SNCC</h1>
          <p>Rapport d'Activité de l'Administrateur — Synthèse Financière</p>
        </div>
        <div className="meta-info">
          <p><strong>Période :</strong> {moisAnneeTexte}</p>
          <p><strong>Administrateur :</strong> {nomAdministrateur || 'Administrateur'}</p>
          <p><strong>Émis le :</strong> {new Date().toLocaleDateString('fr-FR')}</p>
        </div>
      </div>

      <div className="pdf-section-title">1. Indicateurs Clés de Performance</div>
      <div className="pdf-grid-stats">
        <div className="pdf-card">
          <span>Total Dossiers Enregistrés</span>
          <strong>{statistiques.totalDossiers}</strong>
        </div>
        <div className="pdf-card">
          <span>Volume Financier Global</span>
          <strong>{volumeAffiche}</strong>
        </div>
        <div className="pdf-card">
          <span>Dossiers Soldés / Réglés</span>
          <strong>{statistiques.totalRegle} / {statistiques.totalDossiers}</strong>
        </div>
        <div className="pdf-card">
          <span>Taux de Recouvrement</span>
          <strong>
            {statistiques.totalDossiers > 0 
              ? Math.round((statistiques.totalRegle / statistiques.totalDossiers) * 100) 
              : 0}%
          </strong>
        </div>
      </div>

      <div className="pdf-section-title">2. Ventilation Détaillée par Type de Prestation</div>
      <table className="pdf-table">
        <thead>
          <tr>
            <th>Type de Prestation</th>
            <th>Nombre de Dossiers</th>
            <th>Montant Total ({devise})</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(statistiques.statsTypes).map(([nom, data]) => {
            const montantType = devise === 'USD' 
              ? data.montantUSD.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
              : (data.montantUSD * tauxChangeCDF).toLocaleString('fr-FR', { style: 'currency', currency: 'CDF' });

            return (
              <tr key={nom}>
                <td>{data.label}</td>
                <td>{data.count}</td>
                <td>{montantType}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="pdf-footer">
        <div className="pdf-signature-box">
          Signature & Cachet de l'Administrateur
          <div className="nom-admin">{nomAdministrateur || 'Administrateur'}</div>
        </div>
      </div>
    </ModeleRapportPDF>
  );
}