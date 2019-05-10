import React, { Component } from 'react';

// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
import  'echarts/lib/chart/map';
import 'echarts/extension/dataTool';
import 'echarts/extension/bmap/bmap';
// 引入中国地图（默认显示）
import 'echarts/map/js/china'

let myChart,option;
class NoticeMapChart extends Component {
	componentDidMount() {

        var dom = document.getElementById("container");
        var myChart = echarts.init(dom);
        var app = {};
        option = null;
        var data = [
             {name: "京南", value: 116},
                  {name: "丰台花园", value: 73},
                  {name: "顺义", value: 61},
                  {name: "延庆", value: 68},
                  {name: "平谷", value: 49},
                  {name: "房山", value: 71},
                  {name: "亦庄", value: 81},
                  {name: "云岗", value: 71},
                  {name: "天坛", value: 78},
                  {name: "永定门", value: 76},
                  {name: "京东北", value: 47},
                  {name: "怀柔", value: 54},
                  {name: "京西北", value: 60},
                  {name: "万寿西宫", value: 74},
                  {name: "昌平", value: 60},
                  {name: "门头沟", value: 70},
                  {name: "通州", value: 78},
                  {name: "大兴", value: 73},
                  {name: "定陵", value: 55},
                  {name: "前门", value: 73},
                  {name: "官园", value: 70},
                  {name: "东四", value: 64},
                  {name: "香山", value: 70},
                  {name: "奥体中心", value: 69},
                  {name: "农展馆", value: 73},
                  {name: "密云", value: 46},
                  {name: "古城", value: 70}
        ];
        var geoCoordMap = {
            "京南":[116.300, 39.520],
               "丰台花园":[116.279, 39.863],
               "顺义":[116.655, 40.127],
               "延庆":[115.972, 40.453],
               "平谷":[116.414,39.9523],
               "房山":[116.136, 39.742],
               "亦庄":[116.506, 39.795],
               "云岗":[116.146, 39.824],
               "天坛":[116.407, 39.886],
               "永定门":[116.394, 39.876],
               "京东北":[116.911, 40.499],
               "怀柔":[116.628, 40.328],
               "京西北":[115.988, 40.365],
               "万寿西宫":[116.352, 39.878],
               "昌平":[116.234, 40.217],
               "门头沟":[116.106, 39.937],
               "通州":[116.663, 39.886],
               "大兴":[116.404, 39.718],
               "定陵":[116.220, 40.292],
               "前门":[116.395, 39.899],
               "官园":[116.339, 39.929],
               "东四":[116.417, 39.929],
               "香山":[116.207, 40.002],
               "奥体中心":[116.397, 39.982],
               "农展馆":[116.461, 39.937],
               "密云":[116.832, 40.370],
               "古城":[116.184, 39.914],
               "南三环":[116.368, 39.856],
               "北部新区":[116.174, 40.090],
               "万柳":[116.287, 39.987],
               "京东南":[116.783, 39.712],
               "京西南":[116.000, 39.580],
               "京东":[117.120, 40.100],
               "东四环":[116.483, 39.939],
               "西直门":[116.349, 39.954]
        };
        
        
        var convertYou = function (data) {
            var res = [];
            for (var i = 0; i < data.length; i++) {
                var geoCoord = geoCoordMap[data[i].name];
                if (geoCoord) {
                    if(data[i].value<50){
                    res.push({
                        name: data[i].name,
                        value: geoCoord.concat(data[i].value)
                    });}
                }
            }
            return res;
        };
        
        var convertLiang = function (data) {
            var res = [];
            for (var i = 0; i < data.length; i++) {
                var geoCoord = geoCoordMap[data[i].name];
                if (geoCoord) {
                    if(data[i].value>=50&&data[i].value<100){
                    res.push({
                        name: data[i].name,
                        value: geoCoord.concat(data[i].value)
                    });}
                }
            }
            return res;
        };
        
            var convertQing = function (data) {
            var res = [];
            for (var i = 0; i < data.length; i++) {
                var geoCoord = geoCoordMap[data[i].name];
                if (geoCoord) {
                    if(data[i].value>=100&&data[i].value<150){
                    res.push({
                        name: data[i].name,
                        value: geoCoord.concat(data[i].value)
                    });}
                }
            }
            return res;
        };
        
            var convertZhong = function (data) {
            var res = [];
            for (var i = 0; i < data.length; i++) {
                var geoCoord = geoCoordMap[data[i].name];
                if (geoCoord) {
                    if(data[i].value>=150&&data[i].value<200){
                    res.push({
                        name: data[i].name,
                        value: geoCoord.concat(data[i].value)
                    });}
                }
            }
            return res;
        };
        
            var convertZhong1 = function (data) {
            var res = [];
            for (var i = 0; i < data.length; i++) {
                var geoCoord = geoCoordMap[data[i].name];
                if (geoCoord) {
                    if(data[i].value>=200&&data[i].value<300){
                    res.push({
                        name: data[i].name,
                        value: geoCoord.concat(data[i].value)
                    });}
                }
            }
            return res;
        };
        
            var convertYanzhong = function (data) {
            var res = [];
            for (var i = 0; i < data.length; i++) {
                var geoCoord = geoCoordMap[data[i].name];
                if (geoCoord) {
                    if(data[i].value>300){
                    res.push({
                        name: data[i].name,
                        value: geoCoord.concat(data[i].value)
                    });}
                }
            }
            return res;
        };
        
        option = {
            title: {
                text: 'AQI实时预测情况',
               // subtext: 'data from PM25.in',
               // sublink: 'http://www.pm25.in',
                left: 'center'
            },
            tooltip : {
                trigger: 'item'
            },
            bmap: {
                center: [116.418261, 39.921984],
                zoom: 10,
                roam: true,
                mapStyle: {
                    styleJson: [{
                        'featureType': 'water',
                        'elementType': 'all',
                        'stylers': {
                            'color': '#d1d1d1'
                        }
                    }, {
                        'featureType': 'land',
                        'elementType': 'all',
                        'stylers': {
                            'color': '#f3f3f3'
                        }
                    }, {
                        'featureType': 'railway',
                        'elementType': 'all',
                        'stylers': {
                            'visibility': 'off'
                        }
                    }, {
                        'featureType': 'highway',
                        'elementType': 'all',
                        'stylers': {
                            'color': '#fdfdfd'
                        }
                    }, {
                        'featureType': 'highway',
                        'elementType': 'labels',
                        'stylers': {
                            'visibility': 'off'
                        }
                    }, {
                        'featureType': 'arterial',
                        'elementType': 'geometry',
                        'stylers': {
                            'color': '#fefefe'
                        }
                    }, {
                        'featureType': 'arterial',
                        'elementType': 'geometry.fill',
                        'stylers': {
                            'color': '#fefefe'
                        }
                    }, {
                        'featureType': 'poi',
                        'elementType': 'all',
                        'stylers': {
                            'visibility': 'off'
                        }
                    }, {
                        'featureType': 'green',
                        'elementType': 'all',
                        'stylers': {
                            'visibility': 'off'
                        }
                    }, {
                        'featureType': 'subway',
                        'elementType': 'all',
                        'stylers': {
                            'visibility': 'off'
                        }
                    }, {
                        'featureType': 'manmade',
                        'elementType': 'all',
                        'stylers': {
                            'color': '#d1d1d1'
                        }
                    }, {
                        'featureType': 'local',
                        'elementType': 'all',
                        'stylers': {
                            'color': '#d1d1d1'
                        }
                    }, {
                        'featureType': 'arterial',
                        'elementType': 'labels',
                        'stylers': {
                            'visibility': 'off'
                        }
                    }, {
                        'featureType': 'boundary',
                        'elementType': 'all',
                        'stylers': {
                            'color': '#fefefe'
                        }
                    }, {
                        'featureType': 'building',
                        'elementType': 'all',
                        'stylers': {
                            'color': '#d1d1d1'
                        }
                    }, {
                        'featureType': 'label',
                        'elementType': 'labels.text.fill',
                        'stylers': {
                            'color': '#999999'
                        }
                    }]
                }
            },
            series : [
                {
                    name: 'you',
                    type: 'scatter',
                    coordinateSystem: 'bmap',
                    data: convertYou(data),
                    symbolSize: function (val) {
                        return val[2]/3;
                    },
                    label: {
                        normal: {
                            formatter: '{b}',
                            position: 'right',
                            show: false
                        },
                        emphasis: {
                            show: true
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: 'green'
                        }
                    }
                },
                {
                    name: 'liang',
                    type: 'scatter',
                    coordinateSystem: 'bmap',
                    data: convertLiang(data),
                    symbolSize: function (val) {
                        return val[2] / 5;
                    },
                    label: {
                        normal: {
                            formatter: '{b}',
                            position: 'right',
                            show: false
                        },
                        emphasis: {
                            show: true
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: 'yellow'
                        }
                    }
                },
                {
                    name: 'qing',
                    type: 'scatter',
                    coordinateSystem: 'bmap',
                    data: convertQing(data),
                    symbolSize: function (val) {
                        return val[2] / 7;
                    },
                    label: {
                        normal: {
                            formatter: '{b}',
                            position: 'right',
                            show: false
                        },
                        emphasis: {
                            show: true
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: 'orange'
                        }
                    }
                },
                {
                    name: 'zhong',
                    type: 'scatter',
                    coordinateSystem: 'bmap',
                    data: convertZhong(data),
                    symbolSize: function (val) {
                        return val[2] / 9;
                    },
                    label: {
                        normal: {
                            formatter: '{b}',
                            position: 'right',
                            show: false
                        },
                        emphasis: {
                            show: true
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: 'red'
                        }
                    }
                },
                {
                    name: 'zhong1',
                    type: 'scatter',
                    coordinateSystem: 'bmap',
                    data: convertZhong1(data),
                    symbolSize: function (val) {
                        return val[2] / 11;
                    },
                    label: {
                        normal: {
                            formatter: '{b}',
                            position: 'right',
                            show: false
                        },
                        emphasis: {
                            show: true
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: 'purple'
                        }
                    }
                },
                {
                    name: 'yanzhong',
                    type: 'scatter',
                    coordinateSystem: 'bmap',
                    data: convertYanzhong(data),
                    symbolSize: function (val) {
                        return val[2] / 13;
                    },
                    label: {
                        normal: {
                            formatter: '{b}',
                            position: 'right',
                            show: false
                        },
                        emphasis: {
                            show: true
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: 'brown'
                        }
                    }
                },
                /*{
                    name: 'Top 5',
                    type: 'effectScatter',
                    coordinateSystem: 'bmap',
                    data: convertData(data.sort(function (a, b) {
                        return b.value - a.value;
                    }).slice(0, 6)),
                    symbolSize: function (val) {
                        return val[2] / 10;
                    },
                    showEffectOn: 'render',
                    rippleEffect: {
                        brushType: 'stroke'
                    },
                    hoverAnimation: true,
                    label: {
                        normal: {
                            formatter: '{b}',
                            position: 'right',
                            show: true
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: 'purple',
                            shadowBlur: 10,
                            shadowColor: '#333'
                        }
                    },
                    zlevel: 1
                }*/
            ]
        };;
        if (option && typeof option === "object") {
            myChart.setOption(option, true);
        }

        window.addEventListener("resize", this.onWindowResize);
        
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.data.length > 0){
            myChart.setOption({
                series: [{
                    name: '严重警告',
                    data: nextProps.data[0],
                },{
                    name: '重度警告',
                    data: nextProps.data[1],
                },{
                    name: '一般消息',
                    data: nextProps.data[2],
                }]
            });
        }
    }
    componentWillUnmount() {

    }
    onWindowResize(){
        myChart.resize();
    }
	render() {
        return (
            <div id="container" style={{ width: '100%', height: '100%' }}></div>
        );
    }
}

export default NoticeMapChart;