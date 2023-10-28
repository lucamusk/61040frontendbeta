<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { ref } from "vue";

const username = ref("");
const password = ref("");
const { loginUser, updateSession } = useUserStore();

async function login() {
  await loginUser(username.value, password.value);
  void updateSession();
  void router.push({ name: "Home" });
}
</script>

<template>
  <form class="pure-form pure-form-aligned" @submit.prevent="login">
    <h3>Login</h3>
    <fieldset>
      <div class="pure-control-group">
        <label for="aligned-name">Username</label>
        <input v-model.trim="username" type="text" id="aligned-name" placeholder="Username" required />
      </div>
      <div class="pure-control-group">
        <label for="aligned-password">Password</label>
        <input type="password" v-model.trim="password" id="aligned-password" placeholder="Password" required />
      </div>
      <div class="pure-controls">
        <button type="submit" class="button-primary">Submit</button>
      </div>
    </fieldset>
  </form>
</template>

<style scoped>
h3 {
  display: flex;
  justify-content: center;
}

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
