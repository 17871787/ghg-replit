import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Button, Input, Slider } from 'antd';
import { MilkYieldChart } from './components/MilkYieldChart';
import 'antd/dist/antd.css';

const calculateEmissions = useCallback((feed) => {
  const baseEmissions = 1.39;
  const feedImpact = 0.05;
  return +(baseEmissions + feedImpact * (feed - 8.08)).toFixed(2);
}, []);

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

  const updateParams = useCallback((newFeed, newNitrogen) => {
    const oldParams = { ...params };
    const newParams = {
      concentrateFeed: newFeed,
      nitrogenRate: newNitrogen,
      milkYield: calculateMilkYield(newFeed, newNitrogen),
      costPerLitre: calculateCostPerLitre(newFeed, newNitrogen)
    };

    setParams(newParams);
    setMessages(prev => [...prev, {
      type: 'info',
      text: 'Parameters updated successfully'
    }]);
    setMilkYieldData(prev => [...prev.slice(-3), {
      month: 'May',
      milkYield: newParams.milkYield,
      target: CONFIG.TARGET_YIELD,
      cost: newParams.costPerLitre
    }]);
  }, [feedCostPerKg, params, calculateEmissions, calculateMilkYield, calculateCostPerLitre, calculateProteinEfficiency, calculateNitrogenEfficiency]);

  const handleFeedCostChange = useCallback((e) => {
    const newCost = parseFloat(e.target.value);
    if (!isNaN(newCost) && newCost > 0) {
      setFeedCostPerKg(newCost);
      updateParams(params.concentrateFeed, params.nitrogenRate);
    }
  }, [params.concentrateFeed, params.nitrogenRate]);

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Greenhouse Gas Analysis Tool</h1>
      
      <div className="space-y-4">
        <Input
          type="number"
          value={feedCostPerKg}
          onChange={handleFeedCostChange}
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
