import { useState, useEffect } from "react";

const initialProducts = [
  { id: 1, name: "Floral Frock", category: "Girls", size: ["2-3Y","4-5Y","6-7Y"], price: 1200, stock: 15, image: "👗", description: "Beautiful floral printed frock with lace detailing", featured: true },
  { id: 2, name: "Denim Dungaree", category: "Boys", size: ["1-2Y","3-4Y","5-6Y"], price: 1500, stock: 10, image: "👖", description: "Comfortable denim dungaree perfect for playtime", featured: true },
  { id: 3, name: "Embroidered Suit", category: "Girls", size: ["4-5Y","6-7Y","8-9Y"], price: 2200, stock: 8, image: "👘", description: "Elegant embroidered suit for special occasions", featured: true },
  { id: 4, name: "T-Shirt & Shorts Set", category: "Boys", size: ["1-2Y","2-3Y","3-4Y"], price: 950, stock: 20, image: "👕", description: "Casual cotton t-shirt and shorts combo", featured: false },
  { id: 5, name: "Party Frock", category: "Girls", size: ["3-4Y","5-6Y","7-8Y"], price: 2800, stock: 5, image: "🎀", description: "Gorgeous party frock with ribbon and net layers", featured: true },
  { id: 6, name: "Kameez Shalwar", category: "Boys", size: ["2-3Y","4-5Y","6-7Y","8-9Y"], price: 1800, stock: 12, image: "🧥", description: "Traditional Pakistani kameez shalwar in premium fabric", featured: false },
  { id: 7, name: "Baby Romper", category: "Infants", size: ["0-3M","3-6M","6-9M","9-12M"], price: 750, stock: 25, image: "🍼", description: "Soft cotton romper for newborns and infants", featured: true },
  { id: 8, name: "Lehenga Choli", category: "Girls", size: ["3-4Y","5-6Y","7-8Y"], price: 3500, stock: 6, image: "✨", description: "Stunning lehenga choli for weddings and festivals", featured: false },
];

const ADMIN_PASS = "kaneez123";

export default function KaneezCreations() {
  const [view, setView] = useState("home"); // home, shop, product, admin, cart
  const [products, setProducts] = useState(initialProducts);
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filterCategory, setFilterCategory] = useState("All");
  const [adminAuth, setAdminAuth] = useState(false);
  const [adminPass, setAdminPass] = useState("");
  const [adminView, setAdminView] = useState("dashboard");
  const [editProduct, setEditProduct] = useState(null);
  const [notification, setNotification] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({ name:"", category:"Girls", size:"", price:"", stock:"", image:"👗", description:"", featured:false });

  const showNotif = (msg, type="success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const addToCart = (product, size) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id && i.size === size);
      if (existing) return prev.map(i => i.id === product.id && i.size === size ? {...i, qty: i.qty+1} : i);
      return [...prev, { ...product, size, qty: 1 }];
    });
    showNotif(`${product.name} added to cart! 🛍️`);
  };

  const removeFromCart = (id, size) => setCart(prev => prev.filter(i => !(i.id === id && i.size === size)));
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const handleAdminLogin = () => {
    if (adminPass === ADMIN_PASS) { setAdminAuth(true); setView("admin"); showNotif("Welcome, Admin! 👑"); }
    else showNotif("Wrong password!", "error");
  };

  const handleDeleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    showNotif("Product deleted.", "error");
  };

  const handleSaveProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.stock) return showNotif("Fill all required fields!", "error");
    const sizes = newProduct.size.split(",").map(s => s.trim()).filter(Boolean);
    if (editProduct) {
      setProducts(prev => prev.map(p => p.id === editProduct.id ? { ...newProduct, id: editProduct.id, size: sizes, price: +newProduct.price, stock: +newProduct.stock } : p));
      showNotif("Product updated! ✅");
    } else {
      setProducts(prev => [...prev, { ...newProduct, id: Date.now(), size: sizes, price: +newProduct.price, stock: +newProduct.stock }]);
      showNotif("New product added! 🎉");
    }
    setNewProduct({ name:"", category:"Girls", size:"", price:"", stock:"", image:"👗", description:"", featured:false });
    setEditProduct(null);
    setAdminView("products");
  };

  const startEdit = (p) => {
    setEditProduct(p);
    setNewProduct({ ...p, size: p.size.join(", "), price: String(p.price), stock: String(p.stock) });
    setAdminView("add");
  };

  const categories = ["All", "Girls", "Boys", "Infants"];
  const filtered = filterCategory === "All" ? products : products.filter(p => p.category === filterCategory);
  const featured = products.filter(p => p.featured);

  // ─── STYLES ───
  const s = {
    page: { fontFamily: "'Playfair Display', Georgia, serif", minHeight: "100vh", background: "#fff9f5", color: "#2a1a0e", margin: 0 },
    // HEADER
    header: { background: "linear-gradient(135deg, #c0392b 0%, #8e1a0e 100%)", padding: "0", boxShadow: "0 4px 20px rgba(192,57,43,0.3)", position: "sticky", top: 0, zIndex: 100 },
    headerInner: { maxWidth: 1200, margin: "0 auto", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" },
    logo: { display: "flex", flexDirection: "column", cursor: "pointer" },
    logoMain: { color: "#fff", fontSize: 22, fontWeight: 700, letterSpacing: 1, lineHeight: 1.1 },
    logoSub: { color: "#ffcdd2", fontSize: 11, letterSpacing: 4, textTransform: "uppercase" },
    nav: { display: "flex", gap: 8, alignItems: "center" },
    navBtn: (active) => ({ background: active ? "rgba(255,255,255,0.25)" : "transparent", border: "1px solid rgba(255,255,255,0.3)", color: "#fff", padding: "6px 16px", borderRadius: 20, cursor: "pointer", fontSize: 13, fontFamily: "inherit", transition: "all 0.2s" }),
    cartBtn: { position: "relative", background: "#fff", border: "none", borderRadius: 20, padding: "6px 16px", cursor: "pointer", color: "#c0392b", fontWeight: 700, fontSize: 13, fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6 },
    cartBadge: { background: "#c0392b", color: "#fff", borderRadius: "50%", width: 18, height: 18, fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center", position: "absolute", top: -6, right: -6 },
    // HERO
    hero: { background: "linear-gradient(135deg, #fff9f5 0%, #fce4ec 50%, #fff3e0 100%)", padding: "60px 24px 40px", textAlign: "center", position: "relative", overflow: "hidden" },
    heroTitle: { fontSize: 52, fontWeight: 700, color: "#8e1a0e", lineHeight: 1.1, marginBottom: 8 },
    heroSub: { fontSize: 18, color: "#c0392b", letterSpacing: 2, marginBottom: 16, fontStyle: "italic" },
    heroDesc: { fontSize: 15, color: "#7b5a4a", maxWidth: 500, margin: "0 auto 28px", lineHeight: 1.7 },
    heroBtn: { background: "linear-gradient(135deg, #c0392b, #8e1a0e)", color: "#fff", border: "none", padding: "14px 36px", borderRadius: 30, fontSize: 16, cursor: "pointer", fontFamily: "inherit", fontWeight: 600, boxShadow: "0 6px 20px rgba(192,57,43,0.4)", letterSpacing: 1 },
    // SECTION
    section: { maxWidth: 1200, margin: "0 auto", padding: "40px 24px" },
    sectionTitle: { fontSize: 30, color: "#8e1a0e", marginBottom: 4, fontWeight: 700 },
    sectionLine: { width: 60, height: 3, background: "linear-gradient(90deg, #c0392b, #ff7043)", borderRadius: 2, marginBottom: 28 },
    // GRID
    grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20 },
    card: { background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 16px rgba(192,57,43,0.08)", cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s", border: "1px solid #fce4ec" },
    cardImg: { background: "linear-gradient(135deg, #fce4ec, #fff3e0)", height: 150, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 60 },
    cardBody: { padding: "14px 16px" },
    cardName: { fontSize: 15, fontWeight: 700, color: "#2a1a0e", marginBottom: 4 },
    cardCat: { fontSize: 11, color: "#c0392b", textTransform: "uppercase", letterSpacing: 2, marginBottom: 6 },
    cardPrice: { fontSize: 18, fontWeight: 700, color: "#c0392b" },
    cardStock: (s) => ({ fontSize: 11, color: s > 0 ? "#2e7d32" : "#c62828", marginTop: 2 }),
    // FILTERS
    filterRow: { display: "flex", gap: 10, marginBottom: 28, flexWrap: "wrap" },
    filterBtn: (active) => ({ background: active ? "#c0392b" : "#fff", color: active ? "#fff" : "#c0392b", border: "2px solid #c0392b", padding: "7px 20px", borderRadius: 20, cursor: "pointer", fontFamily: "inherit", fontWeight: 600, fontSize: 13, transition: "all 0.2s" }),
    // PRODUCT DETAIL
    detailWrap: { maxWidth: 900, margin: "0 auto", padding: "32px 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 },
    detailImg: { background: "linear-gradient(135deg, #fce4ec, #fff3e0)", borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 120, minHeight: 280 },
    detailName: { fontSize: 32, fontWeight: 700, color: "#2a1a0e", marginBottom: 6 },
    detailCat: { color: "#c0392b", fontSize: 13, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 },
    detailPrice: { fontSize: 28, fontWeight: 700, color: "#c0392b", marginBottom: 16 },
    sizeBtn: (active) => ({ background: active ? "#c0392b" : "#fff", color: active ? "#fff" : "#c0392b", border: "2px solid #c0392b", padding: "6px 16px", borderRadius: 8, cursor: "pointer", fontFamily: "inherit", fontWeight: 600, fontSize: 13, margin: "0 6px 6px 0", transition: "all 0.2s" }),
    addCartBtn: { background: "linear-gradient(135deg, #c0392b, #8e1a0e)", color: "#fff", border: "none", padding: "14px 32px", borderRadius: 30, fontSize: 15, cursor: "pointer", fontFamily: "inherit", fontWeight: 700, marginTop: 16, width: "100%", boxShadow: "0 4px 16px rgba(192,57,43,0.3)" },
    backBtn: { background: "transparent", border: "2px solid #c0392b", color: "#c0392b", padding: "8px 20px", borderRadius: 20, cursor: "pointer", fontFamily: "inherit", fontWeight: 600, marginBottom: 20, fontSize: 13 },
    // CART DRAWER
    overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200 },
    drawer: { position: "fixed", right: 0, top: 0, bottom: 0, width: 360, background: "#fff", zIndex: 201, boxShadow: "-4px 0 20px rgba(0,0,0,0.15)", display: "flex", flexDirection: "column" },
    drawerHead: { background: "linear-gradient(135deg, #c0392b, #8e1a0e)", color: "#fff", padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" },
    drawerTitle: { fontSize: 18, fontWeight: 700 },
    closeBtn: { background: "none", border: "none", color: "#fff", fontSize: 22, cursor: "pointer" },
    cartItem: { display: "flex", gap: 12, padding: "16px 24px", borderBottom: "1px solid #fce4ec", alignItems: "center" },
    cartItemImg: { width: 50, height: 50, borderRadius: 10, background: "linear-gradient(135deg, #fce4ec, #fff3e0)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 },
    checkoutBtn: { background: "linear-gradient(135deg, #c0392b, #8e1a0e)", color: "#fff", border: "none", padding: "16px", borderRadius: 12, fontSize: 16, cursor: "pointer", fontFamily: "inherit", fontWeight: 700, margin: "16px 24px" },
    // NOTIFICATION
    notif: (type) => ({ position: "fixed", top: 80, right: 24, background: type === "error" ? "#c62828" : "#2e7d32", color: "#fff", padding: "12px 22px", borderRadius: 12, zIndex: 300, fontSize: 14, fontWeight: 600, boxShadow: "0 4px 16px rgba(0,0,0,0.2)", maxWidth: 300 }),
    // ADMIN
    adminWrap: { display: "grid", gridTemplateColumns: "220px 1fr", minHeight: "calc(100vh - 60px)" },
    sidebar: { background: "#2a1a0e", padding: "28px 0", display: "flex", flexDirection: "column" },
    sideItem: (active) => ({ padding: "12px 24px", cursor: "pointer", color: active ? "#ff7043" : "#d7ccc8", fontSize: 14, fontWeight: active ? 700 : 400, background: active ? "rgba(255,112,67,0.1)" : "transparent", borderLeft: active ? "3px solid #ff7043" : "3px solid transparent", transition: "all 0.2s", fontFamily: "inherit" }),
    adminMain: { padding: 28, background: "#fff9f5" },
    adminTitle: { fontSize: 26, fontWeight: 700, color: "#8e1a0e", marginBottom: 20 },
    statRow: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 28 },
    statCard: (color) => ({ background: color, borderRadius: 14, padding: "20px 22px", color: "#fff" }),
    statNum: { fontSize: 32, fontWeight: 700 },
    statLabel: { fontSize: 12, opacity: 0.85, marginTop: 2 },
    table: { width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" },
    th: { background: "#8e1a0e", color: "#fff", padding: "12px 16px", textAlign: "left", fontSize: 12, letterSpacing: 1, textTransform: "uppercase" },
    td: { padding: "12px 16px", borderBottom: "1px solid #fce4ec", fontSize: 13, verticalAlign: "middle" },
    editBtn: { background: "#1565c0", color: "#fff", border: "none", padding: "5px 12px", borderRadius: 6, cursor: "pointer", fontSize: 12, fontFamily: "inherit", marginRight: 6 },
    delBtn: { background: "#c62828", color: "#fff", border: "none", padding: "5px 12px", borderRadius: 6, cursor: "pointer", fontSize: 12, fontFamily: "inherit" },
    formGroup: { marginBottom: 16 },
    label: { display: "block", fontSize: 12, fontWeight: 700, color: "#8e1a0e", marginBottom: 6, letterSpacing: 1, textTransform: "uppercase" },
    input: { width: "100%", padding: "10px 14px", border: "2px solid #fce4ec", borderRadius: 10, fontSize: 14, fontFamily: "inherit", background: "#fff", outline: "none", boxSizing: "border-box", color: "#2a1a0e" },
    formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
    saveBtn: { background: "linear-gradient(135deg, #c0392b, #8e1a0e)", color: "#fff", border: "none", padding: "12px 28px", borderRadius: 20, fontSize: 14, cursor: "pointer", fontFamily: "inherit", fontWeight: 700, marginTop: 8 },
    // FOOTER
    footer: { background: "#2a1a0e", color: "#d7ccc8", padding: "36px 24px 20px", textAlign: "center" },
    footerTitle: { color: "#ff7043", fontSize: 20, fontWeight: 700, marginBottom: 6 },
    footerSub: { color: "#8d6e63", fontSize: 12, letterSpacing: 3, textTransform: "uppercase", marginBottom: 16 },
    footerLinks: { display: "flex", gap: 20, justifyContent: "center", marginBottom: 16, flexWrap: "wrap" },
    footerLink: { color: "#d7ccc8", fontSize: 13, cursor: "pointer", textDecoration: "none" },
    footerCopy: { color: "#6d4c41", fontSize: 11, marginTop: 12 },
  };

  const [selectedSize, setSelectedSize] = useState(null);

  // ─── COMPONENTS ───

  const Notification = () => notification && (
    <div style={s.notif(notification.type)}>{notification.msg}</div>
  );

  const Header = () => (
    <header style={s.header}>
      <div style={s.headerInner}>
        <div style={s.logo} onClick={() => setView("home")}>
          <span style={s.logoMain}>Kaneez Creations</span>
          <span style={s.logoSub}>✦ Kidz Wear ✦</span>
        </div>
        <nav style={s.nav}>
          <button style={s.navBtn(view==="home")} onClick={() => setView("home")}>Home</button>
          <button style={s.navBtn(view==="shop" || view==="product")} onClick={() => setView("shop")}>Shop</button>
          <button style={s.navBtn(false)} onClick={() => setView("adminLogin")}>Admin</button>
          <button style={s.cartBtn} onClick={() => setCartOpen(true)}>
            🛍️ Cart
            {cartCount > 0 && <span style={s.cartBadge}>{cartCount}</span>}
          </button>
        </nav>
      </div>
    </header>
  );

  const Footer = () => (
    <footer style={s.footer}>
      <div style={s.footerTitle}>Kaneez Creations</div>
      <div style={s.footerSub}>✦ Kidz Wear ✦</div>
      <p style={{ color: "#a1887f", fontSize: 13, marginBottom: 16 }}>
        Premium quality children's clothing for every occasion.<br/>
        Proudly serving families with love & style. 💕
      </p>
      <div style={s.footerLinks}>
        <span style={s.footerLink} onClick={() => setView("home")}>Home</span>
        <span style={s.footerLink} onClick={() => setView("shop")}>Shop</span>
        <span style={s.footerLink}>Contact</span>
        <span style={s.footerLink}>About Us</span>
      </div>
      <div style={s.footerCopy}>© 2024 Kaneez Creations – All Rights Reserved</div>
    </footer>
  );

  const CartDrawer = () => (
    <>
      <div style={s.overlay} onClick={() => setCartOpen(false)} />
      <div style={s.drawer}>
        <div style={s.drawerHead}>
          <span style={s.drawerTitle}>🛍️ Your Cart ({cartCount})</span>
          <button style={s.closeBtn} onClick={() => setCartOpen(false)}>✕</button>
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {cart.length === 0 ? (
            <div style={{ padding: 40, textAlign: "center", color: "#a1887f" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🧺</div>
              <div style={{ fontSize: 15 }}>Your cart is empty</div>
            </div>
          ) : cart.map(item => (
            <div key={item.id+item.size} style={s.cartItem}>
              <div style={s.cartItemImg}>{item.image}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{item.name}</div>
                <div style={{ fontSize: 12, color: "#a1887f" }}>Size: {item.size} × {item.qty}</div>
                <div style={{ fontWeight: 700, color: "#c0392b", fontSize: 14 }}>Rs. {(item.price * item.qty).toLocaleString()}</div>
              </div>
              <button onClick={() => removeFromCart(item.id, item.size)} style={{ background: "#fce4ec", border: "none", borderRadius: 6, padding: "4px 8px", cursor: "pointer", color: "#c0392b", fontSize: 14 }}>✕</button>
            </div>
          ))}
        </div>
        {cart.length > 0 && (
          <div style={{ borderTop: "2px solid #fce4ec", padding: "16px 24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 16, marginBottom: 8 }}>
              <span>Total:</span>
              <span style={{ color: "#c0392b" }}>Rs. {cartTotal.toLocaleString()}</span>
            </div>
            <button style={s.checkoutBtn} onClick={() => { showNotif("Order placed!"); setCart([]); setCartOpen(false); }}>Place Order</button>
          </div>
        )}
      </div>
    </>
  );

  // ─── VIEWS ───

  const HomeView = () => (
    <div>
      {/* Hero */}
      <div style={s.hero}>
        <div style={{ fontSize: 56, marginBottom: 12 }}>👗✨👶</div>
        <h1 style={s.heroTitle}>Kaneez Creations</h1>
        <div style={s.heroSub}>✦ Kidz Wear Collection ✦</div>
        <p style={s.heroDesc}>Adorable, premium quality clothing for your little ones. From everyday casuals to festive wear — dressed with love.</p>
        <button style={s.heroBtn} onClick={() => setView("shop")}>Explore Collection →</button>
        <div style={{ display: "flex", justifyContent: "center", gap: 32, marginTop: 36, flexWrap: "wrap" }}>
          {[["👗","Girls Wear"],["👕","Boys Wear"],["🍼","Infant Wear"],["🎀","Party Wear"]].map(([icon, label]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 30, marginBottom: 4 }}>{icon}</div>
              <div style={{ fontSize: 12, color: "#8e1a0e", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured */}
      <div style={s.section}>
        <div style={s.sectionTitle}>⭐ Featured Collection</div>
        <div style={s.sectionLine} />
        <div style={s.grid}>
          {featured.map(p => (
            <div key={p.id} style={s.card} onClick={() => { setSelectedProduct(p); setSelectedSize(p.size[0]); setView("product"); }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(192,57,43,0.16)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}>
              <div style={s.cardImg}>{p.image}</div>
              <div style={s.cardBody}>
                <div style={s.cardCat}>{p.category}</div>
                <div style={s.cardName}>{p.name}</div>
                <div style={s.cardPrice}>Rs. {p.price.toLocaleString()}</div>
                <div style={s.cardStock(p.stock)}>{p.stock > 0 ? `✓ In Stock (${p.stock})` : "✗ Out of Stock"}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Banner */}
      <div style={{ background: "linear-gradient(135deg, #c0392b, #8e1a0e)", padding: "36px 24px", textAlign: "center", color: "#fff" }}>
        <div style={{ fontSize: 26, fontWeight: 700, marginBottom: 8 }}>🎉 Eid Special Collection Now Available!</div>
        <div style={{ opacity: 0.85, marginBottom: 20, fontSize: 14 }}>Festive outfits for boys & girls — limited stock</div>
        <button style={{ background: "#fff", color: "#c0392b", border: "none", padding: "12px 30px", borderRadius: 25, fontSize: 14, cursor: "pointer", fontFamily: "inherit", fontWeight: 700 }} onClick={() => setView("shop")}>Shop Now</button>
      </div>

      <Footer />
    </div>
  );

  const ShopView = () => (
    <div style={s.section}>
      <div style={s.sectionTitle}>🛍️ All Products</div>
      <div style={s.sectionLine} />
      <div style={s.filterRow}>
        {categories.map(c => (
          <button key={c} style={s.filterBtn(filterCategory===c)} onClick={() => setFilterCategory(c)}>{c}</button>
        ))}
      </div>
      <div style={s.grid}>
        {filtered.map(p => (
          <div key={p.id} style={s.card} onClick={() => { setSelectedProduct(p); setSelectedSize(p.size[0]); setView("product"); }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(192,57,43,0.16)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}>
            <div style={s.cardImg}>{p.image}</div>
            <div style={s.cardBody}>
              <div style={s.cardCat}>{p.category}</div>
              <div style={s.cardName}>{p.name}</div>
              <div style={s.cardPrice}>Rs. {p.price.toLocaleString()}</div>
              <div style={s.cardStock(p.stock)}>{p.stock > 0 ? `✓ In Stock (${p.stock})` : "✗ Out of Stock"}</div>
            </div>
          </div>
        ))}
      </div>
      {filtered.length === 0 && <div style={{ textAlign: "center", color: "#a1887f", padding: 40, fontSize: 16 }}>No products found in this category.</div>}
      <Footer />
    </div>
  );

  const ProductView = () => {
    const p = selectedProduct;
    if (!p) return null;
    return (
      <div>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 24px 0" }}>
          <button style={s.backBtn} onClick={() => setView("shop")}>← Back to Shop</button>
        </div>
        <div style={{ ...s.detailWrap, gridTemplateColumns: window.innerWidth < 600 ? "1fr" : "1fr 1fr" }}>
          <div style={s.detailImg}>{p.image}</div>
          <div>
            <div style={s.detailCat}>{p.category}</div>
            <div style={s.detailName}>{p.name}</div>
            <div style={s.detailPrice}>Rs. {p.price.toLocaleString()}</div>
            <div style={{ fontSize: 14, color: "#7b5a4a", lineHeight: 1.7, marginBottom: 20 }}>{p.description}</div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#8e1a0e", letterSpacing: 1, marginBottom: 8, textTransform: "uppercase" }}>Select Size:</div>
              {p.size.map(sz => (
                <button key={sz} style={s.sizeBtn(selectedSize===sz)} onClick={() => setSelectedSize(sz)}>{sz}</button>
              ))}
            </div>
            <div style={s.cardStock(p.stock)}>{p.stock > 0 ? `✓ In Stock — ${p.stock} pieces available` : "✗ Out of Stock"}</div>
            {p.stock > 0 && (
              <button style={s.addCartBtn} onClick={() => { addToCart(p, selectedSize); setCartOpen(true); }}>
                🛍️ Add to Cart
              </button>
            )}
          </div>
        </div>
        <Footer />
      </div>
    );
  };

  const AdminLoginView = () => (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: 20, padding: 40, boxShadow: "0 8px 40px rgba(192,57,43,0.12)", width: 340, textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🔐</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: "#8e1a0e", marginBottom: 4 }}>Admin Panel</div>
        <div style={{ fontSize: 12, color: "#a1887f", marginBottom: 24, letterSpacing: 2, textTransform: "uppercase" }}>Kaneez Creations</div>
        <input
          type="password"
          placeholder="Enter admin password"
          value={adminPass}
          onChange={e => setAdminPass(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleAdminLogin()}
          style={{ ...s.input, textAlign: "center", marginBottom: 16 }}
        />
        <button style={{ ...s.saveBtn, width: "100%", padding: "13px" }} onClick={handleAdminLogin}>Login →</button>
        <div style={{ fontSize: 11, color: "#bdbdbd", marginTop: 16 }}>Default password: kaneez123</div>
      </div>
    </div>
  );

  const AdminView = () => {
    const totalStock = products.reduce((s, p) => s + p.stock, 0);
    const lowStock = products.filter(p => p.stock < 5);
    const totalValue = products.reduce((s, p) => s + p.price * p.stock, 0);

    return (
      <div style={s.adminWrap}>
        {/* Sidebar */}
        <div style={s.sidebar}>
          <div style={{ padding: "0 24px 24px", borderBottom: "1px solid rgba(255,255,255,0.1)", marginBottom: 16 }}>
            <div style={{ color: "#ff7043", fontWeight: 700, fontSize: 14 }}>Kaneez Creations</div>
            <div style={{ color: "#8d6e63", fontSize: 11 }}>Admin Panel</div>
          </div>
          {[["📊","dashboard","Dashboard"],["📦","products","Products"],["➕","add","Add Product"],["⚠️","lowstock","Low Stock"]].map(([icon,key,label]) => (
            <div key={key} style={s.sideItem(adminView===key)} onClick={() => { setAdminView(key); if(key!=="add") { setEditProduct(null); setNewProduct({ name:"", category:"Girls", size:"", price:"", stock:"", image:"👗", description:"", featured:false }); } }}>{icon} {label}</div>
          ))}
          <div style={{ flex: 1 }} />
          <div style={s.sideItem(false)} onClick={() => { setAdminAuth(false); setView("home"); }}>🚪 Logout</div>
        </div>

        {/* Main */}
        <div style={s.adminMain}>
          {adminView === "dashboard" && (
            <>
              <div style={s.adminTitle}>📊 Dashboard</div>
              <div style={s.statRow}>
                {[
                  ["linear-gradient(135deg,#c0392b,#8e1a0e)", products.length, "Total Products"],
                  ["linear-gradient(135deg,#1565c0,#0d47a1)", totalStock, "Total Stock"],
                  ["linear-gradient(135deg,#2e7d32,#1b5e20)", `Rs. ${totalValue.toLocaleString()}`, "Inventory Value"],
                  ["linear-gradient(135deg,#e65100,#bf360c)", lowStock.length, "Low Stock Items"],
                ].map(([bg, num, label]) => (
                  <div key={label} style={s.statCard(bg)}>
                    <div style={s.statNum}>{num}</div>
                    <div style={s.statLabel}>{label}</div>
                  </div>
                ))}
              </div>
              {lowStock.length > 0 && (
                <div style={{ background: "#fff3e0", border: "2px solid #ff7043", borderRadius: 12, padding: "16px 20px", marginBottom: 20 }}>
                  <div style={{ fontWeight: 700, color: "#e65100", marginBottom: 8 }}>⚠️ Low Stock Alert</div>
                  {lowStock.map(p => <div key={p.id} style={{ fontSize: 13, color: "#bf360c", padding: "2px 0" }}>• {p.name} — only {p.stock} left</div>)}
                </div>
              )}
              <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                <div style={{ fontWeight: 700, color: "#8e1a0e", marginBottom: 12 }}>📦 Category Breakdown</div>
                {["Girls","Boys","Infants"].map(cat => {
                  const count = products.filter(p => p.category === cat).length;
                  return (
                    <div key={cat} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                      <div style={{ width: 80, fontSize: 13, fontWeight: 600 }}>{cat}</div>
                      <div style={{ flex: 1, background: "#fce4ec", borderRadius: 6, height: 14, overflow: "hidden" }}>
                        <div style={{ width: `${(count/products.length)*100}%`, background: "linear-gradient(90deg,#c0392b,#ff7043)", height: "100%", borderRadius: 6 }} />
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#c0392b", width: 24 }}>{count}</div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {adminView === "products" && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div style={s.adminTitle}>📦 Products ({products.length})</div>
                <button style={s.saveBtn} onClick={() => setAdminView("add")}>+ Add New</button>
              </div>
              <table style={s.table}>
                <thead>
                  <tr>{["Emoji","Name","Category","Price","Stock","Sizes","Featured","Actions"].map(h => <th key={h} style={s.th}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id}>
                      <td style={s.td}><span style={{ fontSize: 24 }}>{p.image}</span></td>
                      <td style={{ ...s.td, fontWeight: 700 }}>{p.name}</td>
                      <td style={s.td}><span style={{ background: "#fce4ec", color: "#c0392b", padding: "2px 10px", borderRadius: 12, fontSize: 11, fontWeight: 700 }}>{p.category}</span></td>
                      <td style={{ ...s.td, fontWeight: 700, color: "#c0392b" }}>Rs. {p.price.toLocaleString()}</td>
                      <td style={{ ...s.td, color: p.stock < 5 ? "#c62828" : "#2e7d32", fontWeight: 700 }}>{p.stock}</td>
                      <td style={{ ...s.td, fontSize: 11 }}>{p.size.join(", ")}</td>
                      <td style={s.td}>{p.featured ? "⭐" : "—"}</td>
                      <td style={s.td}>
                        <button style={s.editBtn} onClick={() => { startEdit(p); }}>Edit</button>
                        <button style={s.delBtn} onClick={() => handleDeleteProduct(p.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {adminView === "add" && (
            <>
              <div style={s.adminTitle}>{editProduct ? "✏️ Edit Product" : "➕ Add New Product"}</div>
              <div style={{ background: "#fff", borderRadius: 16, padding: 28, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", maxWidth: 700 }}>
                <div style={s.formGrid}>
                  <div style={s.formGroup}>
                    <label style={s.label}>Product Name *</label>
                    <input style={s.input} value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} placeholder="e.g. Floral Frock" />
                  </div>
                  <div style={s.formGroup}>
                    <label style={s.label}>Category *</label>
                    <select style={s.input} value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})}>
                      <option>Girls</option><option>Boys</option><option>Infants</option>
                    </select>
                  </div>
                  <div style={s.formGroup}>
                    <label style={s.label}>Price (Rs.) *</label>
                    <input style={s.input} type="number" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} placeholder="1200" />
                  </div>
                  <div style={s.formGroup}>
                    <label style={s.label}>Stock Quantity *</label>
                    <input style={s.input} type="number" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})} placeholder="10" />
                  </div>
                  <div style={s.formGroup}>
                    <label style={s.label}>Sizes (comma separated)</label>
                    <input style={s.input} value={newProduct.size} onChange={e => setNewProduct({...newProduct, size: e.target.value})} placeholder="2-3Y, 4-5Y, 6-7Y" />
                  </div>
                  <div style={s.formGroup}>
                    <label style={s.label}>Emoji Icon</label>
                    <select style={s.input} value={newProduct.image} onChange={e => setNewProduct({...newProduct, image: e.target.value})}>
                      {["👗","👘","👕","👖","🧥","🎀","✨","🍼","👙","🩲"].map(e => <option key={e} value={e}>{e}</option>)}
                    </select>
                  </div>
                </div>
                <div style={s.formGroup}>
                  <label style={s.label}>Description</label>
                  <textarea style={{ ...s.input, minHeight: 80, resize: "vertical" }} value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} placeholder="Brief product description..." />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <input type="checkbox" id="featured" checked={newProduct.featured} onChange={e => setNewProduct({...newProduct, featured: e.target.checked})} style={{ width: 16, height: 16 }} />
                  <label htmlFor="featured" style={{ fontSize: 14, fontWeight: 600, color: "#8e1a0e", cursor: "pointer" }}>⭐ Featured on homepage</label>
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <button style={s.saveBtn} onClick={handleSaveProduct}>{editProduct ? "✅ Update Product" : "➕ Add Product"}</button>
                  {editProduct && <button style={{ ...s.saveBtn, background: "#757575" }} onClick={() => { setEditProduct(null); setNewProduct({ name:"", category:"Girls", size:"", price:"", stock:"", image:"👗", description:"", featured:false }); setAdminView("products"); }}>Cancel</button>}
                </div>
              </div>
            </>
          )}

          {adminView === "lowstock" && (
            <>
              <div style={s.adminTitle}>⚠️ Low Stock Items</div>
              {lowStock.length === 0 ? (
                <div style={{ background: "#e8f5e9", borderRadius: 12, padding: 32, textAlign: "center", color: "#2e7d32", fontSize: 15, fontWeight: 600 }}>✅ All products are well stocked!</div>
              ) : (
                <table style={s.table}>
                  <thead>
                    <tr>{["Product","Category","Price","Stock Left","Action"].map(h => <th key={h} style={s.th}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {lowStock.map(p => (
                      <tr key={p.id}>
                        <td style={{ ...s.td, fontWeight: 700 }}>{p.image} {p.name}</td>
                        <td style={s.td}>{p.category}</td>
                        <td style={{ ...s.td, color: "#c0392b", fontWeight: 700 }}>Rs. {p.price.toLocaleString()}</td>
                        <td style={{ ...s.td, color: "#c62828", fontWeight: 700 }}>{p.stock} only!</td>
                        <td style={s.td}><button style={s.editBtn} onClick={() => startEdit(p)}>Restock / Edit</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={s.page}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap" rel="stylesheet" />
      {view !== "admin" && <Header />}
      <Notification />
      {cartOpen && <CartDrawer />}
      {view === "home" && <HomeView />}
      {view === "shop" && <ShopView />}
      {view === "product" && <ProductView />}
      {view === "adminLogin" && !adminAuth && <AdminLoginView />}
      {view === "admin" && adminAuth && (
        <div>
          <div style={{ background: "linear-gradient(135deg,#c0392b,#8e1a0e)", padding: "10px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>🛍️ Kaneez Creations — Admin Panel</span>
            <div style={{ display: "flex", gap: 12 }}>
              <button style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", padding: "6px 16px", borderRadius: 12, cursor: "pointer", fontFamily: "inherit", fontSize: 13 }} onClick={() => setView("home")}>← View Store</button>
            </div>
          </div>
          <AdminView />
        </div>
      )}
    </div>
  );
}
