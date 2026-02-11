import { Header } from '@/components/header'
import { Hero } from '@/components/hero'
import { CategoriesSection } from '@/components/categories-section'
import { ProductsSection } from '@/components/products-section'
import { AllProductsSection } from '@/components/all-products-section'
import { FeaturesSection } from '@/components/features-section'
import { NewsletterSection } from '@/components/newsletter-section'
import { Footer } from '@/components/footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero />
      <CategoriesSection />
      <ProductsSection />
      <AllProductsSection />
      <FeaturesSection />
      <NewsletterSection />
      <Footer />
    </main>
  )
}
