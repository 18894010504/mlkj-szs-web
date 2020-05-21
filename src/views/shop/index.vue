<template>
  <div class="shop-manage" style="height: 100%">
    <el-main class="conent">
      <div>
        <div class="head">
          <div class="left">
            <el-cascader
              :options="requestData.foodInstitute"
              v-model="foodInstitutes"
              size="small"
              :change-on-select="true"
              clearable
              placeholder="请选择食药所"
              @active-item-change="handleItemChange">
            </el-cascader>
            <el-input v-model="params.keyword" placeholder="请输入内容" size="small">
              <el-select v-model="params.searchType" slot="prepend" placeholder="请选择">
                <el-option :label="item.label" :value="item.value" v-for="item in searchType"
                           :key="item.value"></el-option>
              </el-select>
              <el-button slot="append" size="small" @click="searchShop" icon="el-icon-search">搜索</el-button>
            </el-input>
            <el-button slot="append" size="small" @click="clearAllSearch" type="primary">刷新</el-button>
          </div>
          <div class="right">
            <el-button @click="addShop('new')" class="btn" size="small" icon="el-icon-edit">
              新增
            </el-button>
          </div>
        </div>
        <div class="conentHtml">
          <el-table
            style="width: 100%"
            :data="listData.rows"
            stripe
            size="small"
            height="calc(100vh - 200px)"
            border>
            <el-table-column
              :label="item.label"
              :prop="item.prop"
              :width="item.width"
              :align="item.align"
              v-for="item in listColumnData" :key="item.prop">
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="240">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="details(scope)">查看</el-button>
                <el-button type="text" size="small" @click="edit(scope)">编辑</el-button>
                <el-button type="text" size="small" @click="deleteCol(scope)">删除</el-button>
                <el-button type="text" size="small" @click="bindDevice(scope)">绑定监控设备</el-button>
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
              @current-change="(index)=>{page.index=index;getGirTableData(index)}"
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
              <!--@current-change="(index)=>{page.index=index;getGirTableData(index)}">-->
            <!--</el-pagination>-->
          <!--</div>-->
        <!--</div>-->
      </div>
    </el-main>
    <el-dialog
      :title="ModulePopupText"
      :visible.sync="ModulePopupShow"
      width="70%">
      <shop-add v-if="ModulePopupShow" :ModulePopupShow.sync="ModulePopupShow" :updateId="updateId"></shop-add>
    </el-dialog>
    <el-dialog
      title="绑定监控设备"
      :visible.sync="devicePopupShow"
      width="70%">
      <div class="headDevice">
        <div class="left">
          <el-input v-model="deviceId" placeholder="请输入内容" width="60%">
            <template slot="append">
              <el-button slot="append" icon="el-icon-search" @click="searchDevice">搜索</el-button>
            </template>
          </el-input>
        </div>
        <div class="right">
          <el-button @click="addDeviceLive" class="btn" size="small" icon="el-icon-edit">
            新增
          </el-button>
        </div>
      </div>
      <el-table
        style="width: 100%"
        :data="deviceAliveList"
        stripe
        size="small"
        border>
        <el-table-column
          :label="item.label"
          :prop="item.prop"
          :width="item.width"
          v-for="item in liveListColumnData" :key="item.prop">
        </el-table-column>
        <el-table-column label="是否在线">
          <template slot-scope="scope">
            <el-switch :active-value="1" v-model="scope.row.liveStatus" disabled></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="封面图片">
          <template slot-scope="scope"><img :src="scope.row.channelThumb"/></template>
        </el-table-column>
        <el-table-column label="是否公开">
          <template slot-scope="scope">
            <el-switch :inactive-value="0" :active-value="1" v-model="scope.row.openStatus" disabled></el-switch>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="200">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="deviceLiveEdit(scope)">编辑</el-button>
            <el-button type="text" size="small" @click="deviceLiveDelete(scope)">删除</el-button>
            <el-button type="text" size="small" @click="lookLiveUrl(scope)">查看直播</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog
      title="绑定设备"
      :visible.sync="deviceAddPopupShow"
      width="40%">
      <el-form ref="deviceAdd" :model="shopLiveData" :rules="addDeviceRules" size="mini" label-position="left"
               label-width="100px">
        <el-form-item label="通道号" prop="channelId">
          <el-input class="formCell" v-model="shopLiveData.channelId"></el-input>
        </el-form-item>
        <el-form-item label="通道名称">
          <el-input class="formCell" v-model="shopLiveData.channelName"></el-input>
        </el-form-item>
        <el-form-item label="视频提供方">
          <el-select v-model="shopLiveData.serviceProvider" placeholder="请选择" style="width: 100%;">
            <el-option
              v-for="item in requestData.deviceType"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商家名称">
          <el-input class="formCell" v-model="deviceShopName" disabled></el-input>
        </el-form-item>
        <el-form-item label="设备编号">
          <el-select v-model="shopLiveData.deviceSn" placeholder="请选择" style="width: 100%;">
            <el-option
              v-for="item in requestData.devices"
              :key="item.id"
              :label="item.deviceSn"
              :value="item.deviceSn">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开放状态">
          <el-switch
            v-model="shopLiveData.openStatus"
            active-color="#13ce66"
            :active-value="1"
            :inactive-value="0"
            inactive-color="#ff4949">
          </el-switch>
        </el-form-item>
        <el-form-item label="直播地址">
          <el-input class="formCell" v-model="shopLiveData.url"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deviceAddPopupShow = false">取 消</el-button>
        <el-button type="primary" @click="submitShopLive('deviceAdd')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="查看直播"
      :visible.sync="livePopupShow"
      width="40%">
      <ali-player :vid="liveData.url" :height="liveData.height" :isLive="true" :playauth="liveData.playAuth"
                  :source="liveData.url" ref="aliPlayer" :cover="liveData.cover"></ali-player>
    </el-dialog>
    <el-dialog
      title="查看详情"
      :visible.sync="detailsPopupShow"
      width="80%">
      <shop-details v-if="detailsPopupShow" :ModulePopupShow.sync="detailsPopupShow"
                    :detailsId="detailsId"></shop-details>
    </el-dialog>
  </div>
</template>
<script>
import ShopAdd from './add'
import {clearObject} from '../../utils/tools'
import aliPlayer from '@/components/VueAliplayer'
import ShopDetails from './details'

export default {
  name: 'shopModule',
  components: {
    ShopAdd, aliPlayer, ShopDetails
  },
  data () {
    return {
      detailsPopupShow: false,
      detailsId: '',
      livePopupShow: false,
      shopName: '',
      listColumnData: [
        {
          label: '商家号',
          prop: 'shopNum',
          width: '140px',
          align: 'center'
        },
        {
          label: '商家名称',
          prop: 'shopName',
          width: '',
          align: 'left'
        },
        {
          label: '营业执照',
          prop: 'businessLicenseNo',
          width: '200px',
          align: 'left'
        },
        {
          label: '许可证',
          prop: 'licenceNo',
          width: '180px',
          align: 'left'
        },
        {
          label: '食药所',
          prop: 'foodInstituteName',
          width: '',
          align: 'left'
        },
        {
          label: '联系人',
          prop: 'linkMan',
          width: '120px',
          align: 'left'
        },
        {
          label: '联系电话',
          prop: 'phone',
          width: '120px',
          align: 'left'
        }
      ],
      liveListColumnData: [
        {
          label: '通道名称',
          prop: 'channelName',
          width: '',
          align: 'left'
        }
      ],
      deviceAliveList: [],
      deviceAddPopupShow: false,
      deviceId: '',
      shopLiveData: {
        channelId: '',
        channelName: '',
        serviceProvider: '',
        shopNum: '',
        deviceSn: '',
        openStatus: false,
        url: ''
      },
      addDeviceRules: {
        channelName: [
          {required: true, message: '通道名称不能为空', trigger: 'blur'}
        ],
        url: [
          {required: true, message: '直播地址不能为空', trigger: 'blur'}
        ]
      },
      devicePopupShow: false,
      page: {
        index: 1, // 当前页数
        size: 30, // 最大行数
        page: 1, // 当前页数
        records: 0, // 总条目数
        total: 0 // 总页数
      },
      ModulePopupShow: false,
      ModulePopupText: '增加商户',
      records: 0,
      params: {
        pagination: {},
        keyword: '',
        searchType: 'shopName',
        foodInstitute: '',
        gridConnected: ''
      },
      listData: {},
      updateId: '',
      deviceShopNum: '',
      deviceShopName: '',
      requestData: {
        devices: [],
        foodInstitute: [],
        deviceType: []
      },
      foodInstitutes: [],
      liveData: {
        url: '',
        playAuth: 'sstyYuew678999ew90000000xtt7TYUh',
        cover: '',
        height: '400px'
      },
      searchType: [
        {
          label: '商家名称',
          value: 'shopName'
        },
        {
          label: '营业执照',
          value: 'license'
        },
        {
          label: '商家号',
          value: 'shopNum'
        }
      ]
    }
  },
  created () {
    this.getFoodInstituteTree()
    this.getGirTableData()
  },
  methods: {
    clearAllSearch () {
      clearObject(this.params)
      this.params.searchType = 'shopName'
      this.getGirTableData()
    },
    details (scope) {
      this.detailsPopupShow = true
      this.detailsId = scope.row.id
    },
    lookLiveUrl (scope) {
      this.livePopupShow = true
      this.liveData.url = scope.row.url
      this.liveData.cover = scope.row.channelThumb
      const player = this.$refs.aliPlayer
      player && player.reloadPlayer()
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
    handleItemChange (val) {
    },
    addDeviceLive () {
      clearObject(this.shopLiveData)
      this.shopLiveData.shopNum = this.deviceShopNum
      this.deviceAddPopupShow = true
      let self = this
      this.initDeviceType()
      this.sendAxios({
        url: '/api/device/findBySid',
        method: 'post',
        data: {
          shopNum: this.deviceShopNum
        }
      }).then(res => {
        self.requestData.devices = res
      }).catch(error => {
        console.log(error)
      })
    },
    submitShopLive (refForm) {
      let self = this
      this.$refs[refForm].validate((valid) => {
        if (!valid) {
          console.error('表单验证不通过')
        } else {
          self.sendAxios({
            url: '/api/device/addUrl',
            method: 'post',
            data: this.shopLiveData
          }).then(res => {
            self.deviceAddPopupShow = false
            self.getShopLive()
          }).catch(error => {
            self.deviceAddPopupShow = false
            console.log(error)
          })
        }
      })
    },
    deviceLiveEdit (scope) {
      let self = this
      this.initDeviceType()
      this.sendAxios({
        url: '/api/device/findLive',
        method: 'post',
        data: {
          liveId: scope.row.id
        }
      }).then(res => {
        self.shopLiveData = res
      }).catch(error => {
        console.log(error)
      })
      this.deviceAddPopupShow = true
    },
    deviceLiveDelete (scope) {
      let self = this
      this.$confirm('确认初始化？')
        .then(_ => {
          this.sendAxios({
            url: '/api/device/delUrl',
            method: 'post',
            data: {
              liveId: scope.row.id
            }
          }).then(res => {
            this.$message({
              message: '删除成功',
              type: 'success',
              showClose: this
            })
            self.getShopLive()
          }).catch(error => {
            console.log(error)
          })
        })
        .catch(_ => {
        })
    },
    addShop () {
      this.updateId = ''
      this.ModulePopupShow = true
    },
    handleSelect (item) {
      this.page.records = 1
      this.page.total = 1
      this.listData.rows = []
      this.listData.rows.push(item)
    },
    searchShop () {
      if (this.foodInstitutes.length > 0) {
        this.params.foodInstitute = this.foodInstitutes[this.foodInstitutes.length - 1]
      }
      this.page.index = 1
      if (this.params.searchType) {
        this.getGirTableData()
      } else {
        this.$message({
          message: '选择查询类型',
          type: 'error',
          showClose: this
        })
      }
    },
    getGirTableData () {
      let self = this
      this.params.pagination = JSON.stringify({
        rows: this.page.size,
        page: this.page.index,
        sidx: 'id'
      })
      this.sendAxios({
        url: '/api/business/page',
        method: 'post',
        data: this.params
      }).then(function (res) {
        self.$message({
          message: '加载成功',
          type: 'success',
          showClose: this
        })
        self.listData = res
        self.page.records = res.records
        self.page.total = res.total
      })
    },
    searchDevice () {
      console.log('aslfdjaslkdfjas')
    },
    edit (scope) {
      this.updateId = scope.row.id
      this.ModulePopupShow = true
    },
    getShopList (keyWord, cb) {
      let self = this
      this.params.pagination = JSON.stringify({
        rows: this.page.size,
        page: this.page.index,
        sidx: 'id'
      })
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
      console.log(scope.row.id)
      let self = this
      this.sendAxios({
        url: '/api/business/delete',
        method: 'post',
        data: {
          id: scope.row.id
        }
      }).then(res => {
        self.$message({
          message: '删除成功',
          type: 'success',
          showClose: this
        })
        this.getGirTableData()
      })
    },
    bindDevice (scope) {
      this.devicePopupShow = true
      this.shopLiveData.shopId = scope.row.id
      this.deviceShopNum = scope.row.shopNum
      this.deviceShopName = scope.row.shopName
      this.getShopLive()
    },
    getShopLive () {
      let self = this
      this.sendAxios({
        url: '/api/device/channels',
        method: 'post',
        data: {
          shopNum: this.deviceShopNum
        }
      }).then(res => {
        self.deviceAliveList = res
      }).catch(error => {
        console.log(error)
      })
    }
  }
}
</script>
<style lang="scss" scoped>

  .el-input {
    width: 100% !important;
    .el-select {
      width: 110px !important;
    }
  }

  .prism-progress {
    display: none !important;
  }

  img {
    max-width: 100% !important;
    height: auto;
  }

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
        display: flex;
        > p {
          padding: 5px 10px;
          border-bottom: 1px solid $border_color3;
          text-align: left;
        }
        .right {
          text-align: right;
          flex: 1;
          .group {
            width: 100%;
          }
        }
        .left {
          flex: 1;
          display: flex;
          .el-cascader .el-input {
            display: inline-block !important;
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

  .headDevice {
    width: 100%;
    display: flex;
    margin: -20px 0 10px 0;
    .left {
      flex: 1;
      display: flex;
      .el-button .el-input .el-selectel-cascader {
        flex: 1;
      }
    }
    .right {
      flex: 1;
      text-align: right;
    }
  }
</style>
