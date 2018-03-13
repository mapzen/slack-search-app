FROM pelias/baseimage

# Where the app is built and run inside the docker fs
ENV WORK=/home/pelias/slack-search-app

WORKDIR ${WORK}
ADD . ${WORK}

RUN npm install

ENV GITHUB_AUTH=0
ENV SEARCH_API_KEY=pelias-xxxxxx


EXPOSE 3000
CMD [ "npm", "start" ]
