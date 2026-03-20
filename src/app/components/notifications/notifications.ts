import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { PortalService } from '../../services/portal.service';
import { PortalNotification } from '../../models/portal.models';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [
    DatePipe, FormsModule,
    MatCardModule, MatIconModule, MatButtonModule,
    MatBadgeModule, MatSlideToggleModule
  ],
  templateUrl: './notifications.html',
  styleUrl: './notifications.scss'
})
export class NotificationsComponent {
  private portalService = inject(PortalService);

  notifications = signal<PortalNotification[]>(this.portalService.getNotifications());
  showPreferences = signal(false);
  preferences = signal({
    operational: true,
    serviceUpdates: true,
    alerts: true
  });

  get unreadCount(): number {
    return this.notifications().filter(n => !n.read).length;
  }

  get filteredNotifications(): PortalNotification[] {
    const prefs = this.preferences();
    return this.notifications().filter(n => {
      if (n.type === 'warning' && !prefs.operational) return false;
      if (n.type === 'update' && !prefs.serviceUpdates) return false;
      if (n.type === 'alert' && !prefs.alerts) return false;
      return true;
    });
  }

  togglePreferences(): void {
    this.showPreferences.update(v => !v);
  }

  markAsRead(id: string): void {
    this.notifications.update(list =>
      list.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }

  markAllRead(): void {
    this.notifications.update(list =>
      list.map(n => ({ ...n, read: true }))
    );
  }

  getTypeIcon(type: string): string {
    switch (type) {
      case 'warning': return 'warning';
      case 'alert': return 'error';
      case 'update': return 'new_releases';
      default: return 'info';
    }
  }

  getTypeClass(type: string): string {
    return `notif-${type}`;
  }
}
