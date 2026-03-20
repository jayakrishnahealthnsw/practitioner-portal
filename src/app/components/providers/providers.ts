import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PortalService } from '../../services/portal.service';

@Component({
  selector: 'app-providers',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule, FormsModule],
  templateUrl: './providers.html',
  styleUrl: './providers.scss'
})
export class ProvidersComponent {
  private readonly portalService = inject(PortalService);
  readonly clinics = this.portalService.getClinics();

  showAddClinic = signal(false);
  newClinicName = '';

  activeProviderForm = signal<string | null>(null);
  newProviderValue = '';

  addClinic(): void {
    if (!this.newClinicName.trim()) return;
    this.portalService.addClinic(this.newClinicName);
    this.newClinicName = '';
    this.showAddClinic.set(false);
  }

  toggleProviderForm(clinicId: string): void {
    this.activeProviderForm.set(this.activeProviderForm() === clinicId ? null : clinicId);
    this.newProviderValue = '';
  }

  addProviderNumber(clinicId: string): void {
    if (!this.newProviderValue.trim()) return;
    this.portalService.addProviderNumber(clinicId, this.newProviderValue);
    this.newProviderValue = '';
    this.activeProviderForm.set(null);
  }
}
