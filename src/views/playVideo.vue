<template>
<div>
  <play :vid="url"
        height="100vh"
        :isLive="true"
        :playauth="liveData.playAuth"
        :source="url"
        ref="aliPlayer"
        :cover="liveData.cover"></play>
</div>
</template>

<script>
import play from '../components/VueAliplayer'

export default {
  name: 'playVideo',
  components: {
    play
  },
  data () {
    return {
      url: '',
      liveData: {
        playAuth: 'sstyYuew678999ew90000000xtt7TYUh',
        cover: '',
      },
    }
  },
  mounted () {
    this.$root.loading.close()
  },
  created () {
    this.url = this.$route.params.url
    document.title = this.$route.params.title
    console.log(this.url)
  }
}
</script>

<style scoped>

</style>
