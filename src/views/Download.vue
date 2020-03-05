<template>
  <section class="section">
    <div class="columns is-centered">
      <div class="column is-three-fifths">
        <div class="card">
      <div class="card-content has-text-centered">
      <div v-show="loading">
        <h5>Loading file...</h5>
        <b-progress
          :value="downloadProgress.loaded"
          :max="downloadProgress.total"
          size="is-large"
          type="is-primary"
          show-value>
        </b-progress>
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
import { Component, Vue } from 'vue-property-decorator';
import skynet, { SkynetFile, SkynetClient } from '@/services/skynet';
import LinkHistoryItem from '@/services/linkHistory/linkHistoryItem';

@Component({ components: {} })
export default class Home extends Vue {
  private loading = true;

  private downloadProgress = {
    loaded: 0,
    total: 0,
  };

  private downloadedFile: SkynetFile | null = null;

  async created() {
    const { skylink } = this.$route.params;
    if (skylink === '') {
      // TODO: handle the unhappy case if we have no link
      this.$swal('Cloud not find skylink');
    }

    window.addEventListener(SkynetClient.SKYNET_DOWNLOAD_PROGRESS_EVENT, (e: Event) => {
      const downloadStatsEvent = e as CustomEvent;
      this.downloadProgress.loaded = downloadStatsEvent.detail.loaded;
      this.downloadProgress.total = downloadStatsEvent.detail.total;
    });
    this.downloadedFile = await this.downloadFile(skylink);
  }

  async downloadFile(skylink: string) {
    const response = await skynet.downloadFile(skylink);

    await this.$store.dispatch(
      'addItemToHistory',
      LinkHistoryItem.createForDownload(skylink),
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
