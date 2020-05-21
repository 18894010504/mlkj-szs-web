<template>
  <div>
    <el-form ref="videoForm" :model="moduleData" :rules="rules" :inline="true" size="mini" label-position="left" label-width="120px">
      <el-row>
        <el-form-item label="商家名称" prop="shopName" class="form-item">
          <el-input v-model="moduleData.shopName"></el-input>
        </el-form-item>
        <el-form-item label="商家号" prop="shopNum" class="form-item">
          <el-input v-model="moduleData.shopNum"></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="授权方代码" prop="licCompanies" class="form-item">
          <el-input v-model="moduleData.licCompanies"></el-input>
        </el-form-item>
        <el-form-item label="授权域名" prop="licDomainName" class="form-item">
          <el-input v-model="moduleData.licDomainName"></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="是否授权" class="form-item">
          <el-switch v-model="moduleData.state"
                     :active-value=0
                     active-color="#00A854"
                     :inactive-value=1
                     inactive-color="#F04134"></el-switch>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="纳税人识别号" prop="businessLicenseNo" class="form-item">
          <el-input v-model="moduleData.businessLicenseNo"></el-input>
        </el-form-item>
      </el-row>
      <div class="food">
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancel()">取 消</el-button>
          <el-button type="primary" @click="submitVideo('videoForm')">确 定</el-button>
        </span>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'add',
  props: ['ModulePopupShow', 'updateId'],
  data () {
    return {
      moduleData: {
        shopName: '', // 商家名称
        shopNum: '', // 商家号
        licCompanies: '', // 授权方代码
        licDomainName: '', // 授权域名
        businessLicenseNo: '', // 纳税人识别号
        state: '' // 状态
      },
      rules: {
        shopName: [
          {required: true, message: '请输入商家名称'}
        ],
        shopNum: [
          {required: true, message: '请输入商家号'}
        ],
        licCompanies: [
          {required: true, message: '请输入授权方代码'}
        ],
        licDomainName: [
          {required: true, message: '请输入授权域名'}
        ],
        businessLicenseNo: [
          {required: true, message: '请输入纳税人识别号'}
        ]
      }
    }
  },
  methods: {
    submitVideo (formName) {
      let self = this
      self.$refs[formName].validate((valid) => {
        console.log(self.moduleData)
        if (valid) {
          self.sendAxios({
            url: 'http://vshare.szschina.cn/api/video/saveVideo',
            method: 'post',
            data: {
              videoJson: JSON.stringify(this.moduleData)
            }
          }).then(res => {
            self.$emit('update:ModulePopupShow', false)
            self.$emit('submit-add', true)
          })
            .catch(erro => {
              console.log(erro)
            })
        } else {
          return false
        }
      })
    },
    cancel () {
      let self = this
      self.$emit('update:ModulePopupShow', false)
    }
  },
  created () {
    if (this.updateId && this.updateId !== '') {
      let self = this
      self.sendAxios({
        url: 'http://vshare.szschina.cn/api/video/findVideo',
        method: 'post',
        data: {videoId: this.updateId}
      }).then(function (res) {
        self.moduleData = res
      }).catch(error => {
        console.log(error)
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .form-item{
    width: 45%;
  }
  .food{
    text-align: right;
  }
</style>
