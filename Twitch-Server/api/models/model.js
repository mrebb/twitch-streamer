'use strict';

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  userID: {type: String,required: true, unique: true},
  name: {type: String, required: true},
  access_token: {type: String, required: true},
  refresh_token:{type: String, required: true},
  expires_in:{type: String, required: true},
  email: {type: String},
  favoriteStreamer: {type: String},
});

/**
  * Search for user record in user table, if found return user object
  * if new user, create a new user with the data provided and return user
  * @return renewed access_token and refresh_token to caller
  */
userSchema.statics.createFromOAuth = function(incoming) {

  if ( ! incoming || ! incoming.userID ) {
    return Promise.reject('VALIDATION ERROR: missing user id ');
  }

  return this.findOne({userID:incoming.userID})
    .then(user => {
      if ( ! user ) { throw new Error ('User Not Found'); }
      console.log('Welcome Back', user.name);
      return this.findOneAndUpdate({userID: incoming.userID}, {$set:incoming}, {new: true}, (err, doc) => {
        if (err) {
          console.log('Something wrong when updating data!');
        }
        console.log('updated user record with new token set');
        return doc;
      });
      
    })
    .catch( error => {
    // Create the user
      console.log('creating user because user not found',error);
      return this.create(incoming);
    });

};



export default mongoose.model('users', userSchema);
