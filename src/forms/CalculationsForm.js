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
    handleCalculateCryptoAverage()
  };

  const navigate = useNavigate();

  const handleCalculateCryptoAverage = () => {
    navigate('/results')
  }

  const handleGoToManualSourcesForm = () => {
    navigate('/manualsourcesform')
  }

  return (
    <>
      <h1>Wycena Kryptoaktyw</h1>
      <form>
        <div>
          <label>Nazwa organu egzekucyjnego</label><input type='text' name="entityName" value={formValues.entityName} onChange={handleInputChange} />
          <br></br>
          <label>Numer sprawy</label><input type='text' maxLength={100} name="caseId" value={formValues.caseId} onChange={handleInputChange} placeholder='Dozwolone: a-z A-Z 0-9 . - / ' />
          <br></br>
          <label>Dane identyfikacyjne</label><input type='text' maxLength={100} name="personId" value={formValues.personId} onChange={handleInputChange} placeholder='Dozwolone: a-z A-Z 0-9 . - / ' />
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
      <button onClick={handleValidateInput}>OBLICZ</button>
      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}

      <br></br>
      <br></br>
      <button onClick={handleGoToManualSourcesForm}>MANUALNIE WPROWADŹ DANE DO WYCENY</button>
    </>
  );
}