"use client";

type Props = {
  summary: string;
};

export function SynthesisedSummary({ summary }: Props) {
  if (!summary) return null;

  return (
    <div className="synthesised-summary">
      <div className="synthesised-summary__label">Synthesis</div>
      <p className="synthesised-summary__text">{summary}</p>
    </div>
  );
}
