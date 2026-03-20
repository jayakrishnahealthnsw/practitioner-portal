import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RegistrationService } from '../../services/registration.service';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [
    FormsModule,
    MatStepperModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatSelectModule, MatCheckboxModule,
    MatIconModule, MatCardModule, MatSnackBarModule
  ],
  templateUrl: './registration.html',
  styleUrl: './registration.scss'
})
export class RegistrationComponent {
  private regService = inject(RegistrationService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  data = this.regService.getData();
  hasSavedProgress = signal(this.regService.hasSavedProgress());
  submitted = signal(false);

  readonly professions = [
    'General Practitioner',
    'Specialist',
    'Nurse Practitioner',
    'Pharmacist',
    'Allied Health Professional',
    'Dentist',
    'Midwife',
    'Other'
  ];

  savePersonalDetails(): void {
    this.regService.updatePersonalDetails(this.data().personalDetails);
    this.regService.updateStep(1);
    this.showSaveMessage();
  }

  saveProfessionalDetails(): void {
    this.regService.updateProfessionalDetails(this.data().professionalDetails);
    this.regService.updateStep(2);
    this.showSaveMessage();
  }

  saveAccountDetails(): void {
    this.regService.updateAccountDetails(this.data().accountDetails);
    this.regService.updateStep(3);
    this.showSaveMessage();
  }

  submitRegistration(): void {
    this.regService.updatePreferences(this.data().preferences);
    const success = this.regService.submitRegistration();
    if (success) {
      this.submitted.set(true);
    }
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  clearSavedProgress(): void {
    this.regService.clearProgress();
    this.hasSavedProgress.set(false);
  }

  private showSaveMessage(): void {
    this.snackBar.open('Progress saved automatically', 'OK', {
      duration: 2000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom'
    });
  }
}
