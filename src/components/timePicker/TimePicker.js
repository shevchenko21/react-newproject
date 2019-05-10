import React, { PureComponent } from 'react'
import { DatePicker } from 'antd';

const { RangePicker } = DatePicker;

export default class TimePicker extends PureComponent {
  onChange=(value, dateString)=>{
    console.log('Selected Time: ', value);
    console.log('Formatted Selected Time: ', dateString);
  }

  onOk=(value)=>{
    console.log('onOk: ', value);
  }
  
  render() {

    return (
        <div class="date">
          {/* <button onclick={this.onChanges}></button> */}
          <span style={{color:"#fff",fontSize:'18px',fontFamily:'sans-serif'}}>时间：</span>
          <RangePicker
            showTime={{ format: 'HH:mm' }}
            format="YYYY-MM-DD HH:mm"
            placeholder={['开始时间', '结束时间']}
            onChange={this.onChange}
            onOk={this.onOk}
          />
      </div>
    )
  }
}
