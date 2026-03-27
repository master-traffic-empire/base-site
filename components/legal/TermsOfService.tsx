import type { SiteConfig } from "../../types"

interface TermsOfServiceProps {
  siteConfig: SiteConfig
  lastUpdated?: string
  contactEmail?: string
}

export function TermsOfService({
  siteConfig,
  lastUpdated = "2026-03-27",
  contactEmail = "legal@thicket.sh",
}: TermsOfServiceProps) {
  return (
    <div className="legal-page">
      <h1>Terms of Service</h1>
      <p className="legal-updated">Last updated: {lastUpdated}</p>

      <p>
        By accessing and using {siteConfig.name} at{" "}
        <a href={siteConfig.baseUrl}>{siteConfig.domain}</a> (the &ldquo;Site&rdquo;),
        you agree to these Terms of Service (&ldquo;Terms&rdquo;). If you do not agree,
        please do not use the Site.
      </p>

      <h2>Use of the Site</h2>
      <p>
        This Site provides tools, calculators, and informational content for general
        reference purposes only. You may use the Site for lawful, personal, non-commercial
        purposes.
      </p>

      <h2>No Warranties</h2>
      <p>
        The Site and its content are provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo;
        without warranties of any kind, either express or implied, including but not limited to
        implied warranties of merchantability, fitness for a particular purpose, and
        non-infringement.
      </p>
      <p>
        We do not warrant that:
      </p>
      <ul>
        <li>Calculations, conversions, or data will be accurate or error-free</li>
        <li>The Site will be available uninterrupted or free of errors</li>
        <li>Results obtained from the Site will be reliable</li>
      </ul>

      <h2>Limitation of Liability</h2>
      <p>
        To the fullest extent permitted by law, {siteConfig.name} and its operators shall not
        be liable for any indirect, incidental, special, consequential, or punitive damages,
        or any loss of profits or revenues, whether incurred directly or indirectly, or any
        loss of data, use, goodwill, or other intangible losses resulting from:
      </p>
      <ul>
        <li>Your use of or inability to use the Site</li>
        <li>Any errors or inaccuracies in content, calculations, or data</li>
        <li>Any decisions made based on information provided by the Site</li>
      </ul>

      <h2>Use at Your Own Risk</h2>
      <p>
        You acknowledge that any reliance on information, tools, or calculations provided by
        this Site is at your own risk. Always verify important calculations independently and
        consult qualified professionals where appropriate.
      </p>

      <h2>Intellectual Property</h2>
      <p>
        All content, design, and code on this Site are the property of {siteConfig.name} or
        its licensors and are protected by copyright and other intellectual property laws.
      </p>

      <h2>Changes to Terms</h2>
      <p>
        We reserve the right to modify these Terms at any time. Continued use of the Site
        after changes constitutes acceptance of the updated Terms.
      </p>

      <h2>Governing Law</h2>
      <p>
        These Terms shall be governed by and construed in accordance with applicable law,
        without regard to conflict of law principles.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these Terms? Contact us at{" "}
        <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
      </p>
    </div>
  )
}
