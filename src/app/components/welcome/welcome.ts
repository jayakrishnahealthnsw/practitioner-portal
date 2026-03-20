import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PortalService } from '../../services/portal.service';
import { UserType } from '../../models/portal.models';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatButtonModule, DatePipe],
  templateUrl: './welcome.html',
  styleUrl: './welcome.scss'
})
export class WelcomeComponent {
  private readonly portalService = inject(PortalService);
  user = this.portalService.getUser();
  today = new Date();

  switchRole(userType: UserType): void {
    this.portalService.switchUserType(userType);
  }
}
