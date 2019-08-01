// My module


/* Setting things up. */
const path = require('path');
const express = require('express');
const app = express();
const Twit = require('twit');
var base64 = require('node-base64-image');
    
const config = {
  twitter: {
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET
  }
},
T = new Twit(config.twitter);

app.use(express.static('public'));


const twitter = {
  tweet: (str) => {
    T.post('statuses/update', { status: str }, function(err, data, response) {
      console.log(data)
    })
  },
  
  postImg: (url, status, altText) => {
      try{
        
        var request = require('request').defaults({ encoding: null });

        request.get(url, function (error, response, body) {
              if (!error && response.statusCode == 200) {
                  var b64content = /*`data:${response.headers["content-type"]};base64,*/`${new Buffer(body).toString('base64')}`;
              }
            
          // first we must post the media to Twitter
          T.post('media/upload', { media_data: b64content }, function (err, data, response) {
            // now we can assign alt text to the media, for use by screen readers and
            // other text-based presentations and interpreters
            console.log(data)
            var mediaIdStr = data.media_id_string
            var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }

            T.post('media/metadata/create', meta_params, function (err, data, response) {
              if (!err) {
                // now we can reference the media and post a tweet (media will attach to the tweet)
                var params = { status: status, media_ids: [mediaIdStr] }

                T.post('statuses/update', params, function (err, data, response) {
                  console.log(data)
                })
              }else{console.log(err)}
            })
          }) 
            
        });
      }catch(e){console.log(e)}
    
  },
  
  followAccountFollowers: (screen_name) => {
    T.get('followers/ids', { screen_name: screen_name },  function (err, data, response) {
      console.log(data)
    })
  }
};


module.exports = twitter;