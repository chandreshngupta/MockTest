function SignupApp() {
  try {
    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [alert, setAlert] = React.useState(null);
    const [loading, setLoading] = React.useState(false);

    const handleSignup = async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
        const result = await signupUser(name, email, password);
        if (result.success) {
          setAlert({ type: 'success', message: 'Account created! Redirecting...' });
          setTimeout(() => {
            window.location.href = 'dashboard.html';
          }, 1500);
        } else {
          setAlert({ type: 'error', message: result.message });
        }
      } catch (error) {
        setAlert({ type: 'error', message: 'Signup failed. Please try again.' });
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[var(--primary-color)] rounded-xl flex items-center justify-center mx-auto mb-4">
              <div className="icon-graduation-cap text-3xl text-white"></div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
            <p className="text-gray-600 mt-2">Start your exam preparation journey today</p>
          </div>
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent outline-none" placeholder="John Doe" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent outline-none" placeholder="your@email.com" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent outline-none" placeholder="••••••••" required minLength="6" />
            </div>
            <button type="submit" disabled={loading} className="w-full py-3 bg-[var(--primary-color)] text-white rounded-lg font-medium hover:opacity-90 transition-all disabled:opacity-50">
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>
          <p className="text-center text-gray-600 mt-6">
            Already have an account? <a href="login.html" className="text-[var(--primary-color)] font-medium hover:underline">Login</a>
          </p>
        </div>
      </div>
    );
  } catch (error) {
    console.error('SignupApp error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<SignupApp />);