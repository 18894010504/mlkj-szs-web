<template>
  <div>
    <el-container>
      <el-header :height="'auto'">
        <div class="hear_menu">
          <div class="header-title">
            <img class="header-logo" src="../images/logo.png" alt="">
            <h3>“食追溯” 智慧食安 监管平台</h3>
          </div>
          <div class="header-right" v-loading="loadingUser" v-if="userInfo">
            <el-dropdown>
            <span class="el-dropdown-link">
             <i class="iconfont">&#xe614;</i>
              <span class="usertitle">{{ userInfo.account }}</span>
            </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>用户名：{{userInfo.createUserName}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div class="header-right">
            <el-dropdown>
            <span class="el-dropdown-link">
             <i class="iconfont">&#xe613;</i>
            </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <span>暂无消息</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div class="header-right">
            <i class="iconfont" @click="sginout()">&#xe615;</i>
          </div>
        </div>
      </el-header>
      <el-container>
        <div class="left_menu" v-loading.body="loading">
          <div class="leftnav">
            <el-popover
              popper-class="listnav"
              placement="right-start"
              width="140"
              trigger="click"
              content=""
              v-for="(departmen, key) in departmentTree"
              :disabled="departmen.childNodes.length?false:true"
              v-model="showstatus[key]"
              @click.native="openMake(departmen, key)"
              :key="departmen.id">
              <el-menu
                default-active="2"
                class="el-menu-vertical-demo"
                :collapse-transition="true"
                :collapse="isCollapse">
                <el-menu-item
                  v-for="(departmenList) in departmen.childNodes"
                  :key="departmenList.id"
                  @click="departmentClick(departmenList, key)"
                  :index="`${departmenList.id}`">
                  {{departmenList.text}}
                </el-menu-item>
              </el-menu>
              <div slot="reference"
                   class="content-nav"
                   @mousemove.stop="faceValue=departmen.id"
                   v-bind:class='{actives:departmen.id == faceValue}' >
                <div class="left-nav-icon">
                  <i class="iconfont" :style ="{color: color[key]}" v-html="departmen.icon"></i>
                </div>
                <span>{{departmen.text}}</span>
              </div>
            </el-popover>
          </div>
        </div>
        <div class="conent_menu">
          <el-tabs
            v-model="editableTabsValue"
            @tab-remove="removeTab"
            type="border-card">
            <el-tab-pane
              v-for="item in editableTabs"
              :key="item.name"
              :label="item.title"
              :closable="!item.closable"
              :name="item.name">
              <div class="router-view">
                <router-view :name="item.content" :obj="item.obj" />
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Index',
  data () {
    return {
      loading: true,
      loadingUser: true,
      departmentTree: [],
      isCollapse: false,
      color: ['#1afa29', '#123aff', '#0b92f7', '#34ffdd', '#d3a338', '#d81e06', '#1ac61a', '#33e5dc', '#7e11f2'],
      editableTabsValue: 'homeIndex',
      faceValue: 'homeIndex',
      showstatus: [],
      editableTabs: [
        {
          title: '首页模板',
          name: 'homeIndex',
          value: 'homeIndex',
          content: 'homeDome',
          closable: true,
          id: 'homeIndex'
        }
      ],
      leftnav: true,
      tabIndex: 0
    }
  },
  computed: {
    ...mapGetters({
      userInfo: 'getUserInfo'
    })
  },
  methods: {
    removeTab (targetName) {
      let tabs = this.editableTabs
      let activeName = this.editableTabsValue
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1]
            if (nextTab) {
              activeName = nextTab.name
            }
          }
        })
      }
      this.editableTabsValue = activeName
      this.editableTabs = tabs.filter(tab => tab.name !== targetName)
    }, // 关闭标签页
    departmentClick (department, key) {
      this.showstatus[key] = false
      for (let tab of this.editableTabs) {
        if (tab.name === department.id) {
          this.editableTabsValue = department.id
          return
        }
      }
      this.editableTabs.push({
        title: department.text,
        name: department.id,
        content: department.value,
        obj: department
      })
      this.editableTabsValue = department.id
      // this.showstatus = true
    }, // 打开标签页
    sginout () {
      var test = window.location.href
      location.href = test + 'login'
      localStorage.removeItem('mlkjToken')
      this.$store.dispatch('acquireToken')
    }, //  退出登录的方法
    openMake (departmen, key) {
      if (departmen.id == 'homeIndex') {
        this.tabIndex = 1
        if (this.tabIndex === 1) {
          this.departmentClick(departmen)
        }
      }
    },
    // classStyle (departmen) {
    //   this.faceValue = departmen.id
    // } // 导航树鼠标移动事件
  },
  created () {
    this.loading = true
    this.loadingUser = true
    this.$store.dispatch('acquireToken')
      .then(() => {
        this.$store.dispatch('getAllDepartment')
          .then(res => {
            this.loadingUser = false
            this.loading = false
            let home = {
              text: '首页模板',
              icon: '&#xe60f;',
              id: 'homeIndex',
              name: 'homeIndex',
              parentId: 0,
              childNodes: []
            }
            this.departmentTree = res
            this.departmentTree.unshift(home)
          })
      })
  },
  mounted () {
    this.$root.loading.close()
  }
}
</script>

<style scoped lang="scss">
  .router-view {
    height: calc(100vh - 140px);
    padding-bottom: 40px;
    overflow: auto;
  }
  .left_menu {
    text-align: center;
    background: rgb(51,51,51);
    width: 100px;
    /*color: white;*/
    height: calc(100vh - 55px);
    overflow: hidden;
    .leftnav{
      color: white;
      /*height: 100%;*/
      .actives{
        background: #409EFF;
        color: white;
        /*.left-nav-icon {*/
          /*i{*/
            /*color: white;*/
          /*}*/
        }
        /*border-top: 1px solid white;*/
      /*}*/
      .content-nav{
        outline: none;
        padding:10px;
        cursor: pointer;
        border-bottom: 1px solid black;
        -moz-box-shadow:-0px -0px 5px #575757 inset;             /* For Firefox3.6+ */
        -webkit-box-shadow:-0px -0px 5px #575757 inset;          /* For Chrome5+, Safari5+ */
        box-shadow:-0px -0px 5px #575757 inset;                  /* For Latest Opera */
        .left-nav-icon{
          .fitspage{
            color: #409EFF;
          }
          i{
            font-size: 2rem;
          }
          /*svg{*/
          /*width: 25px;*/
          /*height: 25px;*/
          /*}*/
        }
      }
    }
    .el-menu-vertical-demo{
      height: 100%;
      overflow: auto;
      overflow-x: hidden;
    }
  }
  .hear_menu {
    text-align: right;
    width: 100%;
    height: 55px;
    background-color: rgb(76,152,240);
    .header-title{
      position: absolute;
      left: 20px;
      top: 0;
      line-height: 50px;
      height: 50px;
      color: white;
      vertical-align: middle;
      .header-logo{
        width: 39px;
        height: 46px;
        padding: 5px;
        display: inline-block;
        vertical-align: middle;
      }
      h3{
        margin: 0;
        font-size: 20px;
        display: inline-block;
        vertical-align: middle;
      }
    }
    .header-right{
        display: inline-block;
        font-size: 1.5rem;
        height: 50px;
        line-height: 50px;
        margin: 0 10px;
        i{
          color: white;
          font-size: 1.5rem;
        }
      .usertitle{
        color: white;
      }
    }
    .user {
      border: 0;
      margin: 5px 5px;
      border-radius: 5px;
      display: inline-block;
      background-color: $border_color3;
      padding: 10px 20px;
      span {
        vertical-align: middle;
      }
      img {
        $white: 20px;
        border-radius: 100%;
        vertical-align: middle;
        height: $white;
        width: $white;
      }
    }
  }
  .conent_menu {
    margin: 0px;
    width: 100%;
    overflow: auto;
  }
</style>
