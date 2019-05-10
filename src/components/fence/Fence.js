import React, { Component } from 'react';
import { Button} from 'antd';
import CityPickerT from '../../components/cityPickerT/CityPickerT';
import TreeView from '../treeView/TreeView';
import TimePicker from '../../components/timePicker/TimePicker';
import MultiSelect from '../../components/multiSelects/MultiSelects';
import AQITable from '../../components/aqiTable/AQITable';
import AreaData from '../../js/utils/areaData.json';
// 引入全国344个市、区、州对应的数字编号, 和相关通用方法
import { CityMap, ProvinceCodeMap } from '../../js/utils/geoMap';
import './Fence.scss';
import '../timePicker/TimePicker.css';
// 引入jQuery（重要）
import $ from 'jquery';
import { sortBy } from '../../js/utils/comm.js';
import 'react-select2-wrapper/css/select2.css';
export class Fence extends Component {
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
    	//获取数据，默认全国
    	this.getData();
    }
	componentWillUnmount(){
		//终止ajax
		this.ajax.abort();
	}
	render() {
		const { location} = this.state;
		return (
			<div className="main fence">
				<div className="left">
					<section className="sum_section">
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
					{/* <RefreshTime /> */}
				</div>
				<div className="right">
					<div className="top">
						<div className="select_bar1">
							<TimePicker />
							<button className="clearall-btn" onClick={this.handleClearAllClick}>查询</button>
						</div>
					</div>
					<div className="center">						
						<MultiSelect/>
					</div>
					<div className="bottom">
							<div className="aqitable">
								<AQITable/>
							</div>
							<div className="bottom_btn">
								<Button className="clearall-btn" type="primary" shape="round" icon="download" size={'small'}>下 载</Button>
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

export default Fence;