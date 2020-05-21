<template>
  <div class="shop-manage" style="height: 100%">
    <el-main class="conent">
      <div>
        <div class="head">
          <div class="left">
            <el-autocomplete
              v-model="params.keyword"
              :fetch-suggestions="querySearchAsync"
              placeholder="请输入内容"
              size="small"
              @select="handleSelect"
            ></el-autocomplete>
            <el-button @click="clearSearch"
                       size="small">清空搜索</el-button>
          </div>
          <div class="right">
            <el-button @click="addShopDevice" class="btn" size="small" icon="el-icon-edit">
              新增
            </el-button>
          </div>
        </div>
        <div class="conentHtml">
          <el-table
            height="calc(100vh - 200px)"
            style="width: 100%"
            :data="deviceList"
            stripe
            size="small"
            border>
            <el-table-column
              :label="item.label"
              :prop="item.prop"
              :width="item.width"
              v-for="item in listColumnData" :key="item.prop">
            </el-table-column>
            <el-table-column
              label="设备状态"
              width="180px">
              <template slot-scope="scope">
                <el-switch :inactive-value=0 :active-value=1 v-model="scope.row.status" disabled></el-switch>
              </template>
            </el-table-column>

            <el-table-column
              label="是否完成初始化"
              width="180px"
            >
              <template slot-scope="scope">
                <el-switch :inactive-value="0" :active-value="1" v-model="scope.row.inited" disabled></el-switch>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="200">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="edit(scope)">编辑</el-button>
                <el-button type="text" size="small" @click="deleteCol(scope)">删除</el-button>
                <el-button type="text" size="small" @click="initDevice(scope)">初始化设备</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="ViewFood">
          <div class="foodNum">
            当前页数 {{page.index}} / 查询到 {{page.records}} 条数据
          </div>
          <div class="foodPage">
            <el-pagination
              background
              layout="prev, pager, next"
              :page-size="page.size"
              @current-change="(index)=>{page.index=index;initData()}"
              :page-count="page.total">
            </el-pagination>
          </div>
        </div>
        <!--<div class="food">-->
          <!--<div class="foodNum">-->
            <!--查询到 {{page.records}} 条数据-->
          <!--</div>-->
          <!--<div class="foodPage">-->
            <!--<el-pagination-->
              <!--background-->
              <!--layout="prev, pager, next"-->
              <!--:page-size="page.size"-->
              <!--@current-change="(index)=>{page.index=index;getGirTableData()}"-->
              <!--:page-count="pageTotal">-->
            <!--</el-pagination>-->
          <!--</div>-->
        <!--</div>-->
      </div>
    </el-main>
    <el-dialog
      :title="ModulePopupText"
      :visible.sync="ModulePopupShow"
      width="30%">
      <el-form ref="form" :model="shopDeviceData" size="mini" label-position="left" label-width="100px">
        <el-form-item label="设备号">
          <el-select v-model="shopDeviceData.serviceProvider" placeholder="请选择" style="width: 100%;">
            <el-option
              v-for="item in requestData.deviceType"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备号">
          <el-input class="formCell" v-model="shopDeviceData.deviceSn"></el-input>
        </el-form-item>
        <el-form-item label="商户">
          <el-autocomplete
            v-model="shopName"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入内容"
            style="width: 100%"
            @select="handleSelect"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item label="编码号">
          <el-input class="formCell" v-model="shopDeviceData.code"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="ModulePopupShow = false">取 消</el-button>
        <el-button type="primary" @click="submitShopDevice">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {clearObject} from '../../utils/tools'
export default {
  data () {
    return {
      listColumnData: [
        {
          label: '设备序列号',
          prop: 'deviceSn',
          width: '',
          align: 'left'
        },
        {
          label: '商家号',
          prop: 'shopNum',
          width: '180px',
          align: 'left'
        }
      ],
      shopList: [],
      deviceList: [],
      ModulePopupShow: false,
      ModulePopupText: '增加商户设备',
      shopNum: '',
      shopName: '',
      shopDeviceData: {
        deviceSn: '',
        code: '',
        shopNum: '',
        serviceProvider: ''
      },
      page: {
        index: 1, // 当前页数
        size: 30, // 最大行数
        page: 1, // 当前页数
        records: 0, // 总条目数
        total: 0 // 总页数
      },
      pageTotal: 0,
      params: {
        pagination: {},
        keyword: ''
      },
      listData: {},
      requestData: {
        shops: [],
        deviceType: []
      }
    }
  },
  methods: {
    edit (scope) {
      this.ModulePopupShow = true
      let self = this
      this.sendAxios({
        url: '/api/device/find',
        method: 'post',
        data: {
          id: scope.row.id
        }
      }).then(res => {
        self.shopDeviceData = res
        return this.sendAxios({
          url: '/api/business/findByShopNum',
          method: 'post',
          data: {
            shopNum: res.shopNum
          }
        })
      }).then(res => {
        self.shopName = res.shop.shopName
        self.initDeviceType()
      }).catch(error => {
        console.log(error)
      })
    },
    initDeviceType () {
      let self = this
      this.sendAxios({
        url: '/api/dataItem/getItemdetail',
        method: 'post',
        data: {
          itemCode: 'deviceType'
        }
      }).then(res => {
        self.requestData.deviceType = res
      })
    },
    deleteCol (scope) {
      let self = this
      this.$confirm('确认删除？')
        .then(_ => {
          this.sendAxios({
            url: '/api/device/delete',
            method: 'post',
            data: {
              id: scope.row.id
            }
          })
            .then(e => {
              this.$message({
                message: '删除成功',
                type: 'success',
                showClose: this
              })
              self.initData()
            })
            .catch(e => {
              console.log(e)
            })
        })
        .catch(_ => {})
    },
    initDevice (scope) {
      let self = this
      this.$confirm('确认初始化？')
        .then(_ => {
          this.sendAxios({
            url: '/api/device/createLive',
            method: 'post',
            data: {
              deviceSn: scope.row.deviceSn
            }
          })
            .then(res => {
              self.$message({
                message: '',
                type: 'success',
                showClose: this
              })
            })
            .catch(e => {
              console.log(e)
            })
        })
        .catch(_ => {})
    },
    addShopDevice () {
      clearObject(this.shopDeviceData)
      this.ModulePopupShow = true
      this.initDeviceType()
    },
    clearSearch () {
      this.params.keyword = ''
      this.initData()
    },
    getGirTableData () {
      this.page.page = this.page.page + 1
      this.initData()
    },
    handleSelect (item) {
      this.shopName = item.shopName
      this.shopDeviceData.shopNum = item.shopNum
      let self = this
      this.sendAxios({
        url: '/api/device/findBySid',
        method: 'post',
        data: {
          shopNum: item.shopNum
        }
      }).then(res => {
        self.deviceList = res
        self.pageTotal = 1
        self.page.records = res.length
      }).catch(error => {
        console.log(error)
      })
    },
    querySearchAsync (queryString, cb) {
      this.getShopList(queryString, cb)
    },
    getShopList (keyWord, cb) {
      let self = this
      this.params.pagination = JSON.stringify({
        rows: this.page.size,
        page: 1,
        sidx: 'id'
      })
      this.params.searchType = 'shopName'
      this.params.keyword = keyWord
      if (keyWord.length > 0) {
        this.sendAxios({
          url: '/api/business/page',
          method: 'post',
          data: this.params
        }).then(function (res) {
          for (let item of res.rows) {
            item.value = item.shopName
          }
          self.shopList = res.rows
          cb(res.rows)
        })
      }
    },
    submitShopDevice () {
      let self = this
      this.sendAxios({
        url: '/api/device/bind',
        method: 'post',
        data: this.shopDeviceData
      }).then(res => {
        self.ModulePopupShow = false
        self.initData()
      }).catch(error => {
        console.log(error)
      })
    },
    initData () {
      this.params.keyword = ''
      this.params.pagination = JSON.stringify({
        rows: this.page.size,
        page: this.page.index,
        sidx: 'id'
      })
      let self = this
      this.sendAxios({
        url: '/api/device/page',
        method: 'post',
        data: this.params
      }).then(res => {
        self.pageTotal = res.total
        self.deviceList = res.rows
        self.page.total = res.total
        self.page.records = res.records
        self.page.page = res.page
      }).catch(error => {
        console.log(error)
      })
    }
  },
  created () {
    this.initData()
  }
}
</script>
<style lang="scss" scoped>
  .conent {
    width: 100%;
    line-height: initial;
    text-align: left;
    $bor: 1px solid $border_color3;
    > div {
      border: $bor;
      background-color: $back_color_white;
      .food {
        padding: 0px 10px;
        font-size: 0;
        .foodNum {
          width: 20%;
        }
        .foodPage {
          text-align: right;
          width: 80%;
        }
        > div {
          vertical-align: middle;
          font-size: $font_size14;
          display: inline-block;
        }
      }
      .head {
        margin-right: 1px;
        width: 100%;
        > p {
          padding: 5px 10px;
          border-bottom: 1px solid $border_color3;
          text-align: left;
        }
        .right {
          float: right;
          text-align: right;
          .group {
            width: 100%;
          }
          .btn {
            width: (100% / 3);
          }
        }
        > div {
          padding: 5px 10px;
          display: inline-block;
          width: 30%;
        }
      }
    }
  }

  .leftConent {
    > div {
      margin: 5px 0px 5px 5px;
      border: 1px solid $border_color3;
    }
    overflow: hidden;
    line-height: initial;
    div {
      background-color: $back_color_white;
      p {
        padding: 5px 10px;
        border-bottom: 1px solid $border_color3;
        text-align: left;
      }
    }
  }
</style>
