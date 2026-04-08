import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PortalService } from '../../services/portal.service';

interface NewClinicForm {
  ahpraNumber: string;
  medicareProviderNumber: string;
  name: string;
  address: string;
  suburb: string;
  state: string;
  postcode: string;
}

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
  readonly availableClinics = this.portalService.getAvailableEmployerClinics();

  showAddClinic = signal(false);
  showManualForm = signal(false);
  newClinicName = '';

  activeProviderForm = signal<string | null>(null);
  newProviderValue = '';

  newClinic: NewClinicForm = this.emptyForm();

  private emptyForm(): NewClinicForm {
    return { ahpraNumber: '', medicareProviderNumber: '', name: '', address: '', suburb: '', state: 'NSW', postcode: '' };
  }

  addClinic(): void {
    if (!this.newClinicName.trim()) return;
    this.portalService.addClinic(this.newClinicName);
    this.newClinicName = '';
    this.showAddClinic.set(false);
  }

  addClinicFromList(name: string): void {
    this.portalService.addClinic(name);
  }

  addClinicManual(): void {
    if (!this.newClinic.name.trim() || !this.newClinic.medicareProviderNumber.trim()) return;
    const label = [this.newClinic.name.trim(), this.newClinic.suburb.trim(), this.newClinic.state.trim()]
      .filter(Boolean).join(', ');
    this.portalService.addClinic(label, {
      ahpraNumber: this.newClinic.ahpraNumber.trim(),
      medicareProviderNumber: this.newClinic.medicareProviderNumber.trim(),
      address: [this.newClinic.address, this.newClinic.suburb, this.newClinic.state, this.newClinic.postcode]
        .filter(Boolean).join(', ')
    });
    this.newClinic = this.emptyForm();
    this.showManualForm.set(false);
    this.showAddClinic.set(false);
  }

  resetManualForm(): void {
    this.newClinic = this.emptyForm();
    this.showManualForm.set(false);
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
  removeStaff(clinicId: string, delegateId: string): void {
    this.portalService.removeDelegate(clinicId, delegateId);
  }

  removeClinic(clinicId: string): void {
    this.portalService.removeClinic(clinicId);
  }

  approve(delegateId: string): void {
    this.portalService.approveDelegation(delegateId);
  }

  decline(delegateId: string): void {
    this.portalService.declineDelegation(delegateId);
  }}
