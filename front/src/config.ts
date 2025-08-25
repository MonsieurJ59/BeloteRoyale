/**
 * Configuration de l'application
 * Ce fichier centralise les variables de configuration utilisées dans l'application
 */

// URL de base de l'API
// Utilise la variable d'environnement VITE_API_URL définie dans le fichier .env
// Si la variable n'est pas définie, utilise une URL par défaut pour le développement local
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// Log de l'URL de l'API pour faciliter le débogage
console.log('API_URL utilisée:', API_URL);