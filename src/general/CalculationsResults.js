import { useNavigate } from 'react-router-dom';
import CalculationsResult from './CalculationsResult'

export default function CalculationsResults() {
    const mockResults = [
        { 'price': '118442.42', 'date': '2023-09-30 22:01:51', 'url': 'https://api.zondacrypto.exchange/rest/trading/ticker/BTC-PLN', 'stock': 'zonda', 'currency': 'PLN' },
        { 'price': '118442.42', 'date': '2023-09-30 22:01:51', 'url': 'https://api.zondacrypto.exchange/rest/trading/ticker/BTC-PLN', 'stock': 'zonda', 'currency': 'PLN' },
        { 'price': '118442.42', 'date': '2023-09-30 22:01:51', 'url': 'https://api.zondacrypto.exchange/rest/trading/ticker/BTC-PLN', 'stock': 'zonda', 'currency': 'PLN' }
    ]

    const handleGenerateReport = (event) => {
        console.log("Raport do wygenerowania")
    };

    const navigate = useNavigate();

    const handleComeBack = () => {
        navigate('/')
    }

    return (
        <>
            <div>
                {mockResults.map((dataEntry, index) => (
                    <CalculationsResult key={index} data={dataEntry} />
                ))}
            </div>
            <button onClick={handleGenerateReport}>GENERUJ RAPORT</button>
            <button onClick={handleComeBack}>WRÓĆ</button>
        </>
    );
}