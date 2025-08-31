# 🎨 Thème Google Forms - Style Karu

## 🎯 Palette de Couleurs Karu

### Couleurs Principales
- **Bleu Principal** : `#00A6FB` (Bleu électrique)
- **Rose Secondaire** : `#FF2E63` (Rose néon)
- **Jaune Accent** : `#FFC144` (Jaune doré)
- **Violet** : `#8E54E9` (Violet néon)

### Couleurs de Fond
- **Fond Sombre** : `#1A1A2E` (Bleu très sombre)
- **Fond Clair** : `#252A34` (Gris bleuté)
- **Fond Blanc** : `#F5F5F5` (Blanc cassé)

## 🎨 Configuration du Thème Google Forms

### Étape 1 : Personnalisation des Couleurs
1. Cliquez sur l'icône **Palette** (🎨) en haut à droite
2. Cliquez sur **Personnaliser** en bas du menu

### Étape 2 : Couleurs du Thème
- **Couleur principale** : `#00A6FB` (Bleu Karu)
- **Couleur secondaire** : `#FF2E63` (Rose Karu)
- **Couleur d'arrière-plan** : `#1A1A2E` (Fond sombre)
- **Couleur du texte** : `#FFFFFF` (Blanc)

### Étape 3 : Image d'En-tête
**Téléchargez une image d'en-tête personnalisée :**
- **Dimensions recommandées** : 1600 x 400 pixels
- **Style** : Design sombre avec logo Karu
- **Éléments à inclure** :
  - Logo Karu avec le texte "カルメロ"
  - Cartes d'anime en arrière-plan
  - Effets de gradient bleu/rose
  - Texte "Précommande Karu Deck"

## 🖼️ Création de l'Image d'En-tête

### Design Recommandé
```
┌─────────────────────────────────────────────────────────┐
│  🎮 KARU DECK - PRÉCOMMANDE & NOTIFICATIONS 🎮         │
│                                                         │
│  [Logo Karu] カルメロ                                   │
│                                                         │
│  Le jeu de cartes ultime de blind test anime           │
│                                                         │
│  [Cartes flottantes] [Effets de particules]            │
└─────────────────────────────────────────────────────────┘
```

### Éléments Visuels
- **Logo Karu** : Positionné en haut à gauche
- **Texte japonais** : "カルメロ" en bas à droite
- **Cartes d'anime** : Dispersées en arrière-plan
- **Gradient** : Du bleu `#00A6FB` au rose `#FF2E63`
- **Particules** : Effets lumineux pour l'ambiance gaming

## 🎯 Stylisation des Questions

### Titre du Formulaire
- **Police** : Montserrat, Bold, 24px
- **Couleur** : `#FFFFFF` (Blanc)
- **Alignement** : Centre
- **Effet** : Ombre portée subtile

### Questions
- **Police** : Lato, Regular, 16px
- **Couleur** : `#FFFFFF` (Blanc)
- **Espacement** : 20px entre les questions

### Options de Réponse
- **Police** : Lato, Regular, 14px
- **Couleur** : `#E0E0E0` (Gris clair)
- **Hover** : `#00A6FB` (Bleu Karu)
- **Sélectionné** : `#FF2E63` (Rose Karu)

## 🎨 Éléments Interactifs

### Boutons
- **Couleur de fond** : `#00A6FB` (Bleu Karu)
- **Couleur au hover** : `#FF2E63` (Rose Karu)
- **Police** : Montserrat, Semi-Bold, 14px
- **Border radius** : 8px
- **Padding** : 12px 24px

### Cases à Cocher
- **Couleur non cochée** : `#666666` (Gris)
- **Couleur cochée** : `#00A6FB` (Bleu Karu)
- **Taille** : 18px x 18px

### Champs de Texte
- **Couleur de bordure** : `#444444` (Gris foncé)
- **Couleur au focus** : `#00A6FB` (Bleu Karu)
- **Couleur de fond** : `#2A2A3E` (Gris très foncé)
- **Couleur du texte** : `#FFFFFF` (Blanc)

## 🌟 Effets Visuels Supplémentaires

### Animations CSS (si possible)
```css
/* Effet de brillance sur les boutons */
.btn-glow {
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  animation: glow 2s ease-in-out infinite;
}

@keyframes glow {
  0%, 100% { opacity: 0; }
  50% { opacity: 1; }
}

/* Effet de hover sur les cartes */
.card-hover {
  transition: transform 0.3s ease;
}

.card-hover:hover {
  transform: translateY(-5px);
}
```

### Icônes et Emojis
Utilisez ces emojis dans vos questions pour plus d'engagement :
- 🎮 Pour les questions gaming
- 🎵 Pour les questions d'openings
- 🏆 Pour les questions de compétition
- 📱 Pour les questions d'app
- 🎨 Pour les questions de contenu

## 📱 Optimisation Mobile

### Responsive Design
- **Largeur minimale** : 320px
- **Padding** : 16px sur mobile
- **Taille de police** : 14px minimum
- **Espacement** : 16px entre les éléments

### Touch-Friendly
- **Taille des boutons** : Minimum 44px de hauteur
- **Espacement des options** : 8px minimum
- **Zones de clic** : Suffisamment grandes

## 🎯 Intégration avec la Marque

### Cohérence Visuelle
- **Logo** : Utilisez le même logo que l'app
- **Couleurs** : Respectez strictement la palette Karu
- **Typographie** : Montserrat pour les titres, Lato pour le texte
- **Style** : Moderne, gaming, anime-friendly

### Message de Marque
- **Ton** : Amical, passionné, communautaire
- **Langage** : Accessible aux fans d'anime
- **Émojis** : Utilisez-les pour l'engagement
- **Références** : Anime populaires et culture otaku

## 🔧 Configuration Technique

### Paramètres Avancés
1. **Collecte d'emails** : Activée
2. **Limite de réponses** : 1 par personne
3. **Ordre des questions** : Aléatoire (optionnel)
4. **Barre de progression** : Activée
5. **Confirmation personnalisée** : Activée

### Message de Confirmation
```
🎉 Merci de vous être inscrit !

Vous recevrez bientôt des nouvelles exclusives sur le Karu Deck.

En attendant, rejoignez notre communauté :
📱 App KARU MELO
🌐 Réseaux sociaux
🎮 Discord

À très bientôt !
L'équipe Karu
```

## 📊 Suivi et Analytics

### Paramètres de Suivi
- **UTM Parameters** : Ajoutez à tous vos liens
- **Google Analytics** : Intégrez le tracking
- **Conversion Tracking** : Suivez les inscriptions

### Métriques à Surveiller
- **Taux de completion** : Objectif > 70%
- **Temps de remplissage** : Optimisez si > 3 minutes
- **Abandon** : Identifiez les questions problématiques
- **Sources** : Quels canaux apportent le plus d'inscriptions

## 🎨 Exemples de Thèmes Alternatifs

### Thème "Gaming"
- **Couleur principale** : `#FF2E63` (Rose néon)
- **Accent** : `#00A6FB` (Bleu électrique)
- **Style** : Plus agressif, gaming-focused

### Thème "Anime"
- **Couleur principale** : `#8E54E9` (Violet)
- **Accent** : `#FFC144` (Jaune doré)
- **Style** : Plus doux, anime-friendly

### Thème "Compétition"
- **Couleur principale** : `#FFC144` (Jaune doré)
- **Accent** : `#FF2E63` (Rose néon)
- **Style** : Énergique, compétitif

---

**Conseil Pro** : Testez votre formulaire sur différents appareils et avec différents utilisateurs pour vous assurer que l'expérience est optimale pour tous vos futurs clients ! 