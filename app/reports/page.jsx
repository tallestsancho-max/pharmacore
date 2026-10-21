'use client';

import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
// Double check that this path matches your exact firebase configuration file path
import { db } from "../../lib/firebase"; 

export default function ReportsPage() {
  // Form State Fields
  const [studentId, setStudentId] = useState('');
  const [drugName, setDrugName] = useState('');
  const [complaintType, setComplaintType] = useState('adverse_effect');
  const [description, setDescription] = useState('');
  
  // UI Status State
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Firestore submission handler logic
  const handleSubmitComplaint = async (e) => {
    e.preventDefault();

    if (!studentId || !drugName || !description) {
      alert("Please completely fill out all the fields before submitting.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Automatically writes straight to a new collection named 'student_complaints'
      await addDoc(collection(db, "student_complaints"), {
        studentId: studentId.trim(),
        drugName: drugName.trim(),
        complaintType: complaintType,
        description: description.trim(),
        status: "pending_review", // Default status tracker for administration
        createdAt: serverTimestamp() // Generates standard database server timestamps
      });

      alert("Thank you. Your complaint has been securely submitted to the medical review board.");
      
      // Reset form input tracking values
      setStudentId('');
      setDrugName('');
      setDescription('');
    } catch (error) {
      console.error("Error logging complaint into Firestore:", error);
      alert("Failed to submit entry. Please verify your firestore rules allow write access.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '750px', margin: '40px auto', padding: '0 20px', fontFamily: 'system-ui, sans-serif', color: '#111827' }}>
      
      {/* Page Header Headers */}
      <header style={{ marginBottom: '32px', borderBottom: '1px solid #e5e7eb', paddingBottom: '16px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', margin: 0, letterSpacing: '-0.02em' }}>Reports & Diagnostics</h1>
        <p style={{ color: '#6b7280', marginTop: '6px', fontSize: '15px' }}>Submit pharmaceutical anomaly reports and student tracking matrices.</p>
      </header>

      {/* Interactive Form Section Deck */}
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 4px 0', color: '#dc2626', display: 'flex', alignItems: 'center', gap: '8px' }}>
          ⚠️ Student Drug Complaint Desk
        </h2>
        <p style={{ color: '#4b5563', fontSize: '14px', margin: '0 0 24px 0' }}>Are you experiencing an unlisted side effect or notice a quality flaw? Log an incident profile immediately below.</p>

        <form onSubmit={handleSubmitComplaint} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Row layout grouping for quick text data blocks */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px', color: '#374151' }}>Student Matric / ID Number</label>
              <input type="text" placeholder="e.g. STU/2026/001" required value={studentId} onChange={(e) => setStudentId(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box', fontSize: '14px' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px', color: '#374151' }}>Name of Drug / Medicine</label>
              <input type="text" placeholder="e.g. Amoxicillin Capsule" required value={drugName} onChange={(e) => setDrugName(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box', fontSize: '14px' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px', color: '#374151' }}>Nature of Incident</label>
            <select value={complaintType} onChange={(e) => setComplaintType(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box', backgroundColor: '#ffffff', fontSize: '14px', cursor: 'pointer' }}>
              <option value="adverse_effect">🤮 Severe Side Effect / Adverse Reaction</option>
              <option value="packaging_defect">📦 Damaged / Tampered Packaging</option>
              <option value="ineffective_dose">📉 Ineffective Medicine / Potency Issue</option>
              <option value="incorrect_label">🏷️ Wrong Labeling / Prescription Misprint</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px', color: '#374151' }}>Detailed Description</label>
            <textarea rows="4" placeholder="Please describe exactly what happened after taking the medication, including dates, timelines, and specific symptoms felt..." required value={description} onChange={(e) => setDescription(e.target.value)} style={{ width: '100%', padding: '12px 14px', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box', fontFamily: 'inherit', fontSize: '14px', resize: 'vertical' }} />
          </div>

          {/* Submission Execution Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              backgroundColor: isSubmitting ? '#94a3b8' : '#dc2626',
              color: '#ffffff',
              padding: '14px',
              fontSize: '15px',
              fontWeight: '600',
              borderRadius: '8px',
              border: 'none',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 6px -1px rgba(220, 38, 38, 0.1)',
              transition: 'background-color 0.15s',
              marginTop: '8px'
            }}
          >
            {isSubmitting ? "🔒 Processing Report Entry..." : "Submit Incident Report"}
          </button>

        </form>
      </div>
    </div>
  );
}
