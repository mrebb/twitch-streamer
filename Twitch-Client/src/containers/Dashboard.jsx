import React, { Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import {connect} from 'react-redux';
import superagent from 'superagent';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import LoadingOverlay from 'react-loading-overlay';
import Loader from 'react-loader-spinner';
import {login,logout} from '../store/actions/auth-action.js';
import { deleteUser } from '../store/actions/user-action.js';

class Dashboard extends React.Component {
  state = {
    streamer: '',
    error: false,
    videoDataArray: [],
    channel:'',
    isActive:false,
    redirect:false,
  };
  
  /**
   * User is successfully logged in and recieved access_token from server before dashboard component is mounted
   * Send bearer token to backend REST API to recieve favorite streamer live broadcast
   * First time users who hasn't set the favorite streamer info wouldn't be loaded with live broadcast
   * @memberof Dashboard
   */
  componentDidMount(){
    this._isMounted = true;
    if(this.props.user.length>0 && this.props.user[0].access_token){
      superagent
        .get(`${process.env.REACT_APP_SERVER_URL}/api/v1/profile`)
        .query({'userID':this.props.user[0].userID})
        .set({'Authorization': `Bearer ${this.props.user[0].access_token}` })
        .then(response => {
          if(response.status===200 && this._isMounted){
            this.setState({ videoDataArray: response.body,channel:response.body[0].user_name });
            this.setState({isActive:true});
            this.interval = setTimeout(() => {
              this.setState({isActive:false});
            }, 15000);
          }
        })
        .catch(err=>{
          console.log('error',err);
        });
    }
    else{
      if(this._isMounted) this.setState({redirect:true});
    }
  }
  componentWillUnmount() {
    clearInterval(this.interval);
    this._isMounted = false;
  }

  onChange = event => {
    this.setState({error:false});
    const changedBit = {
      [event.target.name]: event.target.value,
    };
    this.setState(changedBit);
  };
  /**
   * handle signout by dispatching reducer method 'logout' & 'deleteuser'
   * sets redirect flag to help routing to login page
   * @memberof Dashboard
   */
  onLogout = event => {
    event.preventDefault();
    this.props.logout();
    this.props.deleteUser();
    this.setState({ redirect: true });
    window.location.reload();
  };
  
  /**
   * User submits the form after entering streamer name
   * Loads the live stream video if streamer is currently online
   * @memberof Dashboard
   */
  onSubmit = event => {
    event.preventDefault();
    if(this.props.user.length>0 && this.props.user[0].access_token){
      superagent
        .get(`${process.env.REACT_APP_SERVER_URL}/api/v1/channels/${this.state.streamer}`)
        .query({'userID':this.props.user[0].userID})
        .set({'Authorization': `Bearer ${this.props.user[0].access_token}` })
        .then(response => {
          if(response.body===null){
            this.setState({error:true});
          }
          else{
            this.setState({ videoDataArray: response.body,channel:response.body[0].user_name });
            this.setState({isActive:true});
            setTimeout(() => {
              this.setState({isActive:false});
            }, 12000);
          }
        })
        .catch(err=>{
          console.log('error',err);
          this.setState({redirect:true});
        });
    }
    else{
      this.setState({redirect:true});
    }
  };

  render() {
    return (
      <Fragment>
        {this.props.auth.isLoggedIn && this.props.user.length>0 && this.props.user[0].access_token?
          <LoadingOverlay
            active={this.state.isActive}
            spinner={<Loader
              type="Bars"
              color="#00BFFF"
              height="100"	
              width="100"
            />}
          >
            <div className="center-div">
              <Button
                label="Submit"
                style={{
                  margin: 15,
                }}
                onClick={this.onLogout}
                type="submit"
                variant="contained"
                color="primary"
              >
          Logout
              </Button>
            </div>
            <form onSubmit={this.onSubmit} autoComplete="off">
              <h2 className="form-header">Enter your favorite streamer name</h2>
              <div className="flex-wrap">
                <TextField
                  required
                  type="text"
                  label="Streamer"
                  className="text-field"
                  inputProps={{ maxLength: 100 }}
                  error={this.state.error}
                  helperText={
                    this.state.error
                      ? 'Looks like you entered incorrect streamer name or channel is currently offline on Twitch'
                      : ''
                  }
                  value={this.state.streamer}
                  placeholder="Angrypug, monstercat..."
                  style={{ margin:'2% 2% 3% 8%', flexBasis: 300 }}
                  name="streamer"
                  onChange={this.onChange}
                />
                <Button
                  id="submit"
                  type="submit"
                  className="submit-button"
                  variant="contained"
                  color="primary"
                  style={{height: '40px', margin:'3% 0 3% 0'}}
                >
            Submit
                </Button>
              </div>
            </form>
            {this.state.videoDataArray&&this.state.videoDataArray.length > 0 && 
        <Fragment>
          
          <h3 className="form-header">Live Stream</h3>
          <div className="live-stream">
            <iframe
              title={`${this.state.videoDataArray[0].id}`}
              src={`https://player.twitch.tv/?channel=${this.state.channel}`}
              height="480"
              width="60%"
              scrolling="no"
              name="live-stream"
              allowFullScreen={false}>
            </iframe>
            <iframe 
              title={`${this.state.streamer}`}
              scrolling="no"
              name="chat-window"
              id="chat_embed"
              src={`https://www.twitch.tv/embed/${this.state.channel}/chat`}
              height="480"
              width="30%">
            </iframe> 
          </div>
          <h3 className="form-header">Recent highlights and uploads</h3>
          <ul>
            {
              this.state.videoDataArray.length > 0 && this.state.videoDataArray.map((video,i)=>{
                return(<li key={i}>
                  <iframe
                    title={`${video.id}`}
                    src={`https://player.twitch.tv/?video=${video.id}&autoplay=false&enablejsapi=1&origin=${process.env.REACT_APP_CLIENT_URL}`}
                    height="250"
                    width="30%"
                    scrolling="no"
                    name="live-stream"
                    allowFullScreen={false}>
                  </iframe>
                </li>);
              })
            }
          </ul>
         
        </Fragment> }
            {
              this.state.redirect&& <Redirect to='/'/> 
            }
          </LoadingOverlay>:<Redirect to='/'/> 
        }
      </Fragment>
     
    );
     
  }
}

const mapStateToProps = state => ({
  auth: state.authState,
  user: state.userState,
});
const mapDispatchToProps = {login, logout, deleteUser };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);