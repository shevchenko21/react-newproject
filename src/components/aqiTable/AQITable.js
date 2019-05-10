// 数据查询的表格代码

import React from 'react';
import 'antd/dist/antd.css';
import { Table } from 'antd';
import $ from "jquery";
import { func } from 'prop-types';

const columns = [{
  title: '城市',
  dataIndex: 'city',
  width: 150,
}, {
  title: '时间',
  dataIndex: 'time',
  width: 150,
}, {
  title: 'SO2',
  dataIndex: 'SO2',
}, {
  title: 'NO2',
  dataIndex: 'NO2',
}, {
  title: 'CO',
  dataIndex: 'CO',
}, {
  title: 'PM2.5',
  dataIndex: 'PM25',
}, {
  title: 'PM10',
  dataIndex: 'PM10',
}, {
  title: 'O3',
  dataIndex: 'O3',
}];

const data = [{
  key: 0,
  city: '丰台花园',
  time: `2018-12-31  0:00:00`,
  SO2: `7`,
  NO2: `75`,
  CO: `1.1`,
  PM25: `38`,
  PM10: `130`,
  O3: `0`
},
{
  key: 1,
  city: '京南',
  time: `2018-12-31  0:00:00`,
  SO2: `6`,
  NO2: `75`,
  CO: `1.1`,
  PM25: `40`,
  PM10: `123`,
  O3: `2`
},
{
  key: 2,
  city: '顺义',
  time: `2018-12-31  0:00:00`,
  SO2: `7`,
  NO2: `71`,
  CO: `1`,
  PM25: `36`,
  PM10: `127`,
  O3: `1`
}];
for (let i = 3; i < 100; i++) {
  let day = "2018-12-31 ";
  let hour = ":00:00";
  data.push({
    key: i,
    city: '丰台花园',
    time: `${day}${i}${hour}`,
    SO2: `${i}`,
    NO2: `${i}`,
    CO: `${i}`,
    PM25: `${i}`,
    PM10: `${i}`,
    O3: `${i}`
  });
}
$.ajax({
  type: 'GET',
  url: "http://172.21.72.231:8080/dataService/historyData",
  dataType: "json",
  contentType:"application/x-www-form-urlencoded",
  success: function (data) {
      console.log(data);
      var result = JSON.stringify(data); //json对象转成字符串
      console.log(result);
      
      console.log(data);

  },
  error: function (data) {
      console.log(data);
      console.log(data.responseText);
  }
})


class AQITable extends React.Component {
  render() {
    return (
      <Table columns={columns} dataSource={data} pagination={{ pageSize: 50 }} scroll={{ y: 240 }} />
    )
  }
}

export default AQITable;
