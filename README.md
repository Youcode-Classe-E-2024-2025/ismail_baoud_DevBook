
# 📘 Cahier des Charges – Projet DevBook

## 🎯 Contexte et Objectifs

**Contexte :**  
Les développeurs lisent fréquemment des ouvrages techniques (programmation, design, architecture, etc.). DevBook est une application web conçue pour leur permettre de gérer une collection personnalisée de livres en facilitant l'organisation, le suivi et la recherche.

**Objectifs pédagogiques :**
- Créer une application full-stack **sans framework**.
- Manipuler le **DOM en JavaScript** et créer des **interfaces dynamiques**.
- Appliquer les principes de la **Programmation Orientée Objet (POO)**.
- Mettre en place une **base de données relationnelle en SQL**.
- Élaborer des **diagrammes UML** cohérents avec le code.
- Gérer un projet en **solo sur GitHub**, avec une structure claire.

## 👤 Acteurs

| Acteur         | Description                                                |
|----------------|------------------------------------------------------------|
| Utilisateur    | Ajoute, modifie, supprime et organise ses livres.          |
| Administrateur | (Optionnel) Supervise les catégories et les emprunts.      |

## ✅ Fonctionnalités principales

- Ajouter / modifier / supprimer un livre.
- Organiser les livres par **catégories**.
- Suivre les livres : **à lire**, **en cours**, **lus**.
- **Filtrer** par titre, auteur, statut, catégorie.
- **Trier** les livres (titre, auteur, catégorie, date).
- **Pagination dynamique** en JavaScript.
- Affichage de **statistiques visuelles** (par catégorie/statut).
- Connexion à une base SQL via un **back-end Node.js**.
- Utilisation de classes JavaScript pour modéliser les entités.
- Diagrammes UML :
  - Cas d’utilisation
  - Diagramme de classes

## 💽 Base de Données

### Tables principales :
- `books` : id, title, author, pub_date, description, status, category_id
- `categories` : id, name
- `users` (optionnel) : id, name, email
- `loans` (optionnel) : id, book_id, user_id, loan_date, due_date, returned

### Contraintes :
- Relations via **clés étrangères**
- Intégrité des données
- Index sur les colonnes filtrables

## 🔍 Requêtes SQL demandées

1. **Utilisateurs ayant emprunté un livre (tri par date décroissante)**  
   ```sql
   SELECT u.name, COUNT(*) AS nbr_emprunts
   FROM users u
   JOIN loans l ON u.id = l.user_id
   GROUP BY u.name
   ORDER BY MAX(l.loan_date) DESC;
   ```

2. **Livres non rendus et dépassant la date d'échéance**  
   ```sql
   SELECT b.title, l.due_date
   FROM books b
   JOIN loans l ON b.id = l.book_id
   WHERE l.returned = FALSE
     AND l.due_date < CURRENT_DATE;
   ```

3. **Nombre de livres par catégorie**  
   ```sql
   SELECT c.name, COUNT(b.id) AS total
   FROM categories c
   LEFT JOIN books b ON c.id = b.category_id
   GROUP BY c.name;
   ```

4. **Catégorie la plus empruntée**  
   ```sql
   SELECT c.name, COUNT(l.id) AS emprunts
   FROM categories c
   JOIN books b ON c.id = b.category_id
   JOIN loans l ON b.id = l.book_id
   GROUP BY c.name
   ORDER BY emprunts DESC
   LIMIT 1;
   ```

5. **Emprunts à une date sélectionnée**  
   ```sql
   SELECT *
   FROM loans
   WHERE DATE(loan_date) = :selected_date;
   ```

6. **Top 10 des livres les plus empruntés d’un mois donné**  
   ```sql
   SELECT b.title, COUNT(l.id) AS emprunts
   FROM books b
   JOIN loans l ON b.id = l.book_id
   WHERE DATE_TRUNC('month', l.loan_date) = :month
   GROUP BY b.title
   ORDER BY emprunts DESC
   LIMIT 10;
   ```

## 🛠️ Technologies utilisées

- **Frontend :** HTML5, CSS3, JavaScript ES6+, DOM, Charts.js
- **Backend :** Node.js, Express.js
- **Base de données :** MySQL ou PostgreSQL
- **POO :** JavaScript (ou TypeScript)
- **UML :** Use Case Diagram, Class Diagram
- **Outils :** GitHub, VS Code

## 📈 Diagrammes UML

- **Diagramme de cas d’utilisation** : interactions utilisateur → système.
- **Diagramme de classes** : Livre, Catégorie, Emprunt, Utilisateur, avec attributs et méthodes.

## 📅 Planning prévisionnel

| Jour | Tâches                                                                 | Livrables                            |
|------|------------------------------------------------------------------------|--------------------------------------|
| J1   | Analyse fonctionnelle, cas d’utilisation                               | Diagramme UML (use case)             |
| J2   | Diagramme de classes UML, création classes JS/TS + script SQL          | Diagramme de classes, script DB      |
| J3   | Dév. JS (CRUD + DOM), requêtes SQL, API REST                           | Interface dynamique, SQL testé       |
| J4   | Finalisation logique objet, frontend responsive, stats visuelles       | App prête pour démo                  |
| J5   | Tests finaux, préparation soutenance, push final GitHub                | Projet complet + slides UML + démo   |

## ✅ Critères d’évaluation

### JavaScript
- POO (2 classes min), modularité, logique DOM claire.
- Bonne gestion des événements, tri/pagination efficaces.

### SQL
- Structure relationnelle cohérente.
- Jointures correctes, requêtes optimisées.

### UML
- Diagrammes clairs, alignés avec le code.

### Présentation
- Démo fluide et documentée.
- Qualité du dépôt GitHub (commits clairs, README, code propre).

## 📁 Livrables attendus

- Diagrammes UML (PDF ou image)
- Code source complet sur GitHub
- Script SQL (création + insertion test)
- Interface fonctionnelle
- Présentation de soutenance