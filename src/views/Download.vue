<template>
  <section>
    <div class="container">
      <div v-show="loading" class="text-center">
        <b-spinner variant="primary" label="Spinning"></b-spinner>
      </div>
      <div v-if="downloadedFile !== null || downloadedFile !== undefined">
        <p v-if="downloadedFile !== null">This file is: {{downloadedFile.meta.filename}}</p>
        <b-btn @click="forceFileDownload(downloadedFile)">Download</b-btn>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import getClient, { SkynetFile } from '@/services/skynet';

@Component({ components: {} })
export default class Home extends Vue {
  private loading = true;

  private downloadedFile: SkynetFile | null = null;

  async created() {
    const { skylink } = this.$route.params;
    if (skylink === null || skylink === undefined) {
      // TODO: handle the unhappy case if we have no link
      this.$swal('Cloud not find skylink');
    }

    this.downloadedFile = await this.fetchLink(skylink);
  }

  async fetchLink(skylink: string) {
    const client = getClient();
    const response = await client.downloadFile(skylink);

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
</style>
