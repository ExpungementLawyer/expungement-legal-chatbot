import React, { useEffect, useRef } from 'react';

export default function ZohoFormCard() {
  const formRef = useRef(null);

  useEffect(() => {
    // Ported from the raw HTML script block
    function getQueryParam(param) {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get(param);
    }

    // Save to localStorage when losing focus
    const saveToLocalStorage = () => {
      const gclid = getQueryParam('gclid');
      if (gclid) {
        localStorage.setItem('_gcl_aw', gclid);
      }
    };
    saveToLocalStorage();

    const gclidValue = localStorage.getItem('_gcl_aw');
    const form = formRef.current;

    if (form) {
      const gclidInput = form.querySelector('input[name="GCLID"]');
      if (gclidInput && gclidValue) {
        gclidInput.value = gclidValue;
      }

      const emailInput = form.querySelector('input[name="Email"]');
      if (emailInput) {
        emailInput.addEventListener('blur', function () {
          localStorage.setItem('zoho_email', this.value);
        });
        const savedEmail = localStorage.getItem('zoho_email');
        if (savedEmail) {
          emailInput.value = savedEmail;
        }
      }

      // Intercept the inline validation alert script from original HTML
      form.addEventListener('submit', (e) => {
        let isErr = false;
        const requiredInputs = form.querySelectorAll('[required]');
        for (let i = 0; i < requiredInputs.length; i++) {
          if (!requiredInputs[i].value.trim()) {
            isErr = true;
            break;
          }
        }

        if (isErr) {
          e.preventDefault();
          // Rely on browser native validation
        } else {
          // Provide a visual loading state to indicate submission
          const submitBtn = form.querySelector('button[type="submit"]');
          if (submitBtn) {
            submitBtn.innerText = "Submitting...";
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';
          }
        }
      });
    }
  }, []);

  return (
    <div className="el-card-animate w-full flex justify-center my-4">
      <div className="w-full max-w-[800px] mx-auto p-[20px] md:p-[30px] bg-white shadow-[0_0_22px_#d8dfed] rounded-[10px] text-[#444] font-sans">
        <div className="mb-[25px] pb-[15px] border-b border-[#e5e5e5]">
          <h2 className="text-[22px] font-bold text-[#252c3e] m-0">You're Eligible! Complete Your Request</h2>
        </div>

        <form
          ref={formRef}
          action="https://forms.zohopublic.com/expungementlegal/form/EligibilityCheck/formperma/hPj6yQ3C4tBfH7Z4Y8R9_uE6nW5K3M7J2tF4hC9A0rP/htmlRecords/submit"
          name="form"
          id="form"
          method="POST"
          acceptCharset="UTF-8"
          encType="multipart/form-data"
        >
          <input type="hidden" name="zf_referrer_name" defaultValue="" />
          <input type="hidden" name="zf_redirect_url" defaultValue="" />
          <input type="hidden" name="zc_gad" defaultValue="" />

          <div className="mb-[22px] relative">
            <label className="block font-semibold text-[16px] text-[#252c3e] mb-[8px]">
              First Name <em className="text-[#d72424] not-italic">*</em>
            </label>
            <input
              type="text"
              name="Name_First"
              required
              maxLength="255"
              className="w-full p-[12px] border border-[#d3d9e2] rounded-[6px] text-[15px] transition-colors focus:outline-none focus:border-[#4285f4] focus:shadow-[0_0_0_2px_rgba(66,133,244,0.1)]"
            />
          </div>

          <div className="mb-[22px] relative">
            <label className="block font-semibold text-[16px] text-[#252c3e] mb-[8px]">
              Last Name <em className="text-[#d72424] not-italic">*</em>
            </label>
            <input
              type="text"
              name="Name_Last"
              required
              maxLength="255"
              className="w-full p-[12px] border border-[#d3d9e2] rounded-[6px] text-[15px] transition-colors focus:outline-none focus:border-[#4285f4] focus:shadow-[0_0_0_2px_rgba(66,133,244,0.1)]"
            />
          </div>

          <div className="mb-[22px] relative">
            <label className="block font-semibold text-[16px] text-[#252c3e] mb-[8px]">
              Email <em className="text-[#d72424] not-italic">*</em>
            </label>
            <input
              type="email"
              name="Email"
              required
              maxLength="255"
              className="w-full p-[12px] border border-[#d3d9e2] rounded-[6px] text-[15px] transition-colors focus:outline-none focus:border-[#4285f4] focus:shadow-[0_0_0_2px_rgba(66,133,244,0.1)]"
            />
          </div>

          <div className="mb-[22px] relative">
            <label className="block font-semibold text-[16px] text-[#252c3e] mb-[8px]">
              Phone <em className="text-[#d72424] not-italic">*</em>
            </label>
            <input
              type="text"
              name="PhoneNumber_countrycode"
              required
              maxLength="20"
              className="w-full p-[12px] border border-[#d3d9e2] rounded-[6px] text-[15px] transition-colors focus:outline-none focus:border-[#4285f4] focus:shadow-[0_0_0_2px_rgba(66,133,244,0.1)]"
            />
          </div>

          <div className="mb-[22px] relative">
            <label className="block font-semibold text-[16px] text-[#252c3e] mb-[8px]">GCLID</label>
            <input
              type="text"
              name="SingleLine"
              defaultValue=""
              maxLength="255"
              className="w-full p-[12px] border border-[#d3d9e2] rounded-[6px] text-[15px] transition-colors focus:outline-none focus:border-[#4285f4] focus:shadow-[0_0_0_2px_rgba(66,133,244,0.1)]"
            />
          </div>

          <div className="mt-[30px] pt-[20px] border-t border-[#e5e5e5] flex justify-end">
            <button
              type="submit"
              className="bg-[#4285f4] text-white py-[12px] px-[32px] rounded-[6px] font-semibold text-[16px] border-none cursor-pointer transition-colors hover:bg-[#3367d6]"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
