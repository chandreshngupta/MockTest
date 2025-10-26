function AnalysisApp() {
  try {
    const [responseData, setResponseData] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
      const params = new URLSearchParams(window.location.search);
      const responseId = params.get('responseId');
      if (responseId) {
        loadAnalysis(responseId);
      } else {
        const localData = localStorage.getItem('testResults');
        if (localData) {
          setResponseData(JSON.parse(localData));
        }
        setLoading(false);
      }
    }, []);

    const loadAnalysis = async (responseId) => {
      try {
        const currentUser = getCurrentUser();
        if (!currentUser) {
          window.location.href = 'login.html';
          return;
        }

        if (responseId) {
          try {
            const response = await trickleGetObject(`response:${currentUser.userId}`, responseId);
            if (response && response.objectData) {
              setResponseData(response.objectData);
            } else {
              const localData = localStorage.getItem('testResults');
              if (localData) setResponseData(JSON.parse(localData));
            }
          } catch (dbError) {
            console.warn('Could not load from database, using local storage:', dbError);
            const localData = localStorage.getItem('testResults');
            if (localData) setResponseData(JSON.parse(localData));
          }
        }
      } catch (error) {
        console.error('Error loading analysis:', error);
        const localData = localStorage.getItem('testResults');
        if (localData) setResponseData(JSON.parse(localData));
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

    if (!responseData) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">No analysis data available</p>
            <button onClick={() => window.location.href = 'dashboard.html'} className="mt-4 px-6 py-3 bg-[var(--primary-color)] text-white rounded-lg">
              Go to Dashboard
            </button>
          </div>
        </div>
      );
    }

    const totalQuestions = responseData.totalQuestions || 0;
    const correctAnswers = responseData.correctAnswers || 0;
    const score = isNaN(responseData.score) ? 0 : Number(responseData.score) || 0;
    const accuracy = isNaN(responseData.accuracy) ? 0 : Number(responseData.accuracy) || 0;
    const answeredCount = responseData.answers ? Object.keys(responseData.answers).filter(k => responseData.answers[k] !== null && responseData.answers[k] !== undefined).length : 0;

    const getGrade = (scoreValue) => {
      const numScore = Number(scoreValue) || 0;
      if (numScore >= 90) return { grade: 'A+', color: 'text-green-600', bg: 'bg-green-100' };
      if (numScore >= 80) return { grade: 'A', color: 'text-green-500', bg: 'bg-green-50' };
      if (numScore >= 70) return { grade: 'B', color: 'text-blue-500', bg: 'bg-blue-50' };
      if (numScore >= 60) return { grade: 'C', color: 'text-yellow-500', bg: 'bg-yellow-50' };
      return { grade: 'F', color: 'text-red-500', bg: 'bg-red-50' };
    };

    const gradeInfo = getGrade(score);

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className={`w-24 h-24 ${gradeInfo.bg} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <div className="icon-check-circle text-5xl text-[var(--accent-color)]"></div>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Test Analysis</h1>
              <p className="text-gray-600">Detailed performance breakdown</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className={`${gradeInfo.bg} rounded-xl p-6 text-center`}>
                <p className="text-gray-600 text-sm mb-2">Your Score</p>
                <div className={`text-4xl font-bold ${gradeInfo.color}`}>{score.toFixed(1)}%</div>
                <div className={`text-xl font-semibold ${gradeInfo.color} mt-2`}>Grade: {gradeInfo.grade}</div>
              </div>
              <div className="bg-blue-50 rounded-xl p-6 text-center">
                <p className="text-gray-600 text-sm mb-2">Questions Answered</p>
                <div className="text-4xl font-bold text-blue-600">{answeredCount}</div>
                <p className="text-sm text-gray-500 mt-2">out of {totalQuestions}</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-6 text-center">
                <p className="text-gray-600 text-sm mb-2">Correct Answers</p>
                <div className="text-4xl font-bold text-purple-600">{correctAnswers}</div>
                <p className="text-sm text-gray-500 mt-2">Accuracy: {accuracy.toFixed(1)}%</p>
              </div>
            </div>

            <AnalysisChart responseData={responseData} />

            <div className="mt-8 bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Questions:</span>
                  <span className="font-semibold text-gray-900">{totalQuestions}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Correct Answers:</span>
                  <span className="font-semibold text-green-600">{correctAnswers}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Wrong Answers:</span>
                  <span className="font-semibold text-red-600">{totalQuestions - correctAnswers}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Submitted At:</span>
                  <span className="font-semibold text-gray-900">{responseData.submittedAt ? new Date(responseData.submittedAt).toLocaleString() : 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button onClick={() => window.location.href = 'dashboard.html'} className="flex-1 py-3 bg-[var(--primary-color)] text-white rounded-lg hover:opacity-90">
                Back to Dashboard
              </button>
              <button onClick={() => window.location.href = 'results.html'} className="flex-1 py-3 border-2 border-[var(--primary-color)] text-[var(--primary-color)] rounded-lg hover:bg-[var(--primary-color)] hover:text-white">
                View All Results
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('AnalysisApp error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<AnalysisApp />);