<script lang="ts" setup>
import { onBeforeMount, ref } from "vue";
import { useRoute } from "vue-router";
import CompilationMenu from "../components/Compilation/CompilationMenu.vue";
import { fetchy } from "../utils/fetchy";
let currentPlaylistId = ref(useRoute().params.id);
let favorite = ref(useRoute().query.favorite);
let groupId = ref(useRoute().query.groupId);
let currentPlaylist = ref({});
let loaded = ref(false);
// watch(
//   () => useRoute().params.id,
//   async (prev, current) => {
//     console.log("refresh");
//     currentPlaylistId.value = current;
//     await loadNewPlaylist(current);
//   },
// );

const loadNewPlaylist = async (id: string | string[]) => {
  let playlistResults;
  try {
    playlistResults = await fetchy(`/api/compilation/${id}`, "GET");
  } catch (_) {
    return;
  }
  currentPlaylist.value = playlistResults;
};

onBeforeMount(async () => {
  loaded.value = false;
  await loadNewPlaylist(currentPlaylistId.value);
  loaded.value = true;
});
</script>

<template>
  <div v-if="loaded">
    <CompilationMenu :compilation="currentPlaylist" @refresh-compilation="loadNewPlaylist(currentPlaylistId)" :favorites="favorite" :groupId="groupId" />
  </div>
</template>
