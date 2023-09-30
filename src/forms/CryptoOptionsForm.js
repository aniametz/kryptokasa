export default function CryptoForm({ options, selectedOption, onOptionChange, numericValue, onNumericValueChange, onRemove }) {
  return (
    <>
      <label>Nazwa</label>
      <select value={selectedOption} onChange={onOptionChange}>
        {options.map((option, index) => (
          <option key={index} value={option}>{option}</option>
        ))}
      </select>
      <br></br>
      <label>Ilość</label><input type="number" value={numericValue} onChange={onNumericValueChange} />
      <br></br>
      <button onClick={onRemove}>-</button>
      <br></br>
    </>
  );
}