
import 'bootstrap/dist/css/bootstrap.min.css';
import './public-page/assets/styles/css/global.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import routes from './routes/route';


function App() {
  return (
      <Router>
        <Routes>
          {routes.map((router, index)=>{
            return <Route
                key     ={index}
                path    ={router.path}
                element ={router.element}
            />;
          })}
        </Routes> 
      </Router>
  );
}

export default App;
