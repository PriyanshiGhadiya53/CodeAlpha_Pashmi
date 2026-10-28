
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Sparkles,
  Truck,
  ShieldCheck,
  Headset,
} from "lucide-react";

const categories = [
  {
    name: "Clothing",
    subtitle: "Everyday elegance",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=700&q=80",
    link: "/shop?category=Clothing",
  },
  {
    name: "Shoes",
    subtitle: "Step into style",
    image:
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=700&q=80",
    link: "/shop?category=Shoes",
  },
  {
    name: "Accessories",
    subtitle: "The finishing touch",
    image:
      "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=700&q=80",
    link: "/shop?category=Accessories",
  },
];

const benefits = [
  {
    icon: Truck,
    title: "Easy Delivery",
    text: "Convenient delivery to your doorstep",
  },
  {
    icon: ShieldCheck,
    title: "Secure Orders",
    text: "Your order details stay protected",
  },
  {
    icon: Headset,
    title: "Here to Help",
    text: "We're here when you need us",
  },
];

export default function Home() {
  return (
    <main className="overflow-hidden bg-[#FBF6F0] text-[#3B2431]">
      {/* Hero Section */}
      <section className="mx-auto grid max-w-[1440px] items-center gap-8 px-5 py-10 sm:px-8 md:grid-cols-2 md:gap-10 md:px-12 md:py-16 lg:px-20 lg:py-20">
        <div className="order-2 md:order-1">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#EFD5D0] px-4 py-2 text-xs font-medium tracking-wide text-[#A8556A] sm:text-sm">
            <Sparkles size={15} />
            YOUR STYLE, YOUR STORY
          </span>

          <h1 className="mt-6 max-w-xl font-serif text-4xl leading-tight sm:text-5xl md:text-5xl lg:text-7xl">
            Discover Your
            <span className="mt-1 block italic text-[#A8556A]">
              Own Grace.
            </span>
          </h1>

          <p className="mt-5 max-w-md text-sm leading-7 text-[#6E5660] sm:text-base sm:leading-8">
            Explore thoughtfully selected fashion that makes every
            moment feel special. Find the pieces that feel like you.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-4">
            <Link
              to="/shop"
              className="inline-flex items-center justify-center gap-3 rounded-full bg-[#A8556A] px-6 py-3.5 text-sm font-medium text-white transition hover:bg-[#8F4056] sm:px-8"
            >
              Explore Collection
              <ArrowRight size={18} />
            </Link>

            <a
              href="#categories"
              className="text-sm font-medium text-[#3B2431] underline decoration-[#C9A24B] underline-offset-8 transition hover:text-[#A8556A]"
            >
              Browse Categories
            </a>
          </div>

          <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-xs text-[#6E5660] sm:gap-x-8">
            <span>✦ Thoughtful Style</span>
            <span>✦ Everyday Comfort</span>
          </div>
        </div>

        <div className="order-1 md:order-2">
          <div className="relative mx-auto max-w-lg">
            <div className="absolute -right-3 -top-3 h-24 w-24 rounded-full bg-[#EFD5D0] sm:-right-5 sm:-top-5 sm:h-32 sm:w-32" />

            <img
              src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=85"
              alt="Elegant fashion collection from Pashmi"
              className="relative z-10 h-[300px] w-full rounded-t-[150px] rounded-b-2xl object-cover shadow-lg sm:h-[420px] md:h-[450px] lg:h-[540px]"
            />

            <div className="absolute -bottom-4 -left-3 z-20 rounded-2xl border border-[#EFD5D0] bg-white/95 p-4 shadow-md sm:-left-6 sm:p-5">
              <p className="font-serif text-lg text-[#3B2431] sm:text-xl">
                Wear Your Grace
              </p>
              <p className="mt-1 text-xs text-[#A8556A]">
                A little elegance, every day.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="bg-white/60 px-5 py-14 sm:px-8 md:px-12 md:py-20">
        <div className="mx-auto max-w-[1280px]">
          <div className="mb-8 flex items-end justify-between gap-4 sm:mb-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[2px] text-[#A8556A]">
                FIND YOUR FAVOURITE
              </p>
              <h2 className="mt-3 font-serif text-3xl sm:text-4xl md:text-5xl">
                Shop by Category
              </h2>
            </div>

            <Link
              to="/shop"
              className="mb-1 inline-flex shrink-0 items-center gap-2 text-sm font-medium text-[#A8556A] hover:underline"
            >
              View all <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 md:gap-6">
            {categories.map((category) => (
              <Link
                to={category.link}
                key={category.name}
                className="group relative overflow-hidden rounded-2xl bg-[#EFD5D0]"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  loading="lazy"
                  className="h-[300px] w-full object-cover transition duration-500 group-hover:scale-105 sm:h-[340px] md:h-[360px]"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#3B2431]/80 via-transparent to-transparent" />

                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5 text-white sm:p-6">
                  <div>
                    <h3 className="font-serif text-2xl sm:text-3xl">
                      {category.name}
                    </h3>
                    <p className="mt-1 text-sm text-white/85">
                      {category.subtitle}
                    </p>
                  </div>

                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#A8556A] transition group-hover:bg-[#A8556A] group-hover:text-white">
                    <ArrowRight size={19} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Placeholder */}
      <section className="px-5 py-14 sm:px-8 md:px-12 md:py-20">
        <div className="mx-auto max-w-[1280px] rounded-3xl bg-[#EFD5D0]/60 px-5 py-10 text-center sm:px-10 sm:py-14">
          <p className="text-xs font-semibold uppercase tracking-[2px] text-[#A8556A]">
            HANDPICKED FOR YOU
          </p>

          <h2 className="mt-3 font-serif text-3xl sm:text-4xl md:text-5xl">
            Find Your Next Favourite
          </h2>

          <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-[#6E5660] sm:text-base">
            Discover pieces that match your style and make every day
            a little more special.
          </p>

          <Link
            to="/shop"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#A8556A] px-7 py-3.5 text-sm font-medium text-white transition hover:bg-[#8F4056]"
          >
            Explore All Products <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      {/* Benefits */}
      <section className="border-t border-[#EFD5D0] bg-white/50 px-5 py-10 sm:px-8 md:px-12 md:py-14">
        <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-5">
          {benefits.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="flex items-center justify-center gap-4 sm:flex-col sm:text-center md:flex-row md:text-left"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#EFD5D0] text-[#A8556A]">
                <Icon size={23} />
              </div>

              <div>
                <h3 className="font-medium">{title}</h3>
                <p className="mt-1 text-sm leading-6 text-[#6E5660]">
                  {text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
