import { User, Mail, Phone, MapPin, CreditCard, Lock, Check, Globe } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CompleteOrder() {
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);

  return (
    <section className="bg-theme-bg text-theme-text min-h-screen py-10">

      <div className="max-w-[1265px] lg:px-6 px-3 mx-auto">
        <div className="mb-12">
          <p className="text-theme-muted cursor-pointer mb-10" onClick={()=>navigate("/orderplace")}>← Back to pricing</p>
          <h1 className="text-[32px] lg:text-[48px] mb-2 text-center">
            Complete Your <span className="text-[#10B981]">Order</span>
          </h1>
          <p className="text-theme-muted text-center">
            You're one step away from unlocking powerful features
          </p>
        </div>

        <div className="grid lg:grid-cols-[2fr_1fr] gap-6">
          <div className="space-y-6">

            <div className="bg-[#111937] border-2 border-[#1E2846] rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-10 h-10 bg-[#10B98133] rounded-[10px] flex items-center justify-center">
                  <User className="text-[#10B981]" size={20} />
                </span>
                <h2 className="text-xl font-semibold">Personal Information</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[#D1D5DC] mb-2 block" htmlFor="first-name">First Name *</label>
                  <input id="first-name" className="commoninput" placeholder="First Name" />
                </div>
                <div>
                  <label className="text-[#D1D5DC] mb-2 block" htmlFor="last-name">Last Name *</label>
                  <input id="last-name" className="commoninput" placeholder="Last Name" />
                </div>
                <div>
                  <label className="text-[#D1D5DC] mb-2 block" htmlFor="first-name">Email Address *</label>
                  <div className="relative">
                    <Mail className="commonicon" />
                    <input className="commoninput !pl-10" placeholder="Email Address" />
                  </div>
                </div>
                <div>
                  <label className="text-[#D1D5DC] mb-2 block" htmlFor="phone">Phone Number *</label>
                  <div className="relative">
                    <Phone className="commonicon" />
                    <input className="commoninput !pl-10" placeholder="Phone Number" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#111937] border-2 border-[#1E2846] rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-10 h-10 bg-[#10B98133] rounded-[10px] flex items-center justify-center">
                  <MapPin className="text-[#10B981]" size={20} />
                </span>
                <h2 className="text-xl font-semibold">Business Information</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-[#D1D5DC] mb-2 block" htmlFor="business-name">Restaurant/Business Name *</label>
                  <input id="business-name" className="commoninput" placeholder="Your Restaurant Name" />
                </div>

                <div>
                  <label className="text-[#D1D5DC] mb-2 block" htmlFor="first-name">Business Address *</label>
                  <div className="relative">
                    <MapPin className="commonicon" />
                    <input className="commoninput !pl-10" placeholder="Business Address" />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="text-[#D1D5DC] mb-2 block" htmlFor="first-name">City *</label>
                    <input className="commoninput" placeholder="City" />
                  </div>
                  
                  <div>
                    <label className="text-[#D1D5DC] mb-2 block" htmlFor="first-name">State/Province *</label>
                    <input className="commoninput" placeholder="State" />
                  </div>
                  
                  <div>
                    <label className="text-[#D1D5DC] mb-2 block" htmlFor="first-name">ZIP/Postal Code *</label>
                    <input className="commoninput" placeholder="ZIP Code" />
                  </div>
                </div>
 <div>
                    <label className="text-[#D1D5DC] mb-2 block" htmlFor="first-name">Country *</label>
                <div className="relative">
                  <Globe className="commonicon" />
                  <input className="commoninput !pl-10" placeholder="Country" />
                </div>
                </div>
              </div>
            </div>

            <div className="bg-[#111937] border-2 border-[#1E2846] rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-10 h-10 bg-[#10B98133] rounded-[10px] flex items-center justify-center">
                  <CreditCard className="text-[#10B981]" size={20} />
                </span>
                <h2 className="text-xl font-semibold">Payment Details</h2>
              </div>

              <div className="space-y-6">
                 <div>
                    <label className="text-[#D1D5DC] mb-2 block" htmlFor="first-name">Card Number *</label>
                <input className="commoninput" placeholder="Card Number" />
                </div>
                 <div>
                    <label className="text-[#D1D5DC] mb-2 block" htmlFor="first-name">Cardholder Name *</label>
                <input className="commoninput" placeholder="Cardholder Name" />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                   <div>
                    <label className="text-[#D1D5DC] mb-2 block" htmlFor="first-name">Expiry Date *</label>
                  <input className="commoninput" placeholder="Expiry Date" />
                  </div>
                   <div>
                    <label className="text-[#D1D5DC] mb-2 block" htmlFor="first-name">CVV *</label>
                  <input className="commoninput" placeholder="CVV" />
                  </div>
                </div>
                <p className="text-theme-muted text-sm flex items-center gap-2">
                  <Lock size={16} className="text-[#10B981]" /> Your payment information is secure
                </p>
              </div>
            </div>

            <div className="bg-[#111937] border-2 border-[#1E2846] rounded-xl p-6">
              <label className="flex items-center gap-1 text-sm mb-6 text-theme-muted">
                <button
                  type="button"
                  onClick={() => setChecked(!checked)}
                  className={`w-4 h-4 min-w-4 rounded-[4px] mr-2 border transition-all duration-200 flex items-center justify-center
                    ${checked
                      ? "bg-[#10B981] border-[#10B981]"
                      : "bg-[#0F172B] border-[#334155] shadow-[0px_0px_0px_1px_#FFFFFF0D]"
                    }
                `}
                >
                  {checked && (
                    <Check size={14} className="text-theme-text" strokeWidth={3} />
                  )}
                </button>
                I agree to the <span className="text-[#10B981]">Terms of Service</span> and <span className="text-[#10B981]">Privacy Policy</span>
              </label>

              <button className="w-full bg-[#10B981] hover:bg-[#16A34A] transition py-3 rounded-lg font-medium flex items-center justify-center gap-2">
                <Lock size={16} className="!text-[#fff]" />
                Complete Secure Payment
              </button>

            </div>

          </div>

          <div className="bg-[#111937] border border-[#10B981] rounded-xl p-6 h-fit">
            <h3 className="text-lg mb-6 font-semibold">Order Summary</h3>
            <div className="bg-theme-bg border-2 border-[#1E2846] rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3 justify-between">
                <p className="text-sm text-theme-muted">Plan</p>
                <p className="text-xl font-semibold">Gold</p>
              </div>
              <p className="text-[#fff] text-[30px] flex items-end leading-[1] justify-end mt-4">$79<span className="text-sm text-[#99A1AF]">/month</span></p>
            </div>

            <div className="space-y-3 text-sm text-theme-muted mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>$79</span>
              </div>
              <div className="flex justify-between">
                <span>Processing Fee</span>
                <span>$0</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>$0</span>
              </div>
            </div>

            <div className="border-t border-theme-border pt-4 flex justify-between items-center">
              <span className="text-[20px]">Total Due Today</span>
              <span className="text-[#10B981] text-[30px]">$79</span>
            </div>

            <div className="border border-[#10B9814D] bg-[#10B9811A] rounded-xl p-5 flex gap-3 mt-6 items-start">
              <div>
                <p className="text-[#10B981] font-medium mb-1 flex items-center gap-3">
                  💳 <span>Billing starts today</span>
                </p>

                <p className="text-theme-muted text-sm leading-relaxed">
                  You'll be charged $79 monthly. Cancel anytime from your account settings.
                </p>
              </div>

            </div>

            <div className="mt-6 text-sm text-theme-muted border-t border-theme-border pt-6">
              <p className="mb-2 font-medium text-theme-text">What's Included:</p>
              <ul className="space-y-2 list-disc pl-5 marker:text-[#10B981]">
                <li>Instant account activation</li>
                <li>30-day money-back guarantee</li>
                <li>Free onboarding support</li>
                <li>No setup fees</li>
              </ul>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}