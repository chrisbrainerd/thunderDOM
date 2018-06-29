# 👋

To spin this up, first you'll have to supply twitter and google maps API keys. You can get your twitter API keys [here](https://apps.twitter.com/) (you'll have to create an app to attach keys to first, but it's free), and your google maps API keys [here](https://developers.google.com/maps/documentation/javascript/get-api-key).

Once you have those, edit `./SECRETS` with those values.

To get started, start up the front end
- `npm install`
- `npm run start`

and in another terminal, start up the server
- `cd server/`
- `npm install`
- `node ./index.js`

This should serve the frontend on port 3000 and the server at port 3001 - if you override that, you'll have to update where the frontend points its websocked connection to.

Accompanying slides: https://docs.google.com/presentation/d/159RCJVy4Tvt5OgiGQWCSKpLS4R1xOdMoyyd8LXNYfeY