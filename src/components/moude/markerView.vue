<template>
  <div class="markeView">
    <div class="marke">
      <h3>马子禄牛大马子禄牛大马子禄牛大马子禄牛大马子禄牛大</h3>
      <div class="img">
        <img src="http://e.hiphotos.baidu.com/image/pic/item/4b90f603738da9773ded4541bd51f8198718e39e.jpg" alt="">
      </div>
      <div class="conent">
        <i class="iconfont">&#xe719;</i> 视频1
      </div>
      <div class="conent">
        <i class="iconfont">&#xe719;</i> 视频1
      </div>
      <div class="conent">
        <i class="iconfont">&#xe719;</i> 视频1
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'markerView',
  props: ['markerData'],
  methods: {}
}
</script>

<style scoped lang="scss">
  .opacity {
    opacity: 1 !important;
  }
  .markeView {
    .marke {
      width: 220px;
      border: 1px solid $back_color_main;
      background-color: $back_color_white;
      opacity: 1;
      padding: 10px 10px 5px;
      font-size: $font_size16;
      h3 {
        padding-bottom: 10px;
      }
      .conent {
        padding: 5px;
        border-top: 1px solid $border_color1;
        i {
          font-size: $font_size18;
          float: right;
        }
      }
      .img {
        font-size: 0;
        width: 100%;
        img {
          width: 100%;
        }
      }
    }
  }
</style>
