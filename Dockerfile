FROM node:18-alpine

WORKDIR /app

COPY server/package*.json ./server/

WORKDIR /app/server

RUN npm install

COPY server/ .

EXPOSE 8000

CMD ["npm", "start"]
