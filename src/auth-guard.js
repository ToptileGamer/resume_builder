import { getUser, logout } from '@netlify/identity'

async function checkAuth() {
  const user = await getUser()

  if (!user) {
    window.location.href = '/login.html'
    return
  }

  const bar = document.createElement('div')
  bar.className = 'user-bar'
  bar.innerHTML = `
    <span class="user-bar__name">&#128100; ${user.user_metadata?.full_name || user.email}</span>
    <button class="user-bar__logout" id="__logout-btn">Sign Out</button>
  `
  document.body.insertBefore(bar, document.body.firstChild)
  document.body.style.paddingTop = '52px'
  document.body.style.visibility = 'visible'

  document.getElementById('__logout-btn').addEventListener('click', async () => {
    await logout()
    window.location.href = '/login.html'
  })
}

checkAuth()
