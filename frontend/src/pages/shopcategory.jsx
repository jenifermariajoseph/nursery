import PlantsBanner from '../components/PlantsBanner/PlantsBanner'
import React from 'react'
import CategoryCarousel from '../components/CategoryCarousel/CategoryCarousel'
import { succulentsCacti, herbs, tropical, lowLight, veggies } from '../components/assets/plant_category_items'

function ShopCategory({ category }) {
  // Smooth scroll to hash on mount/change (with navbar offset)
  React.useEffect(() => {
    if (category !== 'plants') return
    const hash = window.location.hash?.slice(1)
    if (!hash) return
    const el = document.getElementById(hash)
    if (el) {
      const navOffset = 60 // fixed navbar height
      const top = el.getBoundingClientRect().top + window.scrollY - navOffset
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }, [category])

  return (
    <>
      {category === 'plants' && (
        <>
          <PlantsBanner />
          <CategoryCarousel anchorId="succulents" title="Succulents & Cacti" items={succulentsCacti} />
          <CategoryCarousel anchorId="herbs" title="Herb Garden Starters" items={herbs} />
          <CategoryCarousel anchorId="tropical" title="Tropical Blooms" items={tropical} />
          <CategoryCarousel anchorId="veggies" title="Edible Vegetables" items={veggies} />
          <CategoryCarousel anchorId="lowlight" title="Low-Light Houseplants" items={lowLight} />
        </>
      )}
    </>
  )
}

export default ShopCategory