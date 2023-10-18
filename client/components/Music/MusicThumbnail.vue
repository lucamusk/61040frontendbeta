<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref } from "vue";

const { id, playlistName } = defineProps(["id", "playlistName"]);
const emit = defineEmits(["refreshSongs"]);

const loaded = ref(false);
let song = ref();

async function getSong(songId: string) {
  let songResult;
  try {
    songResult = await fetchy(`/api/music/id/${songId}`, "GET");
  } catch (_) {
    return;
  }
  song.value = songResult;
}

async function deleteSong(songId: string) {
  try {
    await fetchy(`/api/compilation/personal/remove`, "PUT", { body: { content: songId, name: playlistName } });
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
    <p>Song Img</p>
    <p>{{ song.name }}</p>
    <p>{{ song.artist }}</p>
    <p>{{ song.duration }}</p>
    <div>
      <svg @click="deleteSong(id)" xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
        <path
          d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
        />
      </svg>
    </div>
  </section>
</template>

<style scoped>
.song {
  display: grid;
  grid-template-columns: 4fr 4fr 4fr 2fr 1fr;
  grid-template-rows: 1fr;
  border-bottom: 1px solid black;
}

div {
  display: flex;
  justify-content: center;
  align-items: center;
}

svg {
  width: 30px;
  height: 30px;
  transition: all 0.2s ease-in-out;
  background-size: 300% 100%;
  border-radius: 5px;
  margin: 5px;
}

svg:hover {
  cursor: pointer;
  color: white;
  background-color: black;
  background-position: 100% 0;
}
</style>
