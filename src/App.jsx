import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import { CartProvider } from "./context/CartContext"
import Home from "./pages/Home"
import ProductDetail from "./pages/ProductDetail"
import Checkout from "./pages/Checkout"


function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/producto/:id" element={<ProductDetail />} />
          <Route path="/checkout" element={<Checkout />} />
          
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </CartProvider>
  )
}