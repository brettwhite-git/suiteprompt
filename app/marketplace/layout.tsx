import { MarketplaceLayout } from "@/components/marketplace/MarketplaceLayout"

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return <MarketplaceLayout>{children}</MarketplaceLayout>
}

