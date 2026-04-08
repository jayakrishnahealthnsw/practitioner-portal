import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { PortalService } from '../../services/portal.service';
import { ApplicationTile } from '../../models/portal.models';

const IP_ORDER: Record<string, number> = { 'IP1': 1, 'IP2': 2, 'IP2+': 3 };

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatRippleModule, MatButtonModule],
  templateUrl: './applications.html',
  styleUrl: './applications.scss'
})
export class ApplicationsComponent {
  private readonly portalService = inject(PortalService);
  user = this.portalService.getUser();
  apps: ApplicationTile[] = this.portalService.getApplications();
  private readonly failedImages = new Set<string>();

  meetsStrength(userStrength: string, required: string): boolean {
    return (IP_ORDER[userStrength] ?? 0) >= (IP_ORDER[required] ?? 0);
  }

  getIpClass(strength: string): string {
    return strength.replace('+', 'plus');
  }

  hasImage(app: ApplicationTile): boolean {
    return !!app.image && !this.failedImages.has(app.id);
  }

  openApp(app: ApplicationTile): void {
    if (this.meetsStrength(this.user().identityStrength, app.requiredIdentityStrength) && app.url) {
      window.open(app.url, '_blank', 'noopener,noreferrer');
    }
  }

  onImageError(app: ApplicationTile): void {
    this.failedImages.add(app.id);
  }
}
