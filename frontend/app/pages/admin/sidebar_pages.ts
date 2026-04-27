import { BookMarked, GraduationCap, UserStar, Scale } from "lucide-react";


export const sidebar_pages = [
    { label: "المواد الدراسية", link: "/admin/subjects", icon: BookMarked },
    { label: "الطلاب", link: "/admin/students", icon: GraduationCap },
    { label: "التدريسيين", link: "/admin/teachers", icon: UserStar },
    { label: "أنظمة الدرجات", link: "/admin/grading-systems", icon: Scale },
];
