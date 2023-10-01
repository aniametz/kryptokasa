export default function CryptoForm({ options, selectedOption, onOptionChange, numericValue, onNumericValueChange, onRemove }) {
  return (
    <>
      <div className="space-y-4">
        <div className="form-pair">
          <label className="form-label">Nazwa</label>
          <select className="form-input" value={selectedOption} onChange={onOptionChange}>
            {options.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        </div>
        <div className="form-pair">
          <label className="form-label">Ilość</label>
          <input className="form-input" type="number" value={numericValue} onChange={onNumericValueChange} />
        </div>
        <button className="btn-red" onClick={onRemove}>-</button>
      </div>
      <br></br>
    </>
  );
}