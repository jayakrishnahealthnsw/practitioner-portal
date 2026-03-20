import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { PortalService } from '../../services/portal.service';

@Component({
  selector: 'app-delegation',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatDividerModule, FormsModule],
  templateUrl: './delegation.html',
  styleUrl: './delegation.scss'
})
export class DelegationComponent {
  private readonly portalService = inject(PortalService);
  readonly user = this.portalService.getUser();
  readonly clinics = this.portalService.getClinics();
  readonly adminDelegations = this.portalService.getAdminDelegations();

  readonly totalDelegateCount = computed(() =>
    this.clinics().reduce((sum, c) => sum + c.delegates.length, 0)
  );

  showAddForm = signal(false);
  formName = '';
  formProviderNumber = '';
  formMessage = signal<{ type: 'success' | 'error'; text: string } | null>(null);

  approve(delegateId: string): void {
    this.portalService.approveDelegation(delegateId);
  }

  decline(delegateId: string): void {
    this.portalService.declineDelegation(delegateId);
  }

  toggleAddForm(): void {
    this.showAddForm.update(v => !v);
    this.formMessage.set(null);
    this.formName = '';
    this.formProviderNumber = '';
  }

  submitRequest(): void {
    if (!this.formName.trim() || !this.formProviderNumber.trim()) {
      this.formMessage.set({ type: 'error', text: 'Please enter both practitioner name and provider number.' });
      return;
    }
    const result = this.portalService.requestDelegation(this.formName, this.formProviderNumber);
    this.formMessage.set({ type: result.success ? 'success' : 'error', text: result.message });
    if (result.success) {
      this.formName = '';
      this.formProviderNumber = '';
    }
  }
}
