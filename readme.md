# Lecteur JS - Youssef Neji

## Description

Un lecteur audio simple et élégant construit avec du JavaScript vanilla. Il permet de parcourir une liste de lecture chargée dynamiquement depuis un fichier JSON.

## Technologies Utilisées

- **HTML5** : Structure de l'application et API Audio.
- **CSS3** : Design moderne avec feedback visuel pour la lecture.
- **JavaScript (ES6+)** : Logique de contrôle, manipulation du DOM et Fetch API.
- **JSON** : Stockage des métadonnées des pistes audio.

## Fonctionnalités Principales

- **Lecture / Pause** : Contrôle simple de la lecture.
- **Navigation** : Boutons "Suivant" et "Précédent" pour parcourir les pistes.
- **Gestion du Volume** : Curseur pour ajuster le niveau sonore en temps réel.
- **Chargement Dynamique** : Les pistes sont chargées depuis `tracks.json`.
- **Indicateur de lecture** : Le titre de la piste change de couleur lorsqu'elle est en cours de lecture.

## Rendu Final (GitHub Pages)

[Consulter le projet en ligne](https://youssef0356.github.io/Youssef_Neji_LecteurJS/)

## Nouveautés Explorées

Durant ce projet, j'ai découvert que JavaScript possède de nombreuses fonctions intégrées puissantes pour manipuler l'audio (Audio API), ce qui rend la création d'un lecteur multimédia très accessible sans bibliothèques externes.

## Difficultés Rencontrées

L'un des problèmes techniques majeurs a été que le script JavaScript s'exécutait avant que le DOM ne soit complètement chargé, ce qui entraînait des erreurs lors de la récupération des éléments avec `getElementById`.

## Solutions Apportées

Pour résoudre ce problème, j'ai utilisé l'attribut `defer` dans la balise `<script>` de l'index HTML. Cela garantit que le script n'est exécuté qu'une fois que l'ensemble du document HTML a été analysé, permettant ainsi une interaction sans erreur avec les éléments de la page.
