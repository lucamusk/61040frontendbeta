<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";
const emit = defineEmits(["refreshSongs"]);

const { added, playlistName, songId } = defineProps(["added", "playlistName", "songId"]);
const localAdded = ref(added);
let iconHovered = ref(false);
const addSong = async (songId: string, playlistName: string) => {
  try {
    await fetchy(`/api/compilation/personal/add`, `PUT`, { body: { content: songId, name: playlistName } });
  } catch (e) {
    return;
  }
  emit("refreshSongs");
  localAdded.value = true;
};

async function deleteSong(songId: string, playlistName: string) {
  try {
    await fetchy(`/api/compilation/personal/remove`, "PUT", { body: { content: songId, name: playlistName } });
  } catch (_) {
    return;
  }
  emit("refreshSongs");
  localAdded.value = false;
}
</script>

<template>
  <article v-if="!localAdded" @click="addSong(songId, playlistName)" @mouseover="iconHovered = true" @mouseleave="iconHovered = false">
    <svg v-if="!iconHovered" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16">
      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
      <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
    </svg>
    <svg v-else xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="var(--magenta)" class="bi bi-plus-circle-fill" viewBox="0 0 16 16">
      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
    </svg>
  </article>
  <article v-else @click="deleteSong(songId, playlistName)" @mouseover="iconHovered = true" @mouseleave="iconHovered = false">
    <svg v-if="!iconHovered" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-dash-circle" viewBox="0 0 16 16">
      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
      <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z" />
    </svg>
    <svg v-else xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="var(--accent)" class="bi bi-dash-circle-fill" viewBox="0 0 16 16">
      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1h-7z" />
    </svg>
  </article>
</template>
