import { useNavigate } from 'react-router-dom';
import CalculationsResult from './CalculationsResult'
import { useLocation } from 'react-router-dom';


export default function CalculationsResults() {
    const location = useLocation();
    const data = location.state ? location.state.data : null;
    console.log(data)
    const mockResults = [
        { 'price': '118442.42', 'date': '2023-09-30 22:01:51', 'url': 'https://api.zondacrypto.exchange/rest/trading/ticker/BTC-PLN', 'stock': 'zonda', 'currency': 'PLN' },
        { 'price': '118442.42', 'date': '2023-09-30 22:01:51', 'url': 'https://api.zondacrypto.exchange/rest/trading/ticker/BTC-PLN', 'stock': 'zonda', 'currency': 'PLN' },
        { 'price': '118442.42', 'date': '2023-09-30 22:01:51', 'url': 'https://api.zondacrypto.exchange/rest/trading/ticker/BTC-PLN', 'stock': 'zonda', 'currency': 'PLN' }
    ]

    const handleGenerateReport = (event) => {
        console.log("Raport do wygenerowania")

        fetch('http://localhost:5000/generate_report', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(data => {
              console.log(data)});
    };

    const navigate = useNavigate();

    const handleComeBack = () => {
        navigate('/')
    }

    return (
        <>
            <div class="bg-slate-900">
                <div className="form-container">
                    <p className="form-header">Zestawienie kursów z różnych źródeł</p>
                    <div class="space-y-4">
                        {data.map((dataEntry, index) => (
                            <CalculationsResult key={index} data={dataEntry} />
                        ))}
                    </div>
                    <div class="space-y-4">
                        <button class="btn-red w-full" onClick={handleComeBack}>WRÓĆ</button>
                        <button class="btn-blue" onClick={handleGenerateReport}>GENERUJ RAPORT</button>
                    </div>
                </div>
            </div >
        </>
    );
}