// 数据查询的多选代码
import React from 'react';

import { Checkbox } from 'antd';
import './MultiSelect.css'

const CheckboxGroup = Checkbox.Group;

const plainOptions = ['SO2', 'NO2', 'CO', 'PM2.5', 'PM10', 'O3'];
const defaultCheckedList = ['SO2', 'NO2', 'CO', 'PM2.5', 'PM10', 'O3'];

export default class MultiSelects extends React.Component {
  state = {
    checkedList: defaultCheckedList,
    indeterminate: true,
    checkAll: false,
  };

  onChange = (checkedList) => {
    this.setState({
      checkedList,
      indeterminate: !!checkedList.length && (checkedList.length < plainOptions.length),
      checkAll: checkedList.length === plainOptions.length,
    });
  }

  onCheckAllChange = (e) => {
    this.setState({
      checkedList: e.target.checked ? plainOptions : [],
      indeterminate: false,
      checkAll: e.target.checked,
    });
  }

  render() {
    return (
      <div style={{marginLeft:'30px'}}>
        <div style={{fontSize:'18px',}}>
          <span style={{color:"#fff",fontSize:'18px',fontFamily:'sans-serif'}}>污染物：</span>
          <Checkbox
            indeterminate={this.state.indeterminate}
            onChange={this.onCheckAllChange}
            checked={this.state.checkAll}
          >
            Check all
          </Checkbox>
        </div>
        <br />
        <CheckboxGroup options={plainOptions} value={this.state.checkedList} onChange={this.onChange} />
      </div>
    );
  }
}
