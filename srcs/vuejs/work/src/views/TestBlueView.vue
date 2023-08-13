<script setup lang="ts">
import { ref, watch } from 'vue'

const question = ref('')
const answer = ref('Questions usually contain a question mark. ;-)')
let value = 0;

watch(question, async (newQuestion) => {
  if (newQuestion.indexOf('?') > -1) {
    answer.value = 'Thinking...'
    try {
      const res = await fetch('https://yesno.wtf/api')
      answer.value = (await res.json()).answer
      value = answer.value=='yes' ? value += 1 : 0;
    } catch (error) {
      answer.value = 'Error! Could not reach the API. ' + error
    }
  }
})

// fetch('https://yesno.wtf/api').then(res => {return res.json();})
// .then(
//  ).catch();
</script>

<template>
  <p>
    Ask a yes/no question:
    <input v-model="question" />
  </p>
  <p v-if="value">{{ value }}</p>
  <p>{{ answer }}</p>
</template>