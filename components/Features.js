function Features() {
  try {
    const features = [
      {
        icon: 'clock',
        title: 'Timed Tests',
        description: 'Real exam environment with countdown timers and auto-submit functionality'
      },
      {
        icon: 'chart-bar',
        title: 'Performance Analytics',
        description: 'Detailed insights on accuracy, speed, and section-wise performance'
      },
      {
        icon: 'brain',
        title: 'AI Feedback',
        description: 'Intelligent recommendations on weak topics and improvement areas'
      },
      {
        icon: 'trophy',
        title: 'Leaderboard',
        description: 'Compare your performance with other test-takers nationwide'
      },
      {
        icon: 'file-text',
        title: 'Multiple Formats',
        description: 'MCQ, true/false, fill-in-the-blank, and short answer questions'
      },
      {
        icon: 'download',
        title: 'Export Results',
        description: 'Download your performance reports as PDF or Excel files'
      }
    ];

    return (
      <section id="features" className="py-20 bg-white" data-name="features" data-file="components/Features.js">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[var(--text-primary)] mb-4">Everything You Need to Succeed</h2>
            <p className="text-xl text-[var(--text-secondary)]">Powerful features designed for serious exam preparation</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="p-6 border border-[var(--border-color)] rounded-xl hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <div className={`icon-${feature.icon} text-2xl text-[var(--primary-color)]`}></div>
                </div>
                <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">{feature.title}</h3>
                <p className="text-[var(--text-secondary)]">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error('Features component error:', error);
    return null;
  }
}