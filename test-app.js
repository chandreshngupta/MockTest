function TestApp() {
  const [user, setUser] = React.useState(null);
  const [testData, setTestData] = React.useState(null);
  const [currentSection, setCurrentSection] = React.useState(0);
  const [currentQ, setCurrentQ] = React.useState(0);
  const [answers, setAnswers] = React.useState({});
  const [marked, setMarked] = React.useState({});
  const [sectionTime, setSectionTime] = React.useState(0);
  const [totalTime, setTotalTime] = React.useState(0);

  React.useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) return (window.location.href = 'login.html');
    setUser(currentUser);

    const params = new URLSearchParams(window.location.search);
    const testId = params.get('id');
    loadTestData(testId);
  }, []);

  const loadTestData = async (testId) => {
    const data = await getTestById(testId);
    setTestData(data);
    if (data.sections && data.sections.length > 0) {
      setSectionTime(data.sections[0].duration * 60);
      setTotalTime(data.totalDuration * 60);
    } else if (data.duration) {
      setSectionTime(data.duration * 60);
    }
  };

  React.useEffect(() => {
    if (sectionTime <= 0) return;
    const timer = setInterval(() => {
      setSectionTime((prev) => {
        if (prev <= 1) {
          handleNextSection();
          return 0;
        }
        return prev - 1;
      });
      if (testData?.sections) {
        setTotalTime((prev) => Math.max(0, prev - 1));
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [sectionTime, currentSection, testData]);

  const handleNextSection = () => {
    if (testData.sections && currentSection < testData.sections.length - 1) {
      setCurrentSection(currentSection + 1);
      setCurrentQ(0);
      setSectionTime(testData.sections[currentSection + 1].duration * 60);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    const allQuestions = testData.sections ? testData.sections.flatMap(s => s.questions) : testData.questions;
    const score = calculateScore(allQuestions, answers);
    const responseId = await saveTestResponse(user.userId, testData.id, answers, score, allQuestions);
    window.location.href = `analysis.html?responseId=${responseId}`;
  };

  const getQuestionIndex = () => {
    if (!testData.sections) return currentQ;
    let idx = 0;
    for (let i = 0; i < currentSection; i++) {
      idx += testData.sections[i].questions.length;
    }
    return idx + currentQ;
  };

  if (!testData) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  const questions = testData.sections ? testData.sections[currentSection].questions : testData.questions;
  const question = questions[currentQ];
  const globalIdx = getQuestionIndex();

  return (
    <div className="min-h-screen bg-white">
      <div className="flex justify-between items-center bg-blue-600 text-white p-3">
        <h1 className="text-lg font-semibold">{testData.title}</h1>
        <div className="flex gap-6 items-center">
          {testData.sections && <div className="text-sm">Section: {testData.sections[currentSection].subject}</div>}
          {testData.sections && (
            <div className="text-sm bg-blue-700 px-3 py-1 rounded">
              Total: {Math.floor(totalTime / 60)}:{(totalTime % 60).toString().padStart(2, '0')}
            </div>
          )}
          <div className="text-sm bg-blue-700 px-3 py-1 rounded">
            {testData.sections ? 'Section' : 'Time'}: {Math.floor(sectionTime / 60)}:{(sectionTime % 60).toString().padStart(2, '0')}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 p-4">
        <div className="col-span-3 border rounded-lg p-5 bg-gray-50">
          <h2 className="font-semibold mb-2">Q{currentQ + 1}. {question.text}</h2>
          {question.options.map((opt, i) => (
            <div key={i} className="flex items-center gap-2 mb-2">
              <input type="radio" checked={answers[globalIdx] === i} onChange={() => setAnswers({ ...answers, [globalIdx]: i })} />
              <label>{opt}</label>
            </div>
          ))}
          <div className="flex justify-between mt-6">
            <button className="bg-gray-200 px-4 py-2 rounded" onClick={() => setAnswers({ ...answers, [globalIdx]: null })}>Clear</button>
            <div className="flex gap-3">
              <button className="bg-yellow-500 text-white px-4 py-2 rounded" onClick={() => { setMarked({ ...marked, [globalIdx]: true }); if (currentQ < questions.length - 1) setCurrentQ(currentQ + 1); }}>Mark & Next</button>
              {currentQ < questions.length - 1 ? (
                <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={() => setCurrentQ(currentQ + 1)}>Save & Next</button>
              ) : (
                <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={testData.sections && currentSection < testData.sections.length - 1 ? handleNextSection : handleSubmit}>
                  {testData.sections && currentSection < testData.sections.length - 1 ? 'Next Section' : 'Submit'}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-3">Questions</h3>
          <div className="grid grid-cols-5 gap-2">
            {questions.map((_, idx) => {
              const gIdx = testData.sections ? idx + testData.sections.slice(0, currentSection).reduce((sum, s) => sum + s.questions.length, 0) : idx;
              const bg = marked[gIdx] ? 'bg-purple-500' : answers[gIdx] != null ? 'bg-green-500' : 'bg-gray-300';
              return <button key={idx} className={`${bg} text-white rounded-full w-8 h-8`} onClick={() => setCurrentQ(idx)}>{idx + 1}</button>;
            })}
          </div>
          {testData.sections && (
            <div className="mt-4 text-xs text-gray-600">
              <p>Section {currentSection + 1} of {testData.sections.length}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<TestApp />);