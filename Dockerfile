FROM node:20
WORKDIR /jerry
COPY package*.json ./
RUN npm ci
COPY build ./build
COPY public ./public
COPY server.mjs ./
EXPOSE 3000
CMD ["npm", "start"]
