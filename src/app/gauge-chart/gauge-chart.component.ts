import { Component } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-gauge-chart',
  standalone: true,
  imports: [],
  templateUrl: './gauge-chart.component.html',
  styleUrl: './gauge-chart.component.scss',
})
export class GaugeChartComponent {
  public chart: any;
  chartData = {
    datasets: [
      {
        data: [10, 20, 30, 40],
        backgroundColor: ['red', 'orange', 'yellow', 'green'],
      },
    ],
  };

  constructor() {}

  ngOnInit() {
    this.createChart();
  }

  // createChart() {
  //   if (this.chart) {
  //     this.chart.destroy(); // Prevent multiple chart instances
  //   }

  //   // Define total and current values
  //   const totalValue = 100; // Total range for the speedometer
  //   const currentValue = 60; // Current value (Y)
  //   const remainingValue = totalValue - currentValue; // Remaining (X)

  //   this.chart = new Chart('MyChart', {
  //     type: 'doughnut',
  //     options: {
  //       rotation: 270, // Start from the bottom
  //       circumference: 180, // Half-circle
  //       cutout: '80%', // Hollow center for a gauge-like effect
  //       responsive: true,
  //       plugins: {
  //         legend: {
  //           display: false, // Hide the legend for a cleaner look
  //         },
  //       },
  //     },
  //     data: {
  //       datasets: [
  //         {
  //           data: [currentValue, remainingValue],
  //           backgroundColor: ['red', 'lightgray'], // Filled and empty colors
  //           borderWidth: 0, // No border
  //         },
  //       ],
  //     },
  //   });
  // }

  createChart() {
    if (this.chart) {
      this.chart.destroy(); // Prevent multiple instances
    }
  
    const totalValue = 100; // Max gauge value
    const currentValue = 60; // Current gauge reading
    let currentAngle = Math.PI * 1.5;
    // Consider that the chart is already rotated by 270 degrees
    const targetAngle = Math.PI * 1.5 + ((currentValue / totalValue) * Math.PI);

    const needlePlugin = {
      id: 'needle',
      afterDraw(chart: any) {
        const {ctx, data} = chart;
        ctx.save();
        // log chart meta data
        console.log(chart);
        // Get center of the gauge chart
        const x_center = chart.getDatasetMeta(0).data[0].x;
        const y_center = chart.getDatasetMeta(0).data[0].y;
        const innerRadius = chart.getDatasetMeta(0).data[0].innerRadius;

        ctx.translate(x_center, y_center); // Translate to center

        // Rotate needle to target angle
        if (currentAngle < targetAngle) {
          currentAngle += 0.1;
        }

        // Needle
        ctx.beginPath();
        ctx.strokeStyle = 'black';
        ctx.fillStyle = 'black';
        // Needle needs to start at 0
        // Needle ends at circumference
        ctx.rotate(currentAngle);
        ctx.moveTo(0 - 5, 0);
        ctx.lineTo(0, -innerRadius);
        ctx.lineTo(0 + 5, 0);
        ctx.stroke();
        ctx.fill();

        // Circle at the bottom of needle
        ctx.beginPath();
        ctx.arc(0, 0, 5, 0, 2 * Math.PI);
        ctx.fillStyle = 'black';
        ctx.fill();

        ctx.restore();

      }
    };
  
    this.chart = new Chart('MyChart', {
      type: 'doughnut',
      data: {
        datasets: [
          {
            data: [currentValue, totalValue - currentValue],
            backgroundColor: ['red', 'lightgray'],
            borderWidth: 0,  // No borders
          },
        ],
      },
      options: {
        rotation: 270,    // Start from bottom center
        circumference: 180, // Half-circle gauge
        cutout: '80%',    // Hollow center
        responsive: false,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,  // No legend for cleaner UI
          },
        },
      },
      plugins: [needlePlugin], // Attach the custom needle plugin
    });
  }
  
}
