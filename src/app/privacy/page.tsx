export default function PrivacyPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl sm:text-3xl font-semibold text-paper mb-2">Privacy Policy</h1>
      <p className="text-paper/40 text-xs mb-6">
        This is a starting draft — review it (or have a legal-minded friend review it)
        before treating it as your real policy.
      </p>
      <div className="space-y-4 text-paper/70 text-sm leading-relaxed">
        <p>
          <strong className="text-paper">What we collect:</strong> if you sign in to
          upload materials, we store your name and email (via Google sign-in) and a
          record of what you've uploaded.
        </p>
        <p>
          <strong className="text-paper">What we don't do:</strong> we don't sell your
          data, and we don't share it with advertisers. There are no ads on this site.
        </p>
        <p>
          <strong className="text-paper">Files you upload:</strong> become publicly
          downloadable once approved. Don't upload anything you don't want public.
        </p>
        <p>
          <strong className="text-paper">Download counts:</strong> are tracked per
          material to power the Trending page — not tied to individual visitors.
        </p>
      </div>
    </div>
  );
}
