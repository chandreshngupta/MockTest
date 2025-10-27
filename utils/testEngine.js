async function getTestById(testId) {
  try {
    let test;
    try {
      test = await trickleGetObject('test', testId);
    } catch (dbError) {
      console.warn('Test not found in database, using sample:', dbError);
      test = null;
    }
    
    if (test && test.objectData) {
      if (test.objectData.sections) {
        return {
          id: testId,
          title: test.objectData.title,
          totalDuration: test.objectData.totalDuration,
          sections: test.objectData.sections
        };
      } else if (test.objectData.questions) {
        return {
          id: testId,
          title: test.objectData.title,
          duration: test.objectData.duration,
          questions: test.objectData.questions
        };
      }
    }
  } catch (error) {
    console.warn('Error loading test:', error);
  }

  return {
    id: testId,
    title: 'Sample Test',
    duration: 15,
    questions: [
      { text: 'What is 2+2?', options: ['3','4','5','6'], correctAnswer: 1 },
      { text: 'Capital of France?', options: ['London','Berlin','Paris','Rome'], correctAnswer: 2 }
    ]
  };
}

function calculateScore(questions, answers) {
  let correct = 0;
  questions.forEach((q, i) => {
    if (answers[i] === q.correctAnswer) correct++;
  });
  return Math.round((correct / questions.length) * 100);
}

async function saveTestResponse(userId, testId, answers, score, questions) {
  try {
    const correctAnswers = questions.filter((q, i) => answers[i] === q.correctAnswer).length;
    const responseData = {
      testId: testId,
      answers: answers,
      score: score,
      correctAnswers: correctAnswers,
      totalQuestions: questions.length,
      accuracy: Math.round((correctAnswers / questions.length) * 100),
      submittedAt: new Date().toISOString()
    };
    
    localStorage.setItem('testResults', JSON.stringify(responseData));
    
    try {
      const response = await trickleCreateObject(`response:${userId}`, responseData);
      return response.objectId;
    } catch (dbError) {
      console.warn('Could not save to database:', dbError);
      return 'local-' + Date.now();
    }
  } catch (error) {
    console.error('Error saving response:', error);
    return 'local-' + Date.now();
  }
}