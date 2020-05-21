<template>
<div class="conent">
  <div class="header">
    <header>
      兰州市城关区食品药品监督管理局大数据
      <span>{{time.date}}</span>
    </header>
  </div>
  <div class="main">
    <div class="">
      <div class="mapShop" id="container">
      </div>
      <div class="linShop make">
        <div class="titleMask">
          城关区在线商户
        </div>
        <div class="offLinShop">
          <div class="offLin" :style="`width: ${onLinShop}`">
            在线商户 {{onLinShop}}
          </div>
          <div class="onLin" :style="`width: ${offlinShop}`">
            离线商户 {{offlinShop}}
          </div>
        </div>
      </div>
    </div>
    <div class="">
      <div class="papers make">
        <div class="leftFloat">
          证照逾期
        </div>
        <div class="line">
          <div class="img">
            <img src="../images/证照.png" alt="">
          </div>
          <span class="text">已过期</span>
          <span class="value" style="color: red">{{credentials.overdueCount}}</span>
        </div>
        <div class="line">
          <div class="img">
            <img src="../images/证照.png" alt="">
          </div>
          <span class="text">即将过期</span>
          <span class="value" style="color: yellow;">{{credentials.nearExpiry}}</span>
        </div>
        <div class="line">
          <div class="img">
            <img src="../images/证照.png" alt="">
          </div>
          <span class="text">未过期</span>
          <span class="value" style="color: #00ff34;">{{credentials.noExpiry}}</span>
        </div>
      </div>
      <div class="typeShop make">
        <div class="leftFloat">
          行业分布
        </div>
        <div id="myChart2" class="echart2 echart"></div>
      </div>
      <div class="Internet make">
        <div class="titleMask">
          并网商户比例曲线图
          <span>(2018年)</span>
        </div>
        <div id="myChart3" class="echart1 echart"></div>
      </div>
    </div>
  </div>
  <div class="button make">
    <div class="titleMask">
      各市管所投诉数量及分布条形图
      <span>(11月份)</span>
    </div>
    <div id="myChart1" class="echart1 echart"></div>
  </div>
</div>
</template>

<script>
export default {
  name: 'dataMap',
  data () {
    return {
      time: {
        setTimeout: null,
        date: '',
        timeRefresh: 0,
      },
      map: null,
      credentials: {
        allCount: 0, // 所有商户
        nearExpiry: 0, //  临近过期
        noExpiry: 0, // 未过期
        overdueCount: 0 // 已过期
      },
      shop: {
        allCount: 0, // 总数
        bindCount: 0, // 绑定数
        noBindCount: 0, // 没有绑定数
        offlineCount: 0, // 离线数
        onlineCount: 0 // 在线数
      },
      type: {
        business_types_001: 0, // 食品问题
        business_types_002: 0, // 卫生问题
        business_types_003: 0 // 安全问题
      },
      complainNames: [],
      complainCounts_001: [],
      complainCounts_002: [],
      complainCounts_003: []
    }
  },
  computed: {
    offlinShop () {
      let data = this.shop.onlineCount + this.shop.offlineCount
      if (data) {
        return (this.shop.offlineCount / data * 100).toFixed(2) + '%'
      } else {
        return '0.00%'
      }
    },
    onLinShop () {
      let data = this.shop.onlineCount + this.shop.offlineCount
      if (data) {
        return (this.shop.onlineCount / data * 100).toFixed(2) + '%'
      } else {
        return '0.00%'
      }
    }
  },
  methods: {
    dateChange () {
      this.sendAxios({
        url: '/api/data/view/complainDistribution',
        data: {
          dateTime: this.date
        }
      })
        .then(e => {
          this.complainNames = e.names
          this.complainCounts_001 = e.counts_001
          this.complainCounts_002 = e.counts_002
          this.complainCounts_003 = e.counts_003
          this.myChart1()
        })
    }, // 获取投诉数据
    myChart1 () {
      let myChart = this.$echarts.init(document.getElementById('myChart1'))
      myChart.setOption({
        legend: {
          textStyle: {
            color: '#ffffff'
          },
          right: 50,
          orient: 'horizontal',
          data: ['食品问题', '卫生问题', '安全问题']
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        xAxis: {
          axisLabel: {
            interval: 0,
            rotate: -30,
            margin: 5,
            color: '#ffffff'
          },
          axisLine: {
            lineStyle: {
              color: '#ffffff'
            }
          },
          axisTick: {
            show: false
          },
          type: 'category',
          data: this.complainNames
        },
        dataZoom: [
          {
            type: 'inside'
          }
        ],
        grid: {
          left: '40',
          right: '80',
          bottom: '5',
          containLabel: true
        },
        yAxis: {
          axisLine: {
            lineStyle: {
              color: '#ffffff'
            }
          },
          max: 78,
          name: '(分布比例)',
          type: 'value',
          axisLabel: {
            formatter (res) {
              return ((res / 78) * 100).toFixed(2) + '%'
            }
          }
        },
        color: ['#FE4646', '#FEFF5D', '#4A90FF'],
        series: [
          {
            name: '食品问题',
            data: this.complainCounts_001,
            type: 'bar',
            barGap: 0,
            label: {
              normal: {
                show: true,
                color: '#ffffff',
                position: 'top'
              }
            }
          },
          {
            name: '卫生问题',
            data: this.complainCounts_002,
            type: 'bar',
            barGap: 0,
            label: {
              normal: {
                show: true,
                color: '#ffffff',
                position: 'top'
              }
            }
          },
          {
            name: '安全问题',
            data: this.complainCounts_003,
            type: 'bar',
            barGap: 0,
            label: {
              normal: {
                show: true,
                color: '#ffffff',
                position: 'top'
              }
            }
          }
        ]
      })
    }, // 投诉数量柱状图
    myChart2 () {
      let myChart = this.$echarts.init(document.getElementById('myChart2'))
      myChart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        color: ['#6A6A6A', '#F28751', '#AA74DD', '#AA60D9', '#5ED1DD', '#EFC54D', '#87D362'],
        legend: [
          {
            textStyle: {
              color: '#ffffff'
            },
            // inactiveColor: 'white',
            orient: 'vertical',
            y: 'center',
            x: 'right',
            data: ['食品流通', '餐饮服务', '食品生产']
          }
        ],
        // toolbox: {
        // feature: {
        //   saveAsImage: {show: true}
        // }
        // },
        series: [
          {
            name: '行业分布',
            type: 'pie',
            radius: [0, 110],
            center: ['50%', '50%'],
            roseType: 'radius',
            label: {
              normal: {
                formatter: '{d}%',
                position: 'inner',
                show: true
              }
            },
            data: [
              {
                value: this.type.business_types_001,
                name: '食品流通'
              },
              {
                value: this.type.business_types_002,
                name: '餐饮服务'
              },
              {
                value: this.type.business_types_003,
                name: '食品生产'
              }
            ]
          }
        ]
      })
    }, // 行业分布饼图
    myChart3 () {
      let myChart = this.$echarts.init(document.getElementById('myChart3'))
      myChart.setOption({
        xAxis: {
          type: 'category',
          data: ['第一季度', '第二季度', '第三季度', '第四季度'],
          axisLabel: {
            interval: 0,
            margin: 5,
            color: '#ffffff'
          },
          axisLine: {
            lineStyle: {
              color: '#ffffff'
            }
          }
        },
        legend: {
          textStyle: {
            color: '#ffffff'
          },
          orient: 'horizontal',
          right: 50,
          data: ['已并网', '未并网']
        },
        grid: {
          left: '10',
          right: '80',
          bottom: '10',
          containLabel: true
        },
        color: ['#00ff00', '#ff0000'],
        yAxis: {
          name: '(户)',
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#ffffff'
            }
          }
        },
        series: [
          {
            name: '已并网',
            data: [10, 20, 30, 40],
            type: 'line',
            smooth: true
          },
          {
            name: '未并网',
            data: [720, 532, 401, 534],
            type: 'line',
            smooth: true
          }
        ]
      })
    }, // 并网商户曲线图
    setData () {
      this.sendAxios({
        url: '/api/data/view/serviceTypeDistribution  '
      })
        .then(e => {
          this.type = e
          this.myChart2()
          // this.shop = e
        })
      this.sendAxios({
        url: '/api/data/view/certificateOverdue'
      })
        .then(e => {
          this.credentials = e
        })
      this.sendAxios({
        url: '/api/data/view/shopCount'
      })
        .then(e => {
          this.shop = e
        })
    }, // 获取过期分类数据
    setComplain () {
      this.sendAxios({
        url: '/api/data/view/shopCount'
      })
        .then(e => {
          this.shop = e
        })
    }, // 获取离线数据
    setMapData () {
      this.sendAxios({
        url: '/api/business/marks',
        method: 'post',
        data: {
          departmentCode: '0101020'
        }
      })
        .then(e => {
          let arr = []
          e.forEach(res => {
            if (res.longitude && res.latitude) {
              arr.push(new AMap.Marker({
                position: [res.longitude, res.latitude],
                content: '<div style="background-color: hsla(180, 100%, 50%, 0.7); height: 10px; width: 10px; border: 1px solid hsl(180, 100%, 40%); border-radius: 12px; box-shadow: hsl(180, 100%, 50%) 0px 0px 1px;"></div>',
                offset: new AMap.Pixel(-15, -15)
              }))
              //     arr.push({
              //       'lnglat': [res.longitude, res.latitude],
              // //       'name': res.shopName,
              // //       'style': (res.type.split('0')[2] - 1),
              // //       id: res.id
              //     })
            }
          })
          new AMap.MarkerClusterer(this.map, arr, {gridSize: 10})
          // this.map.mass.setData(arr)
        })
    }, // 获取地图数据,
    refreshData () {
      this.setComplain()
      this.myChart3()
      this.setData()
      this.dateChange()
      this.setMapData()
    } // 刷新数据
  },
  created () {
    this.time.setInterval = setInterval(() => {
      this.time.timeRefresh++
      if (this.time.timeRefresh % (30 * 2) === 0) {
        this.refreshData()
      }
      this.time.date = new Date().Format('yyyy-MM-dd HH:mm:ss EEE')
    }, 500)
  },
  mounted () {
    this.refreshData()
    this.$root.loading.close()
    this.map = new AMap.Map('container', {
      resizeEnable: true, // 是否监控地图容器尺寸变化
      mapStyle: 'amap://styles/darkblue',
      zoom: 12, // 级别
      center: ['103.836027', '36.056562']
    })
  }
}
</script>

<style scoped lang="scss">
  $header_height: 60px;
  $button_height: 350px;
  $linShop_height: 140px;
  $padd: 5px;
  $mainHeight: calc(100% - #{$button_height} - #{$header_height});
  $fonSizeHeader: 30px;
  $fonSizeTitle: 25px;
  $leftFloat: 15px;
  $leftFloatWid: 20px;
  $papers_width: 350px;
  $papers_height: 250px;
  .offLinShop {
    $head: 50px;
    margin: 0px 5%;
    width: 90%;
    height: $head;
    background-color: white;
    > div {
      text-align: center;
      overflow: hidden;
      height: 100%;
      line-height: $head;
      display: inline-block;
    }
    .offLin {
      font-size: $fonSizeTitle;
      background-color: #2a75ec;
      color: white;
    }
    .onLin {
      font-size: $fonSizeTitle;
      background-color: #2b66c2;
      color: #90a8d8;
    }
  }
  .echart1 {
    height: calc(100% - 70px);
  }
  .echart2 {
    width: 100%;
    height: 100%;
  }
  .Internet {
    $margTop: $padd*3;
    margin-top: $margTop;
    height: calc(100% - #{$papers_height} - #{$margTop});
  }
  .typeShop {
    vertical-align: top;
    position: relative;
    margin-left: $padd*2;
    width: calc(100% - #{$papers_width} - #{$padd*2});
    height: $papers_height;
    display: inline-block;
  }
  .papers {
    display: inline-block;
    height: $papers_height;
    overflow: hidden;
    position: relative;
    padding: $padd*2 0 $padd*2 $padd*4;
    box-sizing: border-box;
    width: $papers_width;
    .line:nth-last-of-type(1) {
      border: 0;
    }
    .line {
      box-sizing: border-box;
      height: calc(100% / 3);
      color: white;
      font-size: $fonSizeTitle;
      padding: $padd*2 0;
      border-bottom: 1px dashed white;
      margin-left: $leftFloatWid;
      position: relative;
      * {
        vertical-align: top;
      }
      .value {
        line-height: calc(#{$papers_height} / 3 - #{$padd*6});
        display: inline-block;
        height: 100%;
        float: right;
        padding-right: $padd*4;
      }
      .text {
        margin-left: 60px;
        line-height: calc(#{$papers_height} / 3 - #{$padd*6});
        display: inline-block;
        height: 100%;
        padding: 0px 20px;
      }
      .img {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        margin: auto;
        border: 1px solid rgba(255,255,255,0.3);
        width: 40px;
        height: 40px;
        padding: $padd;
        display: inline-block;
        font-size: 0;
        img {
          height: 100%;
          width: 100%;
        }
      }
    }
  }
  .mapShop {
    border: 1px solid #3c4e7e;
    width: calc(100% - 2px);
    height: calc(100% - #{$linShop_height} - #{$padd*2} - 2px);
  }
  .linShop {
    margin-top: $padd*2;
    height: $linShop_height;
  }
  .main {
    font-size: 0;
    padding: $padd*2 $padd*2;
    height: $mainHeight;
    > div {
      vertical-align: top;
      box-sizing: border-box;
      padding: 0 $padd*2;
      width: 50%;
      height: 100%;
      display: inline-block;
    }
  }
  .leftFloat {
    font-size: $leftFloat;
    color: white;
    width: $leftFloatWid;
    text-align: center;
    padding: $padd*2 $padd;
    background: -webkit-linear-gradient(#225bb4, #041f4a); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(#225bb4, #041f4a); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(#225bb4, #041f4a); /* Firefox 3.6 - 15 */
    background: linear-gradient(#225bb4, #041f4a); /* 标准的语法 */
    position: absolute;
    top: 0;
    left: 0;
  }
  .titleMask {
    font-size: $fonSizeTitle;
    text-align: center;
    letter-spacing: 3px;
    padding: $padd*4;
    color: #7399fa;
    span {
      color: white;
    }
  }
  .make {
    -moz-box-shadow:-0px -0px 10px rgba(62, 81, 112, 0.49) inset;             /* For Firefox3.6+ */
    -webkit-box-shadow:-0px -0px 10px rgba(62, 81, 112, 0.49) inset;          /* For Chrome5+, Safari5+ */
    box-shadow:-0px -0px 200px rgba(62, 81, 112, 0.49) inset;                  /* For Latest Opera */
  }
  .button {
    position: relative;
    height: $button_height;
  }
  .header {
    box-sizing: border-box;
    height: $header_height;
    color: white;
    font-size: $fonSizeHeader;
    padding: $padd*2 $padd*4;
    margin: 0px $padd*4;
    border-bottom: 1px solid rgba(255,255,255,0.2);
    header {
      letter-spacing: 3px;
    }
    span {
      float: right;
      font-size: $fonSizeTitle;
    }
  }
  .conent {
    overflow: hidden;
    width: 100vw;
    height: 100vh;
    padding-bottom: $padd * 4;
    box-sizing: border-box;
    background-size: 100% 100%;
    background-image: url("../images/背景.png");
  }
</style>
