export default function CalculationsResult({ data }) {
  return (
    <>
      <div class="form-pair">
        <div class="form-label">URL: </div>
        <div class="form-input">{data.url}</div>
      </div>
      <div className="form-pair">
        <div className="form-label">Aktywo:</div>
        <div className="form-input">{data.symbol}</div>
      </div>
      <div class="form-pair">
        <div class="form-label">Nazwa: </div>
        <div class="form-input">{data.stock}</div>
      </div>
      <div class="form-pair">
        <div class="form-label">Kurs: </div>
        <div class="form-input">{data.price} ({data.currency})</div>
      </div>
      <div class="form-pair">
        <div class="form-label">Data: </div>
        <div class="form-input">{data.date}</div>
      </div>
      <hr class="horizontal"></hr>
    </>
  );
}