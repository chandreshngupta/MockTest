async function getAvailableTests() {
  try {
    let result;
    try {
      result = await trickleListObjects('test', 50, true);
    } catch (dbError) {
      console.warn('Database query failed, returning empty array:', dbError);
      return [];
    }
    
    if (result && result.items && result.items.length > 0) {
      return result.items.map(t => {
        const data = t.objectData;
        let questionCount = 0;
        let duration = 0;
        
        if (data.sections) {
          questionCount = data.sections.reduce((sum, s) => sum + s.questions.length, 0);
          duration = data.totalDuration;
        } else if (data.questions) {
          questionCount = data.questions.length;
          duration = data.duration;
        }
        
        return {
          id: t.objectId,
          title: data.title,
          description: data.description,
          duration: duration,
          questions: questionCount,
          marks: questionCount * 2,
          subject: data.examType || 'General',
          sections: data.sections ? data.sections.length : 0
        };
      });
    }
    
    return [];
  } catch (error) {
    console.error('Error processing tests:', error);
    return [];
  }
}

async function getUserStats(userId) {
  try {
    let result;
    try {
      result = await trickleListObjects(`response:${userId}`, 100, true);
    } catch (dbError) {
      console.warn('No responses found:', dbError);
      return {
        testsTaken: 0,
        avgScore: 0,
        studyTime: '0h',
        rank: '-',
        recentScores: [0, 0, 0, 0, 0]
      };
    }
    
    if (!result || !result.items || result.items.length === 0) {
      return {
        testsTaken: 0,
        avgScore: 0,
        studyTime: '0h',
        rank: '-',
        recentScores: [0, 0, 0, 0, 0]
      };
    }

    const scores = result.items.map(r => r.objectData.score || 0);
    const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    const recentScores = scores.slice(0, 5).reverse();

    return {
      testsTaken: result.items.length,
      avgScore,
      studyTime: `${result.items.length * 2}h`,
      rank: Math.floor(Math.random() * 100) + 1,
      recentScores
    };
  } catch (error) {
    console.error('Error in getUserStats:', error);
    return {
      testsTaken: 0,
      avgScore: 0,
      studyTime: '0h',
      rank: '-',
      recentScores: [0, 0, 0, 0, 0]
    };
  }
}