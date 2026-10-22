'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShoppingCart, Truck, CreditCard, ChevronRight, Loader2 } from 'lucide-react';

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
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    setIsSubmitting(true);
    // Redirect straight to the custom payment screen, passing the total amount via URL
    setTimeout(() => {
      router.push(`/payment-confirmation?amount=${totalAmount}`);
    }, 800);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-10 text-slate-900 font-sans">
      {/* Title Header */}
      <div className="flex items-center gap-2.5 mb-8">
        <div className="p-2 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
          <ShoppingCart size={22} />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">Checkout Gate</h1>
          <p className="text-xs text-slate-500 mt-0.5">Finalise transactional variables and fulfillment coordinates.</p>
        </div>
      </div>
      
      {/* Responsive layout matrix: stack columns on mobile, row on large screens */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* Left Area: Forms */}
        <div className="w-full lg:flex-1 flex flex-col gap-6">
          
          {/* Section 1: Customer Details Form */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 md:p-6 shadow-sm flex flex-col gap-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 pb-3 border-b border-slate-100 flex items-center gap-2">
              <Truck size={16} className="text-slate-500" /> Delivery Information
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-1">
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Full Name *</label>
                <input 
                  type="text" 
                  placeholder="John Doe" 
                  value={fullName} 
                  onChange={(e) => setFullName(e.target.value)} 
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 bg-slate-50/50 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                />
              </div>

              <div className="sm:col-span-1">
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email Address *</label>
                <input 
                  type="email" 
                  placeholder="johndoe@example.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 bg-slate-50/50 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Delivery Address *</label>
              <textarea 
                rows="3" 
                placeholder="House number, Street name, City, State" 
                value={deliveryAddress} 
                onChange={(e) => setDeliveryAddress(e.target.value)} 
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 bg-slate-50/50 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors resize-none"
              />
            </div>
          </div>

          {/* Section 2: Bank Selection */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 md:p-6 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 pb-3 mb-4 border-b border-slate-100 flex items-center gap-2">
              <CreditCard size={16} className="text-slate-500" /> Choose Settlement Option
            </h2>
            
            <div className="flex flex-col gap-3">
              {paymentMethodsList.map((method) => {
                const isSelected = selectedMethod === method.id;
                return (
                  <div 
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500' 
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <input 
                      type="radio" 
                      checked={isSelected} 
                      readOnly 
                      className="mt-1 h-4 w-4 accent-blue-600 shrink-0" 
                    />
                    <div>
                      <p className={`font-semibold text-sm transition-colors ${isSelected ? 'text-blue-900' : 'text-slate-900'}`}>
                        {method.name}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                        {method.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Area: Order Summary Calculations Box */}
        <div className="w-full lg:w-[380px] shrink-0 sticky lg:top-24">
          <div className="bg-slate-900 text-white p-5 md:p-6 rounded-xl border border-slate-800 shadow-lg">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 pb-3 mb-4 border-b border-slate-800">
              Order Summary
            </h2>
            
            <div className="pb-4 mb-4 border-b border-slate-800 flex justify-between items-start gap-2">
              <div>
                <p className="font-semibold text-sm leading-snug">{drugName}</p>
                <p className="text-xs text-slate-400 mt-1">Base Cost Asset</p>
              </div>
              <p className="font-mono text-sm font-bold text-slate-200">₦{drugPrice.toLocaleString()}</p>
            </div>

            <div className="flex justify-between mb-4 text-xs text-slate-400">
              <span>Delivery Logistics Fee</span>
              <span className="font-mono text-slate-300">₦{deliveryFee.toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between items-baseline mb-6 pt-2 border-t border-dashed border-slate-800">
              <span className="text-sm font-medium text-slate-300">Total Settlement</span>
              <span className="text-xl font-mono font-bold text-blue-400">₦{totalAmount.toLocaleString()}</span>
            </div>

            <button
              onClick={handlePaymentProcessing}
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 text-white py-3 px-4 text-sm font-bold rounded-lg shadow-md transition-all flex items-center justify-center gap-2 group"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Authorizing Gateway...
                </>
              ) : (
                <>
                  Authorize Transaction <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-400 text-xs font-medium gap-2">
        <Loader2 className="animate-spin text-blue-600" size={24} />
        Mounting secure checkout module...
      </div>
    }>
      <CheckoutForm />
    </Suspense>
  );
}
