import { useState } from 'react';
import CryptoForm from "./CryptoOptionsForm";

export default function CalculationsForm() {
  const mockCryptoSymbols = ["BTC", "ETH", "CITY"]
  const [cryptoForms, setCryptoForms] = useState([{ selectedOption: '', numericValue: '' }]);

  const handleAddCryptoForm = (event) => {
    event.preventDefault();
    setCryptoForms([...cryptoForms, { selectedOption: '', numericValue: '' }]);
  };

  const handleRemoveCryptoForm = (index, event) => {
    event.preventDefault();
    const updatedCryptoForms = cryptoForms.filter((form, i) => i !== index);
    setCryptoForms(updatedCryptoForms);
  };

  const handleOptionChange = (index, event) => {
    const updatedCryptoForms = [...cryptoForms];
    updatedCryptoForms[index].selectedOption = event.target.value;
    setCryptoForms(updatedCryptoForms);

  };

  const handleNumericValueChange = (index, event) => {
    const updatedCryptoForms = [...cryptoForms];
    updatedCryptoForms[index].numericValue = event.target.value;
    setCryptoForms(updatedCryptoForms);

  };

  return (
    <>
      <form>
        <div>
          <label>Nazwa organu egzekucyjnego</label><input type='text' maxLength={100} />
          <br></br>
          <label>Numer sprawy</label><input type='text' maxLength={100} />
          <br></br>
          <label>Dane identyfikacyjne</label><input type='text' maxLength={100} />
          <br></br>
        </div>
        <h5>Kryptoaktywa</h5>
        <div>
          {cryptoForms.map((data, index) => (
            <CryptoForm
              key={index}
              options={mockCryptoSymbols}
              selectedOption={data.selectedOption}
              onOptionChange={(e) => handleOptionChange(index, e)}
              onNumericValueChange={(e) => handleNumericValueChange(index, e)}
              onRemove={(e) => handleRemoveCryptoForm(index, e)}
            />
          ))}
        </div>
        <br></br>
        <br></br>
        <button onClick={handleAddCryptoForm}>+</button>
      </form>
    </>
  );
}