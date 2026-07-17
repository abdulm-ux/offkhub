export default function ContactPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl sm:text-3xl font-semibold text-paper mb-6">Contact</h1>
      <div className="space-y-4 text-paper/70 text-sm leading-relaxed">
        <p>Questions, copyright concerns, or something not working right — reach out:</p>
        <a
          href="mailto:hello@offkhub.example"
          className="inline-block bg-tape text-blueprint font-semibold px-5 py-2.5 rounded-sm hover:opacity-90"
        >
          hello@offkhub.example
        </a>
        <p className="text-paper/40 text-xs pt-2">
          Replace this with your real contact email before going public.
        </p>
      </div>
    </div>
  );
}
