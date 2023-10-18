<script setup lang="ts">
import AddMusicButton from "../Music/AddMusicButton.vue";
import MusicThumbnail from "../Music/MusicThumbnail.vue";
const { compilation } = defineProps(["compilation"]);
const emit = defineEmits(["refresh-compilation"]);
</script>

<template>
  <div class="playlistsContainer">
    <h2>{{ compilation.name }}</h2>
    <section class="playlists">
      <article v-for="songId in compilation.content" :key="songId">
        <MusicThumbnail :id="songId" :playlistName="compilation.name" @refresh-songs="emit('refresh-compilation')" />
      </article>
      <AddMusicButton :playlistName="compilation.name" @refresh-songs="emit('refresh-compilation')" />
    </section>
  </div>
</template>

<style scoped>
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
  border-top: 1px solid black;
}
</style>
