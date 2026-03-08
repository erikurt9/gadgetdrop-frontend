E-commerce fullstack de dropshipping construido con React + Vite. Integra pagos en tiempo real con MercadoPago y se conecta a un backend Node.js para el procesamiento de órdenes.

🔗 **Demo en vivo:** [gadgetdrop-frontend.vercel.app](https://gadgetdrop-frontend.vercel.app)

---

## Stack tecnológico

- **React 18** + **Vite** — UI y bundling
- **Tailwind CSS** + estilos inline — diseño responsivo
- **Framer Motion** — animaciones y transiciones
- **MercadoPago SDK React** — formulario de pago directo (CardPayment)
- **React Router** — navegación entre páginas
- **Context API** — estado global del carrito

---

## Funcionalidades

- Catálogo de productos con carrusel de imágenes y video
- Carrito con drawer animado y contador
- Checkout multi-paso: resumen → datos de envío → pago
- Integración con **MercadoPago CardPayment** (pago directo con tokenización de tarjeta, sin redirección)
- Precios en CLP con formato chileno (`$63.000`)
- Envío gratis automático sobre $50.000 CLP
- Página de confirmación de pedido
- Diseño mobile-friendly

---

## Estructura del proyecto

```
src/
├── components/
│   ├── Navbar.jsx          # Navegación con contador de carrito
│   ├── CartDrawer.jsx       # Carrito lateral animado
│   ├── ProductCard.jsx      # Tarjeta de producto
│   └── AnimatedSection.jsx  # Wrapper de animaciones scroll
├── context/
│   └── CartContext.jsx      # Estado global del carrito
├── data/
│   └── products.js          # Catálogo de productos
├── pages/
│   ├── Home.jsx             # Página principal
│   ├── ProductDetail.jsx    # Detalle de producto con galería y video
│   └── Checkout.jsx         # Flujo de pago 4 pasos
└── utils/
    └── format.js            # Helper de formato CLP
```

---

## Variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_MP_PUBLIC_KEY=TEST-tu-public-key-de-mercadopago
VITE_API_URL=https://tu-backend.onrender.com
```

---

## Instalación y desarrollo

```bash
npm install
npm run dev
```

El proxy de Vite redirige `/api/*` al backend en `localhost:3000` automáticamente durante desarrollo.

---

## Deploy

El proyecto está desplegado en **Vercel**. Cualquier push a `main` redespliega automáticamente.

```bash
git add .
git commit -m "cambios"
git push
```

---

## Repositorio relacionado

Backend: [github.com/erikurt9/gadgetdrop-backend](https://github.com/erikurt9/gadgetdrop-backend)
