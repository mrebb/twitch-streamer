'use strict';
// Define dependencies
import express from 'express';
import path from 'path';
const router = express.Router();
import superagent from 'superagent';
import oauth from './lib/oauth.js';
import User from './models/model.js';

// // Define constants
const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const CALLBACK_URL     = process.env.CALLBACK_URL; 
const apiStreamsURL = `https://api.twitch.tv/helix/streams?client_id=${TWITCH_CLIENT_ID}&user_login=`;
const apiVideosURL = `https://api.twitch.tv/helix/videos?client_id=${TWITCH_CLIENT_ID}&first=10&user_id=`;
export const token = {};


//Server home page served here
router.get('/', (req,res) => {
  console.log('serving server home page');
  res.sendFile(path.join(__dirname +'/index.html'));
});

// Set route to start OAuth authentication
router.get('/api/v1/auth/twitch', function(req, res) {
  oauth.authorize(req)
    .then ( user => {
      console.log('Received the access token from oauth');
      res.cookie('access_token', user.access_token, { maxAge: user.expires_in*1000});
      res.send(user);
    })
    .catch(err=>console.log('error:',err));
}
);
// Get user profile information for already logged in user
router.get('/api/v1/profile', function (req, res) {
  User.findOne({'userID':req.query.userID})
    .then(user=>{
      if(user && user.favoriteStreamer){
        getStreams(user.favoriteStreamer,req,res);
      }
      else{
        res.status(204);
        res.send('Streamer data not found for this user');
       
      }
    })
    .catch(err=>{
      console.log(err);
      res.status(400);
      res.send('User not found, something went wrong');
      
    });
});

//ping status of server
router.get('/api/v1/ping', function (req, res) {
  console.log('server is up and running');
  res.send('pong');
});

//Start with login route to redirect user to twitch login screen from client side
router.get('/api/v1/login', function (req, res) {
  res.redirect(`https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=${TWITCH_CLIENT_ID}&scope=user_read&force_verify=true&redirect_uri=${CALLBACK_URL}`);
});

//Get live streaming channel and videos of a channel requested by client
router.get('/api/v1/channels/:id', function (req, res) {
  const {id} = req.params;
  if(id){
    //Call helper function to talk to Twitch and get streams for given channel
    getStreams(id,req,res);
  }
  else{
    res.status(400);
    res.send('no streamer name received');
  }
});

/**
  * Helper function to call Twitch API to get live channel info and videos tagged to that streamer
  * @return send response to client
  */
const getStreams  =  (id,req,res,cookie) => {
  let bearerToken = req.headers.authorization;
  if(bearerToken){
    bearerToken = bearerToken.replace('Bearer ','');
  }
  let currentCookie = cookie? cookie.access_token:bearerToken;
  let updatedUser = {'favoriteStreamer':id};
  if(cookie) updatedUser = Object.assign(updatedUser,{access_token:cookie.access_token,refresh_token:cookie.refresh_token,expires_in:cookie.expires_in});
  superagent.get(`${apiStreamsURL}${id}`).set({'Authorization': `Bearer ${currentCookie}` })
    .then(response=>{
      if(response.body.data&&response.body.data.length>0){
        superagent.get(`${apiVideosURL}${response.body.data[0].user_id}`).set({'Authorization': `Bearer ${currentCookie}` })
          .then(data=>{
            if(data.body.data&&data.body.data.length>0){
              User.findOneAndUpdate({userID: req.query.userID}, {$set:updatedUser}, {new: true}, (err, doc) => {
                if (err) {
                  console.log('Something wrong when updating data!');
                }
                console.log('updated user record');
                res.send(data.body.data);
              });
              
            }
            else{
              console.log('No Videos returned from Twitch');
              res.send('No Videos returned from Twitch');
            }
            
          });
      }
      else{
        console.log(`No channel found on Twitch with name ${id}`);
        res.send(`No channel found on Twitch with name ${id}`);
      }
    })
    // If Twitch rejects the request with specific header, refresh the access token and get new refresh token from Twitch API
    .catch(err=>{
      console.log('Error:',err.response.body);
      console.log(`access_token looks like wrong or expired`);
      if(err.status===401 && token.refresh_token){
        console.log(`Refreshing/renewing the access_token using refresh token and callback`);
        oauth.refreshToken(token.refresh_token).then(refreshTokensList=>{
          token.refresh_token = refreshTokensList.refresh_token;
          // call helper function with an extra parameter that has new renewed tokens
          return getStreams(id,req,res,refreshTokensList);
        });
      }
      else{
        res.status(401);
        res.send('Authentication Failed');
      }
    });
};

export default router;