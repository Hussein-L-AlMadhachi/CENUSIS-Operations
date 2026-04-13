import { BookMarked, UserPlus, CircleUserRound, LayoutGrid, Scale } from "lucide-react";

export const sidebar_pages = [
    { label: "المواد الدراسية", link: "/admin/subjects", icon: BookMarked },
    { label: "الطلاب", link: "/admin/students", icon: UserPlus },
    { label: "التدريسيين", link: "/admin/teachers", icon: CircleUserRound },
    { label: "أنظمة الدرجات", link: "/admin/grading-systems", icon: Scale },
    { label: "برامج مدمجة", link:"#" , icon:LayoutGrid }
];
