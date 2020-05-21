<template>
  <div style="height: 100%" class="col-layer">
    <div class="col-header">
      <el-button size="small" @click="dialogVisible = true" icon="el-icon-circle-plus" >新增</el-button>
    </div>
    <!--左侧栏目列表-->
    <el-row class="tac">
      <el-col :span="24">
        <el-tree :data="columnList" accordion :props="defaultProps"  @node-click="selectTree"></el-tree>
      </el-col>
    </el-row>

    <div class="layer-temp">
      <!--栏目右侧管理内容-->
      <el-table :data="tableData.result" style="width: 100%"
                stripe
                size="small"
                border>
        <el-table-column align="center" prop="code" label="编号"></el-table-column>
        <el-table-column align="center" prop="name" label="名称"></el-table-column>
        <el-table-column align="center" prop="username" label="审批发起人"></el-table-column>
        <el-table-column align="center" prop="approversname" label="审批人列表" width="180"></el-table-column>
        <el-table-column align="center" label="是否审批">
          <template slot-scope="scope">
            <el-switch active-color="#13ce66" inactive-color="#ff4949"  :active-value="1" :inactive-value="0"  v-model="scope.row.isCheck"></el-switch>
          </template>
        </el-table-column>
        <el-table-column align="center" label="上下架状态" width="180">
          <template slot-scope="scope">
            <el-switch active-color="#13ce66" inactive-color="#ff4949"  :inactive-value="0" :active-value="1" v-model="scope.row.state"></el-switch>
          </template>
          <!--<el-switch v-model="scope.row.state"></el-switch>-->
        </el-table-column>
        <el-table-column align="center" width="180" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope)">编辑</el-button>
            <el-button size="mini" @click="handleDelete(scope)" type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!--新增栏目弹层-->
    <el-dialog
      title="栏目新增"
      :visible.sync="dialogVisible"
      width="40%"
      :close-on-press-escape="false"
      :lock-scroll="false"
      :close-on-click-modal="false"
      top="9vh">
      <div class="form">
        <el-form ref="form" :model="form" label-width="85px">
          <el-form-item label="编号">
            <el-input v-model="form.code"></el-input>
          </el-form-item>
          <el-form-item label="名称">
            <el-input v-model="form.name" style="width: 100%"></el-input>
          </el-form-item>
          <el-form-item label="上级">
            <el-cascader
              v-model="superior"
              :options="options"
              change-on-select
              :props="props" @change="superiorfun">
            </el-cascader>
          </el-form-item>
          <el-form-item label="审批发起人">
            <el-cascader
              v-model="fullNamedata"
              :options="approvalList"
              :props="propsList" @change="fullNameDatafun">
            </el-cascader>
          </el-form-item>

          <el-form-item label="审批人列表">
            <!--<div style="float: left">-->
            <el-select v-model="realNamearr" multiple placeholder="请选择"  @change="realnamefun">
              <el-option
                v-for="item in approvalItem"
                :key="item.userId"
                :label="item.realName"
                :value="item.userId"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <!--</div>-->
          <!--<div style="margin-left: 80px;float: left">-->
          <el-form-item label="是否审批">
            <el-switch v-model="isCheck" @change="statusfun"></el-switch>
          </el-form-item>
          <!--</div>-->
          <!--<div style="margin-left: 80px;float: left">-->
          <el-form-item label="上下架状态">
            <el-switch v-model="statedata" @change="UpperAndLowerFrames"></el-switch>
          </el-form-item>
          <!--</div>-->
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="columnSave">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'column',
  data () {
    return {
      value2: true,
      dialogVisible: false,
      columnList: [], // 栏目列表
      options: [], // //栏目选择
      approvalList: [], // 审批发起人
      approvalItem: [], // 审批人列表
      value4: [],
      fullNamedata: [],
      superior: [],
      realNamearr: [],
      isCheck: '0',
      statedata: '0',
      form: {
        code: '', // 编号
        name: '', // 名称
        parentId: 0, // 上级ID
        originatorUserId: '', // 审批发起人ID
        approvers: '', // 审批人列表ID
        // realName: '', // 审批人列表人员
        isCheck: 0, // 是否审批
        state: 0 // 上下架状态
      }, // 新增栏目
      tableData: [], // 栏目管理
      props: {
          label: 'name',
          value: 'id',
        children: 'subset'
      },
      propsList: {
        label: 'fullName',
        value: 'originator_user_id',
        children: 'subset'
      },
      items: [],
      defaultProps: {
        label: 'name',
        value: 'id',
        children: 'subset'
      }
    }
  },
  methods: {
    // 树形菜单监听
    selectTree (data) {
      this.sendAxios({
        url: this.$root.base_wechat + '/api/column/findColumns',
        method: 'get',
        data: {
          page: 1,
          limit: 10,
          id: data.id
        }
      })
        .then(res => {
          this.tableData = res
        })
    },
    // 监听状态
    statusfun (val) {
      if (val === true) {
        this.form.isCheck = 1
      } else {
        this.form.isCheck = 0
      }
    },
    // 上下架状态监听
    UpperAndLowerFrames (val) {
      if (val === true) {
        this.form.state = 1
      } else {
        this.form.state = 0
      }
    },

    // 监听审批发起人
    fullNameDatafun (val) {
      this.form.originatorUserId = val[val.length - 1]
    },
    // 监听上级
    superiorfun (val) {
      this.form.parentId = val[val.length - 1]
    },
    // 新增弹层里面监听审批人列表
    realnamefun (val) {
      this.form.approvers = val.toString()
    },

    // 新增弹层里面审批人列表
    itemData () {
      this.sendAxios({
        url: this.$root.base_wechat + '/api/ding/select',
        method: 'get',
        data: {
          page: 1,
          limit: 10
        }
      })
        .then(res => {
          console.log(res.result)
          this.approvalItem = res.result
        })
    },
    // 新增弹层里面审批发起人
    approvalData () {
      this.sendAxios({
        url: this.$root.base_wechat + '/api/ding/selects',
        method: 'get',
        data: {
          page: 1,
          limit: 10
        }
      })
        .then(res => {
          console.log(res.result);
          this.approvalList = res.result
        })
    },

    // 左侧展示栏目数据api
    columnData () {
      this.sendAxios({
        url: this.$root.base_wechat + '/api/column/findColumn'
      })
        .then(res => {
          console.log(res.result)
          this.columnList = res.result
        })
    },

    // 右侧栏目展示内容
    getgetData (data) {
      this.sendAxios({
        url: this.$root.base_wechat + '/api/column/findColumns',
        method: 'get',
        data: {
          page: 1,
          limit: 10
        }
      })
        .then(res => {
          console.log(res.result)
          this.tableData = res
        })
    },

    // 保存新增
    columnSave () {
      console.log(this.form)
      let self = this
      self.sendAxios({
        url: self.$root.base_wechat + '/api/column/save',
        method: 'post',
        data: {
          mlNewsTypeForm: JSON.stringify(self.form)
        }
      })
        .then(res => {
          this.$message({
            message: '保存成功',
            type: 'success',
            showClose: this
          })
          self.dialogVisible = false
          self.getgetData()
          self.columnData()
        })
    },

    // 修改页面数据
    handleEdit (scope) {
      this.sendAxios({
        url: this.$root.base_wechat + '/api/column/findbyid',
        method: 'get',
        data: {
          id: scope.row.id
        }
      })
        .then(res => {
          this.form = res.result
          this.dialogVisible = true
          this.realNamearr = res.result.approvers.split(',')
        })
        .catch(e => {
          // console.log(e)
        })
    },

    // 删除页面数据
    handleDelete (scope) {
      this.$confirm('确认删除？')
        .then(_ => {
          this.sendAxios({
            url: this.$root.base_wechat + '/api/column/delColumn',
            method: 'get',
            data: {
              iditem: scope.row.id
            }
          })
            .then(e => {
              this.$message({
                message: '删除成功',
                type: 'success',
                showClose: this
              });
              this.getgetData()
              this.columnData()
            })
            .catch(e => {
              // console.log(e)
            })
        })
        .catch(_ => {})
    },

    // 获取上级数据
    optionData () {
      let self = this;
      self.sendAxios({
        url: self.$root.base_wechat + '/api/column/findColumn'
      })
        .then(res => {
          self.options = res.result
        })
    }
  },
  created () {
    this.columnData();
    this.optionData();
    this.approvalData();
    this.itemData();
    this.getgetData()
  }
}
</script>

<style scoped lang="scss">
  .col-header{
    background-color: #F8F8F8;
    line-height: 50px;
    font-size: 14px;
    padding: 0 20px;
    color: #000;
    text-align: right;
  }
  .tac{
    float: left;
    width: 200px;
  }
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 667px;
  }
  .layer-temp{
    margin-left: 205px;

  }
</style>

<style lang="scss">
  /*新增弹层*/
  .el-dialog__headerbtn{
    top: 15px;
  }
  .el-dialog{
    overflow: hidden;
  }
  .el-dialog__header{
    padding: 10px 20px;
  }
  .el-dialog__body{
    overflow: hidden;
    padding: 15px 20px;
  }
  .ke-toolbar{
    .ke-hr{
      clear: none;
    }
  }
</style>
