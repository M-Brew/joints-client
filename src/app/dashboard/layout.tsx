import DashboardNav from "@/components/dashboard/DashboardNav";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <DashboardNav>{children}</DashboardNav>;
}
