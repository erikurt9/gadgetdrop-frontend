import { clp } from "../utils/format"
import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { PRODUCTS } from "../data/products"
import { useCart } from "../context/CartContext"

function useInView(threshold = 0.15) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true) },
      { threshold }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])
  return [ref, visible]
}

function ScrollReveal({ children, delay = 0, direction = "up" }) {
  const [ref, visible] = useInView()
  const variants = {
    up:    { hidden: { opacity: 0, y: 50 },       visible: { opacity: 1, y: 0 } },
    left:  { hidden: { opacity: 0, x: -50 },      visible: { opacity: 1, x: 0 } },
    right: { hidden: { opacity: 0, x: 50 },       visible: { opacity: 1, x: 0 } },
    scale: { hidden: { opacity: 0, scale: 0.88 }, visible: { opacity: 1, scale: 1 } },
  }
  return (
    <motion.div ref={ref} initial="hidden" animate={visible ? "visible" : "hidden"}
      variants={variants[direction]} transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  )
}

function Popup({ onClose }) {
  const [email, setEmail] = useState("")
  const [success, setSuccess] = useState(false)
  const handleSubmit = () => {
    if (email.includes("@")) { setSuccess(true); setTimeout(onClose, 2500) }
  }
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(12px)" }}>
      <motion.div initial={{ opacity: 0, scale: 0.9, y: 32 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 32 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ background: "#fff", borderRadius: 28, width: "100%", maxWidth: 440, overflow: "hidden", boxShadow: "0 40px 80px rgba(0,0,0,0.3)" }}>
        <div style={{ background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)", padding: "36px 36px 28px", textAlign: "center", position: "relative" }}>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={onClose}
            style={{ position: "absolute", top: 14, right: 14, width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "none", color: "rgba(255,255,255,0.7)", cursor: "pointer", fontSize: 14 }}>✕</motion.button>
          <motion.div animate={{ rotate: [0, -10, 10, -5, 5, 0], scale: [1, 1.1, 1] }} transition={{ duration: 1, delay: 0.3 }} style={{ fontSize: 48, marginBottom: 12 }}>🎁</motion.div>
          <div style={{ display: "inline-block", background: "#f97316", color: "#fff", fontSize: 10, fontWeight: 800, letterSpacing: 2.5, textTransform: "uppercase", padding: "5px 14px", borderRadius: 20, marginBottom: 14 }}>Solo hoy</div>
          <h2 style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontSize: 38, fontWeight: 800, lineHeight: 1.1, margin: "0 0 8px" }}>
            10% OFF<br /><span style={{ color: "#fcd34d" }}>tu primera compra</span>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13 }}>Únete a +12,000 jóvenes que ya compraron</p>
        </div>
        <div style={{ padding: 32 }}>
          {!success ? (
            <>
              <p style={{ color: "#666", fontSize: 14, marginBottom: 16, lineHeight: 1.6 }}>
                Ingresa tu email y recibe <strong style={{ color: "#000" }}>GADGET10</strong> al instante.
              </p>
              <div style={{ display: "flex", gap: 8 }}>
                <input value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSubmit()} type="email" placeholder="tu@email.com"
                  style={{ flex: 1, border: "2px solid #e5e7eb", borderRadius: 14, padding: "13px 16px", fontSize: 14, outline: "none", fontFamily: "inherit" }}
                  onFocus={e => e.target.style.borderColor = "#000"} onBlur={e => e.target.style.borderColor = "#e5e7eb"} />
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={handleSubmit}
                  style={{ background: "#000", color: "#fff", border: "none", borderRadius: 14, padding: "13px 20px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>¡Quiero!</motion.button>
              </div>
              <button onClick={onClose} style={{ display: "block", width: "100%", textAlign: "center", marginTop: 14, fontSize: 12, color: "#bbb", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
                No gracias, pago precio completo
              </button>
            </>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: "center", padding: "16px 0" }}>
              <motion.div animate={{ scale: [0, 1.2, 1] }} transition={{ duration: 0.5 }} style={{ fontSize: 52, marginBottom: 12 }}>🎉</motion.div>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, marginBottom: 8 }}>¡Código enviado!</h3>
              <p style={{ color: "#666", fontSize: 14 }}>Usa <strong style={{ background: "#fef9c3", padding: "2px 10px", borderRadius: 8 }}>GADGET10</strong> al pagar.</p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

function SaleToast() {
  const SALES = [
    { text: "Alguien en Bogotá compró la Mini Impresora", time: "hace 3 min", emoji: "🖨️" },
    { text: "Alguien en Lima compró la Aspiradora", time: "hace 5 min", emoji: "🌀" },
    { text: "Alguien en Santiago compró la Selladora", time: "hace 8 min", emoji: "🔒" },
    { text: "Alguien en CDMX compró la Luz LED", time: "hace 11 min", emoji: "💡" },
  ]
  const [visible, setVisible] = useState(false)
  const [index, setIndex] = useState(0)
  useEffect(() => {
    const show = () => { setIndex(i => (i + 1) % SALES.length); setVisible(true); setTimeout(() => setVisible(false), 4000) }
    const initial = setTimeout(show, 5000)
    const timer = setInterval(show, 9000)
    return () => { clearTimeout(initial); clearInterval(timer) }
  }, [])
  return (
    <AnimatePresence>
      {visible && (
        <motion.div initial={{ opacity: 0, x: -80, scale: 0.9 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: -80, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          style={{ position: "fixed", bottom: 24, left: 24, zIndex: 40 }}>
          <div style={{ background: "#fff", border: "1px solid #f0f0f0", borderRadius: 18, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, maxWidth: 290, boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}>
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.4 }}
              style={{ width: 38, height: 38, background: "#dcfce7", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
              {SALES[index].emoji}
            </motion.div>
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: "#111", lineHeight: 1.4 }}>{SALES[index].text}</p>
              <p style={{ fontSize: 11, color: "#999", marginTop: 2 }}>{SALES[index].time}</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Countdown() {
  const [time, setTime] = useState(4 * 3600 + 23 * 60 + 47)
  useEffect(() => {
    const t = setInterval(() => setTime(s => s > 0 ? s - 1 : 0), 1000)
    return () => clearInterval(t)
  }, [])
  const h = String(Math.floor(time / 3600)).padStart(2, "0")
  const m = String(Math.floor((time % 3600) / 60)).padStart(2, "0")
  const s = String(time % 60).padStart(2, "0")
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      {[h, m, s].map((u, i) => (
        <span key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <motion.span key={u + i} initial={{ rotateX: 90, opacity: 0 }} animate={{ rotateX: 0, opacity: 1 }} transition={{ duration: 0.3 }}
            style={{ background: "#000", color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22, width: 48, height: 48, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}>
            {u}
          </motion.span>
          {i < 2 && <span style={{ color: "#666", fontWeight: 800, fontSize: 22 }}>:</span>}
        </span>
      ))}
    </div>
  )
}

function ProductCard({ product, index }) {
  const navigate = useNavigate()
  const { addToCart, cart } = useCart()
  const [added, setAdded] = useState(false)
  const inCart = cart.some(i => i.id === product.id)
  const discount = Math.round((1 - product.price / product.oldPrice) * 100)

  const handleAdd = (e) => {
    e.stopPropagation()
    addToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <ScrollReveal delay={index * 0.1} direction="up">
      <motion.div onClick={() => navigate(`/producto/${product.id}`)}
        whileHover={{ y: -8, boxShadow: "0 24px 48px rgba(0,0,0,0.14)" }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        style={{ background: "#fff", borderRadius: 24, border: product.highlight ? "2px solid #f97316" : "1px solid #f0f0f0", display: "flex", flexDirection: "column", overflow: "hidden", cursor: "pointer", boxShadow: product.highlight ? "0 0 0 4px rgba(249,115,22,0.12)" : "0 2px 12px rgba(0,0,0,0.06)" }}>
        {product.highlight && (
          <motion.div animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }} transition={{ duration: 3, repeat: Infinity }}
            style={{ background: "linear-gradient(90deg, #f97316, #ef4444, #f97316)", backgroundSize: "200%", color: "#fff", fontSize: 11, fontWeight: 800, textAlign: "center", padding: "8px 0", letterSpacing: 1.5, textTransform: "uppercase" }}>
            ⭐ Producto estrella — El más vendido
          </motion.div>
        )}
        <div style={{ background: "#f9fafb", position: "relative", height: 210, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
          <motion.img src={product.image} alt={product.name} whileHover={{ scale: 1.08 }} transition={{ duration: 0.4 }}
            style={{ width: "100%", height: "100%", objectFit: "contain", padding: 16 }} />
          <span style={{ position: "absolute", top: 12, left: 12, background: product.badgeColor, color: "#fff", fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 20 }}>{product.badge}</span>
          <motion.span animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }}
            style={{ position: "absolute", top: 12, right: 12, background: "#fee2e2", color: "#dc2626", fontSize: 11, fontWeight: 800, padding: "4px 8px", borderRadius: 20 }}>-{discount}%</motion.span>
          {product.stock <= 8 && (
            <motion.div animate={{ opacity: [1, 0.7, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
              style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(239,68,68,0.92)", color: "#fff", fontSize: 12, textAlign: "center", padding: "7px 0", fontWeight: 600 }}>
              ⚠️ Solo {product.stock} unidades disponibles
            </motion.div>
          )}
        </div>
        <div style={{ padding: 20, display: "flex", flexDirection: "column", flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <span style={{ color: "#f59e0b", fontSize: 13 }}>{"★".repeat(Math.round(product.rating))}</span>
            <span style={{ fontSize: 12, color: "#999" }}>{product.rating} ({product.reviews.toLocaleString()})</span>
          </div>
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 15, lineHeight: 1.3, marginBottom: 8, color: "#111" }}>{product.name}</h3>
          <p style={{ color: "#6b7280", fontSize: 13, lineHeight: 1.6, marginBottom: 16, flex: 1 }}>{product.shortDesc}</p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, paddingTop: 12, borderTop: "1px solid #f5f5f5", flexWrap: "wrap" }}>
            <div>
              <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22 }}>{clp(product.price)}</span>
              <span style={{ color: "#d1d5db", textDecoration: "line-through", fontSize: 13, marginLeft: 8 }}>{clp(product.oldPrice)}</span>
            </div>
            <motion.button onClick={handleAdd} whileTap={{ scale: 0.92 }} whileHover={{ scale: 1.06 }}
              animate={{ background: added ? "#22c55e" : inCart ? "#166534" : "#000" }}
              style={{ color: "#fff", border: "none", borderRadius: 12, padding: "10px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0, minWidth: 100 }}>
              <AnimatePresence mode="wait">
                <motion.span key={added ? "added" : "add"} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }}>
                  {added ? "✓ Agregado" : inCart ? "✓ En carrito" : "Agregar"}
                </motion.span>
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </ScrollReveal>
  )
}

function CartDrawer({ onClose }) {
  const navigate = useNavigate()
  const { cart, removeFromCart, cartTotal } = useCart()
  const totalOld = cart.reduce((s, i) => s + i.oldPrice * i.qty, 0)
  const saved = totalOld - cartTotal
  const freeShippingLeft = Math.max(0, 50000 - cartTotal)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", justifyContent: "flex-end" }}>
      <motion.div onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }} />
      <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 32 }}
        style={{ position: "relative", background: "#fff", width: "100%", maxWidth: 390, height: "100%", display: "flex", flexDirection: "column", boxShadow: "-12px 0 48px rgba(0,0,0,0.15)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid #f0f0f0" }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 20 }}>Tu carrito 🛒</h2>
          <motion.button whileHover={{ scale: 1.1, rotate: 90 }} onClick={onClose}
            style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#999" }}>✕</motion.button>
        </div>
        {cart.length > 0 && (
          <div style={{ padding: "12px 24px", background: "#f9fafb", borderBottom: "1px solid #f0f0f0" }}>
            {freeShippingLeft > 0 ? (
              <>
                <p style={{ fontSize: 12, color: "#555", marginBottom: 8 }}>Te faltan <strong style={{ color: "#000" }}>{clp(freeShippingLeft)}</strong> para envío gratis 🚚</p>
                <div style={{ background: "#e5e7eb", borderRadius: 999, height: 6, overflow: "hidden" }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, (cartTotal / 50) * 100)}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    style={{ background: "linear-gradient(90deg, #000, #333)", height: 6, borderRadius: 999 }} />
                </div>
              </>
            ) : (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontSize: 12, color: "#16a34a", fontWeight: 700 }}>🎉 ¡Envío gratis desbloqueado!</motion.p>
            )}
          </div>
        )}
        <div style={{ flex: 1, overflowY: "auto", padding: 24, display: "flex", flexDirection: "column", gap: 12 }}>
          <AnimatePresence>
            {cart.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", paddingTop: 80, color: "#999" }}>
                <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 2, repeat: Infinity }} style={{ fontSize: 56, marginBottom: 12 }}>🛒</motion.div>
                <p style={{ fontWeight: 600 }}>Tu carrito está vacío</p>
                <p style={{ fontSize: 13, marginTop: 4 }}>¡Agrega algo genial!</p>
              </motion.div>
            ) : cart.map(item => (
              <motion.div key={item.id} layout initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40, height: 0 }}
                style={{ display: "flex", alignItems: "center", gap: 12, background: "#f9fafb", borderRadius: 16, padding: 12 }}>
                <img src={item.image} alt={item.name} style={{ width: 52, height: 52, objectFit: "contain", borderRadius: 10, background: "#fff", flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 700, fontSize: 13, lineHeight: 1.3 }}>{item.name}</p>
                  <p style={{ color: "#999", fontSize: 12, marginTop: 2 }}>Cantidad: {item.qty}</p>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <p style={{ fontWeight: 800, fontSize: 14 }}>{clp(item.price * item.qty)}</p>
                  <motion.button whileHover={{ color: "#dc2626" }} onClick={() => removeFromCart(item.id)}
                    style={{ background: "none", border: "none", color: "#f87171", fontSize: 12, cursor: "pointer", marginTop: 2 }}>Quitar</motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        {cart.length > 0 && (
          <div style={{ padding: 24, borderTop: "1px solid #f0f0f0", display: "flex", flexDirection: "column", gap: 12 }}>
            {saved > 0 && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 12, padding: "10px 16px", textAlign: "center" }}>
                <p style={{ color: "#16a34a", fontSize: 13, fontWeight: 600 }}>🎉 Estás ahorrando <strong>{clp(saved)}</strong></p>
              </motion.div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "#666", fontWeight: 500 }}>Total</span>
              <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28 }}>{clp(cartTotal)}</span>
            </div>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => { onClose(); navigate("/checkout") }}
              style={{ background: "#000", color: "#fff", border: "none", borderRadius: 16, padding: 16, fontSize: 15, fontWeight: 800, cursor: "pointer", fontFamily: "'Syne', sans-serif" }}>
              Finalizar compra →
            </motion.button>
            <p style={{ textAlign: "center", fontSize: 11, color: "#aaa" }}>🔒 Pago seguro · Envío 5–8 días · Devolución 30 días</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

export default function Home() {
  const navigate = useNavigate()
  const [showPopup, setShowPopup] = useState(false)
  const [showCart, setShowCart] = useState(false)
  const { cartCount } = useCart()
  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 400], [0, -60])
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.3])

  useEffect(() => {
    const t = setTimeout(() => setShowPopup(true), 3000)
    return () => clearTimeout(t)
  }, [])

  return (
    <div style={{ background: "#ffffff", minHeight: "100vh", color: "#0a0a0a", fontFamily: "'DM Sans', sans-serif", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #ffffff !important; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #f1f1f1; }
        ::-webkit-scrollbar-thumb { background: #000; border-radius: 3px; }
      `}</style>

      <AnimatePresence>
        {showPopup && <Popup onClose={() => setShowPopup(false)} />}
        {showCart && <CartDrawer onClose={() => setShowCart(false)} />}
      </AnimatePresence>
      <SaleToast />

      <motion.div initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}
        style={{ background: "#000", color: "#fff", textAlign: "center", padding: "10px 16px", fontSize: 12, fontWeight: 500 }}>
        🚀 Envío GRATIS en pedidos +$50 &nbsp;·&nbsp; Entrega 5–8 días &nbsp;·&nbsp; Devolución 30 días sin preguntas
      </motion.div>

      <motion.nav initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        style={{ position: "sticky", top: 0, zIndex: 30, background: "rgba(255,255,255,0.92)", backdropFilter: "blur(20px)", borderBottom: "1px solid #f0f0f0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <motion.span whileHover={{ scale: 1.03 }} style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22, cursor: "default" }}>
            GADGET<span style={{ color: "#f97316" }}>DROP</span>
          </motion.span>
          <div style={{ display: "flex", gap: 32 }}>
            {["Productos", "Ofertas", "Contacto"].map((l, i) => (
              <motion.a key={l} href="#" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.08 }}
                whileHover={{ color: "#000" }} style={{ fontSize: 14, color: "#777", textDecoration: "none", fontWeight: 500 }}>{l}</motion.a>
            ))}
          </div>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowCart(true)}
            style={{ position: "relative", background: "#000", color: "#fff", border: "none", padding: "10px 22px", borderRadius: 999, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
            Carrito
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.span initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  style={{ position: "absolute", top: -8, right: -8, background: "#f97316", color: "#fff", fontSize: 11, fontWeight: 800, width: 20, height: 20, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {cartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.nav>

      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px 60px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 60, alignItems: "center" }}>
        <motion.div style={{ y: heroY, opacity: heroOpacity }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#fff7ed", border: "1px solid #fed7aa", color: "#f97316", fontSize: 12, fontWeight: 600, padding: "8px 16px", borderRadius: 999, marginBottom: 24 }}>
            <motion.span animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
              style={{ width: 8, height: 8, background: "#f97316", borderRadius: "50%", display: "inline-block" }} />
            +12,000 estudiantes ya compraron
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(38px, 4.5vw, 62px)", lineHeight: 1.04, letterSpacing: -2, marginBottom: 20, color: "#0a0a0a" }}>
            Gadgets que<br />
            <span style={{ background: "linear-gradient(135deg, #f97316 0%, #ef4444 50%, #f97316 100%)", backgroundSize: "200%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              hacen tu vida
            </span><br />
            más fácil
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{ color: "#6b7280", fontSize: 17, lineHeight: 1.75, marginBottom: 32, maxWidth: 420 }}>
            Tecnología accesible para estudiantes. Precios directos, sin intermediarios. Envío a toda Latinoamérica.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 40 }}>
            <motion.button whileHover={{ scale: 1.04, boxShadow: "0 12px 32px rgba(0,0,0,0.22)" }} whileTap={{ scale: 0.97 }}
              onClick={() => document.getElementById("productos").scrollIntoView({ behavior: "smooth" })}
              style={{ background: "#000", color: "#fff", border: "none", padding: "15px 32px", borderRadius: 999, fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
              Ver productos
            </motion.button>
            <motion.button whileHover={{ scale: 1.04, borderColor: "#000" }} whileTap={{ scale: 0.97 }}
              onClick={() => setShowPopup(true)}
              style={{ background: "transparent", color: "#000", border: "2px solid #e5e7eb", padding: "15px 28px", borderRadius: 999, fontWeight: 600, fontSize: 15, cursor: "pointer" }}>
              Obtener 10% OFF →
            </motion.button>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: "flex", gap: 36, paddingTop: 28, borderTop: "1px solid #f0f0f0" }}>
            {[["12K+", "Clientes"], ["4.9★", "Valoración"], ["30 días", "Devolución gratis"]].map(([val, label], i) => (
              <motion.div key={label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 + i * 0.1 }}>
                <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22 }}>{val}</p>
                <p style={{ color: "#9ca3af", fontSize: 12, marginTop: 2 }}>{label}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 60, scale: 0.95 }} animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{ background: "linear-gradient(135deg, #fff7ed 0%, #fef3c7 100%)", borderRadius: 40, padding: 48, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24, position: "relative", overflow: "hidden" }}>
          <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", border: "1px dashed rgba(249,115,22,0.2)", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
          <motion.div animate={{ rotate: [360, 0] }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            style={{ position: "absolute", width: 200, height: 200, borderRadius: "50%", border: "1px dashed rgba(239,68,68,0.15)", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
          <motion.img src={PRODUCTS[0].image} alt={PRODUCTS[0].name}
            animate={{ y: [0, -10, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            whileHover={{ scale: 1.08, rotate: 2 }}
            style={{ width: 200, height: 200, objectFit: "contain", position: "relative", zIndex: 1, filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.15))" }} />
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
            style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 2, marginBottom: 12 }}>⏳ Oferta termina en</p>
            <Countdown />
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1 }}
            whileHover={{ scale: 1.05 }}
            style={{ position: "relative", zIndex: 1, background: "#fff", borderRadius: 18, padding: "12px 20px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
            <p style={{ fontSize: 13, fontWeight: 600 }}>🔥 <strong>31 personas</strong> viendo esto ahora</p>
          </motion.div>
        </motion.div>
      </section>

      <ScrollReveal direction="up">
        <div style={{ borderTop: "1px solid #f0f0f0", borderBottom: "1px solid #f0f0f0", background: "#f9fafb" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "20px 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
            {[["🚚", "Envío gratis", "En pedidos +$50"], ["🔒", "Pago seguro", "SSL encriptado"], ["↩️", "30 días", "Devolución gratis"], ["⭐", "4.9 / 5", "+6,000 reseñas"]].map(([icon, title, sub], i) => (
              <motion.div key={title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 26 }}>{icon}</span>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 13 }}>{title}</p>
                  <p style={{ color: "#9ca3af", fontSize: 12 }}>{sub}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </ScrollReveal>

      <section id="productos" style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px" }}>
        <ScrollReveal direction="up">
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <motion.span animate={{ boxShadow: ["0 0 0 0 rgba(249,115,22,0.3)", "0 0 0 8px rgba(249,115,22,0)", "0 0 0 0 rgba(249,115,22,0)"] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ display: "inline-block", background: "#fff7ed", color: "#f97316", fontSize: 11, fontWeight: 800, padding: "8px 18px", borderRadius: 999, textTransform: "uppercase", letterSpacing: 2, marginBottom: 18 }}>
              🔥 Stock limitado
            </motion.span>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(28px, 4vw, 46px)", letterSpacing: -1.5, marginBottom: 12 }}>
              Los más pedidos esta semana
            </h2>
            <p style={{ color: "#6b7280", maxWidth: 440, margin: "0 auto", fontSize: 16 }}>Seleccionados por calidad, precio y viralidad. Todos con envío a Latinoamérica.</p>
          </div>
        </ScrollReveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 24 }}>
          {PRODUCTS.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      </section>

      <ScrollReveal direction="up">
        <div style={{ background: "#000", padding: "60px 24px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 32 }}>
            <div>
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, textTransform: "uppercase", letterSpacing: 2, marginBottom: 16 }}>Vistos en</p>
              <div style={{ display: "flex", gap: 36, flexWrap: "wrap" }}>
                {["TikTok", "Instagram", "YouTube", "Pinterest"].map((b, i) => (
                  <motion.span key={b} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                    whileHover={{ opacity: 0.8, y: -2 }}
                    style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, color: "rgba(255,255,255,0.25)", cursor: "default" }}>{b}</motion.span>
                ))}
              </div>
            </div>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} style={{ textAlign: "right" }}>
              <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 36, color: "#fff" }}>+12,000</p>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>clientes satisfechos en Latinoamérica</p>
            </motion.div>
          </div>
        </div>
      </ScrollReveal>

      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px" }}>
        <ScrollReveal direction="up">
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(26px, 4vw, 42px)", letterSpacing: -1, marginBottom: 12 }}>Lo que dicen nuestros clientes</h2>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <span style={{ color: "#f59e0b", fontSize: 18 }}>★★★★★</span>
              <span style={{ fontWeight: 700 }}>4.9 / 5</span>
              <span style={{ color: "#9ca3af", fontSize: 14 }}>· +6,000 reseñas verificadas</span>
            </div>
          </div>
        </ScrollReveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20 }}>
          {PRODUCTS.flatMap(p => p.reviews_list).slice(0, 4).map((r, i) => (
            <ScrollReveal key={i} delay={i * 0.1} direction="up">
              <motion.div whileHover={{ y: -4, boxShadow: "0 12px 32px rgba(0,0,0,0.08)" }} style={{ background: "#f9fafb", borderRadius: 24, padding: 24, height: "100%" }}>
                <span style={{ color: "#f59e0b", fontSize: 14 }}>{"★".repeat(r.stars)}</span>
                <p style={{ color: "#374151", fontSize: 13, lineHeight: 1.75, margin: "12px 0 20px" }}>"{r.text}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 36, height: 36, background: "#000", color: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, flexShrink: 0 }}>{r.avatar}</div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 13 }}>{r.name}</p>
                    <p style={{ color: "#9ca3af", fontSize: 12 }}>{r.city}</p>
                  </div>
                  <span style={{ marginLeft: "auto", color: "#22c55e", fontSize: 13 }}>✓</span>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 80px" }}>
        <ScrollReveal direction="scale">
          <motion.div whileHover={{ scale: 1.01 }}
            style={{ background: "#000", borderRadius: 40, padding: "64px 48px", textAlign: "center", position: "relative", overflow: "hidden" }}>
            <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }} transition={{ duration: 4, repeat: Infinity }}
              style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, #f97316, transparent)", top: "50%", left: "30%", transform: "translate(-50%,-50%)" }} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(28px, 4vw, 50px)", color: "#fff", letterSpacing: -1.5, marginBottom: 16 }}>
                ¿Todavía lo estás pensando?
              </motion.h2>
              <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
                style={{ color: "rgba(255,255,255,0.5)", fontSize: 17, maxWidth: 380, margin: "0 auto 32px" }}>
                Obtén tu 10% de descuento antes de que expire la oferta.
              </motion.p>
              <motion.button whileHover={{ scale: 1.05, boxShadow: "0 12px 32px rgba(255,255,255,0.2)" }} whileTap={{ scale: 0.97 }}
                onClick={() => setShowPopup(true)}
                style={{ background: "#fff", color: "#000", border: "none", padding: "16px 44px", borderRadius: 999, fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 15, cursor: "pointer" }}>
                Obtener descuento →
              </motion.button>
            </div>
          </motion.div>
        </ScrollReveal>
      </section>

      <footer style={{ borderTop: "1px solid #f0f0f0", padding: "40px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 20 }}>GADGET<span style={{ color: "#f97316" }}>DROP</span></span>
          <p style={{ color: "#9ca3af", fontSize: 13 }}>© 2025 GadgetDrop · Todos los derechos reservados</p>
          <div style={{ display: "flex", gap: 24 }}>
            {["Privacidad", "Términos", "Contacto"].map(l => (
              <motion.a key={l} href="#" whileHover={{ color: "#000" }} style={{ fontSize: 13, color: "#9ca3af", textDecoration: "none" }}>{l}</motion.a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}