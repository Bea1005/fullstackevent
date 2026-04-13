import React, { useState, useRef, useEffect } from 'react';
import './AdminPortal.css';

const AdminRequirements = () => {
  const fileInputRef = useRef(null);
  const [newReqTitle, setNewReqTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedRequirement, setSelectedRequirement] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  const [uploadedReqs, setUploadedReqs] = useState([
    { 
      id: 1, 
      title: 'Parent Consent Form Intramural 2026', 
      fileName: 'basketball_consent.pdf', 
      date: 'Jan 15, 2026',
      fileType: 'PDF',
      fileSize: '245 KB',
      isRequired: true,
  
    },
    { 
      id: 2, 
      title: 'Parent Consent Form Intramural 2025', 
      fileName: 'basketball_consent.pdf', 
      date: 'Jan 15, 2026',
      fileType: 'PDF',
      fileSize: '245 KB',
      isRequired: true,
    },
    { 
       id: 2, 
      title: 'Parent Consent Form Intramural 2024', 
      fileName: 'basketball_consent.pdf', 
      date: 'Jan 15, 2026',
      fileType: 'PDF',
      fileSize: '245 KB',
      isRequired: true,
    },
  ]);

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleOpenModal = (req) => {
    setSelectedRequirement(req);
    setShowModal(true);
  };

  const handleDownloadFromModal = () => {
    if (selectedRequirement) {
      const content = selectedRequirement.content;
      const blob = new Blob([content], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedRequirement.title.toLowerCase().replace(/ /g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      setShowModal(false);
    }
  };

  const handleUpload = (e) => {
    e.preventDefault();
    if (!newReqTitle || !selectedFile) {
      return alert("Missing Information: Please provide a title and a file.");
    }

    const entry = {
      id: Date.now(),
      title: newReqTitle,
      description: `Parent/Guardian consent for ${newReqTitle}`,
      fileName: selectedFile.name,
      date: new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date()),
      fileType: 'PDF',
      fileSize: selectedFile.size > 1024 ? `${Math.round(selectedFile.size / 1024)} KB` : `${selectedFile.size} bytes`,
      isRequired: true,
      content: `${newReqTitle.toUpperCase()}\n\nParent/Guardian consent form for athletic participation.\n\nPlease fill out this form and submit to the Athletics Office.\n\nParent/Guardian Name: _______________________\nStudent Name: _______________________\nSport: _______________________\nSignature: _______________________\nDate: ___________________________`
    };

    setUploadedReqs([entry, ...uploadedReqs]);
    setNewReqTitle('');
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="admin-page-content">
      {/* HEADER SECTION */}
      <div className="page-header-container">
        <div className="header-text">
          <h1 className="main-title">Requirements Management</h1>
          <p className="sub-title-desc">Publish downloadable Parent Consent forms for athletes</p>
        </div>
      </div>

      <hr className="divider" />

      {/* UPLOAD PANEL */}
      <div className="upload-section-panel">
        <div className="upload-maroon-card">
          <div className="card-header-inner">
            <span className="icon-badge">📁</span>
            <h3>Upload New Requirement</h3>
          </div>
          
          <form className="admin-upload-form" onSubmit={handleUpload}>
            <div className="form-row">
              <div className="input-field-group">
                <label>Requirement Title</label>
                <input 
                  type="text" 
                  placeholder="e.g., Parent Consent Form Intramural 2025" 
                  value={newReqTitle}
                  onChange={(e) => setNewReqTitle(e.target.value)}
                  className="modern-text-input"
                />
              </div>

              <div className="input-field-group">
                <label>Select Document</label>
                <div className="custom-file-upload">
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden-file-input"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="file-label-styled">
                    {selectedFile ? selectedFile.name : "Choose File..."}
                  </label>
                </div>
              </div>
            </div>

            <button type="submit" className="primary-upload-btn">
              📤 Publish to Portal
            </button>
          </form>
        </div>
      </div>

      {/* ACTIVE REQUIREMENTS - Same design as Student Requirements */}
      <div className="admin-requirements-list">
        <div className="admin-reqs-header">
          <h3>📄 Active Requirements </h3>
          <p>Click on any form to view details or download</p>
        </div>

        <div className="requirements-boxes-grid">
          {uploadedReqs.map((req) => (
            <div 
              key={req.id} 
              className="requirement-box"
              onClick={() => handleOpenModal(req)}
            >
              <div className="requirement-box-icon">
                📄
              </div>
              <div className="requirement-box-content">
                <h4>{req.title}</h4>
                <p>{req.description}</p>
                <div className="requirement-box-meta">
                  <span className="meta-date">📅 Posted: {req.date}</span>
                </div>
              </div>
              <div className="requirement-box-arrow">
                <span className="arrow-icon">›</span>
              </div>
            </div>
          ))}
        </div>

        <div className="admin-reqs-note">
          <p>💡 <strong>Note:</strong> These Parent Consent forms are visible to all students. They can download and submit accomplished forms.</p>
        </div>
      </div>

      {/* Minimal Modal Popup for Download */}
      {showModal && selectedRequirement && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content minimal-modal" onClick={(e) => e.stopPropagation()}>
            <div className="minimal-modal-header">
              <h3>{selectedRequirement.title}</h3>
              <button className="minimal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="minimal-modal-body">
              <p>Ready to download "{selectedRequirement.title}"</p>
              <p className="file-info">📁 {selectedRequirement.fileType} • {selectedRequirement.fileSize}</p>
              <p className="file-description">{selectedRequirement.description}</p>
            </div>
            <div className="minimal-modal-footer">
              <button className="minimal-cancel" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="minimal-download" onClick={handleDownloadFromModal}>Download</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRequirements;