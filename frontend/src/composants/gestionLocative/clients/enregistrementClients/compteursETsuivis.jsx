import React from 'react';

export default function CompteursETsuivis({ 
  formulaire, 
  handleChange, 
  gererChangementDate, 
  gererToucheEntree, 
  refs 
}) {
  return (
    <fieldset style={{ border: '1px solid #2A2A2A', borderRadius: '10px', padding: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <legend style={{ color: '#AEEA00', fontSize: '0.78rem', fontWeight: 600, padding: '0 0.4rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        Compteurs & Suivi Index
      </legend>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', alignItems: 'stretch' }}>
        
        {/* N° Compteur */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', gap: '0.2rem' }}>
          <label style={{ color: '#888888', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', lineHeight: 1.1 }}>N° Compteur (CPT)</label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
            <input 
              ref={el => refs.current.compteur = el} 
              name="compteur" 
              value={formulaire.compteur ?? ''} 
              onChange={handleChange} 
              onKeyDown={gererToucheEntree} 
              style={{ width: '100%', backgroundColor: '#121212', border: '1px solid #2A2A2A', borderRadius: '6px', padding: '0.45rem 0.6rem', color: '#FFFFFF', fontSize: '0.8rem', outline: 'none' }}
            />
          </div>
        </div>

        {/* Imputation */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', gap: '0.2rem' }}>
          <label style={{ color: '#888888', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', lineHeight: 1.1 }}>Imputation (IMP.)</label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
            <input 
              ref={el => refs.current.imputation = el} 
              name="imputation" 
              value={formulaire.imputation ?? ''} 
              onChange={handleChange} 
              onKeyDown={gererToucheEntree} 
              style={{ width: '100%', backgroundColor: '#121212', border: '1px solid #2A2A2A', borderRadius: '6px', padding: '0.45rem 0.6rem', color: '#FFFFFF', fontSize: '0.8rem', outline: 'none' }}
            />
          </div>
        </div>

        {/* Dernier N° */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', gap: '0.2rem' }}>
          <label style={{ color: '#888888', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', lineHeight: 1.1 }}>Dernier N° (DER N°)</label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
            <input 
              ref={el => refs.current.dernierNumero = el} 
              name="dernierNumero" 
              value={formulaire.dernierNumero ?? ''} 
              onChange={handleChange} 
              onKeyDown={gererToucheEntree} 
              style={{ width: '100%', backgroundColor: '#121212', border: '1px solid #2A2A2A', borderRadius: '6px', padding: '0.45rem 0.6rem', color: '#FFFFFF', fontSize: '0.8rem', outline: 'none' }}
            />
          </div>
        </div>

        {/* Dernier Montant */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', gap: '0.2rem' }}>
          <label style={{ color: '#888888', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', lineHeight: 1.1 }}>Dernier Montant (DER Mt)</label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
            <input 
              ref={el => refs.current.dernierMontant = el} 
              type="number" 
              name="dernierMontant" 
              value={formulaire.dernierMontant ?? ''} 
              onChange={handleChange} 
              onKeyDown={gererToucheEntree} 
              style={{ width: '100%', backgroundColor: '#121212', border: '1px solid #2A2A2A', borderRadius: '6px', padding: '0.45rem 0.6rem', color: '#FFFFFF', fontSize: '0.8rem', outline: 'none' }}
            />
          </div>
        </div>

        {/* Dernière Date */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', gap: '0.2rem' }}>
          <label style={{ color: '#888888', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', lineHeight: 1.1 }}>Dernière Date (DER Dt)</label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
            <input 
              ref={el => refs.current.derniereDate = el} 
              type="date" 
              name="derniereDate" 
              max="9999-12-31" 
              value={formulaire.derniereDate ?? ''} 
              onChange={gererChangementDate} 
              onKeyDown={gererToucheEntree} 
              style={{ width: '100%', backgroundColor: '#121212', border: '1px solid #2A2A2A', borderRadius: '6px', padding: '0.45rem 0.6rem', color: '#FFFFFF', fontSize: '0.8rem', outline: 'none' }}
            />
          </div>
        </div>

      </div>
    </fieldset>
  );
}