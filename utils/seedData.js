// Seed sample data for local demos. Runs only when no tests exist or when ?seed=true is present.
;(function(){
  async function _ensureDemoUser(){
    let users = [];
    try { users = JSON.parse(localStorage.getItem('mock_users') || '[]'); } catch(e) { users = []; }
    let demo = users.find(u => u.email === 'demo@exampro.com');
    if (!demo) {
      demo = { id: 'user-demo', name: 'Demo User', email: 'demo@exampro.com', password: 'demo123', role: 'student' };
      users.push(demo);
      localStorage.setItem('mock_users', JSON.stringify(users));
      console.log('Seed: created demo user demo@exampro.com / demo123');
    }
    localStorage.setItem('currentUser', JSON.stringify({ userId: demo.id, name: demo.name, email: demo.email, role: demo.role }));
    return demo;
  }

  async function seedDemoData(force){
    try {
      if (!window.trickleListObjects || !window.trickleCreateObject) {
        throw new Error('DB shim not available');
      }

      const existing = await trickleListObjects('test', 1, true).catch(() => ({ items: [] }));
      if (!force && existing && existing.items && existing.items.length > 0) {
        console.log('Seed: tests already exist, skipping seeding.');
        return { skipped: true };
      }

      const demo = await _ensureDemoUser();

      console.log('Seeding demo tests...');

      // Create sample tests
      const t1 = await trickleCreateObject('test', {
        title: 'General Aptitude Test',
        description: 'A short 30-minute aptitude test covering quantitative and reasoning.',
        duration: 30,
        questions: [
          { q: 'What is 2+2?', options: ['1','2','3','4'], answer: 3 },
          { q: 'Choose the odd one out: cat, dog, apple, cow', options: ['cat','dog','apple','cow'], answer: 2 }
        ],
        difficulty: 'easy',
        examType: 'General',
        createdAt: new Date().toISOString()
      });

      const t2 = await trickleCreateObject('test', {
        title: 'Advanced Reasoning Test',
        description: 'A tougher section focusing on logical reasoning and pattern recognition.',
        duration: 45,
        questions: [
          { q: 'Complete the series: 2,4,8,16,...', options: ['20','24','32','36'], answer: 2 },
          { q: 'If all Bloops are Razzies and all Razzies are Lazzies, are all Bloops Lazzies?', options: ['Yes','No'], answer: 0 }
        ],
        difficulty: 'medium',
        examType: 'Reasoning',
        createdAt: new Date().toISOString()
      });

      // Create sample responses
      await trickleCreateObject(`response:${demo.id}`, {
        testId: t1.objectId,
        userId: demo.id,
        totalQuestions: t1.objectData.questions.length,
        correctAnswers: 1,
        answers: { 0: 3, 1: 2 },
        score: Math.round((1 / t1.objectData.questions.length) * 100),
        timeTaken: 420,
        createdAt: new Date().toISOString()
      });

      await trickleCreateObject(`response:${demo.id}`, {
        testId: t2.objectId,
        userId: demo.id,
        totalQuestions: t2.objectData.questions.length,
        correctAnswers: 2,
        answers: { 0: 2, 1: 0 },
        score: 100,
        timeTaken: 900,
        createdAt: new Date().toISOString()
      });

      console.log('Seeding complete. Demo user is logged in (demo@exampro.com).');
      return { skipped: false };
    } catch (e) {
      console.error('Seeding error:', e);
      throw e;
    }
  }

  async function clearDemoData(){
    try {
      // Clear mock_db entirely and demo users
      localStorage.removeItem('mock_db');
      // Remove demo users only
      try {
        let users = JSON.parse(localStorage.getItem('mock_users') || '[]');
        users = users.filter(u => u.email !== 'demo@exampro.com');
        localStorage.setItem('mock_users', JSON.stringify(users));
      } catch (e) {}
      // Clear currentUser
      localStorage.removeItem('currentUser');
      console.log('Cleared demo data (mock_db, demo user, currentUser)');
      return true;
    } catch (e) {
      console.error('Clear demo data error:', e);
      return false;
    }
  }

  // Expose helpers
  window.seedDemoData = seedDemoData;
  window.clearDemoData = clearDemoData;

  // Auto-run on load if appropriate
  (async function auto(){
    try{
      const urlParams = new URLSearchParams(window.location.search);
      const force = urlParams.get('seed') === 'true';
      await seedDemoData(force).catch(()=>{});
    }catch(e){/*ignore*/}
  })();

})();
