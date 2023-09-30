import { Routes, Route } from 'react-router-dom';

import CalculationsForm from '../forms/CalculationsForm';
import CalculationsResults from './CalculationsResults';
import ManualSourcesForm from '../forms/ManualSourcesForm';

export default function Home() {
  return (
    <>
      <Routes>
        <Route path="/" element={<CalculationsForm />} />
        <Route path="/results" element={<CalculationsResults />} />
        <Route path="/manualsourcesform" element={<ManualSourcesForm />} />
      </Routes>
    </>
  );
}