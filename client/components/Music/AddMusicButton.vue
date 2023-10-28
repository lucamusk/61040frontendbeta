<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { ref } from "vue";
import CreateMusicForm from "./CreateMusicForm.vue";
import MusicSelector from "./MusicSelector.vue";
const emit = defineEmits(["refreshSongs"]);
const { playlistName } = defineProps(["playlistName"]);

let dialogOpen = ref(false);
let selectedSong = ref("");
let createMusicVisible = ref(false);
let musicSelector = ref();

const setDialog = (state: boolean) => {
  dialogOpen.value = state;
};

const addSong = async (songName: string) => {
  let songs;
  console.log(songName);
  try {
    songs = await fetchy(`/api/music/name/${songName}`, "GET");
    await fetchy(`/api/compilation/personal/add`, `PUT`, { body: { content: songs[0]._id, name: playlistName } });
  } catch (e) {
    return;
  }
  emit("refreshSongs");
  selectedSong.value = "";
  setDialog(false);
};
</script>

<template>
  <div role="button" @click="setDialog(!dialogOpen)">
    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16">
      <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
    </svg>
  </div>
  <section :class="{ open: dialogOpen, closed: !dialogOpen }">
    <form @submit.prevent="addSong(selectedSong)">
      <MusicSelector @songSelected="(song) => (selectedSong = song.name)" ref="musicSelector" />
      <menu>
        <button class="button-primary" type="submit">Add</button>
        <button @click="setDialog(!dialogOpen)" type="button">Cancel</button>
        <button class="button-special" @click="createMusicVisible = true" type="button">Add a song to our database!</button>
      </menu>
    </form>
  </section>
  <CreateMusicForm :dialogOpen="createMusicVisible" @closeMenu="createMusicVisible = false" @refreshMusic="musicSelector.getAllSongs()" />
</template>

<style scoped>
div {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--base-select);
  transition: all 0.2s ease-in-out;
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 3px 8px;
}
svg {
  width: 100%;
  height: 30px;
  background-size: 300% 100%;
  border-radius: 5px;
  margin: 5px;
}

div:hover {
  cursor: pointer;
  color: white;
  background-color: var(--magenta);
  background-position: 100% 0;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}

.closed {
  display: none; /* Hidden by default */
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
  background-color: var(--base-select);
  margin: 20% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 500px;
  display: flex;
  flex-direction: column;
  height: min-content;
  border-radius: 10px;
}

menu {
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  gap: 2vw;
  margin-bottom: 1vw;
  border-radius: 10px;
}

menu > * {
  width: 100%;
}

button {
  all: unset;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 130px;
  margin-top: 20px;
  font-weight: 600;
  padding: 5px;
  padding-left: 10px;
  padding-right: 10px;
  border-radius: 5px;
  border: var(--text) solid 1px;
  box-shadow: rgba(0, 0, 0, 0.08) 0px 3px 8px;
  transition: all 0.2s ease-in-out;
}

button:hover {
  cursor: pointer;
  background-color: #f1f6ec;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 3px 8px;
}

.button-primary {
  border: none;
  background-color: var(--primary);
}

.button-primary:hover {
  background-color: var(--primary-select);
}

.button-special {
  border: none;
  background-color: var(--magenta);
}

.button-special:hover {
  background-color: #ff2ab7;
}

select {
  background-color: #f1f6ec;
  border: 1px black solid;
  border-radius: 2px;
  height: 28px;
  font-weight: 400;
}
</style>
