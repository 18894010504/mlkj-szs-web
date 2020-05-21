<template>
  <div>
    <el-steps :active="stape" simple>
      <el-step title="系统功能" icon="el-icon-circle-check"></el-step>
      <el-step title="系统按钮" icon="el-icon-circle-check"></el-step>
      <el-step title="系统视图" icon="el-icon-circle-check"></el-step>
    </el-steps>
    <div class="userTree">
      <el-tree
        :data="treeData"
        show-checkbox
        node-key="id"
        ref="tree"
        default-expand-all
        :props="defaultProps">
      </el-tree>
    </div>
  </div>
</template>

<script>
export default {
  name: 'authorization',
  props: ['authordata'],
  data () {
    return {
      treeData: [],
      stape: 1,
      defaultProps: {
        children: 'childNodes',
        label: 'text'
      },
      buttonList: '', // 系统按钮
      columnList: '', // 系统视图
      moduleList: '', // 系统功能
      objectId: '', // 用户主键
      strModuleId: [], // 功能主键
      strModuleButtonId: [], // 按钮主键
      strModuleColumnId: [] // 视图列主键

    }
  },
  methods: {
    modulechecktree () {
      this.sendAxios({
        url: '/api/module/getModuleCheckTree',
        method: 'post'
      })
        .then(res => {
          this.treeData = res.moduleList
          this.buttonList = res.buttonList // 系统按钮
          this.columnList = res.columnList // 系统视图
          this.moduleList = res.moduleList // 系统功能
          this.objectId = this.authordata.userId
        })
    },
    nextbtn (fun) {
      if (this.stape === 1) {
        this.strModuleId = this.$refs.tree.getCheckedKeys()
      } else if (this.stape === 2) {
        this.strModuleButtonId = this.$refs.tree.getCheckedKeys()
        this.setCheckedKeys()
      }
      this.stape = this.stape + 1
      if (this.stape === 2) {
        this.treeData = this.buttonList
        this.setCheckedKeys()
        fun(this.stape)
      } else if (this.stape >= 3) {
        this.treeData = this.columnList
        this.setCheckedKeys()
        fun(this.stape)
      }
    },
    parentbtn (fun) {
      this.stape = this.stape - 1
      if (this.stape <= 1) {
        this.treeData = this.moduleList
        this.setCheckedKeys()
        fun(this.stape)
      } else if (this.stape === 2) {
        this.treeData = this.buttonList
        this.setCheckedKeys()
        fun(this.stape)
      }
    },
    toGrantAuthorization (fun) {
      this.strModuleColumnId = this.$refs.tree.getCheckedKeys()
      this.sendAxios({
        url: '/api/user/saveAuthorizeForm',
        method: 'post',
        data: {
          objectId: this.objectId,
          strModuleId: this.strModuleId,
          strModuleButtonId: this.strModuleButtonId,
          strModuleColumnId: this.strModuleColumnId

        }
      })
        .then(res => {
          let suc = '授权成功'
          this.$message({
            type: 'success',
            message: `数据添加成功`
          })
          fun(suc)
        })
    },
    GetAuthorize () {
      let self = this
      self.sendAxios({
        url: '/api/user/GetAuthorizeData',
        method: 'post',
        data: {
          objectId: this.objectId
        }
      })
        .then(res => {
          self.strModuleButtonId = res.buttons
          self.strModuleColumnId = res.columns
          self.strModuleId = res.modules
          this.setCheckedKeys()
        })
    },
    setCheckedKeys () {
      if (this.stape === 1) {
        this.$refs.tree.setCheckedKeys(this.strModuleId)
      } else if (this.stape === 2) {
        this.$refs.tree.setCheckedKeys(this.strModuleButtonId)
      } else if (this.stape === 3) {
        this.$refs.tree.setCheckedKeys(this.strModuleColumnId)
      }
    }
  },
  created () {
    this.objectId = this.authordata.userId
    this.modulechecktree()
    this.GetAuthorize()
  }
}
</script>

<style scoped lang="">
.userTree{
  width: 100%;
  height: 500px;
  overflow: auto;
}
</style>
