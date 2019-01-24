import superagent from 'superagent';
import User from '../models/model.js';
import {token} from '../api.js';
const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const TWITCH_SECRET    = process.env.TWITCH_SECRET;
let API_END_POINT = `https://id.twitch.tv/oauth2/token?`;
const API_END_POINT_USER = `https://api.twitch.tv/kraken/user`;
const options = {client_id:TWITCH_CLIENT_ID
  ,client_secret:TWITCH_SECRET,
  grant_type:'authorization_code'
  ,redirect_uri:process.env.CALLBACK_URL};
for(let key in options){
  API_END_POINT += `${key}=${options[key]}`+'&';
}
/**
  * Refresh the access_token as it expires
  * Make a request with Twitch oauth for getting new token
  * @return renewed access_token and refresh_token to caller
  */
const refreshToken = (REFRESH_TOKEN)=>{
  const options = {
    grant_type:'refresh_token',
    refresh_token:REFRESH_TOKEN,
    client_id:TWITCH_CLIENT_ID,
    client_secret:TWITCH_SECRET,
  };
  return superagent.post('https://id.twitch.tv/oauth2/token')
    .send(options)
    .then(response=>{
      //renewed the access_token successfully at this point.
      return response.body;
    })
    .catch(err=>console.log('Error',err.status));
   
};

/**
  * Call oauth authentication api with code received by client
  * Call api end point for user information to get user profile
  * Save user record in MongoDB
  * Make a request with Twitch oauth for getting new token
  * @return renewed access_token and refresh_token to caller
  */
const authorize = (req) => {
  return superagent.post(API_END_POINT+`code=${req.query.authorization_code}`)
    .then(response=>{
      for(let key in response.body){
        token[key] = response.body[key];
      }
      console.log('Received the access token from Twitch');
      return superagent.get(API_END_POINT_USER)
        .query({
          client_id:TWITCH_CLIENT_ID,
          scope:'user_read',
        })
        .set({'Authorization':`OAuth ${response.body.access_token}`})
        .then(profile=>{
          const user = Object.assign({},{
            'userID':profile.body._id,
            'name':profile.body.name,
            'email':profile.body.email,
          },token);
          return User.createFromOAuth(user);
        })
        .then(user=>{
          console.log('user created from mongo');
          return user;
        })
        .catch(error=>console.log('error:',error.response));
      
    })
    .catch(err=>console.log('error:',err));

};

export default {refreshToken,authorize};