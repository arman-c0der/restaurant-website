"use client";

import { useEffect, useState } from "react";
import { MenuCard } from "../../components/MenuCard";
import { getProductsByCategory } from "../../../actions/getProducts";

export default function JuceMenuList() {
  const [juices, setJuices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const data = await getProductsByCategory("juicy-fresh");
      setJuices(data);
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <section className="w-full bg-[#F2F1EC]">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
        <div className="flex items-center gap-2 text-xs font-medium text-black/60">
          <span className="h-1.5 w-1.5 rounded-full bg-black" />
          <span>From our kitchen to your plate</span>
        </div>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-black sm:text-4xl">
          Fresh Juices
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-3xl border border-gray-200 overflow-hidden"
              >
                <div className="aspect-square w-full bg-gray-200" />
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))
          ) : (
            juices.map((item) => (
              <MenuCard key={item._id} item={item} />
            ))
          )}
        </div>
      </div>
    </section>
  );
}