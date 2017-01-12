/**
 * Created by NickChung on 11/30/16.
 */
"use strict";
const React = require('react');

var omap;
var mkUser;
var carIcon;
var zoomLevel = 18;

var OrderMap = React.createClass({
    getInitialState(){
        return {
            id: this.props.id
        }
    },
    componentDidMount(){
        omap = new BMap.Map(this.props.id);
        carIcon = new BMap.Icon("http://112.74.129.174/gvpark/icon_car.png", new BMap.Size(64, 64));
        function ZoomControl() {
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
                zoomLevel = map.getZoom();
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
                zoomLevel = map.getZoom();
            };

            var div = document.createElement("div");
            div.appendChild(divIn);
            div.appendChild(divOut);

            map.getContainer().appendChild(div);
            return div;
        };
        var myZoomCtrl = new ZoomControl();
        omap.addControl(myZoomCtrl);

        function GeoControl() {
            this.defaultAnchor = BMAP_ANCHOR_TOP_RIGHT;
            this.defaultOffset = new BMap.Size(10, 10);
        }

        omap.minZoom = 14;
        omap.maxZoom = 20;
        omap.enableScrollWheelZoom();
        omap.enableDragging();

        function myFun(result) {
            var cityName = result.name;
            omap.centerAndZoom(cityName, zoomLevel);
        }

        var myCity = new BMap.LocalCity();
        myCity.get(myFun);
    },
    updateLocation(lng, lat){
        if(lng && lat) {
            let myPoint = new BMap.Point(lng, lat);
            omap.setCenter(myPoint);
            omap.setZoom(zoomLevel);

            if(mkUser) {
                omap.removeOverlay(mkUser);
            }
            mkUser = new BMap.Marker(myPoint, {icon: carIcon});
            omap.addOverlay(mkUser);
            omap.panTo(mkUser);
        }
    },
    render() {
        return <div id={this.state.id} style={{height:"800",width:"100%"}}></div>
    }
});

export default OrderMap;
