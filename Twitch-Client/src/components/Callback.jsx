import React from 'react';
import {connect} from 'react-redux';
import Loader from 'react-loader-spinner';
import queryString from 'query-string';
import superagent from 'superagent';
import {login,logout} from '../store/actions/auth-action.js';
import { addUser } from '../store/actions/user-action.js';
import { Redirect } from 'react-router-dom';
const api = `${process.env.REACT_APP_SERVER_URL}/api/v1/auth/twitch`;

class Callback extends React.Component{
  state = {
    loading: true,
    authorization_code:'',
    error:false,
  }
  /**
   * Read code from browser URL for authorization_code
   * Dispatch login, addUser reducer methods to update auth and user state
   * Redirect to dashboard
   * @memberof Callback
   */
  componentDidMount(){
    const values = queryString.parse(this.props.location.search);
    if(values.error) this.setState({error:true});
    superagent
      .get(api)
      .withCredentials()
      .query({authorization_code:values.code})
      .then(response=>{
        this.props.login();
        this.props.addUser(response.body);
        this.setState({loading:false});
      })
      .catch(err=>{
        console.log(err);
        this.setState({error:true});
      });
    
  }
  render(){
    if(this.state.error){
      return(<Redirect to='/'/>);
    }
    else{
      return(
        this.state.loading?
          <div style={{textAlign:'center',marginTop:'15%'}}><Loader
            type="Bars"
            color="#00BFFF"
            height="100"	
            width="100"
          /></div> :<Redirect to='/dashboard'/>   
      );
    }
  }
}

const mapStateToProps = state => ({
  auth: state.authState,
  user:state.userState,
});
const mapDispatchToProps = {login, logout, addUser };
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Callback);
