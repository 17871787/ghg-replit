import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Input from './ui/input';
import Button from './ui/button';
import Slider from './ui/slider';
import MilkYieldChart from './MilkYieldChart';

const GreenhouseGasAnalysisTool = () => {
 
  const CONFIG = useMemo(() => ({
    BASE_COSTS: 0.25,
    EMISSION_THRESHOLD: 1.5,
    COST_THRESHOLD: 0.35,
    TARGET_YIELD: 9000,
  }), []);

  
  const [feedCostPerKg, setFeedCostPerKg] = useState(0.38);
  const [params, setParams] = useState({
    concentrateFeed: 8.08,
    nitrogenRate: 180,
    emissions: 1.39,
    milkYield: 8750,
    costPerLitre: 0.32,
    proteinEfficiency: 14.3,
    nitrogenEfficiency: 17.6,
  });
  const [milkYieldData, setMilkYieldData] = useState([
    { month: 'Jan', milkYield: 8750, target: CONFIG.TARGET_YIELD, cost: 0.32 },
    { month: 'Feb', milkYield: 8900, target: CONFIG.TARGET_YIELD, cost: 0.32 },
    { month: 'Mar', milkYield: 8800, target: CONFIG.TARGET_YIELD, cost: 0.32 },
    { month: 'Apr', milkYield: 8650, target: CONFIG.TARGET_YIELD, cost: 0.32 },
  ]);
  const [messages, setMessages] = useState([{
    type: 'info',
    text: 'Welcome! Adjust parameters to see real-time impact on emissions, yield, and costs.'
  }]);
  const [suggestions, setSuggestions] = useState([]);
  const [query, setQuery] = useState('');

  // Derived Values
  const formattedMilkYield = useMemo(() => 
    params.milkYield.toLocaleString(), [params.milkYield]);

  // Event Handlers
  const handleConcentrateFeedChange = useCallback((value) => {
    updateParams(value[0], params.nitrogenRate);
  }, [params.nitrogenRate, updateParams]);

  const handleNitrogenRateChange = useCallback((value) => {
    updateParams(params.concentrateFeed, value[0]);
  }, [params.concentrateFeed, updateParams]);

  const handleFeedCostChange = useCallback((e) => {
    const newCost = parseFloat(e.target.value);
    if (!isNaN(newCost) && newCost > 0) {
      setFeedCostPerKg(newCost);
      updateParams(params.concentrateFeed, params.nitrogenRate);
    }
  }, [params.concentrateFeed, params.nitrogenRate, updateParams]);

  const handleQuerySubmit = useCallback(() => {
    if (!query.trim()) return;

    let response = '';
    const lowerCaseQuery = query.toLowerCase();

    if (lowerCaseQuery.includes('emission')) {
      response = `Current emissions are ${params.emissions} kg CO₂e/day.`;
    } else if (lowerCaseQuery.includes('yield')) {
      response = `Current yield is ${formattedMilkYield} L/lactation.`;
    } else if (lowerCaseQuery.includes('cost')) {
      response = `Current cost per litre is £${params.costPerLitre}.`;
    } else {
      response = "I can only provide information about emissions, yield, or cost.";
    }

    setMessages(prev => [
      ...prev,
      { type: 'query', text: query },
      { type: 'response', text: response }
    ]);
    setQuery('');
  }, [query, params.emissions, formattedMilkYield, params.costPerLitre]);

  // Update Parameters and Calculations
  const updateParams = useCallback((newFeed, newNitrogen) => {
    const oldParams = { ...params };
    const newEmissions = calculateEmissions(newFeed);
    const newMilkYield = calculateMilkYield(newFeed);
    const newCostPerLitre = calculateCostPerLitre(newFeed, newMilkYield, feedCostPerKg);
    const newProteinEfficiency = calculateProteinEfficiency(newFeed);
    const newNitrogenEfficiency = calculateNitrogenEfficiency(newNitrogen);

    const newParams = {
      concentrateFeed: newFeed,
      nitrogenRate: newNitrogen,
      emissions: newEmissions,
      milkYield: newMilkYield,
      costPerLitre: newCostPerLitre,
      proteinEfficiency: newProteinEfficiency,
      nitrogenEfficiency: newNitrogenEfficiency,
    };

    setParams(newParams);
    addChangeMessage(oldParams, newParams);
    updateMilkYieldData(newParams);
  }, [feedCostPerKg, params]);

  // Add Change Message to Messages
  const addChangeMessage = useCallback((oldParams, newParams) => {
    const formatChange = (val1, val2) =>
      (val2 > val1 ? '+' : '') + (val2 - val1).toFixed(2);

    setMessages(prev => [...prev, {
      type: 'alert',
      text: `Parameter update summary:
- Emissions: ${oldParams.emissions} → ${newParams.emissions} (${formatChange(oldParams.emissions, newParams.emissions)})
- Yield: ${oldParams.milkYield} → ${newParams.milkYield} (${formatChange(oldParams.milkYield, newParams.milkYield)} L/lactation)
- Cost per litre: £${oldParams.costPerLitre} → £${newParams.costPerLitre} (${formatChange(oldParams.costPerLitre, newParams.costPerLitre)})
- Protein efficiency: ${oldParams.proteinEfficiency}% → ${newParams.proteinEfficiency}%
- N efficiency: ${oldParams.nitrogenEfficiency}% → ${newParams.nitrogenEfficiency}%`
    }]);
  }, []);

  // Update Milk Yield Data for Chart
  const updateMilkYieldData = useCallback((newParams) => {
    setMilkYieldData(prev => [
      ...prev.slice(-3), // Keep last 3 data points
      {
        month: 'May',
        milkYield: newParams.milkYield,
        target: CONFIG.TARGET_YIELD,
        cost: newParams.costPerLitre
      }
    ]);
  }, [CONFIG.TARGET_YIELD]);

  // Generate Optimization Suggestions
  useEffect(() => {
    const newSuggestions = [];

    if (params.emissions > CONFIG.EMISSION_THRESHOLD) {
      const reducedFeed = +(params.concentrateFeed * 0.9).toFixed(2);
      const potentialEmissions = calculateEmissions(reducedFeed);
      const emissionsReduction = +(
        ((params.emissions - potentialEmissions) / params.emissions) * 100
      ).toFixed(1);

      newSuggestions.push({
        type: 'emission',
        suggestion: `Consider reducing concentrate feed to ${reducedFeed} kg/day`,
        impact: `Could reduce emissions by ${emissionsReduction}%`,
        priority: 'high'
      });
    }

    if (params.nitrogenEfficiency < 15) {
      newSuggestions.push({
        type: 'nitrogen',
        suggestion: 'Optimize nitrogen application timing',
        impact: 'Could improve N efficiency by up to 15%',
        priority: 'medium'
      });
    }

    if (params.proteinEfficiency < 12) {
      newSuggestions.push({
        type: 'protein',
        suggestion: 'Review protein content in concentrate feed',
        impact: 'Target protein efficiency above 12%',
        priority: 'medium'
      });
    }

    if (params.costPerLitre > CONFIG.COST_THRESHOLD) {
      newSuggestions.push({
        type: 'cost',
        suggestion: 'Consider cost reduction strategies',
        impact: `Current cost £${params.costPerLitre}/L exceeds target of £${CONFIG.COST_THRESHOLD}/L`,
        priority: 'high'
      });
    }

    setSuggestions(newSuggestions);
  }, [
    params.emissions,
    params.concentrateFeed,
    params.nitrogenEfficiency,
    params.proteinEfficiency,
    params.costPerLitre,
    CONFIG.EMISSION_THRESHOLD,
    CONFIG.COST_THRESHOLD
  ]);

  // Render Suggestions (Memoized)
  const renderedSuggestions = useMemo(() => {
    if (suggestions.length > 0) {
      return (
        <ul>
          {suggestions.map((suggestion, index) => (
            <li key={index}>
              <strong>{suggestion.suggestion}</strong>: {suggestion.impact}
            </li>
          ))}
        </ul>
      );
    } else {
      return <p>No optimization suggestions at this time.</p>;
    }
  }, [suggestions]);

  // Render Messages (Memoized)
  const renderedMessages = useMemo(() => {
    return messages.map((msg, idx) => (
      <div key={idx} className="mb-4">
        {msg.type === 'alert' && <strong className="text-red-500">Alert:</strong>}
        {msg.type === 'query' && <strong className="text-blue-500">Query:</strong>}
        {msg.type === 'response' && <strong className="text-green-500">Response:</strong>}
        {msg.type === 'info' && <strong className="text-gray-500">Info:</strong>}
        <div>{msg.text}</div>
      </div>
    ));
  }, [messages]);

  return (
    <div className="max-w-4xl mx-auto p-5">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-4">Greenhouse Gas Analysis Tool</h1>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div>
          <strong>Emissions:</strong> {params.emissions} kg CO₂e/day
        </div>
        <div>
          <strong>N Efficiency:</strong> {params.nitrogenEfficiency}%
        </div>
        <div>
          <strong>Protein Efficiency:</strong> {params.proteinEfficiency}%
        </div>
        <div>
          <strong>Milk Yield:</strong> {formattedMilkYield} L/lactation
        </div>
        <div>
          <strong>Cost per Litre:</strong> £{params.costPerLitre}
        </div>
      </div>

      {/* Farm Parameters */}
      <h2 className="text-2xl font-semibold mb-4">Farm Parameters</h2>
      <div className="space-y-4 mb-6">
        {/* Concentrate Feed */}
        <div>
          <label className="block mb-2">
            Concentrate Feed (kg/day): {params.concentrateFeed.toFixed(2)}
          </label>
          <Slider
            min={0}
            max={20}
            step={0.1}
            value={params.concentrateFeed}
            onValueChange={handleConcentrateFeedChange}
          />
        </div>

        {/* Feed Cost */}
        <div>
          <label className="block mb-2">
            Feed Cost (£/kg):
          </label>
          <Input
            type="number"
            step="0.01"
            value={feedCostPerKg}
            onChange={handleFeedCostChange}
          />
        </div>

        {/* Nitrogen Application */}
        <div>
          <label className="block mb-2">
            Nitrogen Application (kg N/Ha/Year): {params.nitrogenRate}
          </label>
          <Slider
            min={0}
            max={300}
            step={1}
            value={params.nitrogenRate}
            onValueChange={handleNitrogenRateChange}
          />
        </div>
      </div>

      {/* Yield & Cost Trend Chart */}
      <h2 className="text-2xl font-semibold mb-4">Yield & Cost Trend</h2>
      <MilkYieldChart data={milkYieldData} />

      {/* Optimization Suggestions */}
      <h2 className="text-2xl font-semibold mt-6 mb-4">Optimization Suggestions</h2>
      {renderedSuggestions}

      {/* AI Insights */}
      <h2 className="text-2xl font-semibold mt-6 mb-4">AI Insights</h2>
      <div className="border border-gray-300 p-4 rounded h-72 overflow-y-auto mb-4">
        {renderedMessages}
      </div>
      <div className="flex">
        <Input
          type="text"
          placeholder="Ask about your farm's parameters..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleQuerySubmit();
            }
          }}
          className="flex-1 mr-2"
        />
        <Button onClick={handleQuerySubmit}>Ask</Button>
      </div>
    </div>
  );
};

// Utility Functions (Outside Component)
const calculateEmissions = (feed) => {
  const baseEmissions = 1.39;
  const feedImpact = 0.05;
  return +(baseEmissions + feedImpact * (feed - 8.08)).toFixed(2);
};

const calculateMilkYield = (feed) => {
  const baseMilkYield = 8750;
  const yieldImpact = 100;
  return Math.round(baseMilkYield + yieldImpact * (feed - 8.08));
};

const calculateCostPerLitre = (feed, milkYield, feedCostPerKg) => {
  const dailyFeedCost = feed * feedCostPerKg;
  const annualFeedCost = dailyFeedCost * 365;
  return +(0.25 + annualFeedCost / milkYield).toFixed(2);
};

const calculateProteinEfficiency = (feed) => {
  const baseEfficiency = 14.3;
  const efficiencyImpact = -0.1;
  return +(baseEfficiency + efficiencyImpact * (feed - 8.08)).toFixed(1);
};

const calculateNitrogenEfficiency = (nitrogenRate) => {
  const baseEfficiency = 17.6;
  const efficiencyImpact = -0.02;
  return +(baseEfficiency + efficiencyImpact * (nitrogenRate - 180)).toFixed(1);
};

export default GreenhouseGasAnalysisTool;
