<script setup lang="ts">
import { ref } from "vue";
import CaptionComponent from "./CaptionComponent.vue";
const emit = defineEmits(["refreshGroup"]);
const { group } = defineProps(["group"]);
let searchAuthor = ref("");
let expanded = ref("");
</script>

<template>
  <div class="row">
    <h2 v-if="!searchAuthor">Posts:</h2>
  </div>
  <section class="posts" v-if="group && group.captions && group.captions.length !== 0">
    <div v-for="captionId in group.captions" :key="captionId">
      <CaptionComponent @refreshPosts="emit('refreshGroup')" :group="group" :captionId="captionId" :expanded="expanded == captionId" @expand="expanded = expanded == captionId ? '' : captionId" />
    </div>
  </section>
  <p v-else-if="group && group.captions && group.captions.length === 0">No posts :(</p>
  <p v-else>Loading</p>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

section,
p,
.row {
  margin: 0 auto;
  max-width: 60em;
}

.posts {
  padding: 1em;
}

.row {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 60em;
}
</style>
