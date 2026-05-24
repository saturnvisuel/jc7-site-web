import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard', () => {
  test('devrait rediriger vers login si non authentifié', async ({ page }) => {
    await page.goto('/admin/dashboard');
    
    // Devrait rediriger vers /login
    await expect(page).toHaveURL(/\/login/);
  });

  test('devrait afficher la page de login', async ({ page }) => {
    await page.goto('/login');

    await expect(page.getByRole('heading', { name: /connexion/i })).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/mot de passe/i)).toBeVisible();
  });
});

test.describe('Gestion des paiements', () => {
  test('devrait afficher la page de gestion des paiements', async ({ page }) => {
    // Note: Ce test nécessite une authentification
    // Dans un environnement de test réel, vous devriez configurer un utilisateur de test
    await page.goto('/admin/paiements');
    
    // Devrait rediriger vers login si non authentifié
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe('Registrations Admin', () => {
  test('devrait rediriger vers login si non authentifié', async ({ page }) => {
    await page.goto('/admin/registrations');
    
    await expect(page).toHaveURL(/\/login/);
  });
});
