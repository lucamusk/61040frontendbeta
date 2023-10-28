<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref, watch } from "vue";
import AddCompilation from "./AddCompilation.vue";
import AddToCompilationButton from "./AddToCompilationButton.vue";
import CompilationThumbnail from "./CompilationThumbnail.vue";
const emit = defineEmits(["refreshSongs", "playlistsRefreshed"]);
const { currentUserId, isLoggedIn } = storeToRefs(useUserStore());
const { songId, refreshPlaylists } = defineProps(["songId", "refreshPlaylists"]);

const loaded = ref(false);
let addedPlaylists = ref<Array<string>>([]);
let plusHovered = ref(false);
let playlists = ref<Array<Record<string, string | string[]>>>([]);
let dialogOpen = ref(false);

watch(refreshPlaylists, async (old: boolean, newVal: boolean) => {
  if (newVal) {
    await getPlaylists(currentUserId.value);
    emit("playlistsRefreshed");
  }
});

async function getPlaylists(ownerId: string) {
  let compilationResults;
  try {
    compilationResults = await fetchy(`/api/compilation/all/${ownerId}`, "GET");
  } catch {
    return;
  }
  console.log("playlists gotten:", compilationResults);
  playlists.value = compilationResults.filter((compilation: { name: string }) => compilation.name !== "favorites");
  addedPlaylists.value = playlists.value.filter((compilation) => compilation.content.includes(songId)).map((compilation) => compilation.name as string);
}

onBeforeMount(async () => {
  await getPlaylists(currentUserId.value);
  loaded.value = true;
});
</script>
<template>
  <div v-if="isLoggedIn" title="Add to Your Playlists">
    <article @click="dialogOpen = true" @mouseover="plusHovered = true" @mouseleave="plusHovered = false" :class="{ pointer: plusHovered }">
      <svg v-if="!plusHovered" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16">
        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="var(--magenta)" class="bi bi-plus-circle-fill" viewBox="0 0 16 16">
        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
      </svg>
    </article>
    <section :class="{ open: dialogOpen, closed: !dialogOpen }">
      <menu>
        <button @click="dialogOpen = false" class="exitButton">Close Menu</button>
        <article v-for="playlist in playlists" :key="playlist._id as string">
          <CompilationThumbnail :compilation="playlist" />
          <AddToCompilationButton
            :added="addedPlaylists.includes(playlist.name as string)"
            :songId="songId"
            :playlistName="playlist.name"
            @refreshSongs="
              emit('refreshSongs');
              getPlaylists(currentUserId);
            "
          />
        </article>
        <AddCompilation @refresh-playlists="() => getPlaylists(currentUserId)" />
      </menu>
    </section>
  </div>
</template>

<style scoped>
menu {
  background-color: var(--base-select);
  border-radius: 10px;
  max-width: 500px;
  display: flex;
  align-items: center;
  overflow-x: scroll;
  padding: 20px;
}
.closed {
  display: none; /* Hidden by default */
}

button {
  all: unset;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 10px;
  height: 30px;
  padding: 5px;
  margin-left: 10px;
  padding-left: 10px;
  padding-right: 10px;
  border-radius: 5px;
  border: var(--text) solid 1px;
}

button:hover {
  cursor: pointer;
  background-color: #f1f6ec;
}
.open {
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2); /* Black w/ opacity */
}

form {
  background-color: #fefefe;
  padding: 20px;
  border: 1px solid #888;
  width: 500px;
  overflow-x: scroll;
  display: flex;
  flex-direction: column;
  height: min-content;
}

menu {
  position: absolute;
  margin: auto;
  top: 30%;
  left: 30%;
  width: 500px;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  gap: 2vw;
  margin-bottom: 0;
}

menu > * {
  width: 100%;
}

article {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: px;
  gap: 10px;
  font-weight: 400;
  margin-left: 10px;
}
</style>
