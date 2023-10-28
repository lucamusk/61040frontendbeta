<script lang="ts" setup>
import { onBeforeMount, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import CaptionList from "../components/Caption/CaptionList.vue";
import CreateCaptionDialog from "../components/Caption/CreateCaptionDialog.vue";
import GroupPlaylistButton from "../components/Groups/GroupPlaylistButton.vue";
import { fetchy } from "../utils/fetchy";
let router = useRouter();
let currentGroupName = ref(useRoute().params.name);
let currentGroup = ref<{ [k: string]: string }>({ _id: "" });
let groupLoaded = ref(false);
let timelineRef = ref<{ [k: string]: () => void }>({});

const loadGroupInfo = async (name: string | string[]) => {
  let groupResults;
  try {
    groupResults = await fetchy(`/api/group/${name}`, "GET");
  } catch (_) {
    return;
  }
  currentGroup.value = groupResults;
};

const leaveGroup = async (name: string | string[]) => {
  let groupResults;
  try {
    groupResults = await fetchy(`/api/group/leave/${name}`, "PUT");
  } catch (_) {
    return;
  }
  await router.push("/");
};

onBeforeMount(async () => {
  groupLoaded.value = false;
  await loadGroupInfo(currentGroupName.value);
  groupLoaded.value = true;
});
</script>

<template>
  <article v-if="groupLoaded">
    <div v-if="groupLoaded">
      <section>
        <CreateCaptionDialog :group="currentGroup" @refresh-captions="loadGroupInfo(currentGroupName)" />
        <GroupPlaylistButton :ownerId="currentGroup._id" :group="currentGroup" />
      </section>
      <h1>{{ currentGroup.name }}</h1>
      <button @click="leaveGroup(currentGroupName)">Leave Group</button>
    </div>
    <CaptionList :group="currentGroup" ref="timelineRef" @refresh-group="loadGroupInfo(currentGroupName)" />
  </article>
</template>

<style scoped>
* {
  color: var(--text);
  font-family: "Poppins", sans-serif;
  font-weight: 700;
}

section {
  display: flex;
  gap: 2vw;
}

div {
  width: 100%;
  height: 70px;
  display: flex;
  background-color: var(--primary);
  justify-content: space-between;
  align-items: center;
  overflow-y: visible;
}

h5 {
  margin: 0;
  font-weight: 400;
}

h1 {
  justify-self: center;
  font-family: "Poppins", sans-serif;
  flex-basis: 5;
}

button {
  all: unset;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 30px;
  padding: 5px;
  margin-right: 20px;
  padding-left: 10px;
  padding-right: 10px;
  border-radius: 5px;
  border: var(--text) solid 1px;
}

button:hover {
  cursor: pointer;
  background-color: var(--accent);
  color: white;
}
</style>
