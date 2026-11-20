# CinéTrack

Application web qui permet de parcourir un catalogue de films et séries, de rechercher, filtrer, paginer, sauvegarder ses favoris, **gérer le catalogue depuis une page admin** (ajout, modification, suppression) et **commenter chaque titre**. Les données sont enregistrées sur une vraie API REST (MockAPI).

**Démo :** [https://cin-truck-v2.vercel.app/]
**Repo :** [https://github.com/lyasi06/Cin-Track-catalogue-de-films-et-s-ries-V2]

---

## Fonctionnalités

### Catalogue (`index.html`)
- Récupération des données depuis l'API MockAPI
- Affichage des cards (image, titre, année, type)
- Recherche par titre
- Filtre par type (Film / Série)
- Pagination (8 titres par page)
- Modal avec détails (genres, description, réalisateurs, pays, durée/saisons)
- Ajout / retrait de favoris (sans doublon) avec compteur de films et séries
- Persistance des favoris avec `localStorage`
- **Commentaires dans la modal** : chargement avec loader, affichage de l'auteur, de la date et du texte, ou « Aucun commentaire »
- **Publication d'un commentaire** avec un formulaire validé (nom et texte obligatoires), affiché sans recharger la page
- Le pseudo est mémorisé avec `localStorage`
- Interface responsive (Tailwind CSS)

### Administration (`admin.html`)
- Tableau de tous les titres (image, titre, type, année) avec loader et message d'erreur
- **Suppression** avec confirmation (`confirm()`) puis mise à jour de la liste
- **Un seul formulaire pour l'ajout et la modification** : le titre du formulaire et le texte du bouton changent selon le mode
- **Ajout** avec `POST`, **modification** avec `PUT` (le formulaire est prérempli avec `find`)
- **Validation avant l'envoi** : titre obligatoire, type choisi, année entre 1900 et l'année actuelle, URL d'image valide, durée (film) ou nombre de saisons (série)
- Messages d'erreur sous les champs et message de succès ou d'erreur global
- Aperçu de l'image dans le formulaire

---

## Comment ça marche

1. Au chargement, `API.js` récupère les titres depuis MockAPI.
2. `Ui.js` affiche les cards dans la grille.
3. La recherche et le filtre sont appliqués dans cet ordre : recherche → filtre → pagination.
4. Un clic sur une card ouvre la modal avec tous les détails.
5. À l'ouverture de la modal, `comments.js` charge les commentaires du titre et affiche le formulaire d'ajout.
6. Un commentaire publié est enregistré dans l'API (`PUT` sur le titre) puis affiché immédiatement.
7. Un clic sur le cœur ajoute ou retire le titre des favoris (sauvegardés dans `localStorage`).
8. La page admin (`admin.js`) permet de lister, ajouter, modifier et supprimer les titres.

---

## Structure du projet

| Fichier | Rôle |
|---|---|
| `js/API.js` | Appels HTTP vers MockAPI (`GET`, `POST`, `PUT`, `DELETE`) |
| `js/Ui.js` | Affichage : cards, modal, pagination, favoris, erreurs |
| `js/main.js` | Logique du catalogue |
| `js/filter.js` | Recherche, filtre et pagination |
| `js/favorite.js` | Gestion des favoris (`localStorage`) |
| `js/comments.js` | Chargement, validation et publication des commentaires |
| `js/admin.js` | Page admin : liste, ajout, modification, suppression |

---

## Technologies utilisées

| Technologie | Usage |
|---|---|
| **HTML5** | Structure des pages |
| **Tailwind CSS** | Styling et responsive |
| **JavaScript (ES6 modules)** | Logique applicative |
| **Fetch API** | Communication avec l'API (`GET`, `POST`, `PUT`, `DELETE`) |
| **MockAPI** | API REST hébergée |
| **localStorage** | Favoris et pseudo |

---

## API utilisée

**Endpoint :** `https://6afae7d2730c1d152f32b5ba.mockapi.io/Cin-Truck`

### Routes

| Méthode | URL | Rôle |
|---|---|---|
| `GET` | `/Cin-Truck` | Lister tous les films et séries |
| `GET` | `/Cin-Truck/:id` | Récupérer un titre |
| `POST` | `/Cin-Truck` | Ajouter un titre (body JSON) |
| `PUT` | `/Cin-Truck/:id` | Modifier un titre (body JSON) |
| `DELETE` | `/Cin-Truck/:id` | Supprimer un titre |

Pour `POST` et `PUT`, l'en-tête `Content-Type: application/json` est envoyé avec `body: JSON.stringify(data)`.

### Schéma de la ressource `Cin-Truck`

| Champ | Type |
|---|---|
| `id` | String (généré par MockAPI) |
| `title` | String |
| `image` | String (URL) |
| `description` | String |
| `type` | String (`movie` ou `series`) |
| `releaseYear` | Number |
| `duration` | Number (films) |
| `seasons` | Array / Number (séries) |
| `genres` | Array |
| `directors` | Array |
| `productionCountries` | Array |
| `comments` | Array d'objets `{ author, text, createdAt }` |

### Commentaires

Le plan gratuit de MockAPI limite le nombre de ressources et la ressource `/comments` n'a pas pu être créée. Les commentaires sont donc enregistrés **dans le champ `comments` de chaque titre** :

- **Lecture** : `getComments()` parcourt les titres et rassemble leurs commentaires (en ajoutant `contentId`), puis la modal garde ceux du titre ouvert avec `filter`.
- **Ajout** : `addComment()` récupère le titre (`GET`), ajoute le commentaire au tableau, puis enregistre avec `PUT`.
- Un titre sans commentaire affiche « Aucun commentaire » (pas d'erreur).

> Les `id` renvoyés par MockAPI sont des chaînes (`"12"`) : les comparaisons se font entre chaînes.

---

## Ressources & documentation
1. MDN Web Docs : fetch, localStorage, Array methods (`map`, `filter`, `find`)

2. Tailwind CSS : tailwindcss.com/docs

3. MockAPI : mockapi.io

4. YouTube : chaînes et tutoriels sur JavaScript / fetch / modules ES6

5. Google : recherches ponctuelles pour résoudre des bugs

6. Stack Overflow : solutions à des erreurs rencontrées

## Auteur
[ABDERRAHMANE LYASI]