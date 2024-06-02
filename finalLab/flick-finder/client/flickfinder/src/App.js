import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './pages/main';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import MovieSelect from './pages/moviesselect';
import FindMatches from './pages/FindMatches';
import SearchFor from './pages/searchFor';
import EditUserInfo from './pages/EditUserInfo';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/moviesselect" element={<MovieSelect />} />
        <Route path="/searchfor" element={<SearchFor />} />
        <Route path="/FindMatches" element={<FindMatches />} />
        <Route path="/EditUserInfo" element={<EditUserInfo />} />
        
      </Routes>
    </Router>
  );
}

export default App;
