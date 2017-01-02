/**
 * Created by NickChung on 11/30/16.
 */
"use strict";
const React = require('react');
const Repo = require("./Repo.js");

var map = null;
var mapIntervalId;

var Map = React.createClass({
    getInitialState(){
        return {
            id: this.props.id || 'allmap'
        }
    },
    getLocationList(){
        return locationList;
    },
    searchResult(locationType, keyword, callback){
        var options = {
            onSearchComplete: function (results) {
                if (local.getStatus() == BMAP_STATUS_SUCCESS) {
                    var locationList = [];
                    for (var i = 0; i < results.getCurrentNumPois(); i++) {
                        locationList.push({
                            key: 'key' + i,
                            title: results.getPoi(i).title,
                            address: results.getPoi(i).address,
                            lng: results.getPoi(i).point.lng,
                            lat: results.getPoi(i).point.lat
                        });
                    }
                    callback(locationType, locationList);
                }
            }
        };
        if (map) {
            var local = new BMap.LocalSearch(map, options);
            local.search(keyword);
        }
    },
    componentDidMount() {
        this.updateLocation(this.props.type);
    },
    updateLocation(orderType){
        var _this = this;
        let carIcon = new BMap.Icon("http://112.74.129.174/gvpark/icon_car.png", new BMap.Size(64, 64));
        let flagIcon = new BMap.Icon("http://112.74.129.174/gvpark/icon_pin2.png", new BMap.Size(64, 64));
        if (map) {
            map.clearOverlays();
        }
        if (mapIntervalId) {
            clearInterval(mapIntervalId);
        }
        map = new BMap.Map(this.state.id);
        function ZoomControl(){
            this.defaultAnchor = BMAP_ANCHOR_TOP_LEFT;
            this.defaultOffset = new BMap.Size(10, 10);
        }

        ZoomControl.prototype = new BMap.Control();
        ZoomControl.prototype.initialize = function (map) {
            var divIn = document.createElement("div");
            divIn.appendChild(document.createTextNode("＋"));
            divIn.style.cursor = "pointer";
            divIn.style.border = "1px solid gray";
            divIn.style.fontSize = "60px";
            divIn.style.backgroundColor = "white";
            divIn.onclick = function (e) {
                if (map.getZoom() < 20) {
                    map.setZoom(map.getZoom() + 1);
                }
            };

            var divOut = document.createElement("div");
            divOut.appendChild(document.createTextNode("－"));
            divOut.style.cursor = "pointer";
            divOut.style.border = "1px solid gray";
            divOut.style.fontSize = "60px";
            divOut.style.backgroundColor = "white";
            divOut.onclick = function (e) {
                if (map.getZoom() > 14) {
                    map.setZoom(map.getZoom() - 1);
                }
            };

            var div = document.createElement("div");
            div.appendChild(divIn);
            div.appendChild(divOut);

            map.getContainer().appendChild(div);
            return div;
        };
        var myZoomCtrl = new ZoomControl();
        map.addControl(myZoomCtrl);

        function GeoControl() {
            this.defaultAnchor = BMAP_ANCHOR_TOP_RIGHT;
            this.defaultOffset = new BMap.Size(10, 10);
        }

        GeoControl.prototype = new BMap.Control();
        GeoControl.prototype.initialize = function (map) {
            var div = document.createElement("div");
            div.appendChild(document.createTextNode("我的位置"));
            div.style.cursor = "pointer";
            div.style.border = "1px solid gray";
            div.style.backgroundColor = "white";
            div.onclick = function (e) {
                _this.updateLocation(orderType);
            };
            map.getContainer().appendChild(div);
            return div;
        };
        var myGeoCtrl = new GeoControl();
        map.addControl(myGeoCtrl);

        map.minZoom = 14;
        map.maxZoom = 20;
        map.enableScrollWheelZoom();
        map.enableDragging();

        function myFun(result) {
            var cityName = result.name;
            map.centerAndZoom(cityName, 14);
        }

        var myCity = new BMap.LocalCity();
        myCity.get(myFun);

        function getLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(showPosition, showError);
            }
            else {
                alert("该浏览器不支持获取地理位置。");
            }
        }

        function showPosition(position) {
            let lat = position.coords.latitude;
            let lng = position.coords.longitude;
            Repo.GetAdjustLocation(lng, lat, (r)=> {
                let myPoint = new BMap.Point(r.Lng, r.Lat);
                map.setCenter(myPoint);
                map.setZoom(18);

                var lblUser = new BMap.Label("所在位置", {offset: new BMap.Size(20, -10)});
                let mkUser = new BMap.Marker(myPoint, {icon: flagIcon});
                let geoc = new BMap.Geocoder();
                geoc.getLocation(myPoint, function (rs) {
                    let addComp = rs.addressComponents;
                    let address = addComp.province + "," + addComp.city + "," + addComp.district + "," + addComp.street + "," + addComp.streetNumber;
                    let title = addComp.city + "," + addComp.district + "," + addComp.street + "," + addComp.streetNumber;
                    sessionStorage.beginLocation = JSON.stringify({
                        title: title,
                        address: address,
                        lng: myPoint.lng,
                        lat: myPoint.lat
                    });
                    sessionStorage.endLocation = JSON.stringify({
                        title: title,
                        address: address,
                        lng: myPoint.lng,
                        lat: myPoint.lat
                    });
                });
                mkUser.setLabel(lblUser);
                map.addOverlay(mkUser);
                map.panTo(myPoint);
                mkUser.enableDragging();

                mkUser.addEventListener("dragend", function (e) {
                    let geoc = new BMap.Geocoder();
                    geoc.getLocation(e.point, function (rs) {
                        let addComp = rs.addressComponents;
                        let address = addComp.province + "," + addComp.city + "," + addComp.district + "," + addComp.street + "," + addComp.streetNumber;
                        let title = addComp.city + "," + addComp.district + "," + addComp.street + "," + addComp.streetNumber;
                        sessionStorage.beginLocation = JSON.stringify({
                            title: title,
                            address: address,
                            lng: e.point.lng,
                            lat: e.point.lat
                        });
                        sessionStorage.endLocation = JSON.stringify({
                            title: title,
                            address: address,
                            lng: e.point.lng,
                            lat: e.point.lat
                        });
                    });
                });

                var mkCars = [];

                //nearby cars refresh by per 3s
                mapIntervalId = setInterval(()=> {
                    Repo.DriverNear(orderType, myPoint.lng + '', myPoint.lat + '', (res)=> {
                        //console.log('DriverNear', Repo.getDescByCode(res.code));
                        //console.log('ServiceType', orderType);
                        if (res.data) {
                            if (res.data.list) {
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
                }, 3000);
            })
        }

        function showError(error) {
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    alert("用户拒绝对获取地理位置的请求。");
                    break;
                case error.POSITION_UNAVAILABLE:
                    alert("位置信息是不可用的。");
                    break;
                case error.TIMEOUT:
                    alert("请求用户地理位置超时。");
                    break;
                case error.UNKNOWN_ERROR:
                    alert("未知错误。");
                    break;
            }
        }

        setTimeout(()=> {
            getLocation();
        }, 100);
    },
    render() {
        return <div id={this.state.id} style={{height:"100%",width:"100%"}}></div>
    }
});

export default Map;
