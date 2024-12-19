<template>
  <div class="wrapper-container">
    <div class="wrapper">
      <div class="title">Login</div>
      <div class="form-container">
        <form @submit.prevent="handleLogin" class="login-form">
          <div class="field">
            <input type="text" v-model="form.username" placeholder="Username" required>
          </div>
          <div class="field">
            <input type="password" v-model="form.password" placeholder="Password" required>
          </div>
          <div>
            <div v-if="isCapslockOn" class="capslock">
              CapsLock is On
            </div>
          <div class="field btn">
            <input type="submit" value="Login">
          </div>
          </div>
          <div class="signup-link">Don't have an account? <RouterLink to="/signup">Signup!</RouterLink></div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()

const form = reactive({
  username: '',
  password: ''
})
const isCapslockOn = ref(false)

const handleLogin = async () => {
  // const result = await store.dispatch('login', form)
  // if (result.success) {
  //   router.push('/')
  // } else {
  //   ElMessage.error(result.message)
  // }
}

const handleKeyPress = (event) => {
  isCapslockOn.value = event.getModifierState('CapsLock')
}

onMounted(() => {
  window.addEventListener('keyup', handleKeyPress)
  window.addEventListener('keydown', handleKeyPress)
})

onUnmounted(() => {
  window.removeEventListener('keyup', handleKeyPress)
  window.removeEventListener('keydown', handleKeyPress)
})

</script>

<style scoped>
@import '../assets/form.css';
</style>
