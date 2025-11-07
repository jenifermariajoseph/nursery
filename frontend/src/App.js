import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Home from './pages/home'
import ShopCategory from './pages/shopcategory'
import Product from './pages/product'
import LoginSignup from './pages/loginsignup'
import Cart from './pages/Cart'
import { AuthProvider } from './context/auth'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/plants" element={<ShopCategory category="plants" />} />
          <Route path="/product/:productId" element={<Product />} />
          <Route path="/loginsignup" element={<LoginSignup />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
export default App