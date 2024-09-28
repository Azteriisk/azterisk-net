import React from 'react';
import CostComparisonChart from '@/components/cost-comparison-chart';
import QuestionMarkCircle from '@/components/QuestionMarkCircle';

export default function LineagePage() {
  return (
    <div>
      <div className='flex justify-between items-center p-4 relative'>
        <div className="absolute left-4">
          {/* This empty div maintains space on the left */}
        </div>
        <div className="flex-grow flex justify-center items-center">
          <div className="flex items-center">
            <img src="/Accelerate.png" alt="Accelerate Logo" width={250} height={62} className="object-contain" />
            <span className="ml-0 text-3xl font-semibold text-gray-600 mt-5">Quote Analyzer</span>
          </div>
        </div>
        <div className="pr-4">
          <QuestionMarkCircle />
        </div>
      </div>
      <CostComparisonChart />
    </div>
  );
}
