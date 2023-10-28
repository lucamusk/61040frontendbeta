<script setup lang="ts">
const { compilation } = defineProps(["compilation"]);
import { RouterLink } from "vue-router";
</script>

<template>
  <RouterLink :to="{ name: 'Playlist', params: { id: compilation._id } }">
    <div>
      <h3>{{ compilation.name }}</h3>
      <p>{{ compilation.content.length }} items</p>
    </div>
  </RouterLink>
</template>

<style scoped>
* {
  color: var(--text);
}
div {
  background-color: var(--primary);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1vw;
  width: 100px;
  height: 100px;
  gap: 10px;
  border-radius: 15px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 3px 8px;
  transition: all 0.2s ease-in-out;
}
h3 {
  margin-bottom: 0;
  margin-top: 0px;
  overflow: hidden;
  text-overflow: ellipsis;
}
p {
  margin-top: 0;
  margin-bottom: 0px;
}
a {
  all: unset;
}
a {
  max-width: 150px;
  text-overflow: ellipsis;
  text-wrap: nowrap;
}
div:hover {
  cursor: pointer;
  background-color: var(--primary-select);
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}
a > * {
  margin: 0;
}
h3 {
  text-transform: capitalize;
  text-overflow: ellipsis;
  text-wrap: nowrap;
}
</style>
