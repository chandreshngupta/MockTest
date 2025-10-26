function ResultApp() {
  const [results, setResults] = useState(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("testResults"));
    if (data) setResults(data);
  }, []);

  if (!results) return <div className="p-10 text-center text-lg">Loading results...</div>;

  const totalQuestions = results.questions.length;
  const correct = results.questions.filter(q => q.isCorrect).length;
  const incorrect = totalQuestions - correct;
  const accuracy = ((correct / totalQuestions) * 100).toFixed(1);

  const timeSpent = results.questions.reduce((acc, q) => acc + (q.time || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow">
        <h1 className="text-3xl font-bold text-center mb-6">Test Summary</h1>

        <StatCards
          stats={[
            { label: "Total Questions", value: totalQuestions },
            { label: "Correct", value: correct },
            { label: "Incorrect", value: incorrect },
            { label: "Accuracy", value: `${accuracy}%` },
            { label: "Time Spent", value: `${(timeSpent / 60).toFixed(2)} mins` },
            { label: "Score", value: `${results.score}/${totalQuestions}` },
          ]}
        />

        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-2">Performance Overview</h2>
          <PerformanceChart data={results.questions} />
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={() => (window.location.href = "analysis.html")}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
          >
            View Detailed Analysis
          </button>
        </div>
      </div>
    </div>
  );
}


