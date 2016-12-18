/**
 * Created by NickChung on 11/27/16.
 */
import React from 'react';
import { Card, WingBlank, WhiteSpace,Button,List } from 'antd-mobile';

const Item = List.Item;
const Brief = Item.Brief;

let Profile = React.createClass({
    render() {
        return (
            <WingBlank size="lg">
                <WhiteSpace size="lg"/>
                <List >
                    <Item multipleLine>
                        条例内容
                        <Brief>内容1...</Brief>
                        <Brief>内容2...</Brief>
                        <Brief>内容3...</Brief>
                        <Brief>内容4...</Brief>
                        <Brief>内容5...</Brief>
                        <Brief>内容6...</Brief>
                        <Brief>内容7...</Brief>
                        <Brief>内容8...</Brief>
                        <Brief>内容9...</Brief>
                    </Item>
                    <Item>版本号：1.0.0</Item>
                    <Item>客服电话：10000</Item>
                </List>
                <WhiteSpace size="lg"/>
                <Button type="primary" onClick={()=>{this.props.logout()}}>登出</Button>
            </WingBlank>
        );
    }
});

module.exports = Profile;