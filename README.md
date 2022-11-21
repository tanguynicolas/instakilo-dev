# Instakilo
Projet de gestion de projet, à l'Université de Picardie.
Créer une application web de clavardage.

## NodeJS
Pour installer le projet en développement :
```bash
cd nodejs
npm install
```
<br />

Pour ajouter une dépendance de développement au projet :
```bash
npm install <package> --save-dev
```

## Docker Registry
Déploiement d'une image Docker sur la registry (p. ex. node) :
```bash
docker login
# authentication...
docker tag instakilo-node:latest tanguynicolas/instakilo-node:latest
docker push tanguynicolas/instakilo-node:latest
```

## Docker : déploiement individuel
```bash
docker run -d --rm -p 80:80 --name instakilo-nginx instakilo-nginx
docker run -d --rm -p 3000:3000 --name instakilo-node instakilo-node
```
