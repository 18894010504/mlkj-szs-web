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
                v-model="searchinfo"
                size="small">
                <i slot="prefix" class="el-input__icon el-icon-search"></i>
              </el-input>
              <el-button class="" size="small" type="primary" @click.native="searchfun" icon="el-icon-search">查询</el-button>
            </div>
            <div class="right">
              <el-button size="small" icon="el-icon-circle-plus" @click.native="complanyaddfun()">新增</el-button>
            </div>
          </div>
          <div class="conentHtml">
            <tree-table :data="tabledata" :columns="columns" border >
              <el-table-column
                fixed="right"
                label="操作"
                width="200">
                <template slot-scope="scope">
                  <el-button-group>
                    <el-button size="mini" type="primary" icon="el-icon-edit"  @click.native.prevent="complanyeditfun(scope.$index, scope.row)">编辑</el-button>
                    <el-button size="mini" type="danger" icon="el-icon-delete"  @click.native.prevent="complanydel(scope.$index, scope.row)">删除</el-button>
                  </el-button-group>
                </template>
              </el-table-column>
            </tree-table>
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
          <!--<div class="food">-->
            <!--<div class="foodNum">-->
              <!--当前页数 {{page.index}} / 查询到 {{page.records}} 条数据-->
            <!--</div>-->
          <!--</div>-->

        </div>
      </el-main>
    </el-container>
    <!--***********************************************新增组件***********************************************-->
    <el-dialog title="新增" v-if="complanyadd"  :visible.sync="complanyadd" width="750px">
      <add ref="complanyAdd"></add>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="complanyadd = false">取 消</el-button>
        <el-button size="small" type="primary" @click.stop="complanyokfun">确 定</el-button>
      </div>
    </el-dialog>
    <!--***********************************************编辑组件***********************************************-->
    <el-dialog title="新增" v-if="complanyedit"  :visible.sync="complanyedit" width="750px">
      <complanyedit ref="complanyAdd" :editData="editData"></complanyedit>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="complanyedit = false">取 消</el-button>
        <el-button size="small" type="primary" @click.stop="complanyeditokfun">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import treeTable from '@/components/TreeTable'
import add from './companyManage/complanyadd'
import complanyedit from './companyManage/complanyedit'

export default {
  name: 'CompanyManage',
  components: { treeTable, add, complanyedit},
  data () {
    return {
      columns: [
        {
          text: '公司名称',
          value: 'fullName'
        },
        {
          text: '公司简称',
          value: 'shortName'
        },
        {
          text: '公司性质',
          value: 'nature'
        },
        {
          text: '成立时间',
          value: 'createDate'
        }
      ],
      tabledata: [],
      page: {
        index: 1, // 当前页数
        size: 30, // 最大行数
        page: 1, // 当前页数
        records: 0, // 总条目数
        total: 0 // 总页数
      },
      searchinfo: '',
      complanyadd: false,
      complanyedit: false,
      editData: ''
    }
  },
  methods: {
    // list转为树的方法
    toTree (data, parentid) {
      let tree = []
      let temp
      for (let i = 0; i < data.length; i++) {
        if (data[i].parentId == parentid) {
          let obj = data[i]
          temp = this.toTree(data, data[i].companyId)
          if (temp.length > 0) {
            obj.children = temp
          }
          tree.push(obj)
        }
      }
      return tree
    },
    // 编辑的方法
    complanyeditfun (index, row) {
      this.complanyedit = true
      this.editData = row
    },
    complanyeditokfun () {
      let self = this
      self.$refs.complanyAdd.savefun(function (res) {
        self.complanyedit = false
        self.$message({
          type: 'success',
          message: `数据修改成功`
        })
        let pagedata = {
          pagination: JSON.stringify({
            rows: self.page.size,
            page: self.page.index,
            sidx: 'createDate'
          })
        }
        self.pagelistfun(pagedata)
      })
    },
    // 删除的方法
    complanydel (index, row) {
      console.log(row)
      let rowId = row.companyId
      this.$confirm('此操作将永久删除该该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(_ => {
          this.sendAxios({
            url: '/api/company/deleteCompany',
            method: 'post',
            data: {
              keyValue: rowId
            }
          })
            .then(res => {
              let pagedata = {
                pagination: JSON.stringify({
                  rows: this.page.size,
                  page: this.page.index,
                  sidx: 'createDate'
                })
              }
              this.pagelistfun(pagedata)
              this.$message({
                type: 'success',
                message: `数据删除成功`
              })
            })
        })
    },
    // 查询方法
    searchfun () {
      let searchdata = {
        keyword: this.searchinfo,
        pagination: JSON.stringify({
          rows: this.page.size,
          page: this.page.index,
          sidx: 'createDate'
        })
      }
      this.pagelistfun(searchdata)
    },
    pagelistfun (data) {
      let self = this
      self.sendAxios({
        url: '/api/company/findAllListCompany',
        method: 'post',
        data: {
          pagination: data.pagination || '',
          keyword: data.keyword || ''
        }
      })
        .then(res => {
          self.page.index = res.page
          self.page.records = res.records
          if (res.rows.length > 1) {
            let tree = self.toTree(res.rows, '')
            this.tabledata = tree
          } else {
            this.tabledata = res.rows
          }
        })
    },
    // 新增
    complanyaddfun () {
      this.complanyadd = true
    },
    complanyokfun () {
      let self = this
      self.$refs.complanyAdd.savefun(function (res) {
        self.complanyadd = false
        self.$message({
          type: 'success',
          message: `数据添加成功`
        })
        let pagedata = {
          pagination: JSON.stringify({
            rows: self.page.size,
            page: self.page.index,
            sidx: 'createDate'
          })
        }
        self.pagelistfun(pagedata)
      })
    }
  },
  created () {
    let pagedata = {
      pagination: JSON.stringify({
        rows: this.page.size,
        page: this.page.index,
        sidx: 'createDate'
      })
    }
    this.pagelistfun(pagedata)
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
