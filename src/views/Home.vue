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

    <section v-if="loading" class="section">
      <div class="columns is-centered">
        <div class="column is-three-fifths">
          <div class="card">
            <div class="card-content has-text-centered">
              <h5>Uploading through <a :href="selectedPortal">{{ selectedPortal }}</a></h5>
              <b-progress
                :value="transferProgress.loaded"
                :max="transferProgress.total"
                size="is-large"
                type="is-primary"
                show-value>
                {{humanFileSize(transferProgress.loaded)}}
              </b-progress>
              <p>Size: {{humanFileSize(transferProgress.total)}} - Uploading at: {{humanFileSize(transferProgress.speed)}}/sec</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section v-if="skynetUpload === null" class="section has-text-centered">
      <div class="columns is-centered">
        <div class="column is-one-third">
          <div class="card" v-show="!loading">
            <div class="card-content">
              <b-field>
                <b-upload
                  v-model="fileToUpload"
                  drag-drop
                  @input="doUpload()">
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
              <b-field>
                <b-switch v-model="showAdvanced">
                  Advanced
                </b-switch>
              </b-field>
              <div v-if="showAdvanced">
                <b-field label="Portal">
                  <b-select placeholder="Select a portal" icon="earth"
                            expanded v-model="selectedPortal">
                    <option v-for="(item, index) in availablePortals" :key="index"
                            :value="item.host">{{ item.host }}</option>
                  </b-select>
                </b-field>
                <b-field label="Share Target">
                  <b-button @click="testWebshareTarget()">Test Share Target</b-button>
                </b-field>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section v-if="skynetUpload !== null" class="section mt-20">
      <div class="card">
        <div class="card-content">
          <p class="title has-text-centered">
            Here's your link
          </p>
          <p class="subtitle has-text-centered">
            <router-link :to="{name: 'Download', params: { skylink: skynetUpload.skylink}}">
              {{ getSkylinkUrl(skynetUpload.skylink) }}
            </router-link>
          </p>
          <p class="has-text-centered">Uploaded through portal {{skynetUpload.portalUrl}}</p>
        </div>
        <footer class="card-footer mt-30">
          <a class="card-footer-item"
            v-clipboard:copy="getSkylinkUrl(skynetUpload.skylink)"
            v-clipboard:success="onCopy"
            v-clipboard:error="onError"
          >Copy link</a>
          <a class="card-footer-item"
             v-if="hasWebShare"
             @click="doWebShare()"
          >Share link</a>
          <a class="card-footer-item"
             v-else
            :href="`mailto:?&subject=ziplink.io%20file%20sharing.&body=Hi%20I%20wanted%20to%20share%20this%20file%20with%20you%20${encodeURI(getSkylinkUrl(skynetUpload.skylink))}`"
          >Share link</a>
        </footer>
      </div>
    </section>

    <section v-if="skynetUpload !== null" class="hero has-background-white">
      <div class="hero-body">
        <div class="container">
          <h1 class="title has-text-centered">
            Do another Upload?
          </h1>
          <h2 class="subtitle has-text-centered">
            <b-button @click="resetUpload()">Upload</b-button>
          </h2>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import { mixins } from 'vue-class-component';
import SkylinkUtil from '@/mixins/skylinkUtil';
import skynet, { SkynetClient, SkynetUpload } from '@/services/skynet';
import LinkHistoryItem from '@/services/linkHistory/linkHistoryItem';

@Component
export default class Home extends mixins(SkylinkUtil) {
    private loading = false;

    private fileToUpload: File | null = null;

    private skynetUpload: SkynetUpload | null = null;

    private selectedPortal: string | null = null;

    private showAdvanced = false;

    get availablePortals() {
      return skynet.availablePortals;
    }

    get hasWebShare() {
      return navigator.canShare;
    }

    async doUpload() {
      if (this.fileToUpload === null) {
        return;
      }

      if (this.selectedPortal === null) {
        this.selectedPortal = skynet.defaultPortalUrl;
      }

      try {
        this.loading = true;
        this.skynetUpload = await skynet.uploadFile(this.fileToUpload, this.selectedPortal);

        await this.$store.dispatch(
          'addItemToHistory',
          LinkHistoryItem.createForUpload(this.skynetUpload),
        );

        this.loading = false;
      } catch (e) {
        this.loading = false;
        this.$buefy.notification.open(
          {
            duration: 5000,
            message: `Error uploading files uring ${SkynetClient.UPLOAD_RETRY_COUNT} different portals. The general error was: ${e}. Please try the upload again.`,
            type: 'is-danger',
            indefinite: true,
            hasIcon: true,
          },
        );
      }
    }

    onCopy() {
      this.$buefy.notification.open(
        {
          message: 'Copied to clipboard',
          type: 'is-info',
        },
      );
    }

    onError() {
      this.$buefy.notification.open(
        {
          message: 'Error Copying data',
          type: 'is-danger',
        },
      );
    }

    doWebShare() {
      if (this.skynetUpload === null || this.skynetUpload.skylink === '') {
        throw new Error('Skylink must be set to do web share');
      }
      if (navigator.share) {
        navigator.share({
          title: 'ziplink.io',
          text: 'Check out this file',
          url: this.getSkylinkUrl(this.skynetUpload?.skylink),
        })
          .then(() => this.$buefy.notification.open({
            message: 'Link shared',
            type: 'is-info',
          }))
          .catch((error: Error) => this.$buefy.notification.open({
            message: `Error sharing: ${error}`,
            type: 'is-danger',
            hasIcon: true,
          }));
      }
    }

    resetUpload() {
      this.skynetUpload = null;
      this.transferProgress = {
        timeStamp: 0,
        loaded: 0,
        total: 0,
        prevLoaded: 0,
        speed: 0,
      };
    }

    async testWebshareTarget() {
      const testFile = new File(['foo'], 'foo.txt', {
        type: 'text/plain',
      });
      const data = new FormData();
      data.append('file', testFile);
      await fetch(
        '/?upload',
        {
          method: 'POST',
          body: data,
        },
      );
    }

    created() {
      window.addEventListener(SkynetClient.SKYNET_UPLOAD_PROGRESS_EVENT, (e: Event) => {
        const uploadStatsEvent = e as CustomEvent;
        this.transferProgress.loaded = uploadStatsEvent.detail.loaded;
        this.transferProgress.total = uploadStatsEvent.detail.total;
        this.calculateSpeed();
      });

      navigator.serviceWorker.onmessage = (event) => {
        if (event.data.action === 'load-file') {
          this.$buefy.snackbar.open('Received Share target');
          this.fileToUpload = event.data.file;
          this.doUpload();
        }
      };
    }
}
</script>

<style scoped lang="scss">
.upload-card {
  max-width: 400px;
}
</style>
