FROM node:18-alpine3.18

WORKDIR /app

COPY package*.json ./

RUN npm install -build-from-source bcrypt

COPY . .

EXPOSE 8080

CMD ["npm", "start"]