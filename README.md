# slack-search-app
Service for responding to custom Slack commands

## config
The following environment variables are needed

- `GITHUB_AUTH`
- `SEARCH_API_KEY`

## run

```
npm start
```

## deploy with docker


```bash
$ git clone <this-repo> ./mapzen-search-slackbot
$ cd ./mapzen-search-slackbot
$ export GITHUB_AUTH=<your-github-token>
$ export SEARCH_API_KEY=<your-mapzen-api-key>
$ docker build -t pelias/slackbot . # builds the container image
$ docker run -p 8080:3000 -d --name pelias_slackbot pelias/slackbot # runs the container as a daemon
```
