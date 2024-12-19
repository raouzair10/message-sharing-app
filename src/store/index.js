import { createStore } from 'vuex'
import axios from 'axios'

const apiUrl = 'http://localhost:3000'

const store = createStore({
  state: {
    user: JSON.parse(sessionStorage.getItem('user')) || null,
    todos: [],
  },
  mutations: {
    setUser(state, user) {
      state.user = user
      sessionStorage.setItem('user', JSON.stringify(user))
    },
    clearUser(state) {
      state.user = null
      state.todos = []
      sessionStorage.removeItem('user')
    },
    setTodos(state, todos) {
      state.todos = todos
    },
    addTodo(state, todo) {
      state.todos.push(todo)
    },
    updateTodo(state, updatedTodo) {
      const index = state.todos.findIndex(todo => todo._id === updatedTodo._id)
      if (index !== -1) {
        state.todos.splice(index, 1, updatedTodo)
      }
    },
    deleteTodo(state, todoId) {
      state.todos = state.todos.filter(todo => todo._id !== todoId)
    }
  },
  actions: {
    async login({ commit }, { username, password }) {
      try {
        const response = await axios.post(apiUrl, { transition: 'LOGIN', data: {username, password} })
        const user = response.data
        commit('setUser', user)
        return { success: true }
      } catch (error) {
        return { success: false, message: error.response.data.message }
      }
    },
    async signup({ commit }, { username, password }) {
      try {
        const response = await axios.post(apiUrl, { transition: 'SIGNUP', data: {username, password} })
        const user = response.data
        commit('setUser', user)
        return { success: true }
      } catch (error) {
        return { success: false, message: error.response.data.message }
      }
    },
    async logout({ commit }) {
      try {
        await axios.post(apiUrl, { transition: 'LOGOUT', data: {} })
        commit('clearUser')
        return { success: true }
      } catch (error) {
        return { success: false }
      }
    },
    async goToSignup() {
      try {
        await axios.post(apiUrl, { transition: 'GO_TO_SIGNUP', data: {} })
        return { success: true }
      } catch (error) {
        console.log(error)
        return { success: false }
      }
    },
    async goToLogin() {
      try {
        await axios.post(apiUrl, { transition: 'GO_TO_LOGIN', data: {} })
        return { success: true }
      } catch (error) {
        console.log(error)
        return { success: false }
      }
    },
    async fetchTodos({ commit }, userId) {
      try {
        const response = await axios.post(apiUrl, { transition: 'FETCH_TODOS', data: {userId} })
        const todos = response.data
        commit('setTodos', todos)
        return { success: true }
      } catch (error) {
        console.log(error)
        return { success: false }
      }
    },
    async addTodo({ commit }, newTodo) {
      try {
        const response = await axios.post(apiUrl, { transition: 'ADD_TODO', data: {newTodo} })
        console.log(response.data)
        commit('addTodo', response.data)
        return { success: true }
      } catch (error) {
        console.log(error)
        return { success: false }
      }
    },
    async deleteTodo({ commit }, todoId) {
      try {
        await axios.post(apiUrl, { transition: 'DELETE_TODO', data: {todoId} })
        commit('deleteTodo', todoId)
        return { success: true }
      } catch (error) {
        console.log(error)
        return { success: false }
      }
    },
    async updateTodo({ commit }, todo) {
      try {
        const response = await axios.post(apiUrl, { transition: 'UPDATE_TODO', data: {todo} })
        console.log(response.data)
        commit('updateTodo', response.data)
        return { success: true }
      } catch (error) {
        console.log(error)
        return { success: false }
      }
    }
  },
  getters: {
    isAuthenticated: state => !!state.user,
    user: state => state.user,
    todos: state => state.todos,
  },
})

export default store
