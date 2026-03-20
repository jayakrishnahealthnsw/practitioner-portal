import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { PortalService } from '../../services/portal.service';
import { QuickLink } from '../../models/portal.models';

@Component({
  selector: 'app-links',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatListModule],
  templateUrl: './links.html',
  styleUrl: './links.scss'
})
export class LinksComponent {
  private portalService = inject(PortalService);
  links: QuickLink[] = this.portalService.getQuickLinks();

  get groupedLinks(): { category: string; items: QuickLink[] }[] {
    const groups = new Map<string, QuickLink[]>();
    for (const link of this.links) {
      const existing = groups.get(link.category) || [];
      existing.push(link);
      groups.set(link.category, existing);
    }
    return Array.from(groups, ([category, items]) => ({ category, items }));
  }
}
