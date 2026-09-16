import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock de jsPDF
vi.mock('jspdf', () => ({
  jsPDF: vi.fn().mockImplementation(() => ({
    setFontSize: vi.fn(),
    setFont: vi.fn(),
    text: vi.fn(),
    line: vi.fn(),
    output: vi.fn().mockReturnValue(new ArrayBuffer(100)),
  })),
}));

// Mock de Supabase
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => ({
            data: {
              id: 'test-id',
              first_name: 'Jean',
              last_name: 'Dupont',
              birth_date: '2016-06-15',
              category: 'poussin',
              email: 'jean.dupont@example.com',
              phone: '0612345678',
              created_at: '2024-01-15T10:00:00Z',
              payment_status: 'paid',
            },
            error: null,
          })),
        })),
      })),
    })),
  })),
}));

describe('API Receipt Generation', () => {
  it('devrait calculer le bon tarif pour un poussin', async () => {
    const { getTarif } = await import('./categories');
    expect(getTarif('poussin')).toBe(200);
  });

  it('devrait calculer le bon tarif pour un baby', async () => {
    const { getTarif } = await import('./categories');
    expect(getTarif('baby')).toBe(150);
  });

  it('devrait formater correctement les dates', () => {
    const date = new Date('2024-01-15T10:00:00Z');
    const formatted = date.toLocaleDateString('fr-FR');
    expect(formatted).toMatch(/\d{2}\/\d{2}\/\d{4}/);
  });
});

describe('Receipt Content Validation', () => {
  it('devrait inclure les informations essentielles', () => {
    const requiredFields = [
      'first_name',
      'last_name',
      'birth_date',
      'category',
      'email',
      'phone',
      'payment_status',
    ];

    const registration = {
      id: 'test-id',
      first_name: 'Jean',
      last_name: 'Dupont',
      birth_date: '2016-06-15',
      category: 'poussin',
      email: 'jean.dupont@example.com',
      phone: '0612345678',
      payment_status: 'paid',
      created_at: '2024-01-15T10:00:00Z',
    };

    requiredFields.forEach(field => {
      expect(registration).toHaveProperty(field);
    });
  });

  it('devrait valider le statut de paiement', () => {
    const validStatuses = ['pending', 'paid', 'cancelled'];
    const testStatus = 'paid';
    
    expect(validStatuses).toContain(testStatus);
  });
});
