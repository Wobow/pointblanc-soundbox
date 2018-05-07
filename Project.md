# SoundBox

## Membres

Alan Balbo - alan.balbo@epitech.eu - [@Wobow](https://github.com/Wobow)

## Technologies

#### Client

- Electron
- Angular 5
- Typescript

#### Serveur

- NodeJS
- Express
- MongoDB
- Socket.io

## Ambition

Ce projet est Open Source et libre en téléchargement. L'API est ouverte et sans limitation.

## Concurrence

Aucune

## Résumé

Ce projet est une plateforme en ligne de **Soundbox**. Les utilisateurs peuvent créer des salons dans lesquels d'autres les rejoindront. Dans chaque salon, un panel de sons à jouer est disponible, et lorsqu'un member du salon joue un son, il est joué chez tout les autres membres.

## Détail

[] En tant qu'utilisateur, lorsque je me connecte à l'application je suis redirigé sur un liste de salons que je peux rejoindre (10). 

[] En tant qu'utilisateur, je peux créer un nouveau salon. Un salon est décrit par un nom et un mot de passe. Le salon est alors visible par tout le monde via recherche, ou dans la liste des salons existants

[] En tant qu'utilisateur, je peux rechercher et rejoindre un salon existant en cliquant dessus et en entrant le mot de passe correct.

[] En tant que créateur du salon, je peux gérer les droits du salon depuis un panneau d'administration propre au salon.

[] En tant que créateur de salon, je peux ajouter un nouveau son au salon. Un son est décrit par un nom et l'url du son (externe à l'application).

[] En tant que créateur de salon, je peux activer une option permettant à tout le monde d'ajouter un son au salon

[] En tant que créateur de salon, je peux importer une liste de son depuis un autre salon.

[] En tant que créateur de salon, je peux activer ou désactiver un *slow mode*

[] En tant que membre de salon, je peux voir la liste des sons disponibles.

[] En tant que membre de salon, je peux cliquer sur un bouton, et si j'en ai la permission le son sera joué pour moi ou pour tout le monde (selon la configuration).

[] En tant que membre de salon, si le slow mode est activé, je ne peux pas jouer de son avant un certain intervalle de temps décrit par le créateur de salon

[] En tant que créateur de salon, je peux activer ou désactiver l'option *combo*.  Le mode *slow mode* doit être désactivé pour activer le mode *combo*

[] En tant que membre de salon, si le mode *combo* est activé, une barre de texte apparaît et je peux écrire une phrase composée de noms de sons du salon, et celui-ci les jouera à la suite lorsque le membre appuie sur le bouton "Lire"

[] En tant que créateur de salon, je peux activer ou désactiver l'option *queue mode*. Si le mode *queue mode* est activé, le mode *slow mode* s'active automatiquement.

[] En tant que membre du salon, si le mode *queue* est activé, les sons se joueront les uns après les autres. Si le mode *queue* est désactivé, les sons seront joués au moment où un membre appuie sur un bouton

[] En tant que membre du salon, je peux activer le mode *hors ligne*. En mode *hors ligne*, les sons des autres membres ne seront plus joués. Les modes *queue* et *slow* seront désactivés pour cet utilisateur.

[] En tant que créateur du salon, je peux décider de *kicker* ou *bannir* un membre du salon

[] En tant que créateur du salon, je peux dissoudre le salon





