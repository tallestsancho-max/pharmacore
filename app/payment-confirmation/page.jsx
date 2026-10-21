    'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

// Component that safely extracts URL query params inside a Next.js Suspense context boundary
function PaymentConfirmationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read the total amount dynamically from the URL parameter (defaults to NGN 4,000 if blank)
  const totalAmount = parseInt(searchParams.get('amount') || '4000', 10);

  const [isVerifying, setIsVerifying] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('pending'); // 'pending' or 'success'

  // Simulates bank network validation
  const handleVerifyPayment = () => {
    setIsVerifying(true);
    
    // Simulate a 3-second secure background check against the settlement API
    setTimeout(() => {
      setIsVerifying(false);
      setPaymentStatus('success');
      alert("Payment received! PharmaCore engine updated.");
    }, 3000);
  };

  // 1. Success Screen State
  if (paymentStatus === 'success') {
    return (
      <div style={{ maxWidth: '500px', margin: '60px auto', padding: '40px 24px', fontFamily: 'system-ui, sans-serif', textAlign: 'center', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>✅</div>
        <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#10b981', margin: '0 0 12px 0', letterSpacing: '-0.025em' }}>Payment Successful!</h1>
        <p style={{ color: '#4b5563', lineHeight: '1.6', fontSize: '15px', margin: '0 0 32px 0' }}>
          Your bank transfer has been successfully verified. Your drug order allocation has been pushed into the delivery preparation pipeline.
        </p>
        <Link href="/dashboard/drugs" style={{ display: 'block', backgroundColor: '#2563eb', color: '#ffffff', textDecoration: 'none', padding: '14px', borderRadius: '8px', fontWeight: '600', fontSize: '15px', transition: 'background-color 0.15s' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}>
          Back to Marketplace
        </Link>
      </div>
    );
  }

  // 2. Pending Settlement Form View State
  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '32px', fontFamily: 'system-ui, sans-serif', color: '#111827', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)' }}>
      <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px', textAlign: 'center', letterSpacing: '-0.02em' }}>Complete Your Transfer</h1>
      <p style={{ color: '#6b7280', fontSize: '14px', textAlign: 'center', margin: '0 0 32px 0' }}>Transfer the exact amount below via your bank app or USSD line to fulfill the drug request.</p>

      {/* Amount Due Indicator Block */}
      <div style={{ backgroundColor: '#f8fafc', padding: '24px', borderRadius: '8px', textAlign: 'center', marginBottom: '24px', border: '1px solid #e2e8f0' }}>
        <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '600', letterSpacing: '0.05em' }}>TOTAL AMOUNT DUE</span>
        <h2 style={{ fontSize: '36px', fontWeight: '800', color: '#2563eb', margin: '6px 0 0 0' }}>₦{totalAmount.toLocaleString()}</h2>
      </div>

      {/* FirstBank Corporate Allocation Card Details */}
      <div style={{ border: '1px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden', marginBottom: '32px' }}>
        <div style={{ backgroundColor: '#f1f5f9', padding: '12px 16px', fontWeight: '600', borderBottom: '1px solid #cbd5e1', color: '#334155', fontSize: '14px' }}>
          🏦 PharmaCore Settlement Destination
        </div>
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: '#ffffff' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px', alignItems: 'center' }}>
            <span style={{ color: '#64748b', fontSize: '14px' }}>Bank Name</span>
            <span style={{ fontWeight: '600', color: '#0f172a', fontSize: '15px' }}>First Bank of Nigeria</span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px', alignItems: 'center' }}>
            <span style={{ color: '#64748b', fontSize: '14px' }}>Account Number</span>
            <span style={{ fontWeight: '700', fontSize: '18px', color: '#2563eb', display: 'flex', alignItems: 'center', gap: '8px' }}>
              3012345678 
              <button 
                onClick={() => { navigator.clipboard.writeText('3012345678'); alert('Account number copied!'); }} 
                style={{ padding: '4px 8px', fontSize: '12px', fontWeight: '500', cursor: 'pointer', backgroundColor: '#e2e8f0', border: 'none', borderRadius: '4px', color: '#334155' }}
              >
                📋 Copy
              </button>
            </span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#64748b', fontSize: '14px' }}>Account Name</span>
            <span style={{ fontWeight: '600', color: '#0f172a', fontSize: '15px' }}>PHARMACORE ENTERPRISE LTD</span>
          </div>

        </div>
      </div>

      {/* Safety Notice Warning Label */}
      <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fef3c7', padding: '14px 16px', borderRadius: '8px', color: '#92400e', fontSize: '13px', lineHeight: '1.5', marginBottom: '28px' }}>
        ℹ️ <strong>Instructions:</strong> Please complete your payment transaction within your banking terminal app, then return to this page and click the confirmation handle directly beneath.
      </div>

      {/* Verification Query Action Hook Trigger */}
      <button
        onClick={handleVerifyPayment}
        disabled={isVerifying}
        style={{
          width: '100%',
          backgroundColor: isVerifying ? '#94a3b8' : '#10b981',
          color: '#ffffff',
          padding: '16px',
          fontSize: '16px',
          fontWeight: '700',
          borderRadius: '8px',
          border: 'none',
          cursor: isVerifying ? 'not-allowed' : 'pointer',
          boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.2)',
          transition: 'all 0.15s'
        }}
      >
        {isVerifying ? "🔄 Querying Settlement Ledger..." : "I Have Made the Transfer"}
      </button>
    </div>
  );
}

// Main page wrapper enclosing our client component within Next.js suspense rules
export default function PaymentConfirmationPage() {
  return (
    <Suspense fallback={
      <div style={{ textAlign: 'center', marginTop: '100px', fontFamily: 'system-ui, sans-serif', color: '#6b7280' }}>
        Loading secure payment profile...
      </div>
    }>
      <PaymentConfirmationContent />
    </Suspense>
  );
}
