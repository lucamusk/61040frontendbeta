<script setup lang="ts">
import MusicThumbnail from "../Music/MusicThumbnail.vue";
const { compilation, refreshPlaylists } = defineProps(["compilation", "refreshPlaylists"]);
const emit = defineEmits(["refresh-compilation", "playlistsRefreshed"]);
</script>

<template>
  <div class="playlistsContainer">
    <section class="playlists">
      <article v-for="songId in compilation.content.toReversed()" :key="songId">
        <MusicThumbnail
          :id="songId"
          :playlistName="compilation.name"
          @refresh-songs="emit('refresh-compilation')"
          :favorites="true"
          :refreshPlaylists="refreshPlaylists"
          @playlists-refreshed="emit('playlistsRefreshed')"
        />
      </article>
    </section>
  </div>
</template>

<style scoped>
article {
  width: 775px;
}
.playlistsContainer {
  margin-left: 8vw;
  margin-right: 8vw;
}

.playlists {
  display: flex;
  flex-direction: column;
  gap: 1vw;
}

section {
  border-top: 1px solid --text;
}
</style>
