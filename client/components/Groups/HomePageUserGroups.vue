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
  console.log(groupResults);
  groups.value = groupResults;
}

onBeforeMount(async () => {
  await getGroups(userId);
  loaded.value = true;
});
</script>

<template>
  <section class="playlistsContainer" v-if="loaded">
    <h2>Your Groups</h2>
    <section class="playlists">
      <article v-for="group in groups" :key="group._id">
        <RouterLink :to="{ name: 'Group', params: { name: group.name } }">
          {{ group.name }}
        </RouterLink>
      </article>
      <AddGroup @refresh-user-groups="getGroups(userId)" />
    </section>
  </section>
</template>

<style scoped>
h2 {
  font-family: "Bebas Neue", sans-serif;
  width: 90%;
  border-bottom: solid 1px black;
}
.playlistsContainer {
  margin-left: 8vw;
}

.playlists {
  display: flex;
  align-items: center;
  gap: 3vw;
}
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

article {
  background-color: var(--primary);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 2vw;
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
article:hover {
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
