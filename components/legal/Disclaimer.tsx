type DisclaimerType = "financial" | "health" | "general"

interface DisclaimerProps {
  type: DisclaimerType
  className?: string
}

const disclaimers: Record<DisclaimerType, { title: string; text: string }> = {
  financial: {
    title: "Financial Disclaimer",
    text: "The information provided on this site is for informational and educational purposes only and does not constitute financial, investment, tax, or legal advice. Always consult a qualified financial advisor before making financial decisions. We are not responsible for any losses or damages arising from the use of this information.",
  },
  health: {
    title: "Health Disclaimer",
    text: "The information provided on this site is for informational and educational purposes only and does not constitute medical advice. Always consult a qualified healthcare provider before making health-related decisions. We are not responsible for any health outcomes resulting from the use of this information.",
  },
  general: {
    title: "Disclaimer",
    text: "The information provided on this site is for informational and educational purposes only. While we strive for accuracy, we make no guarantees about the completeness or reliability of the content. Use this information at your own risk.",
  },
}

export function Disclaimer({ type, className }: DisclaimerProps) {
  const { title, text } = disclaimers[type]

  return (
    <aside
      className={className}
      role="note"
      style={{
        padding: "1rem",
        marginTop: "2rem",
        borderRadius: "8px",
        background: "var(--color-surface, #f9fafb)",
        border: "1px solid var(--color-border, #e5e7eb)",
        fontSize: "0.8125rem",
        color: "var(--color-text-muted, #666)",
        lineHeight: 1.6,
      }}
    >
      <strong>{title}:</strong> {text}
    </aside>
  )
}
