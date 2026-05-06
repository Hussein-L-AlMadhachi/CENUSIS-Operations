import { BookMarked, GraduationCap, UserStar, Scale, FlaskConical } from "lucide-react";


export const sidebar_pages = [
    { label: "المواد الدراسية", link: "/superadmin/subjects", icon: BookMarked },
    { label: "مواد المختبر", link: "/superadmin/lab/subjects", icon: FlaskConical },
    { label: "الطلاب", link: "/superadmin/students", icon: GraduationCap },
    { label: "التدريسيين", link: "/superadmin/teachers", icon: UserStar },
    { label: "أنظمة الدرجات", link: "/superadmin/grading-systems", icon: Scale },
];
