/**
 * Created by NickChung on 11/27/16.
 */
import React from 'react';
import { Drawer, List, NavBar, TabBar, Tabs, WhiteSpace, Popover, Icon,Button,WingBlank,Popup,Badge,Radio,SegmentedControl,Flex } from 'antd-mobile';
import Profile from './Profile';
import OrderList from './OrderList';
import MyOrder from './MyOrder';
import Map from './Map';
const Repo = require("./Repo.js");

// fix touch to scroll background page on iOS
// https://github.com/ant-design/ant-design-mobile/issues/307
// https://github.com/ant-design/ant-design-mobile/issues/163
const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let wrapProps;
if (isIPhone) {
    // Note: the popup content will not scroll.
    wrapProps = {
        // onTouchStart: e => e.preventDefault(),
    };
}

const RadioItem = Radio.RadioItem;
const Item = Popover.Item;
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

let Home = React.createClass({
    render() {
        return (
            <div>
                <HomeDrawer {...this.props}/>
            </div>
        );
    }
});

const BottomTabBar = React.createClass({
    getInitialState() {
        return {
            selectedTab: 'call_service',
            hidden: true
        };
    },
    changeSelectedTab(key){
        this.setState({
            selectedTab: key
        });
    },
    updateLocation(){
        this.refs.st.updateLocation();
    },
    renderTabContent(tab){
        var placeHolder = null;
        switch(tab){
            case 'call_service':
                placeHolder = <ServiceTab changeTab={this.changeSelectedTab} {...this.props} ref={'st'}/>;
                break;
            case 'cur_order':
                placeHolder = <MyOrder {...this.props}/>;
                break;
            case 'order_list':
                placeHolder = <OrderList {...this.props}/>;
                break;
            case 'profile':
                placeHolder = <Profile {...this.props}/>;
                break;
        }

        return placeHolder;
    },
    renderContent(pageText,tab) {
        return (
            <div style={{ backgroundColor: 'white', height: '100%', textAlign: 'center'}}>
                {this.renderTabContent(tab)}
                {/*
                <div style={{ paddingTop: 3 }}>你已点击“{pageText}” tab， 当前展示“{pageText}”信息</div>
                <a style={{ display: 'block', marginTop: 40 }} onClick={(e) => {
                      e.preventDefault();
                      this.setState({
                        hidden: !this.state.hidden
                      });
                    }}
                    >
                    点击切换 tab-bar 显示/隐藏
                </a>*/}
            </div>
        );
    },
    render() {
        return (
            <TabBar
                unselectedTintColor="#949494"
                tintColor="#33A3F4"
                barTintColor="white"
                hidden={this.state.hidden}
                >
                <TabBar.Item
                    icon={{ uri: 'http://112.74.129.174/gvpark/icon_call_service.png' }}
                    selectedIcon={{ uri: 'http://112.74.129.174/gvpark/icon_call_service_sel.png' }}
                    title="呼叫服务"
                    key="呼叫服务"
                    selected={this.state.selectedTab === 'call_service'}
                    onPress={() => {
                        this.setState({
                          selectedTab: 'call_service'
                        });
                      }}
                    >
                    {this.renderContent('呼叫服务','call_service')}
                </TabBar.Item>
                <TabBar.Item
                    title="当前订单"
                    key="当前订单"
                    icon={{uri: 'http://112.74.129.174/gvpark/icon_cur_order.png'}}
                    selectedIcon={{uri: 'http://112.74.129.174/gvpark/icon_cur_order_sel.png'}}
                    selected={this.state.selectedTab === 'cur_order'}
                    //badge={1}
                    onPress={() => {
                        this.setState({
                          selectedTab: 'cur_order'
                        });
                      }}
                    >
                    {this.renderContent('当前订单','cur_order')}
                </TabBar.Item>
                <TabBar.Item
                    icon={{ uri: 'http://112.74.129.174/gvpark/icon_order_list.png' }}
                    selectedIcon={{ uri: 'http://112.74.129.174/gvpark/icon_order_list_sel.png' }}
                    title="订单记录"
                    key="订单记录"
                    selected={this.state.selectedTab === 'order_list'}
                    onPress={() => {
                        this.setState({
                          selectedTab: 'order_list'
                        });
                      }}
                    >
                    {this.renderContent('订单记录','order_list')}
                </TabBar.Item>
                <TabBar.Item
                    icon={{ uri: 'http://112.74.129.174/gvpark/icon_profile.png' }}
                    selectedIcon={{ uri: 'http://112.74.129.174/gvpark/icon_profile_sel.png' }}
                    title="个人设定"
                    key="个人设定"
                    selected={this.state.selectedTab === 'profile'}
                    onPress={() => {
                        this.setState({
                          selectedTab: 'profile'
                        });
                      }}
                    >
                    {this.renderContent('个人资料','profile')}
                </TabBar.Item>
            </TabBar>
        );
    }
});

const HomeDrawer = React.createClass({
    getInitialState() {
        return {
            open: false,
            position: 'left',
            visible: false,
            selected: ''
        };
    },
    onSelect(opt) {
        // console.log(opt.props.value);
        this.setState({
            visible: false,
            selected: opt.props.value
        });
        if (opt.props.value == "logout") {
            this.props.logout();
        }
    },
    handleVisibleChange(visible) {
        this.setState({
            visible
        });
    },
    onOpenChange(isOpen) {
        console.log(isOpen, arguments);
        this.setState({open: !this.state.open});
        if (selectedIndex != 1) {
            selectedIndex = 1;
            this.refs.btb.updateLocation();
        }
    },
    onLeftMenuSelect(key){
        let newTab = key.replace('menu_','');
        this.setState({
            open: false
        });
        this.refs.btb.changeSelectedTab(newTab);
    },
    render() {
        const sidebar = (<List>
            {[
                    (<List.Item key="menu_call_service"
                                thumb="http://112.74.129.174/gvpark/icon_call_service.png"
                                multipleLine
                                onClick={()=>{this.onLeftMenuSelect('menu_call_service')}}
                        >呼叫服务
                    </List.Item>),
                    (<List.Item key="menu_cur_order"
                                thumb="http://112.74.129.174/gvpark/icon_cur_order.png"
                                multipleLine
                                onClick={()=>{this.onLeftMenuSelect('menu_cur_order')}}
                        >当前订单
                    </List.Item>),
                    (<List.Item key="menu_order_list"
                                thumb="http://112.74.129.174/gvpark/icon_order_list.png"
                                multipleLine
                                onClick={()=>{this.onLeftMenuSelect('menu_order_list')}}
                        >订单记录
                    </List.Item>),
                    (<List.Item key="menu_profile"
                                thumb="http://112.74.129.174/gvpark/icon_profile.png"
                                multipleLine
                                onClick={()=>{this.onLeftMenuSelect('menu_profile')}}
                        >个人设定
                    </List.Item>)
                ]}
        </List>);

        const drawerProps = {
            open: this.state.open,
            position: this.state.position,
            onOpenChange: this.onOpenChange
        };
        return (<div>
            <NavBar iconName="bars" onLeftClick={this.onOpenChange} rightContent={
                <Popover
                  visible={this.state.visible}
                  overlay={[
                    (<Item key="4" value="logout" iconName="logout">登出</Item>)
                  ]}
                  popupAlign={{
                    overflow: { adjustY: 0, adjustX: 0 },
                    offset: [-2, 15]
                  }}
                  onVisibleChange={this.handleVisibleChange}
                  onSelect={this.onSelect}
                >
                  <div style={{
                    height: '100%',
                    padding: '0 0.3rem',
                    marginRight: '-0.3rem',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  >
                    <Icon type="ellipsis" />
                  </div>
                </Popover>
            }>
                车沟你
            </NavBar>
            <Drawer
                className="my-drawer"
                style={{ minHeight: document.documentElement.clientHeight-80}}
                sidebar={sidebar}
                dragHandleStyle={{ display: 'none' }}
                contentStyle={{ color: '#A6A6A6', textAlign: 'center', paddingTop: 0 }}
                {...drawerProps}
                >
                <BottomTabBar {...this.props} ref={'btb'}/>
            </Drawer>
        </div>);
    }
});

const TabPane = Tabs.TabPane;

function callback(key) {
    console.log(key);
}

var selectedIndex = 1;

const ServiceTab = React.createClass({
    getInitialState(){
        return {
            priceInfo:{}
        }
    },
    componentWillMount(){
        Repo.DriverPrice(res=> {
            if (res.data && res.data.list[0]) {
                this.setState({priceInfo: res.data.list[0]});
            }
        });
    },
    createOrder(){
        let profile = localStorage.user != null ? JSON.parse(localStorage.user) : {};
        if(profile.code && profile.token) {
            if (sessionStorage.beginLocation && sessionStorage.endLocation) {
                let beginLoc = JSON.parse(sessionStorage.beginLocation);
                let endLoc = JSON.parse(sessionStorage.endLocation);
                Repo.CreateOrder(profile.code, profile.token, {
                    order_type: selectedIndex,
                    start_position: beginLoc.title,
                    start_longitude: beginLoc.lng + '',
                    start_latitude: beginLoc.lat + '',
                    end_position: endLoc.title,
                    end_longitude: endLoc.lng + '',
                    end_latitude: endLoc.lat + '',
                    amount: 0,
                    remark: ''
                }, (res)=> {
                    if (res.code == 319) {
                        alert(Repo.getDescByCode(res.code));
                        //redirect to new order
                        this.props.changeTab('cur_order');
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
            }
            else {
                alert('请拖动大头针设置出发地！');
            }
        }
        else {
            alert('请重新登入！');
            this.props.logout();
        }
    },
    onClose() {
        Popup.hide();
    },
    /*
    getLocationList(locationType,list){
        var s = [];
        list.forEach(item => {
            s.push("<input type='button' value='" + item.title + ',' + item.address + "' id='" + item.key + "' onclick='updateSessionLocation(\"" + locationType + "\",\"" + item.title + "\",\"" + item.address + "\"," + item.lng + "," + item.lat + ");'/>");
        });
        $("#" + locationType + 'Result').html(s.join("<br/>"));
    },
    locationConfirm(){
        if(sessionStorage.beginLocation && sessionStorage.endLocation) {
            Popup.hide();
        }
        else{
            alert('请设置出发地和目的地！');
        }
    },
    setPoint(refMap){
        Popup.show(<div>
            <List renderHeader={() => (
                <div style={{ position: 'relative' }}>
                  设置出发地和目的地
                  <span
                    style={{
                      position: 'absolute', right: 3, top: -5
                    }}
                    onClick={() => this.onClose()}
                  >
                    <Icon type="cross" />
                  </span>
                </div>)}
                  className="popup-list"
                >
                <List.Item>
                    出发地：<input type="text" id="beginLocation"></input>
                    <Button inline size="small" onClick={()=>{refMap.searchResult('beginLocation',$('#beginLocation').val(),this.getLocationList)}}><Icon type="search"/></Button>
                </List.Item>
                <List.Item>
                    <div style={{border:'2px solid black',height:'2.7rem',overflow:'auto'}} id="beginLocationResult"/>
                </List.Item>
                <List.Item>
                    目的地：<input type="text" id="endLocation"></input>
                    <Button inline size="small" onClick={()=>{refMap.searchResult('endLocation',$('#endLocation').val(),this.getLocationList)}}><Icon type="search"/></Button>
                </List.Item>
                <List.Item>
                    <div style={{border:'2px solid black',height:'2.7rem',overflow:'auto'}} id="endLocationResult"/>
                </List.Item>
                <List.Item><Button type="warning" onClick={this.locationConfirm}><Icon type="smile"/>确定</Button></List.Item>
            </List>
        </div>, { animationType: 'slide-up', wrapProps, maskClosable: false });
    },*/
    showPrice(){
        let pInfo = this.state.priceInfo;
        Popup.show(<div>
            <List renderHeader={() => (
                <div style={{ position: 'relative' }}>
                  服务价格清单
                  <span
                    style={{
                      position: 'absolute', right: 3, top: -5
                    }}
                    onClick={() => this.onClose()}
                  >
                    <Icon type="cross" />
                  </span>
                </div>)}
                  className="popup-list"
                >
                {selectedIndex == 1 ?
                    <List.Item wrap>
                        代驾：{pInfo.drive_remark}
                    </List.Item> : ''
                }
                {selectedIndex == 2 ?
                    <List.Item wrap>
                        代泊：{pInfo.park_remark}
                    </List.Item> : ''
                }
                {selectedIndex == 3 ?
                    <List.Item wrap>
                        代送：{pInfo.carry_remark}
                    </List.Item> : ''
                }
                <List.Item>
                    <Flex>
                        <Button type="primary" onClick={()=>{this.onClose();this.createOrder();}}><Icon type="check"/>确定</Button>
                        <PlaceHolder/>
                        <Button type="primary" onClick={this.onClose}><Icon type="cross"/>取消</Button>
                    </Flex>
                </List.Item>
            </List>
        </div>, { animationType: 'slide-up', wrapProps, maskClosable: false });
    },
    onSegmentChange(e) {
        selectedIndex = e.nativeEvent.selectedSegmentIndex + 1;
        this.refs.pMap.updateLocation(selectedIndex);
    },
    updateLocation(){
        this.refs.pMap.updateLocation(selectedIndex);
    },
    onSegmentValueChange(value) {
        console.log(value);
    },
    render() {
        var queryStr = location.search.match(new RegExp("[\?\&]m=([^\&]+)","i"));
        var model = null;
        if(queryStr !== null && queryStr.length >= 1){
            model = queryStr[1];
        }
        let clientHeight = document.documentElement.clientHeight;
        if (clientHeight < 1000) {
            model = '5';
        }
        else if (clientHeight < 1800) {
            model = '6';
        }
        else {
            model = '6p'
        }
        var minusHeight = 0;
        if(model) {
            switch (model) {
                case '5':
                case '5s':
                case 'se':
                    minusHeight = 260;
                    break;

                case '6':
                case '6s':
                case '7':
                    minusHeight = 280;
                    break;

                case '6p':
                case '6sp':
                case '7p':
                    minusHeight = 410;
                    break;
            }
        }
        var UA = window.navigator.userAgent;//120
        let mapHeight = clientHeight-(UA.indexOf('Android')>=0 ? 420 : minusHeight);
        //let inputWidth = (UA.indexOf('Android')>=0 ? '300px' : '100px');
        //let inputDivHeight = (UA.indexOf('Android')>=0 ? 120 : 20);
        //var rawBeginHtml = {
        //    __html: '<div><div id=\"r-result\">起点：<input type=\"text\" id=\"suggestId\" size=\"20\" value=\"\" style=\"width:'+inputWidth+';\"/></div><div id=\"searchResultPanel\" style=\"border:1px solid #C0C0C0;width:150px;height:auto; display:none;\"></div></div>'
        //};
        //var rawEndHtml = {
        //    __html: '<div><div id=\"r-result\">终点：<input type=\"text\" id=\"suggestId1\" size=\"20\" value=\"\" style=\"width:'+inputWidth+';\"/></div><div id=\"searchResultPanel1\" style=\"border:1px solid #C0C0C0;width:150px;height:auto; display:none;\"></div></div>'
        //};
        //<div style={{padding:10, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-around',height:inputDivHeight }}>
        //    <div dangerouslySetInnerHTML = {rawBeginHtml}/>
        //    <div dangerouslySetInnerHTML = {rawEndHtml}/>
        //</div>
        return (
            <div>
                {/*<Tabs defaultActiveKey="1" onChange={callback} swipeable={false}>
                    <TabPane tab="代驾" key="1">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: mapHeight }}>
                            <Map id="proxydrive" type={Repo.SERVICE_TYPE.ProxyDrive} ref={"pdMap"}/>
                        </div>
                        <Button type="warning" onClick={()=>{this.setPoint(this.refs.pdMap)}}><Icon type="environment-o"/>设置出发地和目的地</Button>
                        <Button type="warning" onClick={()=>{this.createOrder(Repo.SERVICE_TYPE.ProxyDrive)}}><Icon type="check-circle-o"/>呼叫代驾</Button>
                    </TabPane>
                    <TabPane tab="代泊" key="2">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: mapHeight }}>
                            <Map id="proxypark" type={Repo.SERVICE_TYPE.ProxyPark} ref={"ppMap"}/>
                        </div>
                        <Button type="warning" onClick={()=>{this.setPoint(this.refs.ppMap)}}><Icon type="environment-o"/>设置出发地和目的地</Button>
                        <Button type="warning" onClick={()=>{this.createOrder(Repo.SERVICE_TYPE.ProxyPark)}}><Icon type="check-circle-o"/>呼叫代泊</Button>
                    </TabPane>
                    <TabPane tab="代送" key="3">
                        <<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: mapHeight }}>
                             <Map id="proxytransfer" type={Repo.SERVICE_TYPE.ProxyTransfer} ref={"ptMap"}/>
                        </div>
                        Button type="warning" onClick={()=>{this.setPoint(this.refs.ptMap)}}><Icon type="environment-o"/>设置出发地和目的地</Button>
                        <Button type="warning" onClick={()=>{this.createOrder(Repo.SERVICE_TYPE.ProxyTransfer)}}><Icon type="check-circle-o"/>呼叫代送</Button>
                    </TabPane>
                </Tabs>*/}
                <WingBlank size="sm">
                    <WhiteSpace size="sm" />
                    <SegmentedControl
                        values={['代驾', '代泊', '代送']}
                        onChange={this.onSegmentChange}
                        onValueChange={this.onSegmentValueChange}
                        />
                    <WhiteSpace size="sm" />
                </WingBlank>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: mapHeight }}>
                    <Map id="proxy" type={selectedIndex} ref={"pMap"}/>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 20 }}>
                    <Button type="warning" onClick={this.showPrice}><Icon type="check-circle-o"/>呼叫</Button>
                </div>
            </div>
        );
    }
});

module.exports = Home;

/*{
    "code": "105",
    "data": {
    "list": [
        {
            "carry_price": 100.25,
            "carry_remark": "澳门岛市区内50mop，其它100mop",
            "drive_price": 80,
            "drive_remark": "澳门岛市区内50mop，其它100mop",
            "id": 1,
            "park_price": 25,
            "park_remark": "澳门岛市区内50mop，其它100mop"
        }
    ]
}
}*/