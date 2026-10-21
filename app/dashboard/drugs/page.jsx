'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function DrugsDashboard() {
  const router = useRouter();

  const inventoryList = [
    { id: '9kH1N2k0NCM95t5yNgda', name: 'Amoxicillin (500mg)', category: 'Antibiotic', price: 2500 },
    
  ]
  const handleBuyNow = (drug) => {
    // Encodes parameters into the URL string for zero-cart checkout routing
    router.push(`/checkout?name=${encodeURIComponent(drug.name)}&price=${drug.price}`);
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'system-ui, sans-serif', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px' }}>Drugs Marketplace</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
        {inventoryList.map((drug) => (
          <div key={drug.id} style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', padding: '20px', borderRadius: '12px' }}>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: '600' }}>{drug.name}</h3>
            <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 12px 0' }}>{drug.category}</p>
            <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#2563eb', margin: '0 0 16px 0' }}>₦{drug.price.toLocaleString()}</p>
            
            <button 
              onClick={() => handleBuyNow(drug)}
              style={{ width: '100%', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', padding: '10px', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}
            >
              Buy Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
