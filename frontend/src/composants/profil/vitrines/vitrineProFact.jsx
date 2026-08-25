import React from 'react';
import styled from 'styled-components';

const SectionVitrine = styled.div`
  flex: 1.2;
  background: radial-gradient(circle at 20% 20%, rgba(174, 234, 0, 0.08) 0%, rgba(18, 18, 18, 0.6) 60%, rgba(0, 0, 0, 1) 100%);
  border-left: 1px solid #2A2A2A;
  padding: 3rem 4rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  overflow: hidden;

  @media (max-width: 968px) {
    display: none;
  }
`;

const VitrineContenu = styled.div`
  max-width: 480px;
  z-index: 2;
  margin: auto;
`;

const BadgeProFact = styled.span`
  display: inline-block;
  padding: 0.35rem 0.75rem;
  background-color: rgba(174, 234, 0, 0.1);
  color: #AEEA00;
  border: 1px solid rgba(174, 234, 0, 0.3);
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 1.2rem;
`;

const VitrineTitre = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 0.8rem;
  color: #FFFFFF;

  span {
    color: #AEEA00;
  }
`;

const VitrineDescription = styled.p`
  font-size: 0.95rem;
  color: #AAAAAA;
  line-height: 1.5;
  margin-bottom: 2rem;
`;

const CarteCarrousel = styled.div`
  background-color: rgba(18, 18, 18, 0.7);
  border: 1px solid #2A2A2A;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  backdrop-filter: blur(10px);
`;

const IconeCoche = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: rgba(174, 234, 0, 0.15);
  color: #AEEA00;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  flex-shrink: 0;
  margin-top: 0.1rem;
`;

const TexteFonctionnalite = styled.div`
  h4 {
    font-size: 1rem;
    font-weight: 600;
    color: #FFFFFF;
    margin-bottom: 0.3rem;
  }

  p {
    font-size: 0.85rem;
    color: #888888;
    line-height: 1.4;
  }
`;

const IndicateursConteneur = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1.5rem;
`;

const PointIndicateur = styled.div`
  width: ${(props) => (props.$actif ? '24px' : '8px')};
  height: 8px;
  border-radius: 4px;
  background-color: ${(props) => (props.$actif ? '#AEEA00' : '#2A2A2A')};
  transition: all 0.3s ease;
`;

export default function VitrineProFact({ fonctionnaliteActive, indexActif, totalIndicateurs }) {
  return (
    <SectionVitrine>
      <VitrineContenu>
        <BadgeProFact>ProFact Application</BadgeProFact>
        <VitrineTitre>
          Simplifiez la gestion de vos <span>biens et factures</span> en un clin d'œil.
        </VitrineTitre>
        <VitrineDescription>
          ProFact centralise l'ensemble de vos opérations locatives pour vous faire gagner du temps et sécuriser vos revenus.
        </VitrineDescription>

        <CarteCarrousel>
          <IconeCoche>✓</IconeCoche>
          <TexteFonctionnalite>
            <h4>{fonctionnaliteActive.titre}</h4>
            <p>{fonctionnaliteActive.description}</p>
          </TexteFonctionnalite>
        </CarteCarrousel>

        <IndicateursConteneur>
          {Array.from({ length: totalIndicateurs }).map((_, index) => (
            <PointIndicateur key={index} $actif={index === indexActif} />
          ))}
        </IndicateursConteneur>
      </VitrineContenu>
    </SectionVitrine>
  );
}