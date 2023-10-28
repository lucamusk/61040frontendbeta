<script setup lang="ts">
import MusicSelector from "@/components/Music/MusicSelector.vue";
import { fetchy } from "@/utils/fetchy";
import { ref } from "vue";
const emit = defineEmits(["refreshCaptions"]);
const { group } = defineProps(["group"]);

import CreateMusicForm from "../Music/CreateMusicForm.vue";
let createMusicVisible = ref(false);
let dialogOpen = ref(false);
let musicSelector = ref();

const content = ref("");
const selectedSong = ref<{ _id: string; [k: string]: string }>({ _id: "0" });

const createCaption = async (text: string, song: { _id: string; [k: string]: string }) => {
  console.log(song);
  try {
    await fetchy("/api/group/captions", "POST", {
      body: { text, musicId: song._id, groupId: group._id },
    });
  } catch (_) {
    return;
  }
  await fetchy(`/api/group/reordercontent/${group._id}`, "PUT");
  emit("refreshCaptions");
  emptyForm();
  dialogOpen.value = false;
};

const emptyForm = () => {
  content.value = "";
};
</script>

<template>
  <aside role="button" @click="dialogOpen = true">
    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
      <path
        d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"
      />
      <path
        fill-rule="evenodd"
        d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
      />
    </svg>
    <p>Post</p>
  </aside>
  <section class="dialog" v-if="dialogOpen">
    <form @submit.prevent="createCaption(content, selectedSong)">
      <label for="content">Post Contents:</label>
      <MusicSelector @songSelected="(song) => (selectedSong.value = song)" ref="musicSelector" />
      <textarea id="content" v-model="content" placeholder="Create a post!" required> </textarea>
      <menu>
        <button type="submit" class="button-primary">Create Post</button>
        <button @click="dialogOpen = false" type="button">Close</button>
        <button class="button-special" @click="createMusicVisible = true" type="button">Add a song to our database!</button>
      </menu>
    </form>
  </section>
  <CreateMusicForm :dialogOpen="createMusicVisible" @closeMenu="createMusicVisible = false" @refreshMusic="musicSelector.getAllSongs()" />
</template>

<style scoped>
aside {
  margin-top: 20px;
  margin-bottom: 20px;
  border-radius: 10px;
  padding: 5px;
  margin-left: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.2s ease-in-out;
  height: min-content;
}
p {
  font-weight: 900;
  margin-top: 0;
  margin-bottom: 0;
}
svg {
  width: 32px;
  height: 32px;
  background-size: 300% 100%;
  border-radius: 5px;
}

aside:hover {
  cursor: pointer;
  color: var(--text);
  background-color: var(--primary-select);
  background-position: 100% 0;
  box-shadow: rgba(0, 0, 0, 0.08) 0px 3px 8px;
}

.dialog {
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
  margin-top: 100px;
  padding: 20px;
  border: 1px solid #888;
  width: min-content;
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: min-content;
  border-radius: 10px;
}

select {
  background-color: #f1f6ec;
  border: 1px black solid;
  border-radius: 2px;
  height: 28px;
  font-weight: 400;
}

menu {
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  gap: 2vw;
  margin-bottom: 0;
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

textarea {
  background-color: #f1f6ec;
  border: 1px black solid;
  border-radius: 2px;
  height: 28px;
  font-weight: 400;
  width: 99%;
}
</style>
