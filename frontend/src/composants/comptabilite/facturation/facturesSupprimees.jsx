import React, { useMemo } from 'react';
import styled from 'styled-components';

const THEME = {
  fondCarte: '#1E1E1E',
  textePrincipal: '#FFFFFF',
  texteSecondaire: '#888888',
  bordure: '#2A2A2A',
  fondChamp: '#121212',
  erreur: '#FF5252',
  succes: '#81C784',
  accentuation: '#AEEA00'
};

const PanneauFiltres = styled.div`
  background-color: ${THEME.fondCarte};
  border: 1px solid ${THEME.bordure};
  border-radius: 12px;
  padding: 1.2rem;
  display: flex;
  gap: 1rem;
  align-items: flex-end;
  margin-bottom: 1.5rem;
`;

const GroupeFiltre = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  flex: 1;
`;

const Etiquette = styled.label`
  color: ${THEME.texteSecondaire};
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
`;

const EntreeTexte = styled.input`
  background-color: ${THEME.fondChamp};
  border: 1px solid ${THEME.bordure};
  border-radius: 8px;
  padding: 0.65rem 0.8rem;
  color: ${THEME.textePrincipal};
  font-size: 0.85rem;

  &:focus {
    outline: none;
    border-color: ${THEME.accentuation};
  }
`;

const TableauFacturesStyle = styled.table`
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

const BoutonActionPetit = styled.button`
  background: transparent;
  border: 1px solid ${props => props.$couleur || THEME.bordure};
  color: ${props => props.$couleur || THEME.textePrincipal};
  padding: 0.35rem 0.65rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  margin-right: 0.5rem;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => props.$couleur || THEME.textePrincipal};
    color: #000000;
  }
`;

export default function FacturesSupprimees({
  facturesSupprimees,
  restaurerFacture,
  supprimerDefinitivement,
  formaterDateFr,
  rechercheFacture,
  setRechercheFacture
}) {
  const facturesSupprimeesFiltrees = useMemo(() => {
    return facturesSupprimees.filter(facture => {
      if (!rechercheFacture) return true;
      const terme = rechercheFacture.toLowerCase();
      return (
        facture.numero.toLowerCase().includes(terme) ||
        facture.locataire.toLowerCase().includes(terme)
      );
    });
  }, [facturesSupprimees, rechercheFacture]);

  return (
    <>
      <PanneauFiltres>
        <GroupeFiltre>
          <Etiquette>Rechercher dans la corbeille</Etiquette>
          <EntreeTexte 
            type="text" 
            placeholder="N° Facture ou Locataire..." 
            value={rechercheFacture} 
            onChange={(e) => setRechercheFacture(e.target.value)} 
          />
        </GroupeFiltre>
      </PanneauFiltres>

      <TableauFacturesStyle>
        <thead>
          <tr>
            <th>N° Facture</th>
            <th>Locataire / Client</th>
            <th>Date</th>
            <th>Montant</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {facturesSupprimeesFiltrees.length > 0 ? (
            facturesSupprimeesFiltrees.map((f) => (
              <tr key={f.id}>
                <td>{f.numero}</td>
                <td>{f.locataire}</td>
                <td>{formaterDateFr ? formaterDateFr(f.dateFacture) : f.dateFacture}</td>
                <td>{f.montant}</td>
                <td style={{ color: THEME.texteSecondaire }}>Supprimée</td>
                <td>
                  <BoutonActionPetit $couleur={THEME.succes} onClick={() => restaurerFacture(f.id)}>
                    Restaurer
                  </BoutonActionPetit>
                  <BoutonActionPetit $couleur={THEME.erreur} onClick={() => supprimerDefinitivement(f.id)}>
                    Supprimer définitivement
                  </BoutonActionPetit>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center', padding: '1.5rem' }}>
                La corbeille des factures est vide.
              </td>
            </tr>
          )}
        </tbody>
      </TableauFacturesStyle>
    </>
  );
}