import React from 'react';

const MilkYieldChart = React.memo(({ data }) => {
  // Chart dimensions
  const chartWidth = 500;
  const chartHeight = 300;
  const chartPadding = 40;

  // Scale functions
  const xScale = (index) => {
    const xRange = chartWidth - 2 * chartPadding;
    const step = xRange / (data.length - 1);
    return chartPadding + index * step;
  };

  const yScaleMilkYield = (value) => {
    const yMin = 8000;
    const yMax = 9500;
    const yRange = chartHeight - 2 * chartPadding;
    return chartHeight - chartPadding - ((value - yMin) / (yMax - yMin)) * yRange;
  };

  const yScaleCost = (value) => {
    const yMin = 0.25;
    const yMax = 0.50;
    const yRange = chartHeight - 2 * chartPadding;
    return chartHeight - chartPadding - ((value - yMin) / (yMax - yMin)) * yRange;
  };

  const generateLinePath = (data, xScale, yScale, yKey) => {
    let path = '';
    data.forEach((point, index) => {
      const x = xScale(index);
      const y = yScale(point[yKey]);
      path += index === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
    });
    return path;
  };

  return (
    <svg width={chartWidth} height={chartHeight} className="mx-auto border border-gray-200 rounded">
      {/* Axes */}
      <line
        x1={chartPadding}
        y1={chartPadding}
        x2={chartPadding}
        y2={chartHeight - chartPadding}
        className="stroke-gray-300"
        strokeWidth="1"
      />
      <line
        x1={chartPadding}
        y1={chartHeight - chartPadding}
        x2={chartWidth - chartPadding}
        y2={chartHeight - chartPadding}
        className="stroke-gray-300"
        strokeWidth="1"
      />

      {/* Lines */}
      <path
        d={generateLinePath(data, xScale, yScaleMilkYield, 'milkYield')}
        className="stroke-blue-500 fill-none"
        strokeWidth="2"
      />
      <path
        d={generateLinePath(data, xScale, yScaleMilkYield, 'target')}
        className="stroke-green-500 fill-none"
        strokeWidth="2"
        strokeDasharray="5,5"
      />
      <path
        d={generateLinePath(data, xScale, yScaleCost, 'cost')}
        className="stroke-purple-500 fill-none"
        strokeWidth="2"
      />

      {/* Data Points and Labels */}
      {data.map((point, index) => (
        <g key={index}>
          {/* Milk Yield Points */}
          <circle
            cx={xScale(index)}
            cy={yScaleMilkYield(point.milkYield)}
            r="3"
            className="fill-blue-500"
          />
          {/* Cost per Litre Points */}
          <circle
            cx={xScale(index)}
            cy={yScaleCost(point.cost)}
            r="3"
            className="fill-purple-500"
          />
          {/* Month Labels */}
          <text
            x={xScale(index)}
            y={chartHeight - chartPadding + 15}
            textAnchor="middle"
            className="text-xs fill-gray-600"
          >
            {point.month}
          </text>
        </g>
      ))}

      {/* Legend */}
      <g transform={`translate(${chartPadding}, ${chartPadding - 10})`}>
        <circle r="3" className="fill-blue-500" />
        <text x="10" y="4" className="text-xs fill-gray-600">Milk Yield</text>
        <circle cx="80" r="3" className="fill-purple-500" />
        <text x="90" y="4" className="text-xs fill-gray-600">Cost per Litre</text>
      </g>
    </svg>
  );
});

MilkYieldChart.displayName = 'MilkYieldChart';

export default MilkYieldChart;