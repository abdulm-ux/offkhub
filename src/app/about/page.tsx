export default function AboutPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl sm:text-3xl font-semibold text-paper mb-6">About offkhub</h1>
      <div className="space-y-4 text-paper/70 text-sm leading-relaxed">
        <p>
          offkhub is a student-built digital archive for FUTMinna — course materials,
          past questions, SIWES resources, and project materials, organized by school,
          department, level, and course.
        </p>
        <p>
          The name comes from what FUTMinna students call anywhere outside campus:
          "offk" (off campus). offkhub flips that — everything you used to have to go
          off campus to sort out, sorted here instead.
        </p>
        <p>
          Every upload goes through a moderation queue before it's public, so what you
          find here has been checked, not just dumped.
        </p>
        <p className="text-paper/40 text-xs">
          offkhub is an independent student project and is not officially affiliated
          with or endorsed by the Federal University of Technology, Minna.
        </p>
      </div>
    </div>
  );
}
