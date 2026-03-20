import { Component, inject } from '@angular/core';
import { WelcomeComponent } from '../welcome/welcome';
import { ApplicationsComponent } from '../applications/applications';
import { LinksComponent } from '../links/links';
import { NotificationsComponent } from '../notifications/notifications';
import { DelegationComponent } from '../delegation/delegation';
import { ProvidersComponent } from '../providers/providers';
import { PortalService } from '../../services/portal.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    WelcomeComponent,
    ApplicationsComponent,
    LinksComponent,
    NotificationsComponent,
    DelegationComponent,
    ProvidersComponent
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent {
  user = inject(PortalService).getUser();
}
