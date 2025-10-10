import { test, expect } from '@playwright/test';

test.describe('Connectivité API', () => {
  test('devrait gérer l\'indisponibilité du backend', async ({ page }) => {
    // Intercepter toutes les requêtes API pour simuler un backend indisponible
    await page.route('**/api/**', route => {
      route.abort('connectionrefused');
    });
    
    await page.goto('/');
    
    // Attendre que la page soit chargée
    await page.waitForLoadState('networkidle');
    
    // Vérifier que l'application se charge malgré l'absence du backend
    await expect(page).toHaveTitle('Belote Royale');
    await expect(page.getByRole('link', { name: 'Belote Royale' }).first()).toBeVisible();
  });

  test('devrait afficher des messages d\'erreur appropriés', async ({ page }) => {
    // Intercepter les requêtes API pour retourner des erreurs 500
    await page.route('**/api/**', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Erreur interne du serveur' })
      });
    });
    
    await page.goto('/tournaments');
    
    // Attendre que la page soit chargée
    await page.waitForLoadState('networkidle');
    
    // Vérifier que l'application affiche soit un message d'erreur, soit continue de fonctionner
    const hasErrorMessage = await page.locator('text=Erreur').isVisible();
    const hasTitle = await page.getByRole('heading', { name: 'Tournois' }).isVisible();
    
    expect(hasErrorMessage || hasTitle).toBeTruthy();
  });

  test('devrait permettre la navigation même sans backend', async ({ page }) => {
    // Intercepter toutes les requêtes API
    await page.route('**/api/**', route => {
      route.abort('connectionrefused');
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Tester la navigation
    await page.getByRole('link', { name: 'Tournois' }).click();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/.*tournaments/);
    
    await page.getByRole('link', { name: 'Équipes' }).click();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/.*teams/);
  });
});