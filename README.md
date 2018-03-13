# slack-search-app
Service for responding to custom Slack commands to do various Pelias things such as:

* search for a given string and provide links to [Pelias Compare](http://pelias.github.io/compare/)
* quickly generate Pull Requests to merge from master to staging, and staging to production (we use this as part of the Pelias release process)

## config
The following environment variables are needed

- `GITHUB_AUTH`: A GitHub Auth token that can create and merge PRs in the desired repos
- `PELIAS_HOST`: A URL to a pelias installation (for example, https://api.geocode.earth)
- `SEARCH_API_KEY`: A valid API key for the pelias installation

## run

```
npm start
```

## deploy with docker


```bash
$ git clone https://github.com/pelias/slack-search-app
$ cd ./slack-search-app
$ export GITHUB_AUTH=<your-github-token>
$ export SEARCH_API_KEY=<your-pelias-api-key>
$ docker build -t pelias/slack-search-app . # builds the container image
$ docker run -p 8080:3000 -d --name pelias_slackbot pelias/slack-search-app # runs the container as a daemon
```
