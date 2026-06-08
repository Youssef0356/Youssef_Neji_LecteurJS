# LecteurJS — Backend

Backend PHP/MySQL pour le projet LecteurJS.

## Prérequis

- PHP 7.4+
- MySQL / MariaDB
- Serveur web (Apache / Nginx)

## Installation

1. **Cloner le dépôt**
   ```bash
   git clone https://github.com/VOTRE_USERNAME/LecteurJS-backend.git
   cd LecteurJS-backend
   ```

2. **Configurer la base de données**
   ```bash
   cp config/database.example.php config/database.php
   # Éditez config/database.php avec vos identifiants
   ```

3. **Importer le schéma SQL**
   ```bash
   mysql -u root -p lecteurjs < schema.sql
   ```

4. **Créer le dossier d'uploads**
   ```bash
   mkdir -p public/uploads
   chmod 775 public/uploads
   ```

5. **Lancer le serveur de développement**
   ```bash
   php -S localhost:8000 -t public/
   ```

## Structure

```
LecteurJS-backend/
├── config/
│   ├── database.example.php   # Template de configuration (à copier)
│   └── database.php           # Config locale (ignorée par git)
├── public/
│   ├── index.php
│   ├── script.js
│   ├── style.css
│   └── uploads/               # Fichiers uploadés (ignorés par git)
└── schema.sql
```

## Licence

MIT
