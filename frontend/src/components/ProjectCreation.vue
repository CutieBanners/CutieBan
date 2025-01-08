<script setup lang="ts">
import {Button, InputText} from 'primevue';
import {ref} from "vue";

const formData = ref({ name: '' });
const showError = ref(false);
const isShaking = ref(false);
const hover = ref(false);

const handleSubmit = () => {
  if (!formData.value.name) {
    showError.value = true;
    isShaking.value = true;
    setTimeout(() => {
      isShaking.value = false;
    }, 500);
  } else {
    showError.value = false;
  }
};

document.querySelectorAll(".bouncing-letters>span")
    .forEach((element) => {
      element.addEventListener("mouseover",
          (e) => bounce(e.target));
    });

function bounce(letter) {
  if (!letter.classList.contains("bounce")) {
    letter.classList.add("bounce");
    setTimeout(
        function () {
          letter.classList.remove("bounce");
        },
        1000
    );
  }
}

</script>

<template>
  <div class="container">
    <h1 class="chewy-regular text-center bouncing-letters xl:h-10rem flex align-items-center" id="big_title" style="letter-spacing:0.3px;">
      <span>H</span>
      <span>e</span>
      <span>y</span>
      <span>,</span>
      <span>&nbsp;</span>
      <span>w</span>
      <span>h</span>
      <span>a</span>
      <span>t</span>
      <span>′</span>
      <span>s</span>
      <span>&nbsp;</span>
      <span>t</span>
      <span>h</span>
      <span>e</span>
      <span>&nbsp;</span>
      <span>b</span>
      <span>i</span>
      <span>g</span>
      <span>&nbsp;</span>
      <span>i</span>
      <span>d</span>
      <span>e</span>
      <span>a</span>
      <span>?</span>
    </h1>
    <form @submit.prevent="handleSubmit">
      <InputText type="text" v-model="formData.name" placeholder="Lollipop"/>
      <button
          type="submit"
          @mouseenter="hover = true"
          @mouseleave="hover = false"
          class="animated-gradient-button"
      >
        Create
      </button>
    </form>
    <p v-if="showError" :class="['error-message', { shake: isShaking }]">
      Please fill in this field!
    </p>
  </div>
</template>

<style scoped>
  #big_title {
    font-size: 4rem;
  }

  .container {
    justify-items: center;
  }


  .animated-gradient-button {
    position: relative;
    display: inline-block;
    padding: 9px 20px;
    font-size: 16px;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-left: 0.2rem;
    background: linear-gradient(90deg, #0ab7c6, #270cef, #0ab7c6);
    background-size: 300% 100%;
    animation: gradient-loop 4s linear infinite;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    transition: box-shadow 0.3s ease;
  }

  /* Hover effect for shadow */
  .animated-gradient-button:hover {
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.5);
  }

  /* Gradient Animation */
  @keyframes gradient-loop {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }


  .error-message {
    color: red;
    font-size: 14px;
    margin-top: 10px;
  }

  /* Shake animation */
  @keyframes shake {
    0%, 100% {
      transform: translateX(0);
    }
    25% {
      transform: translateX(-5px);
    }
    50% {
      transform: translateX(5px);
    }
    75% {
      transform: translateX(-5px);
    }
  }

  .shake {
    animation: shake 0.5s ease;
  }

  @media only screen and (max-width: 600px) {
    #big_title {
      font-size: 2rem;
    }
  }

  @media only screen and (min-width: 600px) {
    .bouncing-letters span {
      transition: font-size ease-in-out .1s;
      transform: translateZ(0);
      will-change: transform;
    }

    .bouncing-letters span:hover {
      font-size: 8rem;
    }
  }

</style>