
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci --only=production

RUN npx prisma generate

COPY . .

EXPOSE 4000

CMD ["npm", "start"]
