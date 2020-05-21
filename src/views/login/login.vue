<template>
  <div>
    <img class="img" src="../../images/login_back.jpg" alt="">
    <div class="login">
      <div class="formView">
        <div class="form">
          <h3>食溯源云平台</h3>
          <div class="inputView">
            <el-input
              class="input"
              placeholder="请输入账号"
              v-model="username"
              clearable>
              <i slot="prefix" class="el-input__icon iconfont">&#xe70b;</i>
            </el-input>
          </div>
          <div class="inputView">
            <el-input
              class="input"
              placeholder="请输入密码"
              v-model="password"
              type="password"
              clearable>
              <i slot="prefix" class="el-input__icon iconfont">&#xe82b;</i>
            </el-input>
          </div>
          <el-button
            class="btn"
            type="primary"
            @click="login"
          >登录</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Storage from '../../utils/Storage'

export default {
  name: 'login',
  data () {
    return {
      username: '',
      password: ''
    }
  },
  mounted () {
    // console.log(this.$root.loading)
    this.$root.loading.close()
  },
  methods: {
    login () {
      let _this = this
      _this.sendAxios({
        // url: 'http://shizhuisutest.szschina.cn/login/checkLogin',
        url: 'http://shizhuisu.szschina.cn/login/checkLogin',
        data: {
          password: _this.password,
          username: _this.username
        },
        method: 'post',
        token: _this
      })
        .then(res => {
          _this.$message({
            message: '登录成功',
            type: 'success',
            showClose: _this
          })
          Storage.set('mlkjToken', res)
          _this.$store.dispatch('acquireToken', res)
            .then(() => {
              _this.$router.push({ name: 'index' })
            })
        })
        .catch(res => {
          console.log('登录出错!')
          console.log(res)
        })
    }
  }
}
</script>

<style scoped lang="scss">
  .login {
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto;
    width: 100%;
    height: 300px;
    z-index: 200;
    background-color: rgba(255,255,255,0.5);
    padding: 20px 0;
    .formView {
      position: absolute;
      top: 20px;
      bottom: 20px;
      right: 0;
      left: 0;
      margin: auto;
      width: 1000px;
    }
    .form {
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      padding: 40px 20px;
      background-color: $back_color_white;
      display: inline-block;
      width: 300px;
      h3 {
        text-align: left;
        @extend .inputView;
      }
      .inputView {
        padding-bottom: 20px;
      }
      .input {
      }
      .btn {
        width: 100%;
      }
    }
  }
  .img {
    z-index: 100;
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
  }
</style>
