interface SectionProps {
    children: React.ReactNode;
    className?: string;
}



export function Section({ children, className = '' }: SectionProps) {
    return (
        <section className={`pb-12 md:pb-16 lg:pb-20 ${className}`}>
        {children}
        </section>
    );
}



export function Subsection({ children, className = '' }: SectionProps) {
    return (
        <div className={`pb-6 md:pb-8 lg:pb-10 ${className}`}>
        {children}
        </div>
    );
}
