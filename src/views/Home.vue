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
      <div class="columns is-centered">
        <div class="column is-one-third">
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
              {{ getSkylinkUrl(skylink) }}
            </router-link>
          </p>
        </div>
        <footer class="card-footer mt-30">
          <a class="card-footer-item"
            v-clipboard:copy="getSkylinkUrl(skylink)"
            v-clipboard:success="onCopy"
            v-clipboard:error="onError"
          >Copy link</a>
          <a class="card-footer-item"
             v-if="hasWebShare"
             @click="doWebShare()"
          >Share link</a>
          <a class="card-footer-item"
             v-else
            :href="`mailto:?&subject=ziplink.io%20file%20sharing.&body=Hi%20I%20wanted%20to%20share%20this%20file%20with%20you%20${encodeURI(getSkylinkUrl)}`"
          >Share link</a>
        </footer>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import { mixins } from 'vue-class-component';
import SkylinkUtil from '@/mixins/skylinkUtil';
import skynet from '@/services/skynet';
import LinkHistoryItem from '@/services/linkHistory/linkHistoryItem';

@Component({ components: {} })
export default class Home extends mixins(SkylinkUtil) {
    private loading = false;

    private fileToUpload: File | null = null;

    private skylink = '';

    get hasWebShare() {
      return navigator.canShare;
    }

    async onUpload() {
      if (this.fileToUpload === null) {
        return;
      }

      this.loading = true;
      const response = await skynet.uploadFile(this.fileToUpload);

      this.skylink = response.skylink;
      await this.$store.dispatch(
        'addItemToHistory',
        LinkHistoryItem.createForUpload(this.skylink),
      );

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

    doWebShare() {
      if (navigator.share) {
        navigator.share({
          title: 'ziplink.io',
          text: 'Check out this file',
          url: this.getSkylinkUrl(this.skylink),
        })
          .then(() => console.log('Successful share'))
          .catch((error: Error) => console.log('Error sharing', error));
      }
    }
}
</script>

<style scoped lang="scss">
.upload-card {
  max-width: 400px;
}
</style>
