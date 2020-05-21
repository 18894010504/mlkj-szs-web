<template>
  <div>
  <!--用户管理新增页面-->
    <el-form ref="form" :model="form" label-width="80px" :inline="true" size="small">
      <el-form-item required label="账号：" class="form-item">
        <el-input v-model="form.account"></el-input>
      </el-form-item>
      <el-form-item required label="密码：" class="form-item">
        <el-input type="password" v-model="form.password  "></el-input>
      </el-form-item>
      <el-form-item required label="姓名：" class="form-item">
        <el-input v-model="form.realName "></el-input>
      </el-form-item>
      <!--<el-form-item required label="部门：" class="form-item" prop="departmentCode">-->
        <!--<el-select-->
          <!--v-model="form.departmentCode"-->
          <!--size="small"-->
          <!--style="width: 200px;"-->
          <!--@change="departmentIdfun"-->
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
            format="yyyy-MM-dd"
            style="width: 200px;"
            @change="changeStartTime"
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
  props: ['company'],
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
        // companyId: '', // 公司id
        departmentId: '' // 部门id
      },
      sex: [
        {
          value: '1',
          label: '男'
        }, {
          value: '0',
          label: '女'
        }
      ],
      value: '',
      department: [],
      value1: '',
      existUserAccount: false,
      Mobile: false
    }
  },
  methods: {
    // 校验用户账户是否重复
    userAccount (fun) {
      let self = this
      self.sendAxios({
        url: '/api/user/existUserAccount',
        method: 'get',
        data: {
          account: self.form.account
        }
      })
        .then(res => {
          if (res == 200) {
            self.existUserAccount = true
            fun(res)
          } else {
            self.$message({
              type: 'warning',
              message: '账号重复，请重新输入！'
            })
          }
        })
    },
    // 检查用户手机号是否重复
    userMobile (fun) {
      let self = this
      self.sendAxios({
        url: '/api/user/existUserMobile',
        method: 'get',
        data: {
          mobile: self.form.mobile
        }
      })
        .then(res => {
          if (res == 200) {
            fun(res)
            self.Mobile = true
          } else {
            self.$message({
              type: 'warning',
              message: '手机号重复，请重新输入!'
            })
          }
        })
    },
    // 新增方法
    addfun (fun) {
      let self = this
      self.userAccount(function (res) {
        self.userMobile(function (res) {
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
            .catch(res => {
              console.log('保存失败')
            })
        })
      })
    },
    changeStartTime (time) {
      let d = new Date(time)
      let timedata = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()
      this.form.birthday = timedata
    },
    departmentIdfun (data) {
      let departmentIddata = {}
      departmentIddata = this.department.find((item) => {
        return item.value === data
      })
      this.form.departmentId = departmentIddata.id
    }
  },
  created () {
    this.form.departmentId = this.company.departmentId
    // console.log('value是' + this.value)
  }
}
</script>

<style scoped lang="scss">
  .form-item{
    width: 45%;
  }
</style>
