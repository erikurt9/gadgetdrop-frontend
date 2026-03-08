import { clp } from "../utils/format"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { initMercadoPago, CardPayment } from "@mercadopago/sdk-react"
import { useCart } from "../context/CartContext"
import { motion, AnimatePresence } from "framer-motion"

initMercadoPago(import.meta.env.VITE_MP_PUBLIC_KEY, { locale: "es-CL" })

function Stars({ n }) {
  return <span style={{ color: "#f59e0b", fontSize: 13 }}>{"★".repeat(n)}{"☆".repeat(5 - n)}</span>
}

export default function Checkout() {
  const navigate = useNavigate()
  const { cart, cartTotal, removeFromCart } = useCart()
  const [step, setStep] = useState(1) // 1: resumen, 2: datos, 3: pago, 4: éxito
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [form, setForm] = useState({
    nombre: "", email: "", telefono: "",
    direccion: "", ciudad: "", region: "", codigoPostal: ""
  })

  const totalOld = cart.reduce((s, i) => s + i.oldPrice * i.qty, 0)
  const saved = totalOld - cartTotal
  const shipping = cartTotal >= 50000 ? 0 : 4990
  const total = Math.round(cartTotal + shipping) // CLP no acepta decimales

  useEffect(() => { if (cart.length === 0 && step !== 4) navigate("/") }, [cart])

  const handleForm = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const formValid = form.nombre && form.email && form.telefono && form.direccion && form.ciudad && form.region

  const onPaymentSubmit = async (formData) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/process-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // formData viene del CardPayment: token, issuer_id, payment_method_id, etc.
          ...formData,
          transaction_amount: total,
          customer: form,
          items: cart,
        })
      })

      const data = await response.json()

      if (!response.ok) {
        // Backend retornó error (pago rechazado, etc.)
        setError(data.error || `Pago rechazado: ${data.detail || "Verifica los datos de tu tarjeta."}`)
        return
      }

      if (data.status === "approved") {
        setStep(4)
      } else if (data.status === "pending") {
        setError("Tu pago está en revisión. Te notificaremos por email cuando se confirme.")
      } else {
        setError("Pago no aprobado. Intenta con otra tarjeta.")
      }
    } catch (e) {
      console.error("Error en pago:", e)
      setError("No se pudo conectar con el servidor. Verifica que el backend esté corriendo.")
    } finally {
      setLoading(false)
    }
  }

  const onPaymentError = (error) => {
    setError("Error en el pago. Verifica los datos de tu tarjeta.")
  }

  const inputStyle = {
    width: "100%", border: "2px solid #e5e7eb", borderRadius: 14,
    padding: "13px 16px", fontSize: 14, outline: "none",
    fontFamily: "inherit", transition: "border-color 0.2s", background: "#fff"
  }

  const labelStyle = { fontSize: 12, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6, display: "block" }

  return (
    <div style={{ background: "#f9fafb", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", color: "#0a0a0a" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f9fafb !important; }
        input:focus { border-color: #000 !important; }
      `}</style>

      {/* NAV */}
      <nav style={{ background: "#fff", borderBottom: "1px solid #f0f0f0", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span onClick={() => navigate("/")} style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 20, cursor: "pointer" }}>
          GADGET<span style={{ color: "#f97316" }}>DROP</span>
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#9ca3af" }}>
          <span style={{ color: step >= 1 ? "#000" : "#9ca3af", fontWeight: step === 1 ? 700 : 400 }}>Resumen</span>
          <span>›</span>
          <span style={{ color: step >= 2 ? "#000" : "#9ca3af", fontWeight: step === 2 ? 700 : 400 }}>Envío</span>
          <span>›</span>
          <span style={{ color: step >= 3 ? "#000" : "#9ca3af", fontWeight: step === 3 ? 700 : 400 }}>Pago</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#6b7280" }}>
          <span>🔒</span> Pago seguro
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px", display: "grid", gridTemplateColumns: "1fr 380px", gap: 32, alignItems: "start" }}>

        {/* LEFT */}
        <div>
          <AnimatePresence mode="wait">

            {/* STEP 1 — Resumen */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.35 }}>
                <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, marginBottom: 24 }}>Tu pedido</h1>
                <div style={{ background: "#fff", borderRadius: 24, overflow: "hidden", border: "1px solid #f0f0f0" }}>
                  {cart.map((item, i) => (
                    <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 16, padding: "20px 24px", borderBottom: i < cart.length - 1 ? "1px solid #f5f5f5" : "none" }}>
                      <img src={item.image} alt={item.name} style={{ width: 64, height: 64, objectFit: "contain", borderRadius: 12, background: "#f9fafb", flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{item.name}</p>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <Stars n={Math.round(item.rating)} />
                          <span style={{ fontSize: 12, color: "#9ca3af" }}>({item.reviews.toLocaleString()})</span>
                        </div>
                        <p style={{ fontSize: 13, color: "#9ca3af", marginTop: 4 }}>Cantidad: {item.qty}</p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18 }}>{clp(item.price * item.qty)}</p>
                        <p style={{ color: "#d1d5db", textDecoration: "line-through", fontSize: 12 }}>{clp(item.oldPrice * item.qty)}</p>
                        <button onClick={() => removeFromCart(item.id)} style={{ background: "none", border: "none", color: "#f87171", fontSize: 12, cursor: "pointer", marginTop: 4 }}>Quitar</button>
                      </div>
                    </div>
                  ))}
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => setStep(2)}
                  style={{ width: "100%", background: "#000", color: "#fff", border: "none", padding: "16px", borderRadius: 16, fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16, cursor: "pointer", marginTop: 20 }}
                >Continuar con el envío →</motion.button>
                <button onClick={() => navigate("/")} style={{ width: "100%", background: "none", border: "none", color: "#9ca3af", fontSize: 13, cursor: "pointer", marginTop: 12, textDecoration: "underline" }}>
                  ← Volver a la tienda
                </button>
              </motion.div>
            )}

            {/* STEP 2 — Datos de envío */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.35 }}>
                <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, marginBottom: 24 }}>Datos de envío</h1>
                <div style={{ background: "#fff", borderRadius: 24, padding: 28, border: "1px solid #f0f0f0", display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div>
                      <label style={labelStyle}>Nombre completo</label>
                      <input name="nombre" value={form.nombre} onChange={handleForm} placeholder="Juan Pérez" style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Teléfono</label>
                      <input name="telefono" value={form.telefono} onChange={handleForm} placeholder="+56 9 1234 5678" style={inputStyle} />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Email</label>
                    <input name="email" value={form.email} onChange={handleForm} type="email" placeholder="juan@email.com" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Dirección</label>
                    <input name="direccion" value={form.direccion} onChange={handleForm} placeholder="Av. Providencia 1234, Depto 56" style={inputStyle} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                    <div>
                      <label style={labelStyle}>Ciudad</label>
                      <input name="ciudad" value={form.ciudad} onChange={handleForm} placeholder="Santiago" style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Región</label>
                      <select name="region" value={form.region} onChange={handleForm} style={{ ...inputStyle, cursor: "pointer" }}>
                        <option value="">Selecciona</option>
                        {["Metropolitana", "Valparaíso", "Biobío", "La Araucanía", "Los Lagos", "Coquimbo", "O'Higgins", "Maule", "Antofagasta", "Tarapacá", "Atacama", "Los Ríos", "Arica y Parinacota", "Aysén", "Magallanes"].map(r => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Código postal</label>
                      <input name="codigoPostal" value={form.codigoPostal} onChange={handleForm} placeholder="7500000" style={inputStyle} />
                    </div>
                  </div>

                  {/* Opciones de envío */}
                  <div style={{ marginTop: 8 }}>
                    <label style={labelStyle}>Método de envío</label>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {[
                        { id: "starken", name: "Starken", time: "2-4 días hábiles", price: cartTotal >= 50000 ? "GRATIS" : "$4.990" },
                        { id: "chilexpress", name: "Chilexpress", time: "3-5 días hábiles", price: cartTotal >= 50000 ? "GRATIS" : "$5.990" },
                      ].map(op => (
                        <div key={op.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", border: "2px solid #e5e7eb", borderRadius: 14, padding: "14px 18px", cursor: "pointer" }}
                          onClick={e => e.currentTarget.style.borderColor = "#000"}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <span style={{ fontSize: 20 }}>🚚</span>
                            <div>
                              <p style={{ fontWeight: 700, fontSize: 14 }}>{op.name}</p>
                              <p style={{ fontSize: 12, color: "#9ca3af" }}>{op.time}</p>
                            </div>
                          </div>
                          <span style={{ fontWeight: 700, fontSize: 14, color: op.price === "GRATIS" ? "#16a34a" : "#000" }}>{op.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: formValid ? 1.02 : 1 }} whileTap={{ scale: formValid ? 0.98 : 1 }}
                  onClick={() => formValid && setStep(3)}
                  style={{ width: "100%", background: formValid ? "#000" : "#d1d5db", color: "#fff", border: "none", padding: "16px", borderRadius: 16, fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16, cursor: formValid ? "pointer" : "not-allowed", marginTop: 20, transition: "background 0.2s" }}
                >Continuar al pago →</motion.button>
                <button onClick={() => setStep(1)} style={{ width: "100%", background: "none", border: "none", color: "#9ca3af", fontSize: 13, cursor: "pointer", marginTop: 12, textDecoration: "underline" }}>
                  ← Volver al resumen
                </button>
              </motion.div>
            )}

            {/* STEP 3 — Pago */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.35 }}>
                <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, marginBottom: 8 }}>Pago seguro</h1>
                <p style={{ color: "#9ca3af", fontSize: 14, marginBottom: 24 }}>🔒 Tu información está encriptada y protegida</p>

                {error && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 14, padding: "14px 18px", marginBottom: 20, color: "#dc2626", fontSize: 14 }}>
                    ⚠️ {error}
                  </motion.div>
                )}

                <div style={{ background: "#fff", borderRadius: 24, padding: 28, border: "1px solid #f0f0f0" }}>
                  <div style={{ marginBottom: 20, padding: "14px 18px", background: "#f9fafb", borderRadius: 14 }}>
                    <p style={{ fontSize: 13, color: "#6b7280" }}>Enviando a: <strong style={{ color: "#000" }}>{form.nombre} — {form.direccion}, {form.ciudad}</strong></p>
                  </div>
                  <CardPayment
                    initialization={{ amount: total }}
                    onSubmit={onPaymentSubmit}
                    onError={onPaymentError}
                    customization={{
                      paymentMethods: { minInstallments: 1, maxInstallments: 12 },
                      visual: {
                        style: {
                          theme: "default",
                          customVariables: {
                            formBackgroundColor: "#ffffff",
                            baseColor: "#000000",
                            baseColorFirstVariant: "#333333",
                            borderRadiusFull: "14px",
                            borderRadiusMedium: "14px",
                          }
                        }
                      }
                    }}
                  />
                </div>
                <button onClick={() => setStep(2)} style={{ width: "100%", background: "none", border: "none", color: "#9ca3af", fontSize: 13, cursor: "pointer", marginTop: 16, textDecoration: "underline" }}>
                  ← Volver a datos de envío
                </button>
              </motion.div>
            )}

            {/* STEP 4 — Éxito */}
            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
                <div style={{ background: "#fff", borderRadius: 32, padding: 48, border: "1px solid #f0f0f0", textAlign: "center" }}>
                  <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
                    style={{ width: 80, height: 80, background: "#dcfce7", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, margin: "0 auto 24px" }}
                  >✓</motion.div>
                  <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 32, marginBottom: 12 }}>
                    ¡Pedido confirmado!
                  </motion.h2>
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} style={{ color: "#6b7280", fontSize: 16, lineHeight: 1.7, marginBottom: 32, maxWidth: 400, margin: "0 auto 32px" }}>
                    Hemos enviado la confirmación a <strong style={{ color: "#000" }}>{form.email}</strong>. Tu pedido llegará en <strong style={{ color: "#000" }}>2-5 días hábiles</strong>.
                  </motion.p>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} style={{ background: "#f9fafb", borderRadius: 20, padding: 20, marginBottom: 32, textAlign: "left" }}>
                    <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Resumen del pedido:</p>
                    {cart.map(item => (
                      <div key={item.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "#6b7280", marginBottom: 6 }}>
                        <span>{item.name} x{item.qty}</span>
                        <span style={{ fontWeight: 600, color: "#000" }}>{clp(item.price * item.qty)}</span>
                      </div>
                    ))}
                    <div style={{ borderTop: "1px solid #e5e7eb", marginTop: 12, paddingTop: 12, display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontWeight: 800 }}>Total pagado</span>
                      <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18 }}>{clp(total)}</span>
                    </div>
                  </motion.div>
                  <motion.button
                    whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                    onClick={() => navigate("/")}
                    style={{ background: "#000", color: "#fff", border: "none", padding: "14px 36px", borderRadius: 999, fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15, cursor: "pointer" }}
                  >Volver a la tienda</motion.button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* RIGHT — Resumen del pedido */}
        {step !== 4 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ position: "sticky", top: 24 }}>
            <div style={{ background: "#fff", borderRadius: 24, padding: 24, border: "1px solid #f0f0f0" }}>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, marginBottom: 20 }}>Resumen</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
                {cart.map(item => (
                  <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ position: "relative" }}>
                      <img src={item.image} alt={item.name} style={{ width: 48, height: 48, objectFit: "contain", borderRadius: 10, background: "#f9fafb" }} />
                      <span style={{ position: "absolute", top: -6, right: -6, background: "#000", color: "#fff", width: 18, height: 18, borderRadius: "50%", fontSize: 10, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{item.qty}</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 600, fontSize: 13, lineHeight: 1.3 }}>{item.name}</p>
                    </div>
                    <span style={{ fontWeight: 700, fontSize: 14, flexShrink: 0 }}>{clp(item.price * item.qty)}</span>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "#6b7280" }}>
                  <span>Subtotal</span>
                  <span>{clp(cartTotal)}</span>
                </div>
                {saved > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "#16a34a", fontWeight: 600 }}>
                    <span>Descuento</span>
                    <span>-{clp(saved)}</span>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "#6b7280" }}>
                  <span>Envío</span>
                  <span style={{ color: shipping === 0 ? "#16a34a" : "#000", fontWeight: shipping === 0 ? 600 : 400 }}>{shipping === 0 ? "GRATIS 🎉" : `${clp(shipping)}`}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #f0f0f0", paddingTop: 12, marginTop: 4 }}>
                  <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16 }}>Total</span>
                  <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 20 }}>{clp(total)}</span>
                </div>
              </div>
              {saved > 0 && (
                <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 12, padding: "10px 14px", marginTop: 16, textAlign: "center" }}>
                  <p style={{ color: "#16a34a", fontSize: 13, fontWeight: 600 }}>🎉 Estás ahorrando {clp(saved)}</p>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 20 }}>
                {["🔒", "🛡️", "✅"].map((icon, i) => (
                  <span key={i} style={{ fontSize: 20 }}>{icon}</span>
                ))}
              </div>
              <p style={{ textAlign: "center", fontSize: 11, color: "#9ca3af", marginTop: 8 }}>Pago 100% seguro con MercadoPago</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}