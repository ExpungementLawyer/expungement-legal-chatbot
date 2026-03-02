import React from 'react';

export default function ZohoFormCard() {
  return (
    <div className="el-card-animate w-full flex justify-center my-4">
      <div className="w-full max-w-[800px] mx-auto bg-white shadow-[0_0_22px_#d8dfed] rounded-[10px] overflow-hidden">
        <iframe
          title="Do You Qualify?"
          aria-label="Do You Qualify?"
          frameBorder="0"
          style={{ height: '600px', width: '100%', border: 'none' }}
          src="https://forms.zohopublic.com/wydelawgm1/form/FreeEligibilityCheck/formperma/hyOPkKRtOSipq0RElSEaeqmvPkaIP_aY50-kLBRtCFY"
        ></iframe>
      </div>
    </div>
  );
}
