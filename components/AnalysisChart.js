function AnalysisChart({ responseData }) {
  try {
    const chartRef = React.useRef(null);
    const chartInstance = React.useRef(null);

    React.useEffect(() => {
      if (chartRef.current && responseData) {
        const ctx = chartRef.current.getContext('2d');
        
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }

        const correctCount = responseData.correctAnswers;
        const wrongCount = responseData.totalQuestions - responseData.correctAnswers;
        const unanswered = responseData.totalQuestions - Object.keys(responseData.answers || {}).length;

        chartInstance.current = new ChartJS(ctx, {
          type: 'doughnut',
          data: {
            labels: ['Correct', 'Wrong', 'Unanswered'],
            datasets: [{
              data: [correctCount, wrongCount, unanswered],
              backgroundColor: ['#10b981', '#ef4444', '#94a3b8'],
              borderWidth: 0
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom',
                labels: {
                  padding: 20,
                  font: { size: 14 }
                }
              }
            }
          }
        });
      }

      return () => {
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }
      };
    }, [responseData]);

    const accuracy = responseData && responseData.totalQuestions ? Math.round((responseData.correctAnswers / responseData.totalQuestions) * 100) : 0;
    const avgTimePerQ = responseData && responseData.timeTaken ? Math.round((responseData.timeTaken / responseData.totalQuestions) * 10) / 10 : 0;

    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Answer Distribution</h3>
        <div style={{ height: '260px' }}>
          <canvas ref={chartRef}></canvas>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-sm text-gray-500">Accuracy</div>
            <div className="text-2xl font-bold text-gray-900">{accuracy}%</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-500">Avg Time / Q</div>
            <div className="text-2xl font-bold text-gray-900">{avgTimePerQ}s</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-500">Total Questions</div>
            <div className="text-2xl font-bold text-gray-900">{responseData?.totalQuestions || 0}</div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('AnalysisChart error:', error);
    return null;
  }
}