import { Injectable, signal } from '@angular/core';
import { RegistrationData } from '../models/portal.models';

const STORAGE_KEY = 'practitioner_registration';

@Injectable({ providedIn: 'root' })
export class RegistrationService {

  private readonly registrationData = signal<RegistrationData>(this.loadSavedData());

  getData() {
    return this.registrationData;
  }

  updateStep(step: number): void {
    this.registrationData.update(d => ({ ...d, currentStep: step }));
    this.saveProgress();
  }

  updatePersonalDetails(details: RegistrationData['personalDetails']): void {
    this.registrationData.update(d => ({ ...d, personalDetails: details }));
    this.saveProgress();
  }

  updateProfessionalDetails(details: RegistrationData['professionalDetails']): void {
    this.registrationData.update(d => ({ ...d, professionalDetails: details }));
    this.saveProgress();
  }

  updateAccountDetails(details: RegistrationData['accountDetails']): void {
    this.registrationData.update(d => ({ ...d, accountDetails: details }));
    this.saveProgress();
  }

  updatePreferences(prefs: RegistrationData['preferences']): void {
    this.registrationData.update(d => ({ ...d, preferences: prefs }));
    this.saveProgress();
  }

  submitRegistration(): boolean {
    // Simulate submission
    localStorage.removeItem(STORAGE_KEY);
    return true;
  }

  hasSavedProgress(): boolean {
    return localStorage.getItem(STORAGE_KEY) !== null;
  }

  clearProgress(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.registrationData.set(this.getDefaultData());
  }

  private saveProgress(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.registrationData()));
  }

  private loadSavedData(): RegistrationData {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved) as RegistrationData;
      } catch {
        return this.getDefaultData();
      }
    }
    return this.getDefaultData();
  }

  private getDefaultData(): RegistrationData {
    return {
      currentStep: 0,
      personalDetails: { firstName: '', lastName: '', dateOfBirth: '', phone: '' },
      professionalDetails: { profession: '', registrationNumber: '', organisation: '', role: '' },
      accountDetails: { email: '', username: '' },
      preferences: { notifyOperational: true, notifyServiceUpdates: true, notifyAlerts: true, agreeTerms: false }
    };
  }
}
