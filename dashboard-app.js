function DashboardApp() {
  try {
    const [user, setUser] = React.useState(null);
    const [tests, setTests] = React.useState([]);
    const [stats, setStats] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
      const init = async () => {
        await initializeDatabase();
        const currentUser = getCurrentUser();
        if (!currentUser) {
          window.location.href = 'login.html';
          return;
        }
        setUser(currentUser);
        loadDashboardData(currentUser.userId);
      };
      init();
    }, []);

    const loadDashboardData = async (userId) => {
      try {
        let testList = [];
        let userStats = {
          testsTaken: 0,
          avgScore: 0,
          studyTime: '0h',
          rank: '-',
          recentScores: [0, 0, 0, 0, 0]
        };

        try {
          testList = await getAvailableTests();
        } catch (testError) {
          console.warn('Could not load tests:', testError);
        }

        try {
          userStats = await getUserStats(userId);
        } catch (statsError) {
          console.warn('Could not load user stats:', statsError);
        }

        setTests(testList || []);
        setStats(userStats);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setTests([]);
        setStats({
          testsTaken: 0,
          avgScore: 0,
          studyTime: '0h',
          rank: '-',
          recentScores: [0, 0, 0, 0, 0]
        });
      } finally {
        setLoading(false);
      }
    };

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="icon-loader text-4xl text-[var(--primary-color)] animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader user={user} />
        <div className="container mx-auto px-4 py-8">
          <StatCards stats={stats} />
          <div className="mt-8 grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <TestList tests={tests} />
            </div>
            <div>
              <PerformanceChart stats={stats} />
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('DashboardApp error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<DashboardApp />);