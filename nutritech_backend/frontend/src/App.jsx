import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [message, setMessage] = useState("");
  const [products, setProducts] = useState([
    { id: 1, name: "Organic Fertilizer", price: 25, img: "/test.webp" },
    { id: 2, name: "Premium Seeds", price: 15, img: "/test.webp" },
    { id: 3, name: "Garden Tools Kit", price: 50, img: "/test.webp" },
    { id: 4, name: "Watering Can", price: 20, img: "/test.webp" },
    { id: 5, name: "Plant Pots", price: 10, img: "/test.webp" },
    { id: 6, name: "Soil Enhancer", price: 30, img: "/test.webp" },
  ]);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [modalProduct, setModalProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isRegistered, setIsRegistered] = useState(localStorage.getItem('isRegistered') === 'true');
  const [username, setUsername] = useState(localStorage.getItem('username'));

  const [successMessage, setSuccessMessage] = useState("");  
  const [messageStyle, setMessageStyle] = useState({}); 
  const [cart, setCart] = useState([]);  // To store cart items
  const [cartVisible, setCartVisible] = useState(false);  // Initially the cart is hidden
  const [isLoginMode, setIsLoginMode] = useState(false);  

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/home/")
      .then((response) => response.json())
      .then((data) => setMessage(data.message))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData); 

    const endpoint = isLoginMode ? "http://127.0.0.1:8000/api/login/" : "http://127.0.0.1:8000/api/signup/";

    fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.success) {
            setIsRegistered(true);
            localStorage.setItem('isRegistered', 'true');
            localStorage.setItem('username', formData.username); 
            setUsername(formData.username);

            if (isLoginMode) {
                localStorage.setItem('access_token', data.access_token); 
                console.log("Login successful, token stored.");
            }

            setSuccessMessage(isLoginMode ? "Login successful!" : "Thank you for signing up!");
            setMessageStyle({ color: 'green', backgroundColor: '#d4edda', border: '1px solid #c3e6cb', padding: '10px', borderRadius: '5px', margin: '10px 0' });
            setTimeout(() => setSuccessMessage(""), 5000);
        } else {
            setSuccessMessage(isLoginMode ? "Login failed. Please try again." : "Error signing up. Please try again.");
            setMessageStyle({ color: 'red', backgroundColor: '#f8d7da', border: '1px solid #f5c6cb', padding: '10px', borderRadius: '5px', margin: '10px 0' });
            setTimeout(() => setSuccessMessage(""), 5000);
        }
    })
    .catch((error) => {
        console.error("Error during signup/login:", error);
        setSuccessMessage(isLoginMode ? "Login failed. Please try again." : "Error during signup. Please try again.");
        setMessageStyle({ color: 'red', backgroundColor: '#f8d7da', border: '1px solid #f5c6cb', padding: '10px', borderRadius: '5px', margin: '10px 0' });
        setTimeout(() => setSuccessMessage(""), 5000);
    });
};

  const handleLogout = () => {
    localStorage.removeItem('isRegistered');
    localStorage.removeItem('username');
    setIsRegistered(false);
    setUsername(null);  

    setSuccessMessage("You have logged out successfully.");
    setMessageStyle({ color: 'green', backgroundColor: '#d4edda', border: '1px solid #c3e6cb', padding: '10px', borderRadius: '5px', margin: '10px 0' });

    setTimeout(() => setSuccessMessage(""), 5000);
  };

  const openModal = (product) => {
    if (!isRegistered) {
      setSuccessMessage("Please sign up to buy products!");
      setMessageStyle({
        color: 'red',
        backgroundColor: '#f8d7da',
        border: '1px solid #f5c6cb',
        padding: '10px',
        borderRadius: '5px',
        margin: '10px 0',
      });
  
      setTimeout(() => setSuccessMessage(""), 5000);
      return;
    }
    
    setModalProduct(product);
    setQuantity(1);
    
  };

  

  const closeModal = () => {
    setModalProduct(null);
  };
  useEffect(() => {
    const storedCartVisibility = localStorage.getItem('cartVisible') === 'true';
    setCartVisible(storedCartVisibility);
  }, []);

  const closeCartPanel = () => {
    setCartVisible(false);  
    localStorage.setItem('cartVisible', 'false');  
  };

  const openCartPanel = () => {
    setCartVisible(true);  
    localStorage.setItem('cartVisible', 'true');  
  };
  const incrementQuantity = () => {
    if (quantity < 10) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const toggleAuthMode = () => {
    setIsLoginMode(!isLoginMode);  
  };

  const addToList = () => {
    if (!modalProduct) {
      console.log("No product selected.");
      return;
    }
  
    const data = {
      productId: modalProduct.id,
      quantity: quantity,
      username: username, 
    };
    console.log("Sending data to the server:", data);
    const newCart = [...cart, { ...modalProduct, quantity }];
    setCart(newCart); 
    fetch("http://127.0.0.1:8000/api/add-to-list/", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        console.log("Response status:", response.status);
        return response.json();
      })
      .then((data) => {
        console.log("Server response:", data);
        if (data.message) {
          setSuccessMessage(data.message);  
          setMessageStyle({
            color: 'green',
            backgroundColor: '#d4edda',
            border: '1px solid #c3e6cb',
            padding: '10px',
            borderRadius: '5px',
            margin: '10px 0',
          });
        } else {
          setSuccessMessage("Error adding product to the list. Please try again.");
          setMessageStyle({
            color: 'red',
            backgroundColor: '#f8d7da',
            border: '1px solid #f5c6cb',
            padding: '10px',
            borderRadius: '5px',
            margin: '10px 0',
          });
        }
        setTimeout(() => setSuccessMessage(""), 5000);
      })
      .catch((error) => {
        console.error("Error adding product to list:", error);
        setSuccessMessage("Error adding product to the list. Please try again.");
        setMessageStyle({
          color: 'red',
          backgroundColor: '#f8d7da',
          border: '1px solid #f5c6cb',
          padding: '10px',
          borderRadius: '5px',
          margin: '10px 0',
        });
        setTimeout(() => setSuccessMessage(""), 5000);
      });
  };
  
  
  return (
    <div className="App">
      {/* Header */}
      <header>
        <div className="logo-container">
          <img src="/logo1.png" alt="Nutritech Agro" className="logo" />
        </div>
        <nav className="nav-links">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="nav-button"
          >
            Home
          </button>
          <button
            onClick={() =>
              document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })
            }
            className="nav-button"
          >
            Shop
          </button>
          {isRegistered ? (
            <button onClick={handleLogout} className="nav-button">
              Logout
            </button>
          ) : (
            <button
              onClick={() =>
                document.getElementById('signup')?.scrollIntoView({ behavior: 'smooth' })
              }
              className="nav-button"
            >
              Signup/Login
            </button>
          )}
        </nav>
      </header>


      {/* Home Section */}
      <section className="home">
        <div className="home-text">
          <h1>{message || "Welcome to Nutritech Agro!"}</h1>
          <p>We provide high-quality agricultural products to help you grow better.</p>
        </div>
        <img src="/home.jpg" alt="Agriculture" className="intro-image" />
      </section>

      {/* Message Display */}
      {successMessage && (
        <div style={messageStyle}>
          {successMessage}
        </div>
      )}

{/* Shop Section */}
<section id="shop" className="shop">
  <h2>Our Products</h2>
  <button onClick={openCartPanel} className="view-cart-btn">View Cart</button> {/* Added class */}
  <div className="product-list">
    {products.map((product) => (
      <div key={product.id} className="product" onClick={() => openModal(product)}>
        <img src={product.img} alt={product.name} className="product-image" />
        <h3>{product.name}</h3>
        <p>Price: <span className="price">${product.price}</span></p>
      </div>
    ))}
  </div>
</section>

{/* Product Modal */}
{modalProduct && (
  <div className="modal">
    <div className="modal-content">
      <span className="close-button" onClick={closeModal}>×</span>
      <h3>{modalProduct.name}</h3>
      <img src={modalProduct.img} alt={modalProduct.name} className="modal-image" />
      <p>Price: ${modalProduct.price}</p>
      <div className="quantity-control">
        <button onClick={decrementQuantity}>-</button>
        <span>{quantity}</span>
        <button onClick={incrementQuantity}>+</button>
      </div>
      <button className="add-to-cart-button" onClick={() => { addToList(); closeModal(); }}>
        Add to Cart
      </button>
    </div>
  </div>
)}

{/* Cart Panel */}
{cart.length > 0 && cartVisible && (
  <div id="cart-panel" className="cart-panel">
    <span className="close-button" onClick={closeCartPanel}>×</span>
    <h3>Your Cart</h3>
    <ul id="cart-items">
      {cart.map((item, index) => (
        <li key={index}>
          {item.name} - {item.quantity} x ${item.price}
        </li>
      ))}
    </ul>
    <button id="checkout-btn">Checkout</button>
  </div>
)}

     {!username && (
        <section id="signup" className="signup">
          <h2>{isLoginMode ? "Login" : "Signup"}</h2>
          <form onSubmit={handleSubmit} className="signup-form">
            <label>
              Username:
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleFormChange}
                required
                placeholder="Enter your username"
              />
            </label>

            {/* Conditionally render the email field only in signup mode */}
            {!isLoginMode && (
              <label>
                Your Email:  
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  required
                  placeholder="Enter your email"
                />
              </label>
            )}

            <label>
              Password:
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleFormChange}
                required
                placeholder="Enter your password"
              />
            </label>

            <button type="submit" className="signup-button">
              {isLoginMode ? "Login" : "Signup"}
            </button>
          </form>

          <button onClick={toggleAuthMode} className="toggle-auth-mode">
            {isLoginMode ? "Switch to Signup" : "Switch to Login"}
          </button>
        </section>
      )}

  {/* Footer */}
  <footer>
        <p>&copy; 2024 Nutritech Agro. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
