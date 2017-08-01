FROM node:boron

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
RUN git clone 'https://github.com/mapzen/slack-search-app.git' '/usr/src/app/search-slackbot'

WORKDIR /usr/src/app/search-slackbot
RUN npm install

ENV GITHUB_AUTH=0
ENV SEARCH_API_KEY=mapzen-xxxxxx


EXPOSE 3000
CMD [ "npm", "start" ]
