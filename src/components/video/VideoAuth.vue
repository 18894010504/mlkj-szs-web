<template>
  <div class="video-manage">
    <el-main class="conent">
      <div>
        <div class="head">
          <div class="left">
            <el-input v-model="shopName" placeholder="请输入商家名称" size="small">
              <el-button slot="append" size="small" @click="seltable" icon="el-icon-search">查询</el-button>
            </el-input>
            <el-button slot="append" size="small" @click="clearAllSearch" type="primary">刷新</el-button>
          </div>
          <div class="right">
            <el-button @click="addAuthVideo" class="btn" size="small" icon="el-icon-edit">
              新增
            </el-button>
          </div>
        </div>
        <div class="conentHtml">
          <el-table
            style="width: 100%"
            :data="ModuleList.rows"
            stripe
            size="small"
            border>
            <el-table-column type="index" :ModuleList="ModuleList+1" label="序号"></el-table-column>
            <el-table-column prop="shopName" label="商家名称"></el-table-column>
            <el-table-column prop="shopNum" label="商家号"></el-table-column>
            <el-table-column prop="licCompanies" label="授权方代码"></el-table-column>
            <el-table-column prop="licDomainName" label="授权域名"></el-table-column>
            <el-table-column prop="businessLicenseNo" label="纳税人识别号"></el-table-column>
            <el-table-column prop="state" label="状态" :formatter="formatSex">
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="240">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="editVideo(scope)">编辑</el-button>
                <el-button type="text" size="small" @click="delVideo(scope)">删除</el-button>
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
    <el-dialog
      :title="ModulePopupText"
      :visible.sync="ModulePopupShow"
      width="50%">
      <video-add v-if="ModulePopupShow" :ModulePopupShow.sync="ModulePopupShow" @submit-add="appendToList" :updateId="updateId"></video-add>
    </el-dialog>
  </div>
</template>
<script>
  import VideoAdd from './VideoAdd'

  export default {
  name: 'VideoAuth',
  components: {
    VideoAdd
  },
  data () {
    return {
      ModulePopupShow: false,
      ModulePopupText: '增加认证',
      updateId: '',
      addModuleShow: false,
      ModuleList: [],
      shopName: '',
      moduleData: {
        shopName: '', // 商家名称
        shopNum: '', // 商家号
        licCompanies: '', // 授权方代码
        licDomainName: '', // 授权域名
        businessLicenseNo: '', // 纳税人识别号
        state: '' // 状态
      },
      page: {
        index: 1, // 当前页数
        size: 30, // 最大行数
        page: 1, // 当前页数
        records: 0, // 总条目数
        total: 0 // 总页数
      },
      rules: {
        shopName: [
          {required: true, message: '请输入商家名称'}
        ],
        shopNum: [
          {required: true, message: '请输入商家号'}
        ],
        licCompanies: [
          {required: true, message: '请输入授权方代码'}
        ],
        licDomainName: [
          {required: true, message: '请输入授权域名'}
        ],
        businessLicenseNo: [
          {required: true, message: '请输入纳税人识别号'}
        ]
      }
    }
  },
  created () {
    this.videoList()
  },
  methods: {
    appendToList () {
      this.videoList()
      this.$message({
        message: '保存成功！',
        type: 'success'
      })
    },
    clearAllSearch () {
      this.shopName = ''
      this.videoList()
      this.$message({
        message: '加载成功',
        type: 'success',
        showClose: this
      })
    },
    formatSex: function (row, column) {
      return row.state == 0 ? '已授权' : '未授权'
    },
    getGirTableData () {
      let self = this
      this.sendAxios({
        url: 'http://vshare.szschina.cn/api/video/list',
        method: 'post',
        data: {
          query: this.shopName,
          pagination: JSON.stringify({
            rows: this.page.size,
            page: this.page.index,
            sidx: 'createdAt'
          })
        }
      }).then(function (res) {
        self.$message({
          message: '加载成功',
          type: 'success',
          showClose: this
        })
        this.ModuleList = res
        this.page.index = res.page
        this.page.records = res.records
      })
    },
    addAuthVideo () {
      this.updateId = ''
      this.ModulePopupShow = true
    },
    editVideo (scope) {
      this.updateId = scope.row.id
      this.ModulePopupShow = true
    },
    seltable () {
      this.videoList()
    },
    videoList () {
      this.sendAxios({
        url: 'http://vshare.szschina.cn/api/video/list',
        method: 'post',
        data: {
          query: this.shopName,
          pagination: JSON.stringify({
            rows: this.page.size,
            page: this.page.index,
            sidx: 'createdAt'
          })
        }
      }).then(res => {
        this.ModuleList = res
        this.page.index = res.page
        this.page.records = res.records
      })
    },
    delVideo (scope) {
      console.log(scope)
      this.$confirm('是否删除该认证商家', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.sendAxios({
          url: 'http://vshare.szschina.cn/api/video/delVideo',
          method: 'post',
          data: {
            videoId: scope.row.id
          }
        }).then(res => {
          this.$message({
            message: '删除成功',
            type: 'success',
            showClose: this
          })
          this.videoList()
        }).catch(error => {
          console.log(error)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
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
