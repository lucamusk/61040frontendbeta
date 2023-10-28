<script setup lang="ts">
//import AddGru from "@/components/Compilation/AddCompilation.vue";
//import CompilationThumbnail from "@/components/Compilation/CompilationThumbnail.vue";
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref } from "vue";
import AddGroup from "./AddGroup.vue";
const { userId } = defineProps(["userId"]);

const loaded = ref(false);
let groups = ref<Array<Record<string, string>>>([]);

async function getGroups(currentUserId: string) {
  let groupResults;
  try {
    groupResults = await fetchy(`api/group/byUser/${currentUserId}`, "GET");
  } catch (_) {
    return;
  }
  groups.value = groupResults;
}

onBeforeMount(async () => {
  await getGroups(userId);
  loaded.value = true;
});
</script>

<template>
  <li v-for="group in groups" :key="group._id">
    <RouterLink :to="{ name: 'Group', params: { name: group.name } }">
      {{ group.name }}
    </RouterLink>
  </li>
  <AddGroup @refresh-user-groups="getGroups(userId)" />
</template>

<style scoped>
.playlistsContainer {
  margin-left: 8vw;
}

li {
  background-color: var(--primary);
  padding: 10px;
  border-radius: 10px;
  width: 100px;
  display: flex;
  justify-content: center;
  overflow-x: hidden;
  text-decoration: none;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 3px 8px;
  transition: all 0.2s ease-in-out;
}

li:hover {
  background-color: var(--primary-select);
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}

a {
  font-size: large;
  color: black;
  text-decoration: none;
}

.playlists {
  display: flex;
  gap: 1vw;
}
</style>
