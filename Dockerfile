FROM node:slim

# Add source
ADD . /myapp

WORKDIR /myapp

# Expose the default node hosting port.
EXPOSE 3000

RUN apt-get install -y npm

RUN npm install
RUN npm start