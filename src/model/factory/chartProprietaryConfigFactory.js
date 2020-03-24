/**
* 图表专有属性配置工厂
* Author: dong xing
* Date: 2019/11/19
* Time: 5:37 下午
* Email: dong.xing@outlook.com
*/
import LinesProprietaryConfig from '../config/proprietaryConfigs/LinesProprietaryConfig'
import BarProprietaryConfig from '../config/proprietaryConfigs/BarProprietaryConfig'
import TopologyProprietaryConfig from '../config/proprietaryConfigs/TopologyProprietaryConfig'
import ViewProprietaryConfig from '../config/proprietaryConfigs/ViewProprietaryConfig'
import TextsProprietaryConfig from '../config/proprietaryConfigs/TextsProprietaryConfig'
import ClockProprietaryConfig from '../config/proprietaryConfigs/ClockProprietaryConfig'
import RectProprietaryConfig from '../config/proprietaryConfigs/RectProprietaryConfig'

export default class ChartProprietaryConfigFactory {
  static create ({ type, proprietaryConfig = {} }) {
    switch (type) {
      case 'Lines':
        return new LinesProprietaryConfig(proprietaryConfig)
      case 'Bar':
        return new BarProprietaryConfig(proprietaryConfig)
      case 'Texts':
        return new TextsProprietaryConfig(proprietaryConfig)
      case 'Clock':
        return new ClockProprietaryConfig(proprietaryConfig)
      case 'Topology':
        return new TopologyProprietaryConfig(proprietaryConfig)
      case 'Rect':
        return new RectProprietaryConfig(proprietaryConfig)
      case 'ViewConfig':
        return new ViewProprietaryConfig(proprietaryConfig)
      default:
        return null
    }
  }
}
