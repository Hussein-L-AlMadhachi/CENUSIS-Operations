import { BookMarked, UserPlus, CircleUserRound, LayoutGrid } from "lucide-react";

export const sidebar_pages = [
    { label: "المواد الدراسية", link: "/admin/subjects", icon: BookMarked },
    { label: "الطلاب", link: "/admin/students", icon: UserPlus },
    { label: "التدريسيين", link: "/admin/teachers", icon: CircleUserRound },
    { label: "برامج مدمجة", link:"#" , icon:LayoutGrid }
];
