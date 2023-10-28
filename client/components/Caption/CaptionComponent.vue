<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { formatDate } from "@/utils/formatDate";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import AddToCompilationMenu from "../Compilation/AddToCompilationMenu.vue";
import FavoriteButton from "../Compilation/FavoriteButton.vue";
import GroupMusicThumbnail from "../Groups/GroupMusicThumbnail.vue";
import OfficialPlaylistButton from "../Groups/OfficialPlaylistButton.vue";
import VotePanel from "../Votes/VotePanel.vue";

const { captionId, expanded, group } = defineProps(["captionId", "expanded", "group"]);
const emit = defineEmits(["refreshPosts", "expand"]);
const { isLoggedIn, currentUsername } = storeToRefs(useUserStore());

const caption = ref<{ [k: string]: string | Date | Record<string, string> }>({});
const captionVotes = ref({});
const loaded = ref(false);

const loadCaption = async (id: string) => {
  let captionResult;

  try {
    captionResult = await fetchy(`/api/caption/${id}`, "GET");
  } catch (e) {
    console.log(e);
  }
  caption.value = captionResult;
  caption.value.author = await fetchy(`/api/users/id/${caption.value.author}`, "GET");
  await loadVotes(id);
};

const deleteCaption = async (captionId: string) => {
  try {
    await fetchy(`/api/group/captions/${captionId}`, "DELETE", { query: { groupId: group._id } });
  } catch (e) {
    console.log(e);
    return;
  }
  emit("refreshPosts");
};

const loadVotes = async (id: string) => {
  let votesResult;

  try {
    votesResult = await fetchy(`/api/vote/${id}`, "GET");
  } catch (e) {
    console.log(e);
  }

  captionVotes.value = votesResult;
};

onBeforeMount(async () => {
  await loadCaption(captionId);

  loaded.value = true;
});
</script>

<template>
  <div v-if="loaded" class="caption" :class="{ heavyShadow: expanded }" @click="emit('expand')">
    <div class="smallCaption">
      <VotePanel :votesDoc="captionVotes" :loading="!loaded" @refreshVotes="loadVotes(captionId)" :group="group" />
      <GroupMusicThumbnail :id="caption.media" />
      <p v-if="!expanded" class="postText">{{ caption.text }}</p>
      <div class="buttons" v-if="isLoggedIn">
        <OfficialPlaylistButton :songId="caption.media" :group="group" />
        <FavoriteButton :songId="caption.media" />
        <AddToCompilationMenu :songId="caption.media" />
      </div>
      <div class="buttons" v-else>Please log in for action buttons</div>
    </div>
    <div v-if="expanded">
      <div class="base">
        <menu v-if="(caption.author as Record<string, string>).username == currentUsername">
          <li><button class="button-error btn-small pure-button" @click="deleteCaption(caption._id as string)">Delete</button></li>
        </menu>
        <article class="postInfo">
          <p class="userName">{{ (caption.author as Record<string, string>).username }}</p>
          <article class="timestamp">
            <p v-if="caption.dateCreated !== caption.dateUpdated">{{ formatDate(caption.dateUpdated as Date) }}</p>
            <p v-else>{{ formatDate(caption.dateCreated as Date) }}</p>
          </article>
        </article>
        <p class="postText">{{ caption.text }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
* {
  font-family: "Poppins", sans-serif;
}

.buttons {
  justify-self: end;
  display: flex;
  align-items: center;
  width: 30%;
  justify-content: end;
}
.caption {
  background-color: var(--base-select);
  box-shadow: rgba(0, 0, 0, 0.1) 0px 3px 8px;
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

.postText {
  font-weight: 400;
}

.heavyShadow {
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}
.smallCaption {
  display: flex;
  overflow: hidden;
  align-items: center;
  gap: 1vw;
}
p {
  margin: 0em;
}

.author {
  font-weight: bold;
  font-size: 1.2em;
}

menu {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 1em;
  padding: 0;
  margin: 0;
}

.postInfo {
  display: flex;
  flex-direction: column;
  gap: 5px;
  align-items: center;
}
.timestamp {
  display: flex;
  justify-content: flex-end;
  font-size: 0.9em;
  font-style: italic;
  font-weight: 300;
}

.base {
  display: flex;
  justify-content: start;
  align-items: center;
  gap: 50px;
}

.base article:only-child {
  margin-left: auto;
}
</style>
