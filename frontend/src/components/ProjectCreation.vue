<script setup lang="ts">
import {Button, InputText} from 'primevue';
import {onMounted, ref} from "vue";
import anime from "animejs/lib/anime.es.js";

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


onMounted(() => {
  const textWrapper = document.querySelector('#big_idea');
  textWrapper.innerHTML = textWrapper.textContent.replace(/(\S|\s)/g, function(match) {
    return match === ' ' ? '&nbsp;' : `<span class='letter'>${match}</span>`;
  });

  const dock = textWrapper;
  const icons = document.querySelectorAll(".letter");

  dock.addEventListener("mousemove", (e) => {
    const effectRadius = 100; // Radius of magnification effect
    const maxScale = 2; // Maximum scale
    const maxPadding = Math.min(window.innerWidth * 0.01, 30); // Max 30px

    icons.forEach((icon) => {
      const rect = icon.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distance = Math.sqrt(
          Math.pow(centerX - e.clientX, 2) + Math.pow(centerY - e.clientY, 2)
      );

      const scale =
          distance < effectRadius
              ? 1 + (maxScale - 1) * (1 - distance / effectRadius)
              : 1;

      const padding =
          distance < effectRadius
              ? maxPadding * (1 - distance / effectRadius)
              : 0;

      anime({
        targets: icon,
        scale: scale,
        padding: padding + "px",
        duration: 100,
        easing: "easeOutQuad",
      });
    });
  });

  dock.addEventListener("mouseleave", () => {
    anime({
      targets: icons,
      scale: 1,
      padding: "0px",
      duration: 100,
      easing: "easeOutQuad",
    });
  });


})
</script>

<template>
  <div class="container">
    <h1 class="chewy-regular text-center bouncing-letters xl:h-10rem flex align-items-center big_title font-bold" id="big_idea">Hey, what′s the big idea ?</h1>
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
  .big_title {
    padding: 20px;
    font-size: 4rem;
    height: 10rem !important;
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
    .big_title {
      font-size: 2rem;
    }
  }

</style>