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
         /*
         var profile = {};
         if (!localStorage.user) {
             Repo.UserSignIn({prefix: 2, phone: '18688888888', verification_code: 944943}, (res)=> {
                 if (res.data) {
                     console.log('UserSignIn',res.data.list[0]);
                     localStorage.user = JSON.stringify(res.data.list[0]);
                 }
             });
         } else {
             profile = JSON.parse(localStorage.user);
             console.log(profile);
         }

         Repo.VerificationSignUp({prefix: 1, phone: '62880227'}, (res)=> {
             console.log('VerificationSignUp',Repo.getDescByCode(res.code));
         });

         Repo.VerificationSignIn({prefix: 1, phone: '62880227'}, (res)=> {
             console.log('VerificationSignIn',Repo.getDescByCode(res.code));
         });

         Repo.UserSignUp({prefix: 2, phone: '18688888888', verification_code: 944943}, (res)=> {
             console.log('UserSignUp',Repo.getDescByCode(res.code));
         });

         Repo.OrderList(profile.code, profile.token, {page: '0'}, (res)=> {
             console.log('OrderList',Repo.getDescByCode(res.code));
             if (res.data) {
                 console.log('OrderList',res.data.list);
             }
         });

         Repo.DriverNear(Repo.SERVICE_TYPE.ProxyDrive, '113.550936', '22.195994', (res)=> {
             console.log('DriverNear',Repo.getDescByCode(res.code));
             if (res.data) {
                 console.log('DriverNear',res.data);
             }
         });

         Repo.MyOrder(profile.code, profile.token, {order_no: '11161203032026000014'}, (res)=> {
             console.log('MyOrder',Repo.getDescByCode(res.code));
             if (res.data) {
                 console.log('MyOrder',res.data.list[0]);
             }
         });

         Repo.CreateOrder(profile.code, profile.token, {
             order_type: Repo.ORDER_TYPE.ProxyDrive,
             start_position: '宋玉生廣場公交巴士站',
             start_longitude: '113.550936',
             start_latitude: '22.195994',
             end_position: '关闸',
             end_longitude: '113.550936',
             end_latitude: '22.195994',
             amount: 58.52,
             remark: '趕時間，5分鐘內到'
         }, (res)=> {
             console.log('CreateOrder',Repo.getDescByCode(res.code));
         });

         Repo.CompleteOrder(profile.code, profile.token, {order_no: '11161203032026000014'}, (res)=> {
             console.log('CompleteOrder',Repo.getDescByCode(res.code));
         });

         Repo.CommentOrder(profile.code, profile.token, {
             order_no: '11161203032026000014',
             score: 5,
             content: '准时服务周到'
         }, (res)=> {
             console.log('CommentOrder',Repo.getDescByCode(res.code));
         })*/
     },
     render() {
         return (
             this.state.loginState ? <Home logout={this.doLogout}/> : <Login login={this.doLogin} signup={this.doSignup}/>
         );
     }
 });
ReactDOM.render(<App />, document.getElementById('root'));