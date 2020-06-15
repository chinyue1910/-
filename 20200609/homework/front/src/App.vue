<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link>|
      <router-link to="/about">About</router-link>
    </div>
    <router-view />
  </div>
</template>

<script>
export default {
  mounted () {
    this.axios.get('http://localhost:8888/checksession').then(res => {
      console.log(res.data)
    })
  }
}
</script>
