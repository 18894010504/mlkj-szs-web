<template>
  <el-tabs :tab-position="tabPosition" >
    <el-tab-pane label="视频认证" stretch="true">
      <video-auth></video-auth>
    </el-tab-pane>
    <el-tab-pane label="视频日志" stretch="true">
      <videolog></videolog>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
  import videolog from '@/components/video/VideoLog'
  import videoAuth from '@/components/video/VideoAuth'

  export default {
  name: 'VideoManage',
  components: {
    videolog,
    videoAuth
  },
  data () {
    return {
      tabPosition: 'top'
    }
  }
}
</script>

<style scoped lang="scss">
  .tabs{
    width: 20%;
  }
</style>
