<template>
  <el-container>
    <el-aside class="left" width="250px">
      <div class="conent">
        <p>商户分布</p>
        <div class="leftList">
          <el-tree :data="AllDepartmentList" @node-click="handleNodeClick" :props="defaultProps" default-expand-all ></el-tree>
        </div>
      </div>
    </el-aside>
    <el-main class="right">
      <div class="conent" id="container" >
        <!--
        <el-amap-circle-marker
          v-for="(marker, index) in polList"
          :key="'pol'+index"
          :center="marker.center"
          :radius="marker.radius"
          :strokeColor="marker.strokeColor"
          :strokeWeight="marker.strokeWeight"
          :fill-color="marker.fillColor"
          :fill-opacity="marker.fillOpacity"
          :events="marker.events"></el-amap-circle-marker>
        </el-amap>
        -->
      </div>
    </el-main>
    <div class="mapType" >
      <div>
        <img src="../../images/餐饮服务经营.png" alt="">
        餐饮服务经营
      </div>
      <div>
        <img src="../../images/高校.png" alt="">
        食堂-高校
      </div>
      <div>
        <img src="../../images/中小学.png" alt="">
        食堂-中小学
      </div>
      <div>
        <img src="../../images/幼儿园.png" alt="">
        食堂-幼儿园
      </div>
      <div>
        <img src="../../images/托护点.png" alt="">
        食堂-托护点
      </div>
    </div>
    <el-dialog
      :title="shop.title"
      :visible.sync="shopShow"
      width="30%">
      <div class="shopInfo">
        <div class="title">
          <p>地址: </p>
          <p>所属食药所: </p>
          <p>电话: </p>
          <p>经营类别: </p>
        </div>
        <div class="conenter">
          <p>{{shop.address?shop.address:'暂未填写'}}。</p>
          <p>{{shop.foodInstituteName?shop.foodInstituteName:'暂未填写'}}。</p>
          <p>{{shop.phon?shop.phon:'暂未填写'}}</p>
          <p>{{shop.type=='001'?'食品流通':shop.type=='002'?'餐饮服务':shop.type=='003'?'食品生产':'未定义'}}</p>
        </div>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
// import { amapManager } from 'vue-amap'
// var url = 'https://webapi.amap.com/maps?v=1.4.11&key=fdc092c091e3eb6685ffcd6dade6b3c5&callback=onLoad'
// var jsapi = document.createElement('script')
// jsapi.charset = 'utf-8'
// jsapi.src = url
// document.head.appendChild(jsapi)
// window.onLoad = function () {
// }
export default {
  name: 'shopDistribution', // 商户分布
  data () {
    return {
      shop: {
        title: '',
        phone: '',
        address: '',
        foodInstituteName: ''
      },
      shopShow: false,
      AllDepartmentList: [],
      defaultProps: {
        children: 'childNodes',
        label: 'fullName'
      },
      atPitch: {},
      map: {
        marker: null,
        mass: null,
        zoom: 15,
        center: [103.855433, 36.073115],
        // amapManager: amapManager,
        AMap: null,
        events: {
          click: this.mapClick
        }
      },
      Polygon: {
        vid: 'Polygon',
        editable: false,
        draggable: false,
        zIndex: 100,
        strokeColor: '#ffff00',
        strokeOpacity: 1,
        strokeWeight: 1,
        strokeStyle: 'solid',
        fillColor: '#ffff00',
        fillOpacity: 0.1,
        path: []
      },
      shopList: [],
      polList: [],
      polygon: {
        extData: {},
        zIndex: 100,
        strokeColor: '#ff0c00',
        strokeWeight: 1,
        strokeOpacity: 1,
        fillColor: '#ff0010',
        fillOpacity: 0.1,
        strokeStyle: 'solid',
        path: [],
        bubble: true
      }
    }
  },
  methods: {
    click (data) {
      this.sendAxios({
        url: '/api/data/view/markInfo',
        method: 'post',
        data: {
          sid: data.id
        }
      })
        .then(e => {
          this.shop = {
            title: e.shopName,
            phone: e.phone,
            address: e.address,
            foodInstituteName: e.foodInstituteName
          }
          this.shopShow = true
        })
    }, // 商家详情
    mouseout (data) {
      data.label = {
        content: '',
        offset: [0, -20]
      }
    }, // 展开详情
    mouseover (data) {
      data.label = {
        content: data.extData.name,
        offset: [0, -20]
      }
    }, // 展开详情
    mapClick (res) {
      console.log(res)
    }, // 点击地图
    handleNodeClick (data) {
      this.atPitch = data
      this.sendAxios({
        url: '/api/business/marks',
        method: 'post',
        data: {
          departmentCode: data.enCode
        }
      })
        .then(e => {
          let arr = []
          e.forEach(res => {
            if (res.longitude && res.latitude) {
              arr.push({
                'lnglat': [res.longitude, res.latitude],
                'name': res.shopName,
                'style': (res.type.split('0')[2] - 1),
                id: res.id
              })
            }
          })
          this.map.mass.setData(arr)
        })
    }, // 选择部门
    drawMap (polygon) {
      this.polList = []
      if (polygon.polyline) {
        let mapArr = polygon.polyline.split('|')
        mapArr.forEach((time, index) => {
          let arrtext = '[[' + time.replace(/;/g, '],[') + ']]'
          let arr = JSON.parse(arrtext)
          if (polygon.level === 4) {
            let data = Object.assign({}, this.polygon)
            data.path = arr
            this.polList.push(data)
          }
        })
      }
    } // 绘画地图
  },
  created () {
    this.sendAxios({
      url: '/api/department/getDepartmentByLoginUser',
      method: 'post'
    })
      .then(e => {
        this.AllDepartmentList = e
      })
  },
  mounted: function () {
    let _this = this
    _this.map.AMap = new AMap.Map('container', {
      resizeEnable: true, // 是否监控地图容器尺寸变化
      zoom: 12, // 初始化地图层级
      center: [103.855433, 36.073115] // 初始化地图中心点
    })
    let anchor = new AMap.Pixel(4, 4)
    let size = new AMap.Size(17, 17)
    let style = [
      {
        url: require('../../images/餐饮服务经营.png'),
        anchor: anchor,
        size: size
      },
      {
        url: require('../../images/幼儿园.png'),
        anchor: anchor,
        size: size
      },
      {
        url: require('../../images/中小学.png'),
        anchor: anchor,
        size: size
      },
      {
        url: require('../../images/高校.png'),
        anchor: anchor,
        size: size
      },
      {
        url: require('../../images/托护点.png'),
        anchor: anchor,
        size: size
      }
    ]
    _this.map.mass = new AMap.MassMarks([], {
      zooms: [3, 22],
      opacity: 0.8,
      zIndex: 111,
      cursor: 'auto',
      style: style
    })
    _this.map.marker = new AMap.Marker({content: ' ', map: _this.map.AMap})
    _this.map.mass.on('mouseover', function (e) {
      _this.map.marker.setPosition(e.data.lnglat)
      _this.map.marker.setLabel({content: e.data.name})
    })
    _this.map.mass.on('click', function (e) {
      _this.click(e.data)
    })
    _this.map.mass.setMap(_this.map.AMap)
  }
}

</script>

<style scoped lang="scss">
  .mapType {
    padding: 10px 20px;
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: white;
    * {
      vertical-align: middle;
    }
    div {
      padding: 5px 0;
    }
    img {
      width: 25px;
    }
  }
  .shopInfo {
    $wid: 100px;
    > div {
      display: inline-block;
    }
    .title {
      width: $wid;
    }
    p {
      padding: 10px 0;
    }
    .conenter {
      width: calc(100% - 110px);
    }
  }
  .right {
    .conent {
      width: 100%;
      height: calc(100vh - 150px);
    }
  }
  .left {
    line-height: initial;
    .conent {
      margin: 5px;
      border: 1px solid $border_color2;
      > p {
        background-color: $border_color4;
        padding: 10px 0px;
      }
      .time {
        border-bottom: 1px solid $back_color_white;
        border-left: 5px solid $back_color_white;
        border-top: 1px solid $border_color4;
        padding: 10px 0;
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
