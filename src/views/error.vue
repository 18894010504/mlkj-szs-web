<template>
  <div>
    404
    <router-link tag="a" :to="{ name: 'index' }">
      返回首页
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'error',
  mounted () {
    this.$root.loading.close()
  }
}
</script>

<style scoped>

</style>
