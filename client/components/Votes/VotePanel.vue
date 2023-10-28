<script setup>
import { ref, computed } from "vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { fetchy } from "../../utils/fetchy";
const emit = defineEmits(["refreshVotes"]);
const props = defineProps(["votesDoc", "loading", "group"]);
const { currentUserId } = storeToRefs(useUserStore());
const hoveredTop = ref(false);
const hoveredBottom = ref(false);

const upvoted = computed(() => {
  return props.votesDoc.upvotedMembers.includes(currentUserId.value);
});
const downvoted = computed(() => {
  return props.votesDoc.downvotedMembers.includes(currentUserId.value);
});

const upvote = async (id) => {
  try {
    await fetchy(`/api/vote/upvote/${id}`, "PUT");
  } catch (e) {
    console.log(e);
    return;
  }
  emit("refreshVotes");
  await fetchy(`/api/group/reordercontent/${props.group._id}`, "PUT");
};

const downvote = async (id) => {
  try {
    await fetchy(`/api/vote/downvote/${id}`, "PUT");
  } catch (e) {
    console.log(e);
    return;
  }
  emit("refreshVotes");
  await fetchy(`/api/group/reordercontent/${props.group._id}`, "PUT");
};

const unvote = async (id) => {
  try {
    await fetchy(`/api/vote/unvote/${id}`, "PUT");
  } catch (e) {
    console.log(e);
    return;
  }
  emit("refreshVotes");
  await fetchy(`/api/group/reordercontent/${props.group._id}`, "PUT");
};
</script>
<template>
  <div>
    <article
      @mouseover="hoveredTop = true"
      @mouseleave="hoveredTop = false"
      @click="
        if (upvoted) {
          unvote(props.votesDoc.post);
        } else {
          upvote(props.votesDoc.post);
        }
      "
    >
      <svg v-if="(!hoveredTop && !upvoted) || (hoveredTop && upvoted)" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-up" viewBox="0 0 16 16">
        <path d="M3.204 11h9.592L8 5.519 3.204 11zm-.753-.659 4.796-5.48a1 1 0 0 1 1.506 0l4.796 5.48c.566.647.106 1.659-.753 1.659H3.204a1 1 0 0 1-.753-1.659z" />
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-up-fill" viewBox="0 0 16 16">
        <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
      </svg>
    </article>
    <p v-if="!loading">{{ props.votesDoc.voteCount }}</p>
    <p v-else>"Loading"</p>
    <article
      @mouseover="hoveredBottom = true"
      @mouseleave="hoveredBottom = false"
      @click="
        if (downvoted) {
          unvote(props.votesDoc.post);
        } else {
          downvote(props.votesDoc.post);
        }
      "
    >
      <svg
        v-if="(!hoveredBottom && !downvoted) || (hoveredBottom && downvoted)"
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        class="bi bi-caret-down"
        viewBox="0 0 16 16"
      >
        <path d="M3.204 5h9.592L8 10.481 3.204 5zm-.753.659 4.796 5.48a1 1 0 0 0 1.506 0l4.796-5.48c.566-.647.106-1.659-.753-1.659H3.204a1 1 0 0 0-.753 1.659z" />
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-down-fill" viewBox="0 0 16 16">
        <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
      </svg>
    </article>
  </div>
</template>

<style scoped>
div {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 1vw;
}

p {
  text-align: center;
}
</style>
