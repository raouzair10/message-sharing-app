import { createStore } from 'vuex'
import axios from 'axios'

const apiUrl = 'http://localhost:5000/api'

const store = createStore({
  state: {
    user: JSON.parse(sessionStorage.getItem('user')) || null,
    messages: [],
  },
  mutations: {
    setUser(state, user) {
      state.user = user
      sessionStorage.setItem('user', JSON.stringify(user))
    },
    clearUser(state) {
      state.user = null
      state.messages = []
      sessionStorage.removeItem('user')
    },
    setMessages(state, messages) {
      state.messages = messages
    },
    addMessage(state, message) {
      state.messages.push(message)
    },
    updateMessage(state, updatedMessage) {
      const index = state.messages.findIndex(message => message._id === updatedMessage._id)
      if (index !== -1) {
        state.messages.splice(index, 1, updatedMessage)
      }
    },
    deleteMessage(state, messageId) {
      state.messages = state.messages.filter(message => message._id !== messageId)
    }
  },
  actions: {
    async login({ commit }, { username, password }) {
      try {
        const response = await axios.post(`${apiUrl}/users/login`, {username, password})
        const user = response.data
        commit('setUser', user)
        return { success: true }
      } catch (error) {
        return { success: false, message: error.response.data.message }
      }
    },
    async signup({ commit }, { username, password, level }) {
      try {
        await axios.post(`${apiUrl}/users/signup`, {username, password, level})
        return { success: true }
      } catch (error) {
        return { success: false, message: error.response.data.message }
      }
    },
    async logout({ commit }) {
      try {
        commit('clearUser')
        return { success: true }
      } catch (error) {
        return { success: false }
      }
    },
    async fetchMessages({ commit }, level) {
      try {
        const response = await axios.get(`${apiUrl}/messages`, {
          params: { level },
        });
        const messages = response.data
        commit('setMessages', messages)
        return { success: true }
      } catch (error) {
        console.log(error)
        return { success: false }
      }
    },
    async addMessage({ commit }, newMessage) {
      try {
        const response = await axios.post(`${apiUrl}/messages`, newMessage)
        commit('addMessage', response.data)
        return { success: true }
      } catch (error) {
        console.log(error)
        return { success: false }
      }
    },
    async deleteMessage({ commit }, messageId) {
      try {
        await axios.delete(`${apiUrl}/messages/${messageId}`)
        commit('deleteMessage', messageId)
        return { success: true }
      } catch (error) {
        console.log(error)
        return { success: false }
      }
    },
    async updateMessage({ commit }, message) {
      try {
        const response = await axios.put(`${apiUrl}/messages/${message._id}`, {message})
        commit('updateMessage', response.data)
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
    messages: state => state.messages,
  },
})

export default store
