function QuestionCard({ question, qNumber, answer, onAnswer }) {
  if (!question) return null;
  return (
    <div>
      <div className="mb-3 text-gray-800">
        <strong>Q{qNumber}.</strong> {question.text}
      </div>
      <div className="space-y-2">
        {question.options.map((opt, i) => (
          <label key={i} className="flex items-center gap-2 bg-white p-2 rounded border">
            <input
              type="radio"
              name={`q${qNumber}`}
              checked={answer === i}
              onChange={() => onAnswer(i)}
            />
            <span>{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
