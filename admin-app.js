function AdminApp() {
  try {
    const [user, setUser] = React.useState(null);
    const [alert, setAlert] = React.useState(null);
    const [uploading, setUploading] = React.useState(false);
    const [questions, setQuestions] = React.useState([]);
    const [tests, setTests] = React.useState([]);
    const [showTestCreator, setShowTestCreator] = React.useState(false);
    const fileInputRef = React.useRef(null);

    React.useEffect(() => {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        window.location.href = 'login.html';
        return;
      }
      setUser(currentUser);
      loadQuestions();
      loadTests();
    }, []);

    const loadQuestions = async () => {
      try {
        const allQuestions = await trickleListObjects('question', 100, true);
        setQuestions(allQuestions.items || []);
      } catch (dbError) {
        console.warn('No questions found in database:', dbError);
        setQuestions([]);
      }
    };

    const loadTests = async () => {
      try {
        const allTests = await trickleListObjects('test', 50, true);
        setTests(allTests.items || []);
      } catch (dbError) {
        console.warn('No tests found in database:', dbError);
        setTests([]);
      }
    };

    const handleFileUpload = async (event) => {
      const file = event.target.files[0];
      if (!file) return;

      setUploading(true);
      try {
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            const result = await uploadQuestionsToDatabase(jsonData);
            setAlert({ type: 'success', message: `Successfully uploaded ${result.count} questions!` });
            loadQuestions();
          } catch (error) {
            setAlert({ type: 'error', message: 'Error processing file. Please check the format.' });
          } finally {
            setUploading(false);
          }
        };
        reader.readAsArrayBuffer(file);
      } catch (error) {
        setAlert({ type: 'error', message: 'Failed to upload questions' });
        setUploading(false);
      }
    };

    const handleCreateTest = () => {
      setShowTestCreator(true);
    };

    const handleTestCreated = () => {
      setShowTestCreator(false);
      loadTests();
      setAlert({ type: 'success', message: 'Test created successfully!' });
    };

    const downloadTemplate = () => {
      const template = [
        {
          examType: 'SSC CGL',
          subject: 'Mathematics',
          difficulty: 'Medium',
          question: 'What is 15 + 27?',
          optionA: '40',
          optionB: '42',
          optionC: '44',
          optionD: '45',
          correctAnswer: 'B'
        }
      ];
      
      const ws = XLSX.utils.json_to_sheet(template);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Questions');
      XLSX.writeFile(wb, 'question_template.xlsx');
    };

    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader user={user} />
        {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}
        
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Question Management</h1>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Upload Questions</h2>
            <p className="text-gray-600 mb-4">Upload an Excel file with questions. Download the template to see the required format.</p>
            
            <div className="flex gap-4">
              <button onClick={downloadTemplate} className="px-6 py-3 border-2 border-[var(--primary-color)] text-[var(--primary-color)] rounded-lg hover:bg-[var(--primary-color)] hover:text-white">
                Download Template
              </button>
              <input ref={fileInputRef} type="file" accept=".xlsx,.xls" onChange={handleFileUpload} className="hidden" />
              <button onClick={() => fileInputRef.current.click()} disabled={uploading} className="px-6 py-3 bg-[var(--primary-color)] text-white rounded-lg hover:opacity-90 disabled:opacity-50">
                {uploading ? 'Uploading...' : 'Upload Excel'}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Tests ({tests.length})</h2>
              <button onClick={handleCreateTest} className="px-6 py-3 bg-[var(--primary-color)] text-white rounded-lg hover:opacity-90">
                Create Test
              </button>
            </div>
            {tests.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No tests created yet</p>
            ) : (
              <div className="space-y-3">
                {tests.map((test) => (
                  <div key={test.objectId} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{test.objectData.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{test.objectData.description}</p>
                        <div className="flex gap-4 mt-2 text-sm text-gray-500">
                          <span>Exam: {test.objectData.examType}</span>
                          <span>Questions: {test.objectData.questions?.length || 0}</span>
                          <span>Duration: {test.objectData.duration} min</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {showTestCreator && (
            <TestCreator questions={questions} onClose={() => setShowTestCreator(false)} onTestCreated={handleTestCreated} />
          )}

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold mb-4">Question Bank ({questions.length})</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Exam Type</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Subject</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Difficulty</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Question</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {questions.map((q) => (
                    <tr key={q.objectId}>
                      <td className="px-4 py-3 text-sm">{q.objectData.examType}</td>
                      <td className="px-4 py-3 text-sm">{q.objectData.subject}</td>
                      <td className="px-4 py-3 text-sm">{q.objectData.difficulty}</td>
                      <td className="px-4 py-3 text-sm">{q.objectData.question}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('AdminApp error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<AdminApp />);