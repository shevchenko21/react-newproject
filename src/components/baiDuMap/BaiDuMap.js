import React from 'react'
import green from '../../img/blue.png';

class BaiduMap extends React.Component {
  constructor(props){
    super(props);
    this.state={
      data_info:[
        [116.3, 39.52, "京南"],
        [116.279, 39.863, "丰台花园"],
        [116.655, 40.127, "顺义"],
        [115.972, 40.453, "延庆"],
        [116.628, 40.328, "平谷"],
        [116.136, 39.742, "房山"],
        [116.506, 39.795, "亦庄"],
        [116.146, 39.824, "云岗"],
        [116.407, 39.886, "天坛"],
        [116.394, 39.876, "永定门"],
        [116.911, 40.499, "京东北"],
        [116.628, 40.328, "怀柔"],
        [115.988, 40.365, "京西北"],
        [116.352, 39.878, "万寿西宫"],
        [116.234, 40.217, "昌平"],
        [116.106, 39.937, "门头沟"],
        [116.663, 39.886, "通州"],
        [116.404, 39.718, "大兴"],
        [116.22, 40.292, "定陵"],
        [116.395, 39.899, "前门"],
        [116.339, 39.929, "官园"],
        [116.417, 39.929, "东四"],
        [116.207, 40.002, "香山"],
        [116.397, 39.982, "奥体中心"],
        [116.461, 39.937, "农展馆"],
        [116.832, 40.37, "密云"],
        [116.184, 39.914, "古城"],
        [116.368, 39.856, "南三环"],
        [116.174, 40.09, "北部新区"],
        [116.287, 39.987, "万柳"],
        [116.783, 39.712, "京东南"],
        [116, 39.58, "京西南"],
        [117.12, 40.1, "京东"],
        [116.483, 39.939, "东四环"],
        [116.349, 39.954, "西直门"]
      ],
      AQI:["优","良","轻度污染","中度污染","重度污染","严重污染"]
    }
  }

  componentDidMount() {
    var BMap = window.BMap;
    var map = new BMap.Map("allmap"); // 创建Map实例
    map.centerAndZoom(new BMap.Point(116.4035, 39.915), 8);
    setTimeout(function () {
      map.setZoom(14);
    }, 2000); //2秒后放大到14级
    map.enableScrollWheelZoom(true);
    var opts = {
      width: 90, // 信息窗口宽度
      height: 130, // 信息窗口高度
      title: "详细信息", // 信息窗口标题
      enableMessage: true //设置允许信息窗发送短息
    };
    var icons = green;
    

    for (var i = 0; i < this.state.data_info.length; i++) {
      let num = "S" + (Array(3).join('0')+i).slice(-3);
      var marker = new BMap.Marker(new BMap.Point(this.state.data_info[i][0], this.state.data_info[i][1])); // 创建标注
      var icon = new BMap.Icon(icons, new BMap.Size(15, 15)); //显示图标大小
      // var myIcon = new BMap.Icon("http://api.map.baidu.com/img/markers.png", new BMap.Size(23, 25), {  
      //                   offset: new BMap.Size(10, 25), // 指定定位位置  
      //                   imageOffset: new BMap.Size(0, 0 - 10 * 25) // 设置图片偏移  
      //               });  
      // marker.setIcon(myIcon);//设置标签的图标为自定义图标
      var content = `<span style="color:green;text-align:center;">监测站名称：</span>${this.state.data_info[i][2]}<br/>
                     <span style="color:green;text-align:center;">设备状态：</span>在线<br/>
                     <span style="color:green;text-align:center;">设备温度：</span>32℃<br/>
                     <span style="color:green;text-align:center;">实时空气质量状况：</span>轻度污染<br/>
                     <span style="color:green;text-align:center;">未来空气质量状况：</span>轻度污染<br/>`;
      map.addOverlay(marker); // 将标注添加到地图中
      addClickHandler(content, marker);
    }

    function addClickHandler(content, marker) {
      marker.addEventListener("click", function (e) {
        openInfo(content, e)
      });
    }

    function openInfo(content, e) {
      var p = e.target;
      var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
      var infoWindow = new BMap.InfoWindow(content, opts); // 创建信息窗口对象 
      map.openInfoWindow(infoWindow, point); //开启信息窗口
    }
  }

  render() {
    return ( 	
    <div>
      <div
        id='allmap'
        style={{
          width:'100%',
          height:'100%',
          position:"absolute"
        }} />
    </div>
    )
  }
}

export default BaiduMap;