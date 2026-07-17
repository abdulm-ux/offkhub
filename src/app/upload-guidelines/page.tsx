export default function UploadGuidelinesPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl sm:text-3xl font-semibold text-paper mb-6">Upload Guidelines</h1>
      <div className="space-y-4 text-paper/70 text-sm leading-relaxed">
        <p>Before you upload, a few things that keep the archive useful:</p>
        <ul className="list-disc list-inside space-y-2">
          <li>Attach the correct course code — mislabeled uploads get rejected.</li>
          <li>One document per upload. Don't bundle multiple courses into one file.</li>
          <li>PDF is preferred; Word/PowerPoint is fine if that's the original format.</li>
          <li>No personal information (names, matric numbers, scores) visible in scanned scripts.</li>
          <li>Everything goes through moderation before it's public — expect a short delay.</li>
        </ul>
        <p>
          Ready? Head to <a href="/upload" className="text-tape underline">/upload</a>.
        </p>
      </div>
    </div>
  );
}
