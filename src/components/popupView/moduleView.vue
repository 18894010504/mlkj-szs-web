<template>
    <div>
      <div class="head">
        <el-steps :active="pageIndex" simple finish-status="finish" >
          <el-step title="系统功能" @click.native="goPage(1)" ></el-step>
          <el-step title="系统按钮" @click.native="goPage(2)" ></el-step>
          <el-step title="系统视图" @click.native="goPage(3)" ></el-step>
        </el-steps>
      </div>
      <!--第一步-->
      <div class="form" v-show="pageIndex==1">
        <el-form ref="form" :model="moduleData" :rules="moduleRules" size="mini" label-position="left" label-width="50px" >
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="编号" prop="enCode">
                <el-input class="formCell" v-model="moduleData.enCode"></el-input>
              </el-form-item>
              <el-form-item label="目标" prop="target">
                <el-select class="formCell" v-model="moduleData.target" placeholder="请选择活动区域">
                  <el-option label="expand" value="expand"></el-option>
                  <el-option label="iframe" value="iframe"></el-option>
                  <el-option label="open" value="open"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="上级">
                <el-cascader
                  class="formCell"
                  :options="moduleFormSuperiorData"
                  v-model="moduleData.parentIdList"
                  :props="moduleProps"
                  change-on-select
                  :show-all-levels="false"
                ></el-cascader>
              </el-form-item>
          </el-col>
            <el-col :span="12">
              <el-form-item label="名称" prop="fullName">
                <el-input class="formCell" v-model="moduleData.fullName"></el-input>
              </el-form-item>
              <el-form-item label="排序" prop="sortCode">
                <el-input type="number" class="formCell" v-model="moduleData.sortCode"></el-input>
              </el-form-item>
              <el-form-item label="图标">
                <el-input class="formCell" v-model="moduleData.icon"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="地址">
                <el-input class="formCell" v-model="moduleData.urlAddress"></el-input>
              </el-form-item>
              <el-form-item label="选项">
                <el-checkbox :false-label="0" :true-label="1" v-model="moduleData.isMenu">菜单</el-checkbox>
                <el-checkbox :false-label="0" :true-label="1" v-model="moduleData.allowExpand">展开</el-checkbox>
                <el-checkbox :false-label="0" :true-label="1" v-model="moduleData.isPublic">公共</el-checkbox>
                <el-checkbox :false-label="0" :true-label="1" v-model="moduleData.enabledMark">有效</el-checkbox>
              </el-form-item>
              <el-form-item label="描述">
                <el-input
                  type="textarea"
                  :rows="2"
                  placeholder="请输入内容"
                  v-model="moduleData.description">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <!--第二步-->
      <div class="form" v-show="pageIndex==2">
        <div class="head">
          <el-button @click="formDialogShow2=true,formDialogSetBtn2.show=false" class="btn" size="small" icon="el-icon-edit">
            新增
          </el-button>
        </div>
        <div class="table">
          <el-table
            :data="formTableData2"
            style="width: 100%">
            <el-table-column type="index" :index="ModuleIndex+1"></el-table-column>
            <el-table-column
              prop="fullName"
              label="名称"
              width="180">
            </el-table-column>
            <el-table-column
              prop="enCode"
              label="编号"
              width="180">
            </el-table-column>
            <el-table-column
              prop="urlAddress"
              label="地址">
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="100">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="setformTableData(2, scope)" >编辑</el-button>
                <el-button type="text" size="small" @click="deleteformTable(2, scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <!--第三步-->
      <div class="form" v-show="pageIndex==3">
        <div class="head">
          <el-button @click="formDialogShow3=true,formDialogSetBtn3.show=false" class="btn" size="small" icon="el-icon-edit">
            新增
          </el-button>
        </div>
        <div class="table">
          <el-table
            :data="formTableData3"
            style="width: 100%">
            <el-table-column type="index" :index="ModuleIndex+1"></el-table-column>
            <el-table-column
              prop="fullName"
              label="名称"
              width="180">
            </el-table-column>
            <el-table-column
              prop="enCode"
              label="编号"
              width="180">
            </el-table-column>
            <el-table-column
              prop="description"
              label="描述">
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="100">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="setformTableData(3, scope)">编辑</el-button>
                <el-button type="text" size="small" @click="deleteformTable(3, scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="scopefood">
        <el-button size="small" :disabled="pageIndex==1" @click="pageIndex--">上一页</el-button>
        <el-button size="small" :disabled="pageIndex==3" @click="resetForm('form')">下一页</el-button>
        <el-button size="small" :disabled="pageIndex!=3" @click="saveBtn()" type="success">完成</el-button>
      </div>
      <!--第二弹出框-->
      <el-dialog
        v-if="formDialogShow2"
        :visible.sync="formDialogShow2"
        append-to-body
        width="50%">
        <el-form ref="formDialogShow2" label-position="left" size="small" label-width="80px" :model="formDialogData2">
          <el-form-item label="上级" prop="parentIdList">
            <el-cascader
              class="formCell"
              :options="moduleFormSuperiorData"
              v-model="formDialogData2.parentIdList"
              :props="moduleProps"
              change-on-select
              :show-all-levels="false"
            ></el-cascader>
          </el-form-item>
          <el-form-item prop="enCode" required label="编号">
            <el-input v-model="formDialogData2.enCode"></el-input>
          </el-form-item>
          <el-form-item prop="fullName" required label="名称">
            <el-input v-model="formDialogData2.fullName"></el-input>
          </el-form-item>
          <el-form-item prop="sortCode" required label="排序">
            <el-input v-model="formDialogData2.sortCode"  type="number"></el-input>
          </el-form-item>
          <el-form-item prop="urlAddress" label="地址">
            <el-input v-model="formDialogData2.urlAddress"></el-input>
          </el-form-item>
          <el-form-item style="text-align: right">
            <el-button type="primary" v-if="formDialogSetBtn2.show" @click="formDialogClick(2, true)" >修改</el-button>
            <el-button type="primary" v-else @click="formDialogClick(2, false)" >添加</el-button>
            <el-button @click="formDialogShow2=false" >关闭</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <!--第三弹出框-->
      <el-dialog
        v-if="formDialogShow3"
        :visible.sync="formDialogShow3"
        append-to-body
        width="50%">
        <el-form  ref="formDialogShow3" label-position="left" size="small" label-width="80px" :model="formDialogData3">
          <el-form-item prop="enCode"  required label="编号">
            <el-input v-model="formDialogData3.enCode"></el-input>
          </el-form-item>
          <el-form-item prop="fullName" required label="名称">
            <el-input v-model="formDialogData3.fullName"></el-input>
          </el-form-item>
          <el-form-item prop="sortCode" required label="排序">
            <el-input v-model="formDialogData3.sortCode" type="number"></el-input>
          </el-form-item>
          <el-form-item prop="description" label="描述">
            <el-input v-model="formDialogData3.description"></el-input>
          </el-form-item>
          <el-form-item style="text-align: right">
            <el-button type="primary" v-if="formDialogSetBtn3.show" @click="formDialogClick(3, true)" >修改</el-button>
            <el-button type="primary" v-else @click="formDialogClick(3, false)" >添加</el-button>
            <el-button @click="formDialogData3=false" >关闭</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
</template>

<script>
export default {
  name: 'moduleView',
  props: ['ModulePopupShow'],
  data () {
    return {
      moduleData: {
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
      moduleRules: {
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
      moduleFormSuperiorData: [],
      moduleProps: {
        value: 'id',
        label: 'text',
        children: 'childNodes'
      },
      formTableData2: [],
      formTableData3: [],
      formDialogShow2: false,
      formDialogShow3: false,
      formDialogSetBtn2: {
        show: false,
        index: {}
      },
      formDialogSetBtn3: {
        show: false,
        index: {}
      },
      formDialogData2: {
        parentId: [],
        parentIdList: [],
        enCode: '',
        fullName: '',
        sortCode: '',
        urlAddress: ''
      },
      formDialogData3: {
        enCode: '',
        fullName: '',
        sortCode: '',
        description: ''
      },
      pageIndex: 1,
      ModuleIndex: 0
    }
  },
  methods: {
    goPage (index) {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.pageIndex = index
        } else {
          return false
        }
      })
    },
    deleteformTable (index, row) {
      if (index === 2) {
        this.formTableData2.splice(row, 1)
      }
      if (index === 3) {
        this.formTableData3.splice(row, 1)
      }
    },
    setformTableData (index, data) {
      if (index === 2) {
        this.formDialogData2 = data.row
        this.formDialogSetBtn2.show = true
        this.formDialogSetBtn2.index = data.$index
        this.formDialogShow2 = true
      }
      if (index === 3) {
        this.formDialogData3 = data.row
        this.formDialogSetBtn3.show = true
        this.formDialogSetBtn3.index = data.$index
        this.formDialogShow3 = true
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
    resetForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.pageIndex++
        } else {
          return false
        }
      })
    },
    formDialogClick (index, off) {
      if (index === 2) {
        let formDialogData2 = Object.assign({}, this.formDialogData2)
        if (off) {
          this.formTableData2[this.formDialogSetBtn2.index] = formDialogData2
          this.formDialogShow2 = false
        } else {
          formDialogData2.parentId = formDialogData2.parentIdList[formDialogData2.parentIdList.length - 1] || ''
          this.formTableData2.push(formDialogData2)
          this.formDialogShow2 = false
        }
        this.$refs.formDialogShow2.resetFields()
      }
      if (index === 3) {
        let formDialogData3 = Object.assign({}, this.formDialogData3)
        if (off) {
          this.formTableData3[this.formDialogSetBtn3.index] = formDialogData3
          this.formDialogShow3 = false
        } else {
          this.formTableData3.push(formDialogData3)
          this.formDialogShow3 = false
        }
        this.$refs.formDialogShow3.resetFields()
      }
    },
    saveBtn () {
      let moduleEntityJson = Object.assign({}, this.moduleData)
      moduleEntityJson.parentId = moduleEntityJson.parentIdList[moduleEntityJson.parentIdList.length - 1] || ''
      let moduleButtonListJson = Object.assign([], this.formTableData2)
      let moduleColumnListJson = Object.assign([], this.formTableData3)
      this.sendAxios({
        url: '/api/module/saveForm',
        method: 'post',
        data: {
          moduleEntityJson: JSON.stringify(moduleEntityJson),
          moduleButtonListJson: JSON.stringify(moduleButtonListJson),
          moduleColumnListJson: JSON.stringify(moduleColumnListJson)
        }
      })
        .then(e => {
          this.$message({
            message: '添加成功',
            type: 'success',
            showClose: this
          })
          this.$emit('update:ModulePopupShow', false)
        })
        .catch(e => {
          console.log(e)
        })
    }
  },
  created () {
    this.$store.dispatch('getAllDepartment')
      .then(res => {
        this.moduleFormSuperiorData = this.forData(res)
      })
  }
}
</script>

<style scoped lang="scss">
  .formCell {
    width: 100%;
  }
  .scopefood {
    text-align: right;
  }
  .form {
    padding: 10px 10%;
  }
</style>
