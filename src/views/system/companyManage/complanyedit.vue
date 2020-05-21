<template>
  <div>
    <!--用户管理编辑页面-->
    <el-form ref="form" :model="form" label-width="100px" :inline="true" size="small">
      <el-form-item required label="公司名称：" class="form-item">
        <el-input v-model="form.fullName"></el-input>
      </el-form-item>
      <el-form-item required label="公司简称：" class="form-item">
        <el-input type="text" v-model="form.shortName  "></el-input>
      </el-form-item>
      <el-form-item required label="上级公司：" class="form-item">
        <el-cascader
          :options="department"
          v-model="parentcomplanyinfo"
          filterable
          change-on-select
          @change="handleItemChange"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="公司性质：" class="form-item">
        <el-select
          v-model="form.nature"
          size="small"
          style="width: 200px;"
          placeholder="===请选择性别===">
          <el-option
            v-for="item in CompanyNature"
            :key="item.value"
            :label="item.itemName"
            :value="item.itemName">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item  label="成立时间：" class="form-item">
        <el-date-picker
          v-model="form.createDate"
          type="date"
          size="small"
          align="left"
          format="yyyy-MM-dd"
          style="width: 200px;"
          @change="changeStartTime"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'complanyedit',
  props: ['editData'],
  data () {
    return {
      form: {
        fullName: '', // 公司名称
        shortName: '', // 公司简介
        parentcomplany: '', // 上级公司
        createDate: '', // 成立时间
        nature: '', // 公司性质
        parentId: ''
      },
      parentcomplanyinfo: [],
      CompanyNature: [],
      department: []
    }
  },
  methods: {
    getCascaderObj (val, opt) {
      return val.map(function (value, index, array) {
        for (var itm of opt) {
          if (itm.value == value) { opt = itm.children; return itm.id.toString() }
        }
        return null
      })
    },
    handleItemChange (val) {
      this.form.parentcomplany = this.parentcomplanyinfo.toString()
      this.form.parentId = this.getCascaderObj(val, this.department).toString()
    },
    // 返回数组递归
    handlerCascaderData (data) {
      if (data && data.length > 0) {
        for (let item of data) {
          item.label = item.text
          item.value = item.text
          if (item && item.hasChildren) {
            item.children = item.childNodes
            this.handlerCascaderData(item.childNodes)
          }
        }
      }
      return data
    },
    // 页面首次进入执行的方法
    openfun () {
      this.sendAxios({
        url: '/api/dataItem/getDetailListByParentId',
        method: 'get',
        data: {
          itemCode: 'CompanyNature'
        }
      })
        .then(res => {
          this.CompanyNature = res
        })
    },
    // 监听时间的方法
    changeStartTime (time) {
      let d = new Date(time)
      let timedata = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()
      this.form.creatTime = timedata
    },
    // 上级公司接口请求
    complanySavefun () {
      this.sendAxios({
        url: '/api/company/getUserCompanyTree',
        method: 'post'
      })
        .then(res => {
          this.department = this.handlerCascaderData(res)
        })
    },
    // 保存信息的方法
    savefun (fun) {
      this.sendAxios({
        url: '/api/company/saveCompanyForm',
        method: 'post',
        data: this.form
      })
        .then(res => {
          fun(res)
        })
    }
  },
  created () {
    this.form = this.editData
    this.openfun()
    this.complanySavefun()
  }
}
</script>

<style scoped>

</style>
