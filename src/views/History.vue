<template>
    <div>
      <section class="section">
        <div class="card">
          <header class="card-header">
            <p class="card-header-title is-size-4">
              Link History
            </p>
          </header>
          <div class="card-content">
            <b-table
              :data="linkHistory"
              hoverable>
              <template slot-scope="props">
                <b-table-column field="linkType" label="Action">
                  {{ props.row.linkType }}
                </b-table-column>

                <b-table-column field="skylink" label="Skylink">
                  <a :href="getSkylinkUrl(props.row.skylink)">{{ props.row.skylink }}</a>
                </b-table-column>

                <b-table-column field="createdAt" label="DataTime" centered>
                  <b-tooltip :label="props.row.createdAt">
                    {{ props.row.createdAt | moment("from", "now") }}
                  </b-tooltip>
                </b-table-column>

                <b-table-column>
                  <b-button
                    type="is-danger"
                    outlined
                    @click="deleteLinkHistoryItem(props.row.uuid)"
                  >Clear</b-button>
                </b-table-column>
              </template>

              <template slot="empty">
                <section class="section">
                  <div class="content has-text-grey has-text-centered">
                    <p>
                      <b-icon
                        icon="emoticon-sad"
                        size="is-large">
                      </b-icon>
                    </p>
                    <p>Nothing here. Try upload or download somthing <router-link :to="{name: 'Home'}">here</router-link></p>
                  </div>
                </section>
              </template>
            </b-table>
          </div>
        </div>
      </section>
    </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import { mixins } from 'vue-class-component';
import SkylinkUtil from '@/mixins/skylinkUtil';

@Component({ components: {} })
export default class History extends mixins(SkylinkUtil) {
  get linkHistory() {
    return this.$store.state.linkHistory;
  }

  created() {
    this.$store.dispatch('loadLinkHistory');
  }

  async deleteLinkHistoryItem(uuid: string) {
    await this.$store.dispatch('deleteLinkHistoryItem', uuid);
  }
}

</script>

<style scoped>

</style>
