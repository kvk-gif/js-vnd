import React, { useState, useEffect } from 'react';
import './App.css'; 

const MAX_INVENTORY = 15;

const ACCEPTED_COINS = [
  { label: '5c', value: 5 },
  { label: '10c', value: 10 },
  { label: '20c', value: 20 },
  { label: '50c', value: 50 },
  { label: '€1', value: 100 },
  { label: '€2', value: 200 },
];

const mockFetchProducts = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, name: "Espresso", price: 160, stock: 10, emoji: "☕" },
        { id: 2, name: "Croissant", price: 220, stock: 8, emoji: "🥐" },
        { id: 3, name: "Chocolate", price: 150, stock: 15, emoji: "🍫" },
        { id: 4, name: "Water", price: 90, stock: 5, emoji: "💧" },
      ]);
    }, 800);
  });
};

const App = () => {
  // --- State ---
  const [products, setProducts] = useState([]);
  const [balance, setBalance] = useState(0);
  const [message, setMessage] = useState("Welcome! Please insert coins.");
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    mockFetchProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  const formatMoney = (cents) => `€${(cents / 100).toFixed(2)}`;

  const insertCoin = (value) => {
    setBalance((prev) => prev + value);
    setMessage(`Credit: ${formatMoney(balance + value)}`);
  };

const returnChange = () => {
    if (balance === 0) {
      setMessage("No change to return.");
      return;
    }
    
    let remaining = balance;
    let changeLog = [];
    
    const denominations = [200, 100, 50, 20, 10, 5]; 

    denominations.forEach(coin => {
      while (remaining >= coin) {
        changeLog.push(formatMoney(coin));
        remaining -= coin;
      }
    });

    setMessage(`Returned: ${changeLog.join(', ')}`);
    setBalance(0);
  };

  const buyProduct = (product) => {
    if (product.stock <= 0) {
      setMessage("Out of Stock!");
      return;
    }
    if (balance < product.price) {
      setMessage(`Need ${formatMoney(product.price - balance)} more.`);
      return;
    }

    const newStock = product.stock - 1;
    updateProductState(product.id, { stock: newStock });
    
    const change = balance - product.price;
    setBalance(0);
    
    let msg = `Dispensing ${product.name}.`;
    if (change > 0) msg += ` Change returned: ${formatMoney(change)}`;
    setMessage(msg);
  };

  const updateProductState = (id, newValues) => {
    setProducts(prev => prev.map(p => 
      p.id === id ? { ...p, ...newValues } : p
    ));
  };

  const handleUpdateStock = (id, currentStock, amount) => {
    const newStock = currentStock + amount;
    if (newStock < 0) return;
    if (newStock > MAX_INVENTORY) {
      alert(`Max inventory is ${MAX_INVENTORY}`);
      return;
    }
    updateProductState(id, { stock: newStock });
  };

  const handleDelete = (id) => {
    if(window.confirm("Delete this product?")) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const price = parseFloat(e.target.price.value) * 100
    
    const newProduct = {
      id: Date.now(),
      name: name,
      price: price,
      stock: 5, 
      emoji: "📦"
    };
    
    setProducts([...products, newProduct]);
    e.target.reset();
  };

  if (loading) return <div className="loading">Loading Vending System...</div>;

  return (
    <div className="vending-machine-container">
      
      <div className="display-panel">
        <h1 className="title">Vending machine</h1>
        <div className="lcd-screen">{message}</div>
        <div className="balance-screen">
            Current Balance: <span>{formatMoney(balance)}</span>
        </div>
      </div>

      
      <div className="product-grid">
        {products.map((p) => (
          <div key={p.id} className={`product-card ${p.stock === 0 ? 'out-of-stock' : ''}`}>
            <div className="emoji">{p.emoji}</div>
            <div className="info">
              <h3>{p.name}</h3>
              <p className="price">{formatMoney(p.price)}</p>
              <p className="stock">Qty: {p.stock}</p>
            </div>
            
            {isAdmin ? (
              <div className="admin-controls">
                <button onClick={() => handleUpdateStock(p.id, p.stock, -1)}>-</button>
                <button onClick={() => handleUpdateStock(p.id, p.stock, 1)}>+</button>
                <button className="delete-btn" onClick={() => handleDelete(p.id)}>x</button>
              </div>
            ) : (
              <button 
                className="buy-btn" 
                onClick={() => buyProduct(p)}
                disabled={p.stock === 0}
              >
                {p.stock === 0 ? 'Sold Out' : 'Buy'}
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="control-panel">
        <h3>Insert Coin</h3>
        <div className="coin-slot">
          {ACCEPTED_COINS.map((coin) => (
            <button 
              key={coin.label} 
              className="coin-btn" 
              onClick={() => insertCoin(coin.value)}
            >
              {coin.label}
            </button>
          ))}
        </div>
        <button className="return-btn" onClick={returnChange}>
          Return Coins
        </button>
      </div>

      <div className="admin-footer">
        <label>
          <input 
            type="checkbox" 
            checked={isAdmin} 
            onChange={() => setIsAdmin(!isAdmin)} 
          /> 
          Maintenance Mode (CRUD)
        </label>
        
        {isAdmin && (
          <form className="add-product-form" onSubmit={handleAddProduct}>
            <h4>Add New Product</h4>
            <input name="name" placeholder="Name" required />
            <input name="price" type="number" step="0.01" placeholder="Price ($)" required />
            <button type="submit">Add</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default App;