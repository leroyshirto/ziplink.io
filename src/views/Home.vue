<template>
  <div>
    <section class="jumbotron text-center">
      <div class="container">
        <h1 class="jumbotron-heading">Free 'n' Easy file sharing</h1>
        <p class="lead text-muted">
          Upload a file 'n' share the link.
        </p>
      </div>
    </section>
    <section>
      <div class="container">
        <div v-show="loading" class="text-center">
          <b-spinner variant="primary" label="Spinning"></b-spinner>
        </div>
        <b-form-file
          v-show="!loading"
          v-model="fileToUpload"
          size="lg"
          placeholder="Choose a file or drop it here..."
          drop-placeholder="Drop file here..."
          @input="onUpload()"
        ></b-form-file>
      </div>
    </section>
    <section v-if="skylink !== ''">
      <div class="container mt-20">
      <b-card title="Here's your link" class="text-center">
        <b-card-text>
          <router-link :to="{name: 'Download', params: { skylink: skylink.skylink}}">
            {{getSkylinkUrl(skylink.skylink)}}
          </router-link>
        </b-card-text>

        <a href="#" class="card-link">Copy link</a>
        <a href="#" class="card-link">Share link</a>
      </b-card>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import getClient from '@/services/skynet';

@Component({ components: { } })
export default class Home extends Vue {
  private loading = false;

  private fileToUpload: File | null = null;

  private skylink = '';

  async onUpload() {
    if (this.fileToUpload === null || this.fileToUpload === undefined) {
      return;
    }

    this.loading = true;
    const client = getClient();
    const response = await client.uploadFile(this.fileToUpload);
    console.debug(response);

    this.skylink = response;
    this.loading = false;
  }

  getSkylinkUrl(skylink: string): string {
    console.log(this.$router.currentRoute);
    return `${window.location.protocol}//${window.location.hostname}#/download/${skylink}`;
  }
}
</script>

<style scoped lang="scss">
  .mt-20 {
    margin-top: 20px;
  }
</style>
