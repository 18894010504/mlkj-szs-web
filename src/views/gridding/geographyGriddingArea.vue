<template>
  <div class="mapView">
    <div class="head">
      <!--<el-row class="headRow" :gutter="10">-->
        <!--
                <el-col :span="3">
          <el-select class="formOption" filterable @visible-change="(type) => { !type && addPolygonList('province', province.value) }" v-model="province.value" placeholder="省">
            <el-option
              size="small"
              v-for="item in province.list"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
                  </el-col>

        <el-col :span="3">
          <el-select class="formOption" filterable @visible-change="(type) => { !type && addPolygonList('city', city.value) }" v-model="city.value" placeholder="市">
            <el-option
              size="small"
              v-for="item in city.list"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        <el-col :span="10">
          <el-select class="formOption" filterable @visible-change="(type) => { !type && addPolygonList('district', district.value) }" v-model="district.value" placeholder="区">
            <el-option
              size="small"
              v-for="item in district.list"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-select class="formOption" filterable @visible-change="(type) => { !type && addPolygonList('street', street.value) }" v-model="street.value" placeholder="街道">
            <el-option
              size="small"
              v-for="item in street.list"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="12" >
          <div class="atPitch">
            <el-button :type="atPitch.name?'primary':''">
              当前选择: {{atPitch.name || '未选择区域'}}
            </el-button>
          </div>
        </el-col>-->
      <!--</el-row>-->
      <el-row :gutter="5">
        <el-col :span="10">
          <el-button @click="setPolygon()" :type="editable?'':'primary'" class="btn">
            {{editable ? '修改区域' : '保存修改'}}
          </el-button>
        </el-col>
        <el-col :span="7">
          <el-button @click="addPolygon()" :type="addShow?'':'primary'" class="btn">
            {{addShow ? '新增' : '保存'}}
          </el-button>
        </el-col>
        <el-col :span="7">
          <el-button @click="elePolygon()" :type="deleteShow?'':'primary'" class="btn">
            {{deleteShow ? '删除' : '保存'}}
          </el-button>
        </el-col>
        <el-col :span="7">
          <el-color-picker v-model="atPitchColor" @change="Color()"></el-color-picker>
        </el-col>
      </el-row>
      <div class="streetList">
        <div v-for="(item, index) in polygonList"
             :key="item.vid + index"
             :class="street.value==item.vid?'bindStreet':''"
             @click="streetClick(item)"
             :style="`border-left: 25px solid ${item.fillColor};border-bottom: 1px solid ${item.fillColor}`"
             class="street">
          {{item.extData.name}}-{{index}}
        </div>
      </div>
    </div>
    <el-amap vid="amap1" :zoom="map.zoom" :amap-manager="map.amapManager" :center="map.center" ref="map" class="amap-demo">
      <el-amap-polygon
        :bubble="true"
        :vid="newPolygon.vid"
        ref="polygon_one"
        :path="newPolygon.path"
        :editable="true"
        :draggable="true"
        strokeStyle="dashed"
        :strokeOpacity="newPolygon.strokeOpacity"
        :strokeWeight="1"
        :fillOpacity="newPolygon.fillOpacity"
        :fillColor="newPolygon.fillColor"
        :strokeColor="newPolygon.strokeColor"></el-amap-polygon>
      <el-amap-polygon
        v-for="(pol, index) in polygonList"
        :key="index"
        :extData="pol.extData"
        :ref="pol.vid"
        :vid="pol.vid"
        :editable="pol.editable"
        :zIndex="pol.zIndex"
        :strokeOpacity="pol.strokeOpacity"
        :strokeStyle="pol.strokeStyle"
        :strokeColor="pol.fillColor"
        :fillColor="pol.fillColor"
        :fillOpacity="pol.fillOpacity"
        :draggable="pol.editable"
        :strokeWeight="pol.strokeWeight"
        :path="pol.path"
        :bubble="pol.bubble"
        :events="{ click: (res) => { elePolygon(res, index) } }"></el-amap-polygon>
      <el-amap-polygon
        v-for="(pol, index) in polList"
        :key="'pol'+index"
        ref="polygon"
        :vid="'polygon'+index"
        :path="pol.path"
        :zIndex="pol.zIndex"
        :bubble="pol.bubble"
        :extData="pol.extData"
        :events="map.events"
        :fillColor="pol.fillColor"
        :fillOpacity="pol.fillOpacity"
        :strokeStyle="pol.strokeStyle"
        :strokeColor="pol.strokeColor"
        :strokeWeight="pol.strokeWeight"
        :strokeOpacity="pol.strokeOpacity"></el-amap-polygon>
    </el-amap>
  </div>
</template>

<script>
import { amapManager } from 'vue-amap'
import { randomColor } from '../../utils/tools'
export default {
  name: 'geographyGriddingArea', // 地理行政区域
  data () {
    return {
      deleteShow: true,
      editable: true,
      addShow: true,
      map: {
        zoom: 12,
        center: [103.855433, 36.073115],
        amapManager: amapManager,
        events: {
          click: this.mapClick
        }
      },
      polygonList: [],
      polList: [],
      polygon: {
        extData: {},
        zIndex: 100,
        strokeColor: '#3c3c3c',
        strokeWeight: 1,
        strokeOpacity: 1,
        fillColor: '#bababa',
        fillOpacity: 0.05,
        strokeStyle: 'solid',
        path: [],
        bubble: true
      },
      polygonOne: {
        extData: {},
        vid: 0,
        editable: false,
        zIndex: 1000,
        strokeOpacity: 1,
        strokeWeight: 1,
        strokeStyle: 'solid',
        strokeColor: '#00b4ff',
        fillColor: '#00b4ff',
        fillOpacity: 0.1,
        path: [],
        bubble: true
      },
      newPolygon: {
        extData: {},
        vid: 0,
        editable: false,
        zIndex: 0,
        strokeOpacity: 1,
        fillColor: '#ff6300',
        fillOpacity: 0.1,
        strokeStyle: 'dashed',
        path: [],
        bubble: true
      },
      province: {
        list: [
          {
            id: '1000001',
            name: '甘肃省'
          }
        ],
        value: '1000001'
      },
      city: {
        list: [
          {
            id: '1000002',
            name: '兰州市'
          }
        ],
        value: '1000002'
      },
      district: {
        list: [],
        value: ''
      },
      street: {
        list: [],
        value: ''
      },
      atPitch: '',
      atPitchColor: ''
    }
  },
  watch: {
    'city.value' (val) {
      this.getLowerList(val, 'district')
    }
  },
  methods: {
    Color () {
      if (this.atPitch) {
        let color = this.atPitchColor
        let arr = []
        let off = true
        this.polygonList.forEach(res => {
          if (res.fillColor === this.atPitchColor) {
            off = false
          }
          if (res.vid === this.atPitch) {
            res.fillColor = color
          }
        })
        this.$refs[this.atPitch].forEach(e => {
          if (e.$$getInstance().Uh.path.length) {
            arr.push(this.sendData(e.$$getInstance().Uh.path))
          }
        })
        let text = arr.join('|')
        if (off) {
          this.sendPolygon(this.atPitch, text, 4, '修改成功', () => {
          }, color)
        }
      }
    }, // 改变背景颜色
    streetClick (street) {
      this.atPitchColor = street.fillColor
      this.street.value = street.vid
      this.atPitch = street.vid
      for (let e of this.polygonList) {
        if (e.vid === street.vid) {
          e.fillOpacity = 0.6
        } else {
          e.fillOpacity = 0.1
        }
      }
    }, // 街道点击事件
    elePolygon (res, index) {
      if (res) {
        if (this.deleteShow) {
          this.streetClick(this.polygonList[index])
        } else {
          this.$confirm(`确认删除${this.polygonList[index].extData.name}-${index}？`)
            .then(_ => {
              let id = this.polygonList[index].vid
              this.polygonList.splice(index, 1)
              let arr = []
              this.polygonList.forEach(e => {
                if (e.vid === id) {
                  arr.push(this.sendData(e.path))
                }
              })
              let text = arr.join('|')
              this.sendPolygon(id, text, 4, '删除成功', () => {}, this.polygonList[index].fillColor)
            })
            .catch(_ => {})
        }
      } else {
        if (this.deleteShow) {
          this.deleteShow = false
        } else {
          this.deleteShow = true
        }
      }
    }, // 删除区域
    addPolygon () {
      let time = this.atPitch
      if (time) {
        if (this.addShow) {
          this.addShow = false
        } else {
          let text = this.sendData(this.newPolygon.path)
          if (!text) {
            return
          }
          let arr = [text]
          this.$refs[time].forEach(e => {
            if (e.$$getInstance().Uh.path.length) {
              arr.push(this.sendData(e.$$getInstance().Uh.path))
            }
          })
          let textert = arr.join('|')
          this.sendPolygon(time, textert, 4, '添加成功', () => {
            this.newPolygon.path = []
          }, this.$refs[time][0].fillColor)
        }
      } else {
        this.$message({
          message: '请选择地区',
          type: 'warning'
        })
      }
    }, // 添加区域
    setPolygon () {
      let time = this.atPitch
      if (this.editable) {
        this.editable = false
        if (time) {
          this.polygonList.forEach(res => {
            if (res.vid === time) {
              res.editable = true
            }
          })
        } else {
          this.$message({
            message: '请选择地区',
            type: 'warning'
          })
        }
        // if (time.length) {
        //   time.forEach(e => {
        //     e.editable = true
        //   })
        // } else {
        //   this.$message({
        //     message: '该地区暂未勾选区域',
        //     type: 'warning'
        //   })
        //   this.editable = true
        // }
      } else {
        let arr = []
        let color = ''
        this.$refs[time].forEach(e => {
          color = e.fillColor
          if (e.$$getInstance().Uh.path.length) {
            arr.push(this.sendData(e.$$getInstance().Uh.path))
          }
        })
        let text = arr.join('|')
        this.sendPolygon(time, text, 4, '修改成功', () => {
          this.polygonList.forEach(res => {
            if (res.vid === time) {
              res.editable = true
            }
          })
          // time.forEach(res => {
          //   res.editable = false
          // })
        }, color)
      }
    }, // 修改区域
    sendData (data) {
      let arrtext = ''
      if (data.length >= 3) {
        let arr = []
        data.forEach(time => {
          arr.push([time.lng, time.lat])
        })
        let text = JSON.stringify(arr)
        arrtext = text.replace(/\],\[/g, ';')
        arrtext = arrtext.slice(2, -2)
      } else {
        this.$message({
          message: '请至少选择3个点',
          type: 'warning'
        })
      }
      return arrtext
    }, // 转换地图数组
    sendPolygon (id, polyline, level, text, fn, color) {
      this.sendAxios({
        url: '/api/map/area/saveForm',
        method: 'post',
        data: {
          id: id,
          polyline: polyline,
          level: level,
          color: color || ''
        }
      })
        .then(e => {
          this.$message({
            message: text,
            type: 'success',
            showClose: this
          })
          this.resetBtn()
          this.getLowerList()
          fn && fn()
        })
    }, // 保存区域
    resetBtn () {
      this.editable = true
      this.addShow = true
      this.deleteShow = true
      this.polygonList.forEach(res => {
        res.editable = false
      })
      this.newPolygon.path = []
    }, // 重置按钮
    mapClick (res) {
      if (!this.addShow) {
        this.newPolygon.path.push(res.lnglat)
      }
    }, // 地图点击事件
    addPolygonList (name, id) {
      let polygon = {}
      this.resetBtn()
      this[name].list.forEach(time => {
        if (time.id === id) {
          polygon = time
        }
      })
      this.paintingPolygon(polygon)
    }, // 选中事件
    findPolygon () {
      let res = []
      if (this.atPitch.id) {
        for (let e of this.polygonList) {
          if (e.vid === this.atPitch.id) {
            e.fillOpacity = 0.5
            res.push(e)
          } else {
            e.fillOpacity = 0.1
          }
        }
      } else {
        this.$message({
          message: '请选择区域',
          type: 'warning'
        })
        this.resetBtn()
      }
      return res
    }, // 选中改变颜色
    paintingPolygon (polygon) {
      if (polygon.level === 3) {
        this.polList = []
        this.drawMap(polygon)
        this.atPitch = {}
        this.getLowerList(polygon.id, 'street', res => {
          this.polygonList = []
          res.forEach(e => {
            this.drawMap(e)
          })
        })
      }
      if (polygon.level === 4) {
        this.atPitch = polygon
        this.findPolygon(polygon)
      }
    }, // 当前选中
    drawMap (polygon) {
      let mapArr = polygon.polyline.split('|')
      // polygon.fillColor = randomColor()
      mapArr.forEach((time, index) => {
        let arrtext = '[[' + time.replace(/;/g, '],[') + ']]'
        let arr = JSON.parse(arrtext)
        if (polygon.level === 3) {
          let data = Object.assign({}, this.polygon)
          data.path = arr
          this.polList.push(data)
        }
        if (polygon.level === 4) {
          let data = Object.assign({}, this.polygonOne)
          data.extData = {
            name: polygon.name
          }
          data.vid = polygon.id
          if (polygon.color) {
            data.fillColor = polygon.color
          } else {
            data.fillColor = randomColor()
          }
          if (arr.length > 1) {
            data.path = arr
          }
          this.polygonList.push(data)
        }
      })
    }, // 绘画地图
    getLowerList (id, type, fn) {
      this.sendAxios({
        url: '/api/map/area/getStreets',
        method: 'post'
      })
        .then(e => {
          this.polygonList = []
          if (e.length) {
            e.forEach(res => {
              this.drawMap(res)
            })
            // this.paintingPolygon(e[0])
            // this.district.list = e
            // this.district.value = e[0].id
          }
        })
      // this.sendAxios({
      //   url: '/api/map/area/lowerList',
      //   method: 'post',
      //   data: {
      //     id: id
      //   }
      // })
      //   .then(e => {
      //     this[type].list = e
      //     if (e.length) {
      //       this.paintingPolygon(e[0])
      //       this[type].value = e[0].id
      //     } else {
      //       this[type].value = ''
      //     }
      //     fn && fn(e)
      //   })
    } // 查询行政区
  },
  created () {
    this.sendAxios({
      url: '/api/map/area/getDistrict',
      method: 'post'
    })
      .then(res => {
        let mapArr = res.polyline.split('|')
        mapArr.forEach((time, index) => {
          let arrtext = '[[' + time.replace(/;/g, '],[') + ']]'
          let arr = JSON.parse(arrtext)
          let data = Object.assign({}, this.polygon)
          data.path = arr
          this.polList.push(data)
        })
      })
    // this.getLowerList(1000002, 'district')
    this.getLowerList()
  }
}
</script>

<style scoped lang="scss">
  .streetList {
    width: 200px;
    margin-top: 20px;
    max-height: 600px;
    overflow: auto;
    box-shadow: 0px 0px 5px 0px #666666;
    position: fixed;
    .street {
      border-bottom: 1px solid #666666;
      padding: 10px 20px;
      background-color: white;
    }
    .bindStreet {
      background-color: #c8c6c9;
    }
  }
  .atPitch {
    display: inline-block;
  }
  .head {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1000;
    padding: 5px 10px;
    .btn {
      width: 100%;
    }
    .headRow {
      padding-bottom: 10px;
    }
    .formOption {
      width: 100%;
    }
  }
  .formMiddle {
    vertical-align: middle;
  }
  .polygonList {
    position: fixed;
    right: 0;
    top: 0;
    bottom: 0;
    height: 500px;
    max-width: 200px;
    margin: auto;
    padding: 10px;
    background-color: rgba(255,255,255,0.8);
    overflow: auto;
    .polygon{
      border-radius: 5px;
      padding: 10px 20px;
      margin-bottom: 10px;
    }
    h3 {
      margin-bottom: 10px;
    }
  }
  .btns {
    position: fixed;
    top: 0;
    right: 0;
    margin-right: 100px;
    width: 200px;
    padding-top: 20px;
    padding-right: 20px;
  }
  .mapView {
    width: 100%;
    height: 100%;
  }
</style>
