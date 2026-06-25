import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Instructor Dashboard - Ifybugsy',
  description: 'Manage your teaching, students, and courses',
};

export default function InstructorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
