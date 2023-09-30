import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import validator from 'validator'

export default function ManualSourcesForm() {
  const sourcesSize = 3;
  const currencies = ['PLN', 'USD'];
  const [formValues, setFormValues] = useState(Array.from(({ length: 3 }), () => (({ url: '', stock: '', price: '', currency: currencies[0] }))));
  const indexes = [...Array(sourcesSize).keys()];

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const updatedFormsValues = [...formValues];
    updatedFormsValues[index][name] = value;
    setFormValues(updatedFormsValues);
  };

  const handleOptionChange = (index, event) => {
    const updatedFormsValues = [...formValues];
    updatedFormsValues[index].currency = event.target.value;
    setFormValues(updatedFormsValues);
  };

  const [errorMessage, setErrorMessage] = useState("");

  const handleValidateInput = () => {
    if (!Object.values(formValues).every((value) => validator.isURL(value.url))) {
      setErrorMessage('Formularz zwiera niepoprawne adresy URL.')
      return;
    }
    if (!Object.values(formValues).every((value) => validator.isNumeric(value.price))) {
      setErrorMessage('Formularz zwiera niepoprawne dane dla kursu.')
      return;
    }
    if (Object.values(formValues).some((value) => value.stock.trim() === '' || value.price.trim() === '')) {
      setErrorMessage("Formularz zwiera puste pola.")
      return;
    }
    if (Object.values(formValues).some((value) => value.price < 0)) {
      setErrorMessage("Formularz zwiera ujemne wartości dla kursu.")
      return;
    }
    setErrorMessage("")

    console.log({ formValues })
    handleComeBack();
  };

  const navigate = useNavigate();

  const handleComeBack = () => {
    navigate('/')
  };

  return (
    <>
      <h1>Dane do wyceny kryptoaktyw</h1>
      <form>
        {indexes.map((sourceIndex) => {
          return <div key={sourceIndex}>
            <br></br>
            <label>Adres URL źródła</label><input type='text' name="url" value={formValues.url} onChange={(e) => handleInputChange(sourceIndex, e)} />
            <br></br>
            <label>Nazwa</label><input type='text' name="stock" value={formValues.stock} onChange={(e) => handleInputChange(sourceIndex, e)} />
            <br></br>
            <label>Kurs</label><input type='number' name="price" value={formValues.price} onChange={(e) => handleInputChange(sourceIndex, e)} />
            <select value={formValues.currency} onChange={(e) => handleOptionChange(sourceIndex, e)}>
              {currencies.map((currencyOption, currencyIndex) => (
                <option key={currencyIndex} value={currencyOption}>{currencyOption}</option>
              ))}
            </select>
            <br></br>
          </div>
        })}
      </form>
      <br></br>
      <br></br>
      <button onClick={handleComeBack}>WRÓĆ</button>
      <button onClick={handleValidateInput}>DODAJ</button>
      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
    </>
  );
}