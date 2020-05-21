<template>
  <div style="height: 100%">
    <el-container>
      <el-main class="conent">
        <div>
          <div class="head">
            <div class="left">
              <el-input
                class="complany"
                placeholder="请输入内容"
                size="small"
                v-model="keyword">
                <i slot="prefix" class="el-input__icon el-icon-search"></i>
              </el-input>
              <el-input
                class="complany"
                placeholder="请输入录入人标识"
                size="small"
                v-model="typeInUid">
                <i slot="prefix" class="el-input__icon el-icon-search"></i>
              </el-input>
              <el-button  size="small" type="primary" icon="el-icon-search" @click="searchfun">查询</el-button>
            </div>
            <div class="right">
              <el-button size="small" @click.native="complainaddfun()" icon="el-icon-circle-plus">新增</el-button>
            </div>
          </div>
          <div class="conentHtml">
            <el-table
              style="width: 100%"
              :data="ModuleList.rows"
              stripe
              height="calc(100vh - 200px)"
              size="small"
              border>
              <el-table-column type="index" :ModuleList="ModuleList+1" label="序号"></el-table-column>
              <el-table-column prop="title" label="投诉标题"></el-table-column>
              <el-table-column prop="content" width="300" label="投诉内容"></el-table-column>
              <el-table-column prop="shopName" label="商家名称"></el-table-column>
              <el-table-column prop="phone" label="联系电话"></el-table-column>
              <el-table-column prop="createdAt" label="投诉时间"></el-table-column>
              <el-table-column prop="problem" label="存在问题"></el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                width="300">
                <template slot-scope="scope">
                  <el-button-group>
                    <el-button size="mini" type="primary" icon="el-icon-edit" @click="complainInfor(scope.$index, scope.row)">查看详情</el-button>
                    <el-button size="mini" type="primary" icon="el-icon-edit" @click="replyfun(scope.$index, scope.row)">投诉回复</el-button>
                    <el-button size="mini" type="danger" icon="el-icon-delete" @click="complaindel(scope.$index, scope.row)">删除</el-button>
                  </el-button-group>
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
                @current-change="(index)=>{page.index=index}"
                :page-count="page.total">
              </el-pagination>
            </div>
          </div>
          <!--<div class="food">-->
            <!--<div class="foodNum">-->
              <!--当前页数 {{page.index}} / 查询到 {{page.records}} 条数据-->
            <!--</div>-->
          <!--</div>-->
        </div>
      </el-main>
    </el-container>
    <!--***********************************************投诉回复***********************************************-->
    <el-dialog  v-dialogDrag title="投诉回复" v-if="reply" :visible.sync="reply">
      <complaintreply ref="complaintreply" :complainid="complainid"></complaintreply>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="reply = false">取消</el-button>
        <el-button size="small" type="primary" @click="savecomplain">确 定</el-button>
      </div>
    </el-dialog>
    <!--***********************************************查看详情***********************************************-->
    <el-dialog  v-dialogDrag title="投诉详情" v-if="complaininfo" :visible.sync="complaininfo">
      <complaininfo ref="" :complainid="complainid"></complaininfo>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="complaininfo = false" >取消</el-button>
      </div>
    </el-dialog>
    <!--**********************************************新增投诉***********************************************-->
    <el-dialog  v-dialogDrag title="投诉详情" v-if="complainadd" :visible.sync="complainadd" width="800px">
      <complaintadd ref="complainadd"></complaintadd>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="complainadd = false">取消</el-button>
        <el-button size="small" type="primary"  @click="complainsaveadd">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import complaintreply from './Complaint/reply'
import complaininfo from './Complaint/complaininfo'
import complaintadd from './Complaint/complaintadd'

export default {
  name: 'ComplaintsReport',
  data () {
    return {
      ModuleList: '',
      page: {
        index: 1, // 当前页数
        size: 30, // 最大行数
        page: 1, // 当前页数
        records: 0, // 总条目数
        total: 0 // 总页数
      },
      keyword: '',
      typeInUid: '',
      companyInfor: '',
      reply: false,
      complaininfo: false,
      complainadd: false,
      complainid: ''
    }
  },
  components: {
    complaintreply,
    complaininfo,
    complaintadd
  },
  methods: {
    // 获取表格数据
    getPageList (data) { // /api/complain/findPagerList
      this.sendAxios({
        url: '/api/complain/findPagerList',
        method: 'post',
        data: {
          keyword: data.keyword || '',
          pagination: data.pagination || '',
          typeInUid: data.typeInUid || ''
        }
      })
        .then(res => {
          this.page.records = res.records
          this.page.page = res.page
          this.ModuleList = res
        })
    },
    // 投诉回复点击事件
    replyfun (index, row) {
      this.reply = true
      this.complainid = row.id
    },
    // 删除投诉
    complaindel (index, row) {
      this.$confirm('此操作将永久删除该该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(_ => {
        this.sendAxios({
          url: '/api/complain/delete',
          method: 'post',
          data: {
            keyValue: row.id
          }
        })
          .then(res => {
            this.$message({
              type: 'success',
              message: `操作成功`
            })
            let listData = {
              pagination: JSON.stringify({
                rows: this.page.size,
                page: this.page.index,
                sidx: 'id'
              })
            }
            this.getPageList(listData)
          })
      })
    },
    // 查看详情点击事件
    complainInfor (index, row) {
      this.complaininfo = true
      this.complainid = row.id
    },
    // 新增投诉
    complainaddfun () {
      this.complainadd = true
    },
    // 回复投诉方法
    savecomplain () {
      let self = this
      self.$refs.complaintreply.savereplay(function (res) {
        if (res.code == 200) {
          self.reply = false
          self.$message({
            type: 'success',
            message: `回复成功`
          })
        }
      })
    },
    // 保存function
    complainsaveadd () {
      let self = this
      this.$refs.complainadd.complainsave(function (res) {
        if (res.code == 200) {
          self.complainadd = false
          self.$message({
            type: 'success',
            message: `新增投诉成功`
          })
          let listData = {
            pagination: JSON.stringify({
              rows: self.page.size,
              page: self.page.index,
              sidx: 'id'
            })
          }
          self.getPageList(listData)
        }
      })
    },
    //  搜索
    searchfun () {
      let listData = {
        keyword: this.keyword,
        typeInUid: this.typeInUid,
        pagination: JSON.stringify({
          rows: this.page.size,
          page: this.page.index,
          sidx: 'id'
        })
      }
      this.getPageList(listData)
    }

  },
  created () {
    let listData = {
      pagination: JSON.stringify({
        rows: this.page.size,
        page: this.page.index,
        sidx: 'id'
      })
    }
    this.getPageList(listData)
  }
}
</script>

<style scoped lang="scss">
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
          padding: 10px;
        }
        .foodPage {
          text-align: right;
          width: 100%;
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
        .complany{
          display: inline-block;
          width: 150px;
        }
        > p {
          padding: 5px 10px;
          border-bottom: 1px solid $border_color3;
          text-align: left;
        }
        .conentHtml{
          .more{
            display: none;
          }
        }
        .left{
          width: 55%;
        }
        .right {
          float: right;
          text-align: right;
          width: 40%;
          .btn {
            width: (100% / 3);
          }
        }
        > div {
          padding: 5px 10px;
          display: inline-block;
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
</style>
