import React, { Fragment } from 'react';
import superagent from 'superagent';
import {connect} from 'react-redux';
import {logout} from '../store/actions/auth-action.js';
import { deleteUser } from '../store/actions/user-action.js';
const api = `${process.env.REACT_APP_SERVER_URL}/api/v1`;

class Login extends React.Component {
  state = {
    status: true,
  };
  
  /**
   * If user is logged in already just because of abrupt browser crash
   * Logout from current session and delete user record from local state.
   * dispatch redux action to logout and update user state.
   * Also check for server ping status before displaying login button
   * @memberof Login
   */
  componentDidMount(){
    
    this.props.logout();
    this.props.deleteUser();
    
    superagent.get(`${api}/ping`)
      .catch(err=>{
        this.setState({status:false});
      });
  }

  render() {
    return (
      <Fragment>
        {this.state.status?<div className="center-div">
          <h1 className="h1">Welcome to Twitch Login page</h1>
          <a href={`${api}/login`}>
            <img
              style={{marginTop:'2%'}}
              alt="twitch-button"
              src="https://ttv-api.s3.amazonaws.com/assets/connect_dark.png"
            />
          </a>
        </div>: <div className="center-div">
          <h1>Server is offline</h1>
          <p> please refresh the browser in a moment..</p>
        </div>}
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.authState,
  user: state.userState,
});
const mapDispatchToProps = {logout, deleteUser };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
