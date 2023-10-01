import { useNavigate, useLocation } from 'react-router-dom';
import CalculationsResult from './CalculationsResult'


export default function CalculationsResults() {
    const location = useLocation();
    const data = location.state ? location.state.data : null;
    console.log(data)
    const handleGenerateReport = (event) => {
        console.log("Raport do wygenerowania")
    };

    const navigate = useNavigate();

    const handleComeBack = () => {
        navigate('/')
    }

    return (
        <>
            <div className="bg-slate-900">
                <div className="form-container">
                    <p className="form-header">Zestawienie kursów z różnych źródeł</p>
                    <div className="space-y-4">
                        {data.map((dataEntry, index) => (
                            <CalculationsResult key={index} data={dataEntry} />
                        ))}
                    </div>
                    <div className="space-y-4">
                        <button className="btn-red w-full" onClick={handleComeBack}>WRÓĆ</button>
                        <button className="btn-blue" onClick={handleGenerateReport}>GENERUJ RAPORT</button>
                    </div>
                </div>
            </div >
        </>
    );
}