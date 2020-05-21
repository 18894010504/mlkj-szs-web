<template>
  <div>
    <div class="titleHead">
      <div class="bor"></div>
      主页
    </div>
    <div class="head">
      <el-row :gutter="40">
        <el-col :span="8">
          <div class="tab back1">
            <div class="title">{{credentials.overdueCount || 0}}</div>
            <p class="conent">营业执照已过期30天以上</p>
            <p class="button">更多消息 <i class="iconfont">&#xe61e;</i></p>
            <img src="../../images/已过期.png" alt="">
          </div>
        </el-col>
        <el-col :span="8">
          <div class="tab back2">
            <div class="title">{{credentials.nearExpiry || 0}}</div>
            <p class="conent">营业执照还有30天过期</p>
            <p class="button">更多消息 <i class="iconfont">&#xe61e;</i></p>
            <img src="../../images/即将过期.png" alt="">
          </div>
        </el-col>
        <el-col :span="8">
          <div class="tab back3">
            <div class="title">{{credentials.noExpiry || 0}}</div>
            <p class="conent">营业执照未过期</p>
            <p class="button">更多消息 <i class="iconfont">&#xe61e;</i></p>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="40">
        <el-col :span="8">
          <div class="tabText">
            <div class="title titBack1 iconfont">&#xe61f;</div>
            <div class="conent">
              <p class="text">总并网商户</p>
              <p class="button">{{shop.allCount || 0}}</p>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="tabText">
            <div class="title titBack2 iconfont">&#xe61d;</div>
            <div class="conent">
              <p class="text">2018年已并网商户</p>
              <p class="button">{{shop.bindCount || 0}}</p>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="tabText">
            <div class="title titBack3 iconfont">&#xe61c;</div>
            <div class="conent">
              <p class="text">2018年未并网商户</p>
              <p class="button">{{shop.noBindCount || 0}}</p>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="titleHead">
      <div class="bor"></div>
      各食管所投诉数量及分布条形图 ({{date}})
      <el-date-picker
        style="float: right"
        v-model="date"
        @change="dateChange()"
        type="month"
        value-format="yyyy-MM"
        format="yyyy-MM"
        size="mini"
        placeholder="选择日期">
      </el-date-picker>
    </div>
    <div class="dashboard-container">
      <div id="myChart1" :style="{width: '100%', height: '400px'}"></div>
    </div>
    <div class="titleHead">
      <div class="bor"></div>
      行业分布
    </div>
    <div class="dashboard-container">
      <div id="myChart2" :style="{width: '50%', height: '300px'}"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'homeDome',
  data () {
    return {
      date: new Date().Format('yyyy-MM'),
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
        business_types_001: 0,
        business_types_002: 0,
        business_types_003: 0
      },
      complainNames: [],
      complainCounts_001: [],
      complainCounts_002: [],
      complainCounts_003: []
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
    },
    myChart1 () {
      let myChart = this.$echarts.init(document.getElementById('myChart1'))
      myChart.setOption({
        legend: {
          right: 10,
          orient: 'vertical',
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
            rotate: -60,
            margin: 5
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
                color: 'black',
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
                color: 'black',
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
                color: 'black',
                position: 'top'
              }
            }
          }
        ]
      })
    },
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
            orient: 'vertical',
            y: 'center',
            x: 'right',
            data: ['食品流通', '餐饮服务', '食品生产']
          }
        ],
        toolbox: {
          feature: {
            saveAsImage: {show: true}
          }
        },
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
    },
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
    },
    setComplain () {
      this.sendAxios({
        url: '/api/data/view/shopCount'
      })
        .then(e => {
          this.shop = e
        })
    }
  },
  created () {
  },
  mounted () {
    this.setData()
    this.dateChange()
  }
}
</script>

<style scoped lang="scss">
  .titleHead {
    .bor {
      width: 5px;
      height: 16px;
      background-color: rgb(76, 152, 240);
      display: inline-block;
    }
    border-bottom: 1px solid rgb(191,191,191);
    margin: 0px 20px;
    padding: 5px 10px;
    font-size: 20px;
    font-weight: bold;
  }
  .head {
    padding: 10px 40px;
    .tabText {
      margin-top: 20px;
      border-radius: 5px;
      overflow: hidden;
      font-size: 0;
      box-shadow: 0px 0px 5px 0px #c1c1c1;
      .titBack1 {
        background-color: rgb(0,162,239);
      }
      .titBack2 {
        background-color: rgb(41,220,138);
      }
      .titBack3 {
        background-color: rgb(244,174,62);
      }
      > div {
        vertical-align: top;
        display: inline-block;
      }
      .conent {
        box-sizing: border-box;
        padding: 15px 10px;
        width: calc(100% - 100px);
        .text {
          font-size: 16px;
        }
        .button {
          position: relative;
          font-size: 20px;
        }
      }
      .title {
        color: white;
        padding: 20px 0;
        text-align: center;
        font-size: 45px;
        width: 100px;
      }
    }
    .back1 {
      background: -webkit-linear-gradient(rgb(1,236,206), rgb(0,215,236)); /* Safari 5.1 - 6.0 */
      background: -o-linear-gradient(rgb(1,236,206), rgb(0,215,236)); /* Opera 11.1 - 12.0 */
      background: -moz-linear-gradient(rgb(1,236,206), rgb(0,215,236)); /* Firefox 3.6 - 15 */
      background: linear-gradient(rgb(1,236,206), rgb(0,215,236)); /* 标准的语法 */
    }
    .back2 {
      background: -webkit-linear-gradient(rgb(250,210,190), rgb(246,163,198)); /* Safari 5.1 - 6.0 */
      background: -o-linear-gradient(rgb(250,210,190), rgb(246,163,198)); /* Opera 11.1 - 12.0 */
      background: -moz-linear-gradient(rgb(250,210,190), rgb(246,163,198)); /* Firefox 3.6 - 15 */
      background: linear-gradient(rgb(250,210,190), rgb(246,163,198)); /* 标准的语法 */
    }
    .back3 {
      background: -webkit-linear-gradient(rgb(113,218,245), rgb(25,130,245)); /* Safari 5.1 - 6.0 */
      background: -o-linear-gradient(rgb(113,218,245), rgb(25,130,245)); /* Opera 11.1 - 12.0 */
      background: -moz-linear-gradient(rgb(113,218,245), rgb(25,130,245)); /* Firefox 3.6 - 15 */
      background: linear-gradient(rgb(113,218,245), rgb(25,130,245)); /* 标准的语法 */
    }
    .tab {
      box-shadow: 0px 0px 5px 0px #c1c1c1;
      border-radius: 5px;
      overflow: hidden;
      box-sizing: border-box;
      padding: 10px;
      padding-bottom: 50px;
      color: white;
      display: inline-block;
      width:100%;
      position: relative;
      img {
        position: absolute;
        top: 0;
        right: 0;
        width: 90px;
      }
      .button {
        cursor: pointer;
        font-size: 20px;
        padding: 5px 0;
        text-align: center;
        position: absolute;
        bottom: 0;
        right: 0;
        left: 0;
        background-color: rgba(0,0,0,0.2);
      }
      .conent {
        font-size: 20px;
      }
      .title {
        font-size: 40px;
      }
    }
  }
</style>
