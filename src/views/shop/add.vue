<template>
  <div style="height: 100%">
    <div class="head">
      <el-steps :active="pageIndex" simple finish-status="finish">
        <el-step title="基本信息" @click.native="pageIndex=1" align="center"></el-step>
        <el-step title="详细信息" @click.native="toNext"></el-step>
      </el-steps>
    </div>
    <!--第一步-->
    <el-form ref="form" :model="shopData" size="mini" label-position="left" label-width="125px">
      <div class="form" v-show="pageIndex===1">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="商家名称">
              <el-input class="formCell" v-model="shopData.shopName"></el-input>
            </el-form-item>
            <el-form-item label="商户类型">
              <el-select v-model="shopData.type" placeholder="请选择" style="width: 100%;">
                <el-option
                  v-for="it in requestData.shopType"
                  :key="it.itemValue"
                  :label="it.itemName"
                  :value="it.itemValue">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="商户规模">
              <el-select v-model="shopData.scale" placeholder="请选择" style="width: 100%;">
                <el-option
                  v-for="item in requestData.shopScale"
                  :key="item.itemValue"
                  :label="item.itemName"
                  :value="item.itemValue">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="餐饮分类">
              <el-select v-model="shopData.classify" placeholder="请选择" style="width: 100%;">
                <el-option
                  v-for="item in requestData.classifys"
                  :key="item.itemValue"
                  :label="item.itemName"
                  :value="item.itemValue">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="企业类型">
              <el-select v-model="shopData.businessTypes" placeholder="请选择" style="width: 100%;">
                <el-option
                  v-for="item in requestData.businessTypes"
                  :key="item.itemValue"
                  :label="item.itemName"
                  :value="item.itemValue">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="年度评价(A)">
              <el-input class="formCell" v-model="shopData.grade"></el-input>
            </el-form-item>
            <el-form-item label="营业执照编号">
              <el-input class="formCell" v-model="shopData.businessLicenseNo"></el-input>
            </el-form-item>
            <el-form-item label="许可证">
              <el-input class="formCell" v-model="shopData.licenceNo"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="电话号码">
              <el-input class="formCell" v-model="shopData.phone"></el-input>
            </el-form-item>
            <el-form-item label="职能">
              <el-select v-model="shopData.competency" placeholder="请选择" style="width: 100%;">
                <el-option
                  v-for="item in requestData.competency"
                  :key="item.itemValue"
                  :label="item.itemName"
                  :value="item.itemValue">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="市食品监督局">
              <el-input class="formCell" v-model="shopData.cityFoodInspection"></el-input>
            </el-form-item>
            <el-form-item label="区食品监督局">
              <el-input class="formCell" v-model="shopData.districtFoodInspection"></el-input>
            </el-form-item>
            <el-form-item label="食药所">
              <el-cascader
                :options="requestData.foodInstitute"
                v-model="foodInstitutes"
                @active-item-change="handleItemChange" style="width: 100%">
              </el-cascader>
            </el-form-item>
            <el-form-item label="联系人">
              <el-input class="formCell" v-model="shopData.linkMan"></el-input>
            </el-form-item>
            <el-form-item label="经营方式">
              <el-select v-model="shopData.operateMode" placeholder="请选择" style="width: 100%;">
                <el-option
                  v-for="item in requestData.operateMode"
                  :key="item.itemValue"
                  :label="item.itemName"
                  :value="item.itemValue">
                </el-option>
              </el-select>
            </el-form-item>
            <!--<el-form-item label="服务分类">-->
              <!--<el-select v-model="shopData.serviceClassify" placeholder="请选择" style="width: 100%;">-->
                <!--<el-option-->
                  <!--v-for="item in requestData.serviceClassify"-->
                  <!--:key="item.itemValue"-->
                  <!--:label="item.itemName"-->
                  <!--:value="item.itemValue">-->
                <!--</el-option>-->
              <!--</el-select>-->
            <!--</el-form-item>-->
            <el-form-item label="营业时间" v-model="shopData.businessTime">
              <el-col :span="11">
                <el-time-select
                  placeholder="起始时间"
                  v-model="shopData.startTime"
                  style="width: 100%;"
                  :picker-options="{
                start: '00:00',
                step: '00:30',
                end: '23:59'
               }">
                </el-time-select>
              </el-col>
              <el-col class="line" :span="2">-</el-col>
              <el-col :span="11">
                <el-time-select
                  placeholder="结束时间"
                  v-model="shopData.endTime"
                  style="width: 100%;"
                  :picker-options="{
                  start: '08:30',
                  step: '00:15',
                  end: '18:30',
                  minTime: shopData.startTime
                }">
                </el-time-select>
              </el-col>
            </el-form-item>
            <!--<el-form-item label="基本分类">-->
              <!--<el-select v-model="shopData.basicType" placeholder="请选择" style="width: 100%;">-->
                <!--<el-option-->
                  <!--v-for="item in requestData.basicType"-->
                  <!--:key="item.itemCode"-->
                  <!--:label="item.itemName"-->
                  <!--:value="item.itemCode">-->
                <!--</el-option>-->
              <!--</el-select>-->
            <!--</el-form-item>-->
          </el-col>
        </el-row>
      </div>
      <!--第二步-->
      <div class="form" v-show="pageIndex===2">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="动态评级">
              <el-input class="formCell" v-model="shopInfoData.dynamicGrade"></el-input>
            </el-form-item>
            <el-form-item label="营业执照">
              <el-upload
                class="upload-demo"
                ref="businessLicenseImage"
                :action="uploadImgUrl"
                :data="{shopNum: shopNum}"
                :on-error="uploadError"
                :show-file-list="false"
                :on-success="(res,file) => {return uploadSuccess(res,file,'businessLicense')}"
                accept="jpeg,png,gif"
                :auto-upload="false"
                name="imgFile">
                <div class="image" v-if="shopInfoData.businessLicense && shopInfoData.businessLicense.length!==0">
                  <img :src="shopInfoData.businessLicense" alt="" width="40" height="40">
                  <span class="el-icon-circle-close" @click.stop="shopInfoData.businessLicense=''"></span>
                </div>
                <div class="button" v-else>
                  <el-button size="small" slot="trigger" type="primary">选择文件</el-button>
                  <el-button size="small" type="success" @click.stop="submitUpload('businessLicenseImage')">上传到服务器
                  </el-button>
                </div>
              </el-upload>
            </el-form-item>
            <el-form-item label="营业执照发放日期">
              <el-date-picker
                v-model="shopInfoData.businessLicenseDate"
                type="date"
                placeholder="选择日期"
                style="width: 100%;">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="营业执照到期日期">
              <el-date-picker
                v-model="shopInfoData.businessLicenseEnddate"
                type="date"
                placeholder="选择日期"
                style="width: 100%;">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="许可证">
              <el-upload
                class="upload-demo"
                ref="licenceImage"
                :action="uploadImgUrl"
                :on-error="uploadError"
                :show-file-list="false"
                :data="{shopNum: shopNum}"
                :on-success="(res,file) => {return uploadSuccess(res,file,'licence')}"
                accept="jpeg,png,gif"
                :auto-upload="false"
                name="imgFile">
                <div class="image" v-if="shopInfoData.licence && shopInfoData.licence.length!==0">
                  <img :src="shopInfoData.licence" alt="" width="40" height="40">
                  <span class="el-icon-circle-close" @click.stop="shopInfoData.licence=''"></span>
                </div>
                <div class="button" v-else>
                  <el-button size="small" slot="trigger" type="primary">选择文件</el-button>
                  <el-button size="small" type="success" @click.stop="submitUpload('licenceImage')">上传到服务器</el-button>
                </div>
              </el-upload>
            </el-form-item>
            <el-form-item label="许可证发放日期">
              <el-date-picker
                v-model="shopInfoData.licenceDate"
                type="date"
                placeholder="选择日期"
                style="width: 100%;">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="许可证到期日期">
              <el-date-picker
                v-model="shopInfoData.licenceEnddate"
                type="date"
                placeholder="选择日期"
                style="width: 100%;">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="发证机关">
              <el-input class="formCell" v-model="shopInfoData.issuingOrgan"></el-input>
            </el-form-item>
            <el-form-item label="签发人">
              <el-input class="formCell" v-model="shopInfoData.issuingPeople"></el-input>
            </el-form-item>
            <el-form-item label="监管人员">
              <el-input class="formCell" v-model="shopInfoData.supervisor"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="经营范围">
              <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="shopInfoData.businessScope"></el-input>
            </el-form-item>
            <el-form-item label="注册地址">
              <el-input placeholder="请输入内容" v-model="shopInfoData.address"></el-input>
            </el-form-item>
            <el-form-item label="经纬度">
              <el-row>
                <el-col :span="12">
                  <el-input placeholder="请输入内容" v-model="shopInfoData.longitude">
                    <template slot="prepend">经度</template>
                  </el-input>
                </el-col>
                <el-col :span="12">
                  <el-input placeholder="请输入内容" v-model="shopInfoData.latitude">
                    <template slot="prepend">纬度</template>
                  </el-input>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="法人">
              <el-input placeholder="请输入内容" v-model="shopInfoData.leader"></el-input>
            </el-form-item>
            <el-form-item label="法人身份证号">
              <el-input placeholder="请输入内容" v-model="shopInfoData.leaderCardNum"></el-input>
            </el-form-item>
            <el-form-item label="身份证正面">
              <el-upload
                class="upload-demo"
                ref="leaderCardImage"
                :action="uploadImgUrl"
                :data="{shopNum: shopNum}"
                :on-error="uploadError"
                :show-file-list="false"
                :on-success="(res,file) => {return uploadSuccess(res,file,'leaderCard')}"
                accept="jpeg,png,gif"
                :auto-upload="false"
                name="imgFile">
                <div class="image" v-if="shopInfoData.leaderCard  && shopInfoData.leaderCard.length!==0">
                  <img :src="shopInfoData.leaderCard" alt="" width="60" height="40">
                  <span class="el-icon-circle-close" @click.stop="shopInfoData.leaderCard=''"></span>
                </div>
                <div class="button" v-else>
                  <el-button size="small" slot="trigger" type="primary">选择文件</el-button>
                  <el-button size="small" type="success" @click.stop="submitUpload('leaderCardImage')">上传到服务器
                  </el-button>
                </div>
              </el-upload>
            </el-form-item>
            <el-form-item label="身份证反面">
              <el-upload
                class="upload-demo"
                ref="leaderCardfImage"
                :data="{shopNum: shopNum}"
                :action="uploadImgUrl"
                :on-error="uploadError"
                :show-file-list="false"
                :on-success="(res,file) => {return uploadSuccess(res,file,'leaderCardf')}"
                accept="jpeg,png,gif"
                :auto-upload="false"
                name="imgFile">
                <div class="image" v-if="shopInfoData.leaderCardf && shopInfoData.leaderCardf.length!==0">
                  <img :src="shopInfoData.leaderCardf" alt="" width="60" height="40">
                  <span class="el-icon-circle-close" @click.stop="shopInfoData.leaderCardf=''"></span>
                </div>
                <div class="button" v-else>
                  <el-button size="small" slot="trigger" type="primary">选择文件</el-button>
                  <el-button size="small" type="success" @click.stop="submitUpload('leaderCardfImage')">上传到服务器
                  </el-button>
                </div>
              </el-upload>
            </el-form-item>
            <el-form-item label="店铺logo">
              <el-upload
                class="upload-demo"
                ref="logoImage"
                :action="uploadImgUrl"
                :data="{shopNum: shopNum}"
                :on-error="uploadError"
                :show-file-list="false"
                :on-success="(res,file) => {return uploadSuccess(res,file,'logo')}"
                accept="jpeg,png,gif"
                :auto-upload="false"
                name="imgFile">
                <div class="image" v-if="shopData.logo && shopData.logo.length!==0">
                  <img :src="shopData.logo" alt="" width="120" height="80">
                  <span class="el-icon-circle-close" @click.stop="shopData.logo=''"></span>
                </div>
                <div class="button" v-else>
                  <el-button size="small" slot="trigger" type="primary">选择文件</el-button>
                  <el-button size="small" type="success" @click.stop="submitUpload('logoImage')">上传到服务器</el-button>
                </div>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
    <div class="food">
      <el-button size="small" :disabled="pageIndex===2" @click="saveShop" :type="!initShop? 'primary': ''">保存基本信息</el-button>
      <el-button size="small" :disabled="pageIndex===1" @click="pageIndex--">上一页</el-button>
      <el-tooltip content="请先保存基本信息" placement="top" v-if="!initShop">
        <el-button size="small" :disabled="pageIndex===2" @click="toNext">下一页</el-button>
      </el-tooltip>
      <el-button size="small" :disabled="pageIndex===2" @click="toNext" v-else>下一页</el-button>
      <el-button size="small" :disabled="pageIndex===1" @click="finish" :type="initShop? 'success': ''">保存详细信息</el-button>
    </div>
  </div>
</template>
<script>
/* eslint-disable eqeqeq */

export default {
  name: 'shopAdd',
  props: ['ModulePopupShow', 'updateId'],
  data: function () {
    return {
      uploadImgUrl: 'http://netdisk.szschina.cn/szsShopImgUpload',
      shopData: {
        shopName: '',
        gridId: '',
        streetId: '',
        type: '',
        scale: '',
        classify: '',
        grade: '',
        businessLicenseNo: '',
        licenceNo: '',
        phone: '',
        competency: '',
        businessTypes: '',
        cityFoodInspection: '兰州市食品监督局',
        districtFoodInspection: '兰州市城关区食品监督局',
        foodInstitute: '',
        linkMan: '',
        operateMode: '',
        serviceClassify: '',
        businessTime: '',
        basicType: '',
        state: '',
        startTime: '',
        endTime: '',
        logo: ''
      },
      topId: '1000001',
      foodInstitutes: [],
      shopInfoData: {
        dynamicGrade: '',
        businessLicense: '',
        businessLicenseDate: '',
        businessLicenseEnddate: '',
        licence: '',
        licenceDate: '',
        licenceEnddate: '',
        issuingOrgan: '',
        issuingPeople: '',
        supervisor: '',
        businessScope: '',
        address: '',
        longitude: '',
        latitude: '',
        province: '',
        city: '',
        district: '',
        leader: '',
        leaderCardNum: '',
        leaderCard: '',
        leaderCardf: ''
      },
      requestData: {
        grids: [],
        streets: [],
        classifys: [],
        fileList: [],
        competency: [],
        businessTypes: [],
        foodInstitute: [],
        operateMode: [],
        serviceClassify: [],
        basicType: [],
        shopType: [],
        shopScale: []
      },
      pageIndex: 1,
      initShop: false,
      shopNum: ''
    }
  },
  methods: {
    saveShop () {
      let self = this
      this.shopData.businessTime = this.shopData.startTime + '-' + this.shopData.endTime
      this.shopData.foodInstitute = this.foodInstitutes[this.foodInstitutes.length - 1]
      this.sendAxios({
        url: '/api/business/saveShopForm',
        method: 'post',
        data: {
          shopJson: JSON.stringify(this.shopData)
        }
      }).then(res => {
        self.shopData = res
        self.initShop = true
        self.shopNum = res.shopNum
        self.shopInfoData.id = res.id
        if (res.businessTime && res.businessTime.length > 0) {
          let businessTime = res.businessTime.split('-')
          self.shopData.startTime = businessTime[0]
          self.shopData.endTime = businessTime[1]
        }
      }).catch(error => {
        console.log(error)
      })
    },
    toNext () {
      this.initShop && this.pageIndex++
    },
    submitUpload (ref) {
      this.$refs[ref].submit()
    },
    moduleRules () {
      console.log('moduleRules')
    },
    initData () {
      let self = this
      this.sendAxios({
        url: '/api/dataItem/getItemdetail',
        method: 'post',
        data: {
          itemCode: 'basicType'
        }
      }).then(res => {
        self.requestData.basicType = res
        return self.sendAxios({
          url: '/api/dataItem/getItemdetail',
          method: 'post',
          data: {
            itemCode: 'business_type'
          }
        })
      }).then(res => {
        self.requestData.businessTypes = res
        return self.sendAxios({
          url: '/api/dataItem/getItemdetail',
          method: 'post',
          data: {
            itemCode: 'shopFunctions'
          }
        })
      }).then(res => {
        self.requestData.competency = res
        return self.sendAxios({
          url: '/api/dataItem/getItemdetail',
          method: 'post',
          data: {
            itemCode: 'classify'
          }
        })
      }).then(res => {
        self.requestData.classifys = res
        return self.sendAxios({
          url: '/api/dataItem/getItemdetail',
          method: 'post',
          data: {
            itemCode: 'serviceClassify'
          }
        })
      }).then(res => {
        self.requestData.serviceClassify = res
        return self.sendAxios({
          url: '/api/dataItem/getItemdetail',
          method: 'post',
          data: {
            itemCode: 'operateMode'
          }
        })
      }).then(res => {
        self.requestData.operateMode = res
        return self.sendAxios({
          url: '/api/dataItem/getItemdetail',
          method: 'post',
          data: {
            itemCode: 'shop_type'
          }
        })
      }).then(res => {
        self.requestData.shopType = res
        return self.sendAxios({
          url: '/api/dataItem/getItemdetail',
          method: 'post',
          data: {
            itemCode: 'shopScale'
          }
        })
      }).then(res => {
        self.requestData.shopScale = res
      }).catch(error => {
        console.log(error)
      })
      this.getFoodInstituteTree(this.topId)
    },
    getFoodInstituteTree () {
      let self = this
      this.sendAxios({
        url: '/api/department/getCityDepartment',
        method: 'post'
      }).then(res => {
        self.requestData.foodInstitute = self.toTree(res, '')
      }).catch(error => {
        console.log(error)
      })
    },
    // 上传成功后的回调
    uploadSuccess (response, file, tag) {
      if (this.shopData[tag] !== undefined) {
        this.shopData[tag] = response
      } else if (this.shopInfoData[tag] !== undefined) {
        this.shopInfoData[tag] = response
      } else {
        this[tag] = response
      }
      this.$message({
        message: '上传成功',
        type: 'success',
        showClose: this
      })
    },
    uploadError (response, file, fileList) {
      console.log('上传失败，请重试！', response, file, fileList)
    },
    handleItemChange (val) {
      console.log(val)
    },
    finish () {
      let self = this
      this.sendAxios({
        url: '/api/business/saveShopInfoForm',
        method: 'post',
        data: {
          logo: this.shopData.logo,
          shopNum: this.shopNum,
          shopInfoJson: JSON.stringify(this.shopInfoData)
        }
      }).then(res => {
        self.$emit('update:ModulePopupShow', false)
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
          obj.label = data[i].fullName
          obj.value = data[i].enCode
          temp = this.toTree(data, data[i].departmentId)
          if (temp.length > 0) {
            obj.children = temp
          }
          tree.push(obj)
        }
      }
      return tree
    },
    echoTree (foodInstitute) {
      if (foodInstitute.length > 7) {
        this.foodInstitutes.push(foodInstitute.substring(foodInstitute.length - 3, foodInstitute.length))
      }
      this.foodInstitutes.push(foodInstitute)
    }
  },
  created: function () {
    this.initData()
    let self = this
    if (this.updateId && this.updateId !== '') {
      this.sendAxios({
        url: '/api/business/find',
        method: 'post',
        data: {id: this.updateId}
      }).then(function (res) {
        console.log(res)
        self.shopData = res.shop
        self.shopNum = res.shop && res.shop.shopNum
        if (res.shop.businessTime && res.shop.businessTime.length > 0) {
          let businessTime = res.shop.businessTime.split('-')
          self.shopData.startTime = businessTime[0]
          self.shopData.endTime = businessTime[1]
        }
        if (self.shopData.foodInstitute && self.shopData.foodInstitutes !== '') {
          self.echoTree(self.shopData.foodInstitute)
        }
        if (res.shopInfo) {
          self.shopInfoData = res.shopInfo
        }
        self.initShop = true
      }).catch(error => {
        console.log(error)
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .formCell {
    width: 100%;
  }

  .food {
    text-align: right;
  }

  .form {
    padding: 10px 10%;
  }
</style>
