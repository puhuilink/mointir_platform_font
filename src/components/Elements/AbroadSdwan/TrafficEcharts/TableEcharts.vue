<template>
  <a-table :columns="columns" :data-source="data" bordered :pagination="false" class="custom-table">

  </a-table>
</template>
<script>
const columns = [
  {
    title: '告警对象',
    dataIndex: 'name',
    align: 'center',
    width: 276
  },
  {
    title: '告警时间',
    className: 'column-money',
    dataIndex: 'time',
    align: 'center',
    width: 164
  },
  {
    title: '告警持续时间',
    dataIndex: 'AlarmTime',
    align: 'center',
    width: 194
  },
  {
    title: '告警级别',
    dataIndex: 'Alarmlevel',
    align: 'center',
    width: 194
  },
  {
    title: '状态',
    dataIndex: 'State',
    align: 'center'
  }
]

const data = [
  {
    key: '1',
    name: 'ccccfhegc-2018010388-17749984B9-1_wan1--厦门数据中心（中交融合项目）-LW3007V4-2x10GE-GM_WAN',
    time: '2023-02-07 17:39:33',
    AlarmTime: '14s',
    Alarmlevel: '提醒',
    State: '待处理'
  },
  {
    key: '1',
    name: 'ccccfhegc-2018010388-17749984B9-1_wan1--厦门数据中心（中交融合项目）-LW3007V4-2x10GE-GM_WAN',
    time: '2023-02-07 17:39:33',
    AlarmTime: '14s',
    Alarmlevel: '提醒',
    State: '待处理'
  },
  {
    key: '1',
    name: 'ccccfhegc-2018010388-17749984B9-1_wan1--厦门数据中心（中交融合项目）-LW3007V4-2x10GE-GM_WAN',
    time: '2023-02-07 17:39:33',
    AlarmTime: '14s',
    Alarmlevel: '提醒',
    State: '待处理'
  }

]

export default {
  data () {
    return {
      data,
      columns
    }
  }
}
</script >
<style lang="less" scoped>
//table{
//  background-color: #000000;
//  color: #FFFFFF;
//  //border-color: blue;
//  border: 1px solid blue;
//
//}
//.custom-table .ant-table-cell {
//  background-color: black;
//  border-color: blue;
//}
//
///deep/ .ant-table-thead > tr.ant-table-row-hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td, .ant-table-tbody > tr.ant-table-row-hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td, .ant-table-thead > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td, .ant-table-tbody > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td {
//  background: #e6f7ff !important;
//  border: 1px solid #3222b6 !important;
//}
//
//.custom-table {
//  background-color: black;
//  padding: 0px;
//}
//
//.custom-table .ant-table-thead > tr > th {
//  border-color: rgb(21,112,170);
//  //border: 3px solid blue;
//  background-color: #000;
//  color: #fff
//}
//
//.custom-table .ant-table-tbody > tr > td {
//  //border-color: blue;
//  border-color:rgb(21,112,170);
//}

//修改表头文字、背景颜色
.ant-table-thead > tr > td{
  color: white !important;
  background: #3071b9 !important;
}

//修改列表文字、背景颜色
.ant-table-tbody > tr > td{
  color: white !important;
  background: #3071b9 !important;
}
</style>
