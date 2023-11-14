<template>
  <div>
    <div class="tableTop">
      <div class="iconTop">
        <img src="../img/icon1.jpg" alt="">
        <span class="SpanText">告警信息</span>
        <button @click="showModal">
          More>>
        </button>
        <a-modal v-model="visible" title="" @ok="handleOk" width="60%">
          <a-select v-model="selectedValue1" style="width: 160px;padding: 10px 10px 10px 0px" @change="handleChange1" placeholder="站点名称" class="modalBox">
            <a-select-option v-for="(option, index) in selectOptions1" :key="index" :value="option.value" >
              {{ option.label }}
            </a-select-option>
          </a-select>
          <a-select v-model="selectedValue2" style="width: 160px;padding: 10px" @change="handleChange2" placeholder="告警事件" class="modalBox">
            <a-select-option v-for="(option, index) in selectOptions2" :key="index" :value="option.value" >
              {{ option.label }}
            </a-select-option>
          </a-select>
          <a-input-search placeholder="告警对象" v-model="selectedValue3" style="width: 160px;padding: 10px 0 10px 10px" @search="handleChange3"/>

          <a-button icon="redo" style="float: right;margin: 10px 30px 10px 10px;">
          </a-button>
          <a-select v-model="selectedTime" style="width: 160px;padding: 10px; float: right" @change="handleChange4" placeholder="时间" class="modalBox">
            <a-select-option v-for="(option, index) in selectTime" :key="index" :value="option.value" >
              {{ option.label }}
            </a-select-option>
          </a-select>

          <a-table
            :columns="columnsBig"
            :data-source="dataBig"
            bordered
            :pagination="false"
            class="modal-custom-table"
            :rowClassName="() => { return 'modalTable' }">
          </a-table>
        </a-modal>
      </div>
      <div class="rowIcon">
        <a-row type="flex" justify="start" class="rowIconRow">
          <a-col :span="3" :offset="6">
            <img src="../img/hong.svg" alt="">
            <span>紧急:2</span>
          </a-col>
          <a-col :span="3">
            <img src="../img/cheng.svg" alt="">
            <span>重要:213</span>
          </a-col>
          <a-col :span="3">
            <img src="../img/huang.svg" alt="">
            <span>次要:213</span>
          </a-col>
          <a-col :span="3">
            <img src="../img/lan.svg" alt="">
            <span>一般:0</span>
          </a-col>
        </a-row>
      </div>
    </div>
    <div class="tableBox">
      <a-table
        :columns="columns"
        :data-source="data"
        bordered
        :pagination="false"
        class="custom-table"
        :rowClassName="() => { return 'rowClass' }">
      </a-table>
    </div>
  </div>
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
const columnsBig = [
  {
    title: '级别',
    dataIndex: 'level',
    align: 'center',
    width: 88
  },
  {
    title: '创建时间',
    dataIndex: 'CreationTime',
    align: 'center',
    width: 88
  },
  {
    title: '客户名称',
    dataIndex: 'name',
    align: 'center',
    width: 88
  },
  {
    title: '告警对象',
    dataIndex: 'AlarmObject',
    className: 'AlarmObjectClass',
    align: 'center',
    width: 88
  },
  {
    title: '告警事件',
    dataIndex: 'Alarm',
    align: 'center',
    width: 88
  },
  {
    title: '注意负责人',
    dataIndex: 'Head',
    align: 'center',
    width: 88
  },
  {
    title: '处理人',
    dataIndex: 'Processors',
    align: 'center',
    width: 88
  },
  {
    title: '状态',
    dataIndex: 'State',
    align: 'center',
    width: 88
  }
]
const dataBig = [
  {
    key: '1',
    level: '提醒',
    CreationTime: '2023-02-07 17:39:33',
    name: '中国交建（海外组网',
    AlarmObject: 'cccceh-2012200245-AFCF7B0DC0-1_wan1--厦门数据中心（中交融合项目）-LW3007V4-2x10GE-GM_WAN',
    Alarm: 'Policy Bypass',
    Head: 'wangha',
    Processors: '系统',
    State: '待处理'
  },
  {
    key: '2',
    level: '提醒',
    CreationTime: '2023-02-07 17:39:33',
    name: '中国交建（海外组网',
    AlarmObject: 'cccceh-2012200245-AFCF7B0DC0-1_wan1--厦门数据中心（中交融合项目）-LW3007V4-2x10GE-GM_WAN',
    Alarm: 'Policy Bypass',
    Head: 'wangha',
    Processors: '系统',
    State: '待处理'
  },
  {
    key: '3',
    level: '提醒',
    CreationTime: '2023-02-07 17:39:33',
    name: '中国交建（海外组网',
    AlarmObject: 'cccceh-2012200245-AFCF7B0DC0-1_wan1--厦门数据中心（中交融合项目）-LW3007V4-2x10GE-GM_WAN',
    Alarm: 'Policy Bypass',
    Head: 'wangha',
    Processors: '系统',
    State: '待处理'
  },
  {
    key: '4',
    level: '提醒',
    CreationTime: '2023-02-07 17:39:33',
    name: '中国交建（海外组网',
    AlarmObject: 'cccceh-2012200245-AFCF7B0DC0-1_wan1--厦门数据中心（中交融合项目）-LW3007V4-2x10GE-GM_WAN',
    Alarm: 'Policy Bypass',
    Head: 'wangha',
    Processors: '系统',
    State: '待处理'
  },
  {
    key: '5',
    level: '提醒',
    CreationTime: '2023-02-07 17:39:33',
    name: '中国交建（海外组网',
    AlarmObject: 'cccceh-2012200245-AFCF7B0DC0-1_wan1--厦门数据中心（中交融合项目）-LW3007V4-2x10GE-GM_WAN',
    Alarm: 'Policy Bypass',
    Head: 'wangha',
    Processors: '系统',
    State: '待处理'
  },
  {
    key: '6',
    level: '警告',
    CreationTime: '2023-02-07 17:39:33',
    name: '中国交建（海外组网',
    AlarmObject: 'cccceh-2012200245-AFCF7B0DC0-1_wan1--厦门数据中心（中交融合项目）-LW3007V4-2x10GE-GM_WAN',
    Alarm: 'Policy Bypass',
    Head: 'wangha',
    Processors: '系统',
    State: '待处理'
  },
  {
    key: '7',
    level: '警告',
    CreationTime: '2023-02-07 17:39:33',
    name: '中国交建（海外组网',
    AlarmObject: 'cccceh-2012200245-AFCF7B0DC0-1_wan1--厦门数据中心（中交融合项目）-LW3007V4-2x10GE-GM_WAN',
    Alarm: 'Policy Bypass',
    Head: 'wangha',
    Processors: '系统',
    State: '待处理'
  }
]
const data = [
  {
    key: '1',
    name: '厦门数据中心（中交融合项目）-LW3007V4-2x10GE-GM_WAN',
    time: '2023-02-07 17:39:33',
    AlarmTime: '14s',
    Alarmlevel: '提醒',
    State: '待处理'
  },
  {
    key: '2',
    name: '厦门数据中心（中交融合项目）-LW3007V4-2x10GE-GM_WAN',
    time: '2023-02-07 17:39:33',
    AlarmTime: '14s',
    Alarmlevel: '提醒',
    State: '待处理'
  },
  {
    key: '3',
    name: '厦门数据中心（中交融合项目）-LW3007V4-2x10GE-GM_WAN',
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
      columns,
      dataBig,
      columnsBig,
      visible: false,
      selectOptions1: [
        { label: 'Jack', value: 'jack' },
        { label: 'Lucy', value: 'lucy' },
        { label: 'Disabled', value: 'disabled' },
        { label: 'Yiminghe', value: 'Yiminghe' }
      ],
      selectOptions2: [
        { label: 'Jack', value: 'jack' },
        { label: 'Lucy', value: 'lucy' },
        { label: 'Disabled', value: 'disabled' },
        { label: 'Yiminghe', value: 'Yiminghe' }
      ],
      selectTime: [
        { label: '最近十五分钟', value: 'minute' },
        { label: '最近一小时', value: 'hour' },
        { label: '最近一天', value: 'days' }
      ],
      selectedValue1: undefined,
      selectedValue2: undefined,
      selectedValue3: undefined,
      selectedTime: undefined
    }
  },
  methods: {
    showModal () {
      this.visible = true
    },
    handleOk (e) {
      console.log(e)
      this.visible = false
    },
    handleChange1 (value) {
      console.log(`selected ${value}`)
    },
    handleChange2 (value) {
      console.log(`selected ${value}`)
    },
    handleChange3 (value) {
      console.log(`selected ${value}`)
    },
    handleChange4 (value) {
      console.log(`selected ${value}`)
    }
  }
}
</script>
<style lang="less">
.tableTop{
  height: 100%;
  background-color: #000;
  .iconTop{
    margin-right: 15px;
    img{
      margin:0 15px;
      width: 35px;
      //height: 36px;
    }
    padding: 10px 0 0 0;
    .SpanText{
      line-height: 100%;
    }
    button{
      border:none;
      background-color: #000;
      float: right;
    }

  }
  .rowIcon{
    .rowIconRow{
      height: 30px;
    }

  }

}
.tableBox{
  border:10px solid #000;
  table{
    height: 267px;
    background-color: #000000;
    color: #FFFFFF;
    border:1px solid rgb(21,112,170) !important;

  }

  .custom-table .ant-table-thead > tr > th {
    border-color: rgb(21,112,170);
    //border: 3px solid blue;
    background-color: #000;
    color: #fff;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .rowClass>td {
    border-right: 1px solid rgb(21,112,170) !important;
    border-bottom: 1px solid rgb(21,112,170) !important;

  }
  //在鼠标悬浮时背景色展示在当前项非当前行
  .ant-table-tbody > tr > td {
    background: transparent !important;
    padding: 5px;
  }

  .ant-table-tbody  tr td:hover{
    background: transparent !important;
  }
}
.modal-custom-table{
  .AlarmObjectClass{
    padding: 2px !important;
  }
  .ant-table-thead>tr{
    .ant-table-column-title{
      font-weight: 650 !important;
      font-size: 16px !important;
      color: #B0B0B0 !important;
    }
  }
  .ant-table-tbody{
    color: #000;
  }
}
</style>
