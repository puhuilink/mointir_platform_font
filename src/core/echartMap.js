import echarts from 'echarts'
import chinajson from 'echarts/map/json/china.json'
import worldjson from 'echarts/map/json/world.json'
import world from 'echarts/map/js/world.js'
import china from 'echarts/map/js/china.js'

function decodePolygon (coordinate, encodeOffsets, encodeScale) {
  var result = []
  var prevX = encodeOffsets[0]
  var prevY = encodeOffsets[1]
  for (var i = 0; i < coordinate.length; i += 2) {
    var x = coordinate.charCodeAt(i) - 64
    var y = coordinate.charCodeAt(i + 1) - 64
    // ZigZag decoding
    x = (x >> 1) ^ -(x & 1)
    y = (y >> 1) ^ -(y & 1)
    // Delta deocding
    x += prevX
    y += prevY
    prevX = x
    prevY = y
    // Dequantize
    result.push([x / encodeScale, y / encodeScale])
  }
  return result
}
function decode (json) {
  if (!json.UTF8Encoding) {
    return json
  }
  var encodeScale = json.UTF8Scale
  if (encodeScale == null) {
    encodeScale = 1024
  }
  var features = json.features
  for (var f = 0; f < features.length; f++) {
    var feature = features[f]
    var geometry = feature.geometry
    var coordinates = geometry.coordinates
    var encodeOffsets = geometry.encodeOffsets
    for (var c = 0; c < coordinates.length; c++) {
      var coordinate = coordinates[c]
      if (geometry.type === 'Polygon') {
        coordinates[c] = decodePolygon(
          coordinate,
          encodeOffsets[c],
          encodeScale
        )
      } else if (geometry.type === 'MultiPolygon') {
        for (var c2 = 0; c2 < coordinate.length; c2++) {
          var polygon = coordinate[c2]
          coordinate[c2] = decodePolygon(
            polygon,
            encodeOffsets[c][c2],
            encodeScale
          )
        }
      }
    }
  }
  // Has been decoded
  json.UTF8Encoding = false
  return json
}

const data = decode(chinajson) // 这里调用的函数就是上面解密的函数
const worldAndChina = Object.assign({}, worldjson) // 原本的world还需要用 所以这里用了一个深拷贝赋值世界地图数据
worldAndChina.features = worldAndChina.features.concat(data.features) // 对，就是这么简单用concat把两者的features合并起来就可以了
echarts.registerMap('worldAndChina', worldAndChina)
