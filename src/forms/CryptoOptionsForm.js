export default function CryptoForm({ options, selectedOption, onOptionChange, numericValue, onNumericValueChange, onRemove }) {
  return (
    <>
      <div class="space-y-4">
        <div class="form-pair">
          <label class="form-label">Nazwa</label>
          <select class="form-input" value={selectedOption} onChange={onOptionChange}>
            {options.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        </div>
        <div class="form-pair">
          <label class="form-label">Ilość</label>
          <input class="form-input" type="number" value={numericValue} onChange={onNumericValueChange} />
        </div>
        <button class="btn-red" onClick={onRemove}>-</button>
      </div>
      <br></br>
    </>
  );
}