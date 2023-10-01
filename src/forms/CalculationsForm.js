import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CryptoForm from "./CryptoOptionsForm";

export default function CalculationsForm() {
  const [formValues, setFormValues] = useState({ entityName: '', caseId: '', personId: '' });
  const mockCryptoSymbols = ["BTC", "ETH", "CITY"]
  const [cryptoForms, setCryptoForms] = useState([{ selectedOption: mockCryptoSymbols[0], numericValue: '' }]);

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

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const [errorMessage, setErrorMessage] = useState("");
  const allowedCharactersMessage = "Dopuszczalne są duże i małe litery, cyfry oraz znaki takie jak „.”, „-”, „/”."
  const allowedCharacters = /^[a-zA-Z0-9.-/]*$/;

  const handleValidateInput = () => {
    if (Object.values(formValues).some((value) => value.trim() === '')
      || Object.values(cryptoForms).some((cryptoState) => cryptoState.numericValue.trim() === '')) {
      setErrorMessage("Formularz zwiera puste pola.")
      return;
    }
    if (!allowedCharacters.test(formValues.caseId)) {
      setErrorMessage("Numer sprawy zawiera niedozwolone znaki. " + allowedCharactersMessage)
      return;
    }
    if (!allowedCharacters.test(formValues.personId)) {
      setErrorMessage("Dane identyfikacyjne zawierają niedozwolone znaki. " + allowedCharactersMessage)
      return;
    }
    if (cryptoForms.length === 0) {
      setErrorMessage("Należy dodać przynajmniej jedną pozycję dla kryptoaktyw.")
      return;
    }
    if (Object.values(cryptoForms).some((cryptoState) => Number(cryptoState.numericValue) < 0)) {
      setErrorMessage("Ilość kryptoaktyw nie może być ujemna.")
      return;
    }
    setErrorMessage("")

    console.log({ ...formValues, crypto: { ...cryptoForms } })
    fetch('http://localhost:5000/get_price', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(cryptoForms)
    })
        .then(response => response.json())
        .then(data => {
          console.log(data)
          const result = data.reduce((acc, item) => {
            if (!acc[item.symbol]) {
                acc[item.symbol] = 0;
            }
            if (item.price === "") {
                acc[item.symbol]++;
            }
            return acc;
        }, {});
          console.log(result)
                // document.getElementById('price').textContent = 'Price: $' + data.price;
          if (Object.values(result).every(value => value === 0)){
            handleCalculateCryptoAverage(data)
          }
          else {
            console.log("todo");
          }

            });
  };

  const navigate = useNavigate();

  const handleCalculateCryptoAverage = (data) => {
    navigate('/results', { state: { data: data } })
  }

  const handleGoToManualSourcesForm = () => {
    navigate('/manualsourcesform')
  }

  const placeholderWithAllowedCharacters = 'Dozwolone: a-z A-Z 0-9 . - / '

  return (
    <>
      <div class="bg-slate-900">
        <div className="form-container">
          <p className="form-header">Wycena kryptoaktywów</p>
          <form>
            <div class="space-y-4">
              <div class="form-pair">
                <label class="form-label">Nazwa organu egzekucyjnego</label>
                <input class="form-input" type='text' name="entityName" value={formValues.entityName} onChange={handleInputChange} />
              </div>
              <div class="form-pair">
                <label class="form-label">Numer sprawy</label>
                <input class="form-input" type='text' maxLength={100} name="caseId" value={formValues.caseId} onChange={handleInputChange} placeholder={placeholderWithAllowedCharacters} />
              </div>
              <div class="form-pair">
                <label class="form-label">Dane identyfikacyjne</label>
                <input class="form-input" type='text' maxLength={100} name="personId" value={formValues.personId} onChange={handleInputChange} placeholder={placeholderWithAllowedCharacters} />
              </div>
            </div>
            <hr class="horizontal" />
            <p className="form-small-header">Kryptoaktywa</p>
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
            <button class="btn-green" onClick={handleAddCryptoForm}>+</button>
          </form>
          <hr class="horizontal" />
          <button class="btn-blue" onClick={handleValidateInput}>OBLICZ</button>
          {errorMessage && <div class="error-text">{errorMessage}</div>}

          <br></br>
          <br></br>
          <button class="btn-blue" onClick={handleGoToManualSourcesForm}>WPROWADŹ DANE DO WYCENY</button>
        </div>
      </div>
    </>
  );
}