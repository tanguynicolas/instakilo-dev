FROM node:18-bullseye
ENV NODE_ENV=production

EXPOSE 3000
WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

RUN npm install --production

COPY --chown=node:node . .

USER node
CMD [ "node", "index.js" ]
