"use client";

import { useEffect, useState } from "react";
import { MenuCard } from "../../components/MenuCard";
import { getProductsByCategory } from "../../../actions/getProducts";

export default function FrenchFryMenu() {
  const [frenchFries, setFrenchFries] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const data = await getProductsByCategory("French-fries");
      setFrenchFries(data);
    }
    fetchData();
  }, []);

  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
        <div className="flex items-center gap-2 text-xs font-medium text-black/60">
          <span className="h-1.5 w-1.5 rounded-full bg-black" />
          <span>From our kitchen to your plate</span>
        </div>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-black sm:text-4xl">
          Classic French Fries
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {frenchFries.map((item) => (
            <MenuCard key={item._id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}