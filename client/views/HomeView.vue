<script setup lang="ts">
import UserPlaylists from "@/components/Compilation/UserPlaylists.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import HomePageUserGroups from "../components/Groups/HomePageUserGroups.vue";

const { currentUsername, isLoggedIn, currentUserId } = storeToRefs(useUserStore());
</script>

<template>
  <main>
    <section>
      <h1 v-if="isLoggedIn">Welcome {{ currentUsername }}!</h1>
      <h1 v-else>Please login!</h1>
    </section>
    <div v-if="isLoggedIn">
      <HomePageUserGroups :userId="currentUserId" />
      <UserPlaylists :ownerId="currentUserId" />
    </div>
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
  font-family: "Poppins", sans-serif;
}
</style>
