<template>
  <div>
    <section class="hero has-background-white">
      <div class="hero-body">
        <div class="container">
          <h1 class="title has-text-centered">
            Free 'n' Easy file sharing
          </h1>
          <h2 class="subtitle has-text-centered">
            Upload a file 'n' share the link.
          </h2>
        </div>
      </div>
    </section>

    <b-loading :active.sync="loading"></b-loading>
    <section v-if="skylink === ''" class="section has-text-centered">
      <div class="card" v-show="!loading">
        <div class="card-content">
          <b-field>
            <b-upload
              v-model="fileToUpload"
              drag-drop
              @input="onUpload()">
              <section class="section">
                <div class="content has-text-centered">
                  <p>
                    <b-icon
                      icon="upload"
                      size="is-large">
                    </b-icon>
                  </p>
                  <p>Drop your files here or click to upload</p>
                </div>
              </section>
            </b-upload>
          </b-field>
        </div>
      </div>
    </section>

    <section v-if="skylink !== ''" class="section mt-20">
      <div class="card">
        <div class="card-content">
          <p class="title has-text-centered">
            Here's your link
          </p>
          <p class="subtitle has-text-centered">
            <router-link :to="{name: 'Download', params: { skylink: skylink}}">
              {{getSkylinkUrl}}
            </router-link>
          </p>
        </div>
        <footer class="card-footer mt-30">
          <a class="card-footer-item"
            v-clipboard:copy="getSkylinkUrl"
            v-clipboard:success="onCopy"
            v-clipboard:error="onError"
          >Copy link</a>
          <a class="card-footer-item"
            :href="`mailto:?&subject=ziplink.io%20file%20sharing.&body=Hi%20I%20wanted%20to%20share%20this%20file%20with%20you%20${encodeURI(getSkylinkUrl)}`"
          >Share link</a>
        </footer>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import skynet from '@/services/skynet';

  @Component({ components: {} })
export default class Home extends Vue {
    private loading = false;

    private fileToUpload: File | null = null;

    private skylink = '';

    get getSkylinkUrl(): string {
      const { port } = window.location;
      if (['80', '443', ''].includes(port)) {
        return `${window.location.protocol}//${window.location.hostname}#/download/${this.skylink}`;
      }
      return `${window.location.protocol}//${window.location.hostname}:${port}#/download/${this.skylink}`;
    }

    async onUpload() {
      if (this.fileToUpload === null) {
        return;
      }

      this.loading = true;
      const response = await skynet.uploadFile(this.fileToUpload);

      this.skylink = response.skylink;
      this.loading = false;
    }

    onCopy() {
      this.$swal({
        position: 'top-end',
        icon: 'success',
        title: 'Copied to clipboard',
        showConfirmButton: false,
        timer: 1500,
      });
    }

    onError() {
      this.$swal('Error Copying data');
    }
}
</script>

<style scoped lang="scss">

</style>
