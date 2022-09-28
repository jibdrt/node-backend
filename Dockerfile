FROM node
COPY . /node_mongo
WORKDIR /node_mongo
EXPOSE 8080
CMD node server.js
