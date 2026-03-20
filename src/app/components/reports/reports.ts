import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { PortalService } from '../../services/portal.service';
import { ReportTile } from '../../models/portal.models';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatRippleModule, MatChipsModule],
  templateUrl: './reports.html',
  styleUrl: './reports.scss'
})
export class ReportsComponent {
  private portalService = inject(PortalService);
  reports: ReportTile[] = this.portalService.getReports();
}
