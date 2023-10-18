<script setup lang="ts">
import UserPlaylists from "@/components/Compilation/UserPlaylists.vue";
import PostListComponent from "@/components/Post/PostListComponent.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { currentUsername, isLoggedIn, currentUserId } = storeToRefs(useUserStore());
</script>

<template>
  <main>
    <h1>Home Page</h1>
    <section>
      <h1 v-if="isLoggedIn">Welcome {{ currentUsername }}!</h1>
      <h1 v-else>Please login!</h1>
    </section>
    <div v-if="isLoggedIn">
      <UserPlaylists :ownerId="currentUserId" />
      <PostListComponent />
    </div>
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
