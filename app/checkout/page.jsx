'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Retrieve single drug selection parameters from the URL
  const drugName = searchParams.get('name') || 'Medical Prescription Item';
  const drugPrice = parseInt(searchParams.get('price') || '0', 10);

  // Customer Checkout Form Inputs
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('first_bank'); 

  // Calculations
  const deliveryFee = 1500; 
  const totalAmount = drugPrice + deliveryFee;

  const paymentMethodsList = [
    { id: 'first_bank', name: '🐘 First Bank Transfer', description: 'Pay natively to our FirstBank settlement account' },
    { id: 'gtbank', name: '🧡 GTBank Transfer', description: 'Pay natively to our GTBank settlement account' },
    { id: 'card', name: '💳 Pay with ATM Card', description: 'Visa, Mastercard, Verve' }
  ];

  const handlePaymentProcessing = (e) => {
    e.preventDefault(); 

    if (!email || !fullName || !deliveryAddress) {
      alert("Please fill out your Full Name, Email, and Delivery Address before checking out.");
      return;
    }

    // Redirect straight to the custom payment screen, passing the total amount via URL
    router.push(`/payment-confirmation?amount=${totalAmount}`);
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '40px auto', padding: '0 20px', fontFamily: 'system-ui, sans-serif', color: '#111827' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '32px' }}>Checkout</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: '40px' }}>
        
        {/* Left Column: Forms */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Section 1: Customer Details Form */}
          <div style={{ backgroundColor: '#ffffff', padding: '28px', borderRadius: '12px', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 8px 0', borderBottom: '1px solid #e5e7eb', paddingBottom: '12px' }}>Delivery Information</h2>
            
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>Full Name</label>
              <input type="text" placeholder="John Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>Email Address</label>
              <input type="email" placeholder="johndoe@example.com" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>Delivery Address</label>
              <textarea rows="3" placeholder="House number, Street name, City, State" value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box', fontFamily: 'inherit' }} />
            </div>
          </div>

          {/* Section 2: Bank Lines Selection */}
          <div style={{ backgroundColor: '#ffffff', padding: '28px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 16px 0', borderBottom: '1px solid #e5e7eb', paddingBottom: '12px' }}>Choose Bank / Payment Option</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {paymentMethodsList.map((method) => {
                const isSelected = selectedMethod === method.id;
                return (
                  <div 
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    style={{
                      padding: '16px',
                      borderRadius: '8px',
                      border: isSelected ? '2px solid #2563eb' : '1px solid #d1d5db',
                      backgroundColor: isSelected ? '#eff6ff' : '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px'
                    }}
                  >
                    <input type="radio" checked={isSelected} readOnly style={{ marginTop: '4px' }} />
                    <div>
                      <p style={{ margin: 0, fontWeight: '600', fontSize: '15px', color: isSelected ? '#1e40af' : '#111827' }}>{method.name}</p>
                      <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#6b7280' }}>{method.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary Calculations Box */}
        <div>
          <div style={{ backgroundColor: '#f9fafb', padding: '28px', borderRadius: '12px', border: '1px solid #e5e7eb', position: 'sticky', top: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>Order Summary</h2>
            
            <div style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '16px', marginBottom: '16px' }}>
              <p style={{ fontWeight: '600', margin: '0 0 4px 0' }}>{drugName}</p>
              <p style={{ margin: 0, fontSize: '14px', color: '#4b5563' }}>₦{drugPrice.toLocaleString()}</p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '14px', color: '#4b5563' }}>
              <span>Delivery Fee</span>
              <span>₦{deliveryFee.toLocaleString()}</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '28px', fontSize: '18px', fontWeight: 'bold' }}>
              <span>Total Cost</span>
              <span style={{ color: '#2563eb' }}>₦{totalAmount.toLocaleString()}</span>
            </div>

            <button
              onClick={handlePaymentProcessing}
              style={{ width: '100%', backgroundColor: '#2563eb', color: '#ffffff', padding: '14px', fontSize: '16px', fontWeight: '600', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
            >
              Authorize Transaction
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
