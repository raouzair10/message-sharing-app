<template>
  <div class="message-list">
    <div class="heading">
      <h2>Messages</h2>
    </div>
    <el-table :data="localMessages">
      <el-table-column v-if="user.level == 0" width="60">
        <template #default="scope">
          <el-button type="danger" size="small" @click="deleteMessage(scope.row._id)">x</el-button>
        </template>
      </el-table-column>
      <el-table-column label="Messages">
        <template #default="scope">
          <div 
            v-if="!scope.row.isEditing || user.level !== 0" 
            @click="user.level === 0 && startEditing(scope.row)"
          >
            {{ scope.row.content }}
          </div>
          <el-input
            v-else
            ref="inputRef"
            v-model="scope.row.content"
            @keyup.enter="updateMessage(scope.row)"
            @blur="updateMessage(scope.row)"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="level" label="Level">
        <template #default="scope">
          <template v-if="user.level === 0">
            <el-select v-model="scope.row.level" @change="updateMessage(scope.row)">
              <el-option label="1" value="1"></el-option>
              <el-option label="2" value="2"></el-option>
              <el-option label="3" value="3"></el-option>
            </el-select>
          </template>
          <template v-else>
            {{ scope.row.level }}
          </template>
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
const messages = computed(() => store.getters.messages)

const localMessages = computed(() => {
  return messages.value.map(message => ({ ...message, isEditing: false }))
})

const inputRef = ref(null)

const startEditing = (message) => {
  message.isEditing = true
  nextTick(() => {
    if (inputRef.value) {
      inputRef.value.focus()
    }
  })
}

onMounted(async () => {
  if (user.value) {
    await store.dispatch('fetchMessages', user.value.level)
  } else {
    ElMessage.error('User not authenticated')
    router.push('/login')
  }
})

const formatDate = (dateStr) => {
  return format(new Date(dateStr), 'PPpp')
}

const deleteMessage = async (id) => {
  const result = await store.dispatch('deleteMessage', id)
  if (result.success)
    ElMessage.success('Message deleted successfully')
}

const updateMessage = async (message) => {
  message.updatedAt = new Date()
  const result = await store.dispatch('updateMessage', message)
  if (result.success) {
    ElMessage.success('Message updated successfully')
    message.isEditing = false
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

.message-list {
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
