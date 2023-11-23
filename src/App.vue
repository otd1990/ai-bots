<template>
  <main class="main">
    <section id="chat" class="main-section">
      <ChatBot />
    </section>
    <section id="movieChats" class="main-section">
      <MoviePicker />
    </section>
  </main>
</template>

<script setup>
import ChatBot from '@/components/ChatBot.vue'
import MoviePicker from '@/components/MoviePicker.vue'
</script>

<style scoped>
.main {
  margin-bottom: 1.5rem;
  display: flex;
  gap: 1rem;
  flex-direction: column;
  padding: 2rem;
}

.main-section {
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: normal;
  justify-content: space-between;
  margin: 0 auto;
  width: 100%;

  background: #fff;
  border-radius: 0.25rem;
  padding: 0.5rem;
}

@media (min-width: 840px) {
  section {
    max-width: 35rem;
  }
}
</style>
