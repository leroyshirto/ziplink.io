<template>
  <div>
    <b-navbar>
      <template slot="brand">
        <b-navbar-item tag="router-link" :to="{ name: 'Home' }">
          <strong>Ziplink.io</strong>
        </b-navbar-item>
      </template>
    </b-navbar>

    <transition name="fade">
      <router-view :key="$route.fullPath"></router-view>
    </transition>
    <footer class="page-footer">
      <div class="content has-text-centered">
        <p class="has-text-white">
          <strong class="ziplink">Ziplink.io</strong> powered by Skynet
        </p>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class App extends Vue {}
</script>

<style lang="scss">

html {
  background-color: #F2F2F2;
}

#app {
  min-height: 100vh;
  overflow: hidden;
  display: block;
  position: relative;
  padding-bottom: 60px; /* height of your footer */
}
.page-footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 60px;
  padding: 10px!important;
  background-color: #254C4F!important;
}

.ziplink {
  color: #23c0cf;
}

.card {
  background: #fff;
  border: none;
  box-shadow: 0 5px 42px 0 rgba(35, 70, 107, 0.08);
  border-radius: 0.8rem;
}

.mt-30 {
  margin-top: 30px;
}
</style>
