function Hero() {
  try {
    return (
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50" data-name="hero" data-file="components/Hero.js">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-[var(--text-primary)] mb-6">
              Master Your Exams with <span className="text-[var(--primary-color)]">Smart Practice</span>
            </h1>
            <p className="text-xl text-[var(--text-secondary)] mb-8">
              Comprehensive mock tests, intelligent analytics, and personalized feedback to help you ace competitive exams
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => window.location.href = 'signup.html'} className="btn-primary">
                Get Started Free
              </button>
              <button onClick={() => window.location.href = 'dashboard.html'} className="btn-secondary">
                View Demo
              </button>
            </div>
            <div className="mt-12 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-[var(--primary-color)]">50+</div>
                <div className="text-sm text-[var(--text-secondary)] mt-1">Mock Tests</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[var(--primary-color)]">10K+</div>
                <div className="text-sm text-[var(--text-secondary)] mt-1">Questions</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[var(--primary-color)]">98%</div>
                <div className="text-sm text-[var(--text-secondary)] mt-1">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error('Hero component error:', error);
    return null;
  }
}