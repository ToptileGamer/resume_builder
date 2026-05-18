import {
  login,
  signup,
  requestPasswordRecovery,
  handleAuthCallback,
  getUser,
  AuthError,
  MissingIdentityError,
} from '@netlify/identity'

function showTab(name) {
  document.querySelectorAll('.tab-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.tab === name)
  )
  document.querySelectorAll('.tab-content').forEach(c => (c.style.display = 'none'))
  const tab = document.getElementById('tab-' + name)
  if (tab) tab.style.display = 'block'
}

function showAlert(type, msg) {
  const err = document.getElementById('alert-error')
  const ok = document.getElementById('alert-success')
  err.style.display = 'none'
  ok.style.display = 'none'
  if (type === 'error') {
    err.textContent = msg
    err.style.display = 'block'
  } else {
    ok.textContent = msg
    ok.style.display = 'block'
  }
}

async function init() {
  try {
    const result = await handleAuthCallback()
    if (result) {
      switch (result.type) {
        case 'confirmation':
          showAlert('success', 'Email confirmed! Redirecting…')
          setTimeout(() => (window.location.href = '/'), 1500)
          document.body.style.visibility = 'visible'
          return
        case 'oauth':
          window.location.href = '/'
          return
        case 'recovery':
          document.body.style.visibility = 'visible'
          showTab('recovery')
          showAlert('success', 'Enter your new password below.')
          return
      }
    }
  } catch (_) {
    // No auth callback in URL — normal page load
  }

  const user = await getUser()
  if (user) {
    window.location.href = '/'
    return
  }

  document.body.style.visibility = 'visible'
}

// Login
document.getElementById('login-form').addEventListener('submit', async e => {
  e.preventDefault()
  const btn = document.getElementById('login-btn')
  const email = document.getElementById('login-email').value
  const password = document.getElementById('login-password').value

  btn.disabled = true
  btn.textContent = 'Signing in…'

  try {
    await login(email, password)
    window.location.href = '/'
  } catch (err) {
    if (err instanceof MissingIdentityError) {
      showAlert('error', 'Authentication is not configured for this site.')
    } else if (err instanceof AuthError) {
      showAlert('error', err.status === 401 ? 'Invalid email or password.' : err.message)
    } else {
      showAlert('error', 'An unexpected error occurred. Please try again.')
    }
    btn.disabled = false
    btn.textContent = 'Sign In'
  }
})

// Signup
document.getElementById('signup-form').addEventListener('submit', async e => {
  e.preventDefault()
  const btn = document.getElementById('signup-btn')
  const name = document.getElementById('signup-name').value
  const email = document.getElementById('signup-email').value
  const password = document.getElementById('signup-password').value

  btn.disabled = true
  btn.textContent = 'Creating account…'

  try {
    const user = await signup(email, password, { full_name: name })
    if (user.emailVerified) {
      window.location.href = '/'
    } else {
      showAlert('success', 'Check your email to confirm your account, then sign in.')
      showTab('login')
    }
  } catch (err) {
    if (err instanceof MissingIdentityError) {
      showAlert('error', 'Authentication is not configured for this site.')
    } else if (err instanceof AuthError) {
      showAlert('error', err.status === 403 ? 'New signups are not allowed at this time.' : err.message)
    } else {
      showAlert('error', 'An unexpected error occurred. Please try again.')
    }
    btn.disabled = false
    btn.textContent = 'Create Account'
  }
})

// Password recovery
document.getElementById('recovery-form').addEventListener('submit', async e => {
  e.preventDefault()
  const btn = document.getElementById('recovery-btn')
  const email = document.getElementById('recovery-email').value

  btn.disabled = true
  btn.textContent = 'Sending…'

  try {
    await requestPasswordRecovery(email)
    showAlert('success', 'Password reset email sent. Check your inbox.')
  } catch (err) {
    showAlert('error', err instanceof AuthError ? err.message : 'Failed to send reset email.')
  } finally {
    btn.disabled = false
    btn.textContent = 'Send Reset Link'
  }
})

// Tab switching
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => showTab(btn.dataset.tab))
})
document.getElementById('forgot-link').addEventListener('click', e => {
  e.preventDefault()
  showTab('recovery')
})
document.getElementById('back-to-login').addEventListener('click', e => {
  e.preventDefault()
  showTab('login')
})

init()
