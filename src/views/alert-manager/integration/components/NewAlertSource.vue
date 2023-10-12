<template>
  <div class="container">
    <div class="item" style="background: white; height: 1060px">
      <div style="margin-top: 20px; margin-left: 20px; margin-right: 20px">
        <div class="fakeContainer">
          <div style="grid-column-start:1;grid-column-end:3;font-size: 20px">
            <a @click="back"><a-icon type="left"/>&nbsp;{{ record!==undefined&&record.id !== null?'修改':'新建' }}告警源&nbsp;/&nbsp;{{ platform.name }}</a>
          </div>
          <div style="grid-column: 8/9;place-self:end;width: 100px;">
            <a-button @click="back">取消</a-button>
          </div>
        </div>
        <a-divider style="background: rgb(236,236,236)" />
        <div><AlertSourceForm :record="record" :platform="platform.id"/></div>
      </div>
    </div>
    <div class="item"/>
    <div class="item rightContainer" style="background: white;padding: 20px;place-content: space-between">
      <center style="">
        <img :src="platform.url" width="100px" height="100px"/>
      </center>
      <p style="margin: 0px 50px 0px 50px">
        {{ this.platform.remark?this.platform.remark:defaultRemark }}
      </p>
      <div style="">
        <h4 name="mapping1" style="margin-top: 30px">监控级别对应关系</h4>
        <a-table :columns="platformMapping" :data-source="data1" :pagination="false" :row-key="(record,index)=>index" bordered></a-table>
      </div>
      <div style="">
        <h4>EventId对应关系</h4>
        <a-table :columns="platformMapping1" :data-source="data2" :pagination="false" :row-key="(record,index)=>index" bordered></a-table>
      </div>
    </div>
  </div>
</template>

<script>

import AlertSourceForm from '../components/AlertSourceForm'
import SvgIcon from '@/components/SvgIcon/index'
const defaultRemark = 'Pigoss 提供了一个网络和告警源监控的开源解决方案，它支持数百万的监控指标。安装Pigoss 告警源可以将 Pigoss中的告警接入到 Cloud Alert 中来，自动帮您压缩冗余告警，避免告警风暴，让您更快定位和解决问题。'
export default {
  name: 'NewAlertSource',
  components: { SvgIcon, AlertSourceForm },
  props: {
  },
  computed: {
    platformMapping () {
      return [
        {
          title: '统一监控平台',
          dataIndex: 'here',
          align: 'center'
        },
        {
          title: this.platform.name + '(Priority)',
          dataIndex: 'there',
          align: 'center'
        }
      ]
    },
    platformMapping1 () {
      return [
        {
          title: '统一监控平台',
          dataIndex: 'here',
          align: 'center'
        },
        {
          title: this.platform.name,
          dataIndex: 'there',
          align: 'center'
        }
      ]
    }
  },
  methods: {
    back () {
      this.$router.push('platform')
    },
    loadPlatformList () {
      console.log(this.platform)
      const plat = this.platform
      if (plat.levelRelation !== null && plat.levelRelation !== {}) {
        const dataList = []
        Object.keys(plat.levelRelation).forEach(level => {
          dataList.push({
            here: level,
            there: plat.levelRelation[level]
          })
        })
        this.data1 = dataList
      }
    }
  },
  data () {
    const platform = this.$route.query.plat
    const record = this.$route.query.record
    return {
      platform,
      record,
      defaultRemark,
      data1: [
        { here: 'p1', there: '5' },
        { here: 'p2', there: '4' },
        { here: 'p3', there: '2,3' },
        { here: 'p4', there: '1' },
        { here: 'p5', there: '0' }
      ],
      data2: [
        { here: '告警ID\n （eventId）', there: 'eventId' }
      ]
    }
  },
  mounted () {
    this.loadPlatformList()
  }
}
</script>

<style scoped>
.container{
  display:grid;
  background-color: #F2f3f3;
  border: 1px solid #F2f3f3;
  grid-template-columns: 2fr 30px 1fr;
  grid-template-rows: repeat(1, 1fr) ;
  }
.fakeContainer{
  display:grid;
  grid-auto-columns: 1fr;
  grid-template-columns: 220px;
  grid-auto-rows: 1fr;
  /*grid-template-rows: repeat(1, 1fr) ;*/
  /*place-content: space-between;*/
}
.rightContainer{
  /*display:grid;*/
  /*grid-gap: 30px;*/
  /*grid-template-rows: repeat(4, 1fr) ;*/
  /*grid-auto-rows: 1fr;*/
  /*grid-template-columns: 220px;*/
}
.item{
  /*border: 1px solid #6E2D9F;*/
}
</style>
