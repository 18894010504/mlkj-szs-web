<template>
  <div style="height: 100%">
    <el-container>
      <el-aside width="200px" class="leftConent">
        <div>
          <p>功能目录</p>
          <el-tree :data="ModuleTree" :props="ModuleTreeProps" @node-click="handleNodeClick"></el-tree>
        </div>
      </el-aside>
      <el-main class="conent">
        <div>
          <div class="head">
            <p>系统菜单</p>
            <div class="left">
              <el-input
                placeholder="请输入内容"
                size="small"
                v-model="ModuleKeyword">
                <i slot="prefix" class="el-input__icon el-icon-search"></i>
              </el-input>
            </div>
            <div class="right">
              <el-button @click="setModule('new')" class="btn" size="small" icon="el-icon-edit">
                新增
              </el-button>
            </div>
          </div>
          <div class="conentHtml">
            <el-table
              style="width: 100%"
              :data="ModuleList"
              stripe
              size="small"
              border>
              <el-table-column type="index" :index="ModuleIndex+1"></el-table-column>
              <el-table-column prop="enCode" label="编号"></el-table-column>
              <el-table-column prop="fullName" label="名称"></el-table-column>
              <el-table-column prop="urlAddress" label="地址"></el-table-column>
              <el-table-column prop="target" label="目标"></el-table-column>
              <el-table-column label="菜单">
                <template slot-scope="scope"><el-switch :inactive-value="0" :active-value="1" v-model="scope.row.isMenu"></el-switch></template>
              </el-table-column>
              <el-table-column label="展开">
                <template slot-scope="scope"><el-switch :inactive-value="0" :active-value="1" v-model="scope.row.allowExpand"></el-switch></template>
              </el-table-column>
              <el-table-column label="公共">
                <template slot-scope="scope"><el-switch :inactive-value="0" :active-value="1" v-model="scope.row.isPublic"></el-switch></template>
              </el-table-column>
              <el-table-column label="有效">
                <template slot-scope="scope"><el-switch :inactive-value="0" :active-value="1" v-model="scope.row.enabledMark"></el-switch></template>
              </el-table-column>
              <el-table-column prop="description" label="描述"></el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                width="100">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="seteModule(scope)">编辑</el-button>
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
    <el-dialog
      :title="ModulePopupText"
      :visible.sync="ModulePopupShow"
      width="70%">
      <module-view v-if="ModulePopupShow" :ModulePopupShow.sync="ModulePopupShow" ></module-view>
    </el-dialog>
    <el-dialog
      title="修改模块"
      :visible.sync="setModuleShow"
      v-if="setModuleShow"
      width="70%">
      <el-form ref="form" :model="setModuleData" :rules="setmoduleRules" size="mini" label-position="left" label-width="50px" >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="编号" prop="enCode">
              <el-input class="formCell" v-model="setModuleData.enCode"></el-input>
            </el-form-item>
            <el-form-item label="目标" prop="target">
              <el-select class="formCell" v-model="setModuleData.target" placeholder="请选择活动区域">
                <el-option label="expand" value="expand"></el-option>
                <el-option label="iframe" value="iframe"></el-option>
                <el-option label="open" value="open"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="上级">
              <el-cascader
                class="formCell"
                :options="ModuleTree"
                v-model="setModuleData.parentIdList"
                :props="ModuleTreeProps"
                change-on-select
                :show-all-levels="false"
              ></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="名称" prop="fullName">
              <el-input class="formCell" v-model="setModuleData.fullName"></el-input>
            </el-form-item>
            <el-form-item label="排序" prop="sortCode">
              <el-input type="number" class="formCell" v-model="setModuleData.sortCode"></el-input>
            </el-form-item>
            <el-form-item label="图标">
              <el-input class="formCell" v-model="setModuleData.icon"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="地址">
              <el-input class="formCell" v-model="setModuleData.urlAddress"></el-input>
            </el-form-item>
            <el-form-item label="选项">
              <el-checkbox :false-label="0" :true-label="1" v-model="setModuleData.isMenu">菜单</el-checkbox>
              <el-checkbox :false-label="0" :true-label="1" v-model="setModuleData.allowExpand">展开</el-checkbox>
              <el-checkbox :false-label="0" :true-label="1" v-model="setModuleData.isPublic">公共</el-checkbox>
              <el-checkbox :false-label="0" :true-label="1" v-model="setModuleData.enabledMark">有效</el-checkbox>
            </el-form-item>
            <el-form-item label="描述">
              <el-input
                type="textarea"
                :rows="2"
                placeholder="请输入内容"
                v-model="setModuleData.description">
              </el-input>
            </el-form-item>
            <el-form-item style="text-align: right">
              <el-button type="primary" @click="setsetModuleData()" >修改</el-button>
              <el-button @click="setModuleShow=false">取消</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import moduleView from '../../components/popupView/moduleView'

export default {
  name: 'SystemModule', // 系统模块
  components: {
    moduleView
  },
  props: ['obj'],
  data () {
    return {
      setmoduleRules: {
        enCode: [
          {
            required: true,
            message: '请输入编号',
            trigger: 'change'
          }
        ],
        target: [
          {
            required: true,
            message: '请输入目标',
            trigger: 'change'
          }
        ],
        fullName: [
          {
            required: true,
            message: '请输入名称',
            trigger: 'change'
          }
        ],
        sortCode: [
          {
            required: true,
            message: '请输入排序号',
            trigger: 'change'
          }
        ]
      },
      setModuleData: {
        icon: '',
        fullName: '',
        urlAddress: '',
        target: '',
        isMenu: 0,
        allowExpand: 0,
        isPublic: 0,
        enabledMark: 0,
        description: '',
        parentIdList: [],
        parentId: '',
        enCode: '',
        sortCode: ''
      },
      page: {
        index: 1, // 当前页数
        size: 30, // 最大行数
        page: 1, // 当前页数
        records: 0, // 总条目数
        total: 0 // 总页数
      },
      ModuleTree: [],
      ModuleList: [],
      ModuleParentId: 0,
      ModuleIndex: 0,
      ModuleRecords: 0,
      ModuleKeyword: '',
      ModuleTreeProps: {
        children: 'childNodes',
        label: 'text'
      },
      ModulePopupShow: false,
      ModulePopupText: '',
      setModuleShow: false
    }
  },
  watch: {
    ModuleKeyword () {
      this.handleNodeClick()
    },
    ModulePopupShow () {
      this.handleNodeClick()
    }
  },
  methods: {
    setsetModuleData () {
      console.log(this.setModuleData)
      this.sendAxios({
        url: '/api/module/saveForm',
        method: 'post',
        data: {
          moduleEntityJson: JSON.stringify(this.setModuleData),
          moduleButtonListJson: '',
          moduleColumnListJson: ''
        }
      })
        .then(e => {
          this.$message({
            message: '修改成功',
            type: 'success',
            showClose: this
          })
          this.setModuleShow = false
        })
        .catch(e => {
          console.log(e)
        })
    },
    seteModule (scope) {
      this.setModuleShow = true
      this.setModuleData = scope.row
      if (scope.row.parentId != 0) {
        this.setModuleData.parentIdList = [this.inquireModule(scope.row.parentId, this.ModuleTree).value]
      }
    },
    inquireModule (id, ModuleTree) {
      for (let mode of ModuleTree) {
        if (mode.id === id) {
          return mode
        }
        if (mode.childNodes) {
          this.inquireModule(id, mode.childNodes)
        }
      }
    },
    deleteModule (scope) {
      this.$confirm('确认删除？')
        .then(_ => {
          this.sendAxios({
            url: '/api/module/delete',
            method: 'post',
            data: {
              keyValue: scope.row.moduleId
            }
          })
            .then(e => {
              this.$message({
                message: '删除成功',
                type: 'success',
                showClose: this
              })
              this.handleNodeClick()
            })
            .catch(e => {
              console.log(e)
            })
        })
        .catch(_ => {})
    },
    /**
     * 点击左侧列表方法
     * @param res
     */
    handleNodeClick (res) {
      let _this = this
      if (res) {
        _this.ModuleParentId = res.id
      }
      this.sendAxios({
        url: '/api/module/getModuleListByParentId',
        method: 'post',
        data: {
          parentId: _this.ModuleParentId,
          keyword: _this.ModuleKeyword,
          pagination: JSON.stringify({
            rows: this.page.size,
            page: this.page.index,
            sidx: ''
          })
        }
      })
        .then(e => {
          _this.ModuleList = e.rows
          _this.page.page = e.page
          _this.page.total = e.total
          _this.page.records = e.records
        })
    },
    /**
     * 左上按钮方法
     * @param type
     */
    setModule (type) {
      switch (type) {
        case 'new':
          this.ModulePopupText = '添加功能'
          break
      }
      this.ModulePopupShow = true
    },
    forData (moduleFormSuperiorData) {
      for (let form of moduleFormSuperiorData) {
        if (form.childNodes) {
          this.forData(form.childNodes)
        } else {
          form.childNodes = null
        }
      }
      return moduleFormSuperiorData
    }
  },
  created () {
    this.$store.dispatch('getAllDepartment')
      .then(res => {
        this.ModuleTree = this.forData(res)
      })
    this.ModuleParentId = 0
    this.handleNodeClick()
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
</style>
