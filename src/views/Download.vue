<template>
  <section class="container text-center  mt-30">
    <b-card>
      <div v-show="loading">
        <h5>Loading file...</h5>
        <b-progress
          :value="downloadProgress.loaded"
          :max="downloadProgress.total"
          show-progress animated>
        </b-progress>
      </div>
      <div class="mt-30" v-if="downloadedFile !== null || downloadedFile !== undefined">
        <p v-if="downloadedFile !== null">This file is: {{downloadedFile.meta.filename}}</p>
        <b-btn @click="forceFileDownload(downloadedFile)">Download</b-btn>
      </div>
    </b-card>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import skynet, { SkynetFile, SkynetClient } from '@/services/skynet';

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
.mt-20 {
  margin-top: 20px;
}

.mt-30 {
  margin-top: 30px;
}

.card {
  background: #fff;
  border: none;
  box-shadow: 0 5px 42px 0 rgba(35, 70, 107, 0.08);
  border-radius: 0.8rem;
}

.card:hover {
  box-shadow: 0 25px 42px 0 rgba(35, 70, 107, 0.24);
}
</style>
