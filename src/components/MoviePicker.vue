<template>
  <aside>
    <h2>I am a movie Recommendation Bot</h2>
    <p>
      Give me a keyword or a feeling or a theme and I'll do my best to match it to the dataset* I am
      programmed with.
    </p>
    <small>*Dataset is very small, this bot is just for demonstration purposes</small>
  </aside>
  <section class="movie-recommendation-container">
    <header class="recommendation-header">Movie Recommendations</header>
    <section class="user-input">
      <input
        v-model="data.userInput"
        @keyup.enter="sendMessage"
        placeholder="Type your keywords..."
      />
      <select class="user-select" v-model="data.count">
        <option v-for="n in 20" :key="n" :select="n === 1 ? true : false">{{ n }}</option>
      </select>
      <button @click="sendMessage">Search</button>
    </section>
    <section v-if="data.recommedations.length > 0" class="recommendations-list">
      <span v-for="(movie, index) in data.recommedations" :key="index">
        <p v-if="index === 0">Search Term: {{ movie.metadata.query }}</p>
        <article>
          <h2>{{ movie.metadata.title }}</h2>
          <div v-if="movie.pageContent" class="description">{{ movie.pageContent }}</div>
        </article>
      </span>
    </section>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const data = ref({
  recommedations: [],
  userInput: '',
  count: 1
})

const sendMessage = async () => {
  const query = data.value.userInput
  const count = data.value.count
  data.value.userInput = ''
  data.value.count = 1

  try {
    const response = await fetch('http://localhost:3010/movies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query: query, count: count })
    })

    const result = await response.json()
    console.log(result)
    data.value.recommedations = [...result]
  } catch (error) {
    console.error('Error sending message:', error)
  }
}
</script>

<style scoped>
.movie-recommendation-container {
  max-width: 100%;
  width: 100%;
  margin: 1.25rem auto; /* 20px */
  margin-bottom: 0;
  background-color: #fff;
  border-radius: 0.625rem; /* 10px */
  box-shadow: 0 0 0.625rem rgba(0, 0, 0, 0.1); /* 10px */
  overflow: hidden;
}

.recommendation-header {
  background-color: #f4ce14;
  color: #f5f7f8;
  padding: 0.625rem; /* 10px */
  text-align: center;
  font-size: 1.2rem; /* 18px */
}

.user-input {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.625rem; /* 10px */
  border-top: 0.063rem solid #ddd; /* 1px */
}

input {
  flex: 1;
}

input,
select {
  padding: 0.5rem; /* 8px */
  margin-right: 0.625rem; /* 10px */
  border: 0.063rem solid #ddd; /* 1px */
  border-radius: 0.313rem; /* 5px */
}

button {
  padding: 0.5rem 0.938rem; /* 8px 15px */
  background-color: #f4ce14;
  color: #f5f7f8;
  border: none;
  border-radius: 0.313rem; /* 5px */
  cursor: pointer;
}

button:hover {
  background-color: #f4ce14;
}

.recommendations-list {
  padding: 0.625rem; /* 10px */
  max-height: 18.75rem; /* 300px */
  overflow-y: auto;
}

article {
  padding: 0.625rem;
  margin: 0.313rem 0; /* 5px 0 */
  border-radius: 0.313rem; /* 5px */
  border: 0.063rem solid #ddd; /* 1px */
}

h2 {
  margin: 0;
}

.description {
  margin-top: 0.313rem; /* 5px */
  color: #333;
}
</style>
