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
        <div class="header">
          <el-row class="" :gutter="10">
            <!--<el-col :span="3">-->
              <!--<el-select class="formOption" filterable @visible-change="(type) => { !type && addPolygonList('province', province.value) }" v-model="province.value" placeholder="省">-->
                <!--<el-option-->
                  <!--size="small"-->
                  <!--v-for="item in province.list"-->
                  <!--:key="item.id"-->
                  <!--:label="item.name"-->
                  <!--:value="item.id">-->
                <!--</el-option>-->
              <!--</el-select>-->
            <!--</el-col>-->
            <!--<el-col :span="3">-->
              <!--<el-select class="formOption" filterable @visible-change="(type) => { !type && addPolygonList('city', city.value) }" v-model="city.value" placeholder="市">-->
                <!--<el-option-->
                  <!--size="small"-->
                  <!--v-for="item in city.list"-->
                  <!--:key="item.id"-->
                  <!--:label="item.name"-->
                  <!--:value="item.id">-->
                <!--</el-option>-->
              <!--</el-select>-->
            <!--</el-col>-->
            <!--<el-col :span="3">-->
              <!--<el-select class="formOption" filterable @visible-change="(type) => { !type && addPolygonList('district', district.value) }" v-model="district.value" placeholder="区">-->
                <!--<el-option-->
                  <!--size="small"-->
                  <!--v-for="item in district.list"-->
                  <!--:key="item.id"-->
                  <!--:label="item.name"-->
                  <!--:value="item.id">-->
                <!--</el-option>-->
              <!--</el-select>-->
            <!--</el-col>-->
            <el-col :span="6">
              <el-select class="formOption" filterable @visible-change="(type) => { !type && addPolygonList('street', street.value) }" v-model="street.value" placeholder="街道">
                <el-option
                  size="small"
                  v-for="item in street.list"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="3">
              <div class="">
                <el-tag :type="streetDepartmentCode?'success':''">
                  当前绑定所: {{ streetDepartmentCode || '该区域未绑定'}}
                </el-tag>
              </div>
            </el-col>
          </el-row>
          <el-row class="headRow" :gutter="10">
            <el-col :span="5" >
              <div>
                <el-button :type="atPitch.fullName?'primary':''" class="formOption">
                  当前部门: {{atPitch.fullName || '未选择部门'}}
                </el-button>
              </div>
            </el-col>
            <el-col :span="5" >
              <div>
                <el-button :type="atAtea.name?'primary':''" class="formOption">
                  当前区域: {{atAtea.name || '未选择区域'}}
                </el-button>
              </div>
            </el-col>
            <el-col :span="5" >
              <div>
                <el-button @click="binding()" class="formOption">
                  绑定区域
                </el-button>
              </div>
            </el-col>
            <el-col :span="5" >
              <div>
                <el-button @click="remove()" class="formOption">
                  移除区域
                </el-button>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>

export default {
  name: 'departmentAdministerArea', // 部门管辖区域
  data () {
    return {
      defaultProps: {
        children: 'childNodes',
        label: 'fullName'
      },
      AllDepartmentList: [],
      atPitch: {},
      atAtea: {},
      tableData: [],
      province: {
        list: [
          {
            id: '1000001',
            name: '甘肃省'
          }
        ],
        value: '1000001'
      },
      city: {
        list: [],
        value: ''
      },
      district: {
        list: [],
        value: ''
      },
      street: {
        list: [],
        value: ''
      },
      streetDepartmentCode: ''
    }
  },
  watch: {
    // AllDepartmentPitch (val) {
    //   console.log(val)
    // },
    // 'city.value' (val) {
    //   this.getLowerList(val, 'district')
    // },
    // 'district.value' (val) {
    //   this.getLowerList(val, 'street')
    // }
  },
  computed: {
    // streetDepartmentCode () {
    //   let text = ''
    //   if (this.atAtea.departmentCode) {
    //     text = this.forDataId(this.AllDepartmentList)
    //   }
    //   return text
    // }
  },
  methods: {
    forDataId (list) {
      let text = ''
      for (let time of list) {
        if (time.value === this.atAtea.departmentCode) {
          text = time.text
        }
        // if (time.childNodes.length) {
        //   text = this.forDataId(time.childNodes)
        // }
      }
      return text
    },
    remove () {
      let scope = this.atAtea
      if (!scope.id) {
        this.$message({
          message: '请选择区域',
          type: 'warning',
          showClose: this
        })
        return
      }
      this.sendAxios({
        url: '/api/map/area/configArea',
        method: 'post',
        data: {
          mapId: scope.id,
          departmentCode: ''
        }
      })
        .then(e => {
          this.$message({
            message: '移除成功',
            type: 'success',
            showClose: this
          })
          // this.getLowerList(this.district.value, 'street')
        })
    },
    binding () {
      let scope = this.atAtea
      if (!this.atPitch.value && !scope.id) {
        this.$message({
          message: '请选择部门或区域',
          type: 'warning',
          showClose: this
        })
        return
      }
      this.sendAxios({
        url: '/api/map/area/configArea',
        method: 'post',
        data: {
          mapId: scope.id,
          departmentCode: this.atPitch.enCode
        }
      })
        .then(e => {
          this.$message({
            message: '绑定成功',
            type: 'success',
            showClose: this
          })
          // this.getLowerList(this.district.value, 'street')
        })
    },
    addPolygonList (name, id) {
      let polygon = {}
      this[name].list.forEach(time => {
        if (time.id === id) {
          polygon = time
        }
      })
      if (name === 'street') {
        this.atAtea = polygon
      }
      this.sendAxios({
        url: '/api/map/area/boundInstitutes',
        method: 'post',
        data: {
          aid: id
        }
      })
        .then(e => {
          if (e.code === 200) {
            this.streetDepartmentCode = ''
          } else {
            this.streetDepartmentCode = e
          }
        })
    },
    handleNodeClick (data) {
      this.atPitch = data
    },
    sendData (data) {
      let arrtext = ''
      if (data.length) {
        let arr = []
        data.forEach(time => {
          arr.push([time.lng, time.lat])
        })
        let text = JSON.stringify(arr)
        arrtext = text.replace(/\],\[/g, ';')
        arrtext = arrtext.slice(2, -2)
      }
      return arrtext
    },
    savePolygon (name) {},
    mapClick (res) {},
    getLowerList (id, type) {
      this.sendAxios({
        url: '/api/map/area/getStreets',
        method: 'post'
      })
        .then(e => {
          this.street.list = e
          if (e.length) {
            this.street.value = e[0].id
          } else {
            this.street.value = ''
          }
        })
    }
  },
  created () {
    this.sendAxios({
      url: '/api/department/getDepartmentByLoginUser',
      method: 'post'
    })
      .then(e => {
        this.AllDepartmentList = e
      })
    this.getLowerList(1000001, 'city')
  }
}
</script>

<style scoped lang="scss">
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
