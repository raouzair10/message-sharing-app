<template>
  <div class="sidebar">
    <h1 v-if="user">{{ user.username }}</h1>
    <el-button v-if="user" type="danger" @click="handleLogout">Logout</el-button>
    <div class="newMessage" v-if="user.level == 0">
      <h2>Add New Message</h2>
      <el-input v-model="newMessageContent" placeholder="Add message here"></el-input>
      <el-select v-model="newMessageLevel" placeholder="Select Level">
        <el-option label="1" value="1"></el-option>
        <el-option label="2" value="2"></el-option>
        <el-option label="3" value="3"></el-option>
      </el-select>
      <el-button type="primary" @click="addMessage">Add Message</el-button>
      <h2>Add New User</h2>
      <el-input v-model="newUsername" placeholder="Enter Username"></el-input>
      <el-input v-model="newPassword" placeholder="Enter Password"></el-input>
      <el-select v-model="newUserLevel" placeholder="Select Level">
        <el-option label="1" value="1"></el-option>
        <el-option label="2" value="2"></el-option>
        <el-option label="3" value="3"></el-option>
      </el-select>
      <el-button type="primary" @click="addUser">Add User</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const store = useStore()
const router = useRouter()

const user = computed(() => store.getters.user)
const newMessageContent = ref('')
const newMessageLevel = ref('')
const newUsername = ref('')
const newPassword = ref('')
const newUserLevel = ref('')

const handleLogout = async () => {
  const result = await store.dispatch('logout')
  if (result.success) {
    ElMessage.success('Logged out successfully')
    router.push('/login')
  }
}

const addMessage = async () => {
  try {
    if (newMessageContent.value && newMessageLevel.value) {
      const newMessage = {
        content: newMessageContent.value,
        level: newMessageLevel.value,
      }
      const result = await store.dispatch('addMessage', newMessage)
      if (result.success) {
        ElMessage.success('Message added successfully')
        newMessageContent.value = ''
        newMessageLevel.value = ''
      }
    } else {
      ElMessage.error('Please fill in all fields')
    }
  } catch (error) {
    ElMessage.error(error.message)
  }
}

const addUser = async () => {
  try {
    if (newUsername.value && newUserLevel.value && newPassword.value) {
      const newUser = {
        username: newUsername.value,
        password: newPassword.value,
        level: newUserLevel.value
      }
      const result = await store.dispatch('signup', newUser)
      if (result.success) {
        ElMessage.success('User added successfully')
        newUsername.value = ''
        newUserLevel.value = ''
        newPassword.value = ''
      }
    } else {
      ElMessage.error('Please fill in all fields')
    }
  } catch (error) {
    ElMessage.error(error.message)
  }
}
</script>

<style scoped>
.sidebar {
  position: absolute;
  height: 100vh;
  width: 250px;
  padding: 20px;
  background-color: #142926;
  display: flex;
  flex-direction: column;
  gap: 15px;
  color: #fff;
}

.newMessage {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
</style>
