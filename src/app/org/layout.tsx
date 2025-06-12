export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container mx-auto p-8 max-sm:p-0">
      <div className="mb-8 max-sm:mb-0">
        <h1 className="text-3xl max-sm:hidden font-bold mb-2">Organizations</h1>
        {/* <p className="text-muted-foreground">
          Manage your organization's settings and configurations
        </p> */}
      </div>
      {children}
    </div>
  )
}
