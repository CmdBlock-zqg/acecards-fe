const http = axios.create({
  baseURL: 'http://localhost:3001/api'
})

http.interceptors.request.use((config) => {
  config.headers = { token: window.localStorage['token'] }
  return config
})

export default http