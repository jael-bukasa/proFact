import React from 'react';

export default function DelaisFactureEtPeriode({ 
  formulaire, 
  erreurs, 
  handleChange, 
  gererChangementDate, 
  gererToucheEntree, 
  refs, 
  longueurDesignation, 
  limiteAtteinte, 
  MAX_CARACTERES_DESIGNATION 
}) {
  const obtenirLibellePeriode = () => {
    if (formulaire.typePeriode === 'mois') return 'Mois Concerné *';
    if (formulaire.typePeriode === 'trimestre') return 'Trimestre Concerné *';
    return 'Semestre Concerné *';
  };

  return (
    <fieldset style={{ border: '1px solid #2A2A2A', borderRadius: '10px', padding: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <legend style={{ color: '#AEEA00', fontSize: '0.78rem', fontWeight: 600, padding: '0 0.4rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        Détails Facture & Période
      </legend>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', alignItems: 'stretch' }}>
        
        {/* Désignation (Plein format) */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', gap: '0.2rem', gridColumn: '1 / -1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{ color: '#888888', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', lineHeight: 1.1 }}>Désignation</label>
            <span style={{ fontSize: '0.65rem', fontWeight: 600, color: limiteAtteinte ? '#FF5252' : '#888888' }}>
              {limiteAtteinte ? "⚠️ Limite atteinte (500 max)" : `${longueurDesignation} / ${MAX_CARACTERES_DESIGNATION}`}
            </span>
          </div>
          <textarea 
            ref={el => refs.current.designation = el} 
            name="designation" 
            value={formulaire.designation ?? ''} 
            onChange={handleChange} 
            maxLength={MAX_CARACTERES_DESIGNATION}
            placeholder="Détails de la désignation..."
            style={{ width: '100%', backgroundColor: '#121212', border: `1px solid ${erreurs.designation ? '#FF5252' : '#2A2A2A'}`, borderRadius: '6px', padding: '0.5rem', color: '#FFFFFF', fontSize: '0.8rem', fontFamily: 'inherit', minHeight: '56px', maxHeight: '110px', resize: 'vertical', outline: 'none' }}
          />
        </div>

        {/* Type de Facture */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', gap: '0.2rem' }}>
          <label style={{ color: '#888888', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', lineHeight: 1.1 }}>Type de Facture *</label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
            <input 
              ref={el => refs.current.typeFacture = el} 
              name="typeFacture" 
              value={formulaire.typeFacture ?? 'Loyers'} 
              readOnly 
              style={{ width: '100%', backgroundColor: '#181818', border: '1px solid #2A2A2A', borderRadius: '6px', padding: '0.45rem 0.6rem', color: '#AAAAAA', fontSize: '0.8rem', cursor: 'not-allowed', opacity: 0.8 }}
            />
          </div>
        </div>

        {/* Devise */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', gap: '0.2rem' }}>
          <label style={{ color: '#888888', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', lineHeight: 1.1 }}>Devise</label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
            <select 
              ref={el => refs.current.devise = el} 
              name="devise" 
              value={formulaire.devise ?? 'USD'} 
              onChange={handleChange} 
              onKeyDown={gererToucheEntree} 
              style={{ width: '100%', backgroundColor: '#121212', border: '1px solid #2A2A2A', borderRadius: '6px', padding: '0.45rem 2.2rem 0.45rem 0.6rem', color: '#FFFFFF', fontSize: '0.8rem', outline: 'none', cursor: 'pointer' }}
            >
              <option value="USD">USD ($)</option>
              <option value="CDF">CDF (FC)</option>
            </select>
          </div>
        </div>

        {/* Montant */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', gap: '0.2rem' }}>
          <label style={{ color: '#888888', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', lineHeight: 1.1 }}>Montant * (&gt; 0)</label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
            <input 
              ref={el => refs.current.montant = el} 
              type="number" 
              step="any"
              min="0.0001"
              name="montant" 
              value={formulaire.montant ?? ''} 
              onChange={handleChange} 
              onKeyDown={gererToucheEntree} 
              placeholder="Ex: 150.00" 
              style={{ width: '100%', backgroundColor: '#121212', border: `1px solid ${erreurs.montant ? '#FF5252' : '#2A2A2A'}`, borderRadius: '6px', padding: erreurs.montant ? '0.45rem 6.5rem 0.45rem 0.6rem' : '0.45rem 0.6rem', color: '#FFFFFF', fontSize: '0.8rem', outline: 'none' }}
            />
            {erreurs.montant && <span style={{ position: 'absolute', right: '0.6rem', color: '#FF5252', fontSize: '0.6rem', fontWeight: 600, backgroundColor: 'rgba(18, 18, 18, 0.85)', padding: '0.1rem 0.2rem', borderRadius: '3px' }}>{erreurs.montant}</span>}
          </div>
        </div>

        {/* Mode de paiement */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', gap: '0.2rem' }}>
          <label style={{ color: '#888888', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', lineHeight: 1.1 }}>Mode de paiement</label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
            <select 
              ref={el => refs.current.modePaiement = el} 
              name="modePaiement" 
              value={formulaire.modePaiement ?? 'Virement'} 
              onChange={handleChange} 
              onKeyDown={gererToucheEntree} 
              style={{ width: '100%', backgroundColor: '#121212', border: '1px solid #2A2A2A', borderRadius: '6px', padding: '0.45rem 2.2rem 0.45rem 0.6rem', color: '#FFFFFF', fontSize: '0.8rem', outline: 'none', cursor: 'pointer' }}
            >
              <option value="Virement">Virement</option>
              <option value="Espèces">Espèces</option>
              <option value="Chèque">Chèque</option>
              <option value="Mobile Money">Mobile Money</option>
            </select>
          </div>
        </div>

        {/* Fréquence Période */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', gap: '0.2rem' }}>
          <label style={{ color: '#888888', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', lineHeight: 1.1 }}>Fréquence Période *</label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
            <select 
              name="typePeriode" 
              value={formulaire.typePeriode} 
              onChange={handleChange} 
              style={{ width: '100%', backgroundColor: '#121212', border: '1px solid #2A2A2A', borderRadius: '6px', padding: '0.45rem 2.2rem 0.45rem 0.6rem', color: '#FFFFFF', fontSize: '0.8rem', outline: 'none', cursor: 'pointer' }}
            >
              <option value="mois">Par Mois</option>
              <option value="trimestre">Par Trimestre</option>
              <option value="semestre">Par Semestre</option>
            </select>
          </div>
        </div>

        {/* Mois / Trimestre / Semestre Concerné */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', gap: '0.2rem' }}>
          <label style={{ color: '#888888', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', lineHeight: 1.1 }}>{obtenirLibellePeriode()}</label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
            <select 
              ref={el => refs.current.moisFacture = el} 
              name="moisFacture" 
              value={formulaire.moisFacture ?? ''} 
              onChange={handleChange} 
              onKeyDown={gererToucheEntree} 
              style={{ width: '100%', backgroundColor: '#121212', border: `1px solid ${erreurs.moisFacture ? '#FF5252' : '#2A2A2A'}`, borderRadius: '6px', padding: '0.45rem 2.2rem 0.45rem 0.6rem', color: '#FFFFFF', fontSize: '0.8rem', outline: 'none', cursor: 'pointer' }}
            >
              <option value="">-- Choisir --</option>
              {formulaire.typePeriode === 'mois' && (
                <>
                  <option value="Janvier">Janvier</option>
                  <option value="Février">Février</option>
                  <option value="Mars">Mars</option>
                  <option value="Avril">Avril</option>
                  <option value="Mai">Mai</option>
                  <option value="Juin">Juin</option>
                  <option value="Juillet">Juillet</option>
                  <option value="Août">Août</option>
                  <option value="Septembre">Septembre</option>
                  <option value="Octobre">Octobre</option>
                  <option value="Novembre">Novembre</option>
                  <option value="Décembre">Décembre</option>
                </>
              )}
              {formulaire.typePeriode === 'trimestre' && (
                <>
                  <option value="T1 (Jan - Mar)">T1 (Jan - Mar)</option>
                  <option value="T2 (Avr - Jun)">T2 (Avr - Jun)</option>
                  <option value="T3 (Jul - Sep)">T3 (Jul - Sep)</option>
                  <option value="T4 (Oct - Déc)">T4 (Oct - Déc)</option>
                </>
              )}
              {formulaire.typePeriode === 'semestre' && (
                <>
                  <option value="S1 (Jan - Juin)">S1 (Jan - Juin)</option>
                  <option value="S2 (Juil - Déc)">S2 (Juil - Déc)</option>
                </>
              )}
            </select>
            {erreurs.moisFacture && <span style={{ position: 'absolute', right: '2rem', color: '#FF5252', fontSize: '0.6rem', fontWeight: 600, backgroundColor: 'rgba(18, 18, 18, 0.85)', padding: '0.1rem 0.2rem', borderRadius: '3px' }}>Requis</span>}
          </div>
        </div>

        {/* Début Contrat */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', gap: '0.2rem' }}>
          <label style={{ color: '#888888', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', lineHeight: 1.1 }}>Début Contrat *</label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
            <input 
              ref={el => refs.current.debutContrat = el} 
              type="date" 
              name="debutContrat" 
              max="9999-12-31" 
              value={formulaire.debutContrat ?? ''} 
              onChange={gererChangementDate} 
              onKeyDown={gererToucheEntree} 
              style={{ width: '100%', backgroundColor: '#121212', border: `1px solid ${erreurs.debutContrat ? '#FF5252' : '#2A2A2A'}`, borderRadius: '6px', padding: erreurs.debutContrat ? '0.45rem 6.5rem 0.45rem 0.6rem' : '0.45rem 0.6rem', color: '#FFFFFF', fontSize: '0.8rem', outline: 'none' }}
            />
            {erreurs.debutContrat && <span style={{ position: 'absolute', right: '0.6rem', color: '#FF5252', fontSize: '0.6rem', fontWeight: 600, backgroundColor: 'rgba(18, 18, 18, 0.85)', padding: '0.1rem 0.2rem', borderRadius: '3px' }}>{erreurs.debutContrat}</span>}
          </div>
        </div>

        {/* Fin Contrat */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', gap: '0.2rem' }}>
          <label style={{ color: '#888888', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', lineHeight: 1.1 }}>Fin Contrat *</label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
            <input 
              ref={el => refs.current.finContrat = el} 
              type="date" 
              name="finContrat" 
              max="9999-12-31" 
              value={formulaire.finContrat ?? ''} 
              onChange={gererChangementDate} 
              onKeyDown={gererToucheEntree} 
              style={{ width: '100%', backgroundColor: '#121212', border: `1px solid ${erreurs.finContrat ? '#FF5252' : '#2A2A2A'}`, borderRadius: '6px', padding: erreurs.finContrat ? '0.45rem 6.5rem 0.45rem 0.6rem' : '0.45rem 0.6rem', color: '#FFFFFF', fontSize: '0.8rem', outline: 'none' }}
            />
            {erreurs.finContrat && <span style={{ position: 'absolute', right: '0.6rem', color: '#FF5252', fontSize: '0.6rem', fontWeight: 600, backgroundColor: 'rgba(18, 18, 18, 0.85)', padding: '0.1rem 0.2rem', borderRadius: '3px' }}>{erreurs.finContrat}</span>}
          </div>
        </div>

        {/* Date Comptable */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', gap: '0.2rem' }}>
          <label style={{ color: '#888888', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', lineHeight: 1.1 }}>Date Comptable</label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
            <input 
              ref={el => refs.current.dateComptable = el} 
              type="date" 
              name="dateComptable" 
              max="9999-12-31" 
              value={formulaire.dateComptable ?? ''} 
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