FROM node:10-slim

MAINTAINER Tobias Schneider, me@cynt4k.de

WORKDIR /usr/src/app

COPY src/package.json ./

RUN npm install

COPY src/ .

EXPOSE 3000

CMD ["npm", "start"]