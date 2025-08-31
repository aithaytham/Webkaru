# Karu Deck - Page de Précommande

Cette page web est conçue pour promouvoir et gérer les précommandes du Karu Deck, en parfaite harmonie avec le design de l'application KARU MELO.

## 🎨 Design

La page reprend fidèlement l'identité visuelle de l'app :

- **Couleurs** : Bleu (#00A6FB), Rose/Rouge (#FF2E63), Jaune (#FFC144), Violet (#8E54E9)
- **Typographie** : Montserrat (titres) et Lato (texte)
- **Effets** : Gradients, néons, ombres et animations
- **Style** : Dark theme avec éléments futuristes

## 📁 Structure des fichiers

```
web-preorder/
├── index.html          # Page principale
├── styles.css          # Styles CSS
├── script.js           # JavaScript interactif
├── assets/             # Images et ressources
│   └── logo.png        # Logo Karu
└── README.md           # Ce fichier
```

## 🛒 Intégration Shopify

### 1. Configuration des produits

Dans votre admin Shopify, créez ces produits :

**Karu Deck - Édition Standard (29€)**

- SKU: `karu-deck-standard`
- Gestion des stocks activée
- Images du produit

**Karu Deck - Édition Collector (49€)**

- SKU: `karu-deck-collector`
- Gestion des stocks activée
- Images du produit

**Karu Deck - Pack Duo (79€)**

- SKU: `karu-deck-duo`
- Gestion des stocks activée
- Images du produit

### 2. Modification du JavaScript

Dans `script.js`, remplacez les `variant_id` par les vrais IDs Shopify :

```javascript
const products = {
  standard: {
    variant_id: "VOTRE_VARIANT_ID_STANDARD",
    // ...
  },
  collector: {
    variant_id: "VOTRE_VARIANT_ID_COLLECTOR",
    // ...
  },
  duo: {
    variant_id: "VOTRE_VARIANT_ID_DUO",
    // ...
  },
};
```

### 3. Configuration du domaine

Remplacez `your-shop-name.myshopify.com` par votre vraie URL Shopify dans la fonction `proceedToCheckout()`.

### 4. Options d'intégration

#### Option A : Hébergement externe + Redirection

1. Hébergez la page sur votre serveur
2. Redirigez vers Shopify pour le checkout
3. Simple mais expérience utilisateur moins fluide

#### Option B : Shopify Storefront API

1. Utilisez l'API Storefront pour créer le checkout
2. Expérience plus fluide
3. Nécessite plus de développement

#### Option C : Intégration dans le thème Shopify

1. Intégrez le code dans votre thème Shopify
2. Adaptez le code Liquid
3. Expérience totalement intégrée

## 🚀 Déploiement

### Hébergement externe

1. Uploadez tous les fichiers sur votre serveur
2. Configurez le domaine et SSL
3. Testez le processus de commande

### Shopify Pages

1. Créez une nouvelle page dans Shopify
2. Copiez le contenu HTML
3. Ajoutez CSS/JS via les assets du thème

## 📱 Responsive Design

La page est entièrement responsive :

- **Mobile** : Navigation simplifiée, cartes empilées
- **Tablet** : Layout adaptatif
- **Desktop** : Expérience complète avec animations

## ⚡ Fonctionnalités

### Interactivité

- ✅ Panier fonctionnel avec localStorage
- ✅ FAQ accordéon
- ✅ Animations au scroll
- ✅ Notifications toast
- ✅ Effets parallax
- ✅ Menu mobile

### E-commerce

- ✅ Gestion des variantes produits
- ✅ Calcul automatique des totaux
- ✅ Persistance du panier
- ✅ Intégration Shopify prête

### Performance

- ✅ Images lazy loading
- ✅ CSS optimisé
- ✅ JavaScript modulaire
- ✅ SEO optimisé

## 🔧 Personnalisation

### Couleurs

Modifiez les variables CSS dans `styles.css` :

```css
:root {
  --primary-blue: #00a6fb;
  --secondary-pink: #ff2e63;
  --accent-yellow: #ffc144;
  --purple: #8e54e9;
}
```

### Contenu

- Modifiez les textes dans `index.html`
- Ajoutez/supprimez des sections selon vos besoins
- Adaptez les prix dans `script.js`

### Images

Ajoutez vos images dans le dossier `assets/` :

- `logo.png` : Logo principal
- `card-preview.jpg` : Aperçu des cartes
- `og-image.jpg` : Image de partage social

## 📊 Analytics

Le code inclut des hooks pour :

- Google Analytics 4
- Tracking des événements
- Suivi des conversions

Configurez votre ID de tracking dans le JavaScript.

## 🔒 Sécurité

- Validation côté client et serveur
- Protection CSRF (à implémenter côté serveur)
- Paiements sécurisés via Shopify

## 📧 Newsletter

Intégrez votre service d'email marketing :

- Mailchimp
- Klaviyo
- SendGrid

Modifiez la fonction `subscribeToNewsletter()` dans `script.js`.

## 🐛 Debug

Pour tester localement :

1. Ouvrez `index.html` dans votre navigateur
2. Utilisez les outils de développement
3. Vérifiez la console pour les erreurs

## 📞 Support

Pour toute question sur l'intégration :

1. Vérifiez la documentation Shopify
2. Testez d'abord en mode développement
3. Utilisez les outils de debug du navigateur

## 🚀 Mise en production

Checklist avant le lancement :

- [ ] URLs Shopify configurées
- [ ] Variant IDs mis à jour
- [ ] Images optimisées
- [ ] Tests de commande complets
- [ ] Analytics configurés
- [ ] SSL activé
- [ ] Domaine configuré

---

**Note** : Cette page est conçue pour s'intégrer parfaitement avec l'écosystème KARU MELO tout en offrant une expérience e-commerce professionnelle.
