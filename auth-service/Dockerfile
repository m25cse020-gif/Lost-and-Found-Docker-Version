
FROM node:18-alpine


WORKDIR /app


COPY package*.json ./
RUN npm install

RUN chmod +x ./node_modules/.bin/nodemon



COPY . .


CMD ["npm", "start"]