'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// 1. Move core logic into an internal component to safely capture useSearchParams during build
function CheckoutForm() {
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
    // Fixed container to fit smoothly on screens of any width
    <div style={{ maxWidth: '1100px', margin: '20px auto', padding: '0 16px', fontFamily: 'system-ui, sans-serif', color: '#111827'}}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>Checkout</h1>
      
      {/* 📱 FLUID DESIGN LAYOUT: Flexbox with dynamic wrapping drops the order summary column cleanly underneath on mobile screens */}
      <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap-reverse', gap: '24px', alignItems: 'flex-end' }}>
        
        {/* Left Area: Forms (takes full width on mobile, scales on desktop) */}
        <div style={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column', gap: '24px', minWidth: '280px' }}>
          
          {/* Section 1: Customer Details Form */}
          <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 4px 0', borderBottom: '1px solid #e5e7eb', paddingBottom: '12px' }}>Delivery Information</h2>
            
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px' }}>Full Name</label>
              <input type="text" placeholder="John Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box', fontSize: '14px' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px' }}>Email Address</label>
              <input type="email" placeholder="johndoe@example.com" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box', fontSize: '14px' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px' }}>Delivery Address</label>
              <textarea rows="3" placeholder="House number, Street name, City, State" value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box', fontSize: '14px', fontFamily: 'inherit' }} />
            </div>
          </div>

          {/* Section 2: Bank Lines Selection */}
          <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 12px 0', borderBottom: '1px solid #e5e7eb', paddingBottom: '12px' }}>Choose Bank / Payment Option</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {paymentMethodsList.map((method) => {
                const isSelected = selectedMethod === method.id;
                return (
                  <div 
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    style={{
                      padding: '14px',
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
                      <p style={{ margin: 0, fontWeight: '600', fontSize: '14px', color: isSelected ? '#1e40af' : '#111827' }}>{method.name}</p>
                      <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#6b7280' }}>{method.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Area: Order Summary Calculations Box */}
        <div style={{ flex: '1 1 350px', minWidth: '280px' }}>
          <div style={{ backgroundColor: '#f9fafb', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Order Summary</h2>
            
            <div style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '12px', marginBottom: '12px' }}>
              <p style={{ fontWeight: '600', margin: '0 0 4px 0', fontSize: '14px' }}>{drugName}</p>
              <p style={{ margin: 0, fontSize: '13px', color: '#4b5563' }}>₦{drugPrice.toLocaleString()}</p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '13px', color: '#4b5563' }}>
              <span>Delivery Fee</span>
              <span>₦{deliveryFee.toLocaleString()}</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '16px', fontWeight: 'bold' }}>
              <span>Total Cost</span>
              <span style={{ color: '#2563eb' }}>₦{totalAmount.toLocaleString()}</span>
            </div>

            <button
              onClick={handlePaymentProcessing}
              style={{ width: '100%', backgroundColor: '#2563eb', color: '#ffffff', padding: '12px', fontSize: '15px', fontWeight: '600', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
            >
              Authorize Transaction
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

// 2. Global export container wrapped in Suspense to ensure Vercel static optimization compiles seamlessly
export default function CheckoutPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100 screen', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: '#6b7280' }}>Mounting secure checkout module...</div>}>
      <CheckoutForm />
    </Suspense>
  );
}
