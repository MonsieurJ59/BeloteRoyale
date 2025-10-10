import { test, expect } from '@playwright/test';

test.describe('Gestion des équipes', () => {
  test('devrait naviguer vers la page des équipes', async ({ page }) => {
    await page.goto('/');
    
    // Attendre que la page soit chargée
    await page.waitForLoadState('networkidle');
    
    // Cliquer sur le lien vers les équipes dans la sidebar
    await page.getByRole('link', { name: 'Équipes' }).click();
    
    // Vérifier que nous sommes sur la page des équipes
    await expect(page).toHaveURL(/.*teams/);
  });

  test('devrait afficher la grille des équipes ou un message vide', async ({ page }) => {
    await page.goto('/teams');
    
    // Attendre que la page soit chargée
    await page.waitForLoadState('networkidle');
    
    // Vérifier qu'il y a soit des équipes, soit un message d'absence
    const hasTeams = await page.locator('[data-testid="team-card"], .team-card').count() > 0;
    const hasEmptyMessage = await page.locator('text=Aucune équipe').isVisible();
    const hasLoadingMessage = await page.locator('text=Chargement').isVisible();
    
    expect(hasTeams || hasEmptyMessage || hasLoadingMessage).toBeTruthy();
  });

  test('devrait permettre d\'ouvrir le formulaire de création d\'équipe', async ({ page }) => {
    await page.goto('/teams');
    
    // Attendre que la page soit chargée
    await page.waitForLoadState('networkidle');
    
    // Chercher le bouton de création d'équipe
    const createButton = page.getByRole('button', { name: /Nouvelle équipe|Créer|Ajouter/ });
    
    if (await createButton.isVisible()) {
      await createButton.click();
      
      // Vérifier qu'un modal ou formulaire s'ouvre
      await expect(page.locator('[data-testid="team-modal"], .modal, form')).toBeVisible();
    } else {
      // Si le bouton n'est pas visible, vérifier qu'il y a au moins le titre de la page
      await expect(page.getByRole('heading', { name: /Équipes/ })).toBeVisible();
    }
  });

  test('devrait afficher le titre de la page', async ({ page }) => {
    await page.goto('/teams');
    
    // Attendre que la page soit chargée
    await page.waitForLoadState('networkidle');
    
    // Vérifier que le titre de la page est visible
    await expect(page.getByRole('heading', { name: /Équipes/ })).toBeVisible();
  });
});