FROM node:latest
RUN apt-get update && apt-get upgrade
WORKDIR /var/www/html
RUN apt-get install build-essential
RUN npm install -g npm
RUN npm install -g node-gyp
