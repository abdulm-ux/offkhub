export default function DmcaPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl sm:text-3xl font-semibold text-paper mb-2">DMCA / Copyright</h1>
      <p className="text-paper/40 text-xs mb-6">Starting draft — adjust the contact method before going public.</p>
      <div className="space-y-4 text-paper/70 text-sm leading-relaxed">
        <p>
          offkhub is meant for lecture notes, past questions, and student-authored
          materials shared for study purposes. If something on this site infringes
          your copyright, contact us with:
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>The specific material and its URL</li>
          <li>Why you believe it infringes your rights</li>
          <li>Your contact information</li>
        </ul>
        <p>
          We'll review and remove infringing material promptly. See the{" "}
          <a href="/contact" className="text-tape underline">Contact page</a> to reach us.
        </p>
      </div>
    </div>
  );
}
