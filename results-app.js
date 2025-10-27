function ResultsApp() {
  try {
    const [user, setUser] = React.useState(null);
    const [results, setResults] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        window.location.href = 'login.html';
        return;
      }
      setUser(currentUser);
      loadResults(currentUser.userId);
    }, []);

    const loadResults = async (userId) => {
      try {
        const responses = await trickleListObjects(`response:${userId}`, 50, true);
        setResults(responses.items || []);
      } catch (dbError) {
        console.warn('Database query failed, no results available:', dbError);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="icon-loader text-4xl text-[var(--primary-color)] animate-spin"></div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader user={user} />
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Test Results</h1>
          {results.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center">
              <div className="icon-file-text text-6xl text-gray-300 mx-auto mb-4"></div>
              <p className="text-gray-500 text-lg">No test results yet</p>
              <button onClick={() => window.location.href = 'dashboard.html'} className="mt-6 px-6 py-3 bg-[var(--primary-color)] text-white rounded-lg">
                Take a Test
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((result) => (
                <div key={result.objectId} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Test #{result.objectData.testId}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Submitted: {new Date(result.objectData.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-[var(--primary-color)]">{result.objectData.score}%</div>
                      <p className="text-sm text-gray-500">Score</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('ResultsApp error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<ResultsApp />);