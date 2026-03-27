import type { SiteConfig } from "../../types"

interface PrivacyPolicyProps {
  siteConfig: SiteConfig
  lastUpdated?: string
  contactEmail?: string
}

export function PrivacyPolicy({
  siteConfig,
  lastUpdated = "2026-03-27",
  contactEmail = "privacy@thicket.sh",
}: PrivacyPolicyProps) {
  return (
    <div className="legal-page">
      <h1>Privacy Policy</h1>
      <p className="legal-updated">Last updated: {lastUpdated}</p>

      <p>
        This Privacy Policy describes how {siteConfig.name} (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;)
        collects, uses, and shares information when you visit{" "}
        <a href={siteConfig.baseUrl}>{siteConfig.domain}</a> (the &ldquo;Site&rdquo;).
      </p>

      <h2>Information We Collect</h2>

      <h3>Analytics Data</h3>
      <p>
        We use Google Analytics 4 (measurement ID: {siteConfig.gaMeasurementId}) to collect
        anonymized usage data, including:
      </p>
      <ul>
        <li>Pages visited and time spent on each page</li>
        <li>Referral source (how you found us)</li>
        <li>Device type, browser, and operating system</li>
        <li>Approximate geographic location (country/city level)</li>
        <li>Interactions with site features</li>
      </ul>
      <p>
        Google Analytics uses cookies to distinguish unique users. You can opt out of
        analytics tracking via the cookie consent banner or by using the{" "}
        <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">
          Google Analytics Opt-out Browser Add-on
        </a>.
      </p>

      <h3>Local Storage</h3>
      <p>
        We use your browser&apos;s localStorage to save your preferences (such as dark mode,
        recently used tools, and cookie consent choice). This data never leaves your device.
      </p>

      <h2>Cookies</h2>
      <table className="legal-table">
        <thead>
          <tr>
            <th>Cookie</th>
            <th>Provider</th>
            <th>Purpose</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>_ga</td>
            <td>Google Analytics</td>
            <td>Distinguishes unique users</td>
            <td>2 years</td>
          </tr>
          <tr>
            <td>_ga_*</td>
            <td>Google Analytics</td>
            <td>Maintains session state</td>
            <td>2 years</td>
          </tr>
        </tbody>
      </table>

      <h2>How We Use Your Information</h2>
      <ul>
        <li>To understand how visitors use our Site and improve its content</li>
        <li>To monitor site performance and fix issues</li>
        <li>To inform decisions about new features and tools</li>
      </ul>

      <h2>Third-Party Services</h2>
      <p>
        We share anonymized analytics data with Google through Google Analytics.
        Google&apos;s privacy policy is available at{" "}
        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
          policies.google.com/privacy
        </a>.
      </p>

      <h2>Your Rights (GDPR / CCPA)</h2>
      <p>You have the right to:</p>
      <ul>
        <li><strong>Access</strong> &mdash; Request a copy of the data we hold about you</li>
        <li><strong>Deletion</strong> &mdash; Request that we delete your data</li>
        <li><strong>Portability</strong> &mdash; Receive your data in a machine-readable format</li>
        <li><strong>Objection</strong> &mdash; Object to data processing at any time</li>
        <li><strong>Withdraw consent</strong> &mdash; Withdraw cookie consent via the banner or by clearing your browser cookies</li>
      </ul>
      <p>
        To exercise any of these rights, contact us at{" "}
        <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
      </p>

      <h2>Data Retention</h2>
      <p>
        Google Analytics data is retained for 14 months, after which it is automatically deleted.
        localStorage data persists until you clear your browser data.
      </p>

      <h2>Children&apos;s Privacy</h2>
      <p>
        Our Site is not directed at children under 13. We do not knowingly collect personal
        information from children.
      </p>

      <h2>Changes to This Policy</h2>
      <p>
        We may update this policy from time to time. Changes will be posted on this page
        with an updated revision date.
      </p>

      <h2>Contact Us</h2>
      <p>
        If you have questions about this Privacy Policy, contact us at{" "}
        <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
      </p>
    </div>
  )
}
