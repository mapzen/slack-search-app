FROM node:boron

# Where the app is built and run inside the docker fs
ENV WORK=/opt/pelias

WORKDIR ${WORK}
ADD . ${WORK}

RUN npm install

ENV GITHUB_AUTH=0
ENV SEARCH_API_KEY=mapzen-xxxxxx


EXPOSE 3000
CMD [ "npm", "start" ]
