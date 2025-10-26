function TestCreator({ questions, onClose, onTestCreated }) {
  try {
    const [testTitle, setTestTitle] = React.useState('');
    const [examType, setExamType] = React.useState('');
    const [totalDuration, setTotalDuration] = React.useState(60);
    const [sections, setSections] = React.useState([
      { subject: '', duration: 20, questionCount: 10 }
    ]);
    const [creating, setCreating] = React.useState(false);

    const examTypes = [...new Set(questions.map(q => q.objectData.examType))];
    const subjects = [...new Set(questions.map(q => q.objectData.subject))];

    const addSection = () => {
      setSections([...sections, { subject: '', duration: 10, questionCount: 5 }]);
    };

    const removeSection = (index) => {
      if (sections.length > 1) {
        setSections(sections.filter((_, i) => i !== index));
      }
    };

    const updateSection = (index, field, value) => {
      const updated = [...sections];
      updated[index][field] = value;
      setSections(updated);
    };

    const handleCreate = async () => {
      if (!testTitle || !examType || sections.some(s => !s.subject)) {
        alert('Please fill all fields');
        return;
      }

      const totalSectionDuration = sections.reduce((sum, s) => sum + Number(s.duration), 0);
      if (totalSectionDuration !== Number(totalDuration)) {
        alert(`Section durations (${totalSectionDuration} min) must equal total duration (${totalDuration} min)`);
        return;
      }

      setCreating(true);
      try {
        const testSections = [];
        
        for (const section of sections) {
          const subjectQuestions = questions.filter(
            q => q.objectData.examType === examType && q.objectData.subject === section.subject
          );
          
          if (subjectQuestions.length < section.questionCount) {
            alert(`Not enough questions for ${section.subject}`);
            setCreating(false);
            return;
          }

          testSections.push({
            subject: section.subject,
            duration: Number(section.duration),
            questions: subjectQuestions.slice(0, section.questionCount).map(q => ({
              text: q.objectData.question,
              options: q.objectData.options,
              correctAnswer: q.objectData.correctAnswer,
              difficulty: q.objectData.difficulty
            }))
          });
        }

        await trickleCreateObject('test', {
          title: testTitle,
          description: `${examType} test with ${sections.length} sections`,
          examType: examType,
          totalDuration: Number(totalDuration),
          sections: testSections,
          createdAt: new Date().toISOString()
        });

        onTestCreated();
      } catch (error) {
        console.error('Error creating test:', error);
        alert('Failed to create test');
      } finally {
        setCreating(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div className="bg-white rounded-xl max-w-3xl w-full p-6 my-8">
          <h2 className="text-2xl font-bold mb-6">Create New Test</h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Test Title</label>
                <input type="text" value={testTitle} onChange={(e) => setTestTitle(e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Exam Type</label>
                <select value={examType} onChange={(e) => setExamType(e.target.value)} className="w-full px-4 py-2 border rounded-lg">
                  <option value="">Select</option>
                  {examTypes.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Total Duration (minutes)</label>
              <input type="number" value={totalDuration} onChange={(e) => setTotalDuration(e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold">Sections</h3>
                <button onClick={addSection} className="text-sm px-3 py-1 bg-gray-100 rounded">+ Add Section</button>
              </div>
              
              {sections.map((section, idx) => (
                <div key={idx} className="border rounded-lg p-4 mb-3 bg-gray-50">
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs mb-1">Subject</label>
                      <select value={section.subject} onChange={(e) => updateSection(idx, 'subject', e.target.value)} className="w-full px-2 py-1 border rounded text-sm">
                        <option value="">Select</option>
                        {subjects.map(subj => <option key={subj} value={subj}>{subj}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs mb-1">Duration (min)</label>
                      <input type="number" value={section.duration} onChange={(e) => updateSection(idx, 'duration', e.target.value)} className="w-full px-2 py-1 border rounded text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs mb-1">Questions</label>
                      <div className="flex gap-1">
                        <input type="number" value={section.questionCount} onChange={(e) => updateSection(idx, 'questionCount', e.target.value)} className="flex-1 px-2 py-1 border rounded text-sm" />
                        {sections.length > 1 && (
                          <button onClick={() => removeSection(idx)} className="px-2 text-red-600 hover:bg-red-50 rounded">×</button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button onClick={onClose} className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
            <button onClick={handleCreate} disabled={creating} className="flex-1 px-6 py-3 bg-[var(--primary-color)] text-white rounded-lg hover:opacity-90 disabled:opacity-50">
              {creating ? 'Creating...' : 'Create Test'}
            </button>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('TestCreator error:', error);
    return null;
  }
}