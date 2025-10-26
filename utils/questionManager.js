async function uploadQuestionsToDatabase(jsonData) {
  let count = 0;
  
  for (const row of jsonData) {
    try {
      const questionData = {
        examType: row.examType || 'General',
        subject: row.subject || 'General',
        difficulty: row.difficulty || 'Medium',
        question: row.question,
        options: [
          row.optionA,
          row.optionB,
          row.optionC,
          row.optionD
        ],
        correctAnswer: getCorrectAnswerIndex(row.correctAnswer),
        uploadedAt: new Date().toISOString()
      };
      
      await trickleCreateObject('question', questionData);
      count++;
    } catch (error) {
      console.error('Error uploading question:', error);
    }
  }
  
  return { count };
}

function getCorrectAnswerIndex(answer) {
  const answerMap = { 'A': 0, 'B': 1, 'C': 2, 'D': 3 };
  return answerMap[answer.toUpperCase()] || 0;
}

async function getQuestionsByExamType(examType, limit = 50) {
  try {
    let result;
    try {
      result = await trickleListObjects('question', 200, true);
    } catch (dbError) {
      console.warn('Database query failed for questions:', dbError);
      return [];
    }
    
    if (!result || !result.items) {
      console.warn('No questions found in database');
      return [];
    }
    const filtered = result.items.filter(q => q.objectData && q.objectData.examType === examType);
    return filtered.slice(0, limit);
  } catch (error) {
    console.error('Error fetching questions:', error);
    return [];
  }
}

async function createTestFromQuestions(examType, questionCount = 10) {
  try {
    const questions = await getQuestionsByExamType(examType, questionCount);
    
    const testData = {
      examType: examType,
      title: `${examType} Mock Test`,
      description: `Practice test for ${examType}`,
      duration: questionCount * 2,
      questions: questions.map(q => ({
        text: q.objectData.question,
        options: q.objectData.options,
        correctAnswer: q.objectData.correctAnswer,
        subject: q.objectData.subject,
        difficulty: q.objectData.difficulty
      })),
      createdAt: new Date().toISOString()
    };
    
    const test = await trickleCreateObject('test', testData);
    return test;
  } catch (error) {
    console.error('Error creating test:', error);
    return null;
  }
}