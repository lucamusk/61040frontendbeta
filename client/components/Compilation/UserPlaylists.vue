<script setup lang="ts">
import AddCompilation from "@/components/Compilation/AddCompilation.vue";
import CompilationThumbnail from "@/components/Compilation/CompilationThumbnail.vue";
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref } from "vue";

const { ownerId } = defineProps(["ownerId"]);

const loaded = ref(false);
let playlists = ref<Array<Record<string, string>>>([]);

async function getPlaylists(ownerId: string) {
  let compilationResults;
  try {
    compilationResults = await fetchy(`api/compilation/all/${ownerId}`, "GET");
  } catch (_) {
    return;
  }
  console.log(compilationResults);
  playlists.value = compilationResults.filter((compilation: { name: string }) => compilation.name !== "favorites");
}

onBeforeMount(async () => {
  await getPlaylists(ownerId);
  loaded.value = true;
});
</script>

<template>
  <section class="playlistsContainer" v-if="loaded">
    <h2>User Playlists:</h2>
    <section class="playlists">
      <article v-for="playlist in playlists" :key="playlist._id">
        <CompilationThumbnail :compilation="playlist" />
      </article>
      <AddCompilation @refresh-playlists="() => getPlaylists(ownerId)" />
    </section>
  </section>
</template>

<style scoped>
.playlistsContainer {
  margin-left: 8vw;
}

.playlists {
  display: flex;
  gap: 1vw;
}
</style>
