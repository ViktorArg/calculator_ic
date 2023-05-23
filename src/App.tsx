import './App.css';
import Calculator from './pages/Calculator';
import ResponsiveAppBar from './pages/Navbar';

function App() {
  return (
    <div className="App">
      <ResponsiveAppBar />
      <Calculator />
    </div>
  );
}

export default App;
