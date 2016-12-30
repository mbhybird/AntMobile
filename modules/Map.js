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
        var carIcon = new BMap.Icon("http://112.74.129.174/gvpark/icon_car.png", new BMap.Size(64, 64));
        var flagIcon = new BMap.Icon("http://112.74.129.174/gvpark/icon_pin2.png", new BMap.Size(64, 64));

        map = new BMap.Map(this.state.id);
        var navigationControl = new BMap.NavigationControl({
            anchor: BMAP_ANCHOR_TOP_LEFT,
            type: BMAP_NAVIGATION_CONTROL_LARGE,
            enableGeolocation: true
        });
        map.addControl(navigationControl);
        var geolocationControl = new BMap.GeolocationControl({
            anchor: BMAP_ANCHOR_TOP_RIGHT,
            enableAutoLocation: true,
            showAddressBar: true
        });
        geolocationControl.addEventListener("locationSuccess", function (r) {
            if (map) {
                map.clearOverlays();
            }
            if (mapIntervalId) {
                clearInterval(mapIntervalId);
            }

            map.setCenter(r.point);
            map.setZoom(18);

            var lblUser = new BMap.Label("所在位置", {offset: new BMap.Size(20, -10)});
            let mkUser = new BMap.Marker(r.point, {icon: flagIcon});
            let geoc = new BMap.Geocoder();
            geoc.getLocation(r.point, function (rs) {
                let addComp = rs.addressComponents;
                let address = addComp.province + "," + addComp.city + "," + addComp.district + "," + addComp.street + "," + addComp.streetNumber;
                let title = addComp.city + "," + addComp.district + "," + addComp.street + "," + addComp.streetNumber;
                sessionStorage.beginLocation = JSON.stringify({
                    title: title,
                    address: address,
                    lng: r.point.lng,
                    lat: r.point.lat
                });
                sessionStorage.endLocation = JSON.stringify({
                    title: title,
                    address: address,
                    lng: r.point.lng,
                    lat: r.point.lat
                });
            });
            mkUser.setLabel(lblUser);
            map.addOverlay(mkUser);
            map.panTo(r.point);
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
                Repo.DriverNear(orderType, r.point.lng + '', r.point.lat + '', (res)=> {
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
        });

        geolocationControl.addEventListener("locationError", function (e) {
            alert("定位失败，请打开GPS权限");
        });

        map.addControl(geolocationControl);
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

        setTimeout(()=> {
            geolocationControl.location();
        }, 1000);
    },
    render() {
        return <div id={this.state.id} style={{height:"100%",width:"100%"}}></div>
    }
});

export default Map;
