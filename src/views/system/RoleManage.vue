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
              <el-button size="small" icon="el-icon-circle-plus" @click.native="roleaddfun()">新增</el-button>
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
              <el-table-column prop="enCode" label="角色编号"></el-table-column>
              <el-table-column prop="fullName" label="角色名称"></el-table-column>
              <el-table-column prop="createDate" label="创建时间"></el-table-column>
              <el-table-column prop="createUserName" label="创建人"></el-table-column>
              <el-table-column label="有效">
                <template slot-scope="scope"><el-switch disabled :inactive-value="0" :active-value="1" v-model="scope.row.enabledMark"></el-switch></template>
              </el-table-column>
              <el-table-column prop="Description" label="角色描述"></el-table-column>
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
    <!--&lt;!&ndash;***********************************************新增组件***********************************************&ndash;&gt;-->
    <el-dialog title="新增" v-if="roleadd"  :visible.sync="roleadd" width="750px">
      <add ref="roleaddinfo"></add>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="roleadd = false">取 消</el-button>
        <el-button size="small" type="primary" @click.stop="addsavefun">确 定</el-button>
      </div>
    </el-dialog>
    <!--&lt;!&ndash;***********************************************编辑组件***********************************************&ndash;&gt;-->
    <!--<el-dialog title="新增" v-if="complanyedit"  :visible.sync="complanyedit" width="750px">-->
      <!--<complanyedit ref="complanyAdd" :editData="editData"></complanyedit>-->
      <!--<div slot="footer" class="dialog-footer">-->
        <!--<el-button size="small" @click="complanyedit = false">取 消</el-button>-->
        <!--<el-button size="small" type="primary" @click.stop="complanyeditokfun">确 定</el-button>-->
      <!--</div>-->
    <!--</el-dialog>-->
  </div>
</template>

<script>
import add from './RoleManage/roleadd'

export default {
  name: 'RoleManage',
  components: {
    add
  },
  data () {
    return {
      searchinfo: '', // 查询字段
      roleadd: false,
      page: {
        index: 1, // 当前页数
        size: 30, // 最大行数
        page: 1, // 当前页数
        records: 0, // 总条目数
        total: 0 // 总页数
      },
      ModuleList: ''
    }
  },
  methods: {
    // 获取首页表格数据
    getrolelist (data) {
      this.sendAxios({
        url: '/api/role/getPageList',
        method: 'post',
        data: {
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
    // 点击新增的方法
    roleaddfun () {
      this.roleadd = true
    },
    //  新增保存的方法
    addsavefun () {
      let self = this
      self.$refs.roleaddinfo.roleaddsave(function (res) {
        self.roleadd = false
      })
    }

  },
  created () {
    let userdata = {
      pagination: JSON.stringify({
        rows: this.page.size,
        page: this.page.index,
        sidx: 'id'
      })
    }
    this.getrolelist(userdata)
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
