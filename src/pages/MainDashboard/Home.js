import axios from 'axios';
import {
  BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, // Required for Line elements
  PointElement // Required for Line elements
  ,








  Title, Tooltip
} from 'chart.js';
import React, { Component } from 'react';
import { Chart as ChartJSComponent } from 'react-chartjs-2';
import './home.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement // Register PointElement
);



const graphConfigs = [
  {
    title: "GS Orderbook Visibility",
    inputs: [
      { type: 'select', name: 'year', label: 'Financial Year', options: ['FY24', 'FY25', 'FY26'] },
      { type: 'select', name: 'priority', label: 'Priority', options: ['Commit', 'TBD', 'Upside'] }
    ],
    dataFetch: (inputs) => `http://localhost:8080/api/opportunities/filtered?ob_fy=${inputs.year}`
  },
  {
    title: "Segment Wise Order Book",
    inputs: [
      { type: 'select', name: 'year', label: 'Financial Year', options: ['FY24', 'FY25', 'FY26'] },

    ],
    dataFetch: (inputs) => `http://localhost:8080/api/opportunities/filtered?ob_fy=${inputs.year}`
    
  },
  {
    title: "Public vs Private Order Book",
    inputs: [
      { type: 'select', name: 'year', label: 'Financial Year', options: ['FY24', 'FY25', 'FY26'] },

    ],
    dataFetch: (inputs) => `http://localhost:8080/api/opportunities/filtered?ob_fy=${inputs.year}`
  }
];

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentGraph: 0,
      graphs: graphConfigs.map(config => ({
        inputs: config.inputs.reduce((acc, input) => {
          acc[input.name] = input.options ? input.options[0] : '';
          return acc;
        }, {}),
        chartData: []
      }))
    };
  }

  componentDidMount() {
    this.fetchDataForAllGraphs();
  }

  fetchDataForAllGraphs = () => {
    this.state.graphs.forEach((_, index) => this.fetchData(index));
  };

  fetchData = async (index) => {
    const { inputs } = this.state.graphs[index];
    const { dataFetch } = graphConfigs[index];
    try {
      const response = await axios.get(dataFetch(inputs));
      this.processData(response.data, index);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  processData = (data, index) => {
    if (index === 0) { // GS Orderbook Visibility graph
      const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
      const chartData = quarters.map(quarter => {
        const quarterData = data.opportunities.filter(opp => 
          opp.ob_qtr === quarter && opp.priority === this.state.graphs[0].inputs.priority
        );
        const totalAmount = quarterData.reduce((sum, opp) => sum + (opp.amount_inr_cr_max || 0), 0);
  
        // Calculate visibility (total sum without priority filter)
        const visibilityData = data.opportunities.filter(opp => opp.ob_qtr === quarter);
        const visibilityAmount = visibilityData.reduce((sum, opp) => sum + (opp.amount_inr_cr_max || 0), 0);
        const priorityTimes6 = totalAmount * 6; // priorityTimes6 = 500 * 6 = 3000

        return {
          quarter: quarter,
          amount: totalAmount,
          visibility: visibilityAmount,
          priorityTimes6: priorityTimes6
        };
      });
  
      this.setState(prevState => {
        const newGraphs = [...prevState.graphs];
        newGraphs[index].chartData = chartData;
        return { graphs: newGraphs };
      });


    } else if (index ===1 ){
      const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
      const segments = [...new Set(data.opportunities.map(opp => opp.industry_segment))];

      const chartData = quarters.flatMap(quarter => {
        const commitData = segments.map(segment => {
          const segmentData = data.opportunities.filter(opp => 
            opp.ob_qtr === quarter && opp.industry_segment === segment && opp.priority === 'Commit'
          );
          return segmentData.reduce((sum, opp) => sum + (opp.amount_inr_cr_max || 0), 0);
        });

        const visData = segments.map(segment => {
          const segmentData = data.opportunities.filter(opp => 
            opp.ob_qtr === quarter && opp.industry_segment === segment
          );
          return segmentData.reduce((sum, opp) => sum + (opp.amount_inr_cr_max || 0), 0);
        });

        return [
          { quarter: `${quarter} Commit`, data: commitData },
          { quarter: `${quarter} Vis`, data: visData }
        ];
      });

      this.setState(prevState => {
        const newGraphs = [...prevState.graphs];
        newGraphs[index].chartData = chartData;
        newGraphs[index].segments = segments;
        return { graphs: newGraphs };
      });
      
    }else if(index===2){
      const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
      const chartData = quarters.flatMap(quarter => {
        const calculateAmount = (filter) => {
          const filteredData = data.opportunities.filter(opp => 
            opp.ob_qtr === quarter && filter(opp)
          );
          return filteredData.reduce((sum, opp) => sum + (opp.amount_inr_cr_max || 0), 0);
        };
  
        const publicAmount = calculateAmount(opp => opp.industry_segment === "Public Sector");
        const privateAmount = calculateAmount(opp => opp.industry_segment !== "Public Sector");
        const totalAmount = publicAmount + privateAmount;
  
        return [
          { quarter: `${quarter} Commit`, public: publicAmount, private: privateAmount, total: totalAmount },
          { quarter: `${quarter} Vis`, public: publicAmount, private: privateAmount, total: totalAmount }
        ];
      });
  
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

  handleNextGraph = () => {
    this.setState(prevState => ({
      currentGraph: (prevState.currentGraph + 1) % graphConfigs.length
    }));
  };

  handlePrevGraph = () => {
    this.setState(prevState => ({
      currentGraph: (prevState.currentGraph - 1 + graphConfigs.length) % graphConfigs.length
    }));
  };

  renderInputs = (index) => {
    const { inputs } = graphConfigs[index];
    const currentInputs = this.state.graphs[index].inputs;

    return (
      <div className="controls">
        {inputs.map(input => (
          <div key={input.name} className="input-container">
            <label htmlFor={`${input.name}-${index}`}>{input.label}</label>
            {input.type === 'select' ? (
              <select
                id={`${input.name}-${index}`}
                value={currentInputs[input.name]}
                onChange={(e) => this.handleInputChange(e, index, input.name)}
              >
                {input.options.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            ) : (
              <input
                id={`${input.name}-${index}`}
                type="text"
                value={currentInputs[input.name]}
                onChange={(e) => this.handleInputChange(e, index, input.name)}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  // renderChart = (index) => {
  //   const { chartData } = this.state.graphs[index];
  //   return (
  //     <BarChart
  //       dataset={chartData}
  //       xAxis={[{ scaleType: 'band', dataKey: 'quarter' }]}
  //       series={[
  //         { dataKey: 'amount', label: 'Amount (INR Cr)', color: '#8884d8' },
  //         { dataKey: 'visibility', label: 'Visibility (INR Cr)', color: '#82ca9d' },
  //         { dataKey: 'priorityTimes6', label: 'Priority x6', color: '#ff7300', type: 'line' } // Add this line

  //       ]}
  //       height={300}
  //       yAxis={[{ label: 'Amount (INR Cr)' }]}
  //     />
  //   );
  // };
  renderChart = (index) => {

    if (index===0){
    const { chartData } = this.state.graphs[index];
  
    const data = {
      labels: chartData.map(item => item.quarter),
      datasets: [
        {
          type: 'bar',
          label: 'Act/Commit (INR Cr)',
          data: chartData.map(item => item.amount),
          backgroundColor: '#8884d8',
          barThickness: 30,
        },
        {
          type: 'bar',
          label: 'Visibility (INR Cr)',
          data: chartData.map(item => item.visibility),
          backgroundColor: '#82ca9d',
          barThickness: 30,
        },
        {
          type: 'line',
          label: 'Target',
          data: chartData.map(item => item.priorityTimes6),
          borderColor: '#ff7300',
          borderWidth: 2,
          fill: false,
        },
      ],
    };
  
    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return `${context.dataset.label}: ${context.raw}`;
            },
          },
        },
      },
      scales: {
        x: {
          stacked: false,
        },
        y: {
          stacked: false,
        },
      },
    };
  
    return (
      <ChartJSComponent type="bar" data={data} options={options} />
    );
  } else if (index===1){

    const { chartData, segments } = this.state.graphs[index];
      
      const data = {
        labels: chartData.map(item => item.quarter),
        datasets: segments.map((segment, i) => ({
          label: segment,
          data: chartData.map(item => item.data[i]),
          backgroundColor: `hsl(${i * 360 / segments.length}, 70%, 50%)`,
          stack: 'stack',
        })),
      };

      const options = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Segment Wise Order Book',
          },
        },
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true,
          },
        },
      };

      return (
        <ChartJSComponent type="bar" data={data} options={options} />
      );
  } else if(index===2) {
    const { chartData } = this.state.graphs[index];

    const data = {
      labels: chartData.map(item => item.quarter),
      datasets: [
        {
          label: 'Public',
          data: chartData.map(item => item.public),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          stack: 'stack',
        },
        {
          label: 'Private',
          data: chartData.map(item => item.private),
          backgroundColor: 'rgba(153, 102, 255, 0.6)',
          stack: 'stack',
        },
        {
          type: 'line',
          label: 'Total',
          data: chartData.map(item => item.total),
          borderColor: 'rgba(255, 159, 64, 1)',
          borderWidth: 2,
          fill: false,
        },
      ],
    };

    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Public vs Private Order Book',
        },
      },
      scales: {
        x: {
          stacked: true,
        },
        y: {
          stacked: true,
        },
      },
    };

    return (
      <ChartJSComponent type="bar" data={data} options={options} />
    );
  }
  };

  
  render() {
    const { currentGraph } = this.state;

    return (
      <div className="container">
        <div className="box">
          {/* <h1>Analytics</h1> */}
          <h1>{graphConfigs[currentGraph].title}</h1>
          {this.renderInputs(currentGraph)}
          <div className="chart-container">
            <div className="chart-wrapper">
              {this.renderChart(currentGraph)}
            </div>
            <button className="arrow-btn prev" onClick={this.handlePrevGraph}>&lt;</button>
            <button className="arrow-btn next" onClick={this.handleNextGraph}>&gt;</button>
          </div>
        </div>
      </div>
    );
  }
}











