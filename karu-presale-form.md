# Karu Presale Email Collection - Google Forms Template

## 📧 Instructions de Configuration du Formulaire

### Étape 1 : Créer le Formulaire
1. Allez sur [Google Forms](https://forms.google.com)
2. Cliquez sur "Vide" pour créer un nouveau formulaire
3. Nommez-le : **"Karu Deck - Précommande & Notifications"**

### Étape 2 : Paramètres du Formulaire
1. Cliquez sur l'icône **Paramètres** (⚙️) en haut à droite
2. Activez :
   - ✅ "Collecter les adresses e-mail"
   - ✅ "Limiter à 1 réponse par personne"
   - ✅ "Mélanger l'ordre des questions" (optionnel)
3. Cliquez sur **Enregistrer**

### Étape 3 : Questions du Formulaire

#### Question 1 : Adresse E-mail
- **Type** : Réponse courte
- **Question** : "Adresse e-mail *"
- **Obligatoire** : ✅ Oui
- **Description** : "Nous vous enverrons les informations de précommande et les actualités exclusives"

#### Question 2 : Prénom
- **Type** : Réponse courte
- **Question** : "Prénom"
- **Obligatoire** : ❌ Non
- **Description** : "Pour personnaliser nos communications"

#### Question 3 : Niveau d'Intérêt
- **Type** : Choix multiples
- **Question** : "Quel est votre niveau d'intérêt pour le Karu Deck ? *"
- **Obligatoire** : ✅ Oui
- **Options** :
  - 🔥 Très intéressé - Je précommande dès que possible
  - 😊 Intéressé - Je veux être informé de la sortie
  - 🤔 Curieux - Je veux en savoir plus
  - 📱 Je joue déjà à l'app KARU MELO

#### Question 4 : Édition Préférée
- **Type** : Choix multiples
- **Question** : "Quelle édition vous intéresse le plus ?"
- **Obligatoire** : ❌ Non
- **Options** :
  - 🎯 Édition Standard (Deck de cartes)
  - 🏆 Édition Competition (Deck + accès tournois)
  - 🤷 Je ne sais pas encore

#### Question 5 : Préférences d'Anime
- **Type** : Cases à cocher
- **Question** : "Quels genres d'anime préférez-vous ? (sélectionnez tout ce qui vous intéresse)"
- **Obligatoire** : ❌ Non
- **Options** :
  - ⚡ Shonen (Naruto, Dragon Ball, One Piece...)
  - 💕 Romance (Your Name, Toradora, Clannad...)
  - 🎭 Drama (Death Note, Tokyo Ghoul, Steins;Gate...)
  - 🏃 Sports (Haikyuu, Kuroko no Basket...)
  - 🎨 Seinen (Attack on Titan, Berserk...)
  - 😄 Comedy (One Punch Man, Gintama...)
  - 🕰️ Classics des années 90 (Cowboy Bebop, Evangelion...)
  - 🌟 Autres

#### Question 6 : Opening d'Anime Préféré
- **Type** : Réponse courte
- **Question** : "Quel est votre opening d'anime préféré ?"
- **Obligatoire** : ❌ Non
- **Description** : "Exemples : Unravel (Tokyo Ghoul), Gurenge (Demon Slayer), Blue Bird (Naruto)..."
- **Placeholder** : "Nom de l'anime - Titre de l'opening"

#### Question 7 : Comment Avez-Vous Découvert Karu ?
- **Type** : Choix multiples
- **Question** : "Comment avez-vous découvert Karu ?"
- **Obligatoire** : ❌ Non
- **Options** :
  - 📱 Application KARU MELO
  - 🌐 Réseaux sociaux (Instagram, Twitter, TikTok)
  - 👥 Recommandation d'un ami
  - 🔍 Recherche Google
  - 📺 YouTube ou Twitch
  - 🎮 Discord ou communauté gaming
  - 📰 Article de blog ou média
  - 🏪 Convention ou événement
  - Autre

#### Question 8 : Préférences Newsletter
- **Type** : Cases à cocher
- **Question** : "Que souhaitez-vous recevoir ?"
- **Obligatoire** : ❌ Non
- **Options** :
  - 📢 Notifications de précommande
  - 🎮 Actualités de l'app KARU MELO
  - 🏆 Informations sur les tournois
  - 🎨 Contenu exclusif (artwork, previews)
  - 💡 Conseils et stratégies de jeu
  - 🎉 Offres spéciales et réductions

#### Question 9 : Commentaires Supplémentaires
- **Type** : Paragraphe
- **Question** : "Avez-vous des commentaires ou suggestions ?"
- **Obligatoire** : ❌ Non
- **Description** : "Vos retours nous aident à améliorer le produit !"

### Étape 4 : Stylisation du Formulaire
1. Cliquez sur l'icône **Palette** (🎨) en haut à droite
2. Choisissez un thème qui correspond à vos couleurs de marque
3. Ou téléchargez une image d'en-tête personnalisée avec le branding Karu

### Étape 5 : Paramètres de Réponse
1. Cliquez sur l'onglet **Réponses**
2. Cliquez sur **⋮** (trois points) → **Sélectionner la destination des réponses**
3. Choisissez **Google Sheets** pour collecter automatiquement les réponses
4. Nommez la feuille : **"Réponses Précommande Karu"**

## 📊 Gestion des Réponses

### Configuration Google Sheets
Le formulaire créera une feuille Google avec les colonnes :
- Horodatage
- Adresse e-mail
- Prénom
- Niveau d'intérêt
- Édition préférée
- Préférences d'anime
- Opening d'anime préféré
- Comment avez-vous découvert Karu
- Préférences newsletter
- Commentaires supplémentaires

### Export de la Liste d'Emails
Pour exporter les emails vers votre plateforme de marketing par email :

1. **Pour Mailchimp/ConvertKit :**
   - Sélectionnez la colonne "Adresse e-mail"
   - Copiez et collez dans votre plateforme email

2. **Pour Export CSV :**
   - Fichier → Télécharger → CSV
   - Importez dans votre outil de marketing par email

## 📧 Intégration Marketing par Email

### Email de Bienvenue Automatisé
Configurez une séquence d'email automatisée :

**Objet** : "🎮 Bienvenue dans l'aventure Karu !"
**Contenu** :
```
Bonjour [Prénom],

Merci de vous être inscrit pour les notifications Karu Deck !

🎯 Ce qui vous attend :
• Informations exclusives sur la précommande
• Preview des cartes et du packaging
• Accès anticipé aux tournois
• Contenu exclusif de l'univers Karu

📱 En attendant, téléchargez l'app KARU MELO :
[Lien vers l'app]

À très bientôt !
L'équipe Karu
```

### Séquence d'Emails Pré-Lancement
1. **Semaine 1** : Preview du produit et coulisses
2. **Semaine 2** : Annonce de réduction early bird
3. **Semaine 3** : Compte à rebours final et détails du lancement

## 📈 Analyses et Suivi

### Analyses du Formulaire
- Suivez les taux de completion du formulaire
- Surveillez quels canaux apportent le plus d'inscriptions
- Analysez les niveaux d'intérêt et les préférences

### Paramètres UTM
Ajoutez des paramètres UTM à vos liens de formulaire :
```
https://forms.google.com/votre-url-formulaire?utm_source=instagram&utm_medium=social&utm_campaign=karu-presale
```

## 🔗 Partage du Formulaire

### Réseaux Sociaux
- **Instagram** : Ajoutez le lien dans la bio et les stories
- **Twitter** : Épinglez un tweet avec le lien du formulaire
- **TikTok** : Ajoutez le lien dans la bio et les descriptions de vidéos

### Intégration Site Web
- Ajoutez le lien du formulaire sur votre site web
- Créez une page de destination dédiée
- Incluez dans les articles de blog et le contenu

### Codes QR
- Générez des codes QR pour le partage hors ligne
- Utilisez lors de conventions et événements
- Incluez dans les supports imprimés

## 📱 Optimisation Mobile

Le Google Form est automatiquement optimisé pour mobile, mais assurez-vous :
- Testez le formulaire sur appareils mobiles
- Gardez les questions concises pour les utilisateurs mobiles
- Utilisez des polices claires et lisibles

## 🎯 Métriques de Succès

Suivez ces métriques clés :
- **Taux d'Inscription** : % de visiteurs qui complètent le formulaire
- **Taux d'Ouverture Email** : % d'abonnés qui ouvrent les emails
- **Taux de Conversion** : % d'abonnés qui précommandent
- **Performance des Canaux** : Quelles sources apportent les abonnés les plus engagés

## 📋 Variations du Formulaire

### Version Courte (1-2 questions)
Pour une collecte rapide d'emails :
1. Adresse e-mail (obligatoire)
2. Prénom (optionnel)

### Version Détaillée (Formulaire complet ci-dessus)
Pour une collecte de données complète et la segmentation.

### Version Bilingue Français/Anglais
Créez deux formulaires ou utilisez une logique conditionnelle pour la sélection de langue.

## 🎵 Utilisation des Données d'Openings

Les réponses sur les openings préférés peuvent être utilisées pour :
- **Contenu personnalisé** : Créer des playlists d'openings populaires
- **Segmentation** : Grouper les fans par époques d'anime
- **Marketing ciblé** : Adapter les messages selon les préférences
- **Développement produit** : Inclure les openings les plus populaires dans le deck

## 💡 Idées d'Incentifs

Considérez offrir un petit incitatif pour l'inscription :
- Accès anticipé à la précommande
- Code de réduction exclusif
- Contenu digital gratuit (fond d'écran, etc.)
- Participation à un tirage au sort
- Playlist personnalisée d'openings d'anime

Cela augmentera votre taux d'inscription et créera de l'excitation pour le lancement !

---

**Conseil Pro** : Utilisez les données d'openings préférés pour créer du contenu engageant sur vos réseaux sociaux et personnaliser vos communications email ! 