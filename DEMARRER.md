# PLOTR // Studio — démarrer et conserver le projet

Cette archive contient le code source complet de la version publiée, les six moteurs (dont Superformula et Isogrid), le mode Affiche, Type Playground et les polices avec leurs licences.

## Ouvrir sur votre ordinateur

Décompressez l’archive et ouvrez `dist/index.html` dans un navigateur récent.
Si le navigateur limite les fichiers locaux, utilisez un serveur local : ouvrez un terminal dans le dossier `plotr-studio`, puis lancez (Python 3 requis) :

```sh
python3 -m http.server 8000 --directory dist
```

Sur Windows, vous pouvez utiliser `py` à la place de `python3`.
Ouvrez ensuite http://localhost:8000. Arrêtez le serveur avec Ctrl+C.
Aucune installation npm ni compilation n’est nécessaire.

## Contenu

- `dist/` : application prête à utiliser ou héberger, HTML, CSS, JavaScript, données vectorielles et polices.
- `scripts/build-font-outlines.py` : outil optionnel pour reconstruire les contours typographiques (Python et fontTools requis).
- `README.md` : documentation technique et limites de la version.
- `dist/fonts/*-OFL.txt` : licences des polices, à conserver avec les fichiers.

Les favoris restent dans le stockage local du navigateur : ils ne sont pas inclus dans cette archive et ne sont pas transférés automatiquement depuis le site publié.

## Envoyer sur GitHub

Créez un dépôt GitHub vide, puis ajoutez le contenu décompressé du dossier `plotr-studio` en conservant l’arborescence. Envoyez les fichiers, pas uniquement l’archive ZIP.

Avec Git installé, depuis ce dossier :

```sh
git init
git add .
git commit -m "Initial PLOTR Studio source"
git branch -M main
git remote add origin https://github.com/VOTRE-COMPTE/VOTRE-DEPOT.git
git push -u origin main
```

Remplacez l’adresse par celle de votre dépôt vide. GitHub peut vous demander de vous authentifier. Ne mettez aucun jeton d’accès dans les fichiers du projet.

GitHub conserve le code. Pour un hébergement web, publiez le contenu de `dist/` sur un hébergeur statique. Le site PLOTR déjà publié reste accessible indépendamment de cet envoi.
