<template>
    <div>
      <el-form ref="form" :model="form" label-width="100px" :inline="true" size="small">
        <el-form-item required label="地区编号：" class="form-item">
          <el-input  v-model="form.id"></el-input>
        </el-form-item>
        <el-form-item required label="所属地域：" class="form-item">
          <el-input disabled type="text" v-model="form.tid  "></el-input>
        </el-form-item>
        <el-form-item required label="地区名称：" class="form-item">
          <el-input type="text" v-model="form.areaName  "></el-input>
        </el-form-item>
        <el-form-item required label="名称简拼：" class="form-item">
          <el-input type="text" v-model="form.nameJp  "></el-input>
        </el-form-item>
        <el-form-item required label="树深度：" class="form-item">
          <el-input type="text" v-model="form.depth  "></el-input>
        </el-form-item>
        <el-form-item required label="经度：" class="form-item">
          <el-input type="text" v-model="form.longitude  "></el-input>
        </el-form-item>
        <el-form-item required label="维度：" class="form-item">
          <el-input type="text" v-model="form.latitude "></el-input>
        </el-form-item>
      </el-form>
    </div>
</template>

<script>
export default {
  name: 'areamanageadd',
  props: ['parentId'],
  data () {
    return {
      form: {
        areaName: '', // 名字
        depth: '', // 深度
        id: '',
        longitude: '', // 经度
        latitude: '', // 纬度
        nameJp: '', // 简拼
        tid: this.parentId // 所属地域

      }
    }
  },
  methods: {
    areasavefun (fun) {
      this.sendAxios({
        url: '/api/areas/saveAreasForm',
        method: 'post',
        data: this.form
      })
        .then(res=>{
          debugger
          fun(res)
        })
    }
  },
  created () {
    console.log(this.parentId)
  }
}
</script>

<style scoped>

</style>
