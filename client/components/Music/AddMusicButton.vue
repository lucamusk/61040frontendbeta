<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { ref } from "vue";
const emit = defineEmits(["refreshSongs"]);
const { playlistName } = defineProps(["playlistName"]);

let dialogOpen = ref(false);
let name = ref();

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
  name.value = "";
  setDialog(false);
};

const logAllSongs = async () => {
  console.log(await fetchy(`/api/music`, "GET"));
};
</script>

<template>
  <div role="button" @click="setDialog(!dialogOpen)">
    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16">
      <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
    </svg>
  </div>
  <section :class="{ open: dialogOpen, closed: !dialogOpen }">
    <form @submit.prevent="addSong(name)">
      <input id="name" v-model="name" placeholder="Provide song name!" required />
      <menu>
        <button class="btn-small pure-button-primary pure-button" type="submit">Save</button>
        <button class="btn-small pure-button" @click="setDialog(!dialogOpen)">Cancel</button>
      </menu>
      <button class="btn-small pure-button" @click="logAllSongs">Output all music options to console! (For debugging alpha)</button>
    </form>
  </section>
</template>

<style scoped>
div {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px black solid;
}
svg {
  width: 100%;
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
  background-color: #fefefe;
  margin: 20% auto;
  padding: 20px;
  border: 1px solid #888;
  width: min-content;
  display: flex;
  flex-direction: column;
  height: min-content;
}

menu {
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  gap: 2vw;
  margin-bottom: 1vw;
}

menu > * {
  width: 100%;
}
</style>
