<template>
  <el-container>
    <el-aside class="left" width="250px">
      <div class="conent">
        <p>部门列表</p>
        <div class="leftList">
          <el-tree :data="AllDepartmentList" @node-click="handleNodeClick" :props="defaultProps" default-expand-all ></el-tree>
        </div>
      </div>
    </el-aside>
    <el-main class="right">
      <div class="conent">
        <div class="conentHtml">
          <el-table
            :data="ModuleList"
            stripe
            v-loading
            size="small"
            border>
            <el-table-column type="index" :index="ModuleIndex+1"></el-table-column>
            <el-table-column prop="realName" label="名称"></el-table-column>
            <el-table-column prop="departmentCode" label="部门编号"></el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="400">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="divide(formDialogShow, scope)" >划分区域</el-button>
                <el-button type="text" size="small" @click="bingShop(scope, 1)" >绑定已绑定商家</el-button>
                <el-button type="text" size="small" @click="bingShop(scope, 0)" >绑定未绑定商家</el-button>
                <el-button type="text" size="small" @click="eleBingShop(scope)" >移除商家</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-main>
    <el-dialog v-if="formDialogShow" :visible.sync="formDialogShow" append-to-body width="600px">
      <el-transfer
        :titles="['所有区域', '已绑定区域']"
        filterable
        :props="props"
        filter-placeholder="请输入区域名关键字"
        v-model="ModuleValues"
        :data="UsersList">
      </el-transfer>
      <div style="text-align: right;padding-top: 20px">
        <el-button type="primary" @click="evel()">保存</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="绑定商家"
      :visible.sync="bingShow"
      ref="multipleTable"
      width="80%">
      <div class="shopList">
        <el-table
          v-loading="loading"
          height="500"
          @selection-change="handleSelectionChange"
          :data="data()"
          style="width: 100%">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            prop="shopName">
            <template slot="header" slot-scope="slot">
              <el-input
                v-model="search"
                size="mini"
                placeholder="按商家名查询"/>
            </template>
          </el-table-column>
          <el-table-column
            prop="scale"
            sortable
            label="规模">
          </el-table-column>
          <el-table-column
            prop="businessLicenseNo"
            sortable
            label="营业执照">
          </el-table-column>
          <el-table-column
            prop="uid">
            <template slot="header" slot-scope="slot">
              <el-input
                v-model="uidSearch"
                size="mini"
                placeholder="按网格员查询"/>
            </template>
          </el-table-column>
        </el-table>
        <el-button @click="bind('shopValue')" style="float: right">绑定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="绑定商家"
      :visible.sync="eleBingShow"
      ref="multipleTable"
      width="80%">
      <div class="shopList">
        <el-table
          height="500"
          @selection-change="handleSelectionChange"
          :data="eleShopList.filter(data => !search || data.shopName.toLowerCase().includes(search.toLowerCase()))"
          style="width: 100%">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            prop="shopName">
            <template slot="header" slot-scope="slot">
              <el-input
                v-model="search"
                size="mini"
                placeholder="按商家名查询"/>
            </template>
          </el-table-column>
          <el-table-column
            prop="scale"
            sortable
            label="规模">
          </el-table-column>
          <el-table-column
            prop="businessLicenseNo"
            sortable
            label="营业执照">
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="100">
            <template slot-scope="scope">
              <el-button @click="eleShopest(scope)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button @click="bind('eleShopList')" style="float: right">保存</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>

export default {
  name: 'bingDivide', // 网格绑定商户
  data () {
    return {
      loading: true,
      props: {
        key: 'value',
        label: 'label'
      },
      ModuleIndex: 0,
      search: '',
      uidSearch: '',
      ModuleKeyword: '',
      bingShow: false,
      formDialogShow: false,
      eleBingShow: false,
      AllDepartmentList: [],
      defaultProps: {
        children: 'childNodes',
        label: 'fullName'
      },
      ModuleValues: [],
      tableData: [],
      ModuleList: [],
      bingData: [],
      bingValue: [],
      shopList: [],
      eleShopList: [],
      shopValue: [],
      user: {}
    }
  },
  watch: {
    ModuleKeyword () {
      this.getGirTableData()
    }
  },
  computed: {},
  methods: {
    data () {
      return this.shopList.filter((data) => {
        let off = false
        if (this.search || this.uidSearch) {
          if (data.shopName.toLowerCase().includes(this.search.toLowerCase()) && data.uid.toLowerCase().includes(this.uidSearch.toLowerCase())) {
            off = true
          } else {
            off = false
          }
        } else {
          off = true
        }
        return off
      })
    },
    evel () {
      this.sendAxios({
        url: '/api/section/saveGridManager',
        method: 'post',
        data: {
          uid: this.uid,
          gridIds: JSON.stringify(this.ModuleValues)
        }
      })
        .then(e => {
          console.log(e)
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          this.formDialogShow = false
        })
    }, // 保存绑定区域
    divide (formDialogShow, scope) {
      if (formDialogShow) {
        this.formDialogShow = false
      } else {
        this.uid = scope.row.userId
        this.sendAxios({
          url: '/api/grid/userGrid',
          method: 'post',
          data: {
            uid: scope.row.userId
          }
        })
          .then(e => {
            console.log(e)
            if (e.readonly) {
              this.$message({
                message: '不可以编辑自己',
                type: 'warning'
              })
              this.formDialogShow = false
            } else {
              this.ModuleValues = []
              this.UsersList = []
              if (e.list) {
                e.list.forEach(res => {
                  let time = {
                    label: res.content.name,
                    value: res.id
                  }
                  if (res.have) {
                    this.ModuleValues.push(res.id)
                  }
                  this.UsersList.push(time)
                })
              }
              this.formDialogShow = true
            }
          })
      }
    }, // 绑定区域
    eleShopest (scope) {
      this.$confirm('确认删除？')
        .then(_ => {
          this.eleShopList.splice(scope.$index, 1)
        })
        .catch(_ => {})
    }, // 删除商户
    bind (name) {
      let arr = []
      this[name].forEach(e => {
        arr.push(e.shopNum)
      })
      this.sendAxios({
        url: '/api/business/manager',
        method: 'post',
        data: {
          uid: this.user.userId,
          sidJson: JSON.stringify(arr)
        }
      })
        .then(e => {
          this.$message({
            message: '绑定成功',
            type: 'success'
          })
          this.bingShow = false
          this.eleBingShow = false
        })
    }, // 发送绑定商户请求
    handleNodeClick (data) {
      this.atPitch = data
      this.sendAxios({
        url: '/api/user/getUsersByDepartment',
        data: {
          departmentCode: data.enCode
        }
      })
        .then(e => {
          console.log(e)
          this.ModuleList = e
          // this.tableData = e
        })
        .catch(e => {
          console.log(e)
        })
    }, // 获取当前所
    handleSelectionChange (val) {
      this.shopValue = val
    }, // 商家列表复选框选择
    bingShop (scope, bindStatus) {
      this.bingShow = true
      this.loading = true
      this.sendAxios({
        url: '/api/business/findShopsByDepartment',
        method: 'post',
        data: {
          departmentCode: this.atPitch.enCode,
          bindStatus: bindStatus
        }
      })
        .then(e => {
          this.loading = false
          this.shopList = e
        })
      this.user = scope.row
    }, // 绑定商家
    eleBingShop (scope) {
      this.loading = true
      this.eleBingShow = true
      this.user = scope.row
      this.sendAxios({
        url: '/api/business/userIsList',
        method: 'post',
        data: {
          uid: scope.row.userId
        }
      })
        .then(e => {
          this.loading = false
          this.eleShopList = e
        })
    } // 移除绑定商家
  },
  created () {
    this.sendAxios({
      url: '/api/department/getDepartmentByLoginUser',
      method: 'post'
    })
      .then(e => {
        this.AllDepartmentList = e
      })
  }
}
</script>

<style scoped lang="scss">
  .shopList {
    max-height: 60vh;
    overflow: auto;
    .shop {
      font-size: 18px;
      padding: 5px 0;
      border-bottom: 1px solid $border_color4;
    }
  }
  .headRow {
    padding-top: 10px;
  }
  .formOption {
    width: 100%;
  }
  .header {
    padding: 5px;
  }
  .right {
    padding: 0;
    line-height: initial;
    .conent {
      margin: 5px;
      border: 1px solid $border_color2;
      > p {
        background-color: $border_color4;
        padding: 10px 0px;
      }
    }
  }
  .left {
    line-height: initial;
    .conent {
      margin: 5px;
      border: 1px solid $border_color2;
      > p {
        background-color: $border_color4;
        padding: 10px 0px;
      }
      .time {
        border-bottom: 1px solid $back_color_white;
        border-left: 5px solid $back_color_white;
        border-top: 1px solid $border_color4;
        padding: 10px 0;
      }
      .pitchTime {
        border-top: 1px solid $back_color_white;
        background-color: $back_color_Info;
        border-bottom: 1px solid $back_color_main;
        border-left: 5px solid $back_color_main;
      }
    }
  }
</style>
