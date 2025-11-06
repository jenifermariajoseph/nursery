import TypewriterSection from '../components/Typewriter/TypewriterSection'
import FinalCTASection from '../components/FinalCTA/FinalCTASection'
import StickySlider from '../components/StickySlider/StickySlider'
import Item from '../components/items/item'
import plant_collections from '../components/assets/plant_collections'
import './home.css'
import ModelSection from '../components/ModelViewer/ModelSection'
function Home() {
    return (
        <>
            <div>
                {/* no paddingTop here so the slider sits under the fixed navbar */}
                <StickySlider />
                {/* Popular section */}
                <section className="popular-section">
                    <h2 className="popular-heading">Popular</h2>
                    <div className="popular-grid">
                        {plant_collections.slice(0, 4).map((p) => (
                            <Item
                                key={p.id}
                                id={p.id}
                                image={p.image}
                                name={p.name}
                                new_price={p.new_price}
                                old_price={p.old_price}
                            />
                        ))}
                    </div>
                </section>
                {/* 3D model section */}
                <ModelSection />
            </div>
            {/* New: Typewriter benefit section */}
            <TypewriterSection />
            {/* Final CTA section */}
            <FinalCTASection />
        </>
    )
}
export default Home