// Minimal localStorage-backed auth shim (no external backend required).
// This replaces the previous trickle-based implementation so the app works from a local HTTP server.
// Exposes: signupUser(name, email, password), loginUser(email, password), getCurrentUser(), logoutUser()

function _readUsers() {
  try {
    const raw = localStorage.getItem('mock_users');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function _writeUsers(users) {
  localStorage.setItem('mock_users', JSON.stringify(users));
}

async function signupUser(name, email, password) {
  const users = _readUsers();
  if (users.find(u => u.email === email)) {
    return { success: false, message: 'Email already registered' };
  }

  const id = Date.now().toString();
  const user = { id, name, email, password, role: 'student', createdAt: new Date().toISOString() };
  users.push(user);
  _writeUsers(users);

  localStorage.setItem('currentUser', JSON.stringify({ userId: user.id, name: user.name, email: user.email, role: user.role }));
  return { success: true, user };
}

async function loginUser(email, password) {
  const users = _readUsers();
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return { success: false, message: 'Invalid email or password' };

  localStorage.setItem('currentUser', JSON.stringify({ userId: user.id, name: user.name, email: user.email, role: user.role }));
  return { success: true, user };
}

function getCurrentUser() {
  const userStr = localStorage.getItem('currentUser');
  return userStr ? JSON.parse(userStr) : null;
}

function logoutUser() {
  localStorage.removeItem('currentUser');
  try { window.location.href = 'index.html'; } catch (e) {}
}

// Make available globally for non-module scripts
window.signupUser = signupUser;
window.loginUser = loginUser;
window.getCurrentUser = getCurrentUser;
window.logoutUser = logoutUser;