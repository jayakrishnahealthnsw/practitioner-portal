import { Injectable, signal } from '@angular/core';
import {
  PractitionerUser,
  ApplicationTile,
  ApplicationGroup,
  ReportTile,
  QuickLink,
  PortalNotification,
  Clinic,
  DelegatedPractitioner,
  DelegationStatus,
  ProviderStatus
} from '../models/portal.models';

const DEMO_PRACTITIONER: PractitionerUser = {
  id: 'USR-001',
  firstName: 'Dr. Sarah',
  lastName: 'Mitchell',
  email: 'sarah.mitchell@health.nsw.gov.au',
  role: 'General Practitioner',
  userType: 'practitioner',
  organisation: 'Sydney Local Health District',
  identityStrength: 'IP2+',
  lastLogin: new Date(2026, 2, 18, 14, 32),
  registrationComplete: true,
  notificationPreferences: { operational: true, serviceUpdates: true, alerts: true }
};

const DEMO_ADMIN: PractitionerUser = {
  id: 'USR-002',
  firstName: 'David',
  lastName: 'Chen',
  email: 'david.chen@health.nsw.gov.au',
  role: 'Administrative Officer',
  userType: 'admin-staff',
  organisation: 'Sydney Local Health District',
  identityStrength: 'IP2',
  lastLogin: new Date(2026, 2, 18, 16, 10),
  registrationComplete: true,
  notificationPreferences: { operational: true, serviceUpdates: false, alerts: true }
};

const KNOWN_PRACTITIONERS = [
  { id: 'USR-001', firstName: 'Sarah', lastName: 'Mitchell', providerNumber: '2345678A', clinicName: 'Sydney CBD Medical Centre' },
  { id: 'USR-003', firstName: 'James', lastName: 'Wilson', providerNumber: '5678901D', clinicName: 'North Shore Clinic' },
  { id: 'USR-004', firstName: 'Emily', lastName: 'Thompson', providerNumber: '6789012E', clinicName: 'Parramatta Health Hub' }
];

@Injectable({ providedIn: 'root' })
export class PortalService {

  private readonly _currentUser = signal<PractitionerUser>(DEMO_PRACTITIONER);

  private readonly _clinics = signal<Clinic[]>([
    {
      id: 'clinic-1',
      name: 'Sydney CBD Medical Centre',
      providerNumbers: [{ id: 'pn-1', number: '2345678A', status: 'active' }],
      delegates: [
        { id: 'del-1', firstName: 'David', lastName: 'Chen', role: 'Administrative Officer', email: 'david.chen@health.nsw.gov.au', status: 'active' },
        { id: 'del-2', firstName: 'Lisa', lastName: 'Park', role: 'Receptionist', email: 'l.park@scbmc.com', status: 'requested' }
      ]
    },
    {
      id: 'clinic-2',
      name: 'Westfield Family Practice',
      providerNumbers: [
        { id: 'pn-2', number: '3456789B', status: 'active' },
        { id: 'pn-3', number: '3456789C', status: 'inactive' }
      ],
      delegates: []
    }
  ]);

  private readonly _adminDelegations = signal<DelegatedPractitioner[]>([
    {
      id: 'adel-1',
      practitionerId: 'USR-001',
      firstName: 'Dr. Sarah',
      lastName: 'Mitchell',
      providerNumber: '2345678A',
      clinicName: 'Sydney CBD Medical Centre',
      status: 'active'
    }
  ]);

  getUser() {
    return this._currentUser.asReadonly();
  }

  switchUserType(userType: 'practitioner' | 'admin-staff'): void {
    this._currentUser.set(userType === 'practitioner' ? DEMO_PRACTITIONER : DEMO_ADMIN);
  }

  getClinics() {
    return this._clinics.asReadonly();
  }

  getAdminDelegations() {
    return this._adminDelegations.asReadonly();
  }

  getApplications(): ApplicationTile[] {
    return this.getApplicationGroups().flatMap(g => g.apps);
  }

  getApplicationGroups(): ApplicationGroup[] {
    return [
      {
        id: 'group-main',
        label: 'Clinical Applications',
        apps: [
          {
            id: 'app-pathworks',
            title: 'PathWorks',
            description: 'Access patient pathology records and results',
            icon: 'local_hospital',
            image: '/pathworks.png',
            url: '/applications/pathworks',
            color: '#1565C0',
            requiredIdentityStrength: 'IP2+'
          },
          {
            id: 'app-healthlink',
            title: 'HealthLink',
            description: 'Secure clinical messaging and results delivery',
            icon: 'link',
            image: '/HealthLink.png',
            url: '/applications/healthlink',
            color: '#2E7D32',
            requiredIdentityStrength: 'IP2'
          }
        ]
      }
    ];
  }

  addClinic(name: string): void {
    this._clinics.update(list => [...list, {
      id: `clinic-${Date.now()}`,
      name: name.trim(),
      providerNumbers: [],
      delegates: []
    }]);
  }

  addProviderNumber(clinicId: string, number: string): void {
    this._clinics.update(clinics =>
      clinics.map(c => c.id === clinicId
        ? { ...c, providerNumbers: [...c.providerNumbers, { id: `pn-${Date.now()}`, number: number.trim(), status: 'pending' as ProviderStatus }] }
        : c
      )
    );
  }

  requestDelegation(practitionerName: string, providerNumber: string): { success: boolean; message: string } {
    const normalized = practitionerName.trim().toLowerCase().replace(/^dr\.?\s+/i, '');
    const pn = providerNumber.trim().toUpperCase();
    const match = KNOWN_PRACTITIONERS.find(p =>
      `${p.firstName} ${p.lastName}`.toLowerCase() === normalized && p.providerNumber.toUpperCase() === pn
    );
    if (!match) {
      return { success: false, message: 'No practitioner found with this name and provider number. Please check and try again.' };
    }
    const already = this._adminDelegations().some(d => d.practitionerId === match.id && d.status !== 'suspended');
    if (already) {
      return { success: false, message: 'A delegation request for this practitioner already exists.' };
    }
    const id = `del-${Date.now()}`;
    const adminUser = this._currentUser();
    this._adminDelegations.update(list => [...list, {
      id,
      practitionerId: match.id,
      firstName: match.firstName,
      lastName: match.lastName,
      providerNumber: match.providerNumber,
      clinicName: match.clinicName,
      status: 'requested' as DelegationStatus
    }]);
    this._clinics.update(clinics =>
      clinics.map(c => c.providerNumbers.some(p => p.number.toUpperCase() === pn)
        ? { ...c, delegates: [...c.delegates, { id, firstName: adminUser.firstName, lastName: adminUser.lastName, role: adminUser.role, email: adminUser.email, status: 'requested' as DelegationStatus }] }
        : c
      )
    );
    return { success: true, message: `Request sent to ${match.firstName} ${match.lastName}. Awaiting their approval.` };
  }

  approveDelegation(delegateId: string): void {
    this._clinics.update(clinics =>
      clinics.map(c => ({ ...c, delegates: c.delegates.map(d => d.id === delegateId ? { ...d, status: 'active' as DelegationStatus } : d) }))
    );
    this._adminDelegations.update(list =>
      list.map(d => d.id === delegateId ? { ...d, status: 'active' as DelegationStatus } : d)
    );
  }

  declineDelegation(delegateId: string): void {
    this._clinics.update(clinics =>
      clinics.map(c => ({ ...c, delegates: c.delegates.filter(d => d.id !== delegateId) }))
    );
    this._adminDelegations.update(list =>
      list.map(d => d.id === delegateId ? { ...d, status: 'suspended' as DelegationStatus } : d)
    );
  }

  getReports(): ReportTile[] {
    return [
      {
        id: 'rpt-1',
        title: 'Patient Activity Summary',
        description: 'Overview of patient interactions and consultations',
        icon: 'assessment',
        category: 'Activity',
        url: '/reports/activity-summary'
      },
      {
        id: 'rpt-2',
        title: 'Referral Tracking',
        description: 'Status and outcomes of submitted referrals',
        icon: 'track_changes',
        category: 'Referrals',
        url: '/reports/referral-tracking'
      },
      {
        id: 'rpt-3',
        title: 'Prescribing Report',
        description: 'Analysis of prescribing patterns and trends',
        icon: 'analytics',
        category: 'Prescribing',
        url: '/reports/prescribing'
      },
      {
        id: 'rpt-4',
        title: 'Compliance Dashboard',
        description: 'Regulatory compliance status and actions',
        icon: 'verified',
        category: 'Compliance',
        url: '/reports/compliance'
      }
    ];
  }

  getQuickLinks(): QuickLink[] {
    return [
      {
        id: 'lnk-1',
        title: 'NSW Health Intranet',
        url: 'https://www.health.nsw.gov.au',
        icon: 'language',
        category: 'External Systems'
      },
      {
        id: 'lnk-2',
        title: 'Clinical Guidelines',
        url: 'https://www.health.nsw.gov.au/pages/clinical-guidelines',
        icon: 'menu_book',
        category: 'Reference Materials'
      },
      {
        id: 'lnk-3',
        title: 'Staff Directory',
        url: 'https://www.health.nsw.gov.au/pages/staff-directory',
        icon: 'contacts',
        category: 'Key Resources'
      },
      {
        id: 'lnk-4',
        title: 'Training Portal',
        url: 'https://www.health.nsw.gov.au/pages/training',
        icon: 'school',
        category: 'Key Resources'
      },
      {
        id: 'lnk-5',
        title: 'Service Desk',
        url: 'https://www.health.nsw.gov.au/pages/service-desk',
        icon: 'support_agent',
        category: 'Key Resources'
      },
      {
        id: 'lnk-6',
        title: 'Policy Library',
        url: 'https://www.health.nsw.gov.au/pages/policy-library',
        icon: 'policy',
        category: 'Reference Materials'
      }
    ];
  }

  getNotifications(): PortalNotification[] {
    return [
      {
        id: 'ntf-1',
        title: 'Scheduled Maintenance',
        message: 'HealtheNet will undergo scheduled maintenance on Saturday 22 March 2026 from 10:00 PM to 2:00 AM AEDT.',
        type: 'warning',
        date: new Date(2026, 2, 19),
        read: false
      },
      {
        id: 'ntf-2',
        title: 'New Feature: Telehealth Integration',
        message: 'Telehealth consultations can now be initiated directly from the eReferral system. See updated guidelines.',
        type: 'update',
        date: new Date(2026, 2, 17),
        read: false
      },
      {
        id: 'ntf-3',
        title: 'Clinical Guideline Update',
        message: 'Updated prescribing guidelines for antimicrobial stewardship are now available in the Policy Library.',
        type: 'info',
        date: new Date(2026, 2, 15),
        read: true
      },
      {
        id: 'ntf-4',
        title: 'Urgent: System Security Update',
        message: 'All practitioners must update their multi-factor authentication settings by 31 March 2026.',
        type: 'alert',
        date: new Date(2026, 2, 14),
        read: false
      }
    ];
  }
}
