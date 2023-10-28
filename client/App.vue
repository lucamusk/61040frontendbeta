<script setup lang="ts">
import { useToastStore } from "@/stores/toast";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount, ref } from "vue";
import { RouterLink, RouterView, useRoute } from "vue-router";
import UserGroups from "./components/Groups/UserGroups.vue";

const currentRoute = useRoute();
const currentRouteName = computed(() => currentRoute.name);
const userStore = useUserStore();
const { isLoggedIn, currentUserId } = storeToRefs(userStore);
const { toast } = storeToRefs(useToastStore());
const navVisible = ref(false);

// Make sure to update the session before mounting the app in case the user is already logged in
onBeforeMount(async () => {
  try {
    await userStore.updateSession();
  } catch {
    // User is not logged in
  }
});

const toggleNavVisible = (current: boolean) => {
  console.log(navVisible);
  navVisible.value = !current;
};
</script>

<template>
  <header></header>
  <div class="view">
    <div class="sidebar">
      <nav :class="{ active: navVisible }">
        <ul>
          <li :class="{ highlight: currentRouteName == 'Home' }">
            <RouterLink :to="{ name: 'Home' }"> Home </RouterLink>
          </li>
          <li v-if="isLoggedIn" :class="{ hightlight: currentRouteName == 'Settings' }">
            <RouterLink :to="{ name: 'Settings' }"> Settings </RouterLink>
          </li>
          <UserGroups v-if="isLoggedIn" :userId="currentUserId" />
          <li v-else :class="{ underline: currentRouteName == 'Login' }">
            <RouterLink :to="{ name: 'Login' }"> Login </RouterLink>
          </li>
        </ul>
      </nav>
      <button @click="toggleNavVisible(navVisible)">
        <svg v-if="navVisible" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-left" viewBox="0 0 16 16">
          <path d="M10 12.796V3.204L4.519 8 10 12.796zm-.659.753-5.48-4.796a1 1 0 0 1 0-1.506l5.48-4.796A1 1 0 0 1 11 3.204v9.592a1 1 0 0 1-1.659.753z" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-right" viewBox="0 0 16 16">
          <path d="M6 12.796V3.204L11.481 8 6 12.796zm.659.753 5.48-4.796a1 1 0 0 0 0-1.506L6.66 2.451C6.011 1.885 5 2.345 5 3.204v9.592a1 1 0 0 0 1.659.753z" />
        </svg>
      </button>
    </div>
    <RouterView />
  </div>
</template>

<style scoped>
@import "./assets/toast.css";

* {
  font-family: "Poppins", sans-serif;
  font-weight: 600;
}
nav {
  background-color: #d1d6cc;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  width: 0;
}

h1 {
  font-size: 2em;
  margin: 0;
}

.title {
  display: flex;
  align-items: center;
  gap: 0.5em;
}

img {
  height: 2em;
}

a {
  font-size: large;
  color: black;
  text-decoration: none;
}

ul {
  list-style-type: none;
  padding-left: 2vw;
  padding-right: 1vw;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 1em;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.highlight {
  background-color: var(--primary-select);
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}

.sidebar {
  display: flex;
  flex-direction: row;
  height: 105vh;
  position: fixed;
  margin-top: -5vh;
}
button {
  background-color: var(--primary);
  border-radius: 5px;
  border: none;
  border-left: none;
  box-shadow: rgba(0, 0, 0, 0.1) 3px 3px 8px;
  transition: all 0.2s ease-in-out;
}

button:hover {
  background-color: var(--primary-select);
  cursor: pointer;
}

li {
  background-color: var(--primary);
  padding: 10px;
  border-radius: 10px;
  width: 100px;
  display: flex;
  justify-content: center;
  overflow-x: hidden;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 3px 8px;
  transition: all 0.2s ease-in-out;
}

li:hover {
  background-color: var(--primary-select);
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}

nav.active {
  width: min-content;
}
</style>
