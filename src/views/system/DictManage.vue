<template>
  <div style="height: 100%">
    <el-container>
      <el-aside width="200px" class="leftConent">
        <div>
          <p>字典管理</p>
          <el-tree :data="ModuleTree" :props="ModuleTreeProps" @node-click="handleNodeClick"></el-tree>
        </div>
      </el-aside>
      <el-main class="conent">
        <div>
          <div class="head">
            <p>功能目录</p>
            <div class="left">
              <el-input
                placeholder="请输入内容"
                size="small"
                v-model="ModuleKeyword">
                <i slot="prefix" class="el-input__icon el-icon-search"></i>
              </el-input>
            </div>
            <div class="right">
              <el-button @click="setModule()" class="btn" size="small" icon="el-icon-edit">
                新增
              </el-button>
              <el-button @click="showClassModule()" class="btn" size="small" icon="el-icon-edit">
                分类管理
              </el-button>
            </div>
          </div>
          <div class="conentHtml">
            <el-table
              style="width: 100%"
              :data="tableData"
              stripe
              size="small"
              border>
              <el-table-column
                :label="item.label"
                :prop="item.prop"
                :width="item.width"
                v-for="item in listColumnData" :key="item.prop">
              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                width="200">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="edit(scope)">编辑</el-button>
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
      title="字典分类管理"
      :visible.sync="showClass"
      v-if="showClass"
      width="60%"
    >
      <div style="margin: 20px 0; text-align: right">
        <el-button @click="addClassify()" class="btn" size="small" icon="el-icon-edit">
          新增
        </el-button>
      </div>
      <el-table
        :data="classTableData"
        border
      >
        <el-table-column
          :label="item.label"
          :prop="item.prop"
          v-for="item in classListColumnData" :key="item.prop">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="200">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="edit(scope)">编辑</el-button>
            <el-button type="text" size="small" @click="deleteModule(scope)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog
      title="管理模块数据"
      :visible.sync="setModuleShow"
      v-if="setModuleShow"
      width="40%">
      <el-form ref="form" :model="moduleData" size="mini" label-position="left" label-width="100px">
        <el-form-item label="项目名称">
          <el-input class="formCell" v-model="moduleData.itemName"></el-input>
        </el-form-item>
        <el-form-item label="项目值">
          <el-input class="formCell" v-model="moduleData.itemValue"></el-input>
        </el-form-item>
        <el-form-item label="简拼">
          <el-input class="formCell" v-model="moduleData.simpleSpelling"></el-input>
        </el-form-item>
        <el-form-item label="排序值">
          <el-input class="formCell" v-model="moduleData.sortCode"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            type="textarea"
            :rows="1"
            placeholder="请输入内容"
            v-model="moduleData.description">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitModuleData()">提交</el-button>
          <el-button @click="setModuleShow=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      title="管理分类数据"
      :visible.sync="addClass"
      v-if="addClass"
      width="40%">
      <el-form ref="form" :model="classData" size="mini" label-position="left" label-width="100px">
        <el-form-item label="上级">
          <el-select v-model="classData.parentId" placeholder="请选择">
            <el-option
              v-for="item in classTableData"
              :key="item.itemId"
              :label="item.itemName"
              :value="item.itemId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名称">
          <el-input class="formCell" v-model="classData.itemName"></el-input>
        </el-form-item>
        <el-form-item label="编码">
          <el-input class="formCell" v-model="classData.itemCode"></el-input>
        </el-form-item>
        <el-form-item label="排序值">
          <el-input class="formCell" v-model="classData.sortCode"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            type="textarea"
            :rows="1"
            placeholder="请输入内容"
            v-model="classData.description">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitClass()">提交</el-button>
          <el-button @click="setModuleShow=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: 'DictManage', // 部门管理
  props: ['obj'],
  data () {
    return {
      listColumnData: [
        {
          label: '项目名称',
          prop: 'itemName',
          width: '180px',
          align: 'left'
        },
        {
          label: '项目值',
          prop: 'itemValue',
          width: '180px',
          align: 'left'
        },
        {
          label: '简拼',
          prop: 'simpleSpelling',
          width: '',
          align: 'left'
        },
        {
          label: '排序',
          prop: 'sortCode',
          width: '',
          align: 'left'
        },
        {
          label: '备注',
          prop: 'description',
          width: '',
          align: 'left'
        }
      ],
      classListColumnData: [
        {
          label: '名称',
          prop: 'itemName',
          width: '180px',
          align: 'left'
        },
        {
          label: '编号',
          prop: 'itemCode',
          width: '180px',
          align: 'left'
        },
        {
          label: '排序',
          prop: 'sortCode',
          width: '',
          align: 'left'
        },
        {
          label: '备注',
          prop: 'description',
          width: '',
          align: 'left'
        }
      ],
      classData: {
        parentId: '',
        itemName: '',
        itemCode: '',
        sortCode: 0,
        description: '',
        isTree: 0
      },
      moduleData: {
        itemName: '',
        itemValue: '',
        simpleSpelling: '',
        sortCode: 0,
        enabledMark: 1,
        description: '',
        parentId: '',
        itemId: ''
      },
      showClass: false,
      addClass: false,
      classTableData: [],
      treeId: '',
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
      setModuleShow: false,
      tableData: [],
      updateId: ''
    }
  },
  watch: {
    ModuleKeyword () {
      this.handleNodeClick()
    }
  },
  methods: {
    submitModuleData () {
      if (this.treeId === '') return
      this.moduleData.itemId = this.treeId
      let self = this
      this.sendAxios({
        url: '/api/dataItem/saveDetailForm',
        method: 'post',
        data: this.moduleData
      }).then(res => {
        self.setModuleShow = false
        self.moduleData = {}
        this.getTreeNodeData(self.treeId)
      })
    },
    addClassify () {
      this.addClass = true
    },
    setModule () {
      this.setModuleShow = true
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
    edit (scope) {
      this.setModuleShow = true
      this.moduleData = scope.row
    },
    deleteModule (scope) {
      let self = this
      console.log(scope)
      this.$confirm('确认删除？')
        .then(_ => {
          this.sendAxios({
            url: '/api/dataItem/deleteDetail',
            method: 'post',
            data: {
              keyValue: scope.row.itemDetailId
            }
          })
            .then(e => {
              self.$message({
                message: '删除成功',
                type: 'success',
                showClose: this
              })
              self.getTreeNodeData(this.treeId)
            })
            .catch(e => {
              console.log(e)
            })
        })
        .catch(_ => {
        })
    },
    showClassModule () {
      this.showClass = true
      let self = this
      this.sendAxios({
        url: '/api/dataItem/getClassifyList',
        method: 'post'
      }).then(res => {
        self.classTableData = res
      })
    },
    /**
       * 点击左侧列表方法
       * @param res
       */
    handleNodeClick (res) {
      this.treeId = (res && res.id) || this.treeId || ''
      if (this.treeId === '') return
      if (!res.hasChildren) {
        this.getTreeNodeData(res.id)
      }
    },
    forData (moduleFormSuperiorData) {
      for (let form of moduleFormSuperiorData) {
        if (form.childNodes.length === 0) {
          form.childNodes = null
        } else {
          this.forData(form.childNodes)
        }
      }
      return moduleFormSuperiorData
    },
    getDictTree () {
      let self = this
      this.sendAxios({
        url: '/api/dataItem/tree',
        method: 'post'
      })
        .then(res => {
          self.ModuleTree = res
        })
    },
    getTreeNodeData (nodeId) {
      let self = this
      this.sendAxios({
        url: '/api/dataItem/itemdetail',
        method: 'post',
        data: {
          itemId: nodeId,
          pagination: JSON.stringify({
            rows: this.page.size,
            page: this.page.index,
            sidx: 'itemId'
          }),
          keyword: ''
        }
      })
        .then(res => {
          self.tableData = res.rows
          self.page.page = res.page
          self.page.total = res.total
          self.page.records = res.records
        })
    },
    submitClass () {
      let self = this
      this.sendAxios({
        url: '/api/dataItem/SaveClassifyForm',
        method: 'post',
        data: this.classData
      }).then(res => {
        console.log(res)
      })
    }
  },
  created () {
    this.getDictTree()
    this.ModuleParentId = 0
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
      .ViewFood {
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
