import React, { useState, useEffect } from 'react';
import './TransactionHistory.css';
import { apiService } from '../services/apiService';

const TransactionHistory = ({ account }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiService.getTransactions(account || null, 20);
        setTransactions(response.transactions || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [account]);

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  if (loading) {
    return (
      <div className="transaction-history-container">
        <div className="loading">Loading transactions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="transaction-history-container">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="transaction-history-container">
      <div className="transaction-header">
        <h2>Transaction History</h2>
        {account ? (
          <div className="wallet-filter">
            Filtering for: {formatAddress(account)}
            {transactions.length === 0 && (
              <span style={{ marginLeft: '1rem', fontSize: '0.9rem', color: '#666' }}>
                (No transactions found for this wallet)
              </span>
            )}
          </div>
        ) : (
          <div className="wallet-filter" style={{ color: '#666' }}>
            Showing all transactions (connect wallet to filter)
          </div>
        )}
      </div>

      <div className="transactions-list">
        {transactions.length === 0 ? (
          <div className="placeholder">
            <p>No transactions found</p>
          </div>
        ) : (
          transactions.map((transaction) => (
            <div key={transaction.id} className="transaction-card">
              <div className="transaction-header-info">
                <span className={`transaction-type ${transaction.type}`}>
                  {transaction.type.replace('_', ' ')}
                </span>
                <span className={`transaction-status ${transaction.status}`}>
                  {transaction.status}
                </span>
              </div>
              <div className="transaction-details">
                <div className="transaction-detail-item">
                  <span className="transaction-detail-label">From</span>
                  <span className="transaction-detail-value address">
                    {formatAddress(transaction.from)}
                  </span>
                </div>
                <div className="transaction-detail-item">
                  <span className="transaction-detail-label">To</span>
                  <span className="transaction-detail-value address">
                    {formatAddress(transaction.to)}
                  </span>
                </div>
                <div className="transaction-detail-item">
                  <span className="transaction-detail-label">Amount</span>
                  <span className="transaction-amount">
                    {transaction.amount} {transaction.currency}
                  </span>
                </div>
                <div className="transaction-detail-item">
                  <span className="transaction-detail-label">Timestamp</span>
                  <span className="transaction-timestamp">
                    {formatDate(transaction.timestamp)}
                  </span>
                </div>
              </div>
              {transaction.blockchainTxHash && (
                <div className="transaction-detail-item" style={{ marginTop: '0.5rem' }}>
                  <span className="transaction-detail-label">Transaction Hash</span>
                  <span className="transaction-detail-value hash">
                    {formatAddress(transaction.blockchainTxHash)}
                  </span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;


