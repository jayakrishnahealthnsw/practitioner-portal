import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';
import { PortalService } from '../../services/portal.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet, RouterLink, RouterLinkActive,
    MatSidenavModule, MatListModule,
    MatIconModule, MatButtonModule, MatMenuModule, MatDividerModule
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.scss'
})
export class LayoutComponent implements OnInit, OnDestroy {
  private portalService = inject(PortalService);
  private router = inject(Router);
  private breakpointObserver = inject(BreakpointObserver);
  private bpSub?: Subscription;

  user = this.portalService.getUser();
  isMobile = signal(false);
  sidenavOpened = signal(true);

  get sidenavMode(): 'side' | 'over' {
    return this.isMobile() ? 'over' : 'side';
  }

  readonly navItems = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { label: 'Applications', icon: 'apps', route: '/dashboard', fragment: 'applications' },
    { label: 'Notifications', icon: 'notifications', route: '/dashboard', fragment: 'notifications' },
  ];

  ngOnInit(): void {
    this.bpSub = this.breakpointObserver.observe('(max-width: 768px)').subscribe(result => {
      this.isMobile.set(result.matches);
      this.sidenavOpened.set(!result.matches);
    });
  }

  ngOnDestroy(): void {
    this.bpSub?.unsubscribe();
  }

  toggleSidenav(): void {
    this.sidenavOpened.set(!this.sidenavOpened());
  }

  closeOnMobile(): void {
    if (this.isMobile()) this.sidenavOpened.set(false);
  }

  logout(): void {
    this.router.navigate(['/register']);
  }
}

