import React, { Component } from 'react';

import './Header.scss';
import logoImg1 from '../../img/logo2.png';
import userImg from '../../img/uesrname.png';


export class Header extends Component {
	render() {
		return (
			<header className="app-header">
				<div className="logo">
					<img src={logoImg1} />
				</div>
				<div className="heading">智慧环保大气污染数据应用平台</div>
				<div className="bar">

					<i><img src={userImg} alt="" /></i>
					<span>欢迎您</span><em>|</em><span>admin</span>
					<button className="logout_btn">退出</button>
				</div>
			</header>
		);
	}
}

export default Header;