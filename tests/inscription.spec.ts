import { test, expect } from '@playwright/test';

test.describe('Page d\'inscription', () => {
  test('devrait afficher le choix entre inscription simple et familiale', async ({ page }) => {
    await page.goto('/inscription');

    await expect(page.getByRole('heading', { name: 'Inscription JC7' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Inscription simple' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Inscription familiale' })).toBeVisible();
  });

  test('devrait naviguer vers le formulaire simple', async ({ page }) => {
    await page.goto('/inscription');

    await page.getByRole('button', { name: /Inscription simple/i }).click();

    await expect(page.getByRole('heading', { name: 'Inscription simple' })).toBeVisible();
    await expect(page.getByText('Retour au choix')).toBeVisible();
  });

  test('devrait naviguer vers le formulaire familial', async ({ page }) => {
    await page.goto('/inscription');

    await page.getByRole('button', { name: /Inscription familiale/i }).click();

    await expect(page.getByRole('heading', { name: 'Inscription familiale' })).toBeVisible();
    await expect(page.getByText('Retour au choix')).toBeVisible();
  });
});

test.describe('Formulaire d\'inscription simple', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/inscription');
    await page.getByRole('button', { name: /Inscription simple/i }).click();
  });

  test('devrait calculer automatiquement la catégorie pour un baby', async ({ page }) => {
    await page.fill('input[id="birthDate"]', '2020-06-15');

    const categoryInput = page.locator('input[id="category"]');
    await expect(categoryInput).toHaveValue(/Baby Judo/);
    await expect(page.getByText('Montant : 150 €')).toBeVisible();
  });

  test('devrait calculer automatiquement la catégorie pour un poussin', async ({ page }) => {
    await page.fill('input[id="birthDate"]', '2016-03-20');

    const categoryInput = page.locator('input[id="category"]');
    await expect(categoryInput).toHaveValue(/Poussins/);
    await expect(page.getByText('Montant : 200 €')).toBeVisible();
  });

  test('devrait calculer automatiquement la catégorie pour un senior', async ({ page }) => {
    await page.fill('input[id="birthDate"]', '2000-01-01');

    const categoryInput = page.locator('input[id="category"]');
    await expect(categoryInput).toHaveValue(/Seniors/);
    await expect(page.getByText('Montant : 200 €')).toBeVisible();
  });

  test('le champ catégorie devrait être désactivé', async ({ page }) => {
    const categoryInput = page.locator('input[id="category"]');
    await expect(categoryInput).toBeDisabled();
  });

  test('devrait afficher les champs obligatoires', async ({ page }) => {
    await expect(page.getByLabel(/Nom \*/)).toBeVisible();
    await expect(page.getByLabel(/Prénom \*/)).toBeVisible();
    await expect(page.getByLabel(/Date de naissance \*/)).toBeVisible();
    await expect(page.getByLabel(/Adresse \*/)).toBeVisible();
    await expect(page.getByLabel(/Code postal \*/)).toBeVisible();
    await expect(page.getByLabel(/Ville \*/)).toBeVisible();
  });
});

test.describe('Formulaire d\'inscription familiale', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/inscription');
    await page.getByRole('button', { name: /Inscription familiale/i }).click();
  });

  test('devrait afficher un enfant par défaut', async ({ page }) => {
    await expect(page.getByText('Enfant 1')).toBeVisible();
  });

  test('devrait permettre d\'ajouter un enfant', async ({ page }) => {
    await page.getByRole('button', { name: /Ajouter un enfant/i }).click();

    await expect(page.getByText('Enfant 1')).toBeVisible();
    await expect(page.getByText('Enfant 2')).toBeVisible();
  });

  test('devrait permettre de supprimer un enfant', async ({ page }) => {
    await page.getByRole('button', { name: /Ajouter un enfant/i }).click();
    await expect(page.getByText('Enfant 2')).toBeVisible();

    const deleteButtons = page.locator('button:has(svg)').filter({ hasText: '' });
    await deleteButtons.first().click();

    await expect(page.getByText('Enfant 2')).not.toBeVisible();
  });

  test('devrait calculer le tarif pour chaque enfant', async ({ page }) => {
    await page.locator('input[name="children.0.birthDate"]').fill('2016-06-15');
    await expect(page.getByText('Tarif pour cet enfant : 200 €')).toBeVisible();

    await page.getByRole('button', { name: /Ajouter un enfant/i }).click();
    await page.locator('input[name="children.1.birthDate"]').fill('2018-03-20');
    
    const tarifs = page.getByText(/Tarif pour cet enfant :/);
    await expect(tarifs).toHaveCount(2);
  });

  test('devrait afficher le message de réduction pour le 2ème enfant', async ({ page }) => {
    await page.locator('input[name="children.0.birthDate"]').fill('2016-06-15');
    
    await page.getByRole('button', { name: /Ajouter un enfant/i }).click();
    await page.locator('input[name="children.1.birthDate"]').fill('2018-03-20');

    await expect(page.getByText('(réduction appliquée)')).toBeVisible();
  });

  test('devrait afficher le total à payer', async ({ page }) => {
    await page.locator('input[name="children.0.birthDate"]').fill('2016-06-15');
    
    await expect(page.getByText(/Total à payer :/)).toBeVisible();
  });

  test('devrait afficher les informations sur les réductions familiales', async ({ page }) => {
    await page.getByRole('button', { name: /Ajouter un enfant/i }).click();

    await expect(page.getByText(/Réductions familiales/)).toBeVisible();
    await expect(page.getByText(/1er enfant : tarif normal/)).toBeVisible();
    await expect(page.getByText(/2ème enfant : 185 €/)).toBeVisible();
    await expect(page.getByText(/3ème enfant et plus : 170 €/)).toBeVisible();
  });
});

test.describe('Modes de paiement', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/inscription');
    await page.getByRole('button', { name: /Inscription simple/i }).click();
  });

  test('devrait afficher les 3 modes de paiement', async ({ page }) => {
    await expect(page.getByText('Carte bancaire')).toBeVisible();
    await expect(page.getByText('Chèque')).toBeVisible();
    await expect(page.getByText('Espèces')).toBeVisible();
  });
});
