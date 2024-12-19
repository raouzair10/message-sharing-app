<template>
  <div class="todo-list">
    <div class="heading">
      <h2>My Tasks</h2>
    </div>
    <el-table :data="localTodos">
      <el-table-column width="60">
        <template #default="scope">
          <el-button type="danger" size="small" @click="deleteTodo(scope.row._id)">x</el-button>
        </template>
      </el-table-column>
      <el-table-column label="Tasks">
        <template #default="scope">
          <div v-if="!scope.row.isEditing" @click="startEditing(scope.row)">{{ scope.row.title }}</div>
          <el-input
            v-else
            ref="inputRef"
            v-model="scope.row.title"
            @keyup.enter="updateTask(scope.row)"
            @blur="updateTask(scope.row)"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column label="Completed" width="100">
        <template #default="scope">
          <el-checkbox v-model="scope.row.completed" size="large" @change="updateTask(scope.row)"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column prop="priority" label="Priority">
        <template #default="scope">
          <el-select v-model="scope.row.priority" @change="updateTask(scope.row)">
            <el-option label="High" value="High"></el-option>
            <el-option label="Medium" value="Medium"></el-option>
            <el-option label="Low" value="Low"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="Created At">
        <template #default="scope">
          {{ formatDate(scope.row.createdAt) }}
        </template>
      </el-table-column>
      <el-table-column prop="updatedAt" label="Updated At">
        <template #default="scope">
          {{ formatDate(scope.row.updatedAt) }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, nextTick } from 'vue'
import { useStore } from 'vuex'
import { format } from 'date-fns'
import { ElMessage } from 'element-plus'

const store = useStore()

const user = computed(() => store.getters.user)
const todos = computed(() => store.getters.todos)

const localTodos = computed(() => {
  return todos.value.map(todo => ({ ...todo, isEditing: false }))
})

const inputRef = ref(null)

const startEditing = (todo) => {
  todo.isEditing = true
  nextTick(() => {
    if (inputRef.value) {
      inputRef.value.focus()
    }
  })
}

onMounted(async () => {
  if (user.value) {
    await store.dispatch('fetchTodos', user.value._id)
  } else {
    ElMessage.error('User not authenticated')
    router.push('/login')
  }
})

const formatDate = (dateStr) => {
  return format(new Date(dateStr), 'PPpp')
}

const deleteTodo = async (id) => {
  const result = await store.dispatch('deleteTodo', id)
  if (result.success)
    ElMessage.success('Task deleted successfully')
}

const updateTask = async (todo) => {
  todo.updatedAt = new Date()
  const result = await store.dispatch('updateTodo', todo)
  if (result.success) {
    ElMessage.success('Task updated successfully')
    todo.isEditing = false
  }
}

</script>

<style scoped>
.heading {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  margin-bottom: 20px;
  font-family: 'Roboto', sans-serif;
  color: #fff;
}

.todo-list {
  margin-left: 290px;
  width: 70%;
  height: 100%;
  flex-grow: 1;
  padding: 20px;
  background-color: #223B46;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  min-height: 100vh;
  color: #fff;
}

.el-table {
  font-family: 'Roboto', sans-serif;
  background-color: #223B46;
  color: #fff;
}

:deep(.el-table .el-table__row) {
  background-color: #223B46;
  color: #fff;
}

:deep(.el-table__row:hover) {
  color: #000;
}

:deep(.el-table .el-table__row .el-table__cell) {
  background-color: inherit;
}

.el-button {
  background-color: #ff4d4f;
  border-color: #ff4d4f;
  color: #fff;
}

.el-button:hover {
  background-color: #d9363e;
  border-color: #d9363e;
}

.el-checkbox .el-checkbox__label {
  font-family: 'Roboto', sans-serif;
  color: #fff;
}

.el-select .el-input__inner {
  font-family: 'Roboto', sans-serif;
  color: #fff;
  background-color: #555;
  border-color: #666;
}

.el-select .el-input__inner:hover {
  border-color: #888;
}

.el-input__inner {
  color: #fff;
  background-color: #555;
  border-color: #666;
}

.el-input__inner:hover {
  border-color: #888;
}
</style>
