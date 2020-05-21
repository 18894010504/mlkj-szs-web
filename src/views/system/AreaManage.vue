<template>
  <div style="height: 100%;">
  <el-container>
    <el-aside width="200px" class="leftConent">
      <div>
        <p>目录信息</p>
        <el-tree class="lefttree" :data="catalog" :props="defaultProps" @node-click="selectTree"></el-tree>
      </div>
      <!--@node-click="selectTree"-->
    </el-aside>
    <el-main class="conent">
      <div>
        <div class="head">
          <p>数据字典-{{selectData}}</p>
          <div class="left">
            <el-input
              class="complany"
              placeholder="请输入内容"
              v-model="keyword"
              size="small">
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
            <el-button class=""  size="small" type="primary" icon="el-icon-search" @click="search">查询</el-button>
          </div>
          <div class="right">
            <el-button size="small" icon="el-icon-circle-plus"  @click.native="areamangadd()">新增</el-button>
          </div>
        </div>
        <div class="conentHtml">
          <el-table
            height="calc(100vh - 220px)"
            style="width: 100%"
            :data="ModuleList.rows"
            stripe
            size="small"
            border>
            <el-table-column type="index" :ModuleList="ModuleList+1" label="序号"></el-table-column>
            <el-table-column prop="areaName" label="名称"></el-table-column>
            <el-table-column prop="nameJp" label="简拼"></el-table-column>
            <el-table-column prop="depth" label="树深度"></el-table-column>
            <el-table-column prop="longitude" label="经度"></el-table-column>
            <el-table-column prop="latitude" label="纬度"></el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="300">
              <template slot-scope="scope">
                <el-button-group>
                  <el-button size="mini" type="primary" icon="el-icon-edit"  @click.native.prevent="areaeditfun(scope.$index, scope.row)">编辑</el-button>
                  <el-button size="mini" type="danger" icon="el-icon-delete"  @click.native.prevent="areadel(scope.$index, scope.row)">删除</el-button>
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
  <!--***********************************************新增组件***********************************************-->
  <el-dialog title="新增" v-if="areaAdd"  :visible.sync="areaAdd" width="680px">
    <add ref="areaAdd" :parentId="treestatusid"></add>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="areaAdd = false">取 消</el-button>
      <el-button size="small" type="primary" @click="areainfoAdd">确 定</el-button>
    </div>
  </el-dialog>
  <!--***********************************************编辑组件***********************************************-->
    <el-dialog title="编辑" v-if="areaEdit" :visible.sync="areaEdit" width="680px">
      <edit ref="areaEdit" :resdata="editData"></edit>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogFormVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click.native="editfun">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import add from './AreaManage/areamanageadd'
import edit from './AreaManage/areamanageEdit'

export default {
  name: 'AreaManage',
  components: {
    add,
    edit
  },
  data () {
    return {
      keyword: '',
      treestatusid: '',
      ModuleList: '',
      areaAdd: false,
      areaEdit: false,
      editData: '',
      selectData: '未选择分类', // 所选数据字典值
      page: {
        index: 1, // 当前页数
        size: 30, // 最大行数
        page: 1, // 当前页数
        records: 0, // 总条目数
        total: 0 // 总页数
      },
      catalog: [],
      defaultProps: {
        children: 'childNodes',
        label: 'text'
      }
    }
  },
  methods: {
  //  获取左侧树的方法
    leftAddressFun () {
      this.sendAxios({
        url: '/api/areas/tree ',
        method: 'post'
      })
        .then(res => {
          this.catalog = res
        })
    },
    // 获取地域列表
    GeographicalList (data) {
      this.sendAxios({
        url: '/api/areas/itemAreas',
        method: 'post',
        data: {
          itemCode: data.itemCode || '',
          keyword: data.keyword || '',
          pagination: data.pagination || ''
        }
      })
        .then(res => {
          this.ModuleList = res
          this.page.index = res.page
          this.page.records = res.records
        })
    },
    // 点击左侧树
    selectTree (data) {
      console.log(data)
      this.treestatusid = data.parentId
      this.selectData = data.text
      let userdata = {
        itemCode: data.id,
        pagination: JSON.stringify({
          rows: this.page.size,
          page: this.page.index,
          sidx: 'id'
        })
      }
      this.GeographicalList(userdata)
    },
    //  新增的方法
    areamangadd () {
      if (this.treestatusid != '') {
        this.areaAdd = true
      } else {
        this.$message({
          type: 'warning',
          message: `请先选择左侧新增目标`
        })
      }
    },
    // 新增保存的方法
    areainfoAdd () {
      let self = this
      self.$refs.areaAdd.areasavefun(function (res) {
        self.areaAdd = false
        self.leftAddressFun()
        self.$message({
          type: 'success',
          message: `数据保存成功`
        })
      })
    },
    // 编辑的方法
    areaeditfun (index, row) {
      this.areaEdit = true
      this.editData = row
    },
    editfun () {
      let self = this
      self.$refs.areaEdit.areasavefun(function (res) {
        self.areaEdit = false
        self.leftAddressFun()
        self.$message({
          type: 'success',
          message: `数据保存成功`
        })
      })
    },
    // 删除的方法
    areadel (index, row) {
      this.sendAxios({
        url: '/api/areas/deleteAreas',
        method: 'post',
        data: {
          id: row.id
        }
      })
        .then(res => {
          this.$message({
            type: 'success',
            message: `数据删除成功`
          })
        })
    },
    // 查询的方法
    search () {
      let grographicaldata = {
        keyword: this.keyword,
        pagination: JSON.stringify({
          rows: this.page.size,
          page: this.page.index,
          sidx: 'id'
        })
      }
      this.GeographicalList(grographicaldata)
    }
  },
  created () {
    this.leftAddressFun()
    let grographicaldata = {
      pagination: JSON.stringify({
        rows: this.page.size,
        page: this.page.index,
        sidx: 'id'
      })
    }
    this.GeographicalList(grographicaldata)
  }

}
</script>

<style scoped lang="scss">
  .conent {
    width: 100%;
    line-height: initial;
    text-align: left;
    height: calc(100vh - 130px);
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
      height: calc(100vh - 130px);
      margin: 5px 0px 5px 5px;
      border: 1px solid $border_color3;
      overflow: scroll;
      overflow-x: hidden;
    }
    /*.lefttree{*/
      /*height: calc(100vh - 50px);*/
    /*}*/
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
