import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import validator from 'validator'

export default function ManualSourcesForm() {
  const location = useLocation();
  const missingPrices = location.state ? location.state.missingPrices : null;
  const allData = location.state ? location.state.data : null;

  const currencies = ['PLN', 'USD'];
  const stateArray = Object.entries(missingPrices).flatMap(([symbol, count]) => (Array.from({ length: count }, () => ({ symbol, url: '', stock: '', 'date': '', price: '', currency: currencies[0] }))));
  const [formValues, setFormValues] = useState(stateArray);
  const indexes = [...stateArray.keys()];

  const getCurrentDateFormatted = () => {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}-${day}-${month} ${hours}:${minutes}:${seconds}`;
  };

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const updatedFormsValues = [...formValues];
    updatedFormsValues[index][name] = value;
    if (name === 'price') {
      updatedFormsValues[index]['date'] = getCurrentDateFormatted();
    }
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


    handleGoToResults([...allData, ...formValues])
  };

  const navigate = useNavigate();

  const handleComeBack = () => {
    navigate('/')
  };

  const handleGoToResults = (data) => {
    navigate('/results', { state: { data: data } })
  };

  return (
    <>
      <div className="bg-slate-900">
        <div className="form-container">
          <p className="form-header">Dodaj brakujące dane do wyceny kryptoaktyw</p>
          <form>
            {indexes.map((sourceIndex) => {
              return <div className="space-y-4" key={sourceIndex}>
                <div className="form-pair">
                  <label className="form-label">Kryptoaktywa</label>
                  <div className="form-input">{formValues[sourceIndex].symbol}</div>
                </div>
                <div className="form-pair">
                  <label className="form-label">Adres URL źródła</label>
                  <input className="form-input" type='text' name="url" value={formValues.url} onChange={(e) => handleInputChange(sourceIndex, e)} />
                </div>
                <div className="form-pair">
                  <label className="form-label">Nazwa</label>
                  <input className="form-input" type='text' name="stock" value={formValues.stock} onChange={(e) => handleInputChange(sourceIndex, e)} />
                </div>
                <div className="form-pair">
                  <label className="form-label">Kurs</label>
                  <input className="form-input mb-10" type='number' name="price" value={formValues.price} onChange={(e) => handleInputChange(sourceIndex, e)} />
                  <select className="form-input" value={formValues.currency} onChange={(e) => handleOptionChange(sourceIndex, e)}>
                    {currencies.map((currencyOption, currencyIndex) => (
                      <option key={currencyIndex} value={currencyOption}>{currencyOption}</option>
                    ))}
                  </select>
                </div>
                <hr className="horizontal" />
                <br></br>
              </div>
            })}
          </form>
          <div className="space-y-4">
            <button className="btn-red w-full" onClick={handleComeBack}>WRÓĆ</button>
            <button className="btn-blue" onClick={handleValidateInput}>PODSUMOWANIE</button>
            {errorMessage && <div className="error-text">{errorMessage}</div>}
          </div>
        </div>
      </div>
    </>
  );
}