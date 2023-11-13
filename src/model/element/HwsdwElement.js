/*
 * @Author: xcs
 * @Date: 2021-03-16 16:54:57
 * @LastEditTime: 2021-03-16 17:27:47
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web\src\model\element\ListElement.js
 */
/**
 * ups
 */
import _ from 'lodash'
import Element from '@/model/element/index'

export default class DepartmentElement extends Element {
  async mappingOption ({ proprietaryConfig }) {
    return _.cloneDeep({
      ...proprietaryConfig.getOption()
    })
  }
}
