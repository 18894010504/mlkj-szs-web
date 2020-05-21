<template>
    <div class="foodback-wrap">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="反馈时间">
          <el-col :span="24">
            <el-date-picker type="date" placeholder="选择日期" v-model="form.time" style="width: 100%;"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="问题类型">
          <el-checkbox-group v-model="form.type">
            <el-checkbox label="卫生问题" name="type"></el-checkbox>
            <el-checkbox label="食品问题" name="type"></el-checkbox>
            <el-checkbox label="后厨问题" name="type"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="联系邮箱">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="活动形式">
          <el-input type="textarea"  :rows="10" v-model="form.content"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">立即创建</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </div>
</template>

<script>
export default {
  name: 'Feedback',
  data () {
    return {
      form: {
        content: '',
        email: '',
        type: [],
        time: '',
        title: '',
      }
    }
  },
  methods: {
    onSubmit () {
      console.log('submit!')
    }
  }
}
</script>

<style scoped lang="scss">
  .foodback-wrap{
    width: 500px;
    height: 100%;
    margin: auto;
    margin-top: 50px;
  }
</style>
