import React, { useState } from 'react'
import './Navbar.css'
import logo from '../assets/logo.png'
import cart_icon from '../assets/cart_icon.png'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/auth'
import { useCart } from '../../context/useCart'

const Navbar = () => {
  const [menu, setMenu] = useState('Home')
  const { user, logout } = useAuth()
  const { refresh } = useCart()
  const navigate = useNavigate()

  const handleLogout = async () => {
    logout()
    await refresh('anon')
    navigate('/')
  }
  return (
    <div className="navbar">
        <div className="nav-logo">
            <img src={logo} alt="Nursery Logo"/>
            <p>nursery</p>
        </div>
        <ul className="nav-menu">
            <li onClick={()=>setMenu("Home")} className={menu==="Home" ? "active" : ""}>
              <Link to="/">Home</Link>
              {menu==="Home" && <hr/>}
            </li>
            <li onClick={()=>setMenu("Plants")} className={menu==="Plants" ? "active" : ""}>
              <Link to="/plants">Plants</Link>
              {menu==="Plants" && <hr/>}
            </li>
            {/* <li onClick={()=>setMenu("Seeds")} className={menu==="Seeds" ? "active" : ""}>
              <Link to="/seed">Seeds</Link>
              {menu==="Seeds" && <hr/>}
            </li> */}
        </ul>
        <div className="nav-login-cart">
            {user ? (
              <button onClick={handleLogout}>Logout</button>
            ) : (
              <Link to="/loginsignup">
                <button>Login</button>
              </Link>
            )}
            <Link to="/cart">
              <img src={cart_icon} alt="Cart Icon"/>
            </Link>
        </div>
    </div>
  )
}
  
export default Navbar