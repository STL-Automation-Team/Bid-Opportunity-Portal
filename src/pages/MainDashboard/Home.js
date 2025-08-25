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
  bar1: '#22c55e', // Green for bar charts
  bar2: '#3b82f6', // Blue for bar charts
  pointBg: 'hsl(260, 70%, 90%)',
  gridLines: 'rgba(0, 0, 0, 0.08)',
  actual: '#22c55e', // Green
  agp: '#3b82f6' // Blue
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
    title: "Sales Lead Performance",
    inputs: [
      { type: 'select', name: 'year', label: 'Financial Year', options: ['FY24', 'FY25', 'FY26'] },
    ],
    dataFetch: (inputs) => {
      const idMap = { 'FY24': 1, 'FY25': 2, 'FY26': 3 };
      const fyId = idMap[inputs.year];
      return {
        method: 'post',
        url: `${BASE_URL}/api/leads/sales-owner-summary`,
        data: { fyIds: [fyId] }
      };
    }
  },
  {
   title: "Deal Status",
   inputs: [
    { type: 'select', name: 'year', label: 'Financial Year', options: ['FY24', 'FY25', 'FY26'] },
   ],
    dataFetch: (inputs) => {
    const idMap = { 'FY24': 1, 'FY25': 2, 'FY26': 3 };
    const fyId = idMap[inputs.year];
    return {
      method: 'post',
      url: `${BASE_URL}/api/leads/sales-owner-deal-status`,
      data: {
        fyIds: [fyId],
        salesOwner: inputs.salesOwner === 'All' ? null : inputs.salesOwner
      }
    };
  }
 },
  {
   title: "Bid Submitted",
   inputs: [
    { type: 'select', name: 'year', label: 'Financial Year', options: ['FY24', 'FY25', 'FY26'] },
   ],
   dataFetch: (inputs) => {
    const idMap = { 'FY24': 1, 'FY25': 2, 'FY26': 3 };
    const fyId = idMap[inputs.year];
    return [
      {
        method: 'post',
        url: `${BASE_URL}/api/leads/participation-summary`,
        data: { fyIds: [fyId] }
      },
      {
        method: 'post',
        url: `${BASE_URL}/api/leads/amount-summary`,
        data: { fyIds: [fyId] }
      }
    ];
  }
  },
  {
    title: "Segment wise Funnel",
    inputs: [
      { type: 'select', name: 'year', label: 'Financial Year', options: ['FY24', 'FY25', 'FY26'] },
    ],
    dataFetch: (inputs) => {
      const idMap = { 'FY24': 1, 'FY25': 2, 'FY26': 3 };
      const fyId = idMap[inputs.year];
      return {
        method: 'post',
        url: `${BASE_URL}/api/leads/segment-summary`,
        data: { fyIds: [fyId] }
      };
    }
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
        totalAmount: 0,
        totalAGP: 0, // ADDED
        totalWON: 0, // ADDED
        totalParticipation: 0 // ADDED
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
  
  handleInputChange = (event, index, inputName) => {
    const newValue = event.target.value;
    this.setState(prevState => {
      const newGraphs = [...prevState.graphs];
      newGraphs[index].inputs[inputName] = newValue;
      return { graphs: newGraphs };
    }, () => this.fetchData(index));
  };

  processData = (data, index) => {
    try {
      if (index === 0) { // Monthly OB Won Amount
        const monthsOrder = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
        const monthData = monthsOrder.map(month => ({
          month,
          amount: data[0].monthWiseAmount[month] || 0
        }));
        const totalAmount = monthData.reduce((sum, item) => sum + item.amount, 0);
       
        this.setState(prevState => {
          const newGraphs = [...prevState.graphs];
          newGraphs[index].chartData = monthData;
          newGraphs[index].totalAmount = totalAmount;
          return { graphs: newGraphs };
        });
      }
      else if (index === 1) { // Quarterly AGP vs WON
        const [agpData, wonData] = data;
        const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
        const chartData = quarters.map(quarter => ({
          quarter,
          agp: agpData[quarter] || 0,
          won: wonData.quarterWiseAmount[quarter] || 0
        }));
        // ADDED TOTAL CALCULATIONS
        const totalAGP = chartData.reduce((sum, item) => sum + item.agp, 0);
        const totalWON = chartData.reduce((sum, item) => sum + item.won, 0);
        
        this.setState(prevState => {
          const newGraphs = [...prevState.graphs];
          newGraphs[index].chartData = chartData;
          newGraphs[index].totalAGP = totalAGP; // ADDED
          newGraphs[index].totalWON = totalWON; // ADDED
          return { graphs: newGraphs };
        });
      }
      else if (index === 2) { // Bids Performance
        const chartData = Object.entries(data[0]).map(([status, amount]) => ({
          status,
          amount
        }));
        // ADDED TOTAL CALCULATION
        const totalAmount = chartData.reduce((sum, item) => sum + item.amount, 0);
        
        this.setState(prevState => {
          const newGraphs = [...prevState.graphs];
          newGraphs[index].chartData = chartData;
          newGraphs[index].totalAmount = totalAmount; // ADDED
          return { graphs: newGraphs };
        });
      }
      else if (index === 3) { // Sales Lead Performance
        console.log('Sales Owner data:', data[0]);
        const chartData = Object.entries(data[0]).map(([owner, count]) => ({
          owner,
          count
        }));
        // ADDED TOTAL CALCULATION
        const totalAmount = chartData.reduce((sum, item) => sum + item.count, 0);
        
        this.setState(prevState => {
          const newGraphs = [...prevState.graphs];
          newGraphs[index].chartData = chartData;
          newGraphs[index].totalAmount = totalAmount; // ADDED
          return { graphs: newGraphs };
        });
      }
      else if (index === 4) { // Deal Status
        console.log('Deal Status data:', data[0]);
        const chartData = Object.entries(data[0]).map(([status, count]) => ({
          status,
          count
        }));
        // ADDED TOTAL CALCULATION
        const totalAmount = chartData.reduce((sum, item) => sum + item.count, 0);
        
        this.setState(prevState => {
          const newGraphs = [...prevState.graphs];
          newGraphs[index].chartData = chartData;
          newGraphs[index].totalAmount = totalAmount; // ADDED
          return { graphs: newGraphs };
        });
      }
      else if (index === 5) { // Participation & OB Trend
        const [participationData, obData] = data;
        const monthsOrder = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
        const chartData = monthsOrder.map(month => ({
          month,
          participation: participationData.monthWiseCount[month] || 0,
          obAmount: obData.monthWiseAmount[month] || 0
        }));
        // ADDED TOTAL CALCULATIONS
        const totalParticipation = chartData.reduce((sum, item) => sum + item.participation, 0);
        const totalAmount = chartData.reduce((sum, item) => sum + item.obAmount, 0);
       
        this.setState(prevState => {
          const newGraphs = [...prevState.graphs];
          newGraphs[index].chartData = chartData;
          newGraphs[index].totalParticipation = totalParticipation; // ADDED
          newGraphs[index].totalAmount = totalAmount; // ADDED
          return { graphs: newGraphs };
        });
      }
      else if (index === 6) { // Segment wise Total Amount
        const chartData = Object.entries(data[0])
          .filter(([segment, amount]) => segment.toLowerCase() !== 'telecos airtel')
          .map(([segment, amount]) => ({
            segment,
            amount
          }));
        // ADDED TOTAL CALCULATION
        const totalAmount = chartData.reduce((sum, item) => sum + item.amount, 0);
        
        this.setState(prevState => {
          const newGraphs = [...prevState.graphs];
          newGraphs[index].chartData = chartData;
          newGraphs[index].totalAmount = totalAmount; // ADDED
          return { graphs: newGraphs };
        });
      }
    } catch (error) {
      console.error(`Error processing data for chart ${index}:`, error);
      this.setState(prevState => {
        const newGraphs = [...prevState.graphs];
        newGraphs[index].error = 'Failed to load chart data';
        return { graphs: newGraphs };
      });
    }
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

  // ADDED THIS HELPER FUNCTION
  getSubtitleText = (index) => {
    const graphData = this.state.graphs[index];
    switch(index) {
      case 0: return `Total Amount: ${graphData.totalAmount.toFixed(2)} INR Cr`;
      case 1: return `Total AGP: ${graphData.totalAGP.toFixed(2)} INR Cr | Total WON: ${graphData.totalWON.toFixed(2)} INR Cr`;
      case 2: return `Total Amount: ${graphData.totalAmount.toFixed(2)} INR Cr`;
      case 3: return `Total Leads: ${graphData.totalAmount}`;
      case 4: return `Total Deals: ${graphData.totalAmount}`;
      case 5: return `Total Participation: ${graphData.totalParticipation} | Total OB Amount: ${graphData.totalAmount.toFixed(2)} INR Cr`;
      case 6: return `Total Amount: ${graphData.totalAmount.toFixed(2)} INR Cr`;
      default: return '';
    }
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
      maxWidth: '100%',
      height: 'auto',
      aspectRatio: '16 / 9',
      overflow: 'hidden',
      boxSizing: 'border-box',
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
          legend: { 
            position: 'top',
            labels: {
              font: {
                size: 14,
                weight: 'bold'
              },
              color: '#1f2937'
            }
          },
          title: {
            display: false
          },
          subtitle: {
            display: true,
            text: this.getSubtitleText(index), // ADDED
            font: { size: 16, weight: 'bold' },
            color: '#1f2937',
            padding: { bottom: 20 }
          },
          datalabels: {
            display: true,
            anchor: 'end',
            align: 'top',
            color: '#1f2937',
            font: {
              weight: 'bold',
              size: 12
            },
            formatter: (value) => value.toFixed(1)
          }
        },
        scales: {
          y: { 
            grid: { color: CHART_COLORS.gridLines },
            ticks: {
              font: {
                size: 12,
                weight: 'bold'
              },
              color: '#1f2937'
            }
          },
          x: { 
            grid: { color: CHART_COLORS.gridLines },
            ticks: {
              font: {
                size: 12,
                weight: 'bold'
              },
              color: '#1f2937'
            }
          }
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
            barThickness: 40,
            borderRadius: 4,
            hoverBackgroundColor: '#16a34a',
          },
          {
            label: 'WON (INR Cr)',
            data: chartData.map(item => item.won),
            backgroundColor: CHART_COLORS.bar2,
            barThickness: 40,
            borderRadius: 4,
            hoverBackgroundColor: '#2563eb',
          }
        ]
      };
      const options = {
        responsive: true,
        maintainAspectRatio: false,
        animation: animationSettings,
        plugins: {
          legend: { 
            position: 'top',
            labels: {
              font: {
                size: 14,
                weight: 'bold'
              },
              color: '#1f2937'
            }
          },
          title: { 
            display: false
          },
          subtitle: { // ADDED
            display: true,
            text: this.getSubtitleText(index),
            font: { size: 16, weight: 'bold' },
            color: '#1f2937',
            padding: { bottom: 20 }
          },
          datalabels: {
            display: true,
            anchor: 'end',
            align: 'top',
            color: '#1f2937',
            font: {
              weight: 'bold',
              size: 12
            },
            formatter: (value) => value.toFixed(1)
          }
        },
        scales: {
          y: { 
            grid: { color: CHART_COLORS.gridLines },
            ticks: {
              font: {
                size: 12,
                weight: 'bold'
              },
              color: '#1f2937'
            }
          },
          x: { 
            grid: { color: CHART_COLORS.gridLines },
            ticks: {
              font: {
                size: 12,
                weight: 'bold'
              },
              color: '#1f2937'
            }
          }
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
          borderWidth: 2,
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
            labels: { 
              boxWidth: 20, 
              padding: 15, 
              font: { 
                size: 14,
                weight: 'bold'
              },
              color: '#1f2937'
            }
          },
          title: { 
            display: false
          },
          subtitle: { // ADDED
            display: true,
            text: this.getSubtitleText(index),
            font: { size: 16, weight: 'bold' },
            color: '#1f2937',
            padding: { bottom: 20 }
          },
          datalabels: {
            display: true,
            color: '#ffffff',
            font: {
              weight: 'bold',
              size: 14
            },
            formatter: (value) => value
          }
        }
      };
      return (
        <div style={chartWrapperStyle}>
          <ChartJSComponent ref={this.chartRefs[index]} type="pie" data={data} options={options} />
        </div>
      );
    } else if (index === 3) {
      const pieColors = generatePieColors(chartData.length);
      const data = {
        labels: chartData.map(item => item.owner),
        datasets: [{
          data: chartData.map(item => item.count),
          backgroundColor: pieColors,
          hoverOffset: 8,
          borderWidth: 2,
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
            labels: { 
              boxWidth: 20, 
              padding: 15, 
              font: { 
                size: 14,
                weight: 'bold'
              },
              color: '#1f2937'
            }
          },
          title: { 
            display: false
          },
          subtitle: { // ADDED
            display: true,
            text: this.getSubtitleText(index),
            font: { size: 16, weight: 'bold' },
            color: '#1f2937',
            padding: { bottom: 20 }
          },
          datalabels: {
            display: true,
            color: '#ffffff',
            font: {
              weight: 'bold',
              size: 14
            },
            formatter: (value) => value
          }
        }
      };
      return (
        <div style={chartWrapperStyle}>
          <ChartJSComponent ref={this.chartRefs[index]} type="pie" data={data} options={options} />
        </div>
      );
    } else if (index === 4) { // Sales Owner Deal Status
      const pieColors = generatePieColors(chartData.length);
      const data = {
        labels: chartData.map(item => item.status),
        datasets: [{
          data: chartData.map(item => item.count),
          backgroundColor: pieColors,
          hoverOffset: 8,
          borderWidth: 2,
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
            labels: { 
              boxWidth: 20, 
              padding: 15, 
              font: { 
                size: 14,
                weight: 'bold'
              },
              color: '#1f2937'
            }
          },
          title: { 
            display: false
          },
          subtitle: { // ADDED
            display: true,
            text: this.getSubtitleText(index),
            font: { size: 16, weight: 'bold' },
            color: '#1f2937',
            padding: { bottom: 20 }
          },
          datalabels: {
            display: true,
            color: '#ffffff',
            font: {
              weight: 'bold',
              size: 14
            },
            formatter: (value) => value
          }
        }
      };
      return (
        <div style={chartWrapperStyle}>
          <ChartJSComponent ref={this.chartRefs[index]} type="pie" data={data} options={options} />
        </div>
      );
    } else if (index === 5) {
      const data = {
        labels: chartData.map(item => item.month),
        datasets: [
          {
            type: 'bar',
            yAxisID: 'y',
            label: 'Participation Count',
            data: chartData.map(item => item.participation),
            backgroundColor: CHART_COLORS.bar1,
            barThickness: 30,
            borderRadius: 4,
          },
          {
            type: 'line',
            yAxisID: 'y1',
            label: 'OB Amount (INR Cr)',
            data: chartData.map(item => item.obAmount),
            borderColor: CHART_COLORS.bar2,
            backgroundColor: CHART_COLORS.bar2,
            borderWidth: 3,
            tension: 0.4,
            pointBackgroundColor: '#dbeafe',
            pointBorderColor: CHART_COLORS.bar2,
            pointBorderWidth: 2,
            pointRadius: 5,
          }
        ]
      };
     
      const options = {
        responsive: true,
        maintainAspectRatio: false,
        animation: animationSettings,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: { 
            position: 'top',
            labels: {
              font: {
                size: 14,
                weight: 'bold'
              },
              color: '#1f2937'
            }
          },
          title: { 
            display: false
          },
          subtitle: { // ADDED
            display: true,
            text: this.getSubtitleText(index),
            font: { size: 16, weight: 'bold' },
            color: '#1f2937',
            padding: { bottom: 20 }
          },
          datalabels: {
            display: true,
            color: '#1f2937',
            font: {
              weight: 'bold',
              size: 11
            },
            formatter: (value, context) => {
              if (context.datasetIndex === 0) {
                return value;
              } else {
                return value.toFixed(1);
              }
            }
          }
        },
        scales: {
          x: { 
            grid: { color: CHART_COLORS.gridLines },
            ticks: {
              font: {
                size: 12,
                weight: 'bold'
              },
              color: '#1f2937'
            }
          },
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            title: { 
              display: true, 
              text: 'Participation Count',
              font: {
                size: 14,
                weight: 'bold'
              },
              color: '#1f2937'
            },
            grid: { color: CHART_COLORS.gridLines },
            ticks: {
              font: {
                size: 12,
                weight: 'bold'
              },
              color: '#1f2937'
            }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            title: { 
              display: true, 
              text: 'OB Amount (INR Cr)',
              font: {
                size: 14,
                weight: 'bold'
              },
              color: '#1f2937'
            },
            grid: { drawOnChartArea: false },
            ticks: {
              font: {
                size: 12,
                weight: 'bold'
              },
              color: '#1f2937'
            }
          },
        }
      };
     
      return (
        <div style={chartWrapperStyle}>
          <ChartJSComponent ref={this.chartRefs[index]} data={data} options={options} />
        </div>
      );
    } else if (index === 6) {
      const pieColors = generatePieColors(chartData.length);
      const data = {
        labels: chartData.map(item => item.segment),
        datasets: [{
          data: chartData.map(item => item.amount),
          backgroundColor: pieColors,
          hoverOffset: 8,
          borderWidth: 2,
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
            labels: { 
              boxWidth: 20, 
              padding: 15, 
              font: { 
                size: 14,
                weight: 'bold'
              },
              color: '#1f2937'
            }
          },
          title: { 
            display: false
          },
          subtitle: { // ADDED
            display: true,
            text: this.getSubtitleText(index),
            font: { size: 16, weight: 'bold' },
            color: '#1f2937',
            padding: { bottom: 20 }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.raw || 0;
                return `${context.label}: ${value.toFixed(2)} INR Cr`;
              }
            }
          },
          datalabels: {
            display: true,
            color: '#ffffff',
            font: {
              weight: 'bold',
              size: 14
            },
            formatter: (value) => value
          }
        }
      };
      return (
        <div style={chartWrapperStyle}>
          <ChartJSComponent ref={this.chartRefs[index]} type="pie" data={data} options={options} />
        </div>
      );
    }

    return null;
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