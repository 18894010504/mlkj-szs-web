<template>
  <div style="height: 100%">
    <el-container>
      <el-aside width="200px" class="leftConent">
        <div>
          <el-menu :default-active="params.CategoryId" class="el-menu-vertical-demo" @select="handleSelect">
            <el-menu-item :index="item.value" v-for="(item,key) in logTypes" :key="key">
              <span slot="title">{{item.label}}</span>
            </el-menu-item>
          </el-menu>
        </div>
      </el-aside>
      <el-main class="conent">
        <div>
          <div class="head">
            <p>日志记录</p>
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
                v-for="item in listColumnData" :key="item.prop">
              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                width="200">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="edit(scope)">编辑</el-button>
                  <el-button type="text" size="small" @click="deleteModule(scope)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="ViewFood">
            <div class="foodNum">
              当前页数 {{page.index}} / 查询到 {{page.records}} 条数据
            </div>
            <div class="foodPage">
              <el-pagination
                background
                layout="prev, pager, next"
                :page-size="page.size"
                @current-change="(index)=>{page.index=index;handleNodeClick()}"
                :page-count="page.total">
              </el-pagination>
            </div>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import {dateDay, formatDate} from '../../utils/tools'

export default {
  data () {
    return {
      logListData: [],
      listColumnData: [
        {
          label: '操作时间',
          prop: 'operateTime',
          width: '180px',
          align: 'left'
        },
        {
          label: '操作用户',
          prop: 'operateUserId',
          width: '180px',
          align: 'left'
        },
        {
          label: 'ip地址',
          prop: 'ipAddress',
          width: '',
          align: 'left'
        },
        {
          label: '系统模块',
          prop: 'module',
          width: '',
          align: 'left'
        },
        {
          label: '操作内容',
          prop: 'description',
          width: '',
          align: 'left'
        }
      ],
      page: {
        size: 30,
        index: 1,
        records: 0,
        total: 0
      },
      logTypes: [
        {
          label: '访问日志',
          value: '2'
        },
        {
          label: '操作日志',
          value: '3'
        },
        {
          label: '异常日志',
          value: '4'
        }
      ],
      params: {
        pagination: {},
        CategoryId: '2',
        keyword: ''
      },
      timeDate: [dateDay(-7), new Date()]
    }
  },
  methods: {
    search () {
      this.getData()
    },
    getData: function () {
      this.params.pagination = JSON.stringify({
        rows: this.page.size,
        page: this.page.index,
        sidx: 'id'
      })
      this.params.queryJson = JSON.stringify({
        CategoryId: this.params.CategoryId,
        StartTime: formatDate(this.timeDate[0].getTime()),
        EndTime: formatDate(this.timeDate[1].getTime())
      })
      let self = this
      this.sendAxios({
        url: '/api/log/pageLogList',
        method: 'post',
        data: this.params
      }).then(res => {
        self.logListData = res.rows
        self.page.records = res.records
        self.page.total = res.total
      }).catch(error => {})
    },
    handleSelect (key, keyPath) {
      this.params.CategoryId = key
      this.getData()
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
    }
  },
  created () {
    this.getData()
  }
}
</script>

<style scoped lang="scss">
  .formCell {
    width: 100%;
  }

  .conent {
    width: 100%;
    line-height: initial;
    text-align: left;
    $bor: 1px solid $border_color3;
    > div {
      border: $bor;
      background-color: $back_color_white;
      .ViewFood {
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
        > p {
          padding: 5px 10px;
          border-bottom: 1px solid $border_color3;
          text-align: left;
        }
        .right {
          float: right;
          text-align: right;
          .group {
            width: 100%;
          }
          .btn {
            width: (100% / 3);
          }
        }
        .left {
          display: flex;
          width: 60%;
          .el-date-picker .el-input {
            flex: 1;
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
</style>
