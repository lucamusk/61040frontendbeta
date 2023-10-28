<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { ref } from "vue";
const emit = defineEmits(["refreshMusic", "closeMenu"]);
const { dialogOpen } = defineProps(["dialogOpen"]);

let name = ref("");
let audioLink = ref("");
let imageLink = ref("");
let duration = ref("");
let artist = ref("");

const createMusic = async (name: string, audioLink: string, artist: string, duration: string, imageLink?: string) => {
  let musicResult;
  try {
    musicResult = await fetchy(`/api/music`, "POST", {
      body: {
        audioLink,
        artist,
        name,
        duration: parseInt(duration.slice(0, duration.indexOf(":"))) * 60 + parseInt(duration.slice(duration.indexOf(":") + 1)),
      },
    });
  } catch (_) {
    return;
  }
  emit("refreshMusic");
  emit("closeMenu");

  if (imageLink) {
    const musicId = musicResult.music._id;
    console.log(`Music: ${musicId}`);
    try {
      await fetchy(`/api/photobanner`, "POST", {
        body: {
          item: musicId,
          photoLink: imageLink,
        },
      });
    } catch (_) {
      return;
    }
  }
};
</script>

<template>
  <section :class="{ open: dialogOpen, closed: !dialogOpen }">
    <form @submit.prevent="createMusic(name, audioLink, artist, duration, imageLink)">
      <h2>Provide information to add a new song to our database!</h2>
      <input type="text" required v-model="name" placeholder="Song Title" />
      <input type="text" required v-model="audioLink" placeholder="Url to the audio" />
      <input type="text" required v-model="artist" placeholder="Song Artist" />
      <input type="text" required v-model="duration" placeholder="Song Duration (mm:ss)" pattern="[0-9]{1,2}:[0-9]{1,2}" />
      <input type="text" v-model="imageLink" placeholder="Song Image Url" />
      <menu>
        <button class="button-primary" type="submit">Add Song</button>
        <button @click="emit('closeMenu')" type="button">Cancel</button>
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
  background-color: var(--base-select);
  margin: 20% auto;
  margin-top: 100px;
  padding: 20px;
  border: 1px solid #888;
  width: min-content;
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

input {
  background-color: #f1f6ec;
  border: 1px black solid;
  border-radius: 2px;
  height: 28px;
  font-weight: 400;
}
</style>
