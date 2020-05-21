<template>
  <div style="height: 100%">
    <el-container>
      <el-aside width="200px" class="leftConent">
        <div>
          <p>公司信息</p>
          <el-tree :data="ModuleTree" :props="defaultProps" @node-click="selectTree"></el-tree>
        </div>
      </el-aside>
      <el-main class="conent">
        <div>
          <div class="head">
            <p>{{nodedata}}-用户信息</p>
            <div class="left">
              <el-select class="complany" v-model="value"  size="small" placeholder="====未选择==="  @change="departmentIdfun">
                <el-option
                  v-for="item in department"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <el-input
                class="complany"
                placeholder="请输入内容"
                size="small"
                v-model="companyInfor">
                <i slot="prefix" class="el-input__icon el-icon-search"></i>
              </el-input>
              <el-button class="" v-model="selinfo" size="small" type="primary" icon="el-icon-search" @click="seltable">查询</el-button>
            </div>
            <div class="right">
              <el-button size="small" @click.native="useraddfun()" icon="el-icon-circle-plus">新增</el-button>
            </div>
          </div>
          <!--<table></table>-->
          <div class="conentHtml">
            <el-table
              style="width: 100%"
              :data="ModuleList.rows"
              stripe
              size="small"
              border>
              <el-table-column type="index" :ModuleList="ModuleList+1" label="序号"></el-table-column>
              <el-table-column prop="account" label="账号"></el-table-column>
              <el-table-column prop="realName" label="姓名"></el-table-column>
              <el-table-column prop="gender" label="性别" :formatter="formatSex"></el-table-column>
              <el-table-column prop="mobile" label="手机"></el-table-column>
              <el-table-column prop="enCode" label="部门"></el-table-column>
              <el-table-column label="状态">
                <template slot-scope="scope"><el-switch disabled :inactive-value="0" :active-value="1" v-model="scope.row.enabledMark"></el-switch></template>
              </el-table-column>
              <el-table-column prop="description" label="备注"></el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                width="300">
                <template slot-scope="scope">
                  <el-button-group>
                    <el-button size="mini" type="primary" icon="el-icon-edit"  @click.native.prevent="usereditfun(scope.$index, scope.row)">编辑</el-button>
                    <el-button size="mini" type="danger" icon="el-icon-delete"  @click.native.prevent="userdel(scope.$index, scope.row)">删除</el-button>
                      <el-dropdown trigger="click">
                        <span class="el-dropdown-link">
                          <el-button size="mini" icon="el-icon-share">更多</el-button>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item class="clearfix" @click.native="disableAccount(scope.$index, scope.row)">禁用账户</el-dropdown-item>
                          <el-dropdown-item class="clearfix" @click.native="enableAccount(scope.$index, scope.row)">启用账户</el-dropdown-item>
                          <el-dropdown-item class="clearfix" @click.native="resetPw(scope.$index, scope.row)">重置密码</el-dropdown-item>
                          <el-dropdown-item class="clearfix" @click.native="authorization(scope.$index, scope.row)">角色授权</el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
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
    <el-dialog title="新增" v-if="useradd"  :visible.sync="useradd" width="680px">
      <add ref="userAdd" :company="company"></add>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogFormVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="userinfoAdd">确 定</el-button>
      </div>
    </el-dialog>
    <!--***********************************************编辑组件***********************************************-->
    <el-dialog title="编辑" v-if="useredit" :visible.sync="useredit" width="680px">
      <edit ref="editor" :editData="editData"></edit>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogFormVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click.native="editfun">确 定</el-button>
      </div>
    </el-dialog>
    <!--***********************************************用户授权组件***********************************************-->
    <el-dialog title="用户授权" v-if="author" :visible.sync="author" width="550px" height="800px">
      <author ref="author" :authordata="authordata"></author>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" :disabled="laststape" @click="laststap">上一步</el-button>
        <el-button size="small" :disabled="nextdata" @click="nexfun" >下一步</el-button>
        <el-button size="small" :disabled="okstatus" type="primary" @click="grantAuthorfun">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import add from './userManage/add'
import edit from './userManage/edit'
import author from './userManage/authorization'

export default {
  name: 'UserManage',
  components: {
    add,
    edit,
    author
  },
  data () {
    return {
      value: '',
      company: {
        departmentId: '', // 公司id
        departmentCode: '' // 公司code
      },
      companyInfor: '',
      department: [],
      ModuleTree: [],
      ModuleList: [],
      useradd: false, // 用户添加弹出层状态
      useredit: false, // 用户编辑弹出层状态
      author: false, // 用户授权弹出层状态
      nodedata: '',
      page: {
        index: 1, // 当前页数
        size: 30, // 最大行数
        page: 1, // 当前页数
        records: 0, // 总条目数
        total: 0 // 总页数
      },
      defaultProps: {
        label: 'fullName',
        value: 'departmentId'
      },
      editData: '', // 编辑用户信息数据
      authordata: '',
      laststape: true,
      nextdata: false,
      okstatus: true,
      selinfo: '', // 搜索关键字
      departmentId: ''
    }
  },
  watch: {
    companyInfor (val) {
      let userdata = {
        departmentId: this.departmentId,
        keyword: val,
        pagination: JSON.stringify({
          rows: this.page.size,
          page: this.page.index,
          sidx: 'id'
        })
      }
      this.userList(userdata)
    }
  },
  methods: {
    // list转为树的方法
    toTree (data, parentId) {
      let tree = []
      let temp
      for (let i = 0; i < data.length; i++) {
        if (data[i].parentId == parentId) {
          let obj = data[i]
          obj.label = data[i].fullName
          obj.value = data[i].enCode
          temp = this.toTree(data, data[i].departmentId)
          if (temp.length > 0) {
            obj.children = temp
          }
          tree.push(obj)
        }
      }
      return tree
    },
    formatSex: function (row, column) {
      return row.gender == 1 ? '男' : row.gender == 0 ? '女' : '未知'
    },
    useraddfun () {
      if (this.company.departmentId !== '') {
        this.useradd = true
      } else {
        this.$message({
          type: 'warning',
          message: `请选择所属公司`
        })
      }
    },
    // 删除用户
    userdel (index, row) {
      let rowId = row.userId
      this.$confirm('此操作将永久删除该该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(_ => {
        this.sendAxios({
          url: '/api/user/deleteUser',
          method: 'post',
          data: {
            keyValue: rowId
          }
        })
          .then(res => {
            this.$message({
              type: 'success',
              message: `操作成功`
            })
            let dataList = {
              companyId: this.company.companyId,
              pagination: JSON.stringify({
                rows: this.page.size,
                page: this.page.index,
                sidx: 'id'
              })
            }
            this.userList(dataList)
          })
      })
        .catch(_ => {})
    },
    // 禁用账户
    disableAccount (index, row) {
      let self = this
      row.enabledMark = 0
      self.$confirm('你确定要禁用此账户？')
        .then(_ => {
          self.sendAxios({
            url: '/api/user/updateState',
            method: 'post',
            data: {
              state: row.enabledMark,
              keyValue: row.userId
            }
          })
            .then(res => {
              self.$message({
                type: 'success',
                message: `操作成功`
              })
            })
        })
        .catch(_ => {})
    },
    // 启用账户
    enableAccount (index, row) {
      let self = this
      row.enabledMark = 1
      self.sendAxios({
        url: '/api/user/updateState',
        method: 'post',
        data: {
          state: row.enabledMark,
          keyValue: row.userId
        }
      })
        .then(res => {
          self.$message({
            type: 'success',
            message: `操作成功`
          })
        })
    },
    // 重置密码
    resetPw (index, row) {
      this.$confirm('你确定要重置密码？')
        .then(_ => {
          this.sendAxios({
            url: '/api/user/resetPassword',
            method: 'post',
            data: {
              keyValue: row.userId
            }
          })
          this.$message({
            type: 'success',
            message: `密码重置成功`
          })
        })
        .catch(_ => {})
    },
    // 左侧部门树
    tree () {
      let self = this
      self.sendAxios({
        url: '/api/department/getCityDepartment',
        method: 'post'
      })
        .then(res => {
          self.ModuleTree = self.toTree(res, '')
        })
    },
    // 查询列表
    selectTree (data) {
      this.company.departmentId = data.departmentId
      this.company.departmentCode = data.enCode
      this.nodedata = data.text
      let userdata = {
        departmentId: data.departmentId,
        pagination: JSON.stringify({
          rows: this.page.size,
          page: this.page.index,
          sidx: 'id'
        })
      }
      this.userList(userdata)
      // this.branch(userdata, this.company.departmentCode)
    },
    // 用户列表查询
    userList (datas) {
      console.log(datas)
      this.sendAxios({
        url: '/api/user/pageUserList',
        method: 'post',
        data: {
          departmentId: datas.departmentId || '',
          pagination: datas.pagination,
          keyword: datas.keyword || ''
        }
      })
        .then(res => {
          this.ModuleList = res
          this.page.index = res.page
          this.page.total = res.total
          this.page.records = res.records
        })
    },
    // 部门列表请求接口
    branch (datas, complaycode) {
      this.sendAxios({
        url: '/api/department/itemDepartmentPull',
        method: 'post',
        data: {
          departmentId: datas.departmentId || ''
        }
      })
        .then(res => {
          let departArr = []
          for (let depart of res) {
            let departCode = ''
            if (depart.enCode == null && depart.enCode === 'undefined') {
              departCode = complaycode
            } else {
              departCode = depart.enCode
            }
            let departData = {
              id: depart.departmentId,
              value: departCode,
              label: depart.fullName
            }
            departArr.push(departData)
          }
          this.department = departArr
        })
    },
    // 添加信息
    userinfoAdd () {
      let then = this
      then.$refs.userAdd.addfun(function () {
        then.useradd = false
        let dataList = {
          departmentId: then.company.departmentId,
          pagination: JSON.stringify({
            rows: then.page.size,
            page: then.page.index,
            sidx: 'id'
          })
        }
        then.userList(dataList)
      })
    },
    // 编辑方法
    usereditfun (index, row) {
      let self = this
      self.useredit = true
      self.editData = row
    },
    editfun (fun) {
      let self = this
      self.$refs.editor.addsave(function (res) {
        self.useredit = false
      })
    },
    // 角色授权
    authorization (index, row) {
      this.author = true
      this.authordata = row
    },
    //  下一步方法
    nexfun () {
      let self = this
      this.$refs.author.nextbtn(function (res) {
        if (res >= 3) {
          self.nextdata = true
          self.laststape = false
          self.okstatus = false
        } else if (res === 2) {
          self.nextdata = false
          self.laststape = false
          self.okstatus = true
        } else if (res <= 1) {
          self.nextdata = false
          self.laststape = true
          self.okstatus = true
        }
      })
    },
    // 上一步的方法
    laststap () {
      let self = this
      this.$refs.author.parentbtn(function (res) {
        if (res >= 3) {
          self.nextdata = true
          self.laststape = false
          self.okstatus = false
        } else if (res === 2) {
          self.nextdata = false
          self.laststape = false
          self.okstatus = true
        } else if (res <= 1) {
          self.nextdata = false
          self.laststape = true
          self.okstatus = true
        }
      })
    },
    // 角色授权确定方法
    grantAuthorfun () {
      let self = this
      this.$refs.author.toGrantAuthorization(function (res) {
        self.author = false
      })
    },
    departmentIdfun (data) {
      let departmentIddata = {}
      departmentIddata = this.department.find((item) => {
        return item.value === data
      })
      this.departmentId = departmentIddata.id
    },
    // 搜索方法
    seltable () {
      let userdata = {
        departmentId: this.departmentId,
        pagination: JSON.stringify({
          rows: this.page.size,
          page: this.page.index,
          sidx: 'id'
        })
      }
      this.userList(userdata)
    }
  },
  created () {
    let then = this
    then.tree()
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
