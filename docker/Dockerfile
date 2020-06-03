FROM node:12

WORKDIR /usr/src/tdd-train

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000
CMD [ "node", "server.js" ]