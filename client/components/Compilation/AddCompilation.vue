<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { ref } from "vue";
const emit = defineEmits(["refreshPlaylists"]);

let dialogOpen = ref(false);
let name = ref("");

const setDialog = (state: boolean) => {
  dialogOpen.value = state;
};

const addPlaylist = async (playlistName: string) => {
  try {
    await fetchy("api/compilation/personal/", "POST", {
      body: { name: playlistName },
    });
  } catch (_) {
    return;
  }
  emit("refreshPlaylists");
  name.value = "";
  setDialog(false);
};
</script>

<template>
  <div role="button" @click="setDialog(!dialogOpen)">
    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16">
      <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
    </svg>
  </div>
  <section :class="{ open: dialogOpen, closed: !dialogOpen }">
    <form @submit.prevent="addPlaylist(name)">
      <input id="name" v-model="name" placeholder="Write a name!" required />
      <menu>
        <button class="btn-small pure-button-primary pure-button" type="submit">Save</button>
        <button class="btn-small pure-button" @click="setDialog(!dialogOpen)">Cancel</button>
      </menu>
    </form>
  </section>
</template>

<style scoped>
svg {
  width: 100px;
  height: 100px;
  margin-top: 24px;
  margin-left: 24px;
  border: 2px solid black;
  transition: all 0.2s ease-in-out;
  background-size: 300% 100%;
  border-radius: 5px;
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
  margin-bottom: 0;
}

menu > * {
  width: 100%;
}
</style>
