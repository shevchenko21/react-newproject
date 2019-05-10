import React, { Component } from 'react';
import { DatePicker,Select } from 'antd';
import CityPickerT from '../../components/cityPickerT/CityPickerT';
import TreeView from '../treeView/TreeView';
import moment from 'moment';
import { Tabs } from 'antd';
import AreaData from '../../js/utils/areaData.json';
// 引入全国344个市、区、州对应的数字编号, 和相关通用方法
import { CityMap, ProvinceCodeMap } from '../../js/utils/geoMap';
import './Trace.scss';
import '../timePicker/TimePicker.css';
// 引入jQuery（重要）
import $ from 'jquery';
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
import { sortBy } from '../../js/utils/comm.js';
import 'react-select2-wrapper/css/select2.css';
const Option = Select.Option;

const dateFormat = 'YYYY-MM-DD HH:mm:ss';
const TabPane = Tabs.TabPane;
const selectData = [
  {
    title: '京南',
    key: 'S001'
  }, {
    title: '丰台花园',
    key: 'S002'
  }, {
    title: '顺义',
    key: 'S003'
  }, {
    title: '延庆',
    key: 'S004'
  }, {
    title: '平谷',
    key: 'S005'
  }, {
    title: '房山',
    key: 'S006'
  }, {
    title: '亦庄',
    key: 'S007'
  }, {
    title: '云岗',
    key: 'S008'
  }, {
    title: '天坛',
    key: 'S009'
  }, {
    title: '永定门',
    key: 'S010'
  }, {
    title: '京东北',
    key: 'S011'
  }, {
    title: '怀柔',
    key: 'S012'
  }, {
    title: '京西北',
    key: 'S013'
  }, {
    title: '万寿西宫',
    key: 'S014'
  }, {
    title: '昌平',
    key: 'S015'
  }, {
    title: '门头沟',
    key: 'S016'
  }, {
    title: '通州',
    key: 'S017'
  }, {
    title: '大兴',
    key: 'S018'
  }, {
    title: '定陵',
    key: 'S019'
  }, {
    title: '前门',
    key: 'S020'
  }, {
    title: '官园',
    key: 'S021'
  }, {
    title: '东四',
    key: 'S022'
  }, {
    title: '香山',
    key: 'S023'
  }, {
    title: '奥体中心',
    key: 'S024'
  }, {
    title: '农展馆',
    key: 'S025'
  }, {
    title: '密云',
    key: 'S026'
  }, {
    title: '古城',
    key: 'S027'
  }, {
    title: '南三环',
    key: 'S028'
  }, {
    title: '北部新区',
    key: 'S029'
  }, {
    title: '万柳',
    key: 'S030'
  }, {
    title: '京东南',
    key: 'S031'
  }, {
    title: '京西南',
    key: 'S032'
  }, {
    title: '京东',
    key: 'S033'
  }, {
    title: '东四环',
    key: 'S034'
  }, {
    title: '西直门',
    key: 'S035'
  }
];
let positionItem = [];
for (let index = 0; index < selectData.length; index++) {
	positionItem.push(<option value={selectData[index].key}> {selectData[index].title} </option> );
	
}

// 获取点位的信息并且发出ajax请求，获取数据
function getDataByTimeAndPosition(){
	var currentTime = $("span#currentTime>div>input").val();
	var selectedPosition = $("#selectPosition").val();	
	// $.ajax({
	// 	url: '',
		
	// })	

}

export class Trace extends Component {
	constructor(){
        super();
        this.state = {
            sumData:{
            	herdsman:{
            		number: 0,
            		percent: 0,
            	},
            	camera:{
            		number: 0,
            		percent: 0,
            	},
            	fence:{
            		number: 0,
            		percent: 0,
            	},
            	livestock:{
            		number: 0,
            		percent: 0,
            	},
            },
            livestockPieChartData: [],
            fenceBmapChartData: [],
            fenceSelectData: [],
            rankBarChartData: [],
            location: this.getInitLocation(),
						curFence: this.getInitFence(),
						isVisibleSingle: 'block',
						isVisibleMulti: 'none',
        };
        this.ajaxParam = {
        	url: '/poverty/getEfSum',
        };
        this.ajax = null;  
    }
    getInitFence(){
    	return {
            	id: 0,
	            code: "",
	            name: "",
	            value: [],
	            coords: [],
	            type: "",
	            radius: 0,
	            location: "",
	            class: "",
	            provinceName: "",
	            cityName: "",
	            districtName: "",
	        }
    }
    getInitLocation(){
    	return {
            	province: '',
				provinceName: '',
				city: '',
				cityName: '',
				district: '',
				districtName: '',
            }
    }
    //cityPicker回调函数，更新地点
    handleLocationChange = (location) => {
    	// console.log(value)
	    this.setState({
	    	location: location
	    },()=>{this.getData()});
	}
	handleSelectChange = (e) => {
		//获取围栏id
		let id = e.target.value;
		if(id > 0){
			let fence = this.getFenceById(id);
			let location = this.getLocationByFence(fence);
			this.setState({
				curFence: fence,
				location: location,
			},()=>{this.getData()})
		}else{
			this.setState({
				curFence: this.getInitFence()
			},()=>{this.getData()})
		}
	}
	handleFenceClick = (fence) => {
		let location = this.getLocationByFence(fence);
		this.setState({
			curFence: fence,
			location: location,
		},()=>{this.getData()})
	}
	handleClearAllClick = () => {
		this.ajax.abort();
		this.setState({
			curFence: this.getInitFence(),
			location: this.getInitLocation(),
		},()=>{this.getData()})
	}
	componentDidMount(){
			var myChart = echarts.init(document.getElementById('main'));
			var option = {
					 title: {
						 x:'center',
							 text: '近24小时大气污染物浓度趋势',
							 textStyle:{//标题内容的样式
									 color:'#333',
									 fontStyle:'normal',//主标题文字字体风格，默认normal，有italic(斜体),oblique(斜体)
									 fontWeight:"bolder",//可选normal(正常)，bold(加粗)，bolder(加粗)，lighter(变细)，100|200|300|400|500...
									 fontFamily:"san-serif",//主题文字字体，默认微软雅黑
									 fontSize:14,//主题文字字体大小，默认为18px
									 textAlign:'center'
							 }
					 },
					 tooltip: {
							 trigger: 'axis'
					 },
					 legend: {
							 data:['PM2.5浓度','PM10浓度','SO₂浓度','NO₂浓度','CO浓度','O₃浓度'],
							 type: 'scroll',
							 orient: 'vertical',
							 right: 15,
							 top: 30,
							 bottom: 20,
					 },
					 grid:{
						left:60,
						top:60,
						right:60,
						bottom:180 
				},
					 toolbox: {
						show : true,
						feature : {
							dataView : {show: true, readOnly: true, buttonColor: '#199ED8'},
							magicType : {show: true, type: ['line', 'bar']},
							//restore : {show: true},
							saveAsImage : {show: true}
						}
					 },
					 xAxis: {
							 name : '时间/时',
							 type: 'category',
							 boundaryGap: false,
							 data: [ 8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,0,
							 1,2,3,4,5,6,7]
					 },
					 yAxis: [
								{
								name : '浓度(μg/m³)',
								type : 'value',
								},
					 ],
					 series: [
							 {
									 name:'PM2.5浓度',
									 type:'line',
									 stack: 'PM2.5',
									 data:[90,85,81,86,89,84,92,90,89,91,92,100,99,104,116,121,104,58,18,12,7,7,2,1]
							 },
							 {
									 name:'PM10浓度',
									 type:'line',
									 stack: 'PM10',
									 data:[51,90,81,78,80,79,80,86,91,103,115,129,159,136,125,125,122,82,91,20,38,39,22,20]
							 },   
							 {
									 name:'SO₂浓度',
									 type:'line',
									 stack: 'SO₂',
									 data:[2,5,8,10,12,14,14,13,12,9,7,6,4,4,4,3,4,4,2,1,1,1,1,1]
							 },
							 {
									 name:'NO₂浓度',
									 type:'line',
									 stack: 'NO₂',
									 data:[63,59,59,46,46,46,47,46,37,36,54,117,100,94,77,115,131,70,24,17,20,18,16,18]
							 },
							 {
									 name:'CO浓度',
									 type:'line',
									 stack: 'CO',
									 data:[1.2,1.5,1.4,1.4,1.4,1.4,1.4,1.3,1.1,0.9,0.9,1.1,1.5,1.6,1.5,1.5,1.4,0.9,0.3,0.3,0.3,0.3,0.3,0.3]
							 },
							 {
									 name:'O₃浓度',
									 type:'line',
									 stack: 'O₃',
									 data:[16,21,31,57,73,92,115,138,169,178,158,86,59,49,65,21,6,35,66,70,51,39,38,39]
							 },
					 ]
			 };
			 myChart.setOption(option);
			 var myChart1 = echarts.init(document.getElementById('main1'));
        var option1 = {
            title : {
                text: '近24小时AQI浓度统计图',
                x:'center',
                textStyle:{//标题内容的样式
                    color:'#333',
                    fontStyle:'normal',//主标题文字字体风格，默认normal，有italic(斜体),oblique(斜体)
                    fontWeight:"bolder",//可选normal(正常)，bold(加粗)，bolder(加粗)，lighter(变细)，100|200|300|400|500...
                    fontFamily:"san-serif",//主题文字字体，默认微软雅黑
                    fontSize:14,//主题文字字体大小，默认为18px
                },
            },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: ['优','良','轻度污染','中度污染','重度污染','严重污染']
						},
            series : [
                {
                    name: '访问来源',
                    type: 'pie',
                    radius : '40%',
                    center: ['55%', '45%'],
                    data:[
                        {value:0, name:'优'},
                        {value:1, name:'良'},
                        {value:2, name:'轻度污染'},
                        {value:15, name:'中度污染'},
                        {value:0, name:'重度污染'},
                        {value:0, name:'严重污染'}
                    ],
                    /*itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }*/
                    color: ['#9FE6B8','#FFDB5C','#efa767','#f52626', '#dc13de', '#9c0c0c'],
                }
            ]
        };
				myChart1.setOption(option1);
				var myChart2 = echarts.init(document.getElementById('main2'));
       var option2= {
            title: {
                text: '近24小时PM2.5浓度',
                textStyle:{//标题内容的样式
                    color:'#333',
                    fontStyle:'normal',//主标题文字字体风格，默认normal，有italic(斜体),oblique(斜体)
                    fontWeight:"bolder",//可选normal(正常)，bold(加粗)，bolder(加粗)，lighter(变细)，100|200|300|400|500...
                    fontFamily:"san-serif",//主题文字字体，默认微软雅黑
                    fontSize:14,//主题文字字体大小，默认为18px
                },
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data:['前门','丰台花园','房山']
            },
            toolbox: {
             show : true,
             feature : {
                 dataView : {show: true, readOnly: true, buttonColor: '#199ED8'},
                 magicType : {show: true, type: ['line', 'bar']},
                 //restore : {show: true},
                 saveAsImage : {show: true}
             }
            },
            xAxis: {
                name : '时间/时',
                type: 'category',
                boundaryGap: false,
                data: [
                8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,0,
                1,2,3,4,5,6,7]
            },
            yAxis: [
                 {
                 name : '浓度(μg/m³)',
                 type : 'value',
                 },
            ],
            series: [
                {
                    name:'前门',
                    type:'line',
                    stack: '前门',
                    data:[74,80,86,86,89,89,103,105,87,80,91,108,100,105,104,109,95,40,22,10,9,5,5,2]
                },
                {
                    name:'丰台花园',
                    type:'line',
                    stack: '丰台花园',
                    data:[90,85,81,86,89,84,92,90,89,91,92,100,99,104,116,121,104,58,18,12,7,7,2,1]
                },   
                {
                    name:'房山',
                    type:'line',
                    stack: '房山',
                    data:[96,98,95,86,81,89,94,93,86,91,93,117,116,116,107,103,70,18,11,8,10,5,3,2]
                }
            ]
        };
				myChart2.setOption(option2);
				
				var myChart3 = echarts.init(document.getElementById('main3'));
        var hours =[8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,0,
                1,2,3,4,5,6,7];
        var name = ['前门','丰台花园','房山'];
        var qianmen = [74,80,86,86,89,89,103,105,87,80,91,108,100,105,104,109,95,40,22,10,9,5,5,2];
        var fengtai = [90,85,81,86,89,84,92,90,89,91,92,100,99,104,116,121,104,58,18,12,7,7,2,1];
        var fangshan = [96,98,95,86,81,89,94,93,86,91,93,117,116,116,107,103,70,18,11,8,10,5,3,2];
        var data1 = qianmen.map(function (item,index) {
          return [index,1,item];
        });
        var data2 = fangshan.map(function (item,index){
          return [index,2,item];
        });
        var data3 = fengtai.map(function (item,index){
          return [index,0,item];
        });
        var data = [];
        data=data1.concat(data2);
        data=data.concat(data3);

        data = data.map(function (item) {
            return [item[0], item[1], item[2] || '-'];
        });
        var option3 = {
          title : {
            text : '近24小时区域热力图',
            x : 'center',
          },
          tooltip: {
              position: 'top'
          },
          animation: false,
          grid: {
              height: '75%',
              x: '20%',
              y: '10%'
          },
          xAxis: {
              name: '时间/时',          //X轴的名称
              nameLocation : 'end',    //X轴名称显示的位置
              type: 'category',
              data: hours,
              splitArea: {
                show: true
              }
          },
          yAxis: {
              name: '站点名称',         //y轴的名称
              type: 'category',
              nameLocation : 'end',
              data: ['丰台花园','前门','房山']
          },
         
          visualMap : {
             show : true, 
             orient: 'vertical',
             itemWidth:10, 
             textGap:2, 
             left: 'left',
                x : '0%',
                y : '0%',
            splitList : [ {
              start : 300,
              end : 1000
            }, {
              start : 201,
              end : 300
            }, {
              start : 151,
              end : 200
            }, {
              start : 101,
              end : 150
            }, {
              start : 51,
              end : 100
            }, {
              start : 0,
              end : 50
            } ],
            
            color : ['#9c0c0c','#dc13de','#f52626','#efa767','#FFDB5C','#9FE6B8']
          },
          series: [{
              name: '时平均热度',
              type: 'heatmap',
              data: data,
              label: {
                  normal: {
                      show: true
                  }
              },
              itemStyle: {
                  emphasis: {
                      shadowBlur: 10,
                      shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
              }
          }]
      };
				myChart3.setOption(option3);
				
				var myChart4 = echarts.init(document.getElementById('main4'));
				var option4 = {
					 title: {
							 text: '近24小时大气污染物平均值',
							 textStyle:{//标题内容的样式
									 color:'#333',
									 fontStyle:'normal',//主标题文字字体风格，默认normal，有italic(斜体),oblique(斜体)
									 fontWeight:"bolder",//可选normal(正常)，bold(加粗)，bolder(加粗)，lighter(变细)，100|200|300|400|500...
									 fontFamily:"san-serif",//主题文字字体，默认微软雅黑
									 fontSize:14,//主题文字字体大小，默认为18px
							 },
					 },
					 legend: {
						 data: ['前门', '丰台花园', '房山']
					 },
					 toolbox: {
			 show: true,
			 orient: 'vertical',
			 left: 'right',
			 top: 'center',
			 feature: {
					 mark: {show: true},
					 dataView: {show: true, readOnly: false},
					 magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
					 restore: {show: true},
					 saveAsImage: {show: true}
			 }
	 },
					 grid: {
						 height: '75%',
						 width:'80%',
						 x: '7%',
						 y: '15%'
					 },
						xAxis: {
							 name: '大气污染物', 
							 type: 'category',
							 data: ['PM2.5浓度','PM10浓度','SO₂浓度','NO₂浓度','CO浓度','O₃浓度']
					 },
					 yAxis: {
							 name: '浓度(μg/m³)',
							 type: 'value'
					 },
					 /*
			 前门so2:104、co：27.1、no2:2102、03：1276、pm10:730、pm2.5:1689
			 丰台花园：so2:142、co：25.3、O3：1567、no2:1275、pm10：1415、pm2.5：1908、
			 房山：so2:130、co：17.7、no2:959、O3:1556、pm10：1955、pm2.5：1898
				*/
					 series: [
					 {
							 name: '前门',
							 type: 'bar',
							 barGap: 0,
							 data: [1689/24,730/24,104/24,2102/24,27.1/24,1276/24]
					 },
					 {
							 name: '丰台花园',
							 type: 'bar',
							 data: [1908/24, 1415/24, 142/24, 1275/24, 25.3/24,1567/24]
					 },
					 {
							 name: '房山',
							 type: 'bar',
							 data: [1898/24,1955/24,130/24,959/24,17.7/24,1556/24]
					 }],
			 };
			 myChart4.setOption(option4);
    }
	componentWillUnmount(){
	
	}
	changePoint=(key)=>{
		if(key == 1){
			this.setState({
				isVisibleSingle: 'block',
				isVisibleMulti: 'none'
			}
			)
		}
		if(key == 2){
			this.setState({
				isVisibleMulti: 'block',
				isVisibleSingle: 'none'
			}
			)
		}
		// alert(key);
	}
	render() {
		const { location} = this.state;
		return (
			<div className="main fence">
				{/* <div className="left"> */}
					{/* <section className="sum_section">
						<div className="select_bar">
							<CityPickerT
								selectedProvince = {location.province}
								selectedCity = {location.city}
								// selectedDistrict = {location.district}
								source = {AreaData}
								onOptionChange = {this.handleLocationChange} />
								<button className="clearall-btn" onClick={this.handleClearAllClick}>查找</button>
						</div>
					</section>
					<div className="component_tree_view">
						<TreeView />
					</div>
					<RefreshTime /> */}
				{/* </div> */}
				<div className="right">
					<div className="top">
						<Tabs onChange={this.changePoint} type="card">
							<TabPane tab="单站点" key="1"></TabPane>
							<TabPane tab="多站点" key="2"></TabPane>
						</Tabs>
					</div>
					<div className="bottom1" style={{ display:`${this.state.isVisibleSingle}`}}>
						{/* &nbsp;&nbsp;当前时间1：
						<DatePicker
							id="currentTime"
							showTime
							defaultValue={moment('2018-10-06 07:00:00', dateFormat)} format={dateFormat}
							placeholder="Select Time"
						/> */}
						&nbsp;&nbsp;选择站点：
						<select name="selectPosition" id="selectPosition">
							{positionItem}
						</select>
						
						<button class="clearall-btn" onClick={getDataByTimeAndPosition}>查询</button>
						<div className="bs-example" style={{marginTop:"10px",marginLeft:"10px",marginRight:"10px",textAlign:"center",background:"white",color:"black",fontSize:"15px"}}>
								<table className="table table-bordered">
									<thead>
										<tr>
											<th>站点名称</th>
											<th>PM2.5</th>
											<th>PM10</th>
											<th>SO₂</th>
											<th>NO₂</th>
											<th>CO</th>
											<th>O₃</th>
											<th>AQI</th>
											<th>AQI预测</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<th scope="row">丰台花园</th>
											<td>1</td>
											<td>20</td>
											<td>1</td>
											<td>18</td>
											<td>0.3</td>
											<td>39</td>
											<td>20</td>
											<td>优</td>
										</tr>
									</tbody>
								</table>
						</div>
       			 <div id="main" style={{width:"50%",height:"100%",display: "inline-block"}}></div>
        		<div id="main1" style={{width:"50%",height:"100%",display: "inline-block",background:"yellow"}}></div>
					</div>
				
					<div className="bottom1" style={{ display:`${this.state.isVisibleMulti}`}}>
						{/* &nbsp;&nbsp;当前时间：
						<DatePicker
							showTime
							defaultValue={moment('2018-10-06 07:00:00', dateFormat)} format={dateFormat}
							placeholder="Select Time"
						/> */}
						&nbsp;&nbsp;站点名称:
							<select style={{height: "26px"}}>
								<option value ="volvo">PM2.5</option>
								<option value ="saab">PM10</option>
								<option value="opel">SO₂</option>
								<option value="audi">NO₂</option>
								<option value="opel">CO</option>
								<option value="audi">O₃</option>
							</select>
							<div id="main2" style={{background:"yellow",width: "1200px", height:"200px"}}></div>
							<div style={{height:"100%"}}>
							<div id="main3" style={{float:"left",background:"white",width: "500px",height:"300px"}}></div>
        			<div id="main4" style={{float:"right",background:"black",width: "500px",height:"270px"}}></div>
							</div>
					</div>
				</div>
			</div>
		);
	}
	//获取并更新数据
    getData() {
		const { location } = this.state;
    	let ajaxData = {
    		poicId: location.province,
    		cityId: location.city,
    		cutyDsrcId: location.districtName
    	}
    	this.ajax = $.ajax({
		    url: this.ajaxParam.url,
		    type: 'GET', 
		    data: ajaxData,
		    dataType:'json',
		    success: (res) => {
		        // console.log(res)
		        let data = res.dataObject;
		        this.setState({
		        	sumData: {
		        		herdsman:{
		            		number: data.herdCount || 0,
		            		percent: data.herfPercent || 0,
		            	},
		        		camera:{
		            		number: data.camCount || 0,
		            		percent: data.camPercent || 0,
		            	},
		            	fence:{
		            		number: data.coveredCount || 0,
		            		percent: data.coverPercent || 0,
		            	},
		            	livestock:{
		            		number: data.aiasCount || 0,
		            		percent: data.aiasPercent || 0,
		            	},
		        	},
		        	livestockPieChartData: this.convertPieData(data.povertyAiasDataList || []),
					fenceBmapChartData: this.convertBmapData(data.electricFenceExtendedList || []),
					fenceSelectData: this.convertSelectData(data.electricFenceExtendedList || []),
					rankBarChartData: this.convertBarData(data.povertyDataList || []),
		        })
		        
		    },
		    error: ()=>{
		    },
		    
		})
    }
    convertPieData(arr){
		let data = [];
		if(arr.length > 0){
			arr.map((item,index)=>{
				data.push({
					name: item.dicName,
					value: item.aiasCount
				});
			});
		}
		return data;
    }

    convertBarData(arr){
		let data = [];
		if(arr.length > 0){
			arr.map((item,index)=>{
				data.push({
					name: item.poicName,
					value: item.aiasCount
				});
			});
		}
		data.sort(sortBy('value',false))
		return data;
    }
    convertBmapData(arr){
    	let data = [];
    	if(arr.length > 0){
			arr.map((item,index)=>{
				data.push({
					id: item.eetiFneId,
					code: item.eetiFneCode,
					name: item.eetiFneName,
					value: [],
					coords: this.convertCoords(item.lonLat),
					type: item.grazeShapeName === "多边形" ? "polygon" : "circle",
					radius: item.radius,
					location: item.areaFullName,
					class: item.grazeClassName,
					provinceName: item.poicName,
					cityName: item.cityName,
					districtName: item.cutyDsrcName,
				});
			});
			
    	}
    	return data;
    }
    convertCoords(str){
    	let coords = []
    	if(str !== null && str.length > 0){
			let arr = str.split(',');
			if(arr.length > 0){
				arr.map((item,index)=>{
					let temp = item.split('-');
					coords.push([temp[0],temp[1]]);
				});
			}
    	}
    	return coords;
    }

    convertSelectData(arr){
    	let data = [{
    		id: 0,
    		text: '请选择围栏名称',
    	}]
    	if(arr.length > 0){
    		arr.map((item, index)=>{
    			data.push({
    				id: item.eetiFneId,
    				text: item.eetiFneName,
    			});
    		});
    	}
    	return data;
    }

    getFenceById(id){
		let {fenceBmapChartData} = this.state;
		if(fenceBmapChartData.length > 0){
			for (var i = 0; i < fenceBmapChartData.length; i++) {
				if(fenceBmapChartData[i].id == id){
					let fence = fenceBmapChartData[i];
					return fence;
				}
			}
		}
		return {};
    }
    
    getLocationByFence(fence){
    	let { provinceName, cityName, districtName } = fence;
		//获取围栏所在省市县的编码
		let province = ProvinceCodeMap[provinceName];
		let city = CityMap[cityName];
		let district = "";
		let districtMap = AreaData[city];
		let location = {};
		for( let key in districtMap){
			if(districtMap[key] === districtName){
				district = key;
				break;
			}
		}
		if(province !== "" && provinceName !== ""){
			location.province = province;
			location.provinceName = provinceName;
			if(city !== "" && cityName !== ""){
				location.city = city;
				location.cityName = cityName;
				if(district !== "" && districtName !== ""){
					location.district = district;
					location.districtName = districtName;
				}else{
					location.district = '';
					location.districtName = '';
				}
			}else{
				location.city = '';
				location.cityName = '';
				location.district = '';
				location.districtName = '';
			}
		}else{
			location = this.getInitLocation()
		}
		return location;
    }
    
    
}

export default Trace;