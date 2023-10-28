<script setup lang="ts">
import PhotoBannerable from "@/components/PhotoBannerable/PhotoBannerable.vue";
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref } from "vue";

const { id } = defineProps(["id", "playlistName"]);
const emit = defineEmits(["refreshSongs"]);

const loaded = ref(false);
let song = ref<Record<string, string>>({});

async function getSong(songId: string) {
  let songResult;
  try {
    songResult = await fetchy(`/api/music/id/${songId}`, "GET");
  } catch (_) {
    return;
  }
  song.value = songResult;
}

onBeforeMount(async () => {
  await getSong(id);
  loaded.value = true;
});
</script>

<template>
  <a :href="song.audioLink">
    <section class="song" v-if="loaded && song">
      <PhotoBannerable :width="150" :height="80" :itemId="song._id" />
      <p>{{ song.name }}</p>
      <p>{{ song.artist }}</p>
    </section>
  </a>
</template>

<style scoped>
a {
  all: unset;
}

a:hover {
  cursor: pointer;
}
.song {
  display: grid;
  grid-template-columns: min-content 4fr 4fr;
  grid-template-rows: 1fr;
  align-items: center;
  gap: 30px;
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
