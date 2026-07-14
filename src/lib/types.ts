export type Department = {
  id: string;
  name: string;
  slug: string;
};

export type Course = {
  id: string;
  department_id: string;
  level: 100 | 200 | 300 | 400 | 500;
  code: string;
  title: string;
};

export type MaterialType =
  | "lecture_note"
  | "past_question"
  | "textbook"
  | "slide"
  | "siwes"
  | "project"
  | "other";

export type Material = {
  id: string;
  course_id: string | null;
  department_id: string | null;
  type: MaterialType;
  title: string;
  file_path: string;
  file_size_kb: number | null;
  session: string | null;
  semester: "first" | "second" | null;
  approved: boolean;
  download_count: number;
  created_at: string;
};

export const MATERIAL_TYPE_LABELS: Record<MaterialType, string> = {
  lecture_note: "Lecture Note",
  past_question: "Past Question",
  textbook: "Textbook",
  slide: "Slide",
  siwes: "SIWES",
  project: "Project",
  other: "Other",
};

export type NewsPost = {
  id: string;
  title: string;
  body: string;
  published: boolean;
  created_at: string;
};

export type CalendarCategory = "academic" | "exam" | "registration" | "holiday" | "other";

export type CalendarEvent = {
  id: string;
  title: string;
  description: string | null;
  category: CalendarCategory;
  start_date: string;
  end_date: string | null;
};
