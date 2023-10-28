<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref } from "vue";
import AddToCompilationMenu from "../Compilation/AddToCompilationMenu.vue";
import FavoriteButton from "../Compilation/FavoriteButton.vue";

const { id, playlistName, favorites, groupId, refreshPlaylists } = defineProps(["id", "playlistName", "favorites", "groupId", "refreshPlaylists"]);
const emit = defineEmits(["refreshSongs", "playlistsRefreshed"]);

const loaded = ref(false);
let song = ref();
let pinHovered = ref(false);

async function getSong(songId: string) {
  let songResult;
  try {
    songResult = await fetchy(`/api/music/id/${songId}`, "GET");
  } catch (_) {
    return;
  }
  song.value = songResult;
}

async function deleteSongPersonal(songId: string) {
  try {
    await fetchy(`/api/compilation/personal/remove`, "PUT", { body: { content: songId, name: playlistName } });
  } catch (_) {
    return;
  }
  emit("refreshSongs");
}

async function deleteSongGroup(songId: string, groupId: string) {
  try {
    await fetchy(`/api/compilation/headline/remove`, "PUT", { body: { content: songId, group: groupId } });
  } catch (_) {
    return;
  }
  emit("refreshSongs");
}

onBeforeMount(async () => {
  await getSong(id);
  loaded.value = true;
});
</script>

<template>
  <section class="song" v-if="loaded && song">
    <a href="song.audioLink">
      <p>{{ song.name }}</p>
      <p>{{ song.artist }}</p>
    </a>
    <p>{{ Math.floor(parseInt(song.duration) / 60).toString() + ":" + (parseInt(song.duration) % 60).toString() }}</p>
    <div>
      <FavoriteButton :songId="song._id" />
      <AddToCompilationMenu :songId="song._id" @refreshSongs="emit('refreshSongs')" :refreshPlaylists="refreshPlaylists" @playlists-refreshed="emit('playlistsRefreshed')" />
      <svg v-if="!favorites && groupId == undefined" @click="deleteSongPersonal(id)" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="delete" viewBox="0 0 16 16">
        <path
          d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
        />
      </svg>
      <div class="hoverable" v-else-if="groupId" @click="deleteSongGroup(id, groupId)" @mouseover="pinHovered = true" @mouseleave="pinHovered = false">
        <svg v-if="!pinHovered" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="var(--primary-select)" class="bi bi-plus-circle-fill" viewBox="0 0 16 16">
          <path
            d="M9.828.722a.5.5 0 0 1 .354.146l4.95 4.95a.5.5 0 0 1 0 .707c-.48.48-1.072.588-1.503.588-.177 0-.335-.018-.46-.039l-3.134 3.134a5.927 5.927 0 0 1 .16 1.013c.046.702-.032 1.687-.72 2.375a.5.5 0 0 1-.707 0l-2.829-2.828-3.182 3.182c-.195.195-1.219.902-1.414.707-.195-.195.512-1.22.707-1.414l3.182-3.182-2.828-2.829a.5.5 0 0 1 0-.707c.688-.688 1.673-.767 2.375-.72a5.922 5.922 0 0 1 1.013.16l3.134-3.133a2.772 2.772 0 0 1-.04-.461c0-.43.108-1.022.589-1.503a.5.5 0 0 1 .353-.146z"
          />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16">
          <path
            d="M9.828.722a.5.5 0 0 1 .354.146l4.95 4.95a.5.5 0 0 1 0 .707c-.48.48-1.072.588-1.503.588-.177 0-.335-.018-.46-.039l-3.134 3.134a5.927 5.927 0 0 1 .16 1.013c.046.702-.032 1.687-.72 2.375a.5.5 0 0 1-.707 0l-2.829-2.828-3.182 3.182c-.195.195-1.219.902-1.414.707-.195-.195.512-1.22.707-1.414l3.182-3.182-2.828-2.829a.5.5 0 0 1 0-.707c.688-.688 1.673-.767 2.375-.72a5.922 5.922 0 0 1 1.013.16l3.134-3.133a2.772 2.772 0 0 1-.04-.461c0-.43.108-1.022.589-1.503a.5.5 0 0 1 .353-.146zm.122 2.112v-.002.002zm0-.002v.002a.5.5 0 0 1-.122.51L6.293 6.878a.5.5 0 0 1-.511.12H5.78l-.014-.004a4.507 4.507 0 0 0-.288-.076 4.922 4.922 0 0 0-.765-.116c-.422-.028-.836.008-1.175.15l5.51 5.509c.141-.34.177-.753.149-1.175a4.924 4.924 0 0 0-.192-1.054l-.004-.013v-.001a.5.5 0 0 1 .12-.512l3.536-3.535a.5.5 0 0 1 .532-.115l.096.022c.087.017.208.034.344.034.114 0 .23-.011.343-.04L9.927 2.028c-.029.113-.04.23-.04.343a1.779 1.779 0 0 0 .062.46z"
          />
        </svg>
      </div>
    </div>
  </section>
</template>

<style scoped>
a {
  all: unset;
  display: flex;
  width: 500px;
  gap: 50px;
}
a:hover {
  cursor: pointer;
}
.hoverable {
  cursor: pointer;
}
.song {
  display: grid;
  grid-template-columns: 4fr 4fr 4fr 2fr;
  grid-template-rows: 1fr;
  border-bottom: 1px solid black;
  justify-content: center;
}

div {
  display: flex;
  justify-content: end;
  align-items: center;
}

article {
  height: min-content;
  display: flex;
  align-items: center;
}

svg {
  margin: 5px;
}

.delete {
  width: 30px;
  height: 30px;
  background-size: 300% 100%;
  border-radius: 5px;
}

.delete:hover {
  cursor: pointer;
  color: white;
  background-color: black;
  background-position: 100% 0;
}

.pointer {
  cursor: pointer;
}
</style>
