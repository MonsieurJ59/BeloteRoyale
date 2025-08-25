// Importation des modules nécessaires
import { StrictMode } from 'react' // Composant React pour activer le mode strict
import { createRoot } from 'react-dom/client' // Fonction pour créer une racine React dans le DOM
import './index.css' // Styles CSS globaux de l'application
import App from './App.tsx' // Composant principal de l'application

// Création et rendu de l'application React
// 1. Sélection de l'élément DOM avec l'id 'root' (défini dans index.html)
// 2. Création d'une racine React sur cet élément
// 3. Rendu du composant App à l'intérieur du mode strict
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* 
      StrictMode est un outil pour mettre en évidence les problèmes potentiels dans l'application.
      Il active des vérifications et avertissements supplémentaires en développement.
      Il n'a pas d'impact sur la production et ne rend pas l'interface utilisateur.
    */}
    <App /> {/* Composant racine de l'application */}
  </StrictMode>,
)
