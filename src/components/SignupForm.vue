<template>
  <div class="wrapper-container">
    <div class="wrapper">
      <div class="title">Signup</div>
      <div class="form-container">
        <form @submit.prevent="handleSignup" class="signup-form">
          <div class="field">
            <input type="text" v-model="form.username" placeholder="Username" required>
          </div>
          <div class="field">
            <input type="password" v-model="form.password" placeholder="Password" required>
          </div>
          <div class="field">
            <input type="password" v-model="form.confirmPassword" placeholder="Confirm password" required>
            <div v-if="form.password && form.confirmPassword && form.password !== form.confirmPassword" class="error">Passwords do not match</div>
            <div v-if="form.password && form.confirmPassword && form.password === form.confirmPassword" class="match">Passwords match</div>
          </div>
          <div>
            <div v-if="isCapslockOn" class="capslock">
              CapsLock is On
            </div>
            <div class="field btn">
              <input type="submit" value="Signup">
            </div>
          </div>
          <div class="signup-link">Already have an account? <RouterLink to="/login">Login!</RouterLink></div>
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
  password: '',
  confirmPassword: ''
})
const isCapslockOn = ref(false)
const pattern = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/

const handleSignup = async () => {
  if (form.password !== form.confirmPassword) {
    return
  }
  if (!pattern.test(form.password)) {
    ElMessage.error('Password should be 8-16 characters long, and should contain at least an uppercase letter, a lowercase letter, a number, a special character, and no spaces')
    return
  }
  // const result = await store.dispatch('signup', form)
  // if (result.success) {
  //   router.push('/')
  // } else if (result.message === 'Username is already taken') {
  //   ElMessage.error(result.message)
  // } else {
  //   console.log(result.message)
  // }
}

const handleKeyPress = (event) => {
  isCapslockOn.value = event.getModifierState('CapsLock')
}

const goToLogin = async () => {
  // await store.dispatch('goToLogin')
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
