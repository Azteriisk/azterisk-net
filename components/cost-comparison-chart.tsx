"use client";

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

interface CostData {
  year: number;  // Changed from string to number
  purchaseEquipment: number;
  purchaseMaintenance: number;
  purchaseTotal: number;
  purchaseRunningTotal: number;
  leaseToOwnEquipment: number;
  leaseToOwnMaintenance: number;
  leaseToOwnTotal: number;
  leaseToOwnRunningTotal: number;
  standardLeaseEquipment: number;
  standardLeaseMaintenance: number;
  standardLeaseTotal: number;
  standardLeaseRunningTotal: number;
}

const calculateCosts = (
  purchasePrice: number,
  monthlyMaintenance: number,
  monthlyLease: number,
  leaseMonths: number,
  yearsToCalculate: number
): { data: CostData[], purchaseTotal: number, leaseToOwnTotal: number, standardLeaseTotal: number } => {
  const data: CostData[] = [];
  const purchaseEquipment = purchasePrice;
  let purchaseMaintenance = monthlyMaintenance * 12;
  const leaseToOwnEquipment = monthlyLease * 12;
  let leaseToOwnMaintenance = monthlyMaintenance * 12;
  const standardLeaseEquipment = monthlyLease * 12;
  let standardLeaseMaintenance = monthlyMaintenance * 12;
  let purchaseTotal = 0;
  let leaseToOwnTotal = 0;
  let standardLeaseTotal = 0;
  const leaseYears = leaseMonths / 12;
  const fullLeaseYears = Math.floor(leaseMonths / 12);

  for (let year = 1; year <= yearsToCalculate; year++) {
    const leaseToOwnYearEquipment = year <= leaseYears ? 
      (year === Math.ceil(leaseYears) ? monthlyLease * (leaseMonths % 12) : leaseToOwnEquipment) : 0;

    // Update maintenance costs
    if (year > 1) {
      purchaseMaintenance *= 1.12; // 12% increase each year after purchase
    }

    if (year > leaseYears) {
      const yearsAfterLease = year - leaseYears;
      if (yearsAfterLease <= 1) {
        // Apply the accumulated increase for the lease years
        const increaseFactor = 1 + (0.1 * fullLeaseYears);
        leaseToOwnMaintenance *= increaseFactor;
        standardLeaseMaintenance *= increaseFactor;
      } else {
        // Apply 12% increase for subsequent years
        leaseToOwnMaintenance *= 1.12;
        standardLeaseMaintenance *= 1.12;
      }
    }

    const purchaseYearTotal = (year === 1 ? purchaseEquipment : 0) + purchaseMaintenance;
    const leaseToOwnYearTotal = leaseToOwnYearEquipment + leaseToOwnMaintenance;
    const standardLeaseYearTotal = standardLeaseEquipment + standardLeaseMaintenance;
    
    purchaseTotal += purchaseYearTotal;
    leaseToOwnTotal += leaseToOwnYearTotal;
    standardLeaseTotal += standardLeaseYearTotal;

    data.push({
      year: year,  // This is now a number
      purchaseEquipment: year === 1 ? purchaseEquipment : 0,
      purchaseMaintenance: purchaseMaintenance,
      purchaseTotal: purchaseYearTotal,
      purchaseRunningTotal: purchaseTotal,
      leaseToOwnEquipment: leaseToOwnYearEquipment,
      leaseToOwnMaintenance: leaseToOwnMaintenance,
      leaseToOwnTotal: leaseToOwnYearTotal,
      leaseToOwnRunningTotal: leaseToOwnTotal,
      standardLeaseEquipment: standardLeaseEquipment,
      standardLeaseMaintenance: standardLeaseMaintenance,
      standardLeaseTotal: standardLeaseYearTotal,
      standardLeaseRunningTotal: standardLeaseTotal,
    });
  }

  return { data, purchaseTotal, leaseToOwnTotal, standardLeaseTotal };
};

interface ChartDataType {
  data: CostData[];
  purchaseTotal: number;
  leaseToOwnTotal: number;
  standardLeaseTotal: number;
}

const CostComparisonCharts = () => {
  const [purchasePrice, setPurchasePrice] = useState(5098.98);
  const [monthlyMaintenance, setMonthlyMaintenance] = useState(45);
  const [monthlyLease, setMonthlyLease] = useState(128.08);
  const [leaseMonths, setLeaseMonths] = useState(63);
  const [yearsToCalculate, setYearsToCalculate] = useState(7);
  const [showRunningTotal, setShowRunningTotal] = useState(false);
  const [chartData, setChartData] = useState<ChartDataType>({
    data: [],
    purchaseTotal: 0,
    leaseToOwnTotal: 0,
    standardLeaseTotal: 0,
  });

  useEffect(() => {
    setChartData(calculateCosts(purchasePrice, monthlyMaintenance, monthlyLease, leaseMonths, yearsToCalculate));
  }, [purchasePrice, monthlyMaintenance, monthlyLease, leaseMonths, yearsToCalculate]);

  const formatCurrency = (value: number | undefined) => {
    if (typeof value === 'number') {
      return `$${value.toFixed(2)}`;
    }
    return '$0.00';
  };

  interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{
      name: string;
      value: number;
      payload: {
        [key: string]: number;
      };
    }>;
    label?: string;
  }

  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip bg-white p-4 border border-gray-300 rounded shadow-lg">
          <p className="label">{`${label}`}</p>
          {payload.map((pld) => (
            <p key={pld.name} style={{ color: pld.payload.color as unknown as string | undefined }}>
              {`${pld.name}: ${formatCurrency(Number(pld.value))}`}
            </p>
          ))}
          {showRunningTotal}
        </div>
      );
    }
    return null;
  };

  const renderLineChart = (option: string, title: string) => {
    const formatXAxis = (tickItem: number) => `Year ${tickItem}`;

    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData.data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="year" 
                tickFormatter={formatXAxis}
                type="number"
                domain={[1, yearsToCalculate]}
                allowDecimals={true}
                tickCount={yearsToCalculate}
              />
              <YAxis tickFormatter={formatCurrency} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line type="monotone" dataKey={`${option}Equipment`} name="Equipment" stroke="#8884d8" />
              <Line type="monotone" dataKey={`${option}Maintenance`} name="Maintenance" stroke="#82ca9d" />
              <Line type="monotone" dataKey={`${option}Total`} name="Annual Total" stroke="#ff7300" strokeWidth={2} />
              <Line 
                type="monotone" 
                dataKey={`${option}RunningTotal`} 
                name="Running Total" 
                stroke="black" 
                strokeWidth={2} 
                strokeDasharray="5 5" 
                hide={!showRunningTotal}
                animationDuration={300}
              />
              <ReferenceLine 
                x={leaseMonths / 12} 
                stroke="gold" 
                strokeWidth={2}
                label={{ 
                  value: 'Lease End', 
                  position: 'top', 
                  fill: 'gold', 
                  fontSize: 12 
                }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Total Costs Over {yearsToCalculate} Years</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <h3 className="text-lg font-semibold">Purchase Option Total</h3>
              <p className="text-2xl font-bold text-blue-600">{formatCurrency(chartData.purchaseTotal)}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Lease-to-Own Option Total</h3>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(chartData.leaseToOwnTotal)}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Standard Lease Option Total</h3>
              <p className="text-2xl font-bold text-purple-600">{formatCurrency(chartData.standardLeaseTotal)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Input Parameters</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="purchasePrice">Purchase Price ($)</Label>
            <Input 
              id="purchasePrice"
              type="number" 
              value={purchasePrice} 
              onChange={(e) => setPurchasePrice(Number(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="monthlyMaintenance">Monthly Maintenance ($)</Label>
            <Input 
              id="monthlyMaintenance"
              type="number" 
              value={monthlyMaintenance} 
              onChange={(e) => setMonthlyMaintenance(Number(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="monthlyLease">Monthly Lease ($)</Label>
            <Input 
              id="monthlyLease"
              type="number" 
              value={monthlyLease} 
              onChange={(e) => setMonthlyLease(Number(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="leaseMonths">Lease Term (months)</Label>
            <Input 
              id="leaseMonths"
              type="number" 
              value={leaseMonths} 
              onChange={(e) => setLeaseMonths(Number(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="yearsToCalculate">Years to Calculate</Label>
            <Input 
              id="yearsToCalculate"
              type="number" 
              value={yearsToCalculate} 
              onChange={(e) => setYearsToCalculate(Number(e.target.value))}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="showRunningTotal"
              checked={showRunningTotal}
              onCheckedChange={setShowRunningTotal}
            />
            <Label htmlFor="showRunningTotal">Show Running Total</Label>
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {renderLineChart('purchase', 'Purchase Option Costs')}
        {renderLineChart('leaseToOwn', 'Lease-to-Own Option Costs')}
        {renderLineChart('standardLease', 'Standard Lease Option Costs')}
      </div>
    </div>
  );
};

export default CostComparisonCharts;