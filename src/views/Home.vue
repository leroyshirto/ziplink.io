<template>
  <div>
    <section>
      <div class="container mt-30">
        <b-card>
          <h1 class="jumbotron-heading text-center">Free 'n' Easy file sharing</h1>
          <p class="lead text-muted text-center">Upload a file 'n' share the link.</p>
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
        </b-card>
      </div>
    </section>
    <section v-if="skylink !== ''">
      <div class="container mt-20">
        <b-card title="Here's your link" class="text-center">
          <b-card-text>
            <router-link :to="{name: 'Download', params: { skylink: skylink}}">{{getSkylinkUrl}}</router-link>
          </b-card-text>

          <button
            class="btn btn-link card-link"
            v-clipboard:copy="getSkylinkUrl"
            v-clipboard:success="onCopy"
            v-clipboard:error="onError"
          >Copy link</button>
          <a
            class="btn btn-link card-link"
            :href="`mailto:?&subject=ziplink.io%20file%20sharing.&body=Hi%20I%20wanted%20to%20share%20this%20file%20with%20you%20${encodeURI(getSkylinkUrl)}`"
          >Share link</a>
        </b-card>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import getClient from '@/services/skynet';

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
    if (this.fileToUpload === null || this.fileToUpload === undefined) {
      return;
    }

    this.loading = true;
    const client = getClient();
    const response = await client.uploadFile(this.fileToUpload);

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
.mt-20 {
  margin-top: 20px;
}

.mt-30 {
  margin-top: 30px;
}

.card {
  background: #fff;
  border: none;
  box-shadow: 0px 5px 42px 0px rgba(35, 70, 107, 0.08);
  border-radius: 0.8rem;
}

.card:hover {
  box-shadow: 0px 25px 42px 0px rgba(35, 70, 107, 0.24);
}
</style>
