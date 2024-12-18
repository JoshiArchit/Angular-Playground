import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider'; 
import { GaugeChartComponent } from './gauge-chart/gauge-chart.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatDividerModule, GaugeChartComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Angular-Playground';
}
