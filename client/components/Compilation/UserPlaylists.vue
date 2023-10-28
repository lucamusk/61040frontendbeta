<script setup lang="ts">
import AddCompilation from "@/components/Compilation/AddCompilation.vue";
import CompilationThumbnail from "@/components/Compilation/CompilationThumbnail.vue";
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref } from "vue";
import { LocationQueryValueRaw, RouterLink } from "vue-router";
import HomeFavorites from "./HomeFavorites.vue";

const { ownerId } = defineProps(["ownerId"]);

const loaded = ref(false);
let playlists = ref<Array<Record<string, string>>>([]);
let favoritesComp = ref<Record<string, string>>({});
let refreshPlaylists = ref(false);

async function getPlaylists(ownerId: string) {
  let compilationResults;
  try {
    compilationResults = await fetchy(`api/compilation/all/${ownerId}`, "GET");
  } catch (_) {
    return;
  }
  playlists.value = compilationResults.filter((compilation: { name: string }) => compilation.name !== "favorites");
  favoritesComp.value = compilationResults.filter((compilation: { name: string }) => compilation.name === "favorites")[0];
}

onBeforeMount(async () => {
  await getPlaylists(ownerId);
  loaded.value = true;
});
</script>

<template>
  <section class="playlistsContainer" v-if="loaded">
    <h2>Your Playlists:</h2>
    <section class="playlists">
      <article v-for="playlist in playlists" :key="playlist._id">
        <CompilationThumbnail :compilation="playlist" />
      </article>
      <AddCompilation
        @refresh-playlists="
          () => {
            getPlaylists(ownerId);
            refreshPlaylists = true;
          }
        "
      />
    </section>
    <RouterLink :to="{ name: 'Playlist', params: { id: favoritesComp._id }, query: { favorite: true as unknown as LocationQueryValueRaw } }"><h2>Recent Favorites:</h2></RouterLink>
    <HomeFavorites :compilation="favoritesComp" :refreshPlaylists="refreshPlaylists" @playlists-refreshed="refreshPlaylists = false" />
  </section>
</template>

<style scoped>
h2 {
  font-family: "Bebas Neue", sans-serif;
  width: 90%;
  border-bottom: solid 1px black;
}
.playlistsContainer {
  margin-left: 8vw;
}

.playlists {
  display: flex;
  align-items: center;
  gap: 1vw;
}
</style>
