<template>
  <div class="mapView">
    <el-amap ref="map" vid="amapDemo" :expandZoomRange="true" :amap-manager="amapManager" :center="center" :zoom="zoom" plugin="ToolBar" :events="events" class="amap-demo">
      <el-amap-marker
        v-for="(marker, index) in markers"
        :key="index"
        :topWhenClick="true"
        :position="marker.position"
        :events="marker.events"
        :label="marker.label"
        :vid="index"></el-amap-marker>
      <el-amap-marker
        v-if="markerView.show"
        :bubble="false"
        :position="markerView.position"
        :template="markerView.template"
        :vid="markerView.vid"></el-amap-marker>
    </el-amap>
    <div class="markerView">
      <h3>
        辖区共有商户{{markers.length}}家
      </h3>
      <div class="markerList">
        <button class="btn pointer" v-for="(marker, index) in markers" :key="index" @click="btnClick(marker)">
          {{marker.label.content}}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
// NPM 方式
import { amapManager } from 'vue-amap'

export default {
  name: 'site',
  data () {
    return {
      amapManager,
      zoom: 14,
      center: [103.8807785, 36.05087565],
      events: {
        click: this.mapClick
      },
      markers: [],
      markerList: {
        position: [0, 0],
        events: {
          click: this.markerClick
        },
        label: {
          content: '马子禄牛肉面马子禄牛肉面马子禄牛肉面马子禄牛肉面',
          offset: [0, -20]
        }
      },
      markerView: {
        show: false,
        position: [0, 0],
        template: `<marker-view :markerData="this.markerView"></marker-view>`
      }
    }
  },
  methods: {
    btnClick (marker) {
      console.log(marker)
      this.center = marker.position
    },
    markerClick (res) {
      if (res.target.Uh.position.O === this.markerView.position[0] && res.target.Uh.position.P === this.markerView.position[1]) {
        this.markerView.show = !this.markerView.show
      } else {
        this.markerView.position = [res.target.Uh.position.O, res.target.Uh.position.P]
        this.markerView.show = true
      }
    },
    mapClick (res) {
      this.markerList.position = [res.lnglat.O, res.lnglat.P]
      let pol = Object.assign({}, this.markerList)
      this.markers.push(pol)
    }
  }
}
</script>

<style scoped lang="scss">
  .markerView {
    max-width: 200px;
    min-width: 100px;
    height: 50%;
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    background-color: rgba(255,255,255,0.7);
    padding: 10px;
    border-radius: 5px;
    .markerList {
      height: 100%;
      overflow: auto;
      .btn:hover {
        background-color: $border_color4;
      }
      .btn {
        margin-top: 10px;
        border-radius: 5px;
        padding: 10px;
        border: 1px solid $border_color1;
        background-color: $border_color3;
      }
    }
  }
  .mapView {
    height: 100vh;
    width: 100%;
  }
</style>
