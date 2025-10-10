import { test, expect } from '@playwright/test';

test.describe('Page d\'accueil', () => {
  test('devrait charger la page d\'accueil', async ({ page }) => {
    await page.goto('/');
    
    // Vérifier que la page se charge correctement avec le bon titre
    await expect(page).toHaveTitle('Belote Royale');
  });

  test('devrait afficher les éléments principaux de navigation', async ({ page }) => {
    await page.goto('/');
    
    // Attendre que la page soit chargée
    await page.waitForLoadState('networkidle');
    
    // Vérifier la présence de la sidebar
    await expect(page.locator('[data-testid="sidebar"], nav')).toBeVisible();
    
    // Vérifier les liens de navigation principaux avec des sélecteurs plus spécifiques
    await expect(page.getByRole('link', { name: 'Accueil' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Tournois' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Équipes' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Matchs' })).toBeVisible();
  });

  test('devrait afficher le logo Belote Royale', async ({ page }) => {
    await page.goto('/');
    
    // Attendre que la page soit chargée
    await page.waitForLoadState('networkidle');
    
    // Vérifier que le logo est visible avec un sélecteur plus spécifique
    await expect(page.getByRole('link', { name: 'Belote Royale' }).first()).toBeVisible();
  });

  test('devrait être responsive sur mobile', async ({ page }) => {
    // Simuler un viewport mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Attendre que la page soit chargée
    await page.waitForLoadState('networkidle');
    
    // Vérifier que la page s'affiche correctement sur mobile
    await expect(page.locator('body')).toBeVisible();
    
    // Sur mobile, la sidebar pourrait être collapsée mais toujours présente
    await expect(page.locator('[data-testid="sidebar"], nav')).toBeVisible();
  });
});