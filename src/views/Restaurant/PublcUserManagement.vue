<template>
  <div>
    <el-table
      :data="tableData.result"
      border
      style="width: 100%">
      <el-table-column
        prop="nickname"
        label="用户名"
        width="180">
      </el-table-column>
      <el-table-column label="头像">
        <template slot-scope="scope" style="text-align: center">
          <img :src="scope.row.headImgUrl" alt="" style="display: inline-block;width: 50px;height: 30px">
        </template>
        <!--<span>-->
          <!--<img src="scope.row.headImgUrl" alt="">-->
        <!--</span>-->
      </el-table-column>
      <el-table-column
        prop="sex"
        label="性别"
        width="180">
      </el-table-column>
      <el-table-column
        prop="province"
        label="省">
      </el-table-column>
      <el-table-column
        prop="city"
        label="市">
      </el-table-column>
      <!--<el-table-column-->
        <!--slot-scope="scope"-->
        <!--label="头像">-->
        <!--<span>{{scope}}</span>-->
        <!--&lt;!&ndash;<img :src="scope.row.headImgUrl" alt="">&ndash;&gt;-->
      <!--</el-table-column>-->
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'PublcUserManagement',
  data () {
    return {
      tableData: []
    }
  },
  methods: {
    getuserlist () {
      this.sendAxios({
        url: 'http://192.168.2.21:8080/wechat/getUserList',
        method: 'post'
      })
        .then(res => {
          this.tableData = res
          console.log(res)
        })
    }
  },
  created () {
    this.getuserlist()
  }
}
</script>

<style scoped>

</style>
