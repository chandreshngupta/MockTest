function QuestionNav({ total = 0, current = 0, answers = {}, marked = {}, onNavigate }) {
  if (!total || total <= 0) return <div>No questions available</div>;

  const getClass = (idx) => {
    if (marked && marked[idx]) return 'bg-purple-600 text-white';
    if (answers && answers[idx] != null) return 'bg-green-600 text-white';
    return 'bg-gray-200 text-gray-800';
  };

  return (
    <div>
      <h3 className="font-semibold mb-3">Question Palette</h3>
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: total }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => onNavigate(idx)}
            className={`w-10 h-10 rounded flex items-center justify-center ${getClass(idx)} ${
              idx === current ? 'ring-2 ring-yellow-400' : ''
            }`}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

