export interface SSLCertificate {
  isValid: boolean;
  issuer: string;
  expiryDate: Date;
  subject: string;
}

export interface SecurityHeaders {
  csp: string;
  hsts: boolean;
  xFrameOptions: string;
  xssProtection: boolean;
}

export interface SecurityStatus {
  ssl: SSLCertificate;
  headers: SecurityHeaders;
  mixedContent: boolean;
  lastChecked: Date;
}

export interface LegalPageMeta {
  title: string;
  lastUpdated: Date;
  version: string;
}