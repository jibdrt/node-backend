FROM node
COPY . /node_mongo
WORKDIR /node_mongo
RUN npm install
EXPOSE 8080
CMD node server.js