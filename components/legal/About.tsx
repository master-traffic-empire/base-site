import type { SiteConfig } from "../../types"

interface AboutProps {
  siteConfig: SiteConfig
  contactEmail?: string
  children?: React.ReactNode
}

export function About({
  siteConfig,
  contactEmail = "hello@thicket.sh",
  children,
}: AboutProps) {
  return (
    <div className="legal-page">
      <h1>About {siteConfig.name}</h1>

      <p>
        {siteConfig.name} is a free online tool that provides {siteConfig.description.toLowerCase()}.
      </p>

      {children}

      <h2>Our Mission</h2>
      <p>
        We believe useful tools should be free, fast, and accessible to everyone. {siteConfig.name}{" "}
        is designed to give you quick, accurate results without sign-ups, paywalls, or clutter.
      </p>

      <h2>Part of the Thicket Network</h2>
      <p>
        {siteConfig.name} is part of <strong>Thicket</strong>, a growing network of free utility
        websites covering calculators, converters, and reference tools. Each site in the
        network is focused on doing one thing well.
      </p>

      <h2>Contact Us</h2>
      <p>
        Have feedback, found a bug, or want to suggest a feature? Reach out at{" "}
        <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
      </p>
    </div>
  )
}
