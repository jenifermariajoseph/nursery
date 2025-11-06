import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Home from './pages/home'
import ShopCategory from './pages/shopcategory'
import Product from './pages/product'
import LoginSignup from './pages/loginsignup'
import Cart from './pages/Cart'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/plants" element={<ShopCategory category="plants" />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/loginsignup" element={<LoginSignup />} />
        {/* Add other routes as needed */}
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </BrowserRouter>
  )
}
export default App