import './App.css';
import Home from './components/home.js';
import DS from './components/ds.js';
import Canvas from './components/Canvas.js';
import Lltheory from './components/lltheory';
import Stacktheory from './components/stackstheory';
import BSTtheory from './components/bsttheory';
import Canvas2 from './components/Stacks.js';
import Canvas3 from './components/BST.js'
import Layout from './components/layout.js'
import Form from './components/form.js'
import Footer from './components/footer.js'
import {BrowserRouter as Router, Routes, Route, Redirect} from 'react-router-dom';

const App = () => {
  return (
    <Router>
      <Layout></Layout>
        <Routes>
          <Route exact path="/" element={<Home/>}/>
          <Route exact path="/datastructures" element={<DS/>}/>
          <Route exact path="/datastructures/linkedlist" element={<Canvas/>}/>
          <Route exact path="/datastructures/linkedlist/theory" element={<Lltheory/>}/>
          <Route exact path="/datastructures/stacks" element={<Canvas2/>}/>
          <Route exact path="/datastructures/bst" element={<Canvas3/>}/>
          <Route exact path="/datastructures/stacks/theory" element={<Stacktheory/>}/>
          <Route exact path="/datastructures/bst/theory" element={<BSTtheory/>}/>
          {/* <Route path="*" element={<NotFound/>}/> */}
          <Route exact path="/feedback" element={<Form/>}/>
        </Routes>
    </Router>
  );
}

export default App;
