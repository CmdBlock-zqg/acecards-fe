this.addEventListener('install', (e) => {
  console.log('ServiceWorker installed.')
})

this.addEventListener('activated', (e) => {
  Notification.requestPermission((status) => {
    if (Notification.permission !== status)  {
      Notification.permission = status
    }
  })
})

setInterval(async () => {

}, 30000)