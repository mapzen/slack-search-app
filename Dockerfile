FROM pelias/baseimage

# Where the app is built and run inside the docker fs
ENV WORKDIR /home/pelias/slack-search-app
WORKDIR ${WORKDIR}

ADD package.json ${WORKDIR}
RUN npm install

ADD . ${WORKDIR}

ENV GITHUB_AUTH=0
ENV SEARCH_API_KEY=pelias-xxxxxx

EXPOSE 3000
CMD [ "node", "app.js" ]
