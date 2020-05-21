<template>
<div style="height: 100%">
  <el-container>
    <el-aside width="200px" class="left">
      <p>辖区商户</p>
      <el-tree :data="AllDepartmentList" @node-click="nodeClick" :props="defaultProps" default-expand-all ></el-tree>
    </el-aside>
    <el-container>
      <el-header style="padding: 5px">
        <el-input style="width: 200px" size="small" v-model="keyword" placeholder="请输入商家名称关键字" ></el-input>
      </el-header>
      <el-main style="line-height: initial">
        <el-table
          height="calc(100vh - 200px)"
          :data="tableData"
          style="width: 100%">
          <el-table-column
            prop="shopName"
            label="姓名">
          </el-table-column>
          <el-table-column
            prop="foodInstituteName"
            label="所属食药所">
          </el-table-column>
          <el-table-column
            prop="scale"
            label="规格">
          </el-table-column>
          <el-table-column
            prop="uid"
            label="网格员">
          </el-table-column>
          <el-table-column
            prop="phone"
            label="电话">
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="150">
            <template slot-scope="scope">
              <el-button @click="handleClick(scope)" type="text" size="small">查看视频</el-button>
              <el-button @click="certificateClick(scope)" type="text" size="small">查看证件</el-button>
            </template>
          </el-table-column>
        </el-table>
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
        <!--<div class="food">-->
          <!--<div class="foodNum">-->
            <!--查询到 {{page.records}} 条数据-->
          <!--</div>-->
          <!--<div class="foodPage">-->
            <!--<el-pagination-->
              <!--background-->
              <!--layout="prev, pager, next"-->
              <!--:page-size="page.size"-->
              <!--@current-change="(index)=>{page.index=index,handleNodeClick()}"-->
              <!--:page-count="page.total">-->
            <!--</el-pagination>-->
          <!--</div>-->
        <!--</div>-->
      </el-main>
    </el-container>
  </el-container>
  <el-dialog
    title="商户视频"
    :visible.sync="dialogVisible"
    width="50%">
    <div class="imgList">
      <div class="img" v-for="vide in videoList" :key="vide.url" @click="goVideo(vide)">
        <img :src="vide.channelThumb" alt="">
        <p>{{vide.channelName}}</p>
      </div>
    </div>
  </el-dialog>
  <el-dialog
    title="商户证件照片"
    :visible.sync="certificateShow"
    width="50%">
    <div class="certificateList">
      <div class="img" v-for="vide in certificateList" :key="vide.name" @click="goImg(vide.name)">
        <img :src="vide.name" alt="">
      </div>
    </div>
  </el-dialog>
</div>
</template>

<script>
export default {
  name: 'governmentShop', // 辖区商户
  data () {
    return {
      dialogVisible: false,
      certificateShow: false,
      videoList: [],
      keyword: '',
      tableData: [],
      page: {
        index: 1, // 当前页数
        size: 9, // 最大行数
        page: 1, // 当前页数
        records: 0, // 总条目数
        total: 0 // 总页数
      },
      defaultProps: {
        children: 'childNodes',
        label: 'fullName'
      },
      certificateList: [],
      AllDepartmentList: [],
      atPitch: {}
    }
  },
  watch: {
    keyword () {
      this.handleNodeClick()
    }
  },
  methods: {
    goImg (href) {
      window.open(href, '_blank')
    },
    certificateClick (scope) {
      this.sendAxios({
        url: '/api/business/findInfo',
        method: 'post',
        data: {
          id: scope.row.id
        }
      })
        .then(e => {
          this.certificateShow = true
          this.certificateList = [
            {
              name: e.businessLicense
            },
            {
              name: e.leaderCard
            },
            {
              name: e.leaderCardf
            },
            {
              name: e.licence
            }
          ]
        })
    }, // 证照查询
    goVideo (vide) {
      console.log(vide)
      let { href } = this.$router.resolve({
        name: 'playVideo',
        params: {
          url: vide.url,
          title: vide.channelName
        }
      })
      window.open(href, '_blank')
    }, // 视频跳转
    handleClick (scope) {
      this.videoList = []
      this.sendAxios({
        url: '/api/device/channels',
        method: 'post',
        data: {
          shopNum: scope.row.shopNum
        }
      })
        .then(e => {
          this.videoList = e
          this.dialogVisible = true
        })
    }, // 视频查看
    nodeClick (data) {
      this.atPitch = data
      this.handleNodeClick()
    }, // 选择部门
    handleNodeClick (data) {
      this.sendAxios({
        url: '/api/business/page',
        method: 'post',
        data: {
          pagination: JSON.stringify({'rows': this.page.size, 'page': this.page.index, 'sidx': 'id'}),
          keyword: this.keyword,
          searchType: 'shopName',
          foodInstitute: this.atPitch.enCode,
          // foodInstitute: data.value,
          gridConnected: ''
        }
      })
        .then(e => {
          this.tableData = e.rows
          this.page.records = e.records
          this.page.total = e.total
        })
    } // 表格查询
  },
  created () {
    this.sendAxios({
      url: '/api/department/getDepartmentByLoginUser',
      method: 'post'
    })
      .then(e => {
        this.AllDepartmentList = e
      })
  }
}
</script>

<style scoped lang="scss">
  .certificateList {
    font-size: 0;
    .img {
      display: inline-block;
      vertical-align: top;
      cursor:pointer;
      width: 46%;
      margin: 10px 2%;
      box-shadow: 0px 0px 5px 0px #666666;
    }
    img {
      height: 100%;
      width: 100%;
    }
  }
  .imgList {
    font-size: 0;
    .img {
      cursor:pointer;
      border-radius: 5px;
      overflow: hidden;
      box-shadow: 0px 0px 5px 0px #666666;
      margin: 0px 2%;
      display: inline-block;
      width: 46%;
      height: 150px;
      position: relative;
      p {
        color: white;
        padding: 5px 0;
        position: absolute;
        bottom: 0;
        right: 0;
        left: 0;
        text-align: center;
        background-color: rgba(0,0,0,0.5);
        font-size: 16px;
      }
      img {
        height: 100%;
        width: 100%;
      }
    }
  }
  .food {
    .foodNum {
      float: left;
    }
    position: absolute;
    bottom: 0;
    right: 0;
    left: 0;
  }
  .left {
    line-height: initial;
    p {
      background-color: $border_color4;
      padding: 10px 0px;
    }
  }
</style>
