export default function CalculationsResult({ data }) {
  return (
    <>
      <div className="form-pair">
        <div className="form-label">URL: </div>
        <div className="form-input">{data.url}</div>
      </div>
      <div className="form-pair">
        <div className="form-label">Aktywo:</div>
        <div className="form-input">{data.symbol}</div>
      </div>
      <div class="form-pair">
        <div class="form-label">Nazwa: </div>
        <div class="form-input">{data.stock}</div>
      </div>
      <div className="form-pair">
        <div className="form-label">Kurs: </div>
        <div className="form-input">{data.price} ({data.currency})</div>
      </div>
      <div className="form-pair">
        <div className="form-label">Data: </div>
        <div className="form-input">{data.date}</div>
      </div>
      <hr className="horizontal"></hr>
    </>
  );
}