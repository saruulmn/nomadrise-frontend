import Hero from './components/Hero';
import Content from './components/Content';
import Team from './components/Team';
import PopularCategories from './components/PopularCategories';

export default function Home() {
  console.log('PopularCategories:', PopularCategories);
  
  return (
    <div className="font-sans">
      <main>
        <Hero />
        <Content dictionary={{
          about: {
            title: "About Us",
            vision: { title: "Our vision", text: "To build a better platform for remote work" },
            challenge: { title: "The challenge", text: "Connecting talent with opportunities globally" },
            solution: { title: "Our solution", text: "A curated marketplace and tools for remote hiring" },
            cta: "Learn more"
          }
        }} />
        <Team dictionary={{ team: { title: "Our Team", subtitle: "Meet our team" } }} />
        <PopularCategories dictionary={{ categories: { title: "Popular Categories", exploreMore: "Explore more", byField: "By field", byType: "By type", byCountry: "By country", byEmployer: "By employer" } }} />
      </main>
    </div>
  );
}
