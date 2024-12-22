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
    const targetAngle = Math.PI * 1.5 + ((currentValue / totalValue) * Math.PI);

    const needlePlugin = {
      id: 'needle',
      afterDraw: (chart: any) => {
        const { ctx } = chart;
        ctx.save();
    
        const x_center = chart.getDatasetMeta(0).data[0].x;
        const y_center = chart.getDatasetMeta(0).data[0].y;
        const innerRadius = chart.getDatasetMeta(0).data[0].innerRadius;
        const outerRadius = chart.getDatasetMeta(0).data[0].outerRadius;
    
        ctx.translate(x_center, y_center);
    
        if (currentAngle < targetAngle) {
          currentAngle += 0.1;
        }
    
        this.drawNeedle(ctx, x_center, y_center, innerRadius, currentAngle);
        ctx.restore();
    
        // Call drawLabels with the correct context
        this.drawLabels(ctx, x_center, y_center, outerRadius);
      },
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
        layout: {
          padding: {
            top: 20,    // Extra space above the chart
            bottom: 20, // Extra space below the chart
            left: 30,   // Extra space on the left
            right: 30,  // Extra space on the right
          },
        }
      },
      plugins: [needlePlugin], // Attach the custom needle plugin
    });
  }

  drawLabels(ctx: any, xCenter: number, yCenter: number, radius: number) {
    ctx.save();

    ctx.font = '5px Arial';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Draw labels at chart edges
    const offset = 15; // Offset for labels
    ctx.fillText('0', xCenter + (radius + offset) * Math.cos(Math.PI), yCenter + (radius + offset) * Math.sin(Math.PI));
    ctx.fillText(
      '100',
      xCenter + (radius + offset) * Math.cos(0),
      yCenter + (radius + offset) * Math.sin(0)
    );
    ctx.fillText(
      '50',
      xCenter + (radius + offset) * Math.cos(Math.PI * 1.5),
      yCenter + (radius + offset) * Math.sin(Math.PI * 1.5)
    );

    ctx.restore();
  }

  drawNeedle(ctx: any, xCenter: number, yCenter: number, innerRadius: number, currentAngle: number) {
    ctx.save();
    // Draw Needle
    ctx.beginPath();
    ctx.strokeStyle = 'black';
    ctx.fillStyle = 'black';
    ctx.rotate(currentAngle);
    ctx.moveTo(0 - 5, 0);
    ctx.lineTo(0, -innerRadius);
    ctx.lineTo(0 + 5, 0);
    ctx.stroke();
    ctx.fill();

    // Draw Circle
    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, 2 * Math.PI);
    ctx.fillStyle = 'black';
    ctx.fill();

    ctx.restore();
  }
}
