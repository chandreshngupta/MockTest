function TestList({ tests }) {
  try {
    const [query, setQuery] = React.useState('');
    const [filter, setFilter] = React.useState('all');
    const [page, setPage] = React.useState(1);
    const pageSize = 6;

    const handleStartTest = (testId) => {
      window.location.href = `test.html?id=${testId}`;
    };

    const filtered = tests.filter(t => {
      const matchesQuery = (t.title + ' ' + (t.description || '')).toLowerCase().includes(query.toLowerCase());
      const matchesFilter = filter === 'all' ? true : (t.difficulty === filter || t.category === filter);
      return matchesQuery && matchesFilter;
    });

    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    const shown = filtered.slice((page - 1) * pageSize, page * pageSize);

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Available Tests</h2>
          <div className="flex items-center gap-3">
            <input value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder="Search tests..." className="px-3 py-2 border rounded-lg w-64 outline-none focus:ring-2 focus:ring-[var(--primary-color)]" />
            <select value={filter} onChange={(e) => { setFilter(e.target.value); setPage(1); }} className="px-3 py-2 border rounded-lg outline-none">
              <option value="all">All</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {shown.length === 0 && (
            <div className="text-center text-gray-500 py-8">No tests found. Try adjusting your search.</div>
          )}
          {shown.map((test) => (
            <div key={test.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{test.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">{test.description}</p>
                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <div className="icon-clock text-base"></div>
                      <span>{test.duration} min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="icon-help-circle text-base"></div>
                      <span>{test.questions} questions</span>
                    </div>
                    {test.sections > 0 && (
                      <div className="flex items-center gap-1">
                        <div className="icon-layers text-base"></div>
                        <span>{test.sections} sections</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end ml-4">
                  <div className="text-sm text-gray-500 mb-2">{test.difficulty ? test.difficulty.toUpperCase() : '—'}</div>
                  <button onClick={() => handleStartTest(test.id)} className="btn-primary ml-4">
                    Start Test
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-600">Showing {Math.min(filtered.length, (page - 1) * pageSize + 1)} - {Math.min(filtered.length, page * pageSize)} of {filtered.length} tests</div>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
            <div className="px-3 py-1 border rounded">{page} / {totalPages}</div>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('TestList error:', error);
    return null;
  }
}