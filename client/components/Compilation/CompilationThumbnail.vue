<script setup lang="ts">
const { compilation } = defineProps(["compilation"]);
import { RouterLink } from "vue-router";
const emit = defineEmits(["editPost", "refreshPosts"]);
console.log(compilation);
</script>

<template>
  <RouterLink :to="{ name: 'Playlist', params: { id: compilation._id } }">
    <img />
    <h3>{{ compilation.name }}</h3>
    <p>{{ compilation.content.length }} items</p>
  </RouterLink>
</template>

<style scoped>
a {
  all: unset;
}
a {
  max-width: 150px;
  text-overflow: ellipsis;
  text-wrap: nowrap;
}
a:hover {
  cursor: pointer;
}
a > * {
  margin: 0;
}
img {
  width: 150px;
  height: 150px;
  background-color: magenta;
  border: black 1px solid;
}
h3 {
  text-transform: capitalize;
  text-overflow: ellipsis;
  text-wrap: nowrap;
}
</style>
