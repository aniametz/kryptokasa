export default function CalculationsResult({ data }) {
  return (
    <>
      <br></br>
      <div>URL: {data.url}</div>
      <div>Nazwa: {data.stock}</div>
      <div>Kurs: {data.price} ({data.currency})</div>
      <div>Data: {data.date}</div>
      <br></br>
    </>
  );
}