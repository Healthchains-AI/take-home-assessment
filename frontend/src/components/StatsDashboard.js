import React, { useState, useEffect } from 'react';
import './StatsDashboard.css';
import { apiService } from '../services/apiService';

const StatsDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiService.getStats();
        setStats(response);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="stats-dashboard-container">
        <div className="loading">Loading statistics...</div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="stats-dashboard-container">
        <div className="error">Error loading statistics: {error || 'No data available'}</div>
      </div>
    );
  }

  return (
    <div className="stats-dashboard-container">
      <h2>Platform Statistics</h2>
      
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-label">Total Patients</div>
          <div className="stat-value">{stats.totalPatients || 0}</div>
          <div className="stat-description">Registered patients in the system</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Records</div>
          <div className="stat-value">{stats.totalRecords || 0}</div>
          <div className="stat-description">Medical records stored</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Consents</div>
          <div className="stat-value">{stats.totalConsents || 0}</div>
          <div className="stat-description">All consent records</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Active Consents</div>
          <div className="stat-value">{stats.activeConsents || 0}</div>
          <div className="stat-description">Currently active consents</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Pending Consents</div>
          <div className="stat-value">{stats.pendingConsents || 0}</div>
          <div className="stat-description">Awaiting activation</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Transactions</div>
          <div className="stat-value">{stats.totalTransactions || 0}</div>
          <div className="stat-description">Blockchain transactions</div>
        </div>
      </div>
    </div>
  );
};

export default StatsDashboard;


