/**
* 元素工厂
* Author: dong xing
* Date: 2019/11/19
* Time: 5:36 下午
* Email: dong.xing@outlook.com
*/
import AlarmListElement from '../element/AlarmListElement'
import ListElement from '../element/ListElement'
import UpsElement from '@/model/element/UpsElement'
import SelectElement from '@/model/element/SelectElement'
import MoreElement from '@/model/element/MoreElement'
import TabElement from '@/model/element/TabElement'
import NewAlarmElement from '@/model/element/NewAlarmElement'
import TimeSelectElement from '@/model/element/TimeSelectElement'
import SDMapElement from '@/model/element/SDMapElement'
import ToLineElement from '@/model/element/ToLineElement'
import PercentElement from '@/model/element/PercentElement'
import DepartmentElement from '@/model/element/DepartmentElement'
import MVMapElement from '@/model/element/MVMapElement'
import ReportPreviewElement from '@/model/element/ReportPreviewElement'
// 添加海外sdw：3需要新建一个文件继承
import HwsdwElement from '@/model/element/HwsdwElement'

export default class ElementFactory {
  static create (type, { widget, element, onlyShow = false }) {
    switch (type) {
      case 'AlarmList':
        return new AlarmListElement({ widget, element, onlyShow })
      case 'List':
        return new ListElement({ widget, element, onlyShow })
      case 'NewAlarm':
        return new NewAlarmElement({ widget, element, onlyShow })
      case 'UPS':
        return new UpsElement({ widget, element, onlyShow })
      case 'Select':
        return new SelectElement({ widget, element, onlyShow })
      case 'More':
        return new MoreElement({ widget, element, onlyShow })
      case 'Tab':
        return new TabElement({ widget, element, onlyShow })
      case 'TimeSelector':
        return new TimeSelectElement({ widget, element, onlyShow })
      case 'SDMap':
        return new SDMapElement({ widget, element, onlyShow })
      case 'MMp':
        return new MVMapElement({ widget, element, onlyShow })
      case 'ToLine':
        return new ToLineElement({ widget, element, onlyShow })
      case 'Percent':
        return new PercentElement({ widget, element, onlyShow })
      case 'Department':
        return new DepartmentElement({ widget, element, onlyShow })
      case 'ReportPreview':
        return new ReportPreviewElement({ widget, element, onlyShow })
      case 'Hwsdw':
        // 添加海外sdw：2
        return new HwsdwElement({ widget, element, onlyShow })
      default:
        return null
    }
  }
}
