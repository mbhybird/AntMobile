/**
 * Created by NickChung on 11/27/16.
 */
import React from 'react';
import { List,Button,Flex,Icon,Tag,Badge } from 'antd-mobile';
const Repo = require("./Repo.js");

const Item = List.Item;
var pageIndex = 0;

let OrderList = React.createClass({
    render() {
        return (
            <div>
                <OrderListContent {...this.props}/>
            </div>
        );
    }
});

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

const OrderListContent = React.createClass({
    getInitialState(){
        return {
            dataSource: [],
            loading: true
        }
    },
    loadMore(){
        pageIndex++;
        var params = {page: pageIndex + ''};
        let profile = localStorage.user != null ? JSON.parse(localStorage.user) : {};
        if(profile.code && profile.token) {
            Repo.OrderList(profile.code, profile.token, params, (res)=> {
                //console.log('OrderList', Repo.getDescByCode(res.code));
                if (res.code == 214) {
                    alert(Repo.getDescByCode(res.code) + ',请重新登入！');
                    this.props.logout();
                }
                else {
                    if (res.data) {
                        //console.log('OrderList', res.data.list);
                        this.setState({dataSource: this.state.dataSource.concat(res.data.list), loading: false});
                    }
                    else {
                        this.setState({loading: false});
                    }
                }
            });
        }
    },
    refresh(){
        pageIndex = 0;
        this.setState({dataSource: [], loading: true});
        this.loadMore();
    },
    componentWillMount(){
        setTimeout(()=> {
            this.loadMore();
        }, 1000);
    },
    render(){
        const row = (index, item) => {
            return (
                <div key={item.order_no}
                    >
                    <div style={{ display: '-webkit-box', display: 'flex' }}>
                        <div style={{ display: 'inline-block' }}>
                            <Item>{index + 1}.{Repo.getOrderTypeDesc(item.order_type)}</Item>
                            <Item wrap>备注：{item.remark}</Item>
                            {/*<p>起点：{item.start_position}</p>*/}
                            {/*<p>终点：{item.end_position}</p>*/}
                            {/*<p>金额：{item.amount}</p>*/}
                            <Item><span style={{ fontSize: '1.1em', color: '#FF6E27' }}>状态：{Repo.getOrderStateDesc(item.status)}</span></Item>
                            {item.driver_phone ?
                                <Item><img src="http://112.74.129.174/gvpark/icon_phone.png"/><span dangerouslySetInnerHTML={Repo.telMarkup(item.driver_phone)}/></Item> : ''}
                            <Item>{item.is_user_comment == 1 ? <span style={{color:'orange'}}><Icon type="smile"/>已评分</span> : <span style={{color:'green'}}><Icon type="frown"/>未评分</span>}</Item>
                        </div>
                    </div>
                </div>
            );
        };
        if (this.state.dataSource.length > 0) {
            return (
                <List
                    renderHeader={() =>
                    <Flex>
                        <Button type="warning" onClick={this.loadMore} style={{margin:2}}>查询更多</Button>
                        <Button type="warning" onClick={this.refresh} style={{margin:2}}>刷新</Button>
                    </Flex>
                    }
                    renderFooter={() =>
                    <Flex>
                        <Button type="warning" onClick={this.loadMore} style={{margin:2}}>查询更多</Button>
                        <Button type="warning" onClick={this.refresh} style={{margin:2}}>刷新</Button>
                    </Flex>
                    }>
                    {this.state.dataSource.map((item, index) => {
                        return (<List.Item key={index}
                                           thumb="http://112.74.129.174/gvpark/icon_route.png"
                            >{row(index, item)}</List.Item>);
                    })}
                </List>
            );
        }
        else {
            return (
                <List
                    renderHeader={() =>
                    <Flex>
                        <Button type="warning" onClick={this.loadMore} style={{margin:2}}>查询更多</Button>
                        <Button type="warning" onClick={this.refresh} style={{margin:2}}>刷新</Button>
                    </Flex>
                    }
                    renderFooter={''}>
                    <List.Item>{this.state.loading ? '查询中...' : '没有订单'}</List.Item>
                </List>
            );
        }
    }
});

//<div>评分：
//    <Icon type="star" style={{color:'orange',padding:1}}/>
//    <Icon type="star" style={{color:'orange',padding:1}}/>
//    <Icon type="star" style={{color:'orange',padding:1}}/>
//    <Icon type="star" style={{color:'orange',padding:1}}/>
//    <Icon type="star" style={{color:'orange',padding:1}}/>
//    (User Comment...)
//</div>

/*
 <Flex>
 <Flex.Item><Icon type='left' onClick={this.onPrev} style={{width:'100%'}}></Icon></Flex.Item>
 <Flex.Item><PlaceHolder/></Flex.Item>
 <Flex.Item><PlaceHolder/></Flex.Item>
 <Flex.Item><PlaceHolder/></Flex.Item>
 <Flex.Item><PlaceHolder/></Flex.Item>
 <Flex.Item><Icon type='right' onClick={this.onNext} style={{width:'100%'}}></Icon></Flex.Item>
 </Flex>
 */

module.exports = OrderList;

/*
    "accept_date": "1970-01-01 00:00:00",
    "amount": 58.52,
    "complete_date": "2016-12-03 04:19:15",
    "driver_phone": "13912345678",
    "driver_prefix": 2,
    "end_latitude": "22.195994",
    "end_longitude": "113.550936",
    "end_position": "關閘",
    "is_driver_comment": 0,
    "is_user_comment": 1,
    "order_no": "11161203032026000014",
    "order_type": 1,
    "remark": "趕時間，5分鐘內到",
    "start_date": "2016-12-03 03:20:26",
    "start_latitude": "22.195994",
    "start_longitude": "113.550936",
    "start_position": "宋玉生廣場公交巴士站",
    "status": 4,
    "user_phone": "18688888888",
    "user_prefix": 2
 */
