function Header() {
  try {
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

    const navigateToPage = (page) => {
      window.location.href = page;
    };

    return (
      <header className="bg-white border-b border-[var(--border-color)] sticky top-0 z-50" data-name="header" data-file="components/Header.js">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigateToPage('index.html')}>
              <div className="w-10 h-10 bg-[var(--primary-color)] rounded-lg flex items-center justify-center">
                <div className="icon-graduation-cap text-xl text-white"></div>
              </div>
              <span className="text-2xl font-bold text-[var(--primary-color)]">ExamPro</span>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-colors">Features</a>
              <a href="#exams" className="text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-colors">Exams</a>
              <button onClick={() => navigateToPage('login.html')} className="text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-colors">Login</button>
              <button onClick={() => navigateToPage('signup.html')} className="btn-primary">Sign Up</button>
            </nav>

            <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <div className={`icon-${mobileMenuOpen ? 'x' : 'menu'} text-2xl text-[var(--text-primary)]`}></div>
            </button>
          </div>

          {mobileMenuOpen && (
            <nav className="md:hidden mt-4 pb-4 space-y-4">
              <a href="#features" className="block text-[var(--text-secondary)] hover:text-[var(--primary-color)]">Features</a>
              <a href="#exams" className="block text-[var(--text-secondary)] hover:text-[var(--primary-color)]">Exams</a>
              <button onClick={() => navigateToPage('login.html')} className="block w-full text-left text-[var(--text-secondary)] hover:text-[var(--primary-color)]">Login</button>
              <button onClick={() => navigateToPage('signup.html')} className="btn-primary w-full">Sign Up</button>
            </nav>
          )}
        </div>
      </header>
    );
  } catch (error) {
    console.error('Header component error:', error);
    return null;
  }
}