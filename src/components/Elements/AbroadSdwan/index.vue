<template>
  <div class="tembox">
    <a-row type="flex" class="flexBox">
      <a-col :span="6" :order="1" class="flexBox-col">
        <img src="./img/u2.png" alt="">
        <span>Global视图</span>
      </a-col>
      <a-col :span="6" :order="2" class="flexBox-col2">
        <div class="flexBox-col2-div">
          <button
            :style="button1Style"
            @click="toggleButton(1)"
          >
            CPE
          </button>
          <button
            :style="button2Style"
            @click="toggleButton(2)"
          >
            Moblie
          </button>
        </div>

      </a-col>
      <a-col :span="5" :order="3">
        3 col-order-2
      </a-col>
      <a-col :span="7" :order="4">
        <a-select
          default-value="lucy"
          style="width: 380px;padding-top: 25px;font-size: 13px"
          @change="handleChange"
          :dropdownClassName="customDropdownClass"
          size="small">
          <a-select-option value="jack" :style="{ fontSize: '13px' }">
            厦门数据中心（海外接入区）CPE1-LW7009-8xGE-8x10GE-GM
          </a-select-option>
          <a-select-option value="lucy" :style="{ fontSize: '13px' }">
            北京（beijing)
          </a-select-option>
        </a-select>

        <a-select
          label-in-value
          :default-value="{ key: 'hour' }"
          style="width: 120px;margin-left: 20px"
          size="small"
          @change="handleChange"
        >
          <a-select-option value="hour">
            一小时内
          </a-select-option>
          <a-select-option value="days">
            一天内
          </a-select-option>
          <a-select-option value="week">
            一周内
          </a-select-option>
          <a-select-option value="month">
            一个月内
          </a-select-option>
        </a-select>
      </a-col>
    </a-row>
    <div class="echats-big">
      <a-row type="flex" justify="space-between" align="middle" class="row0-1">
        <a-col :span="6" class="row1-1">
          <a-row class="row1-1-1">
            <a-col :span="24">
              <div class="height-310">
                <TrafficEcharts></TrafficEcharts>
              </div>
            </a-col>
          </a-row>
          <a-row class="row1-1-2">
            <a-col :span="24">
              <div class="height-310">
                <TrafficEcharts></TrafficEcharts>
              </div>
            </a-col>
          </a-row>
        </a-col>

        <a-col :span="12" class="row1-2">
          <div class="height-630">
            <EarthEcharts></EarthEcharts>
          </div>
        </a-col>

        <a-col :span="6" class="row1-3">
          <a-row class="row1-3-1">
            <a-col :span="24">
              <p class="height-310">
                <TrafficEcharts></TrafficEcharts>
              </p>
            </a-col>
          </a-row>
          <a-row class="row1-3-2">
            <a-col :span="24">
              <p class="height-310">
                <TrafficEcharts></TrafficEcharts>
              </p>
            </a-col>
          </a-row>
        </a-col>
      </a-row>

    </div>

    <div class="echats-botton">
      <a-row type="flex" justify="space-between" align="middle" class="row3">
        <a-col :span="6" class="row3-1">
          <a-row class="row3-1-1">
            <a-col :span="24">
              <div class="height-360">
                <TransverseEcharts></TransverseEcharts>
              </div>
            </a-col>
          </a-row>
        </a-col>

        <a-col :span="12" class="row3-2">
          <div class="height-360" >
            <TableEcharts></TableEcharts>
          </div>
        </a-col>

        <a-col :span="6" class="row3-3">
          <a-row class="row3-3-1">
            <a-col :span="24">
              <div class="height-360">
                <TrafficEcharts></TrafficEcharts>
              </div>
            </a-col>
          </a-row>
        </a-col>
      </a-row>

    </div>
  </div>
</template>

<script>

import TrafficEcharts from './TrafficEcharts/TrafficEcharts'
import TransverseEcharts from './TrafficEcharts/TransverseEcharts'
import EarthEcharts from './TrafficEcharts/EarthEcharts'
import TableEcharts from './TrafficEcharts/TableEcharts'

export default {
  name: 'AbroadSdwan',
  data () {
    return {
      selectedButton: 1,
      customDropdownClass: 'custom-dropdown'
    }
  },
  components: {
    TrafficEcharts, // 注册子组件
    EarthEcharts,
    TransverseEcharts,
    TableEcharts
  },
  computed: {
    button1Style () {
      return {
        width: '100px',
        height: '45px',
        border: this.selectedButton === 1 ? '2px solid rgb(4,87,185)' : '2px solid black'
      }
    },
    button2Style () {
      return {
        width: '100px',
        height: '45px',
        border: this.selectedButton === 2 ? '2px solid rgb(4,87,185)' : '2px solid black'
      }
    }
  },

  methods: {
    toggleButton (button) {
      this.selectedButton = button
    },
    handleChange (value) {
      console.log(value) // { key: "lucy", label: "Lucy (101)" }
    }
  }
}
</script>

<style scoped lang="less">
.tableTop{
  height: 100%;
  background-color: #000;
  .iconTop{
    img{
      margin:0 15px;
      width: 35px;
      //height: 36px;
    }
    padding: 10px 0 0 0;
    .SpanText{
      line-height: 100%;
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
}
//
.tembox {
  color:#fff;
  width: 1920px;
  height: 1080px;
  background-color: rgba(24, 24, 24, 1);
}

.flexBox {
  padding: 5px 0 0px 10px;
  background-color: rgba(0, 0, 0, 1);

  .flexBox-col {
    display: flex;
    align-items: center;

    img {
      width: 70px;
      height: 57px;
      //vertical-align: middle
    }

    span {
      font-size: 32px;
      color: #FFFFFF;
      font-family: 'PingFangSC-Semibold', 'PingFang SC Semibold', 'PingFang SC', sans-serif;
      font-weight: 650;
    }
  }

  .flexBox-col2 {
    button {
      width: 100px;
      height: 55px;
      font-weight: 650;
      font-size: 20px;
      color: #FFFFFF;
      background-color: #000000;
      border-radius: 5px;
    }

    :nth-child(1) {
      margin-right: 50px;
    }

    .flexBox-col2-div {
      padding-top: 20px;
    }
  }

  /* 使用自定义样式来调整下拉菜单的样式 */

  .custom-dropdown {
    /* 添加其他样式属性以自定义下拉菜单的外观 */
  }
}

.echats-big {
  margin: 10px;

  .row0-1 {
    height: 630px;
    //margin-top: 10px;
    .row1-1{
      border-right:5px solid rgba(24, 24, 24, 1);
      .row1-1-1{
        height: 320px;
        .height-310{
          margin-bottom: 0;
        }
      }
      .row1-1-2{
        height: 310px;
      }
    }

    .row1-2{
      border-right:5px solid rgba(24, 24, 24, 1);
      border-left:5px solid rgba(24, 24, 24, 1);
      .height-630{
        margin: 0;
      }
    }
    .row1-3{
      border-left:5px solid rgba(24, 24, 24, 1);
      .row1-3-1{
        height: 320px;
        .height-310{
          margin-bottom: 0;
        }
      }
      .row1-3-2{
        height: 310px;
        .height-310{
          margin-bottom: 0;
        }
      }
    }
  }

}
//  底部
.echats-botton{
  margin: 0 10px;
  .row3{
    height: 360px;
    .row3-1{
      border-right:5px solid rgba(24, 24, 24, 1);
    }
    .row3-2{
      padding: 0 5px;
    }
    .row3-1-1{
      //margin-left: 10px;
    }
    .row3-3{
      border-left:5px solid rgba(24, 24, 24, 1);
    }
  }
}
</style>
