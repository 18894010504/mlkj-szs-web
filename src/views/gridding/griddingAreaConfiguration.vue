<template>
  <el-container>
    <el-aside class="left" width="400px">
      <el-row>
        <el-col :span="12">
          <div class="conent">
            <p>
              街道列表
            </p>
            <div class="streets" :class="streets.id==streetId?'streetsPind':''" v-for="streets in streetslist" :key="streets.id" @click="getPolygon(streets)" >
              {{streets.name}}
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="conent">
            <p>
              网格列表
              <el-button size="mini" @click="addShow=false" v-if="addShow" type="primary" >保存</el-button>
              <el-button size="mini" @click="addShow=true" v-else >新增</el-button>
            </p>
            <div class="leftList">
              <el-popover
                placement="right"
                width="200"
                v-for="polygon in polygonList"
                :key="polygon.vid"
                @show="polygonShow(true, polygon)"
                @hide="polygonShow(false, polygon)"
                trigger="click">
                <div class="timeList">
                  <el-row :gutter="10">
                    <el-col>
                      <el-input style="width: 100%" size="mini" v-model="polygon.extData.name" placeholder="请输入内容">
                        <el-button slot="append" size="mini" style="background-color: white;color: black" @click="setPolygon(polygon)" >保存</el-button>
                      </el-input>
                    </el-col>
                  </el-row>
                  <el-row style="padding-top: 10px" :gutter="10">
                    <el-col>
                      <el-tooltip effect="dark" content="设定中心点" placement="right">
                        <el-button :type="polygonCenterShow?'primary':''" size="mini" style="width: 100%" @click="setPolygonCenter(polygon)">{{polygon.extData.center}}</el-button>
                      </el-tooltip>
                    </el-col>
                  </el-row>
                  <el-row style="padding-top: 10px" :gutter="10">
                    <el-col :span="12">
                      <el-switch style="width: 100%;padding: 4px 0px" class="btn" v-model="polygon.extData.look" active-text="显示"></el-switch>
                    </el-col>
                    <el-col :span="12">
                      <el-button style="width: 100%" class="btn" size="mini" @click="setColor(polygon)">改变颜色</el-button>
                    </el-col>
                  </el-row>
                  <el-row style="padding-top: 10px" :gutter="10">
                    <el-col :span="12">
                      <el-button :type="polygon.editable?'primary':''" @click="polygonEditable(polygon)" style="width: 100%" class="btn" size="mini">
                        {{polygon.editable?'保存边界':'修改边界'}}
                      </el-button>
                    </el-col>
                    <el-col :span="12">
                      <el-button style="width: 100%" class="btn" size="mini" @click="deleteModule(polygon)">删除</el-button>
                    </el-col>
                  </el-row>
                </div>
                <div slot="reference" class="time pitchTime"
                     :style="`border-bottom: 1px solid ${polygon.fillColor};border-left: 25px solid ${polygon.fillColor};`">
                  {{polygon.extData.name}}
                  <i v-show="polygon.extData.look" style="float: right;font-size: 18px" class="el-icon-view"></i>
                </div>
              </el-popover>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-aside>
    <el-main class="right">
      <div class="conent">
        <el-amap vid="amap" ref="map" class="amap-demo" expandZoomRange :defaultCursor="map.cursor" :zoom="map.zoom" :amap-manager="map.amapManager" :center="map.center" :events="map.events">
          <el-amap-polygon
            ref="polygon_one"
            :bubble="true"
            :vid="newPolygon.vid"
            :editable="newPolygon.editable"
            :draggable="newPolygon.draggable"
            :zIndex="newPolygon.zIndex"
            :strokeColor="newPolygon.strokeColor"
            :strokeOpacity="newPolygon.strokeOpacity"
            :strokeWeight="newPolygon.strokeWeight"
            :strokeStyle="newPolygon.strokeStyle"
            :fillColor="newPolygon.fillColor"
            :fillOpacity="newPolygon.fillOpacity"
            :path="newPolygon.path"
          ></el-amap-polygon>
          <el-amap-polygon
            v-for="pol in polList"
            :key="pol.vid"
            :ref="pol.vid"
            :bubble="true"
            :vid="pol.vid"
            :editable="pol.editable"
            :draggable="pol.draggable"
            :zIndex="pol.zIndex"
            :strokeColor="pol.strokeColor"
            :strokeOpacity="pol.strokeOpacity"
            :strokeWeight="pol.strokeWeight"
            :strokeStyle="pol.strokeStyle"
            :fillColor="pol.fillColor"
            :fillOpacity="pol.fillOpacity"
            :path="pol.path"
          ></el-amap-polygon>
          <el-amap-polygon
            v-for="pol in polygonList"
            v-if="pol.extData.look"
            :key="pol.vid"
            :vid="pol.vid"
            :ref="pol.vid"
            :extData="pol.extData"
            :editable="pol.editable"
            :draggable="pol.editable"
            :zIndex="1000"
            :strokeColor="pol.fillColor"
            :strokeOpacity="0.9"
            :strokeWeight="1"
            :fillColor="pol.fillColor"
            :fillOpacity="pol.fillOpacity"
            strokeStyle="solid"
            :path="pol.path"
            :events="pol.events"
          ></el-amap-polygon>
        </el-amap>
      </div>
    </el-main>
  </el-container>
</template>
<script>
import { amapManager } from 'vue-amap'
import { randomColor } from '../../utils/tools'

export default {
  name: 'griddingAreaConfiguration', // ( 网格划分 )
  data () {
    return {
      streetId: '',
      map: {
        cursor: 'pointer',
        zoom: 15,
        center: [103.855433, 36.073115],
        amapManager: amapManager,
        events: {
          click: this.mapClick
        }
      },
      addShow: false,
      polygonCenterShow: false,
      newPolygon: {
        vid: 0,
        editable: true,
        draggable: true,
        zIndex: 2000,
        strokeColor: '#0800d3',
        strokeOpacity: 0.9,
        strokeWeight: 1,
        strokeStyle: 'dashed',
        fillColor: '#fffb00',
        fillOpacity: 0.1,
        path: []
      },
      Polygon: {
        vid: 'Polygon',
        editable: false,
        draggable: false,
        zIndex: 100,
        strokeColor: '#004cff',
        strokeOpacity: 1,
        strokeWeight: 1,
        strokeStyle: 'solid',
        fillColor: '#004cff',
        fillOpacity: 0.1,
        path: []
      },
      polygonList: [],
      polList: [],
      streetslist: []
    }
  },
  watch: {
    addShow (val) {
      if (!val) {
        this.addPolygom(this.newPolygon)
      }
    }
  },
  methods: {
    polygonEditable (polygon) {
      let data = this.$refs[polygon.vid][0].$$getInstance()
      if (polygon.editable) {
        this.setPolygon(data.Uh)
        polygon.editable = false
      } else {
        polygon.editable = true
      }
    }, // 修改边界
    setColor (polygon) {
      polygon.fillColor = randomColor()
      this.setPolygon(polygon)
    }, // 改变背景颜色
    polygonShow (off, polygon) {
      if (off) {
        polygon.fillOpacity = 0.5
        this.addShow = false
        this.map.center = polygon.extData.center
      } else {
        polygon.fillOpacity = 0.1
        this.polygonCenterShow = false
        this.addShow = false
      }
    }, // 改变透明度
    PolygonClick (res) {
      if (this.polygonCenterShow) {
        res.target.Uh.extData.center = [res.lnglat.lng, res.lnglat.lat]
        this.setPolygon(res.target.Uh)
        this.polygonCenterShow = false
      }
    }, // 地图点击事件
    setPolygonCenter (polygon) {
      this.polygonCenterShow = true
    }, // 设定中心点
    setsendData (data) {
      if (data) {
        let arrtext = '[[' + data.replace(/;/g, '],[') + ']]'
        return JSON.parse(arrtext)
      }
    }, // 地图数据处理JSON转换为数据
    getsendData (data) {
      let arrtext = ''
      if (data.length) {
        let arr = []
        data.forEach(time => {
          arr.push([time.lng, time.lat])
        })
        let text = JSON.stringify(arr)
        arrtext = text.replace(/\],\[/g, ';')
        arrtext = arrtext.slice(2, -2)
      }
      return arrtext
    }, // 地图数据处理转换为JSON
    deleteModule (scope) {
      this.$confirm('确认删除？')
        .then(_ => {
          this.sendAxios({
            url: '/api/grid/delete',
            method: 'post',
            data: {
              id: scope.vid
            }
          })
            .then(e => {
              this.$message({
                message: '删除成功',
                type: 'success',
                showClose: this
              })
              this.getPolygonList()
            })
            .catch(e => {
              console.log(e)
            })
        })
        .catch(_ => {})
    }, // 删除区域
    mapClick (res) {
      console.log(this.$refs.map)
      if (this.addShow) {
        this.newPolygon.path.push(res.lnglat)
      }
      if (this.polygonCenterShow) {
        this.$message({
          message: '请点击区域内部',
          type: 'warning'
        })
      }
    }, // 添加中心点
    getPolygonList () {
      this.sendAxios({
        url: '/api/grid/findByStreetId',
        method: 'post',
        data: {
          streetId: this.streetId
        }
      })
        .then(e => {
          console.log(e)
          this.polygonList = []
          e.forEach(res => {
            let ret = {
              path: this.setsendData(res.polyline),
              extData: {
                name: res.name,
                look: true,
                center: res.center.split(',')
              },
              events: {
                click: this.PolygonClick
              },
              fillOpacity: 0.1,
              vid: res.id,
              editable: false,
              // fillColor: randomColor()
            }
            if (res.color) {
              ret.fillColor = res.color
            } else {
              ret.fillColor = randomColor()
            }
            this.polygonList.push(ret)
          })
        })
    }, // 获取区域列表
    getPolygon (streets) {
      this.polList = []
      this.streetId = streets.id
      this.getPolygonList(streets.id)
      this.map.center = streets.center.split(',')
      let arr = streets.polyline.split('|')
      arr.forEach(res => {
        let arrtext = '[[' + res.replace(/;/g, '],[') + ']]'
        let data = JSON.parse(arrtext)
        console.log(data)
        let Polygon = Object.assign({}, this.Polygon)
        Polygon.path = data
        Polygon.vid = res
        this.polList.push(Polygon)
      })
    }, // 点击街道
    setPolygon (polygon) {
      if (!this.streetId) {
        this.$message({
          message: '请选择部门',
          type: 'success'
        })
        this.addShow = true
        return
      }
      let arrtext = this.getsendData(polygon.path)
      this.sendAxios({
        url: '/api/grid/saveForm',
        method: 'post',
        data: {
          streetId: this.streetId,
          name: polygon.extData.name,
          id: polygon.vid,
          center: polygon.extData.center,
          polyline: arrtext,
          color: polygon.fillColor
        }
      })
        .then(e => {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          this.getPolygonList()
        })
    }, // 保存
    addPolygom (polygon) {
      if (!this.streetId) {
        this.$message({
          message: '请选择部门',
          type: 'success'
        })
        this.addShow = true
        return
      }
      if (polygon.path.length >= 3) {
        let arrtext = this.getsendData(polygon.path)
        this.sendAxios({
          url: '/api/grid/saveForm',
          method: 'post',
          data: {
            streetId: this.streetId,
            name: '未命名',
            center: `${polygon.path[0].lng},${polygon.path[0].lat}`,
            polyline: arrtext
          }
        })
          .then(e => {
            this.$message({
              message: '新增成功',
              type: 'success',
              showClose: this
            })
            this.addShow = false
            this.newPolygon.path = []
            this.getPolygonList()
          })
      } else {
        this.$message({
          message: '请选择至少三个点',
          type: 'warning',
          showClose: this
        })
        this.addShow = false
      }
    } // 新增区域
  },
  created () {
    this.getPolygonList()
    // this.sendAxios({
    //   url: '/api/grid/findByStreetId',
    //   method: 'post'
    // })
    //   .then(e => {
    //     if (e.center) {
    //       this.map.center = e.center.split(',')
    //     }
    //     if (e.polyline) {
    //       let arr = e.polyline.split('|')
    //       arr.forEach(res => {
    //         let arrtext = '[[' + res.replace(/;/g, '],[') + ']]'
    //         let data = JSON.parse(arrtext)
    //         let Polygon = Object.assign({}, this.Polygon)
    //         Polygon.path = data
    //         Polygon.vid = res
    //         this.polList.push(Polygon)
    //       })
    //     }
    //   })
    this.sendAxios({
      url: '/api/map/area/getStreets',
      method: 'post'
    })
      .then(e => {
        this.streetslist = e
      })
  }
}
</script>

<style scoped lang="scss">
  .amap-demo {
    cursor: crosshair !important;
  }
  .streetsPind {
    border-top: 1px solid $back_color_white;
    background-color: $back_color_Info;
    border-bottom: 1px solid $back_color_main !important;
    border-left: 5px solid $back_color_main !important;
  }
  .streets {
    border-bottom: 1px solid $back_color_white;
    border-left: 5px solid $back_color_white;
    border-top: 1px solid $border_color4;
    padding: 10px 10px;
  }
  .btnList {
    width: 100%;
    padding: 10px;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1000;
    .btn {
      width: 100%;
    }
  }
  .right {
    position: relative;
    padding: 0;
    line-height: initial;
    .conent {
      height: calc(100vh - 160px);
      width: 99%;
      margin: 5px;
      border: 1px solid $border_color2;
      > p {
        background-color: $border_color4;
        padding: 10px 0px;
      }
    }
  }
  .left {
    line-height: initial;
    .conent {
      margin: 5px;
      border: 1px solid $border_color2;
      height: calc(100vh - 160px);
      overflow: auto;
      .leftList {
        text-align: left;
        .timeList {
          width: 100px;
          .btn {
            width: 50%;
          }
        }
      }
      > p {
        background-color: $border_color4;
        padding: 10px 0px;
      }
      .time {
        border-bottom: 1px solid $back_color_white;
        border-left: 25px solid $back_color_white;
        border-top: 1px solid $border_color4;
        padding: 10px 10px;
      }
      .pitchTime {
        border-top: 1px solid $back_color_white;
        background-color: $back_color_Info;
        border-bottom: 1px solid $back_color_main;
        border-left: 5px solid $back_color_main;
      }
    }
  }
</style>
