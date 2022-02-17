import './App.css';
import InputForm from './components/Form/container/InputForm';
import Spinner from './components/Spinner';

function App() {
  return (
    <div className='App'>
      <h2>Image checker</h2>
      <InputForm />
      <Spinner />
    </div>
  );
}

export default App;
