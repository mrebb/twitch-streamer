'use strict';

/**
 * Custom Error Handler because we always want to return a JSON response
 * @param err
 *    err can be either a string or an object.
 *    if it's a string, this will send a JSON formatted 500 "Server Error" with the error string embedded
 *    if it's an object, this wil use the object's .message, .status, .statusMessage properties to build the error response
 * @param req
 * @param res
 * @param next
 */
export default  (err,req,res,next) => {
  let error = {
    error:(typeof err==='object' && err.message) || err,
  };
  res.statusCode = (typeof err==='object' && err.status) || 500;
  res.statusMessage = (typeof err==='object' && err.statusMessage) || 'Server Error';
  res.setHeader('Content-Type', 'application/json');
  res.write( JSON.stringify(error) );
  res.end();
};
