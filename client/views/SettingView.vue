<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import UpdateUserForm from "../components/Setting/UpdateUserForm.vue";

const { currentUsername } = storeToRefs(useUserStore());
const { logoutUser, deleteUser } = useUserStore();

async function logout() {
  await logoutUser();
  void router.push({ name: "Home" });
}

async function delete_() {
  await deleteUser();
  void router.push({ name: "Home" });
}
</script>

<template>
  <main class="column">
    <h1>Settings for {{ currentUsername }}</h1>
    <button class="button-primary" @click="logout">Logout</button>
    <button class="button-accent" @click="delete_">Delete User</button>
    <UpdateUserForm />
  </main>
</template>

<style scoped>
button {
  all: unset;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
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

.button-accent {
  border: none;
}

.button-accent:hover {
  background-color: var(--accent);
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
