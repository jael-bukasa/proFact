import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const PDFFacturesLocataire = forwardRef(({ formaterDateFr }, ref) => {
  const elementRef = useRef(null);
  const [donneesFacture, setDonneesFacture] = useState(null);

  useImperativeHandle(ref, () => ({
    genererPDF: async (cli) => {
      setDonneesFacture(cli);
      await new Promise((resolve) => setTimeout(resolve, 150));

      const element = elementRef.current;
      if (!element) return;

      try {
        element.style.display = 'block';

        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff'
        });

        element.style.display = 'none';

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 10, pdfWidth, pdfHeight);
        pdf.save(`Facture_SNCC_${cli.numeroFacture || cli.id || 'Locataire'}.pdf`);
      } catch (error) {
        console.error("Erreur lors de la génération du PDF :", error);
        element.style.display = 'none';
      }
    }
  }));

  const cli = donneesFacture || {};

  const numeroFactureAffichage = cli.numeroFacture || cli.numFacture || cli.refFacture || `0207/DCO/LOY/2026`;
  const codeClientVal = cli.matricule || cli.codeClient || cli.numero || '-';
  
  // Date du jour générée automatiquement
  const dateAffichage = new Date().toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  const nomClient = `${cli.nom || ''} ${cli.postNom || ''} ${cli.prenom || cli.client || cli.locataire || ''}`.trim() || 'SCTP EX-ONATRA';
  
  const localisationVal = cli.logement || cli.localisation || cli.adresse || 'ILEBO';
  const adresseClient = `${cli.adresse || 'B.P 98'} - ${cli.pays || 'Congo'}`;
  
  const moisAffichage = cli.moisFacture ? `POUR LE MOIS DE ${cli.moisFacture.toUpperCase()}` : 'POUR LE MOIS DE JUILLET 2026';
  const objetAffichage = cli.designation || `LOCATION IMMEUBLE SNCC A ${localisationVal.toUpperCase()}`;
  const bailAffichage = cli.bail || cli.numeroBail || 'B/083/NE';
  
  const montantVal = cli.montant !== undefined ? cli.montant : 1040.00;
  const deviseVal = cli.devise || 'USD';
  const montantFormate = Number(montantVal).toLocaleString('fr-FR', { minimumFractionDigits: 2 });

  const styleNomBanque = { display: 'inline-block', width: '58px' };

  return (
    <div 
      ref={elementRef} 
      style={{ 
        display: 'none',
        width: '740px', 
        background: '#ffffff', 
        color: '#111827', 
        padding: '15px', 
        fontFamily: 'Helvetica, Arial, sans-serif', 
        fontSize: '10px',
        boxSizing: 'border-box'
      }}
    >
      <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '13px', marginBottom: '10px', letterSpacing: '1px', color: '#1f2937' }}>
        F A C T U R E
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #d1d5db', borderRadius: '4px', overflow: 'hidden' }}>
        <tbody>
          <tr>
            <td colSpan="2" style={{ padding: '8px 10px', borderBottom: '1px solid #d1d5db', verticalAlign: 'top', width: '55%', backgroundColor: '#f9fafb', textAlign: 'left', lineHeight: '1.4' }}>
              <strong style={{ fontSize: '11px', color: '#111827' }}>S.N.C.C S.A AVEC CONSEIL D'ADMINISTRATION</strong><br/>
              SIÈGE SOCIAL : 115, PLACE DE LA GARE, AV. LUMUMBA, C/KAMPEMBA, LUBUMBASHI, B.P.297<br/>
              RCCM : CD/LSHI/RCCM/14-B-1702 | CAPITAL SOCIAL : 650.000.000.000<br/>
              N° ID.NAT : K09210W | N° IMPÔT : A 0700227 F<br/>
              N° ASS. TVA : 0968/DGI/DGE/DIG/MB/TVA/2011
            </td>
            <td style={{ padding: '8px 10px', borderBottom: '1px solid #d1d5db', verticalAlign: 'top', textAlign: 'right', width: '45%', backgroundColor: '#f9fafb', whiteSpace: 'nowrap', lineHeight: '1.4' }}>
              <div style={{ fontSize: '9px', color: '#6b7280' }}>010773</div>
              <div style={{ marginTop: '2px' }}><strong>N° :</strong> <span style={{ fontWeight: '600' }}>{numeroFactureAffichage}</span></div>
              <div><strong>Date :</strong> {dateAffichage}</div>
              <div style={{ marginTop: '2px' }}><strong>Code client :</strong> {codeClientVal}</div>
            </td>
          </tr>

          <tr>
            <td colSpan="3" style={{ padding: '8px 10px', borderBottom: '1px solid #d1d5db' }}>
              <strong>Client / Société :</strong> <span style={{ color: '#111827', fontWeight: '600' }}>{nomClient}</span><br/>
              <span style={{ color: '#4b5563' }}>{adresseClient}</span>
            </td>
          </tr>

          <tr>
            <td colSpan="3" style={{ padding: '8px 10px', borderBottom: '1px solid #d1d5db', backgroundColor: '#fdfdfd' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span><strong>Référence AF :</strong> {cli.af || '001'}</span>
                <span><strong>DOIT :</strong> <span style={{ color: '#1f2937', fontWeight: '600' }}>{moisAffichage}</span></span>
              </div>
              <div><strong>Objet :</strong> {objetAffichage}</div>
              <div style={{ marginTop: '3px', fontSize: '9px', color: '#6b7280' }}>Facture établie en : <strong>{deviseVal}</strong></div>
            </td>
          </tr>

          <tr style={{ background: '#e5e7eb', textAlign: 'center', fontWeight: 'bold', color: '#1f2937' }}>
            <td style={{ borderRight: '1px solid #d1d5db', borderBottom: '1px solid #d1d5db', padding: '6px', width: '15%' }}>Quantité</td>
            <td style={{ borderRight: '1px solid #d1d5db', borderBottom: '1px solid #d1d5db', padding: '6px', width: '60%' }}>Désignation des prestations</td>
            <td style={{ borderBottom: '1px solid #d1d5db', padding: '6px', width: '25%' }}>Montant</td>
          </tr>

          <tr>
            <td style={{ borderRight: '1px solid #d1d5db', borderBottom: '1px solid #d1d5db', padding: '10px', textAlign: 'center', verticalAlign: 'top', height: '45px' }}>1</td>
            <td style={{ borderRight: '1px solid #d1d5db', borderBottom: '1px solid #d1d5db', padding: '10px', verticalAlign: 'top' }}>
              <span style={{ fontWeight: '600', fontSize: '10.5px' }}>{objetAffichage}</span><br/>
              <span style={{ fontSize: '9px', color: '#4b5563' }}>NUMERO DE BAIL : {bailAffichage}</span>
            </td>
            <td style={{ borderBottom: '1px solid #d1d5db', padding: '10px', textAlign: 'right', verticalAlign: 'top', fontWeight: '600' }}>
              {montantFormate}
            </td>
          </tr>

          <tr>
            <td colSpan="2" style={{ borderRight: '1px solid #d1d5db', borderBottom: '1px solid #d1d5db', padding: '8px 10px', textAlign: 'right', fontWeight: 'bold' }}>
              Montant total de la facture :
            </td>
            <td style={{ borderBottom: '1px solid #d1d5db', padding: '8px 10px', textAlign: 'right', fontWeight: 'bold', fontSize: '11px', color: '#111827' }}>
              {montantFormate} {deviseVal}
            </td>
          </tr>

          <tr>
            <td colSpan="3" style={{ padding: '8px 10px', borderBottom: '1px solid #d1d5db', backgroundColor: '#fdfdfd' }}>
              <span style={{ fontSize: '9px', color: '#6b7280' }}>Arrêtée la présente à la somme de :</span><br/>
              <strong style={{ fontSize: '10.5px' }}>{montantFormate} {deviseVal}</strong>
            </td>
          </tr>

          <tr>
            <td colSpan="3" style={{ padding: '10px', borderBottom: '1px solid #d1d5db', fontSize: '8.5px', color: '#374151', lineHeight: '1.4' }}>
              <div style={{ background: '#f3f4f6', padding: '8px 10px', borderRadius: '4px', marginBottom: '10px' }}>
                <div style={{ marginBottom: '6px' }}>
                  <strong>Conditions de paiement :</strong> Nos factures sont payables anticipativement suivant les clauses du contrat de bail. Tout retard entraînera l'application des pénalités prévues et le paiement s'effectue soit en Francs Congolais (au taux bancaire du jour), soit en Dollars US.
                </div>
                <div>
                  <strong>Modalité de paiement :</strong> Le montant est à verser exclusivement dans l'un de nos comptes bancaires officiels ci-dessous ou directement au bureau des recettes agréé de la place contre bordereau.
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 12px', background: '#f3f4f6', padding: '8px 10px', borderRadius: '4px' }}>
                <div>
                  <strong><span style={styleNomBanque}>BCDC</span></strong> N° 00011-00130-00000856147-03 CDF<br/>
                  <strong><span style={styleNomBanque}>BCDC</span></strong> N° 00011-00130-00000856151-88 USD<br/>
                  <div style={{ marginTop: '8px' }}>
                    <strong><span style={styleNomBanque}>TMB</span></strong> N° 00017-25000-00015000000-87 CDF<br/>
                    <strong><span style={styleNomBanque}>TMB</span></strong> N° 00017-25000-00187750001-35 USD
                  </div>
                </div>
                <div>
                  <strong>RAWBANK</strong> N° 00016-05130-01002107502-77 CDF<br/>
                  <strong>RAWBANK</strong> N° 00016-05130-01002107501-80 USD
                </div>
              </div>
            </td>
          </tr>

          <tr>
            <td colSpan="3" style={{ padding: '6px 10px', borderBottom: '1px solid #d1d5db', fontSize: '9px', color: '#4b5563' }}>
              <strong>Imputation :</strong> 4500 / L4227100000
            </td>
          </tr>

          <tr>
            <td colSpan="1.5" style={{ padding: '12px 10px 10px 10px', textAlign: 'center', verticalAlign: 'top', width: '50%', borderRight: '1px solid #d1d5db' }}>
              <div style={{ fontSize: '9px', fontWeight: '600', marginBottom: '22px' }}>Le Chef de service Facturation</div>
              <div style={{ borderBottom: '1px dotted #9ca3af', width: '55%', margin: '0 auto' }}></div>
            </td>
            <td colSpan="1.5" style={{ padding: '12px 10px 10px 10px', textAlign: 'center', verticalAlign: 'top', width: '50%' }}>
              <div style={{ fontSize: '9px', fontWeight: '600', marginBottom: '22px' }}>Le Directeur de la division Facturation</div>
              <div style={{ borderBottom: '1px dotted #9ca3af', width: '55%', margin: '0 auto' }}></div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
});

export default PDFFacturesLocataire;