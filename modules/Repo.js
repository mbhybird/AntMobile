/**
 * Created by NickChung on 12/4/16.
 */
function postURL(url, data, callback) {
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": url,
        "method": "POST",
        "headers": {
            "content-type": "application/x-www-form-urlencoded"
        },
        "data": data
    };
    $.ajax(settings).done(function (response) {
        callback(response);
    });
}

const URL=({
    VerificationSignUp: 'http://120.25.150.132/gvparkpark/verification/sms/signup',
    VerificationSignIn: 'http://120.25.150.132/gvparkpark/verification/sms/signin',
    UserSignUp: 'http://120.25.150.132/gvparkpark/user/signup/message',
    UserSignIn: 'http://120.25.150.132/gvparkpark/user/signin/message',
    OrderList: 'http://120.25.150.132/gvparkpark/order/myorderlist',
    DriverNear: 'http://120.25.150.132/gvparkpark/driver/position/near',
    MyOrder: 'http://120.25.150.132/gvparkpark/order/myorder',
    CreateOrder: 'http://120.25.150.132/gvparkpark/order/create',
    CompleteOrder: 'http://120.25.150.132/gvparkpark/order/complete',
    CommentOrder: 'http://120.25.150.132/gvparkpark/order/comment',
    RejectOrder: 'http://120.25.150.132/gvparkpark/order/rejectcomplete',
    CancelOrder: 'http://120.25.150.132/gvparkpark/order/cancel',
    DriverPrice: 'http://120.25.150.132/gvparkpark/driverprice/query'
});

const ORDER_TYPE=({
    ProxyDrive: 1,
    ProxyPark: 2,
    ProxyTransfer: 3
});

const getDescByCode = (code)=> {
    var desc = '';
    switch (code) {
        case '101':
            desc = '插入成功';
            break;
        case '102':
            desc = '插入失敗';
            break;
        case '103':
            desc = '更新成功';
            break;
        case '104':
            desc = '更新失敗';
            break;
        case '105':
            desc = '查詢成功';
            break;
        case '106':
            desc = '查詢失敗';
            break;
        case '107':
            desc = '刪除成功';
            break;
        case '108':
            desc = '刪除失敗';
            break;
        case '201':
            desc = '註冊成功';
            break;
        case '202':
            desc = '註冊失敗';
            break;
        case '203':
            desc = '帳號已註冊';
            break;
        case '204':
            desc = '帳號不存在';
            break;
        case '205':
            desc = '帳號暫時失效';
            break;
        case '206':
            desc = '帳號凍結';
            break;
        case '207':
            desc = '登陸成功';
            break;
        case '208':
            desc = '登錄失敗';
            break;
        case '209':
            desc = '密碼錯誤';
            break;
        case '210':
            desc = '密碼修改成功';
            break;
        case '211':
            desc = '密碼修改失敗';
            break;
        case '212':
            desc = '驗證碼不對或無效';
            break;
        case '213':
            desc = '手機號碼無效';
            break;
        case '214':
            desc = 'token令牌無效';
            break;
        case '215':
            desc = '图片无效或格式不对';
            break;
        case '315':
            desc = '取消成功';
            break;
        case '316':
            desc = '取消失败';
            break;
        case '319':
            desc = '新訂單生成成功';
            break;
        case '320':
            desc = '新訂單生成失敗';
            break;
        case '321':
            desc = '司機接單成功';
            break;
        case '322':
            desc = '司機接單失敗';
            break;
        case '323':
            desc = '訂單已被搶';
            break;
        case '324':
            desc = '訂單完成成功';
            break;
        case '325':
            desc = '訂單完成失敗';
            break;
        case '326':
            desc = '司机已下线';
            break;
        case '327':
            desc = '评价成功';
            break;
        case '328':
            desc = '评价失败';
            break;
        case '329':
            desc = '申请完成订单成功';
            break;
        case '330':
            desc = '申请完成订单失败';
            break;
        case '331':
            desc = '拒绝完成订单成功';
            break;
        case '332':
            desc = '拒绝完成订单失败';
            break;
        case '400':
            desc = '參數錯誤，拒絕訪問';
            break;
        case '500':
            desc = '获取附近司机位置的指令代号';
            break;
        case '501':
            desc = '订单通知消息';
            break;
    }

    return desc;
};

const orderType = (type)=> {
    return type.toString().replace(1, '代驾').replace(2, '代泊').replace(3, '代送');
};
const orderState = (state)=> {
    var stateDesc = '';
    switch (state) {
        case 1:
            stateDesc = '已下单';
            break;
        case 2:
            stateDesc = '已取消';
            break;
        case 3:
            stateDesc = '已接单';
            break;
        case 4:
            stateDesc = '申请完成订单';
            break;
        case 5:
            stateDesc = '拒绝完成订单';
            break;
        case 6:
            stateDesc = '完成订单';
            break;
    }

    return stateDesc;
};
const telMarkup = (phone)=> {
    return {__html: '<a href="tel:' + phone + '">' + phone + '</a>'};
};

module.exports = ({
    getDescByCode : getDescByCode,
    ORDER_TYPE : ORDER_TYPE,
    SERVICE_TYPE: ORDER_TYPE,
    getOrderTypeDesc: orderType,
    getOrderStateDesc:orderState,
    telMarkup:telMarkup,
    VerificationSignUp: (params, callback)=> {
        var data = {
            tag: 1,
            code: 0,
            json: JSON.stringify(params)
        };

        postURL(URL.VerificationSignUp, data, callback);
    },
    VerificationSignIn: (params, callback)=> {
        var data = {
            tag: 1,
            code: 0,
            json: JSON.stringify(params)
        };

        postURL(URL.VerificationSignIn, data, callback);
    },
    UserSignUp: (params, callback)=> {
        var data = {
            tag: 1,
            code: 0,
            json: JSON.stringify(params)
        };

        postURL(URL.UserSignUp, data, callback);
    },
    UserSignIn: (params, callback)=> {
        var data = {
            tag: 1,
            code: 0,
            json: JSON.stringify(params)
        };

        postURL(URL.UserSignIn, data, callback);
    },
    DriverNear: (serviceType, lng, lat, callback)=> {
        var data = {
            json: JSON.stringify({service_type: serviceType, longitude: lng, latitude: lat})
        };

        postURL(URL.DriverNear, data, callback);
    },
    OrderList: (code, token, params, callback)=> {
        var data = {
            uuid: "",
            tag: 1,
            code: code,
            token: token,
            encrypted: "",
            json: JSON.stringify(params)
        };

        postURL(URL.OrderList, data, callback);
    },
    MyOrder: (code, token, params, callback)=> {
        var data = {
            uuid: "",
            tag: 1,
            code: code,
            token: token,
            encrypted: "",
            json: JSON.stringify(params)
        };

        postURL(URL.MyOrder, data, callback);
    },
    CreateOrder: (code, token, params, callback)=> {
        var data = {
            uuid: "",
            tag: 1,
            code: code,
            token: token,
            encrypted: "",
            json: JSON.stringify(params)
        };

        postURL(URL.CreateOrder, data, callback);
    },
    CancelOrder: (code, token, params, callback)=> {
        var data = {
            uuid: "",
            tag: 1,
            code: code,
            token: token,
            encrypted: "",
            json: JSON.stringify(params)
        };

        postURL(URL.CancelOrder, data, callback);
    },
    CompleteOrder: (code, token, params, callback)=> {
        var data = {
            uuid: "",
            tag: 1,
            code: code,
            token: token,
            encrypted: "",
            json: JSON.stringify(params)
        };

        postURL(URL.CompleteOrder, data, callback);
    },
    CommentOrder: (code, token, params, callback)=> {
        var data = {
            uuid: "",
            tag: 1,
            code: code,
            token: token,
            encrypted: "",
            json: JSON.stringify(params)
        };

        postURL(URL.CommentOrder, data, callback);
    },
    RejectOrder: (code, token, params, callback)=> {
        var data = {
            uuid: "",
            tag: 1,
            code: code,
            token: token,
            encrypted: "",
            json: JSON.stringify(params)
        };

        postURL(URL.RejectOrder, data, callback);
    },
    DriverPrice: (callback)=> {
        postURL(URL.DriverPrice, {}, callback);
    }
});
