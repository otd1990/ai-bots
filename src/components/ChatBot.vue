<template>
  <section class="chatbot">
    <aside>
      <h2>Talk to me...</h2>
      <p>I am a chatbot, I use the openAI API to answer your questions</p>
    </aside>
    <article class="chatbot__container">
      <section class="chatbot__chat">
        <div
          v-for="(message, index) in data.chatMessages"
          :key="index"
          class="chatbot__chat-text"
          :class="{
            'chatbot__bot-response show': message.sender === 'ChatGPT',
            'chatbot__question show': message.sender !== 'ChatGPT'
          }"
        >
          <strong>{{ message.sender }}:</strong> {{ message.text }}
        </div>
      </section>
      <section class="chatbot__textarea">
        <input
          type="text"
          aria-label="text area to ask a question"
          v-model="data.newMessage"
          @keyup.enter="sendMessage"
          placeholder="Type your message..."
        />
        <button @click="sendMessage">Submit</button>
      </section>
    </article>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const data = ref({
  chatMessages: [
    {
      sender: 'ChatGPT',
      text: "Ask me anything and I'll do my best to answer you!"
    }
  ],
  newMessage: ''
})

const currentMessage = ref('')

const sendMessage = async () => {
  data.value.chatMessages.push({ sender: 'User123', text: data.value.newMessage })
  try {
    const response = await fetch('http://localhost:3010/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: data.value.newMessage }) // Update the key to 'message'
    })

    data.value.newMessage = ''

    const result = await response.json()
    const chatGPTResponse = result.text // Adjust the property based on your server response structure

    data.value.chatMessages.push({ sender: 'ChatGPT', text: chatGPTResponse })
  } catch (error) {
    console.error('Error sending message:', error)
  }
}
</script>

<style scoped>
.chatbot {
  width: 100%;
  padding: 0;
}

p {
  margin: 1rem 0;
}

.chatbot__container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center; /* Updated from normal */
}

.chatbot__chat {
  background: #252a34; /* Updated background color */
  border-top-left-radius: 0.25rem;
  border-top-right-radius: 0.25rem;
  width: 100%;
}

.chatbot__chat-text {
  color: #fff;
  width: fit-content;
  padding: 0.75rem 1.5rem; /* Updated padding */
  margin: 0.75rem 0;
  border-radius: 1.5rem;
}

.chatbot__bot-response {
  background-color: #eeeeee;
  color: #252a34;
  margin-right: auto;
  margin-left: 0.75rem;
  border-radius: 1.5rem;
  max-width: 85%;
}

.chatbot__question {
  background: #39a7ff;
  margin-left: auto;
  margin-right: 0.75rem;
  border-radius: 1.5rem;
  transform: translateX(0); /* Updated transform value */
  transition: transform 0.75s ease;
  transition-delay: 1s;
}

.chatbot__textarea {
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  border: 1px solid #d4d4d4;
  border-bottom-left-radius: 0.25rem;
  border-bottom-right-radius: 0.25rem;
  width: 100%;
}

.chatbot__textarea input {
  width: 100%;
  padding: 0.75rem;
  min-height: 3rem;
  border: none;
}

strong {
  font-weight: bold;
}

button {
  border: none;
  margin: 0.25rem;
  padding: 0.75rem 1.5rem; /* Updated padding */
  background-color: #39a7ff; /* Updated background color */
  color: #fff;
  border-radius: 0.25rem;
  cursor: pointer;
}

button:hover {
  background-color: #2079c7; /* Darker shade for hover effect */
}
</style>
