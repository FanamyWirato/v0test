FROM node:20.12.2
#RUN apt-get update
WORKDIR /var/www/html
#RUN python --version
#RUN apt-get install build-essential
RUN npm install -g npm
