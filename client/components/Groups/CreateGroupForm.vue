<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { ref } from "vue";
const emit = defineEmits(["refreshGroups", "closeMenu"]);
const { dialogOpen } = defineProps(["dialogOpen"]);

let name = ref("");
let loadingGroups = ref(false);

const setDialog = (state: boolean) => {
  dialogOpen.value = state;
};

const joinGroup = async (groupName: string) => {
  try {
    await fetchy(`api/group/join/${groupName}`, "PUT");
  } catch (_) {
    return;
  }
  emit("refreshGroups");
  emit("closeMenu");
};

const createGroup = async (name: string) => {
  let groupResult;
  try {
    groupResult = await fetchy(`api/group`, "POST", { body: { name } });
  } catch (e) {
    alert(e.message);
    return;
  }
  let newGroup = groupResult.group;

  await joinGroup(newGroup);
};
</script>

<template>
  <section :class="{ open: dialogOpen, closed: !dialogOpen }">
    <form @submit.prevent="createGroup(name)">
      <h2>Create a new Group!</h2>
      <label>Name for the group</label>
      <input type="text" required v-model="name" />
      <menu>
        <button class="button-primary" type="submit">Create group</button>
        <button @click="emit('closeMenu')" type="button">Cancel</button>
      </menu>
    </form>
  </section>
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

label {
  font-weight: 600;
}

input {
  all: unset;
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

input {
  background-color: #f1f6ec;
  border: 1px black solid;
  border-radius: 2px;
  height: 28px;
  font-weight: 400;
  padding: 5px;
}
</style>
