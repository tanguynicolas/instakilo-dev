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
docker network create instakilo-network

docker run  -d  --rm            --network instakilo-network  --name instakilo-node   instakilo-node
docker run  -d  --rm  -p 80:80  --network instakilo-network  --name instakilo-nginx  instakilo-nginx
```

## Docker : déploiement multiple
```bash
# En construisant l'image en local
docker compose  --file compose-local_build.yaml  up  -d

# En utilisant l'image distante
docker compose  --file compose-pull_remote.yaml  up  -d
```
On peut rebuild les images si les fichiers on été modifiés (en tout cas en local) avec l'option `--build`.
Pour le remote il faudra faire un compose pull, et avoir delete les container au préalable avec docker down.

## Générer des avatars
J'ai utilisé la commande suivante.
```bash
bash -c 'for i in {1..50}; do curl -LO https://api.multiavatar.com/${i}.png ; done'
```
Les images sont différentes en fonction de leur nom (p. ex. gerard.png) ; c'est une IA derrière cette API.
Pour générer les images en .svg, omettez l'extension.

