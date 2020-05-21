<template>
  <div style="height: 100%">
    <el-container>
      <el-container>
        <div class="left_menu">
          <el-menu
            default-active="1-4-1"
            class="el-menu-vertical-demo"
            :collapse-transition="true"
            :collapse="isCollapse">
            <el-menu-item index="1" @click.native="isCollapse=!isCollapse">
              <i class="el-icon-menu"></i>
              <span slot="title"><i v-show="!isCollapse">收起导航栏</i><i v-show="isCollapse">展开导航栏</i></span>
            </el-menu-item>
            <el-menu-item index="2" @click.native="clickSubenu({ name: 'index' })">
              <i class="el-icon-document"></i>
              <span slot="title">首页</span>
            </el-menu-item>
            <el-menu-item index="3" @click.native="clickSubenu({ name: 'site' })">
              <i class="el-icon-document"></i>
              <span slot="title">坐标点选址</span>
            </el-menu-item>
            <el-menu-item index="4" @click.native="clickSubenu({ name: 'district' })">
              <i class="el-icon-document"></i>
              <span slot="title">行政区测画</span>
            </el-menu-item>
          </el-menu>
        </div>
        <div class="conent_menu">
          <div></div>
          <router-view/>
        </div>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'index',
  data () {
    return {
      isCollapse: false
    }
  },
  methods: {
    clickSubenu (obj) {
      this.$router.push(obj)
    }
  }
}
</script>

<style scoped lang="scss">
.conent_menu {
  width: 100%;
}
</style>
