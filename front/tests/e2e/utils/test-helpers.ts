import { Page, expect } from '@playwright/test';

export class TestHelpers {
  constructor(private page: Page) {}

  /**
   * Attendre qu'un élément soit visible et cliquable
   */
  async waitAndClick(selector: string) {
    await this.page.waitForSelector(selector, { state: 'visible' });
    await this.page.click(selector);
  }

  /**
   * Remplir un formulaire avec des données
   */
  async fillForm(formData: Record<string, string>) {
    for (const [field, value] of Object.entries(formData)) {
      await this.page.fill(`[name="${field}"]`, value);
    }
  }

  /**
   * Vérifier qu'une notification/toast apparaît
   */
  async expectNotification(message: string) {
    await expect(this.page.locator('.notification, .toast, .alert')).toContainText(message);
  }

  /**
   * Attendre que la page soit complètement chargée
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Prendre une capture d'écran avec un nom personnalisé
   */
  async takeScreenshot(name: string) {
    await this.page.screenshot({ path: `tests/screenshots/${name}.png` });
  }

  /**
   * Naviguer vers une page via la sidebar
   */
  async navigateToPage(pageName: 'Accueil' | 'Tournois' | 'Équipes' | 'Matchs') {
    await this.page.click(`text=${pageName}`);
    await this.waitForPageLoad();
  }

  /**
   * Vérifier que nous sommes sur la bonne page
   */
  async expectCurrentPage(urlPattern: string | RegExp) {
    await expect(this.page).toHaveURL(urlPattern);
  }

  /**
   * Attendre qu'un élément soit visible ou qu'un message d'erreur apparaisse
   */
  async waitForContentOrError(contentSelector: string, timeout: number = 10000) {
    try {
      await this.page.waitForSelector(contentSelector, { timeout });
      return 'content';
    } catch {
      // Vérifier s'il y a un message d'erreur
      const errorSelectors = [
        'text=Erreur',
        'text=Impossible de charger',
        'text=Connexion échouée',
        '[data-testid="error-message"]'
      ];
      
      for (const selector of errorSelectors) {
        if (await this.page.locator(selector).isVisible()) {
          return 'error';
        }
      }
      
      throw new Error(`Ni le contenu ni un message d'erreur n'ont été trouvés`);
    }
  }
}