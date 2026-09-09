import { describe, it, expect } from 'vitest';
import {
  calculateCategory,
  getTarif,
  getCategoryLabel,
  calculateFamilyDiscount,
  CATEGORIES,
  TARIFS,
} from './categories';

describe('calculateCategory', () => {
  it('devrait retourner "baby" pour une naissance en 2020', () => {
    expect(calculateCategory('2020-06-15')).toBe('baby');
  });

  it('devrait retourner "baby" pour une naissance en 2021', () => {
    expect(calculateCategory('2021-03-20')).toBe('baby');
  });

  it('devrait retourner "mini-poussin" pour une naissance en 2018', () => {
    expect(calculateCategory('2018-09-10')).toBe('mini-poussin');
  });

  it('devrait retourner "poussin" pour une naissance en 2016', () => {
    expect(calculateCategory('2016-12-25')).toBe('poussin');
  });

  it('devrait retourner "benjamin" pour une naissance en 2014', () => {
    expect(calculateCategory('2014-01-01')).toBe('benjamin');
  });

  it('devrait retourner "minime" pour une naissance en 2012', () => {
    expect(calculateCategory('2012-07-15')).toBe('minime');
  });

  it('devrait retourner "cadet" pour une naissance en 2009', () => {
    expect(calculateCategory('2009-04-20')).toBe('cadet');
  });

  it('devrait retourner "junior" pour une naissance en 2006', () => {
    expect(calculateCategory('2006-11-30')).toBe('junior');
  });

  it('devrait retourner "senior" pour une naissance en 2005', () => {
    expect(calculateCategory('2005-08-15')).toBe('senior');
  });

  it('devrait retourner "senior" pour une naissance avant 2005', () => {
    expect(calculateCategory('1990-01-01')).toBe('senior');
  });

  it('devrait retourner une chaîne vide si aucune date fournie', () => {
    expect(calculateCategory('')).toBe('');
  });
});

describe('getTarif', () => {
  it('devrait retourner 150€ pour baby', () => {
    expect(getTarif('baby')).toBe(150);
  });

  it('devrait retourner 200€ pour mini-poussin', () => {
    expect(getTarif('mini-poussin')).toBe(200);
  });

  it('devrait retourner 200€ pour senior', () => {
    expect(getTarif('senior')).toBe(200);
  });

  it('devrait retourner 185€ pour le 2ème enfant', () => {
    expect(getTarif('poussin', 2)).toBe(185);
  });

  it('devrait retourner 150€ pour le 2ème baby (pas de réduction)', () => {
    expect(getTarif('baby', 2)).toBe(150);
  });

  it('devrait retourner 170€ pour le 3ème enfant', () => {
    expect(getTarif('benjamin', 3)).toBe(170);
  });

  it('devrait retourner 150€ pour le 3ème baby (pas de réduction)', () => {
    expect(getTarif('baby', 3)).toBe(150);
  });

  it('devrait retourner 170€ pour le 4ème enfant', () => {
    expect(getTarif('minime', 4)).toBe(170);
  });

  it('ne devrait pas appliquer de réduction aux seniors même si 2ème enfant', () => {
    expect(getTarif('senior', 2)).toBe(200);
  });

  it('devrait retourner 200€ par défaut pour une catégorie inconnue', () => {
    expect(getTarif('unknown')).toBe(200);
  });
});

describe('getCategoryLabel', () => {
  it('devrait retourner le label complet pour baby', () => {
    expect(getCategoryLabel('baby')).toBe('Éveil Judo / Baby Judo (4-5 ans)');
  });

  it('devrait retourner le label complet pour poussin', () => {
    expect(getCategoryLabel('poussin')).toBe('Poussins (8-9 ans)');
  });

  it('devrait retourner le label complet pour senior', () => {
    expect(getCategoryLabel('senior')).toBe('Seniors (20 ans et +)');
  });

  it('devrait retourner la valeur elle-même si catégorie inconnue', () => {
    expect(getCategoryLabel('unknown')).toBe('unknown');
  });
});

describe('calculateFamilyDiscount', () => {
  it('devrait calculer correctement pour 1 enfant', () => {
    const registrations = [{ category: 'poussin' }];
    const result = calculateFamilyDiscount(registrations);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      category: 'poussin',
      tarif: 200,
      childNumber: 1,
    });
  });

  it('devrait calculer correctement pour 2 enfants', () => {
    const registrations = [
      { category: 'poussin' },
      { category: 'baby' },
    ];
    const result = calculateFamilyDiscount(registrations);

    expect(result).toHaveLength(2);
    expect(result[0].tarif).toBe(200); // 1er enfant
    expect(result[1].tarif).toBe(185); // 2ème enfant
  });

  it('devrait calculer correctement pour 3 enfants', () => {
    const registrations = [
      { category: 'benjamin' },
      { category: 'poussin' },
      { category: 'baby' },
    ];
    const result = calculateFamilyDiscount(registrations);

    expect(result).toHaveLength(3);
    expect(result[0].tarif).toBe(200); // 1er enfant
    expect(result[1].tarif).toBe(185); // 2ème enfant
    expect(result[2].tarif).toBe(170); // 3ème enfant
  });

  it('devrait mettre les seniors à la fin et ne pas leur appliquer de réduction', () => {
    const registrations = [
      { category: 'senior' },
      { category: 'poussin' },
      { category: 'baby' },
    ];
    const result = calculateFamilyDiscount(registrations);

    expect(result).toHaveLength(3);
    expect(result[0].category).toBe('poussin'); // Enfant 1
    expect(result[0].tarif).toBe(200);
    expect(result[1].category).toBe('baby'); // Enfant 2
    expect(result[1].tarif).toBe(185);
    expect(result[2].category).toBe('senior'); // Adulte
    expect(result[2].tarif).toBe(200);
    expect(result[2].childNumber).toBe(0);
  });

  it('devrait gérer correctement 4 enfants', () => {
    const registrations = [
      { category: 'benjamin' },
      { category: 'minime' },
      { category: 'poussin' },
      { category: 'baby' },
    ];
    const result = calculateFamilyDiscount(registrations);

    expect(result).toHaveLength(4);
    expect(result[0].tarif).toBe(200); // 1er
    expect(result[1].tarif).toBe(185); // 2ème
    expect(result[2].tarif).toBe(170); // 3ème
    expect(result[3].tarif).toBe(170); // 4ème
  });
});

describe('CATEGORIES', () => {
  it('devrait contenir 8 catégories', () => {
    expect(CATEGORIES).toHaveLength(8);
  });

  it('devrait avoir toutes les catégories requises', () => {
    const values = CATEGORIES.map(c => c.value);
    expect(values).toContain('baby');
    expect(values).toContain('mini-poussin');
    expect(values).toContain('poussin');
    expect(values).toContain('benjamin');
    expect(values).toContain('minime');
    expect(values).toContain('cadet');
    expect(values).toContain('junior');
    expect(values).toContain('senior');
  });
});

describe('TARIFS', () => {
  it('devrait avoir le bon tarif pour baby', () => {
    expect(TARIFS.baby).toBe(150);
  });

  it('devrait avoir 200€ pour toutes les autres catégories', () => {
    expect(TARIFS['mini-poussin']).toBe(200);
    expect(TARIFS.poussin).toBe(200);
    expect(TARIFS.benjamin).toBe(200);
    expect(TARIFS.minime).toBe(200);
    expect(TARIFS.cadet).toBe(200);
    expect(TARIFS.junior).toBe(200);
    expect(TARIFS.senior).toBe(200);
  });
});
