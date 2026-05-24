import { describe, it, expect } from 'vitest';
import { z } from 'zod';

// Schémas de validation simplifiés pour les tests
const registrationSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  birthDate: z.string().min(1, "La date de naissance est requise"),
  category: z.string().min(1, "Catégorie requise"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(10, "Numéro de téléphone invalide"),
});

const childSchema = z.object({
  firstName: z.string().min(2, "Prénom requis"),
  lastName: z.string().min(2, "Nom requis"),
  birthDate: z.string().min(1, "Date de naissance requise"),
  category: z.string().min(1, "Catégorie requise"),
});

describe('Validation des formulaires', () => {
  describe('Schéma d\'inscription simple', () => {
    it('devrait valider des données correctes', () => {
      const validData = {
        firstName: 'Jean',
        lastName: 'Dupont',
        birthDate: '2016-06-15',
        category: 'poussin',
        email: 'jean.dupont@example.com',
        phone: '0612345678',
      };

      const result = registrationSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('devrait rejeter un prénom trop court', () => {
      const invalidData = {
        firstName: 'J',
        lastName: 'Dupont',
        birthDate: '2016-06-15',
        category: 'poussin',
        email: 'jean.dupont@example.com',
        phone: '0612345678',
      };

      const result = registrationSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('au moins 2 caractères');
      }
    });

    it('devrait rejeter un email invalide', () => {
      const invalidData = {
        firstName: 'Jean',
        lastName: 'Dupont',
        birthDate: '2016-06-15',
        category: 'poussin',
        email: 'email-invalide',
        phone: '0612345678',
      };

      const result = registrationSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Email invalide');
      }
    });

    it('devrait rejeter un téléphone trop court', () => {
      const invalidData = {
        firstName: 'Jean',
        lastName: 'Dupont',
        birthDate: '2016-06-15',
        category: 'poussin',
        email: 'jean.dupont@example.com',
        phone: '06123',
      };

      const result = registrationSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('téléphone invalide');
      }
    });

    it('devrait rejeter une date de naissance vide', () => {
      const invalidData = {
        firstName: 'Jean',
        lastName: 'Dupont',
        birthDate: '',
        category: 'poussin',
        email: 'jean.dupont@example.com',
        phone: '0612345678',
      };

      const result = registrationSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('devrait rejeter une catégorie vide', () => {
      const invalidData = {
        firstName: 'Jean',
        lastName: 'Dupont',
        birthDate: '2016-06-15',
        category: '',
        email: 'jean.dupont@example.com',
        phone: '0612345678',
      };

      const result = registrationSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('Schéma enfant (inscription familiale)', () => {
    it('devrait valider des données enfant correctes', () => {
      const validChild = {
        firstName: 'Lucas',
        lastName: 'Martin',
        birthDate: '2018-03-20',
        category: 'mini-poussin',
      };

      const result = childSchema.safeParse(validChild);
      expect(result.success).toBe(true);
    });

    it('devrait rejeter un enfant sans prénom', () => {
      const invalidChild = {
        firstName: '',
        lastName: 'Martin',
        birthDate: '2018-03-20',
        category: 'mini-poussin',
      };

      const result = childSchema.safeParse(invalidChild);
      expect(result.success).toBe(false);
    });
  });

  describe('Validation des emails', () => {
    const emailSchema = z.string().email();

    it('devrait accepter des emails valides', () => {
      const validEmails = [
        'test@example.com',
        'user.name@example.fr',
        'contact+judo@jc7.fr',
        'admin@sub.domain.com',
      ];

      validEmails.forEach(email => {
        expect(emailSchema.safeParse(email).success).toBe(true);
      });
    });

    it('devrait rejeter des emails invalides', () => {
      const invalidEmails = [
        'notanemail',
        '@example.com',
        'user@',
        'user @example.com',
        'user@example',
      ];

      invalidEmails.forEach(email => {
        expect(emailSchema.safeParse(email).success).toBe(false);
      });
    });
  });

  describe('Validation des téléphones', () => {
    const phoneSchema = z.string().min(10);

    it('devrait accepter des numéros valides', () => {
      const validPhones = [
        '0612345678',
        '01 23 45 67 89',
        '+33612345678',
      ];

      validPhones.forEach(phone => {
        expect(phoneSchema.safeParse(phone).success).toBe(true);
      });
    });

    it('devrait rejeter des numéros trop courts', () => {
      const invalidPhones = [
        '06123',
        '123',
        '',
      ];

      invalidPhones.forEach(phone => {
        expect(phoneSchema.safeParse(phone).success).toBe(false);
      });
    });
  });
});

describe('Validation des modes de paiement', () => {
  const paymentMethodSchema = z.enum(['carte', 'cheque', 'especes']);

  it('devrait accepter les modes de paiement valides', () => {
    expect(paymentMethodSchema.safeParse('carte').success).toBe(true);
    expect(paymentMethodSchema.safeParse('cheque').success).toBe(true);
    expect(paymentMethodSchema.safeParse('especes').success).toBe(true);
  });

  it('devrait rejeter les modes de paiement invalides', () => {
    expect(paymentMethodSchema.safeParse('paypal').success).toBe(false);
    expect(paymentMethodSchema.safeParse('virement').success).toBe(false);
    expect(paymentMethodSchema.safeParse('').success).toBe(false);
  });
});

describe('Validation des statuts de paiement', () => {
  const paymentStatusSchema = z.enum(['pending', 'paid', 'cancelled']);

  it('devrait accepter les statuts valides', () => {
    expect(paymentStatusSchema.safeParse('pending').success).toBe(true);
    expect(paymentStatusSchema.safeParse('paid').success).toBe(true);
    expect(paymentStatusSchema.safeParse('cancelled').success).toBe(true);
  });

  it('devrait rejeter les statuts invalides', () => {
    expect(paymentStatusSchema.safeParse('processing').success).toBe(false);
    expect(paymentStatusSchema.safeParse('refunded').success).toBe(false);
    expect(paymentStatusSchema.safeParse('').success).toBe(false);
  });
});
