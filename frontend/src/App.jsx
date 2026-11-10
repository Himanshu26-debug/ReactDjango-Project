import ProducList from "./pages/ProductList";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import ProductDetails from "./pages/ProductDetails"
import Navbar from "./components/navbar";
import CartPage from "./pages/CartPage";
import { CartProvider } from "./context/CartContext";
import CheckoutPage from "./pages/CheckoutPage";
import PrivateRouter from "./components/PrivateRouter";
import Signup from "./pages/Signup";
import Login from "./pages/Login";

function App(){
  return (
      <CartProvider>
        <Router>
          <Navbar/>
          <Routes>
            <Route path="/" element={<ProducList/>}/>
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<CartPage />} />
            <Route element={<PrivateRouter/>}>
              <Route path="/checkout" element={<CheckoutPage />} />
            </Route>
            <Route path="/login" element={<Login/>}/>
            <Route path="/signup" element={<Signup/>}/>
          </Routes>
        </Router>
      </CartProvider>
  )
};

export default App;