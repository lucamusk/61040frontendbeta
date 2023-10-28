<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
const { group, songId } = defineProps(["group", "songId"]);
//const emit = defineEmits(["refreshFavorites"]);
const { isLoggedIn } = storeToRefs(useUserStore());

const loaded = ref(false);
let pinned = ref(false);
let pinHovered = ref(false);

async function checkPinnedStatus(groupId: string, songId: string) {
  let pinnedResult;
  try {
    pinnedResult = await fetchy(`/api/compilation/headline/${groupId}`, "GET");
  } catch (_) {
    return;
  }
  pinned.value = pinnedResult.content.includes(songId);
}

async function addPinned(groupId: string, songId: string) {
  try {
    await fetchy(`/api/compilation/headline/add`, "PUT", { body: { content: songId, group: groupId } });
  } catch (_) {
    return;
  }
  pinned.value = true;
}

async function removePinned(groupId: string, songId: string) {
  try {
    await fetchy(`/api/compilation/headline/remove`, "PUT", { body: { content: songId, group: groupId } });
  } catch (_) {
    return;
  }
  pinned.value = false;
}

onBeforeMount(async () => {
  await checkPinnedStatus(group._id, songId);
  loaded.value = true;
});
</script>

<template>
  <div v-if="isLoggedIn" title="Pin to Official Playlist">
    <article
      @mouseover="pinHovered = true"
      @mouseleave="pinHovered = false"
      :class="{ pointer: pinHovered }"
      @click="
        if (pinned) {
          removePinned(group._id, songId);
        } else {
          addPinned(group._id, songId);
        }
      "
    >
      <svg v-if="(!pinHovered && !pinned) || (pinHovered && pinned)" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16">
        <path
          d="M9.828.722a.5.5 0 0 1 .354.146l4.95 4.95a.5.5 0 0 1 0 .707c-.48.48-1.072.588-1.503.588-.177 0-.335-.018-.46-.039l-3.134 3.134a5.927 5.927 0 0 1 .16 1.013c.046.702-.032 1.687-.72 2.375a.5.5 0 0 1-.707 0l-2.829-2.828-3.182 3.182c-.195.195-1.219.902-1.414.707-.195-.195.512-1.22.707-1.414l3.182-3.182-2.828-2.829a.5.5 0 0 1 0-.707c.688-.688 1.673-.767 2.375-.72a5.922 5.922 0 0 1 1.013.16l3.134-3.133a2.772 2.772 0 0 1-.04-.461c0-.43.108-1.022.589-1.503a.5.5 0 0 1 .353-.146zm.122 2.112v-.002.002zm0-.002v.002a.5.5 0 0 1-.122.51L6.293 6.878a.5.5 0 0 1-.511.12H5.78l-.014-.004a4.507 4.507 0 0 0-.288-.076 4.922 4.922 0 0 0-.765-.116c-.422-.028-.836.008-1.175.15l5.51 5.509c.141-.34.177-.753.149-1.175a4.924 4.924 0 0 0-.192-1.054l-.004-.013v-.001a.5.5 0 0 1 .12-.512l3.536-3.535a.5.5 0 0 1 .532-.115l.096.022c.087.017.208.034.344.034.114 0 .23-.011.343-.04L9.927 2.028c-.029.113-.04.23-.04.343a1.779 1.779 0 0 0 .062.46z"
        />
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="var(--primary-select)" class="bi bi-plus-circle-fill" viewBox="0 0 16 16">
        <path
          d="M9.828.722a.5.5 0 0 1 .354.146l4.95 4.95a.5.5 0 0 1 0 .707c-.48.48-1.072.588-1.503.588-.177 0-.335-.018-.46-.039l-3.134 3.134a5.927 5.927 0 0 1 .16 1.013c.046.702-.032 1.687-.72 2.375a.5.5 0 0 1-.707 0l-2.829-2.828-3.182 3.182c-.195.195-1.219.902-1.414.707-.195-.195.512-1.22.707-1.414l3.182-3.182-2.828-2.829a.5.5 0 0 1 0-.707c.688-.688 1.673-.767 2.375-.72a5.922 5.922 0 0 1 1.013.16l3.134-3.133a2.772 2.772 0 0 1-.04-.461c0-.43.108-1.022.589-1.503a.5.5 0 0 1 .353-.146z"
        />
      </svg>
    </article>
  </div>
</template>

<style scoped>
article {
  height: min-content;
  display: flex;
  flex-direction: column;
  margin-right: 10px;
  align-items: center;
  font-weight: 400;
}

svg {
  margin: 5px;
}

.pointer {
  cursor: pointer;
}
</style>
