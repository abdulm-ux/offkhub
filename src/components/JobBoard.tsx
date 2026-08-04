import { Briefcase, MapPin, ExternalLink } from "lucide-react";

export default function JobBoard() {
  const jobs = [
    { title: "Graduate Trainee", company: "Mainland Engineering", type: "Full-time", location: "Lagos" },
    { title: "SIWES Placement", company: "TechHub Minna", type: "Internship", location: "Minna" },
    { title: "NYSC Internship", company: "Standard Bank", type: "Internship", location: "Abuja" },
    { title: "Remote Web Dev", company: "Global Solutions", type: "Part-time", location: "Remote" },
  ];

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-lg font-semibold text-paper flex items-center gap-2">
          <Briefcase size={18} className="text-tape" />
          Jobs & Internships
        </h2>
        <a href="#" className="text-tape text-xs hover:underline">View all opportunities</a>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {jobs.map((job, i) => (
          <div key={i} className="bg-blueprint-light/30 border border-blueprint-line/40 rounded-sm p-4 flex items-center justify-between group hover:border-tape transition-colors">
            <div>
              <div className="font-display font-semibold text-paper text-sm">{job.title}</div>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-[10px] text-paper/60 uppercase tracking-tight">{job.company}</span>
                <span className="flex items-center gap-1 text-[10px] text-paper/40">
                  <MapPin size={10} /> {job.location}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="text-[9px] bg-blueprint-line/40 text-paper/70 px-1.5 py-0.5 rounded-sm uppercase tracking-tighter">
                {job.type}
              </span>
              <ExternalLink size={12} className="text-paper/20 group-hover:text-tape transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
