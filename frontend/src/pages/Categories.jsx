
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    name: "Clothing",
    subtitle: "Explore your everyday style",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Shoes",
    subtitle: "Find your perfect pair",
    image:
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Accessories",
    subtitle: "Complete your look",
    image:
      "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=700&q=80",
  },
];

function Categories() {
  return (
    <main className="min-h-screen bg-[#FBF6F0] px-5 py-12 text-[#3B2431] sm:px-8 sm:py-16">
      <div className="mx-auto max-w-7xl">
        <p className="text-xs font-semibold uppercase tracking-[2px] text-[#A8556A]">
          EXPLORE PASHMI
        </p>

        <h1 className="mt-3 font-serif text-4xl sm:text-5xl">
          Our Categories
        </h1>

        <p className="mt-4 max-w-lg text-sm leading-7 text-[#6E5660] sm:text-base">
          Discover fashion that matches your style, from everyday
          clothing to shoes and beautiful accessories.
        </p>

        <div className="mt-9 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={`/shop?category=${category.name}`}
              className="group relative overflow-hidden rounded-3xl"
            >
              <img
                src={category.image}
                alt={category.name}
                className="h-[340px] w-full object-cover transition duration-500 group-hover:scale-105 sm:h-[400px]"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#3B2431]/80 via-transparent to-transparent" />

              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6 text-white">
                <div>
                  <h2 className="font-serif text-3xl">
                    {category.name}
                  </h2>
                  <p className="mt-2 text-sm text-white/85">
                    {category.subtitle}
                  </p>
                </div>

                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#A8556A] transition group-hover:bg-[#A8556A] group-hover:text-white">
                  <ArrowRight size={20} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

export default Categories;
