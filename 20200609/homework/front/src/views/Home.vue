<template>
  <div class="home">
    <input type="text" v-model="account" />
    <input type="password" v-model="password" />
    <input type="button" value="登入" @click="login" />
  </div>
</template>

<script>
export default {
  data () {
    return {
      account: '',
      password: ''
    }
  },
  methods: {
    login () {
      this.axios.post('http://localhost:8888/login', { account: this.account, password: this.password })
        .then(result => {
          if (result.data.success) {
            alert('登入成功')
            this.$store.commit('login', result.data.account)
            this.$router.push('/about')
          } else {
            alert(result.data.message)
          }
        })
    }
  }
}
</script>
