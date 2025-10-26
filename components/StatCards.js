function StatCards({ stats }) {
  try {
    const cards = [
      {
        icon: 'file-text',
        label: 'Tests Taken',
        value: stats?.testsTaken || 0,
        color: 'bg-blue-100 text-[var(--primary-color)]',
        delta: stats?.testsTakenDelta || 0
      },
      {
        icon: 'trending-up',
        label: 'Average Score',
        value: stats?.avgScore ? `${stats.avgScore}%` : '0%',
        color: 'bg-green-100 text-[var(--accent-color)]',
        delta: stats?.avgScoreDelta || 0
      },
      {
        icon: 'clock',
        label: 'Study Time',
        value: stats?.studyTime || '0h',
        color: 'bg-purple-100 text-[var(--secondary-color)]',
        delta: stats?.studyTimeDelta || 0
      },
      {
        icon: 'trophy',
        label: 'Rank',
        value: stats?.rank || '-',
        color: 'bg-yellow-100 text-yellow-600',
        delta: stats?.rankDelta || 0
      }
    ];

    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">{card.label}</p>
                <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                <div className="text-sm text-gray-400 mt-1">
                  {card.delta > 0 ? (
                    <span className="text-green-600">▲ {card.delta}%</span>
                  ) : card.delta < 0 ? (
                    <span className="text-red-600">▼ {Math.abs(card.delta)}%</span>
                  ) : (
                    <span className="text-gray-400">No change</span>
                  )}
                </div>
              </div>
              <div className={`w-14 h-14 rounded-lg flex items-center justify-center ${card.color}`}>
                <div className={`icon-${card.icon} text-2xl`}></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  } catch (error) {
    console.error('StatCards error:', error);
    return null;
  }
}