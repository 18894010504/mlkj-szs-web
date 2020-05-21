<template>
  <div class="reply-wrap">
    <el-form ref="form"  :model="form" label-width="150px" size="small">
      <el-form-item required label="投诉图片:">
        <el-upload
          class="upload-demo"
          ref="upload"
          :multiple="true"
          :action="uploadImgUrl"
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
      <el-form-item label="回复内容:">
          <el-input  type="textarea" rows="15" v-model="form.content"></el-input>
      </el-form-item>
      <!--<el-form-item  label="投诉标题:">-->
        <!--<el-input disabled v-model="form.title"></el-input>-->
      <!--</el-form-item>-->
      <!--<el-form-item  label="来源:">-->
        <!--<el-input disabled v-model="form.source"></el-input>-->
      <!--</el-form-item>-->
      <!--<el-form-item  label="地址:">-->
        <!--<el-input disabled v-model="address"></el-input>-->
      <!--</el-form-item>-->
      <!--<el-form-item  label="投诉人电话:">-->
        <!--<el-input disabled v-model="form.phone"></el-input>-->
      <!--</el-form-item>-->
      <!--<el-form-item  label="投诉时间:">-->
        <!--<el-input disabled v-model="form.createdAt"></el-input>-->
      <!--</el-form-item>-->
      <!--<el-form-item  label="联系人:">-->
        <!--<el-input disabled v-model="form.linkMan"></el-input>-->
      <!--</el-form-item>-->
      <!--<el-form-item  label="投诉（举报）内容:">-->
        <!--<el-input disabled type="textarea" v-model="form.content"></el-input>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="反馈情况:">-->
        <!--<el-input  type="textarea" v-model="form.feedback"></el-input>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="处理内容:">-->
        <!--<el-input  type="textarea" v-model="form.handleContent"></el-input>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="处理意见:">-->
        <!--<el-input  type="textarea" v-model="form.handleIdea"></el-input>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="领导意见:">-->
        <!--<el-input  type="textarea" v-model="form.leaderIdea"></el-input>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="处理时间:">-->
        <!--<el-date-picker-->
          <!--v-model="form.handleTime"-->
          <!--type="date"-->
          <!--size="small"-->
          <!--align="left"-->
          <!--format="yyyy-MM-dd"-->
          <!--@change="changeStartTime"-->
          <!--placeholder="选择日期时间">-->
        <!--</el-date-picker>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="投诉（举报）图片:">-->
        <!--<el-col :span="24">-->
          <!--<div class="grid-content bg-purple" >-->
            <!--<img :src="index" v-for="(index,key) in complainimg" :key="key" alt="" width="150px" style="display: inline-block;margin: 10px;">-->
          <!--</div>-->
        <!--</el-col>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="处理结果:">-->
        <!--<el-input  type="textarea" v-model="form.result"></el-input>-->
      <!--</el-form-item>-->
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'reply',
  props: ['complainid'],
  data () {
    return {
      uploadImgUrl: 'http://netdisk.szschina.cn/szsManageImgUpload',
      fileList: [],
      form: {
        images: '',
        content: ''
      },
      complainimg: '',
      address: ''
    }
  },
  methods: {
    savereplay (fun) {
      this.sendAxios({
        url: '/api/complain/backgroundSave',
        method: 'post',
        data: {
          id: this.complainid,
          replyContent: this.form.content,
          replyImages: this.form.images
        }
      })
        .then(res => {
          fun(res)
        })
    },
    // 文件上传方法
    submitUpload (ref) {
      this.$refs[ref].submit()
    },
    handleRemove (file, fileList) {
      console.log(file, fileList)
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
    }
  },
  created () {
    // let complaint = {
    //   complainid: this.complainid
    // }
    // this.complaintreply(complaint)
  }
}
</script>

<style scoped>
  .reply-wrap{
    height: 500px;
    overflow: auto;
    padding-right: 15px;
  }
</style>
