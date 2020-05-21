<template>
  <div>
    <!--用户管理新增页面-->
    <el-form ref="form" :model="form" label-width="80px" :inline="true" size="small">
      <el-form-item required label="账号：" class="form-item">
        <el-input disabled="" v-model="form.account"></el-input>
      </el-form-item>
      <el-form-item required label="密码：" class="form-item">
        <el-input disabled type="password" v-model="form.password  "></el-input>
      </el-form-item>
      <el-form-item required label="姓名：" class="form-item">
        <el-input v-model="form.realName "></el-input>
      </el-form-item>
      <!--<el-form-item required label="部门：" class="form-item" prop="departmentCode">-->
        <!--<el-select-->
          <!--v-model="form.departmentCode"-->
          <!--size="small"-->
          <!--style="width: 200px;"-->
          <!--placeholder="===请选择部门===">-->
          <!--<el-option-->
            <!--v-for="item in department"-->
            <!--:key="item.value"-->
            <!--:label="item.label"-->
            <!--:value="item.value">-->
          <!--</el-option>-->
        <!--</el-select>-->
      <!--</el-form-item>-->
      <el-form-item label="工号：" class="form-item">
        <el-input v-model="form.enCode"></el-input>
      </el-form-item>
      <el-form-item label="性别：" class="form-item">
        <el-select
          v-model="form.gender"
          size="small"
          style="width: 200px;"
          placeholder="===请选择性别===">
          <el-option
            v-for="item in sex"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item  label="生日：" class="form-item">
        <el-date-picker
          v-model="form.birthday"
          type="date"
          size="small"
          align="left"
          @change="changeStartTime"
          format="yyyy-MM-dd"
          style="width: 200px;"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="邮箱：" class="form-item">
        <el-input v-model="form.email"></el-input>
      </el-form-item>
      <el-form-item required label="手机：" class="form-item">
        <el-input v-model="form.mobile"></el-input>
      </el-form-item>
      <el-form-item label="电话：" class="form-item">
        <el-input v-model="form.telephone"></el-input>
      </el-form-item>
      <el-form-item label="QQ：" class="form-item">
        <el-input v-model="form.OICQ"></el-input>
      </el-form-item>
      <el-form-item label="微信：" class="form-item">
        <el-input v-model="form.WeChat"></el-input>
      </el-form-item>
    </el-form>
    <el-form ref="form" :model="form" label-width="80px"  size="small">
      <el-form-item label="备注：">
        <el-input type="textarea" style="width: 90%;"  v-model="form.description "></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'add',
  props: ['editData'],
  data () {
    return {
      form: {
        account: '', // 账号
        password: '', // 密码
        realName: '', // 姓名
        // departmentCode: '', // 部门
        gender: '', // 性别
        mobile: '', // 手机
        birthday: '', // 生日
        email: '', // 邮箱
        OICQ: '', // qq
        description: '', // 备注
        WeChat: '', //  微信
        telephone: '', // 电话
        departmentId: '' // 部门id
      },
      value: '',
      department: [],
      value1: '',
      sex: [
        {
          value: '1',
          label: '男'
        }, {
          value: '0',
          label: '女'
        }
      ],
      original: ''
    }
  },
  methods: {
    formatSex: function (row, column) {
      return row.gender == 1 ? '男' : row.gender == 0 ? '女' : '未知'
    },
    // 请求下拉菜单列表
    // departmentList (companyId, companyCode) {
    //   this.sendAxios({
    //     url: '/api/department/itemDepartmentPull',
    //     method: 'post',
    //     data: {
    //       companyId: companyId
    //     }
    //   })
    //     .then(res => {
    //       let departArr = []
    //       for (let depart of res) {
    //         let departCode = ''
    //         if (depart.enCode == null && depart.enCode == 'undefined') {
    //           departCode = companyCode
    //         } else {
    //           departCode = depart.enCode
    //         }
    //         let departData = {
    //           id: depart.departmentId,
    //           value: departCode,
    //           label: depart.fullName
    //         }
    //         departArr.push(departData)
    //       }
    //       this.department = departArr
    //     })
    // },
    // 检查用户手机号是否重复
    mobilefun (fun) {
      let self = this
      this.sendAxios({
        url: '/api/user/existUserMobile',
        method: 'get',
        data: {
          mobile: self.form.mobile,
          original: self.original
        }
      })
        .then(res => {
          if (!res.data) {
            fun()
          } else {
            this.$message({
              type: 'warning',
              message: res.data
            })
          }
        })
    },
    changeStartTime (time) {
      let d = new Date(time)
      let timedata = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()
      this.form.birthday = timedata
    },
    // 编辑的方法
    editSave (fun) {
      let self = this
      if (this.form.gender == 1) {
        this.form.gender = 1
      } else {
        this.form.gender = 0
      }
      self.mobilefun(function () {
        self.sendAxios({
          url: '/api/user/saveUserForm',
          method: 'post',
          data: self.form
        })
          .then(res => {
            self.$message({
              type: 'success',
              message: `数据添加成功`
            })
            fun(res)
          })
      })
    }
  },
  created () {
    console.log(this.editData)
    this.original = this.editData.mobile
    let departmentId = this.editData.departmentId
    let departmentCode = this.editData.departmentCode
    // this.departmentList(departmentId, departmentCode)
    this.sendAxios({
      url: '/api/user/getUserById/' + this.editData.userId + '',
      method: 'get'
    })
      .then(res => {
        this.form = res
        this.form.gender = this.formatSex(this.form)
      })
  }
}
</script>

<style scoped lang="scss">
  .form-item{
    width: 45%;
  }
</style>
