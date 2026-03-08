import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { PRODUCTS } from "../data/products"
import { useCart } from "../context/CartContext"

function Stars({ n, size = 14 }) {
  return <span style={{ color: "#f59e0b", fontSize: size }}>{"★".repeat(n)}{"☆".repeat(5 - n)}</span>
}

function CartDrawer({ onClose }) {
  const navigate = useNavigate()
  const { cart, removeFromCart, cartTotal } = useCart()
  const totalOld = cart.reduce((s, i) => s + i.oldPrice * i.qty, 0)
  const saved = totalOld - cartTotal
  const freeShippingLeft = Math.max(0, 50 - cartTotal)

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
                <p style={{ fontSize: 12, color: "#555", marginBottom: 8 }}>Te faltan <strong style={{ color: "#000" }}>${freeShippingLeft.toFixed(2)}</strong> para envío gratis 🚚</p>
                <div style={{ background: "#e5e7eb", borderRadius: 999, height: 6, overflow: "hidden" }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, (cartTotal / 50) * 100)}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    style={{ background: "linear-gradient(90deg, #000, #333)", height: 6, borderRadius: 999 }} />
                </div>
              </>
            ) : (
              <p style={{ fontSize: 12, color: "#16a34a", fontWeight: 700 }}>🎉 ¡Envío gratis desbloqueado!</p>
            )}
          </div>
        )}
        <div style={{ flex: 1, overflowY: "auto", padding: 24, display: "flex", flexDirection: "column", gap: 12 }}>
          <AnimatePresence>
            {cart.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", paddingTop: 80, color: "#999" }}>
                <div style={{ fontSize: 56, marginBottom: 12 }}>🛒</div>
                <p style={{ fontWeight: 600 }}>Tu carrito está vacío</p>
              </motion.div>
            ) : cart.map(item => (
              <motion.div key={item.id} layout initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }}
                style={{ display: "flex", alignItems: "center", gap: 12, background: "#f9fafb", borderRadius: 16, padding: 12 }}>
                <img src={item.image} alt={item.name} style={{ width: 52, height: 52, objectFit: "contain", borderRadius: 10, background: "#fff", flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 700, fontSize: 13, lineHeight: 1.3 }}>{item.name}</p>
                  <p style={{ color: "#999", fontSize: 12, marginTop: 2 }}>Cantidad: {item.qty}</p>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <p style={{ fontWeight: 800, fontSize: 14 }}>${(item.price * item.qty).toFixed(2)}</p>
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
              <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 12, padding: "10px 16px", textAlign: "center" }}>
                <p style={{ color: "#16a34a", fontSize: 13, fontWeight: 600 }}>🎉 Estás ahorrando <strong>${saved.toFixed(2)}</strong></p>
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "#666", fontWeight: 500 }}>Total</span>
              <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28 }}>${cartTotal.toFixed(2)}</span>
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

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart, cartCount } = useCart()
  const product = PRODUCTS.find(p => p.id === Number(id))

  const [showCart, setShowCart] = useState(false)
  const [qty, setQty] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [openFaq, setOpenFaq] = useState(null)
  const [added, setAdded] = useState(false)

  if (!product) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
      <p style={{ fontSize: 20, fontWeight: 700 }}>Producto no encontrado</p>
      <button onClick={() => navigate("/")} style={{ background: "#000", color: "#fff", border: "none", padding: "12px 28px", borderRadius: 999, cursor: "pointer", fontWeight: 700 }}>Volver</button>
    </div>
  )

  const handleAddToCart = () => {
    addToCart(product, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const discount = Math.round((1 - product.price / product.oldPrice) * 100)
  const related = PRODUCTS.filter(p => p.id !== product.id).slice(0, 3)

  return (
    <div style={{ background: "#fff", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", color: "#0a0a0a" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #fff !important; }
      `}</style>

      <AnimatePresence>
        {showCart && <CartDrawer onClose={() => setShowCart(false)} />}
      </AnimatePresence>

      {/* NAV */}
      <div style={{ background: "#000", color: "#fff", textAlign: "center", padding: "10px 16px", fontSize: 12, fontWeight: 500 }}>
        🚀 Envío GRATIS en pedidos +$50 · Entrega 5–8 días · Devolución 30 días
      </div>
      <nav style={{ position: "sticky", top: 0, zIndex: 30, background: "rgba(255,255,255,0.92)", backdropFilter: "blur(16px)", borderBottom: "1px solid #f0f0f0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <motion.span onClick={() => navigate("/")} whileHover={{ scale: 1.03 }}
            style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22, cursor: "pointer" }}>
            GADGET<span style={{ color: "#f97316" }}>DROP</span>
          </motion.span>
          <motion.button onClick={() => navigate("/")} whileHover={{ x: -3 }}
            style={{ background: "none", border: "none", color: "#666", fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontWeight: 500 }}>
            ← Volver a la tienda
          </motion.button>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowCart(true)}
            style={{ position: "relative", background: "#000", color: "#fff", border: "none", padding: "10px 22px", borderRadius: 999, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
            Carrito
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  style={{ position: "absolute", top: -8, right: -8, background: "#f97316", color: "#fff", fontSize: 11, fontWeight: 800, width: 20, height: 20, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {cartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </nav>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px" }}>

        {/* BREADCRUMB */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 32, fontSize: 13, color: "#999" }}>
          <span onClick={() => navigate("/")} style={{ cursor: "pointer", color: "#f97316", fontWeight: 600 }}>Inicio</span>
          <span>›</span>
          <span style={{ color: "#0a0a0a" }}>{product.name}</span>
        </motion.div>

        {/* MAIN GRID */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 60, marginBottom: 80 }}>

          {/* Gallery */}
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
            <div style={{ background: "#f9fafb", borderRadius: 32, overflow: "hidden", marginBottom: 16, position: "relative" }}>
              <motion.img key={activeImage} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}
                src={product.images[activeImage]} alt={product.name}
                style={{ width: "100%", aspectRatio: "1", objectFit: "contain", padding: 40 }} />
              <span style={{ position: "absolute", top: 16, left: 16, background: product.badgeColor, color: "#fff", fontSize: 12, fontWeight: 700, padding: "5px 12px", borderRadius: 20 }}>{product.badge}</span>
              <span style={{ position: "absolute", top: 16, right: 16, background: "#fee2e2", color: "#dc2626", fontSize: 12, fontWeight: 800, padding: "5px 10px", borderRadius: 20 }}>-{discount}%</span>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              {product.images.map((img, i) => (
                <motion.div key={i} onClick={() => setActiveImage(i)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  style={{ width: 72, height: 72, borderRadius: 16, background: "#f9fafb", border: activeImage === i ? "2px solid #f97316" : "2px solid transparent", cursor: "pointer", overflow: "hidden", flexShrink: 0 }}>
                  <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "contain", padding: 8 }} />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Info */}
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Stars n={Math.round(product.rating)} size={16} />
              <span style={{ fontWeight: 700, fontSize: 14 }}>{product.rating}</span>
              <span style={{ color: "#9ca3af", fontSize: 13 }}>({product.reviews.toLocaleString()} reseñas)</span>
              {product.stock <= 8 && (
                <motion.span animate={{ opacity: [1, 0.6, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
                  style={{ marginLeft: "auto", background: "#fef2f2", color: "#ef4444", fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 20 }}>
                  ⚠️ Solo {product.stock} restantes
                </motion.span>
              )}
            </div>

            <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(24px, 3vw, 36px)", lineHeight: 1.1, letterSpacing: -1 }}>
              {product.name}
            </h1>

            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 40 }}>${product.price}</span>
              <span style={{ color: "#d1d5db", textDecoration: "line-through", fontSize: 20 }}>${product.oldPrice}</span>
              <motion.span animate={{ scale: [1, 1.03, 1] }} transition={{ duration: 2, repeat: Infinity }}
                style={{ background: "#dcfce7", color: "#16a34a", fontSize: 13, fontWeight: 700, padding: "4px 10px", borderRadius: 20 }}>
                Ahorras ${(product.oldPrice - product.price).toFixed(2)}
              </motion.span>
            </div>

            <p style={{ color: "#6b7280", fontSize: 15, lineHeight: 1.8 }}>{product.desc}</p>

            <div style={{ background: "#f9fafb", borderRadius: 20, padding: 20, display: "flex", flexDirection: "column", gap: 10 }}>
              {product.features.map((f, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.08 }}
                  style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "#374151" }}>
                  <span style={{ color: "#22c55e", fontWeight: 700, fontSize: 16 }}>✓</span>
                  {f}
                </motion.div>
              ))}
            </div>

            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>Cantidad</p>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", border: "2px solid #e5e7eb", borderRadius: 14, overflow: "hidden" }}>
                  <motion.button whileTap={{ scale: 0.9 }} onClick={() => setQty(q => Math.max(1, q - 1))}
                    style={{ width: 44, height: 44, background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#374151", fontWeight: 700 }}>−</motion.button>
                  <span style={{ width: 44, textAlign: "center", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16 }}>{qty}</span>
                  <motion.button whileTap={{ scale: 0.9 }} onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                    style={{ width: 44, height: 44, background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#374151", fontWeight: 700 }}>+</motion.button>
                </div>
                <span style={{ fontSize: 13, color: "#9ca3af" }}>{product.stock} disponibles</span>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <motion.button onClick={handleAddToCart} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                animate={{ background: added ? "#22c55e" : "#000" }}
                style={{ color: "#fff", border: "none", padding: "16px 32px", borderRadius: 16, fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16, cursor: "pointer" }}>
                <AnimatePresence mode="wait">
                  <motion.span key={added ? "added" : "add"} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }}>
                    {added ? `✓ ¡Agregado al carrito!` : `Agregar al carrito — $${(product.price * qty).toFixed(2)}`}
                  </motion.span>
                </AnimatePresence>
              </motion.button>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={() => { handleAddToCart(); setShowCart(true) }}
                style={{ background: "#f97316", color: "#fff", border: "none", padding: "16px 32px", borderRadius: 16, fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16, cursor: "pointer" }}>
                Comprar ahora →
              </motion.button>
            </div>

            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", paddingTop: 4 }}>
              {[["🔒", "Pago seguro"], ["🚚", "Envío gratis +$50"], ["↩️", "30 días devolución"]].map(([icon, label]) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#6b7280" }}>
                  <span>{icon}</span><span>{label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        
        {/* VIDEO */}
        {product.video && (
          <motion.section
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            style={{ marginBottom: 80 }}
          >
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: -0.5, marginBottom: 24 }}>
              Ve el producto en acción
            </h2>
            <div style={{ borderRadius: 28, overflow: "hidden", background: "#000", maxWidth: 720, margin: "0 auto" }}>
              <video
                src={product.video}
                controls
                autoPlay
                muted
                loop
                playsInline
                style={{ width: "100%", display: "block", maxHeight: 480, objectFit: "cover" }}
              />
            </div>
          </motion.section>
        )}

        {/* REVIEWS */}
        <section style={{ marginBottom: 80 }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: -0.5, marginBottom: 8 }}>Reseñas del producto</h2>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
            <Stars n={5} size={20} />
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22 }}>{product.rating}</span>
            <span style={{ color: "#9ca3af" }}>· {product.reviews.toLocaleString()} reseñas verificadas</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
            {product.reviews_list.map((r, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4, boxShadow: "0 12px 32px rgba(0,0,0,0.08)" }}
                style={{ background: "#f9fafb", borderRadius: 24, padding: 24 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <Stars n={r.stars} />
                  <span style={{ fontSize: 12, color: "#9ca3af" }}>{r.date}</span>
                </div>
                <p style={{ color: "#374151", fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>"{r.text}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 36, height: 36, background: "#000", color: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800 }}>{r.avatar}</div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 13 }}>{r.name}</p>
                    <p style={{ color: "#9ca3af", fontSize: 12 }}>{r.city}</p>
                  </div>
                  <span style={{ marginLeft: "auto", color: "#22c55e", fontSize: 13, fontWeight: 600 }}>✓ Verificado</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section style={{ marginBottom: 80 }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: -0.5, marginBottom: 24 }}>Preguntas frecuentes</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {product.faqs.map((faq, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                style={{ border: "1px solid #f0f0f0", borderRadius: 20, overflow: "hidden" }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px", background: openFaq === i ? "#f9fafb" : "#fff", border: "none", cursor: "pointer", textAlign: "left" }}>
                  <span style={{ fontWeight: 700, fontSize: 15, color: "#0a0a0a" }}>{faq.q}</span>
                  <motion.span animate={{ rotate: openFaq === i ? 45 : 0 }} transition={{ duration: 0.2 }}
                    style={{ fontSize: 20, color: "#9ca3af", flexShrink: 0, marginLeft: 16 }}>+</motion.span>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}
                      style={{ overflow: "hidden" }}>
                      <div style={{ padding: "0 24px 20px", color: "#6b7280", fontSize: 14, lineHeight: 1.8 }}>{faq.a}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </section>

        {/* RELATED */}
        <section style={{ marginBottom: 80 }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: -0.5, marginBottom: 32 }}>También te puede interesar</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 24 }}>
            {related.map((p, i) => {
              const d = Math.round((1 - p.price / p.oldPrice) * 100)
              return (
                <motion.div key={p.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  onClick={() => { navigate(`/producto/${p.id}`); window.scrollTo(0, 0) }}
                  whileHover={{ y: -6, boxShadow: "0 16px 40px rgba(0,0,0,0.12)" }}
                  style={{ background: "#fff", borderRadius: 24, border: "1px solid #f0f0f0", overflow: "hidden", cursor: "pointer", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                  <div style={{ background: "#f9fafb", height: 180, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                    <motion.img src={p.image} alt={p.name} whileHover={{ scale: 1.06 }} transition={{ duration: 0.3 }}
                      style={{ width: "100%", height: "100%", objectFit: "contain", padding: 16 }} />
                    <span style={{ position: "absolute", top: 10, right: 10, background: "#fee2e2", color: "#dc2626", fontSize: 11, fontWeight: 800, padding: "3px 8px", borderRadius: 20 }}>-{d}%</span>
                  </div>
                  <div style={{ padding: 16 }}>
                    <Stars n={Math.round(p.rating)} />
                    <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 15, lineHeight: 1.3, margin: "8px 0 4px" }}>{p.name}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 20 }}>${p.price}</span>
                      <span style={{ color: "#d1d5db", textDecoration: "line-through", fontSize: 13 }}>${p.oldPrice}</span>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </section>

      </div>

      <footer style={{ borderTop: "1px solid #f0f0f0", padding: "40px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 20 }}>GADGET<span style={{ color: "#f97316" }}>DROP</span></span>
          <p style={{ color: "#9ca3af", fontSize: 13 }}>© 2025 GadgetDrop · Todos los derechos reservados</p>
          <div style={{ display: "flex", gap: 24 }}>
            {["Privacidad", "Términos", "Contacto"].map(l => (
              <a key={l} href="#" style={{ fontSize: 13, color: "#9ca3af", textDecoration: "none" }}>{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}