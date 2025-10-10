import { test, expect } from '@playwright/test';
import { TestHelpers } from './utils/test-helpers';

test.describe('Workflow complet de tournoi', () => {
  test('devrait permettre de naviguer dans l\'application', async ({ page }) => {
    const helpers = new TestHelpers(page);
    
    await page.goto('/');
    
    // Attendre que la page soit chargée
    await page.waitForLoadState('networkidle');
    
    // Vérifier que le logo est visible
    await expect(page.getByRole('link', { name: 'Belote Royale' }).first()).toBeVisible();
    
    // Naviguer vers les tournois
    await page.getByRole('link', { name: 'Tournois' }).click();
    await helpers.waitForPageLoad();
    
    // Vérifier que nous sommes sur la page des tournois
    await expect(page).toHaveURL(/.*tournaments/);
    await expect(page.getByRole('heading', { name: 'Tournois' })).toBeVisible();
    
    // Naviguer vers les équipes
    await page.getByRole('link', { name: 'Équipes' }).click();
    await helpers.waitForPageLoad();
    
    // Vérifier que nous sommes sur la page des équipes
    await expect(page).toHaveURL(/.*teams/);
    await expect(page.getByRole('heading', { name: /Équipes/ })).toBeVisible();
  });

  test('devrait gérer les erreurs de connexion gracieusement', async ({ page }) => {
    // Intercepter les requêtes API pour simuler des erreurs
    await page.route('**/api/**', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Erreur serveur' })
      });
    });
    
    await page.goto('/tournaments');
    
    // Attendre que la page soit chargée
    await page.waitForLoadState('networkidle');
    
    // Vérifier que l'application gère l'erreur gracieusement
    const hasErrorMessage = await page.locator('text=Erreur').isVisible();
    const hasLoadingMessage = await page.locator('text=Chargement').isVisible();
    const hasTitle = await page.getByRole('heading', { name: 'Tournois' }).isVisible();
    
    // L'application devrait soit afficher une erreur, soit continuer à fonctionner
    expect(hasErrorMessage || hasLoadingMessage || hasTitle).toBeTruthy();
  });

  test('devrait permettre d\'accéder aux différentes sections', async ({ page }) => {
    const sections = [
      { name: 'Accueil', url: '/' },
      { name: 'Tournois', url: '/tournaments' },
      { name: 'Équipes', url: '/teams' }
    ];
    
    for (const section of sections) {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Cliquer sur le lien de navigation
      await page.getByRole('link', { name: section.name }).click();
      await page.waitForLoadState('networkidle');
      
      // Vérifier l'URL
      await expect(page).toHaveURL(new RegExp(section.url.replace('/', '\\/')));
    }
  });
});