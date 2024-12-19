<template>
  <div class="sidebar">
    <h1 v-if="user">{{ user.username }}</h1>
    <el-button v-if="user" type="primary" @click="handleLogout">Logout</el-button>
    <h2>Add New Task</h2>
    <el-input v-model="newTaskTitle" placeholder="Task Title"></el-input>
    <el-select v-model="newTaskPriority" placeholder="Select Priority">
      <el-option label="High" value="High"></el-option>
      <el-option label="Medium" value="Medium"></el-option>
      <el-option label="Low" value="Low"></el-option>
    </el-select>
    <el-button type="primary" @click="addTask">Add Task</el-button>
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
const newTaskTitle = ref('')
const newTaskPriority = ref('')

const handleLogout = async () => {
  const result = await store.dispatch('logout')
  if (result.success) {
    ElMessage.success('Logged out successfully')
    router.push('/login')
  }
}

const addTask = async () => {
  try {
    if (newTaskTitle.value && newTaskPriority.value) {
      const newTask = {
        title: newTaskTitle.value,
        priority: newTaskPriority.value,
        completed: false,
        userId: user.value._id,
      }
      const result = await store.dispatch('addTodo', newTask)
      if (result.success) {
        ElMessage.success('Task added successfully')
        newTaskTitle.value = ''
        newTaskPriority.value = ''
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
  position: fixed;
  height: 100vh;
  width: 250px;
  padding: 20px;
  background-color: #142926;
  display: flex;
  flex-direction: column;
  gap: 15px;
  color: #fff;
}
</style>
