<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style scoped lang="scss">

</style>
<style lang="scss">
  /*element全局样式*/
  .el-tabs--border-card>.el-tabs__content {
    padding: 0 !important;
  }/*
  .el-aside {
    background-color: $back_color_white;
    color: #333;
    text-align: center;
    line-height: 200px;
  }

  .el-header {*/
    /*padding: 0px 0px;*/
  /*}

  .el-main {
    background-color: $back_color_white;
    color: #333;
    text-align: center;
    line-height: 160px;
    padding: 5px;
  }
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 100%;
    min-height: 100px;
  }*/
  /*全局样式*/
  .conent {
    > p {
      text-align: center;
    }
  }
  .ViewFood {
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
  .el-vue-amap {
    cursor: default !important;
  }
  html {
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    background-color: $border_color4;
  }
  body ,html {
    font-weight: 400;
    font-size: $font_size14;
    color: #000;
    margin: 0;
    padding: 0;
    bottom: 0;
  }
  p, h1, h2, h3, h4, h5, h6 {
    margin: 0;
    padding: 0;
  }
  a {
    text-decoration: none;
  }
  i {
    font-style: normal;
  }
  .ViewFood {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
  }
  .listnav{
    margin: 0 !important;
    /*height: calc(100% - 100px);*/
    position: absolute;
    /*top: 54px !important;*/
    left: 92px !important;
    transform-origin: left center 0px;
    z-index: 2007;
    padding: 0;
  }
  .listnav ul{
    width: 100%;
    border: 0;
  }
</style>
