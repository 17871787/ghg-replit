import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Button, Input, Slider } from 'antd';
import { MilkYieldChart } from './components/MilkYieldChart';

const GreenhouseGasAnalysisTool = () => {
  const [params, setParams] = useState({
    concentrateFeed: 8.08,
    nitrogenRate: 250,
    milkYield: 0,
    costPerLitre: 0
  });

  const [feedCostPerKg, setFeedCostPerKg] = useState(0.35);
  const [messages, setMessages] = useState([]);
  const [milkYieldData, setMilkYieldData] = useState([]);

  const handleParamChange = useCallback((type, value) => {
    setParams(prev => ({
      ...prev,
      [type]: value
    }));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Greenhouse Gas Analysis Tool</h1>
      
      <div className="space-y-4">
        <Input
          type="number"
          value={feedCostPerKg}
          onChange={(e) => setFeedCostPerKg(Number(e.target.value))}
          placeholder="Feed cost per kg"
        />

        <Slider
          value={params.concentrateFeed}
          onChange={(value) => handleParamChange('concentrateFeed', value)}
          min={0}
          max={20}
        />

        <Slider
          value={params.nitrogenRate}
          onChange={(value) => handleParamChange('nitrogenRate', value)}
          min={0}
          max={500}
        />

        <MilkYieldChart data={milkYieldData} />
      </div>
    </div>
  );
};

export default GreenhouseGasAnalysisTool;
