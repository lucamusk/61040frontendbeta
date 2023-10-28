<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref } from "vue";
const { refreshMusic } = defineProps(["refreshMusic"]);

const emit = defineEmits(["songSelected", "musicRefreshed"]);

let dialogOpen = ref(false);
let songs = ref<{ [k: string]: string }[]>([]);
let loading = ref(false);
let selected = ref();

const setDialog = (state: boolean) => {
  dialogOpen.value = state;
};

const getAllSongs = async () => {
  let songsResult;
  try {
    songsResult = await fetchy(`/api/music`, "GET");
  } catch (e) {
    return;
  }
  setDialog(false);
  songs.value = songsResult;
  emit("musicRefreshed");
};

onBeforeMount(async () => {
  await getAllSongs();
  loading.value = true;
});

defineExpose({
  getAllSongs,
});
</script>

<template>
  <select v-model="selected" @change="emit('songSelected', selected)">
    <option v-for="song in songs" v-bind:value="song" v-bind:key="song._id">
      {{ song.name }}
    </option>
  </select>
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
