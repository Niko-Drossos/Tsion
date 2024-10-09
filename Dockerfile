FROM node:18-alpine

WORKDIR /

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 2222

CMD ["npm", "start"]