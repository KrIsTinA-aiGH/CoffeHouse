FROM node:20-alpine

WORKDIR /app

# Настройки для улучшения работы сети
RUN npm config set registry https://registry.npmjs.org/
RUN npm config set fetch-retries 5
RUN npm config set fetch-retry-mintimeout 30000
RUN npm config set fetch-retry-maxtimeout 120000

COPY package*.json ./

# Установка с увеличенными таймаутами
RUN npm install --fetch-timeout=300000 --fetch-retry-mintimeout=30000 --fetch-retry-maxtimeout=120000

COPY . .

EXPOSE 3000

CMD ["npm", "start"]