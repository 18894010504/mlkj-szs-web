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
                size="small">
                <i slot="prefix" class="el-input__icon el-icon-search"></i>
              </el-input>
              <el-button class="" size="small" type="primary" icon="el-icon-search">查询</el-button>
            </div>
            <div class="right">
              <el-button size="small" icon="el-icon-circle-plus" @click="addDepart">新增</el-button>
            </div>
          </div>
          <div class="conentHtml">
            <tree-table :data="data" :columns="columns" border>
              <el-table-column
                fixed="right"
                label="操作"
                width="240">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="editDepart(scope)">编辑</el-button>
                  <el-button type="text" size="small" @click="deleteDepart(scope)">删除</el-button>
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
      <el-dialog
        title="修改模块"
        :visible.sync="addModuleShow"
        v-if="addModuleShow"
        width="50%">
        <el-form ref="departForm" :model="moduleData" size="mini" label-position="left" label-width="120px">
          <el-row>
            <el-form-item label="部门名称">
              <el-input v-model="moduleData.fullName"></el-input>
            </el-form-item>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="部门简称">
                <el-input v-model="moduleData.shortName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="父级部门">
                <el-select v-model="moduleData.parentId" placeholder="请选择" style="width: 100%;">
                  <el-option
                    v-for="item in data"
                    :key="item.departmentId"
                    :label="item.fullName"
                    :value="item.departmentId">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="外线电话">
                <el-input v-model="moduleData.outerPhone"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="内线电话">
                <el-input v-model="moduleData.innerPhone"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="电子邮件">
                <el-input v-model="moduleData.email"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="部门传真">
                <el-input v-model="moduleData.fax"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="部门类型">
                <el-select v-model="moduleData.nature" placeholder="请选择" style="width: 100%;">
                  <el-option
                    v-for="item in requestData.Natures"
                    :key="item.itemValue"
                    :label="item.itemName"
                    :value="item.itemName">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="排序码">
                <el-input v-model="moduleData.sortCode"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item label="备注">
              <el-input
                type="textarea"
                :rows="2"
                placeholder="请输入内容"
                v-model="moduleData.description">
              </el-input>
            </el-form-item>
          </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="centerDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitDepart('departForm')">确 定</el-button>
        </span>
      </el-dialog>
    </el-container>
  </div>
</template>
<script>
import moduleView from '../../components/popupView/moduleView'
import treeTable from '@/components/TreeTable'
import {clearObject} from '../../utils/tools'

export default {
  name: 'SystemModule', // 部门管理
  components: {
    moduleView, treeTable
  },
  props: ['obj'],
  data () {
    return {
      addModuleShow: false,
      moduleData: {
        fullName: '',
        shortName: '',
        nature: '',
        parentId: '',
        outerPhone: '',
        innerPhone: '',
        email: '',
        fax: '',
        sortCode: '',
        description: ''
      },
      page: {
        index: 1, // 当前页数
        size: 30, // 最大行数
        page: 1, // 当前页数
        records: 0, // 总条目数
        total: 0 // 总页数
      },
      columns: [
        {
          text: '部门编号',
          value: 'enCode',
          width: 150
        },
        {
          text: '部门名称',
          value: 'fullName',
          width: 200
        },
        {
          text: '部门简称',
          value: 'shortName',
          width: 200
        },
        {
          text: '部门性质',
          value: 'nature',
          width: 200
        },
        {
          text: '创建时间',
          value: 'createDate'
        }
      ],
      data: [],
      requestData: {
        parentDepart: [],
        Natures: []
      }
    }
  },
  methods: {
    editDepart (scope) {
      this.addModuleShow = true
      this.moduleData = scope.row
      console.log(this.moduleData)
    },
    deleteDepart (scope) {
      let self = this
      this.$confirm('确认删除？')
        .then(_ => {
          this.sendAxios({
            url: '/api/department/deleteDepartment',
            method: 'post',
            data: {
              keyValue: scope.row.departmentId
            }
          }).then(res => {
            this.$message({
              message: '删除成功',
              type: 'success',
              showClose: this
            })
            self.getDepart()
          }).catch(error => {
            console.log(error)
          })
        })
        .catch(_ => {
        })
    },
    addDepart () {
      clearObject(this.moduleData)
      let self = this
      this.sendAxios({
        url: '/api/dataItem/getItemdetail',
        method: 'post',
        data: {
          itemCode: 'DepartmentNature'
        }
      }).then(res => {
        self.requestData.Natures = res
        return self.sendAxios({
          url: '/api/department/getCityDepartment',
          method: 'post'
        })
      }).then(res => {
        self.addModuleShow = true
        console.log(res)
      }).catch(error => {
        console.log(error)
      })
    },
    submitDepart (refForm) {
      //  TODO 之后加验证规则
      let self = this
      this.sendAxios({
        url: '/api/department/saveDepartmentForm',
        method: 'post',
        data: this.moduleData
      }).then(res => {
        self.addModuleShow = false
        self.getDepart()
      }).catch(error => {
        console.log(error)
      })
    },
    getDepart () {
      let self = this
      this.sendAxios({
        url: '/api/department/getCityDepartment',
        method: 'post'
      }).then(res => {
        self.data = self.toTree(res, 0)
      }).catch(error => {
        console.log(error)
      })
    },
    toTree (data, parentId) {
      let tree = []
      let temp
      for (let i = 0; i < data.length; i++) {
        if (data[i].parentId == parentId) {
          let obj = data[i]
          temp = this.toTree(data, data[i].departmentId)
          if (temp.length > 0) {
            obj.children = temp
          }
          tree.push(obj)
        }
      }
      return tree
    }
  },
  created () {
    this.getDepart()
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
        .complany {
          display: inline-block;
          width: 150px;
        }
        > p {
          padding: 5px 10px;
          border-bottom: 1px solid $border_color3;
          text-align: left;
        }
        .conentHtml {
          .more {
            display: none;
          }
        }
        .left {
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
