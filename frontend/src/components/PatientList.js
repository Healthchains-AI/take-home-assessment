import React, { useState, useEffect, useRef } from 'react';
import './PatientList.css';
import { apiService } from '../services/apiService';

const PatientList = ({ onSelectPatient }) => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const debounceTimer = useRef(null);

  const fetchPatients = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getPatients(currentPage, 10, searchTerm);
      setPatients(response.patients || []);
      setPagination(response.pagination || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      setSearchTerm(inputValue);
      setCurrentPage(1);
    }, 300);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [inputValue]);

  useEffect(() => {
    fetchPatients();
  }, [currentPage, searchTerm]);

  const handleSearch = (e) => {
    setInputValue(e.target.value);
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  if (error) {
    return (
      <div className="patient-list-container">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="patient-list-container">
      <div className="patient-list-header">
        <h2>Patients</h2>
        <input
          type="text"
          placeholder="Search patients..."
          className="search-input"
          value={inputValue}
          onChange={handleSearch}
        />
      </div>

      {loading && patients.length === 0 ? (
        <div className="loading">Loading patients...</div>
      ) : (
        <>
          <div className="patient-list">
        {patients.length === 0 ? (
          <div className="placeholder">
            <p>No patients found</p>
          </div>
        ) : (
          patients.map((patient) => (
            <div
              key={patient.id}
              className="patient-card"
              onClick={() => onSelectPatient(patient.id)}
            >
              <div className="patient-card-header">
                <div>
                  <div className="patient-name">{patient.name}</div>
                  <div className="patient-id">{patient.patientId}</div>
                </div>
              </div>
              <div className="patient-info">
                <div className="patient-info-item">
                  <span>Email:</span>
                  <span>{patient.email}</span>
                </div>
                <div className="patient-info-item">
                  <span>DOB:</span>
                  <span>{new Date(patient.dateOfBirth).toLocaleDateString()}</span>
                </div>
                <div className="patient-info-item">
                  <span>Gender:</span>
                  <span>{patient.gender}</span>
                </div>
                <div className="patient-info-item">
                  <span>Phone:</span>
                  <span>{patient.phone}</span>
                </div>
              </div>
              <div className="patient-wallet">
                {formatAddress(patient.walletAddress)}
              </div>
            </div>
          ))
        )}
          </div>

          {pagination && (
            <div className="pagination">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className="pagination-info">
                Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
              </span>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage >= pagination.totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PatientList;


