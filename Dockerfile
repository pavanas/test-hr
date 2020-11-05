FROM node:14.15-slim
COPY . .
RUN npm install
CMD [ "node", "index.js" ]