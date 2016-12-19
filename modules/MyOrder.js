/**
 * Created by NickChung on 11/27/16.
 */
import React from 'react';
import { Card, WhiteSpace,List,Steps,WingBlank,Stepper,Button,InputItem,Flex } from 'antd-mobile';
const Repo = require("./Repo.js");

const Item = List.Item;
const Step = Steps.Step;
const Icon = ({ type }) => <span className={`anticon anticon-${type}`} />;
var intervalId;

const PlaceHolder = (props) => (
    <div style={{
    backgroundColor: '#ffffff',
    color: '#ffffff',
    textAlign: 'center',
    height: '0.6rem',
    lineHeight: '0.6rem',
    width: '10%'
  }} {...props}
        ></div>
);

let MyOrder = React.createClass({
    getInitialState(){
        return {
            dataSource: null,
            loading: true,
            score: 1,
            remark: '',
            rejectReason: ''
        }
    },
    onScoreChange(score) {
        this.setState({ score });
    },
    onRejectReaconChange(rejectReason){
        this.setState({ rejectReason });
    },
    onRemarkChange(remark){
        this.setState({ remark });
    },
    requestData(){
        let pageIndex = 1;
        var params = {page: pageIndex + ''};
        let profile = localStorage.user != null ? JSON.parse(localStorage.user) : {};
        if(profile.code && profile.token) {
            Repo.OrderList(profile.code, profile.token, params, (res)=> {
                //console.log('OrderList', Repo.getDescByCode(res.code));
                if (res.code == 214) {
                    alert(Repo.getDescByCode(res.code) + ',请重新登入！');
                    clearInterval(intervalId);
                    this.props.logout();
                }
                else {
                    if (res.data && res.data.list) {
                        //console.log('OrderList', res.data.list);
                        this.setState({dataSource: res.data.list[0], loading: false});
                    }
                    else {
                        this.setState({loading: false});
                    }
                }
            });
        }
    },
    cancelOrder(orderNo){
        let profile = localStorage.user != null ? JSON.parse(localStorage.user) : {};
        Repo.CancelOrder(profile.code, profile.token, {order_no: orderNo}, (res)=> {
            if (res.code == 315) {
                this.requestData();
                alert(Repo.getDescByCode(res.code));
            }
            else {
                //token invalid
                if (res.code == 214) {
                    alert(Repo.getDescByCode(res.code) + ',请重新登入！');
                    this.props.logout();
                }
                else {
                    alert(Repo.getDescByCode(res.code));
                }
            }
        });
    },
    completeOrder(orderNo){
        let profile = localStorage.user != null ? JSON.parse(localStorage.user) : {};
        Repo.CompleteOrder(profile.code, profile.token, {order_no: orderNo}, (res)=> {
            if (res.code == 324) {
                this.requestData();
                alert(Repo.getDescByCode(res.code));
            }
            else {
                //token invalid
                if (res.code == 214) {
                    alert(Repo.getDescByCode(res.code) + ',请重新登入！');
                    this.props.logout();
                }
                else {
                    alert(Repo.getDescByCode(res.code));
                }
            }
        });
    },
    commentOrder(orderNo, score, remark){
        let profile = localStorage.user != null ? JSON.parse(localStorage.user) : {};
        Repo.CommentOrder(profile.code, profile.token, {
            order_no: orderNo,
            score: score,
            content: remark
        }, (res)=> {
            if (res.code == 327) {
                this.requestData();
                alert(Repo.getDescByCode(res.code));
            }
            else {
                //token invalid
                if (res.code == 214) {
                    alert(Repo.getDescByCode(res.code) + ',请重新登入！');
                    this.props.logout();
                }
                else {
                    alert(Repo.getDescByCode(res.code));
                }
            }
        })
    },
    rejectOrder(orderNo, rejectReason){
        if (rejectReason == '') {
            alert('请输入拒绝理由!');
            return;
        }
        let profile = localStorage.user != null ? JSON.parse(localStorage.user) : {};
        Repo.RejectOrder(profile.code, profile.token, {order_no: orderNo, reject_reason: rejectReason}, (res)=> {
            if (res.code == 331) {
                this.requestData();
                alert(Repo.getDescByCode(res.code));
            }
            else {
                //token invalid
                if (res.code == 214) {
                    alert(Repo.getDescByCode(res.code) + ',请重新登入！');
                    this.props.logout();
                }
                else {
                    alert(Repo.getDescByCode(res.code));
                }
            }
        });
    },
    componentDidMount(){
        intervalId = setInterval(()=> {
            this.requestData();
        }, 3000);
    },
    render(){
        let obj = this.state.dataSource;
        if (obj) {
            return (
                <div>
                    <List renderHeader={''} renderFooter={''}>
                        {/*<Item>订单编号：{obj.order_no}</Item>*/}
                        <Item>订单类型：{Repo.getOrderTypeDesc(obj.order_type)}</Item>
                        <Item>订单备注：{obj.remark}</Item>
                        <Item>出发地点：{obj.start_position}</Item>
                        <Item>目的地点：{obj.end_position}</Item>
                        <Item>下单时间：{obj.start_date}</Item>
                        <Item>交易金额：{obj.amount}</Item>
                        {obj.status != 1 && obj.status != 2 ? <Item>接单时间：{obj.accept_date} </Item> : ''}
                        {obj.status == 2 ? <Item>订单取消时间：{obj.cancel_date} </Item> : ''}
                        {obj.status == 4 ? <Item>申请完成时间：{obj.apply_completedate} </Item> : ''}
                        {obj.status == 5 ? <Item>拒绝完成时间：{obj.reject_completedate}({obj.reject_reason}) </Item> : ''}
                        {obj.status == 6 ? <Item>订单完成时间：{obj.complete_date} </Item> : ''}
                        {(obj.status != 1 && obj.status != 2 && obj.driver_phone) ?
                            <Item><img src="http://112.74.129.174/gvpark/icon_phone.png"/><span
                                dangerouslySetInnerHTML={Repo.telMarkup(obj.driver_phone)}/></Item> : ''}
                        {/*<Item>司机区号：{obj.driver_prefix}</Item>
                         <Item>用户评分：{obj.is_user_comment.toString().replace('1','已评').replace('0','未评')}</Item>
                         <Item>司机评分：{obj.is_driver_comment.toString().replace('1','已评').replace('0','未评')}</Item>
                         <Item>用户电话：{obj.user_phone}</Item>
                         <Item>用户区号：{obj.user_prefix}</Item>*/}
                        <Item><span
                            style={{ fontSize: '1.1em', color: '#FF6E27' }}>订单状态：{Repo.getOrderStateDesc(obj.status)}</span>
                        </Item>
                        {obj.status == 1 ?
                            <Item><Button type="primary" onClick={()=>{this.cancelOrder(obj.order_no)}}>取消</Button></Item> : ''}
                        {obj.status == 4 ? <InputItem labelNumber={5} placeholder={"请输入拒绝理由..."} value={this.state.rejectReason} onChange={this.onRejectReaconChange}>拒绝理由：</InputItem> : ''}
                        {obj.status == 4 ?
                            <Item>
                                <Flex>
                                    <Button type="primary" onClick={()=>{this.rejectOrder(obj.order_no,this.state.rejectReason)}}>拒绝完成</Button>
                                    <PlaceHolder/>
                                    <Button type="primary" onClick={()=>{this.completeOrder(obj.order_no)}}>确认完成</Button>
                                </Flex>
                            </Item>
                            : ''}
                        {obj.status == 6 && obj.is_user_comment == 0 ? <Item><Flex><Stepper showNumber max={5} min={1} value={this.state.score} onChange={this.onScoreChange}/><InputItem placeholder={"请在此输入备注"} value={this.state.remark} onChange={this.onRemarkChange}>备注：</InputItem></Flex></Item> : ''}
                        {obj.status == 6 ?
                            obj.is_user_comment == 0 ?
                                <Item><Button type="primary"
                                              onClick={()=>{this.commentOrder(obj.order_no,this.state.score,this.state.remark)}}>评分</Button></Item> :
                                <Item><p style={{color:'orange'}}>已评分</p></Item>
                            : ''}
                        <Item>
                            <WingBlank size="lg">
                                <WhiteSpace size="lg"/>
                                <Steps size="small" current={obj.status - 1}>
                                    <Step title="已下单"/>
                                    <Step title="已取消"/>
                                    <Step title="已接单"/>
                                    <Step title="待确认完成"/>
                                    <Step title="拒绝完成"/>
                                    <Step title="已完成"/>
                                </Steps>
                            </WingBlank>
                        </Item>
                    </List>
                </div>
            );
        }
        else {
            return (
                <List renderHeader={''} renderFooter={''}>
                    <Item>{this.state.loading ? '查询中...' : '没有订单'}</Item>
                </List>
            );
        }
    }
});

module.exports = MyOrder;
