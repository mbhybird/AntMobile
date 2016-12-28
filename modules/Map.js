/**
 * Created by NickChung on 11/30/16.
 */
"use strict";
const React = require('react');
const Repo = require("./Repo.js");

var mapId = '';
var map = null;
var mapIntervalId;

var Map = React.createClass({
    getInitialState(){
        mapId = this.props.id || 'allmap';
        return {
            id: this.props.id || 'allmap'
        }
    },
    getLocationList(){
      return locationList;
    },
    searchResult(locationType,keyword,callback){
        var options = {
            onSearchComplete: function(results){
                if (local.getStatus() == BMAP_STATUS_SUCCESS){
                    var locationList = [];
                    for (var i = 0; i < results.getCurrentNumPois(); i ++) {
                        locationList.push({
                            key: 'key' + i,
                            title: results.getPoi(i).title,
                            address: results.getPoi(i).address,
                            lng: results.getPoi(i).point.lng,
                            lat: results.getPoi(i).point.lat
                        });
                    }
                    callback(locationType,locationList);
                }
            }
        };
        if(map) {
            var local = new BMap.LocalSearch(map, options);
            local.search(keyword);
        }
    },
    componentDidMount() {
        this.updateLocation(this.props.type);
    },
    updateLocation(orderType){
        if(map){
            map.clearOverlays();
        }
        if(mapIntervalId){
            clearInterval(mapIntervalId);
        }
        var carIcon = new BMap.Icon("http://112.74.129.174/gvpark/icon_car.png", new BMap.Size(64, 64));
        var flagIcon = new BMap.Icon("http://112.74.129.174/gvpark/icon_pin2.png", new BMap.Size(64, 64));

        var geolocation = new BMap.Geolocation();
        geolocation.getCurrentPosition(function (r) {
            if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                console.log('您的位置：' + r.point.lng + ',' + r.point.lat);

                map = new BMap.Map(mapId);
                map.centerAndZoom(r.point, 15);
                map.addControl(new BMap.MapTypeControl());
                map.enableScrollWheelZoom(true);
                map.enableDragging();

                var lblUser = new BMap.Label("所在位置", {offset: new BMap.Size(20, -10)});
                let mkUser = new BMap.Marker(r.point,{icon:flagIcon});
                let geoc = new BMap.Geocoder();
                geoc.getLocation(r.point, function(rs){
                    let addComp = rs.addressComponents;
                    let address = addComp.province + "," + addComp.city + "," + addComp.district + "," + addComp.street + "," + addComp.streetNumber;
                    let title = addComp.city + "," + addComp.district + "," + addComp.street + "," + addComp.streetNumber;
                    sessionStorage.beginLocation = JSON.stringify({title: title, address: address, lng: r.point.lng, lat: r.point.lat});
                    sessionStorage.endLocation = JSON.stringify({title: title, address: address, lng: r.point.lng, lat: r.point.lat});
                });
                mkUser.setLabel(lblUser);
                map.addOverlay(mkUser);
                map.panTo(r.point);
                mkUser.enableDragging();

                mkUser.addEventListener("dragend", function(e) {
                    let geoc = new BMap.Geocoder();
                    geoc.getLocation(e.point, function(rs){
                        let addComp = rs.addressComponents;
                        let address = addComp.province + "," + addComp.city + "," + addComp.district + "," + addComp.street + "," + addComp.streetNumber;
                        let title = addComp.city + "," + addComp.district + "," + addComp.street + "," + addComp.streetNumber;
                        sessionStorage.beginLocation = JSON.stringify({title: title, address: address, lng: e.point.lng, lat: e.point.lat});
                        sessionStorage.endLocation = JSON.stringify({title: title, address: address, lng: e.point.lng, lat: e.point.lat});
                    });
                });

                var mkCars = [];

                //nearby cars refresh by per 3s
                mapIntervalId = setInterval(()=> {
                    Repo.DriverNear(orderType, r.point.lng + '', r.point.lat + '', (res)=> {
                        //console.log('DriverNear', Repo.getDescByCode(res.code));
                        //console.log('ServiceType', orderType);
                        if (res.data) {
                            if(res.data.list) {
                                //console.log('DriverNear', res.data.list);
                                mkCars.forEach((car)=> {
                                    map.removeOverlay(car);
                                });

                                res.data.list.forEach((info)=> {
                                    let car = new BMap.Marker(new BMap.Point(info.longitude, info.latitude), {icon: carIcon});
                                    mkCars.push(car);
                                    map.addOverlay(car);
                                    //car.enableDragging();
                                });
                            }
                        }
                    });
                },3000);

                /*
                 var driving = new BMap.DrivingRoute(map, {renderOptions:{map: map, autoViewport: true}});

                 //var lblBegin = new BMap.Label("起点", {offset: new BMap.Size(20, -10)});
                 var beginPoint = new BMap.Point(r.point.lng + 0.0005, r.point.lat + 0.0005);
                 var beginIcon = new BMap.Icon("http://112.74.129.174/gvpark/icon_start.png", new BMap.Size(128, 128));
                 var mkBegin = new BMap.Marker(beginPoint, {icon: beginIcon});
                 //mkBegin.setLabel(lblBegin);
                 map.addOverlay(mkBegin);
                 mkBegin.enableDragging();

                 mkBegin.addEventListener("dragend", function(e) {
                 //alert("当前位置：" + e.point.lng + ", " + e.point.lat);
                 beginPoint = new BMap.Point(e.point.lng, e.point.lat);
                 driving.search(beginPoint, endPoint);
                 //sessionStorage.beginLocation = JSON.stringify({lng: e.point.lng, lat: e.point.lat});
                 });

                 //var lblEnd = new BMap.Label("终点", {offset: new BMap.Size(20, -10)});
                 var endPoint = new BMap.Point(r.point.lng - 0.0005, r.point.lat - 0.0005);
                 var endIcon = new BMap.Icon("http://112.74.129.174/gvpark/icon_end.png", new BMap.Size(128, 128));
                 var mkEnd = new BMap.Marker(endPoint, {icon: endIcon});
                 //mkEnd.setLabel(lblEnd);
                 map.addOverlay(mkEnd);
                 mkEnd.enableDragging();

                 mkEnd.addEventListener("dragend", function(e){
                 //alert("当前位置：" + e.point.lng + ", " + e.point.lat);
                 endPoint = new BMap.Point(e.point.lng, e.point.lat);
                 driving.search(beginIcon, endPoint);
                 //sessionStorage.endLocation = JSON.stringify({lng: e.point.lng, lat: e.point.lat});
                 });

                 driving.search(beginPoint, endPoint);*/
            }
            else {
                console.log('failed' + this.getStatus());
            }
        }, {enableHighAccuracy: true});
    },
    render() {
        return <div id={this.state.id} style={{height:"100%",width:"100%"}}></div>
    }
});

export default Map;
