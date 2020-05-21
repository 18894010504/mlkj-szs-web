<template>
  <div style="height: 100%">
    <el-container>
      <el-aside width="200px">
        商户证照{{text}}
        <input type="text" v-model="text">
      </el-aside>
      <el-main>
        <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
        prop="shopName"
        label="商家名"
        width="180">
        </el-table-column>
        <el-table-column
        prop="uid"
        label="管理员"
        width="180">
        </el-table-column>
        <el-table-column
        prop="address"
        label="地址">
        </el-table-column>
        <el-table-column
        fixed="right"
        label="操作"
        width="100">
        <template slot-scope="scope">
        <el-button @click.native="click(scope)" type="text" size="small">查看证件</el-button>
        </template>
        </el-table-column>
        </el-table>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'papers',
  methods: {
    click (scope) {
      this.sendAxios({
        url: '/api/business/findInfo',
        method: 'post',
        data: {
          id: scope.row.id
        }
      })
        .then(e => {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          // this.time = e
          // this.show = true
        })
    }
  },
  watch: {
    text (val) {
      console.log(val)
    }
  },
  data () {
    return {
      text: '',
      show: false,
      time: {},
      tableData: [
        {
          'businessLicenseNo': '92620102MA748FWD8B',
          'businessTypes': '',
          'classify': '',
          'districtFoodInspection': '城关区食品药品监督管理局',
          'foodInstitute': '0101017',
          'foodInstituteName': '东岗街道食药所',
          'gridConnected': 0,
          'id': '512202189558857728',
          'licenceNo': 'JY26201021656324',
          'linkMan': '',
          'operateMode': '',
          'phone': '13993114760',
          'scale': '小型餐饮（＞30㎡，≦150㎡）',
          'serviceClassify': '',
          'shopName': '城关区雁儿湾鑫缘来过桥米线店',
          'shopNum': '1002009390',
          'streetId': '1000099',
          'type': '001',
          'uid': '汪源，李海洋'
        }
      ]
    }
  },
  created () {
    // this.sendAxios({
    //   url: ''
    // })
  }
}
</script>

<style scoped lang="scss">
   .img{
     width: 200px;
   }
</style>
