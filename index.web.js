import React from 'react';
import ReactDOM from 'react-dom';
import Home from './modules/Home';
import Login from './modules/Login';

 let App = React.createClass({
     getInitialState(){
         return {
             loginState: this.checkLoginState()
         }
     },
     checkLoginState(){
         //check localStorage
         return (localStorage.user != null);
     },
     updateLoginState(){
         //update localStorage...
         this.setState({loginState: true});
     },
     clearLoginState(){
         //clear localStorage...
         localStorage.clear();
         this.setState({loginState: false});
     },
     doLogin(){
         this.updateLoginState();
     },
     doSignup(){
        this.updateLoginState();
     },
     doLogout(){
        this.clearLoginState();
     },
     componentDidMount(){
     },
     render() {
         return (
             this.state.loginState ? <Home logout={this.doLogout}/> : <Login login={this.doLogin} signup={this.doSignup}/>
         );
     }
 });
ReactDOM.render(<App />, document.getElementById('root'));