# Guide d'Intégration Stripe pour Karu Deck

Ce guide vous explique comment configurer Stripe pour accepter les paiements de précommandes Karu Deck.

## 🔑 Étape 1: Configuration des Clés API Stripe

### 1.1 Récupérer vos clés Stripe

1. Connectez-vous à votre [Dashboard Stripe](https://dashboard.stripe.com)
2. Allez dans **Développeurs > Clés API**
3. Récupérez :
   - **Clé publique** (pk_test_... ou pk_live_...)
   - **Clé secrète** (sk_test_... ou sk_live_...)

### 1.2 Mettre à jour la configuration

Dans `stripe-config.js`, remplacez :
```javascript
publishableKey: 'pk_test_XXXX', // Votre clé publique ici
```

Dans `backend-example.js`, remplacez :
```javascript
const stripe = require('stripe')('sk_test_XXXX'); // Votre clé secrète ici
```

## 📦 Étape 2: Création des Produits Stripe

### 2.1 Créer les produits dans Stripe

1. Dans le Dashboard Stripe, allez dans **Catalogue > Produits**
2. Créez ces produits :

#### Produit 1: Karu Deck Standard
- **Nom**: Karu Deck - Standard Edition
- **Prix**: 14,99€
- **Récurrent**: Non
- **Type**: Biens physiques

#### Produit 2: Karu Deck Competition
- **Nom**: Karu Deck - Competition Edition  
- **Prix**: 19,99€
- **Récurrent**: Non
- **Type**: Biens physiques

### 2.2 Récupérer les Price IDs

1. Pour chaque produit, copiez le **Price ID** (price_...)
2. Mettez à jour `stripe-config.js` :

```javascript
products: {
    standard: {
        stripePriceId: 'price_VOTRE_PRICE_ID_STANDARD',
        // ...
    },
    competition: {
        stripePriceId: 'price_VOTRE_PRICE_ID_COMPETITION',
        // ...
    }
}
```

## 🖥️ Étape 3: Configuration du Backend

### 3.1 Installation des dépendances

```bash
npm init -y
npm install express stripe cors helmet dotenv
```

### 3.2 Variables d'environnement

Créez un fichier `.env` :
```env
STRIPE_SECRET_KEY=sk_test_VOTRE_CLE_SECRETE
STRIPE_WEBHOOK_SECRET=whsec_VOTRE_WEBHOOK_SECRET
PORT=3000
FRONTEND_URL=https://votre-domaine.com
```

### 3.3 Code de production sécurisé

Créez `server.js` :
```javascript
require('dotenv').config();
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cors = require('cors');
const helmet = require('helmet');

const app = express();

// Sécurité
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

// Middleware pour les webhooks (avant express.json())
app.use('/webhook', express.raw({type: 'application/json'}));
app.use(express.json());

// Vos routes ici...
```

## 🔗 Étape 4: Configuration des Webhooks

### 4.1 Créer un webhook

1. Dans Stripe Dashboard, allez dans **Développeurs > Webhooks**
2. Cliquez sur **Ajouter un endpoint**
3. URL: `https://votre-domaine.com/webhook`
4. Événements à écouter :
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`

### 4.2 Secret de signature

1. Copiez le **Secret de signature** du webhook
2. Ajoutez-le à votre `.env` :
```env
STRIPE_WEBHOOK_SECRET=whsec_VOTRE_SECRET
```

## 🌐 Étape 5: Configuration des URLs

### 5.1 URLs de redirection

Dans `stripe-config.js`, mettez à jour :
```javascript
checkout: {
    successUrl: 'https://votre-domaine.com/success?session_id={CHECKOUT_SESSION_ID}',
    cancelUrl: 'https://votre-domaine.com/cancel',
    // ...
}
```

### 5.2 Configuration du domaine

Remplacez toutes les occurrences de `your-domain.com` par votre vrai domaine.

## 🛡️ Étape 6: Sécurité

### 6.1 Variables d'environnement

**JAMAIS** commiter les clés secrètes dans Git. Utilisez toujours des variables d'environnement :

```javascript
// ❌ MAUVAIS
const stripe = require('stripe')('sk_live_123abc...');

// ✅ BON
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
```

### 6.2 Validation côté serveur

Toujours valider les données côté serveur :
```javascript
app.post('/api/create-checkout-session', (req, res) => {
    const { line_items } = req.body;
    
    // Validation
    if (!line_items || !Array.isArray(line_items) || line_items.length === 0) {
        return res.status(400).json({ error: 'Invalid line items' });
    }
    
    // Vérifier que les price_ids sont valides
    const validPriceIds = ['price_standard', 'price_competition'];
    for (const item of line_items) {
        if (!validPriceIds.includes(item.price)) {
            return res.status(400).json({ error: 'Invalid price ID' });
        }
    }
    
    // Continuer avec la création de la session...
});
```

### 6.3 HTTPS obligatoire

Stripe exige HTTPS en production. Assurez-vous que votre site utilise SSL.

### 6.4 Vérification des webhooks

Toujours vérifier la signature des webhooks :
```javascript
app.post('/webhook', (req, res) => {
    const sig = req.headers['stripe-signature'];
    
    try {
        const event = stripe.webhooks.constructEvent(
            req.body, 
            sig, 
            process.env.STRIPE_WEBHOOK_SECRET
        );
        // Traiter l'événement...
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
});
```

## 📊 Étape 7: Test et Déploiement

### 7.1 Cartes de test

Utilisez ces cartes pour tester :
- **Succès**: 4242 4242 4242 4242
- **Échec**: 4000 0000 0000 0002
- **3D Secure**: 4000 0000 0000 3220

### 7.2 Mode test vs production

1. **Test**: Utilisez `pk_test_...` et `sk_test_...`
2. **Production**: Utilisez `pk_live_...` et `sk_live_...`

### 7.3 Checklist de déploiement

- [ ] Clés API mises à jour
- [ ] Variables d'environnement configurées
- [ ] Webhooks configurés
- [ ] HTTPS activé
- [ ] URLs de redirection mises à jour
- [ ] Tests de paiement effectués
- [ ] Gestion d'erreur testée

## 🔧 Dépannage

### Erreurs communes

1. **"Invalid API key"**
   - Vérifiez que vous utilisez la bonne clé (test/live)
   - Vérifiez qu'il n'y a pas d'espaces

2. **"No such price"**
   - Vérifiez que les Price IDs sont corrects
   - Assurez-vous d'être dans le bon mode (test/live)

3. **CORS errors**
   - Configurez correctement les origins dans votre backend
   - Vérifiez les headers

### Logs utiles

```javascript
// Ajouter des logs pour débugger
console.log('Creating session with:', {
    line_items,
    mode: 'payment',
    success_url: successUrl
});
```

## 📞 Support

- **Documentation Stripe**: https://stripe.com/docs
- **Support Stripe**: https://support.stripe.com
- **Tests de cartes**: https://stripe.com/docs/testing

---

Une fois cette configuration terminée, vos clients pourront :
- ✅ Payer directement avec Stripe
- ✅ Recevoir des confirmations automatiques
- ✅ Bénéficier de la sécurité Stripe
- ✅ Utiliser tous les moyens de paiement supportés par Stripe
