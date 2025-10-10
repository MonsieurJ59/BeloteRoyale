# Tests E2E avec Playwright

Ce dossier contient les tests end-to-end (E2E) pour l'application BeloteRoyale.

## Installation

Les dépendances Playwright sont déjà incluses dans le package.json. Pour installer les navigateurs :

```bash
npx playwright install
```

## Exécution des tests

### Tests en mode headless (par défaut)
```bash
npm run test:e2e
```

### Tests avec interface graphique
```bash
npm run test:e2e:ui
```

### Tests en mode debug
```bash
npm run test:e2e:debug
```

### Tests avec navigateur visible
```bash
npm run test:e2e:headed
```

### Voir le rapport des tests
```bash
npm run test:e2e:report
```

## Structure des tests

- `homepage.spec.ts` - Tests de la page d'accueil
- `tournaments.spec.ts` - Tests de gestion des tournois
- `teams.spec.ts` - Tests de gestion des équipes
- `tournament-workflow.spec.ts` - Tests d'intégration complets
- `utils/test-helpers.ts` - Utilitaires pour les tests

## Configuration

La configuration Playwright se trouve dans `playwright.config.ts` à la racine du projet frontend.

## Bonnes pratiques

1. **Sélecteurs stables** : Utilisez des attributs `data-testid` pour les éléments importants
2. **Tests isolés** : Chaque test doit être indépendant
3. **Données de test** : Utilisez des données de test dédiées
4. **Attentes explicites** : Utilisez `await expect()` pour les vérifications
5. **Nettoyage** : Nettoyez les données créées pendant les tests

## Exemples d'utilisation

### Ajouter un data-testid à un élément
```tsx
<button data-testid="create-tournament-btn">Créer un tournoi</button>
```

### Utiliser le data-testid dans un test
```typescript
await page.click('[data-testid="create-tournament-btn"]');
```

### Vérifier qu'un élément contient du texte
```typescript
await expect(page.locator('[data-testid="tournament-title"]')).toContainText('Mon Tournoi');
```