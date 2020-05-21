<template>
    <div>
      <div class="complain-wrap">
        <el-form ref="form"  :model="form" label-width="150px" size="small">
          <el-form-item required  label="投诉标题:">
            <el-input v-model="form.title"></el-input>
          </el-form-item>
          <el-form-item required label="投诉图片:">
            <el-upload
              class="upload-demo"
              ref="upload"
              :multiple="true"
              :action="uploadImgUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="(res, file, fileLists)=>{return uploadSuccess(res,file,fileLists,'complain')}"
              :file-list="fileList"
              accept="jpeg,png,gif"
              :auto-upload="false"
              name="imgFile">
              <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
              <el-button style="margin-left: 10px;" size="small" type="success" @click.stop="submitUpload('upload')">上传到服务器</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="地区:">
            <el-select v-model="province" placeholder="请选择省份" class="selectlist" @change="provincefun">
              <el-option
                v-for="item in provincedata"
                :key="item.id"
                :label="item.value"
                :value="item.id">
              </el-option>
            </el-select>
            <el-select v-model="city" placeholder="请选择市" class="selectlist" @change="cityfun">
              <el-option
                v-for="item in citydata"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <el-select v-model="area" placeholder="请选择区" class="selectlist" @change="street">
              <el-option
                v-for="item in areadata"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <el-select v-model="state" placeholder="请选择街道" class="selectlist" @change="business">
              <el-option
                v-for="item in streetdata"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item required  label="选择投诉商家:">
            <el-select v-model="busine" filterable placeholder="选择投诉商家（可搜索商家）" @change="shopfun">
              <el-option
                v-for="item in businessdata"
                :key="item.shopNum"
                :label="item.shopName"
                :value="item.shopNum">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item required  label="来源:">
            <!--<el-input v-model="form.source"></el-input>-->
            <el-select v-model="form.source" placeholder="请选择" @change="sourcefun">
              <el-option
                v-for="item in sourcedata"
                :key="item.itemValue"
                :label="item.itemName"
                :value="item.itemValue">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item required  label="联系人:">
            <el-input v-model="form.linkMan"></el-input>
          </el-form-item>
          <el-form-item required  label="投诉人电话:">
            <el-input v-model="form.phone"></el-input>
          </el-form-item>
          <!--<el-form-item  label="投诉时间:">-->
            <!--<el-date-picker-->
              <!--v-model="form.complainTime"-->
              <!--type="date"-->
              <!--size="small"-->
              <!--align="left"-->
              <!--format="yyyy-MM-dd"-->
              <!--@change="changeStartTime"-->
              <!--placeholder="选择日期时间">-->
            <!--</el-date-picker>-->
          <!--</el-form-item>-->
          <el-form-item label="问题：">
            <el-checkbox-group v-model="form.problem">
              <el-checkbox label="食品问题"></el-checkbox>
              <el-checkbox label="卫生问题"></el-checkbox>
              <el-checkbox label="服务问题"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="投诉（举报）内容:">
            <el-input  type="textarea" :rows="5" v-model="form.content"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
</template>

<script>
export default {
  name: 'complaintadd',
  data () {
    return {
      uploadImgUrl: 'http://netdisk.szschina.cn/szsManageImgUpload',
      form: {
        title: '', // 标题
        source: '', // 来源
        phone: '', // 联系电话
        content: '', // 内容
        linkMan: '', // 联系人
        images: '', // 图片
        // complainTime: '', // 时间
        shop: '', //
        shopName: '',
        province: '', // 省
        city: '', // 市
        district: '', // 区
        street: '', // 街道
        problem: [], // 问题
        status: 1
      },
      sourcedata: '',
      searchTitle: '',
      fileList: [],
      province: [], // 省
      city: [], // 市
      area: [], // 区
      state: [], // 街道
      busine: [], // 商家
      provincedata: [
        {
          id: 1000001,
          value: '甘肃省'
        }
      ],
      citydata: [], // 城市
      areadata: [], // 区
      businessdata: [], // 商家
      streetdata: [] // 街道,
    }
  },
  methods: {
    // 文件上传方法
    submitUpload (ref) {
      this.$refs[ref].submit()
    },
    handleRemove (file, fileList) {
    },
    // 上传成功后的回调
    uploadSuccess (response, file, fileList, tag) {
      let imglist = []
      for (let index of fileList) {
        imglist.push(index.response)
      }
      this.form.images = imglist.join(',')
      this.$message({
        message: '上传成功',
        type: 'success'
      })
    },
    handlePreview (file) {
      console.log(file)
    },
    // 第一级下拉
    provincefun (id) {
      let departmentIddata = {}
      departmentIddata = this.provincedata.find((item) => {
        return item.id === id
      })
      this.form.province = departmentIddata.value
      this.sendAxios({
        url: '/api/map/area/lowerList',
        method: 'post',
        data: {
          id: id
        }
      })
        .then(res => {
          this.citydata = res
        })
    },
    // 第二级下拉
    cityfun (id) {
      let departmentIddata = {}
      departmentIddata = this.citydata.find((item) => {
        return item.id === id
      })
      this.form.city = departmentIddata.name
      this.sendAxios({
        url: '/api/map/area/lowerList',
        method: 'post',
        data: {
          id: id
        }
      })
        .then(res => {
          this.areadata = res
        })
    },
    // 第三级 区
    street (id) {
      let departmentIddata = {}
      departmentIddata = this.areadata.find((item) => {
        return item.id === id
      })
      this.form.district = departmentIddata.name
      this.sendAxios({
        url: '/api/map/area/lowerList',
        method: 'post',
        data: {
          id: id
        }
      })
        .then(res => {
          this.streetdata = res
        })
    },
    // 第三级联动 选择所要举报的商家
    business (id) {
      let departmentIddata = {}
      departmentIddata = this.streetdata.find((item) => {
        return item.id === id
      })
      this.form.street = departmentIddata.name
      this.sendAxios({
        url: '/api/business/streetList',
        method: 'post',
        data: {
          streetId: id
        }
      })
        .then(res => {
          this.businessdata = res
        })
    },
    // 新增保存的方法
    complainsave (fun) {
      this.form.problem = this.form.problem.join(',')
      this.sendAxios({
        url: '/api/complain/save',
        method: 'post',
        data: this.form
      })
        .then(res => {
          fun(res)
        })
    },
    // 商家列表监听
    shopfun (data) {
      let departmentIddata = {}
      departmentIddata = this.businessdata.find((item) => {
        return item.shopNum === data
      })
      this.form.shop = departmentIddata.shopNum
      this.form.shopName = departmentIddata.shopName
    },
    // 监听日期选择并转换
    // changeStartTime (time) {
    //   let d = new Date(time)
    //   let timedata = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()
    //   this.form.complainTime = timedata
    // },
    sourcefun (val) {
      let departmentIddata = {}
      departmentIddata = this.sourcedata.find((item) => {
        return item.itemValue === val
      })
      this.form.source = departmentIddata.itemName
      console.log(this.form.source)
    }
  },
  created () {
    this.sendAxios({
      url: '/api/dataItem/getItemdetail',
      method: 'post',
      data: {
        itemCode: 'sourceManage'
      }
    })
      .then(res => {
        this.sourcedata = res
      })
  }
}
</script>

<style scoped lang="scss">
  .complain-wrap{
    height: 550px;
    overflow: auto;
    padding-right: 15px;
    .selectlist{
      width: 120px;
    }
  }
</style>
