/**
* 告警列表专属配置
* Author: dong xing
* Date: 2020/4/7
* Time: 10:38
* Email: dong.xing@outlook.com
*/
import { AlarmListProps } from './index'

export default class AlarmListProprietaryConfig {
  constructor ({
    props = {
      styleConfig: {
        button: {
          backgroundColor: 'rgba(227,227,227,1)',
          color: 'rgba(51,51,51,1)'
        },
        header: {
          backgroundColor: 'rgba(240,240,240,1)',
          color: 'rgba(80,80,80,1)',
          fontSize: '12px',
          fontWeight: 'normal'
        },
        rows: {
          backgroundColor: {
            odd: 'rgba(230,230,230,1)',
            even: 'rgba(220,220,220,1)'
          },
          color: 'rgba(112,116,120,1)',
          fontSize: '12px',
          fontWeight: 'normal'
        },
        align: 'left'
      }
    }
  }) {
    this.props = new AlarmListProps(props)
  }

  /**
   * 映射配置
   */
  getOption () {
    return { ...this.props }
  }
}
