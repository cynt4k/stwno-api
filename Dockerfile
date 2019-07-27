FROM node:10-alpine as builder

COPY . /opt/stwno

WORKDIR /opt/stwno

RUN npm install ; \
    npm run-script build ; \
    rm -fr node_modules src


FROM node:10-alpine

COPY --from=builder /opt/stwno/ /opt/stwno/

WORKDIR /opt/stwno

RUN ls -alh && npm install --production

ENV NODE_ENV prd

CMD [ "npm", "start" ]