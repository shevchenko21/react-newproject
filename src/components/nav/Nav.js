import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import './Nav.scss';
class Nav extends Component {
	render() {
		return (
			<nav className="app-nav">
		    	<ul>
		    		<li><NavLink to='/app/overview'>实时监测</NavLink></li>
		    		<li><NavLink to='/app/fence'>数据查询</NavLink></li>
		    		<li><NavLink to='/app/trace'>数据展示</NavLink></li>
		    		<li><NavLink to='/app/notice'>数据预测</NavLink></li>
		    	</ul>
		    </nav>
		);
	}
}

export default Nav;