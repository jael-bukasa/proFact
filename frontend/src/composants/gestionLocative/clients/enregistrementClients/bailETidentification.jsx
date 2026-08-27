import React from 'react';

export default function BailETidentification({ 
  formulaire, 
  erreurs, 
  handleChange, 
  gererChangementDate, 
  gererToucheEntree, 
  refs 
}) {
  return (
    <fieldset style={{ border: '1px solid #2A2A2A', borderRadius: '10px', padding: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <legend style={{ color: '#AEEA00', fontSize: '0.78rem', fontWeight: 600, padding: '0 0.4rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        Bail & Identification
      </legend>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', alignItems: 'stretch' }}>
        
        {/* Nom */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', gap: '0.2rem' }}>
          <label style={{ color: '#888888', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', lineHeight: 1.1 }}>Nom *</label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
            <input 
              ref={el => refs.current.nom = el} 
              name="nom" 
              value={formulaire.nom ?? ''} 
              onChange={handleChange} 
              onKeyDown={gererToucheEntree} 
              placeholder="Ex: Mulaji" 
              style={{ width: '100%', backgroundColor: '#121212', border: `1px solid ${erreurs.nom ? '#FF5252' : '#2A2A2A'}`, borderRadius: '6px', padding: erreurs.nom ? '0.45rem 6.5rem 0.45rem 0.6rem' : '0.45rem 0.6rem', color: '#FFFFFF', fontSize: '0.8rem', outline: 'none' }}
            />
            {erreurs.nom && <span style={{ position: 'absolute', right: '0.6rem', color: '#FF5252', fontSize: '0.6rem', fontWeight: 600, backgroundColor: 'rgba(18, 18, 18, 0.85)', padding: '0.1rem 0.2rem', borderRadius: '3px' }}>{erreurs.nom}</span>}
          </div>
        </div>

        {/* Post-nom */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', gap: '0.2rem' }}>
          <label style={{ color: '#888888', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', lineHeight: 1.1 }}>Post-nom *</label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
            <input 
              ref={el => refs.current.postNom = el} 
              name="postNom" 
              value={formulaire.postNom ?? ''} 
              onChange={handleChange} 
              onKeyDown={gererToucheEntree} 
              placeholder="Ex: Jael" 
              style={{ width: '100%', backgroundColor: '#121212', border: `1px solid ${erreurs.postNom ? '#FF5252' : '#2A2A2A'}`, borderRadius: '6px', padding: erreurs.postNom ? '0.45rem 6.5rem 0.45rem 0.6rem' : '0.45rem 0.6rem', color: '#FFFFFF', fontSize: '0.8rem', outline: 'none' }}
            />
            {erreurs.postNom && <span style={{ position: 'absolute', right: '0.6rem', color: '#FF5252', fontSize: '0.6rem', fontWeight: 600, backgroundColor: 'rgba(18, 18, 18, 0.85)', padding: '0.1rem 0.2rem', borderRadius: '3px' }}>{erreurs.postNom}</span>}
          </div>
        </div>
        
        {/* Prénom */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', gap: '0.2rem' }}>
          <label style={{ color: '#888888', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', lineHeight: 1.1 }}>Prénom *</label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
            <input 
              ref={el => refs.current.prenom = el} 
              name="prenom" 
              value={formulaire.prenom ?? ''} 
              onChange={handleChange} 
              onKeyDown={gererToucheEntree} 
              placeholder="Ex: Bukasa" 
              style={{ width: '100%', backgroundColor: '#121212', border: `1px solid ${erreurs.prenom ? '#FF5252' : '#2A2A2A'}`, borderRadius: '6px', padding: erreurs.prenom ? '0.45rem 6.5rem 0.45rem 0.6rem' : '0.45rem 0.6rem', color: '#FFFFFF', fontSize: '0.8rem', outline: 'none' }}
            />
            {erreurs.prenom && <span style={{ position: 'absolute', right: '0.6rem', color: '#FF5252', fontSize: '0.6rem', fontWeight: 600, backgroundColor: 'rgba(18, 18, 18, 0.85)', padding: '0.1rem 0.2rem', borderRadius: '3px' }}>{erreurs.prenom}</span>}
          </div>
        </div>

        {/* Numéro / Téléphone (Modifié en type="number") */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', gap: '0.2rem' }}>
          <label style={{ color: '#888888', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', lineHeight: 1.1 }}>Numéro *</label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
            <input 
              ref={el => refs.current.telephone = el} 
              type="number" 
              name="telephone" 
              value={formulaire.telephone ?? ''} 
              onChange={handleChange} 
              onKeyDown={gererToucheEntree} 
              placeholder="Ex: 243..." 
              style={{ width: '100%', backgroundColor: '#121212', border: `1px solid ${erreurs.telephone ? '#FF5252' : '#2A2A2A'}`, borderRadius: '6px', padding: erreurs.telephone ? '0.45rem 6.5rem 0.45rem 0.6rem' : '0.45rem 0.6rem', color: '#FFFFFF', fontSize: '0.8rem', outline: 'none' }}
            />
            {erreurs.telephone && <span style={{ position: 'absolute', right: '0.6rem', color: '#FF5252', fontSize: '0.6rem', fontWeight: 600, backgroundColor: 'rgba(18, 18, 18, 0.85)', padding: '0.1rem 0.2rem', borderRadius: '3px' }}>{erreurs.telephone}</span>}
          </div>
        </div>

        {/* Type de Client */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', gap: '0.2rem' }}>
          <label style={{ color: '#888888', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', lineHeight: 1.1 }}>Type de Client *</label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
            <select 
              ref={el => refs.current.typeClient = el} 
              name="typeClient" 
              value={formulaire.typeClient ?? 'locataire'} 
              onChange={handleChange} 
              onKeyDown={gererToucheEntree} 
              style={{ width: '100%', backgroundColor: '#121212', border: `1px solid ${erreurs.typeClient ? '#FF5252' : '#2A2A2A'}`, borderRadius: '6px', padding: '0.45rem 2.2rem 0.45rem 0.6rem', color: '#FFFFFF', fontSize: '0.8rem', outline: 'none', cursor: 'pointer' }}
            >
              <option value="locataire">Locataire</option>
              <option value="electricite">Électricité</option>
              <option value="eau">Eau</option>
              <option value="divers">Divers</option>
            </select>
          </div>
        </div>

        {/* Matricule */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', gap: '0.2rem' }}>
          <label style={{ color: '#888888', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', lineHeight: 1.1 }}>Matricule (Auto) *</label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
            <input 
              ref={el => refs.current.matricule = el} 
              name="matricule" 
              value={formulaire.matricule ?? ''} 
              readOnly 
              style={{ width: '100%', backgroundColor: '#181818', border: '1px solid #AEEA00', borderRadius: '6px', padding: '0.45rem 0.6rem', color: '#AEEA00', fontWeight: 'bold', fontSize: '0.8rem', cursor: 'not-allowed' }}
            />
          </div>
        </div>

        {/* N° Bail */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', gap: '0.2rem' }}>
          <label style={{ color: '#888888', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', lineHeight: 1.1 }}>N° Bail *</label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
            <input 
              ref={el => refs.current.bail = el} 
              name="bail" 
              value={formulaire.bail ?? ''} 
              onChange={handleChange} 
              onKeyDown={gererToucheEntree} 
              placeholder="Ex: BAIL-001" 
              style={{ width: '100%', backgroundColor: '#121212', border: `1px solid ${erreurs.bail ? '#FF5252' : '#2A2A2A'}`, borderRadius: '6px', padding: erreurs.bail ? '0.45rem 6.5rem 0.45rem 0.6rem' : '0.45rem 0.6rem', color: '#FFFFFF', fontSize: '0.8rem', outline: 'none' }}
            />
            {erreurs.bail && <span style={{ position: 'absolute', right: '0.6rem', color: '#FF5252', fontSize: '0.6rem', fontWeight: 600, backgroundColor: 'rgba(18, 18, 18, 0.85)', padding: '0.1rem 0.2rem', borderRadius: '3px' }}>Requis</span>}
          </div>
        </div>
        
        {/* Date Bail */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', gap: '0.2rem' }}>
          <label style={{ color: '#888888', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', lineHeight: 1.1 }}>Date Bail *</label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
            <input 
              ref={el => refs.current.dateBail = el} 
              type="date" 
              name="dateBail" 
              max="9999-12-31" 
              value={formulaire.dateBail ?? ''} 
              onChange={gererChangementDate} 
              onKeyDown={gererToucheEntree} 
              style={{ width: '100%', backgroundColor: '#121212', border: `1px solid ${erreurs.dateBail ? '#FF5252' : '#2A2A2A'}`, borderRadius: '6px', padding: erreurs.dateBail ? '0.45rem 6.5rem 0.45rem 0.6rem' : '0.45rem 0.6rem', color: '#FFFFFF', fontSize: '0.8rem', outline: 'none' }}
            />
            {erreurs.dateBail && <span style={{ position: 'absolute', right: '0.6rem', color: '#FF5252', fontSize: '0.6rem', fontWeight: 600, backgroundColor: 'rgba(18, 18, 18, 0.85)', padding: '0.1rem 0.2rem', borderRadius: '3px' }}>{erreurs.dateBail}</span>}
          </div>
        </div>

        {/* Logement */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', gap: '0.2rem' }}>
          <label style={{ color: '#888888', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', lineHeight: 1.1 }}>Logement *</label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
            <input 
              ref={el => refs.current.logement = el} 
              name="logement" 
              value={formulaire.logement ?? ''} 
              onChange={handleChange} 
              onKeyDown={gererToucheEntree} 
              placeholder="Ex: A12" 
              style={{ width: '100%', backgroundColor: '#121212', border: `1px solid ${erreurs.logement ? '#FF5252' : '#2A2A2A'}`, borderRadius: '6px', padding: erreurs.logement ? '0.45rem 6.5rem 0.45rem 0.6rem' : '0.45rem 0.6rem', color: '#FFFFFF', fontSize: '0.8rem', outline: 'none' }}
            />
            {erreurs.logement && <span style={{ position: 'absolute', right: '0.6rem', color: '#FF5252', fontSize: '0.6rem', fontWeight: 600, backgroundColor: 'rgba(18, 18, 18, 0.85)', padding: '0.1rem 0.2rem', borderRadius: '3px' }}>{erreurs.logement}</span>}
          </div>
        </div>

        {/* Adresse */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', gap: '0.2rem' }}>
          <label style={{ color: '#888888', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', lineHeight: 1.1 }}>Adresse</label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
            <input 
              ref={el => refs.current.adresse = el} 
              name="adresse" 
              value={formulaire.adresse ?? ''} 
              onChange={handleChange} 
              onKeyDown={gererToucheEntree} 
              style={{ width: '100%', backgroundColor: '#121212', border: '1px solid #2A2A2A', borderRadius: '6px', padding: '0.45rem 0.6rem', color: '#FFFFFF', fontSize: '0.8rem', outline: 'none' }}
            />
          </div>
        </div>

        {/* Pays */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', gap: '0.2rem' }}>
          <label style={{ color: '#888888', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', lineHeight: 1.1 }}>Pays</label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
            <input 
              ref={el => refs.current.pays = el} 
              name="pays" 
              value={formulaire.pays ?? 'RDC'} 
              onChange={handleChange} 
              onKeyDown={gererToucheEntree} 
              style={{ width: '100%', backgroundColor: '#121212', border: '1px solid #2A2A2A', borderRadius: '6px', padding: '0.45rem 0.6rem', color: '#FFFFFF', fontSize: '0.8rem', outline: 'none' }}
            />
          </div>
        </div>

      </div>
    </fieldset>
  );
}