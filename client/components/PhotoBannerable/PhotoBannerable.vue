<script setup>
import { onBeforeMount } from "vue";
import { ref } from "vue";
import { fetchy } from "@/utils/fetchy";
const { width, height, itemId } = defineProps(["width", "height", "itemId"]);

const loaded = ref(false);
const photoLink = ref("");

const fetchPhotoLink = async (id) => {
  let photoResult;
  console.log("fetching photo link");
  try {
    photoResult = await fetchy(`/api/photobanner/${id}`, "GET");
  } catch (e) {
    console.log("photo fetch failed", e);
  }
  photoLink.value = photoResult.photoUrl;
};

onBeforeMount(async () => {
  loaded.value = false;
  await fetchPhotoLink(itemId);
  loaded.value = true;
});
</script>

<template>
  <img v-if="loaded" :src="photoLink" :width="width" :height="height" />
</template>

<style scoped>
img {
  border: black 1px solid;
}
</style>
