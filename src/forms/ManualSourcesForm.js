import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import validator from 'validator'

export default function ManualSourcesForm() {
  const sourcesSize = 3;
  const currencies = ['PLN', 'USD'];
  const [formValues, setFormValues] = useState(Array.from(({ length: sourcesSize }), () => (({ url: '', stock: '', price: '', currency: currencies[0] }))));
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
      <div class="bg-slate-900">
        <div className="form-container">
          <p className="form-header">Dane do wyceny kryptoaktywów</p>
          <form>
            {indexes.map((sourceIndex) => {
              return <div class="space-y-4" key={sourceIndex}>
                <div class="form-pair">
                  <label class="form-label">Adres URL źródła</label>
                  <input class="form-input" type='text' name="url" value={formValues.url} onChange={(e) => handleInputChange(sourceIndex, e)} />
                </div>
                <div class="form-pair">
                  <label class="form-label">Nazwa</label>
                  <input class="form-input" type='text' name="stock" value={formValues.stock} onChange={(e) => handleInputChange(sourceIndex, e)} />
                </div>
                <div class="form-pair">
                  <label class="form-label">Kurs</label>
                  <input class="form-input mb-10" type='number' name="price" value={formValues.price} onChange={(e) => handleInputChange(sourceIndex, e)} />
                  <select class="form-input" value={formValues.currency} onChange={(e) => handleOptionChange(sourceIndex, e)}>
                    {currencies.map((currencyOption, currencyIndex) => (
                      <option key={currencyIndex} value={currencyOption}>{currencyOption}</option>
                    ))}
                  </select>
                </div>
                <hr class="horizontal" />
                <br></br>
              </div>
            })}
          </form>
          <div class="space-y-4">
            <button class="btn-red w-full" onClick={handleComeBack}>WRÓĆ</button>
            <button class="btn-blue" onClick={handleValidateInput}>DODAJ</button>
            {errorMessage && <div class="error-text">{errorMessage}</div>}
          </div>
        </div>
      </div>
    </>
  );
}