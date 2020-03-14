<template>
  <section class="section">
    <div class="columns is-centered">
      <div class="column is-three-fifths">
        <div class="card">
      <div class="card-content has-text-centered">
      <div v-show="loading">
        <h5>Downloading from <a :href="defaultPortalUrl">{{ defaultPortalUrl }}</a></h5>
        <b-progress
          :value="transferProgress.loaded"
          :max="transferProgress.total"
          size="is-large"
          type="is-primary"
          show-value>
          {{humanFileSize(transferProgress.loaded)}}
        </b-progress>
        <p>Size: {{humanFileSize(transferProgress.total)}} - Downloading at: {{humanFileSize(transferProgress.speed)}}/sec</p>
      </div>
      <div class="mt-30" v-if="downloadedFile !== null || downloadedFile !== undefined">
        <p v-if="downloadedFile !== null">This file is: {{downloadedFile.meta.filename}}</p>
        <b-button
          type="is-primary"
          outlined
          @click="forceFileDownload(downloadedFile)">Download</b-button>
      </div>
      </div>
    </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import { mixins } from 'vue-class-component';
import SkylinkUtil from '@/mixins/skylinkUtil';
import skynet, { SkynetFile, SkynetClient } from '@/services/skynet';
import LinkHistoryItem from '@/services/linkHistory/linkHistoryItem';

@Component
export default class Home extends mixins(SkylinkUtil) {
  private loading = true;

  private downloadedFile: SkynetFile | null = null;

  get defaultPortalUrl() {
    return skynet.defaultPortalUrl;
  }

  async created() {
    const { skylink } = this.$route.params;
    if (skylink === '') {
      // TODO: handle the unhappy case if we have no link
      this.$buefy.notification.open({
        message: 'Skylink must be provided in the uri',
        type: 'is-danger',
        hasIcon: true,
        indefinite: true,
      });
    }

    window.addEventListener(SkynetClient.SKYNET_DOWNLOAD_PROGRESS_EVENT, (e: Event) => {
      const downloadStatsEvent = e as CustomEvent;
      this.transferProgress.loaded = downloadStatsEvent.detail.loaded;
      this.transferProgress.total = downloadStatsEvent.detail.total;
      this.calculateSpeed();
    });
    this.downloadedFile = await this.downloadFile(skylink);
  }

  async downloadFile(skylink: string) {
    const response = await skynet.downloadFile(skylink, this.defaultPortalUrl);

    await this.$store.dispatch(
      'addItemToHistory',
      LinkHistoryItem.createForDownload(skylink, skynet.defaultPortalUrl),
    );

    this.loading = false;

    return response;
  }

  forceFileDownload(downloadedFile: SkynetFile) {
    const url = window.URL.createObjectURL(new Blob([downloadedFile.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', downloadedFile.meta.filename);
    document.body.appendChild(link);
    link.click();
  }
}
</script>

<style scoped lang="scss">

</style>
