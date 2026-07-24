FROM node:20-alpine

WORKDIR /app

# Dependencies
COPY package*.json ./
RUN npm ci

# Application
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
