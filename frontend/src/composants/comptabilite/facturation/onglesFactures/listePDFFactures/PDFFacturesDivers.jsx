import React, { forwardRef, useImperativeHandle, useRef, useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { nombreEnLettres, obtenirLibelleDevise, banquesParDefaut, chargerBanques, preparerColonnesBanques } from '../../../../../fonctions/fonctions';

const PDFFacturesEau = forwardRef(({ formaterDateFr }, ref) => {
  const elementRef = useRef(null);
  const [donneesFacture, setDonneesFacture] = useState(null);
  const [banques, setBanques] = useState(banquesParDefaut);

  useEffect(() => {
    chargerBanques().then(data => setBanques(data));
  }, []);

  const formaterCompteBanque = (b) => {
    return (
      <React.Fragment>
        <strong><span style={{ display: 'inline-block', width: '58px' }}>{b.nomBanque}</span></strong> {b.numeroCompte} {b.devise}
      </React.Fragment>
    );
  };

  useImperativeHandle(ref, () => ({
    genererPDF: async (cli) => {
      setDonneesFacture(cli);
      await new Promise((resolve) => setTimeout(resolve, 200));

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
        pdf.save(`Facture_Eau_${cli.matricule || cli.numero || cli.id || 'Client'}.pdf`);
      } catch (error) {
        console.error("Erreur génération PDF eau :", error);
        element.style.display = 'none';
      }
    },

    telechargerTout: async (listeFactures) => {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();

      for (let i = 0; i < listeFactures.length; i++) {
        setDonneesFacture(listeFactures[i]);
        await new Promise((resolve) => setTimeout(resolve, 250));

        const element = elementRef.current;
        if (!element) continue;

        element.style.display = 'block';
        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff'
        });
        element.style.display = 'none';

        const imgData = canvas.toDataURL('image/png');
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, 10, pdfWidth, pdfHeight);
      }

      pdf.save('Toutes_les_Factures_Eau.pdf');
    }
  }));

  const cli = donneesFacture || {};
  const numeroFactureAffichage = cli.numeroFacture || cli.numFacture || cli.refFacture || `0207/DCO/EAU/2026`;
  const codeClientVal = cli.matricule || cli.numero || `EAU-0000000009`;
  const dateAffichage = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const nomClient = `${cli.nom || ''} ${cli.postNom || ''} ${cli.prenom || cli.nomLocataire || cli.client || cli.locataire || ''}`.trim() || 'Client Inconnu';
  const adresseClient = `${cli.adresse || 'B.P 98'} - ${cli.pays || 'Congo'}`;
  const moisAffichage = cli.moisFacture ? `POUR LE MOIS DE ${cli.moisFacture.toUpperCase()}` : 'POUR LE MOIS DE JUILLET 2026';
  const objetAffichage = cli.designation || `CONSOMMATION EAU ET ENTRETIEN COMPTEUR`;
  const bailAffichage = cli.bail || cli.numeroBail || 'N/A';
  const compteurInfo = cli.compteur ? `COMPTEUR N° : ${cli.compteur} (Index: ${cli.dernierNumero || cli.indexActuel || 0})` : 'COMPTEUR EAU STANDARD';

  const montantVal = cli.montant !== undefined ? cli.montant : 0;
  const deviseVal = cli.devise || 'USD';
  const montantFormate = Number(montantVal).toLocaleString('fr-FR', { minimumFractionDigits: 2 });

  const montantEnLettres = `${nombreEnLettres(montantVal)} ${obtenirLibelleDevise(deviseVal)}`;

  const { colonne1: banquesColonne1, colonne2: banquesColonne2 } = preparerColonnesBanques(banques);

  const bordurePrincipale = '2px solid #111827';
  const bordureInterne = '1.5px solid #374151';

  return (
    <div 
      ref={elementRef} 
      style={{ 
        display: 'none',
        width: '680px', 
        margin: '0 auto',
        background: '#ffffff', 
        color: '#111827', 
        padding: '10px', 
        fontFamily: 'Helvetica, Arial, sans-serif', 
        fontSize: '10px',
        boxSizing: 'border-box'
      }}
    >
      <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '13px', marginBottom: '8px', letterSpacing: '1px', color: '#1f2937' }}>
        FACTURE EAU
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', border: bordurePrincipale, borderRadius: '4px', overflow: 'hidden' }}>
        <tbody>
          <tr>
            <td colSpan="2" style={{ padding: '8px 10px', borderBottom: bordureInterne, borderRight: bordureInterne, verticalAlign: 'top', width: '55%', backgroundColor: '#f9fafb', textAlign: 'left', lineHeight: '1.4' }}>
              <strong style={{ fontSize: '11px', color: '#111827' }}>S.N.C.C S.A AVEC CONSEIL D'ADMINISTRATION</strong><br/>
              SIÈGE SOCIAL : 115, PLACE DE LA GARE, AV. LUMUMBA, C/KAMPEMBA, LUBUMBASHI, B.P.297<br/>
              RCCM : CD/LSHI/RCCM/14-B-1702 | CAPITAL SOCIAL : 650.000.000 CDF<br/>
              N° ID.NAT : K09210W | N° IMPÔT : A 0700227 F<br/>
              N° ASS. TVA : 0968/DGI/DGE/DIG/MB/TVA/2011
            </td>
            <td style={{ padding: '8px 10px', borderBottom: bordureInterne, verticalAlign: 'top', textAlign: 'right', width: '45%', backgroundColor: '#f9fafb', whiteSpace: 'nowrap', lineHeight: '1.5' }}>
              <div style={{ fontSize: '10.5px', color: '#4b5563', marginBottom: '2px' }}>010773</div>
              <div><strong style={{ color: '#4b5563' }}>N° :</strong> <span style={{ fontWeight: '600', color: '#374151' }}>{numeroFactureAffichage}</span></div>
              <div><strong style={{ color: '#4b5563' }}>Date :</strong> <span style={{ color: '#374151' }}>{dateAffichage}</span></div>
              <div><strong style={{ color: '#4b5563' }}>Code client :</strong> <span style={{ color: '#374151' }}>{codeClientVal}</span></div>
            </td>
          </tr>

          <tr>
            <td colSpan="3" style={{ padding: '8px 10px', borderBottom: bordureInterne, backgroundColor: '#fdfdfd' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <div><strong>Référence :</strong> {cli.reference || 'AF : 001'}</div>
                <div><strong>DOIT :</strong> <span style={{ color: '#1f2937', fontWeight: '600' }}>{moisAffichage}</span></div>
              </div>
              <div style={{ textAlign: 'center', marginBottom: '4px' }}>
                <strong>Client :</strong> <span style={{ color: '#111827', fontWeight: '600' }}>{nomClient}</span><br/>
                <span style={{ color: '#4b5563' }}>{adresseClient}</span>
              </div>
              <div style={{ textAlign: 'center', marginTop: '4px' }}><strong>Objet :</strong> {objetAffichage}</div>
              <div style={{ textAlign: 'center', marginTop: '3px', fontSize: '9px', color: '#6b7280' }}>Facture établie en : <strong>{deviseVal}</strong></div>
            </td>
          </tr>

          <tr style={{ background: '#e5e7eb', textAlign: 'center', fontWeight: 'bold', color: '#1f2937' }}>
            <td style={{ borderRight: bordureInterne, borderBottom: bordureInterne, padding: '6px', width: '15%' }}>Quantité</td>
            <td style={{ borderRight: bordureInterne, borderBottom: bordureInterne, padding: '6px', width: '60%' }}>Désignation des prestations</td>
            <td style={{ borderBottom: bordureInterne, padding: '6px', width: '25%' }}>Montant</td>
          </tr>

          <tr>
            <td style={{ borderRight: bordureInterne, borderBottom: bordureInterne, padding: '10px', textAlign: 'center', verticalAlign: 'top', height: '45px' }}>1</td>
            <td style={{ borderRight: bordureInterne, borderBottom: bordureInterne, padding: '10px', textAlign: 'center', verticalAlign: 'top' }}>
              <span style={{ fontWeight: '600', fontSize: '10.5px' }}>{objetAffichage}</span><br/>
              <span style={{ fontSize: '9px', color: '#4b5563' }}>NUMERO DE BAIL : {bailAffichage} | {compteurInfo}</span>
            </td>
            <td style={{ borderBottom: bordureInterne, padding: '10px', textAlign: 'right', verticalAlign: 'top', fontWeight: '600' }}>
              {montantFormate}
            </td>
          </tr>

          <tr>
            <td colSpan="2" style={{ borderRight: bordureInterne, borderBottom: bordureInterne, padding: '8px 10px', textAlign: 'right', fontWeight: 'bold' }}>
              Montant total de la facture :
            </td>
            <td style={{ borderBottom: bordureInterne, padding: '8px 10px', textAlign: 'right', fontWeight: 'bold', fontSize: '11px', color: '#111827' }}>
              {montantFormate} {deviseVal}
            </td>
          </tr>

          <tr>
            <td colSpan="3" style={{ padding: '8px 10px', borderBottom: bordureInterne, backgroundColor: '#fdfdfd', textAlign: 'center' }}>
              <span style={{ fontSize: '9px', color: '#6b7280' }}>Arrêtée la présente à la somme de :</span><br/>
              <strong style={{ fontSize: '10.5px', textTransform: 'capitalize' }}>{montantEnLettres}</strong>
            </td>
          </tr>

          <tr>
            <td colSpan="3" style={{ padding: '12px 10px', borderBottom: bordureInterne, fontSize: '8.5px', color: '#374151', lineHeight: '1.4' }}>
              <div style={{ background: '#f3f4f6', padding: '10px 12px', borderRadius: '4px', marginBottom: '10px', border: '1px solid #d1d5db' }}>
                <div style={{ marginBottom: '6px' }}>
                  <strong>Conditions de paiement :</strong> Nos factures sont payables suivant les clauses du contrat. Tout retard entraînera l'application des pénalités prévues et le paiement d'intérêts sur le cours bancaire du jour, soit en Dollars US.
                </div>
                <div>
                  <strong>Modalité de paiement :</strong> Le montant est à verser exclusivement dans l'un de nos comptes bancaires officiels ci-dessous ou directement au bureau des recettes agréé muni de la pièce contre bordereau.
                </div>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', background: '#f3f4f6', padding: '6px' }}>
                <tbody>
                  <tr>
                    <td style={{ width: '50%', verticalAlign: 'top', paddingRight: '12px' }}>
                      {banquesColonne1.map((b, index) => (
                        <div key={index} style={{ marginBottom: '7px' }}>
                          {formaterCompteBanque(b)}
                        </div>
                      ))}
                    </td>
                    <td style={{ width: '50%', verticalAlign: 'top' }}>
                      {banquesColonne2.map((b, index) => (
                        <div key={index} style={{ marginBottom: '7px' }}>
                          {formaterCompteBanque(b)}
                        </div>
                      ))}
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          <tr>
            <td colSpan="3" style={{ padding: '6px 10px', fontSize: '9px', color: '#4b5563' }}>
              <strong>Imputation :</strong> {cli.imputation || '4500 / L4227100000'}
            </td>
          </tr>
        </tbody>
      </table>

      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          marginTop: '25px', 
          padding: '0 10px' 
        }}
      >
        <div style={{ textAlign: 'center', width: '45%' }}>
          <div style={{ fontSize: '9.5px', fontWeight: 'bold', marginBottom: '45px', color: '#111827' }}>
            Le Chef de service Facturation
          </div>
          <div style={{ borderBottom: '1px dotted #4b5563', width: '75%', margin: '0 auto' }}></div>
        </div>

        <div style={{ textAlign: 'center', width: '45%' }}>
          <div style={{ fontSize: '9.5px', fontWeight: 'bold', marginBottom: '45px', color: '#111827' }}>
            Le Directeur de la division Facturation
          </div>
          <div style={{ borderBottom: '1px dotted #4b5563', width: '75%', margin: '0 auto' }}></div>
        </div>
      </div>
    </div>
  );
});

export default PDFFacturesEau;