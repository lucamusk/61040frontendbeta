<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref } from "vue";
import CreateGroupForm from "./CreateGroupForm.vue";
const emit = defineEmits(["refreshUserGroups", "refreshAllGroups"]);

let dialogOpen = ref(false);
let createGroupVisible = ref(false);
let selected = ref<Record<string, string>>({});
let allGroups = ref<Array<Record<string, string>>>([]);
let loadingGroups = ref(false);

const setDialog = (state: boolean) => {
  dialogOpen.value = state;
};

const joinGroup = async (group: Record<string, string>) => {
  try {
    await fetchy(`api/group/join/${group.name}`, "PUT");
  } catch (e) {
    alert("Already in that group!");
    return;
  }
  emit("refreshUserGroups");
  selected.value = {};
  setDialog(false);
};

const getAllGroups = async () => {
  let groupsResults;
  try {
    groupsResults = await fetchy(`api/group`, "GET");
  } catch (_) {
    return;
  }
  allGroups.value = groupsResults;
};

onBeforeMount(async () => {
  await getAllGroups();
  loadingGroups.value = true;
});
</script>

<template>
  <div role="button" @click="setDialog(!dialogOpen)">
    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16">
      <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
    </svg>
  </div>
  <section :class="{ open: dialogOpen, closed: !dialogOpen }">
    <form @submit.prevent="joinGroup(selected)">
      <h2>Select a group to join!</h2>
      <select v-model="selected">
        <option v-for="group in allGroups" v-bind:value="group" v-bind:key="group._id">
          {{ group.name }}
        </option>
      </select>
      <menu>
        <button class="button-primary" type="submit">Join group</button>
        <button @click="setDialog(!dialogOpen)" type="button">Cancel</button>
        <button
          type="button"
          class="button-special"
          @click="
            createGroupVisible = true;
            dialogOpen = false;
          "
        >
          Create new group
        </button>
      </menu>
    </form>
  </section>
  <CreateGroupForm
    :dialogOpen="createGroupVisible"
    @closeMenu="createGroupVisible = false"
    @refreshGroups="
      getAllGroups();
      emit('refreshUserGroups');
    "
  />
</template>

<style scoped>
* {
  color: var(--text);
  font-family: "Poppins", sans-serif;
  font-weight: 700;
}
svg {
  color: var(--primary);
  background-color: var(--primary);
  width: 100px;
  height: 100px;
  transition: all 0.2s ease-in-out;
  background-size: 300% 100%;
  border-radius: 5px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 3px 8px;
}

svg:hover {
  cursor: pointer;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  background-color: var(--primary-select);
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
  background-color: rgba(0, 0, 0, 0.2);
}

form {
  background-color: var(--base-bg);
  margin: 20% auto;
  padding: 20px;
  padding-top: -100px;
  border: 1px solid #888;
  width: 400px;
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

button {
  all: unset;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
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

select {
  background-color: #f1f6ec;
  border: 1px black solid;
  border-radius: 2px;
  height: 28px;
  font-weight: 400;
}
</style>
