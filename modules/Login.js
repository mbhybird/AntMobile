/**
 * Created by NickChung on 11/27/16.
 */
import React from 'react';
import { List, InputItem, Switch, Stepper, Slider, Button, Flex, Popup, Icon, WingBlank, WhiteSpace, Card, Modal,Picker } from 'antd-mobile';
import { createForm } from 'rc-form';
const Repo = require("./Repo.js");

const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let wrapProps;
if (isIPhone) {
    // Note: the popup content will not scroll.
    wrapProps = {
        // onTouchStart: e => e.preventDefault(),
    };
}
const Item = List.Item;
const Brief = Item.Brief;

const PlaceHolder = (props) => (
    <div style={{
    backgroundColor: '#ffffff',
    color: '#ffffff',
    textAlign: 'center',
    height: '0.6rem',
    lineHeight: '0.6rem',
    width: '100%'
  }} {...props}
        ></div>
);


let Login = React.createClass({
    getInitialState() {
        return {
            visible: false
        };
    },
    onSignUp() {
        this.setState({visible: true});
    },
    onClose(){
        this.setState({visible: false});
    },
    onUserSignUp(){
        let formVal = this.props.form.getFieldsValue();
        if(!formVal.signup_phone_prefix) {
            alert('请选择区号！');
            return;
        }
        if (formVal.signup_phone) {
            let phone = formVal.signup_phone;
            let prefix = parseInt(formVal.signup_phone_prefix);
            if ((phone.length >=6 && phone.length <= 11) && phone.match(/^\d.*$/)) {
                Repo.UserSignUp({
                    prefix: prefix,
                    phone: phone,
                    verification_code: formVal.signup_verificationCode
                }, (res)=> {
                    if (res.code == '400') {
                        alert('验证码不正确!');
                    }
                    else {
                        alert(Repo.getDescByCode(res.code));
                        if (res.data) {
                            localStorage.user = JSON.stringify(res.data.list[0]);
                            this.props.login();
                        }
                    }
                });
            }else{
                alert('请输入正确的手机号！');
            }
        }
        else {
            alert('请输入手机号！');
        }
    },
    onSubmit() {
        let formVal = this.props.form.getFieldsValue();
        if(!formVal.phone_prefix) {
            alert('请选择区号！');
            return;
        }
        if (formVal.phone) {
            let phone = formVal.phone;
            let prefix = parseInt(formVal.phone_prefix);
            if ((phone.length >= 6 && phone.length <= 11) && phone.match(/^\d.*$/)) {
                Repo.UserSignIn({
                    prefix: prefix,
                    phone: phone,
                    verification_code: formVal.verificationCode
                }, (res)=> {
                    if (res.code == '400') {
                        alert('验证码不正确!');
                    }
                    else {
                        alert(Repo.getDescByCode(res.code));
                        if (res.data) {
                            localStorage.user = JSON.stringify(res.data.list[0]);
                            this.props.login();
                        }
                    }
                });
            }else{
                alert('请输入正确的手机号！');
            }
        }
        else {
            alert('请输入手机号！');
        }
    },
    onSendVerification() {
        let formVal = this.props.form.getFieldsValue();
        if(!formVal.phone_prefix) {
            alert('请选择区号！');
            return;
        }
        if (formVal.phone) {
            let phone = formVal.phone;
            let prefix = parseInt(formVal.phone_prefix);
            if ((phone.length >= 6 && phone.length <= 11) && phone.match(/^\d.*$/)) {
                Repo.VerificationSignIn({prefix: prefix, phone: phone}, (res)=> {
                    if (res.code == '101') {
                        alert('验证码已发送!');
                    }
                    else {
                        alert(Repo.getDescByCode(res.code));
                    }
                });
            }
            else {
                alert('请输入正确的手机号！');
            }
        }
        else {
            alert('请输入手机号！');
        }
    },
    onSignUpSendVerification() {
        let formVal = this.props.form.getFieldsValue();
        if(!formVal.signup_phone_prefix) {
            alert('请选择区号！');
            return;
        }
        if (formVal.signup_phone) {
            let phone = formVal.signup_phone;
            let prefix = parseInt(formVal.signup_phone_prefix);
            if ((phone.length >= 6 && phone.length <= 11) && phone.match(/^\d.*$/)) {
                Repo.VerificationSignUp({prefix: prefix, phone: phone}, (res)=> {
                    if (res.code == '101') {
                        alert('验证码已发送!');
                    }
                    else {
                        alert(Repo.getDescByCode(res.code));
                    }
                });
            }
            else {
                alert('请输入正确的手机号！');
            }
        }
        else {
            alert('请输入手机号！');
        }
    },
    onReset() {
        this.props.form.resetFields();
    },
    validateAccount(rule, value, callback) {
        if (value && (value.length >= 6 && value.length <= 11) && value.match(/^\d.*$/) ) {
            callback();
        } else {
            callback(new Error('手机号为6-11位数字'));
        }
    },
    render() {
        const { getFieldProps, getFieldError } = this.props.form;
        return (<form>
            <List renderHeader={() => '登入系统'}
                  renderFooter={() => getFieldError('phone') && getFieldError('phone').join(',')}
                >
                <Flex>
                    <PlaceHolder/>
                        <img src="http://112.74.129.174/gvpark/icon_logo.png" style={{margin:5}}/>
                    <PlaceHolder/>
                </Flex>
                <Picker data={[{value:1,label:'澳门'},{value:2,label:'大陆'},{value:3,label:'香港'},{value:4,label:'台湾'}]}
                        cols={1} {...getFieldProps('phone_prefix')} className="forss">
                    <List.Item arrow="horizontal">区号</List.Item>
                </Picker>
                <InputItem
                    {...getFieldProps('phone', {
                        rules: [
                            { required: true, message: '请输入手机号' },
                            { validator: this.validateAccount }
                        ]
                    })}
                    clear
                    error={!!getFieldError('phone')}
                    onErrorClick={() => {
                        alert(getFieldError('phone').join(','));
                      }}
                    placeholder="请输入手机号"
                    >手机</InputItem>
                <InputItem {...getFieldProps('verificationCode')} placeholder="点击右边图标重新发送" type="number" extra={
                    <Icon type="reload" onClick={this.onSendVerification} />
                    }>
                    验证码
                </InputItem>
            </List>
            <div style={{ marginLeft: 80}}>
                <Flex>
                    <Flex.Item><Button type="primary" onClick={this.onSubmit} inline>登入</Button></Flex.Item>
                    <Flex.Item><Button onClick={this.onReset} inline>重置</Button></Flex.Item>
                    <Flex.Item><Button type="warning" onClick={this.onSignUp} inline>注册</Button></Flex.Item>
                </Flex>
            </div>
            <Modal
                onClose={this.onClose}
                transparent
                visible={this.state.visible}
                style={{width:'90%'}}
                >
                <List renderHeader={() => (
                                    <div style={{ position: 'relative' }}>
                                      注册资料填写
                                    </div>)}
                      renderFooter={() => getFieldError('signup_phone') && getFieldError('signup_phone').join(',')}
                    >
                    <Item>
                        服务条款
                        <Brief>条款1...</Brief>
                        <Brief>条款2...</Brief>
                        <Brief>条款3...</Brief>
                        <Brief>条款4...</Brief>
                        <Brief>条款5...</Brief>
                        <Brief>条款6...</Brief>
                    </Item>
                    <Picker data={[{value:1,label:'澳门'},{value:2,label:'大陆'},{value:3,label:'香港'},{value:4,label:'台湾'}]}
                            cols={1} {...getFieldProps('signup_phone_prefix')} className="forss">
                        <List.Item arrow="horizontal">区号</List.Item>
                    </Picker>
                    <InputItem
                        {...getFieldProps('signup_phone', {
                            rules: [
                                { required: true, message: '请输入手机号' },
                                { validator: this.validateAccount }
                            ]
                        })}
                        clear
                        error={!!getFieldError('signup_phone')}
                        onErrorClick={() => {
                        alert(getFieldError('signup_phone').join(','));
                      }}
                        placeholder="请输入手机号"
                        >手机</InputItem>
                    <InputItem {...getFieldProps('signup_verificationCode')} placeholder="请输入验证码" type="number">
                        验证码
                    </InputItem>
                    <List.Item>
                        <Button type="ghost" onClick={() => this.onSignUpSendVerification()}>获取验证码</Button>
                    </List.Item>
                    <List.Item>
                        <Button type="primary" onClick={() => this.onUserSignUp()}>提交注册</Button>
                    </List.Item>
                </List>
            </Modal>
        </form>);
    }
});

Login = createForm()(Login);
module.exports = Login;