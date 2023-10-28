<script setup>
import { ref, onBeforeMount } from "vue";
import { fetchy } from "@/utils/fetchy";
import { RouterLink } from "vue-router";
let hovered = ref(false);
let loaded = ref(false);
let playlists = ref([]);
const { ownerId, group } = defineProps(["ownerId", "group"]);

async function getPlaylists(ownerId) {
  let compilationResults;
  try {
    compilationResults = await fetchy(`/api/compilation/all/${ownerId}`, "GET");
  } catch (e) {
    console.log(e);
    return;
  }
  console.log("results:", compilationResults);
  playlists.value = compilationResults.filter((compilation) => compilation.name !== "timeline");
}

onBeforeMount(async () => {
  await getPlaylists(ownerId);
  loaded.value = true;
});
</script>

<template>
  <aside @mouseover="hovered = true" @mouseleave="hovered = false" class="container" :class="{ shadow: hovered }">
    <section>
      <svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" fill="currentColor" class="bi bi-collection-play" viewBox="0 0 16 16">
        <path
          d="M2 3a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 0-1h-11A.5.5 0 0 0 2 3zm2-2a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 0-1h-7A.5.5 0 0 0 4 1zm2.765 5.576A.5.5 0 0 0 6 7v5a.5.5 0 0 0 .765.424l4-2.5a.5.5 0 0 0 0-.848l-4-2.5z"
        />
        <path
          d="M1.5 14.5A1.5 1.5 0 0 1 0 13V6a1.5 1.5 0 0 1 1.5-1.5h13A1.5 1.5 0 0 1 16 6v7a1.5 1.5 0 0 1-1.5 1.5h-13zm13-1a.5.5 0 0 0 .5-.5V6a.5.5 0 0 0-.5-.5h-13A.5.5 0 0 0 1 6v7a.5.5 0 0 0 .5.5h13z"
        />
      </svg>
      <h5>Group Playlists</h5>
    </section>
    <article v-if="hovered" class="menu">
      <article v-for="playlist in playlists" :key="playlist._id" class="playlist">
        <RouterLink :to="{ name: 'Playlist', params: { id: playlist._id }, query: { groupId: group._id } }"> {{ playlist.name }} </RouterLink>
      </article>
    </article>
    <article v-else></article>
  </aside>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  align-items: center;
}
aside {
  padding-top: 25px;
  margin-left: 50px;
  width: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
}
h5 {
  font-weight: 900;
  font-size: small;
  margin-top: 0;
  font-size: small;
  margin-bottom: 0;
}
svg {
  width: 32px;
  height: 32px;
  transition: all 0.2s ease-in-out;
  background-color: none;
  border-radius: 5px;
}
.menu {
  z-index: 2;
  position: fixed;
  width: 100px;
  top: 70px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: var(--primary);
  border-radius: 0 0 5px 5px;
  clip-path: inset(0px -5px -5px -5px);
  box-shadow: rgba(0, 0, 0, 0.1) 0px 3px 8px 0px;
}
a {
  all: unset;
}

a:hover {
  cursor: pointer;
}
.playlist {
  padding: 10px;
  width: 80px;
  display: flex;
  justify-content: center;
}
.playlist:hover {
  background-color: var(--primary-select);
}

.playlist:last-child {
  border-radius: 0 0 5px 5px;
}
</style>
