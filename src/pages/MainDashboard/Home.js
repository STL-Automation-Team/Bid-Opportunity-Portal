import axios from 'axios';
import {
  ArcElement,
  BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement,
  PointElement, Title, Tooltip
} from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Download } from 'lucide-react';
import React, { Component } from 'react';
import { Chart as ChartJSComponent } from 'react-chartjs-2';
import { BASE_URL } from '../../components/constants';

import './home.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement,
  ChartDataLabels
);

const CHART_COLORS = {
  line: 'hsl(260, 70%, 50%)',
  bar1: 'hsl(180, 70%, 50%)',
  bar2: 'hsl(330, 70%, 50%)',
  pointBg: 'hsl(260, 70%, 90%)',
  gridLines: 'rgba(0, 0, 0, 0.08)',
  actual: 'hsl(120, 70%, 50%)',
  agp: 'hsl(220, 70%, 50%)'
};

const generatePieColors = (count) => {
  const colors = [];
  for (let i = 0; i < count; i++) {
    const hue = (i * 360) / count;
    colors.push(`hsl(${hue}, 70%, 50%)`);
  }
  return colors;
};

const graphConfigs = [
  {
    title: "Monthly OB Won Amount",
    inputs: [
      { type: 'select', name: 'year', label: 'Financial Year', options: ['FY24', 'FY25', 'FY26'] },
    ],
    dataFetch: (inputs) => {
      const idMap = { 'FY24': 1, 'FY25': 2, 'FY26': 3 };
      const fyId = idMap[inputs.year];
      return {
        method: 'post',
        url: `${BASE_URL}/api/leads/amount-summary`,
        data: { fyIds: [fyId] }
      };
    }
  },
  {
    title: "Quarterly AGP vs WON",
    inputs: [
      { type: 'select', name: 'year', label: 'Financial Year', options: ['FY24', 'FY25', 'FY26'] },
    ],
    dataFetch: (inputs) => [
      {
        method: 'get',
        url: `${BASE_URL}/api/agp1/summary/${inputs.year}`
      },
      {
        method: 'post',
        url: `${BASE_URL}/api/leads/amount-summary`,
        data: { fyIds: [ { 'FY24': 1, 'FY25': 2, 'FY26': 3 }[inputs.year] ] }
      }
    ]
  },
  {
    title: "Bids Performance (Public & Private)",
    inputs: [
      { type: 'select', name: 'year', label: 'Financial Year', options: ['FY24', 'FY25', 'FY26'] },
    ],
    dataFetch: (inputs) => {
      const idMap = { 'FY24': 1, 'FY25': 2, 'FY26': 3 };
      const fyId = idMap[inputs.year];
      return {
        method: 'post',
        url: `${BASE_URL}/api/leads/deal-status-summary`,
        data: { fyIds: [fyId] }
      };
    }
  },
  {
    title: "YTD - OB Performance",
    inputs: [
      { type: 'select', name: 'year', label: 'Financial Year', options: ['FY24', 'FY25', 'FY26'] },
    ],
    dataFetch: (inputs) => [
      {
        method: 'get',
        url: `${BASE_URL}/api/agp1/ytd-summary/${inputs.year}`
      },
      {
        method: 'post',
        url: `${BASE_URL}/api/leads/segment-ytd-summary`,
        data: { fyIds: [ { 'FY24': 1, 'FY25': 2, 'FY26': 3 }[inputs.year] ] }
      }
    ]
  }
];

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.chartRefs = Array(graphConfigs.length).fill().map(() => React.createRef());
    this.state = {
      graphs: graphConfigs.map(config => ({
        inputs: config.inputs.reduce((acc, input) => {
          acc[input.name] = input.options ? this.getCurrentFY() : '';
          return acc;
        }, {}),
        chartData: [],
        segments: [],
        totalAmount: 0 // Add this to store total amount
      }))
    };
}

  getCurrentFY() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    let fyYear = month >= 4 ? year + 1 : year;
    return `FY${fyYear.toString().slice(2)}`;
  }

  downloadChart = (index, format) => {
    const chartInstance = this.chartRefs[index].current;
    if (!chartInstance) return;

    const sourceCanvas = chartInstance.canvas;
    const destinationCanvas = document.createElement('canvas');
    const context = destinationCanvas.getContext('2d');
    
    destinationCanvas.width = sourceCanvas.width;
    destinationCanvas.height = sourceCanvas.height;

    context.fillStyle = 'white';
    context.fillRect(0, 0, destinationCanvas.width, destinationCanvas.height);
    context.drawImage(sourceCanvas, 0, 0);

    const link = document.createElement('a');
    link.download = `${graphConfigs[index].title}.png`;
    link.href = destinationCanvas.toDataURL('image/png');
    link.click();
  };

  renderDownloadButtons = (index) => {
    return (
      <div className="download-buttonsd1">
        <button 
          className="icon-buttond1"
          onClick={() => this.downloadChart(index, 'png')}
          title="Download Chart"
        >
          <Download size={20} />
        </button>
      </div>
    );
  };

  componentDidMount() {
    this.fetchDataForAllGraphs();
  }

  fetchDataForAllGraphs = () => {
    this.state.graphs.forEach((_, index) => this.fetchData(index));
  };

  fetchData = async (index) => {
    const { inputs } = this.state.graphs[index];
    const { dataFetch } = graphConfigs[index];
    const token = localStorage.getItem('token');
    try {
      const configs = dataFetch(inputs);
      const requests = Array.isArray(configs) 
        ? configs.map(c => axios({ ...c, headers: { Authorization: `Bearer ${token}` } }))
        : [axios({ ...configs, headers: { Authorization: `Bearer ${token}` } })];

      const responses = await Promise.all(requests);
      this.processData(responses.map(r => r.data), index);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  processData = (data, index) => {
    if (index === 0) {
      const monthsOrder = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
      const monthData = monthsOrder.map(month => ({
        month,
        amount: data[0].monthWiseAmount[month] || 0
      }));
      // Calculate total sum
      const totalAmount = monthData.reduce((sum, item) => sum + item.amount, 0);
      
      this.setState(prevState => {
        const newGraphs = [...prevState.graphs];
        newGraphs[index].chartData = monthData;
        newGraphs[index].totalAmount = totalAmount; // Store total in state
        return { graphs: newGraphs };
      });
    } else if (index === 1) {
      const [agpData, wonData] = data;
      const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
      const chartData = quarters.map(quarter => ({
        quarter,
        agp: agpData[quarter] || 0,
        won: wonData.quarterWiseAmount[quarter] || 0
      }));
      this.setState(prevState => {
        const newGraphs = [...prevState.graphs];
        newGraphs[index].chartData = chartData;
        return { graphs: newGraphs };
      });
    } else if (index === 2) {
      const chartData = Object.entries(data[0]).map(([status, amount]) => ({
        status,
        amount
      }));
      this.setState(prevState => {
        const newGraphs = [...prevState.graphs];
        newGraphs[index].chartData = chartData;
        return { graphs: newGraphs };
      });
    } else if (index === 3) {
      const [agpData, actualData] = data;
      const allSegments = [...new Set([...Object.keys(agpData), ...Object.keys(actualData)])];
      const chartData = allSegments.map(segment => ({
        segment,
        agp: agpData[segment] || 0,
        actual: actualData[segment] || 0,
        percentage: agpData[segment] ? ((actualData[segment] || 0) / agpData[segment] * 100).toFixed(1) : 0
      }));
      this.setState(prevState => {
        const newGraphs = [...prevState.graphs];
        newGraphs[index].chartData = chartData;
        return { graphs: newGraphs };
      });
    }
  };

  handleInputChange = (event, index, inputName) => {
    const newValue = event.target.value;
    this.setState(prevState => {
      const newGraphs = [...prevState.graphs];
      newGraphs[index].inputs[inputName] = newValue;
      return { graphs: newGraphs };
    }, () => this.fetchData(index));
  };

  renderInputs = (index) => {
    const { inputs } = graphConfigs[index];
    const currentInputs = this.state.graphs[index].inputs;
    return (
      <div className="controls">
        {inputs.map(input => (
          <div key={input.name} className="input-container">
            <label htmlFor={`${input.name}-${index}`}>{input.label}</label>
            <select
              id={`${input.name}-${index}`}
              value={currentInputs[input.name]}
              onChange={(e) => this.handleInputChange(e, index, input.name)}
            >
              {input.options.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
    );
  };

  renderChart = (index) => {
    const { chartData, totalAmount } = this.state.graphs[index];
    if (!chartData.length) return <div>Loading...</div>;

    const animationSettings = {
      duration: 300,
      easing: 'easeOutCubic',
      animateScale: false
    };

    const chartWrapperStyle = {
      width: '100%',
      maxWidth: '100%', // Ensure chart doesn't exceed parent
      height: 'auto',
      aspectRatio: '16 / 9', // Maintain aspect ratio
      overflow: 'hidden', // Prevent overflow
      boxSizing: 'border-box', // Include padding/borders in width
    };
    if (index === 0) {
      const data = {
        labels: chartData.map(item => item.month),
        datasets: [{
          type: 'line',
          label: 'Won Amount (INR Cr)',
          data: chartData.map(item => item.amount),
          borderColor: CHART_COLORS.line,
          borderWidth: 3,
          tension: 0.4,
          pointBackgroundColor: CHART_COLORS.pointBg,
          pointBorderColor: CHART_COLORS.line,
          pointBorderWidth: 2,
          pointRadius: 5,
        }]
      };
      const options = {
        responsive: true,
        maintainAspectRatio: false,
        animation: animationSettings,
        plugins: {
          legend: { position: 'top' },
          title: { 
            display: true, 
            text: 'Monthly Won Amount'
          },
          subtitle: { // Add subtitle to show total
            display: true,
            text: `Total Amount: ${totalAmount.toFixed(2)} INR Cr`,
            font: {
              size: 14
            },
            padding: {
              bottom: 20
            }
          }
        },
        scales: {
          y: { grid: { color: CHART_COLORS.gridLines } },
          x: { grid: { color: CHART_COLORS.gridLines } }
        }
      };
      return (
        <div style={chartWrapperStyle}>
          <ChartJSComponent ref={this.chartRefs[index]} data={data} options={options} />
        </div>
      );
    } else if (index === 1) {
      const data = {
        labels: chartData.map(item => item.quarter),
        datasets: [
          {
            label: 'AGP (INR Cr)',
            data: chartData.map(item => item.agp),
            backgroundColor: CHART_COLORS.bar1,
            barThickness: 40, // Increased from 30
            borderRadius: 4,
            hoverBackgroundColor: 'hsl(180, 70%, 40%)',
          },
          {
            label: 'WON (INR Cr)',
            data: chartData.map(item => item.won),
            backgroundColor: CHART_COLORS.bar2,
            barThickness: 40, // Increased from 30
            borderRadius: 4,
            hoverBackgroundColor: 'hsl(330, 70%, 40%)',
          }
        ]
      };
      const options = {
        responsive: true,
        maintainAspectRatio: false,
        animation: animationSettings,
        plugins: {
          legend: { position: 'top' },
          title: { display: true, text: 'Quarterly AGP vs WON' }
        },
        scales: {
          y: { grid: { color: CHART_COLORS.gridLines } },
          x: { grid: { color: CHART_COLORS.gridLines } }
        }
      };
      return (
        <div style={chartWrapperStyle}>
          <ChartJSComponent ref={this.chartRefs[index]} type="bar" data={data} options={options} />
        </div>
      );
    } else if (index === 2) {
      const pieColors = generatePieColors(chartData.length);
      const data = {
        labels: chartData.map(item => item.status),
        datasets: [{
          data: chartData.map(item => item.amount),
          backgroundColor: pieColors,
          hoverOffset: 8,
          borderWidth: 1,
          borderColor: '#ffffff'
        }]
      };
      const options = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          ...animationSettings,
          animateRotate: true,
          animateScale: true
        },
        plugins: {
          legend: {
            position: 'right',
            labels: { boxWidth: 20, padding: 15, font: { size: 14 } } // Increased font size
          },
          title: { display: true, text: 'Bids Performance (Public & Private)' }
        }
      };
      return (
        <div style={chartWrapperStyle}>
          <ChartJSComponent ref={this.chartRefs[index]} type="pie" data={data} options={options} />
        </div>
      );
    } else if (index === 3) {
      const data = {
        labels: chartData.map(item => item.segment),
        datasets: [
          {
            label: 'AGP (INR Cr)',
            data: chartData.map(item => item.agp),
            backgroundColor: CHART_COLORS.agp,
            barThickness: 40, // Increased from 30
            borderRadius: 4,
            datalabels: {
              display: false
            }
          },
          {
            label: 'Actual (INR Cr)',
            data: chartData.map(item => item.actual),
            backgroundColor: CHART_COLORS.actual,
            barThickness: 40, // Increased from 30
            borderRadius: 4,
            datalabels: {
              anchor: 'end',
              align: 'top',
              formatter: (value, context) => {
                const percentage = chartData[context.dataIndex].percentage;
                return `${percentage}%`;
              },
              color: '#000',
              font: {
                weight: 'bold',
                size: 14 // Increased from 12
              }
            }
          }
        ]
      };
      const options = {
        responsive: true,
        maintainAspectRatio: false,
        animation: animationSettings,
        plugins: {
          legend: { position: 'top' },
          title: { display: true, text: 'YTD - OB Performance by Segment' },
          tooltip: {
            callbacks: {
              label: (context) => {
                const datasetLabel = context.dataset.label || '';
                const value = context.raw || 0;
                const segmentIndex = context.dataIndex;
                const percentage = chartData[segmentIndex].percentage;
                return `${datasetLabel}: ${value} Cr (${percentage}%)`;
              }
            }
          },
          datalabels: {
            display: true
          }
        },
        scales: {
          x: {
            stacked: true,
            grid: { color: CHART_COLORS.gridLines },
            ticks: { maxRotation: 45, minRotation: 45, font: { size: 12 } } // Added font size
          },
          y: {
            stacked: true,
            grid: { color: CHART_COLORS.gridLines },
            title: { display: true, text: 'Amount (INR Cr)' }
          }
        }
      };
      return (
        <div style={chartWrapperStyle}>
          <ChartJSComponent ref={this.chartRefs[index]} type="bar" data={data} options={options} />
        </div>
      );
    }
  };

  render() {
    return (
      <div className="container-main" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        {graphConfigs.map((config, index) => (
          <div key={index} className="box" style={{ width: '100%' , height: 'fit-content'}}>
            <h1>{config.title}</h1>
            {this.renderInputs(index)}
            <div className="chart-container">
              <div className="chart-wrapper">
                {this.renderChart(index)}
              </div>
              {this.renderDownloadButtons(index)}
            </div>
          </div>
        ))}
      </div>
    );
  }
}