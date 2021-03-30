const baseURL = '/api'

const ajax = async (method, url, body = null) => {
  let resp
  try {
    resp = await fetch(baseURL + url, {
      method: method,
      headers: {
        'content-type': 'application/json; charset=utf-8',
        token: token
      },
      body: body ? JSON.stringify(body) : null
    })
  } catch (err) {
    throw err
  }
  if (resp.ok) {
    let data
    try {
      data = await resp.json()
    } catch {
      data = await resp.text()
    } finally {
      return {
        status: resp.status,
        data: data
      }
    }
  } else {
    const err = await resp.text()
    throw new Error(resp.status + err)
  }
}

const http = {
  get: (url) => ajax('GET', url),
  post: (url, body = null) => ajax('POST', url, body),
  put: (url, body = null) => ajax('PUT', url, body),
  delete: (url, body = null) => ajax('DELETE', url, body)
}