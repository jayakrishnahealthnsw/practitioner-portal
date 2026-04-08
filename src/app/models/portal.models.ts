export type UserType = 'practitioner' | 'admin-staff';
export type IdentityStrength = 'IP1' | 'IP2' | 'IP2+';
export type ProviderStatus = 'active' | 'suspended' | 'inactive' | 'pending';
export type DelegationStatus = 'requested' | 'active' | 'suspended';

export interface PractitionerUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  userType: UserType;
  organisation: string;
  identityStrength: IdentityStrength;
  lastLogin: Date | null;
  registrationComplete: boolean;
  notificationPreferences: NotificationPreferences;
}

export interface ApplicationTile {
  id: string;
  title: string;
  description: string;
  icon: string;
  image?: string;
  url: string;
  color: string;
  requiredIdentityStrength: IdentityStrength;
}

export interface ApplicationGroup {
  id: string;
  label: string;
  apps: ApplicationTile[];
}

export interface ProviderNumber {
  id: string;
  number: string;
  status: ProviderStatus;
}

export interface DelegateStaff {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  email: string;
  status: DelegationStatus;
}

export interface Clinic {
  id: string;
  name: string;
  providerNumbers: ProviderNumber[];
  delegates: DelegateStaff[];
  ahpraNumber?: string;
  medicareProviderNumber?: string;
  address?: string;
}

export interface DelegatedPractitioner {
  id: string;
  practitionerId: string;
  firstName: string;
  lastName: string;
  providerNumber: string;
  clinicName: string;
  status: DelegationStatus;
}

export interface ReportTile {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  url: string;
}

export interface QuickLink {
  id: string;
  title: string;
  url: string;
  icon: string;
  category: string;
}

export interface PortalNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'alert' | 'update';
  date: Date;
  read: boolean;
}

export interface NotificationPreferences {
  operational: boolean;
  serviceUpdates: boolean;
  alerts: boolean;
}

export interface RegistrationData {
  currentStep: number;
  personalDetails: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    phone: string;
  };
  professionalDetails: {
    profession: string;
    registrationNumber: string;
    organisation: string;
    role: string;
  };
  accountDetails: {
    email: string;
    username: string;
  };
  preferences: {
    notifyOperational: boolean;
    notifyServiceUpdates: boolean;
    notifyAlerts: boolean;
    agreeTerms: boolean;
  };
}
