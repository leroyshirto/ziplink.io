<template>
  <div>
    <header>
      <div class="navbar navbar-dark bg-dark box-shadow">
        <div class="container d-flex justify-content-between">
          <a href="#" class="navbar-brand d-flex align-items-center">
            <strong>Ziplink.io</strong>
          </a>
          <button
            class="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarHeader"
            aria-controls="navbarHeader"
            aria-expanded="false"
            aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
        </div>
      </div>
    </header>

    <main role="main">
      <transition name="fade">
        <router-view></router-view>
      </transition>
    </main>

    <footer class="footer">
      <div class="container text-center">
        <span class="text-white">Ziplink.io powered by Skynet</span>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class App extends Vue {}
</script>

<style scoped lang="scss">
.footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 60px;
  line-height: 60px;
  background-color: #333940;
}
</style>
