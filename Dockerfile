FROM node:14.15-slim
COPY . .
RUN npm install
CMD [ "node", "./app/index.js" ]