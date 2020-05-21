<template>
  <div class="mapView">
    <el-amap vid="amap"
             :zoom="zoom"
             :amap-manager="amapManager"
             :center="center"
             :events="events"
             ref="map"
             class="amap-demo">
      <el-amap-polygon
        :bubble="polygonOne.bubble"
        vid="one"
        ref="polygon_one"
        :path="polygonOne.path"
        :draggable="polygonOne.draggable"
        :strokeStyle="polygonOne.strokeStyle"
        :strokeOpacity="polygonOne.strokeOpacity"
        :strokeWeight="polygonOne.strokeWeight"
        :events="polygonOne.events">
      </el-amap-polygon>
      <el-amap-polygon
        v-for="(polygon, index) in polygons"
        :key="index"
        :vid="polygon.vid"
        :extData="polygon.extData"
        :editable="polygon.editable"
        :bubble="polygon.bubble"
        :zIndex="polygon.zIndex"
        :strokeColor="polygon.strokeColor"
        :strokeOpacity="polygon.strokeOpacity"
        :strokeWeight="polygon.strokeWeight"
        :fillColor="polygon.fillColor"
        :fillOpacity="polygon.fillOpacity"
        :strokeStyle="polygon.strokeStyle"
        :draggable="polygon.draggable"
        :ref="`polygon_${index}`"
        :path="polygon.path"
        :events="polygon.events">
      </el-amap-polygon>
    </el-amap>
    <div class="btns">
      <el-button @click.stop="reserve()" >储存区域</el-button>
    </div>
    <div class="polygonList">
      <h3>共计{{polygons.length}}个行政区域</h3>
      <div :style="`background-color: ${polygon.fillColor};border: ${polygon.strokeWeight}px ${polygon.strokeStyle} ${polygon.strokeColor};`" class="polygon" v-for="(polygon, index) in polygons" :key="index" @click="polygonViewClick(polygon)" >
        <span>{{polygon.extData.name}}</span>
      </div>
    </div>
    <el-dialog
      :visible.sync="dialogShow"
      width="800px">
      <div class="formPolugons">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form ref="form" label-width="200px" size="small " label-position="left">
              <el-form-item label="名称">
                <el-input v-model="dialogData.extData.name" clearable></el-input>
              </el-form-item>
              <el-form-item label="是否可拖拽">
                <el-switch
                  v-model="dialogData.draggable">
                </el-switch>
              </el-form-item>
              <el-form-item label="开启编辑模式">
                <el-switch
                  v-model="dialogData.editable">
                </el-switch>
              </el-form-item>
              <el-form-item label="层级顺序 (数字越大,层级越高)">
                <el-input-number v-model.number="dialogData.zIndex" :min="0"></el-input-number>
              </el-form-item>
              <el-form-item label="区域填充透明度">
                <el-input-number v-model.number="dialogData.fillOpacity" :precision="2" :step="0.05" :min="0" :max="1"></el-input-number>
              </el-form-item>
              <el-form-item label="区域填充颜色">
                <el-color-picker v-model="dialogData.fillColor"></el-color-picker>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="12">
            <el-form ref="form" label-width="200px" size="small" label-position="left">
              <el-form-item label="ID">
                <el-input v-model="dialogData.extData.name" clearable></el-input>
              </el-form-item>
              <el-form-item label="轮廓线宽度">
                <el-input-number v-model.number="dialogData.strokeWeight" :min="1" ></el-input-number>
              </el-form-item>
              <el-form-item label="轮廓线样式">
                <el-select v-model.number="dialogData.strokeStyle" placeholder="轮廓线样式">
                  <el-option
                    label="实线"
                    value="solid">
                  </el-option>
                  <el-option
                    label="虚线"
                    value="dashed">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="轮廓线透明度">
                <el-input-number v-model.number="dialogData.strokeOpacity" :precision="2" :step="0.05" :min="0" :max="1" label="数字越大,层级越高"></el-input-number>
              </el-form-item>
              <el-form-item label="轮廓线颜色">
                <el-color-picker v-model="dialogData.strokeColor"></el-color-picker>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" v-show="reserveShow" @click="reserve(true)">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { amapManager } from 'vue-amap'

export default {
  name: 'distric',
  data () {
    return {
      zoom: 14,
      center: [103.8807785, 36.05087565],
      vid: 0,
      amapManager: amapManager,
      events: {
        click: this.mapClick,
        rightclick: this.mapRigthClick
      },
      polygons: [],
      polygonOne: {
        extData: {
          name: '未命名',
          polyID: 0
        },
        vid: 0,
        editable: false,
        zIndex: 0,
        strokeColor: '#006600',
        strokeOpacity: 1,
        strokeWeight: 2,
        fillColor: '#FFAA00',
        fillOpacity: 0.5,
        strokeStyle: 'dashed',
        draggable: true,
        path: [],
        bubble: true,
        events: {
          click: this.polygonClick
        }
      },
      dialogShow: false,
      dialogData: {
        extData: {}
      },
      reserveShow: false
    }
  },
  methods: {
    polygonViewClick (polygon) {
      this.dialogShow = true
      this.dialogData = polygon
    },
    reserve (off) {
      if (off) {
        let pol = Object.assign({}, this.polygonOne)
        pol.extData = Object.assign({}, this.polygonOne.extData)
        pol.bubble = false
        pol.vid = this.vid
        this.polygons.push(pol)
        this.polygonOne.path = []
        this.dialogShow = false
        this.reserveShow = false
      } else {
        this.reserveShow = true
        this.dialogShow = true
        this.dialogData = this.polygonOne
      }
    },
    polygonClick (res) {
      let isf = res.target.Uh
      let disIf = false
      for (let doy of this.polygons) {
        if (isf.vid === doy.vid) {
          this.dialogData = doy
          disIf = true
        }
      }
      this.dialogShow = disIf
    },
    mapClick (res) {
      this.polygonOne.path.push([res.lnglat.O, res.lnglat.P])
      this.vid++
    }
  }
}
</script>

<style scoped lang="scss">
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
