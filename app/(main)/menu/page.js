import MenuHero from "./components/menu-hero";
import BurgerMenuList from "./components/Barger-menu-list";
import ChickenFriesList from "./components/Chicken-fries-list";
import FrenchFryList from "./components/french-fry-list";
import JuiceMenuList from "./components/juice-menu-list";
import PizzaMenuList from "./components/pizza-menu-list";


// URL slug -> component ম্যাপিং
// FoodCategories.jsx এর slug গুলোর সাথে এই key গুলো অবশ্যই মিলতে হবে
const CATEGORY_COMPONENTS = {
  burgers: BurgerMenuList,
  "chicken-fries": ChickenFriesList,
  "french-fries": FrenchFryList,
  "juicy-fresh": JuiceMenuList,
  pizza: PizzaMenuList,
 
};

export default async function MenuPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const category = resolvedSearchParams?.category;
  const ActiveComponent = category ? CATEGORY_COMPONENTS[category] : null;

  return (
    <>
      <MenuHero />

      {ActiveComponent ? (
        // নির্দিষ্ট ক্যাটাগরিতে ক্লিক করলে শুধু সেই component দেখাবে
        <ActiveComponent />
      ) : (
        // কোনো ক্যাটাগরি সিলেক্ট করা না থাকলে (/menu সরাসরি ভিজিট করলে) সব একসাথে দেখাবে
        <>
          <BurgerMenuList />
          <ChickenFriesList />
          <FrenchFryList />
          <JuiceMenuList />
          <PizzaMenuList />
       
        </>
      )}
    </>
  );
}