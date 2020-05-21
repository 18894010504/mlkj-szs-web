<template>
    <div class="complain-wrap">
      <el-form ref="form"  :model="form" label-width="150px" size="small">
        <el-form-item  label="投诉标题:">
          <el-input disabled v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item  label="投诉商家:">
          <el-input disabled v-model="form.shopName"></el-input>
        </el-form-item>
        <el-form-item  label="来源:">
          <el-input disabled v-model="form.source"></el-input>
        </el-form-item>
        <el-form-item  label="地址:">
          <el-input disabled v-model="address"></el-input>
        </el-form-item>
        <el-form-item  label="投诉人电话:">
          <el-input disabled v-model="form.phone"></el-input>
        </el-form-item>
        <el-form-item  label="投诉时间:">
          <el-input disabled v-model="form.createdAt"></el-input>
        </el-form-item>
        <el-form-item  label="联系人:">
          <el-input disabled v-model="form.linkMan"></el-input>
        </el-form-item>
        <el-form-item label="投诉（举报）内容:">
          <el-input disabled type="textarea" v-model="form.content"></el-input>
        </el-form-item>
         <el-form-item label="投诉（举报）图片:">
          <el-col :span="24">
            <div class="grid-content bg-purple" >
              <img :src="index" v-for="(index,key) in complainimg" :key="key" alt="" width="150px" style="display: inline-block;margin: 10px;">
            </div>
          </el-col>
        </el-form-item>
        <el-form-item label="回复列表：">
            <el-row>
              <el-col :span="24" v-for="(o, key) in listContent" :key="key" style="margin: 5px">
                <el-card :body-style="{ padding: '0px' }">
                  <div v-if="o.replyImages">
                    <img class="image" v-for="(item, index) in o.replyImages.split(',')" :key="index" :src="item">
                  </div>
                  <div style="padding: 14px;">
                    <span>回复内容：{{o.replyContent}}</span>
                    <div class="bottom clearfix">
                      <time class="time">回复时间：{{ o.handleTime }}</time>
                    </div>
                  </div>
                </el-card>
              </el-col>
            </el-row>
        </el-form-item>
      </el-form>
    </div>
</template>

<script>
export default {
  name: 'complaininfo',
  props: ['complainid'],
  data () {
    return {
      form: {
        complainTime: '',
        content: '',
        createdAt: '',
        createdUid: '',
        images: '',
        linkMan: '',
        handleTime: '',
        handleContent: '', // 处理内容
        leaderIdea: '', // 处理意见
        result: '',
        feedback: '',
        address: '',
        phone: '',
        source: '',
        shop: '',
        title: '',
        status: ''
      },
      listContent: '',
      complainimg: '',
      address: '',
      imageslist: []
    }
  },
  methods: {
    initpage (info) {
      let self = this
      this.sendAxios({
        url: '/api/complain/complainInfo',
        method: 'post',
        data: {
          id: info.keyValue || ''
        }
      })
        .then(res => {
          self.form = res
          self.complainimg = res.images.split(',')
          self.address = res.province + ' -- ' + res.city + ' -- ' + res.district + ' -- ' + res.street
          self.sendAxios({
            url: '/api/dataItem/getItemdetail',
            method: 'post',
            data: {
              itemCode: 'sourceManage'
            }
          })
            .then(res => {
              for (let index in res) {
                if (self.form.source == res[index].itemValue) {
                  self.form.source = res[index].itemName
                }
              }
            })
        })
    },
    replylistfun () {
      this.sendAxios({
        url: '/api/complain/complainReplyList',
        method: 'post',
        data: {
          id: this.complainid
        }
      })
        .then(res => {
          this.listContent = res
          // this.imageslsit = (res.replyImages.split(','))
        })
    }
  },
  created () {
    this.replylistfun()
    console.log(this.complainid)
    let infodata = {
      keyValue: this.complainid
    }
    this.initpage(infodata)
  }
}
</script>

<style scoped lang="scss">
  .complain-wrap{
    height: 550px;
    overflow: auto;
    padding-right: 15px;
    .image{
      width: 100px;
      height: 100px;
    }
  }
</style>
