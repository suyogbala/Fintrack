import { useState, useEffect } from "react";
import './App.css';

function App() {
  const [name, setName] = useState('');
  const [datetime, setDateTime] = useState('');
  const [description, setDescription] = useState('');
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    getTransactions().then(setTransactions);
  }, []);

  async function getTransactions() {
    console.log("Fetching transactions from API...");
    const url = process.env.REACT_APP_API_URL + '/transactions';
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    console.log("Fetched transactions:", data);
    return data;
  }

  function addNewTransaction(ev) {
    ev.preventDefault();
    console.log("Adding new transaction...");
    const url = process.env.REACT_APP_API_URL + '/transaction';
    const price = parseFloat(name.split(' ')[0]);

    fetch(url, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({
        price,
        name: name.substring(price.toString().length + 1),
        description,
        datetime
      })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
      })
      .then(newTransaction => {
        setTransactions(prevTransactions => [newTransaction, ...prevTransactions]);
        setName('');
        setDateTime('');
        setDescription('');
        console.log('Transaction added:', newTransaction);
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
  }

  function handleDeleteTransaction(id) {
    console.log("Deleting transaction with ID:", id);
    fetch(`${process.env.REACT_APP_API_URL}/transaction/${id}`, {
      method: 'DELETE'
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      setTransactions(prevTransactions => 
        prevTransactions.filter(transaction => transaction._id !== id)
      );
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });
  }

  let balance = 0;
  for (const transaction of transactions) {
    balance += transaction.price;
  }
  balance = balance.toFixed(2);

  const [whole, fraction] = balance.split('.');

  return (
    <main>
      <h1>{whole}<span>{fraction}</span></h1>
      <form onSubmit={addNewTransaction}>
        <div className="basic">
          <input
            type="text"
            value={name}
            onChange={ev => setName(ev.target.value)}
            placeholder={'+200 new Samsung TV'}
          />
          <input
            value={datetime}
            type="datetime-local"
            onChange={ev => setDateTime(ev.target.value)}
          />
        </div>
        <div className="description">
          <input
            type="text"
            value={description}
            onChange={ev => setDescription(ev.target.value)}
            placeholder={'Description'}
          />
        </div>
        <button type='submit'>Add a new Transaction</button>
      </form>

      <div className="transactions">
        {transactions.length > 0 && transactions.map((transaction) => (
          <div key={transaction._id} className="transaction">
            <div className="left">
              <div className="name">{transaction.name}</div>
              <div className="description">{transaction.description}</div>
            </div>
            <div className="right">
              <div className={"price " + (transaction.price < 0 ? 'red' : 'green')}>{transaction.price}</div>
              <div className="datetime">{new Date(transaction.datetime).toLocaleDateString()}</div>
              <button onClick={() => handleDeleteTransaction(transaction._id)}>Delete</button> {/* Delete Button */}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default App;
