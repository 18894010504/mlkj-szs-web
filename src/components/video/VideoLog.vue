<template>
  <div class="video-manage">
    <el-main class="conent">
      <div>
        <div class="head">
          <div class="left">
            <el-date-picker
              size="small"
              v-model="timeDate"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="updateTime">
            </el-date-picker>
          </div>
        </div>
        <div class="conentHtml">
          <el-table
            style="width: 100%"
            :data="logListData"
            stripe
            size="small"
            border>
            <el-table-column
              :label="item.label"
              :prop="item.prop"
              :width="item.width"
              :align="item.align"
              v-for="item in listColumnData" :key="item.prop">
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="240">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="deleteModule(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="food">
          <div class="foodNum">
            查询到 {{page.records}} 条数据
          </div>
          <div class="foodPage">
            <el-pagination
              background
              layout="prev, pager, next"
              :page-size="page.size"
              @current-change="(index)=>{page.index=index;getGirTableData(index)}"
              :page-count="page.total">
            </el-pagination>
          </div>
        </div>
      </div>
    </el-main>
  </div>
</template>
<script>
  import {dateDay, formatDate} from '../../utils/tools'

  export default {
  name: 'VideoLog',
  components: {
  },
  data () {
    return {
      logListData: [],
      listColumnData: [
        {
          label: '授权公司代码',
          prop: 'licCompanies',
          width: '',
          align: 'center'
        },
        {
          label: '商家号',
          prop: 'shopNum',
          width: '',
          align: 'left'
        },
        {
          label: '访问来源',
          prop: 'soureceUrl',
          width: '',
          align: 'left'
        },
        {
          label: '创建时间',
          prop: 'createdAt',
          width: '',
          align: 'left'
        }
      ],
      page: {
        index: 1, // 当前页数
        size: 30, // 最大行数
        page: 1, // 当前页数
        records: 0, // 总条目数
        total: 0 // 总页数
      },
      params: {
        pagination: {},
        keyword: ''
      },
      timeDate: [dateDay(-7), new Date()]
    }
  },
  created () {
    this.getData()
  },
  methods: {
    search () {
      this.getData()
    },
    changeStartTime (time) {
      let d = new Date(time)
      let timedata = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()
      this.form.creatTime = timedata
    },
    getData: function () {
      this.params.pagination = JSON.stringify({
        rows: this.page.size,
        page: this.page.index,
        sidx: 'createdAt'
      })
      this.params.query = JSON.stringify({
        StartTime: formatDate(this.timeDate[0].getTime()),
        EndTime: formatDate(this.timeDate[1].getTime())
      })
      let self = this
      this.sendAxios({
        url: 'http://vshare.szschina.cn/api/video/logList',
        method: 'post',
        data: this.params
      }).then(res => {
        self.logListData = res.rows
        self.page.records = res.records
        self.page.total = res.total
      }).catch(error => {
        console.log(error)
      })
    },
    getGirTableData () {
      let self = this
      this.params.pagination = JSON.stringify({
        rows: this.page.size,
        page: this.page.index,
        sidx: 'createdAt'
      })
      this.params.query = JSON.stringify({
        StartTime: formatDate(this.timeDate[0].getTime()),
        EndTime: formatDate(this.timeDate[1].getTime())
      })
      this.sendAxios({
        url: 'http://vshare.szschina.cn/api/video/logList',
        method: 'post',
        data: this.params
      }).then(function (res) {
        self.$message({
          message: '加载成功',
          type: 'success',
          showClose: this
        })
        self.logListData = res.rows
        self.page.records = res.records
        self.page.total = res.total
      })
    },
    updateTime () {
      if (!this.timeDate || this.timeDate.length < 2) {
        return
      }
      this.getData()
    },
    handleNodeClick () {
      this.page.index++
      this.getData()
    },
    deleteModule (row) {
      console.log(row)
      let rowId = row.id
      this.$confirm('是否删除该信息？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(_ => {
          this.sendAxios({
            url: 'http://vshare.szschina.cn/api/video/delLog',
            method: 'post',
            data: {
              id: rowId
            }
          }).then(res => {
            let pagedata = {
              pagination: JSON.stringify({
                rows: this.page.size,
                page: this.page.index,
                sidx: 'createdAt'
              })
            }
            this.getData(pagedata)
            this.$message({
              type: 'success',
              message: '数据删除成功'
            })
          })
        })
    }
  }
}
</script>
<style lang="scss" scoped>

  .el-input {
    width: 100% !important;
    .el-select {
      width: 110px !important;
    }
  }

  .prism-progress {
    display: none !important;
  }

  img {
    max-width: 100% !important;
    height: auto;
  }

  .conent {
    width: 100%;
    line-height: initial;
    text-align: left;
    $bor: 1px solid $border_color3;
    > div {
      border: $bor;
      background-color: $back_color_white;
      .food {
        padding: 0px 10px;
        font-size: 0;
        .foodNum {
          width: 20%;
        }
        .foodPage {
          text-align: right;
          width: 80%;
        }
        > div {
          vertical-align: middle;
          font-size: $font_size14;
          display: inline-block;
        }
      }
      .head {
        margin-right: 1px;
        width: 100%;
        display: flex;
        > p {
          padding: 5px 10px;
          border-bottom: 1px solid $border_color3;
          text-align: left;
        }
        .right {
          text-align: right;
          flex: 1;
          .group {
            width: 100%;
          }
        }
        .left {
          flex: 1;
          display: flex;
          .el-cascader .el-input {
            display: inline-block !important;
          }
        }
        > div {
          padding: 5px 10px;
          display: inline-block;
          width: 30%;
        }
      }
    }
  }

  .leftConent {
    > div {
      margin: 5px 0px 5px 5px;
      border: 1px solid $border_color3;
    }
    overflow: hidden;
    line-height: initial;
    div {
      background-color: $back_color_white;
      p {
        padding: 5px 10px;
        border-bottom: 1px solid $border_color3;
        text-align: left;
      }
    }
  }

  .headDevice {
    width: 100%;
    display: flex;
    margin: -20px 0 10px 0;
    .left {
      flex: 1;
      display: flex;
      .el-button .el-input .el-selectel-cascader {
        flex: 1;
      }
    }
    .right {
      flex: 1;
      text-align: right;
    }
  }
</style>
