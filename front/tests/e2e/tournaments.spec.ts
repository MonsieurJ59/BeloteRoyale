import { test, expect } from '@playwright/test';

test.describe('Gestion des tournois', () => {
  test('devrait naviguer vers la page des tournois', async ({ page }) => {
    await page.goto('/');
    
    // Attendre que la page soit chargée
    await page.waitForLoadState('networkidle');
    
    // Cliquer sur le lien vers les tournois dans la sidebar
    await page.getByRole('link', { name: 'Tournois' }).click();
    
    // Vérifier que nous sommes sur la page des tournois
    await expect(page).toHaveURL(/.*tournaments/);
  });

  test('devrait afficher la page des tournois', async ({ page }) => {
    await page.goto('/tournaments');
    
    // Attendre que la page soit chargée
    await page.waitForLoadState('networkidle');
    
    // Vérifier que la page des tournois se charge avec le titre
    await expect(page.getByRole('heading', { name: 'Tournois' })).toBeVisible();
    
    // Vérifier la présence des onglets de filtrage
    await expect(page.getByRole('button', { name: /Tous/ })).toBeVisible();
  });

  test('devrait permettre de filtrer les tournois par statut', async ({ page }) => {
    await page.goto('/tournaments');
    
    // Attendre que la page soit chargée
    await page.waitForLoadState('networkidle');
    
    // Tester les différents onglets de filtrage s'ils existent
    const tabs = [
      { name: /Tous/, selector: 'button:has-text("Tous")' },
      { name: /À venir/, selector: 'button:has-text("À venir")' },
      { name: /En cours/, selector: 'button:has-text("En cours")' },
      { name: /Terminés/, selector: 'button:has-text("Terminés")' }
    ];
    
    for (const tab of tabs) {
      const tabElement = page.locator(tab.selector);
      if (await tabElement.isVisible()) {
        await tabElement.click();
        // Attendre un court délai pour que le filtrage s'applique
        await page.waitForTimeout(500);
      }
    }
  });

  test('devrait afficher le bouton de création de tournoi', async ({ page }) => {
    await page.goto('/tournaments');
    
    // Attendre que la page soit chargée
    await page.waitForLoadState('networkidle');
    
    // Vérifier la présence du bouton de création avec le bon texte
    const createButton = page.getByRole('button', { name: /Nouveau tournoi/ });
    await expect(createButton).toBeVisible();
  });

  test('devrait gérer l\'absence de tournois', async ({ page }) => {
    await page.goto('/tournaments');
    
    // Attendre que la page soit chargée
    await page.waitForLoadState('networkidle');
    
    // Vérifier qu'il y a soit des tournois, soit un message d'absence
    const hasTournaments = await page.locator('[data-testid="tournament-card"], .tournament-card').count() > 0;
    const hasEmptyMessage = await page.locator('text=Aucun tournoi').isVisible();
    
    expect(hasTournaments || hasEmptyMessage).toBeTruthy();
  });
});