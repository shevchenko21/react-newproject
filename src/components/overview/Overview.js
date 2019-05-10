import React, { Component } from 'react';
import CityPickerT from '../../components/cityPickerT/CityPickerT';
import BaiDuMap from '../../components/baiDuMap/BaiDuMap';
import AreaData from '../../js/utils/areaData.json';
import TreeView from '../treeView/TreeView';
import './Overview.scss';
// 引入jQuery（重要）
import $ from 'jquery';
import { sortBy } from '../../js/utils/comm.js';

export class Overview extends Component {
	constructor(){
        super();
        this.state = {
        	rankIndex:1,	//数据类型 1:牲畜;2:牧户;3:牧场
            sumData:{
            	pasture:{
            		number: 0,
            		percent: 0,
            	},
            	herdsman:{
            		number: 0,
            		percent: 0,
            	},
            	livestock:{
            		number: 0,
            		percent: 0,
            	}
            },
            heatMapChartData: [],
            pasturePieChartData:[],
            pictorialBarChartData:[],
            rankLineChartData: [],
            rankListData:[],
            location: this.getInitLocation(),
        };
        this.ajaxParam = {
        	url: '/poverty/getSortAiasByProvince',
        	rankUrl: '/poverty/getSortByThing',
        };
        this.ajax = null;
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
    handleLocationChange = (value) => {
    	// console.log(value)
	    this.setState({
	    	location: value
	    },()=>{this.getData();this.getRankData();});
	}
	handleClearAllClick = () => {
		this.ajax.abort();
		this.rankAjax.abort();
		this.setState({
			location: this.getInitLocation()
		},()=>{this.getData();this.getRankData();})
	}
    componentDidMount(){
    	//获取数据，默认全国
    	this.getData();
    	//获取排名数据，默认全国
    	this.getRankData();

    }
	componentWillUnmount(){
		//终止ajax
		this.ajax.abort();
		this.rankAjax.abort();
	}
	render() {
		const { location } = this.state;
		return (
			<div className="main overview">
				<div className="left">
					<section className="sum_section">
						<div className="select_bar">
							<CityPickerT
								selectedProvince = {location.province}
								selectedCity = {location.city}
								source = {AreaData}
								onOptionChange = {this.handleLocationChange} />
								<button className="clearall-btn" onClick={this.handleClearAllClick}>查找</button>
						</div>
					</section>
					<div className="component_tree_view">
						<TreeView />
					</div>
				</div>
				<div className="right">
					<div className="top">
						<div className="component_baidu_view">
							<BaiDuMap />
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
		        		pasture:{
		            		number: data.efCount || 0,
		            		percent: data.efPercent || 0,
		            	},
		            	herdsman:{
		            		number: data.herdCount || 0,
		            		percent: data.herfPercent || 0,
		            	},
		            	livestock:{
		            		number: data.aiasCount || 0,
		            		percent: data.aiasPercent || 0,
		            	}
		        	},
		        	pictorialBarChartData: this.convertBarData(data.povertyAiasDataList || []),
		        	pasturePieChartData: this.convertPieData(data.efDataList || []),
		        	heatMapChartData: this.convertMapData(data.povertyDataList || []),
		        	rankListData: this.convertRankListData(data.povertyDataList || []),
		        })
		        
		    },
		    error: ()=>{
		    },
		    
		})
    }
    //获取并更新排名折线图数据
    getRankData() {
		const { location, rankIndex } = this.state;
    	let ajaxData = {
    		poicId: location.province,
    		cityId: location.city,
    		cutyDsrcId: location.districtName,
    		sortClass: rankIndex
    	}
    	this.rankAjax = $.ajax({
		    url: this.ajaxParam.rankUrl,
		    type: 'GET', 
		    data: ajaxData,
		    dataType:'json',
		    success: (res) => {
		        // console.log(res)
		        let data = res.dataObject;
		        this.setState({
		        	rankLineChartData: this.convertBarData(data.povertyAiasDataList || []),
		        })
		        
		    },
		    error: ()=>{
		    },
		    
		})
    }
    //获取排名线图标题
    getRankChartTitle(){
    	const { location, rankIndex } = this.state;
    	const rankType = ["","牲畜", "牧户","牧场"];
    	if(location.province === ''){
			return "全国所有省排名"
		}else if (location.city === ''){
			return location.provinceName + "所有市排名"
		}else{
			return location.cityName + "所有县排名"
		}
    }
    //切换数据类型
    changeRankIndex(index,e) {
    	this.rankAjax.abort();
    	this.setState({
    		rankIndex: index,
    	},()=>{this.getRankData();})
    }
    /**
    *功能：转化数据
    *返回类型：Array
    *形式：[{value:135, name:'骆驼'}]
    **/
    convertBarData(arr){
		let data = [];
		if(arr.length > 0){
			arr.map((item,index)=>{
				data.push({
					name: item.dicName,
					value: item.aiasCount
				});
			});
			data.sort(sortBy('value'))
		}
		return data;
    }

    convertPieData(arr){
		let data = [];
		if(arr.length > 0){
			arr.map((item,index)=>{
				data.push({
					name: item.efNameClass + '牧场',
					value: item.efCount
				});
			});
		}
		return data;
    }

    convertMapData(arr){
		let data = [];
		if(arr.length > 0){
			arr.map((item,index)=>{
				data.push({
					name: item.poicName,
					value: item.aiasCount
				});
			});
		}
		
		return data;
    }

    convertRankListData(arr){
    	let data = [];
		if(arr.length > 0){
			arr.map((item,index)=>{
				data.push({
					name: item.poicName,
					value: item.aiasCount
				});
			});
		}
		
		data.sort(sortBy('value'))
		return data.slice(0,10);
    }
    //获取排行列表名称
    getRankListTitle(){
		const { location } = this.state;
		if(location.province === ''){
			return "各省"
		}else if (location.city === ''){
			return "各市"
		}else{
			return "各县"
		}
    }
}

export default Overview;