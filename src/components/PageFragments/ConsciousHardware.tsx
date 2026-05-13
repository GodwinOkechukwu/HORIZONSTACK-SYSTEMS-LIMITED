"use client";
import { WooCommerce } from "@src/components/lib/woocommerce";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Picture from "../picture/Picture";
import { FormatMoney2 } from "../Reusables/FormatMoney";
import { convertToSlug } from "@constants";

/* ─────────────────────────────────────────────────────────────────────────────
   Skeleton Loader
───────────────────────────────────────────────────────────────────────────── */
export const ConsciousHardwareLoader = () => (
  <section className="w-full py-12 md:py-16" style={{ background: "#F4F4ED" }}>
    <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
      {/* Header skeleton */}
      <div className="flex items-start justify-between mb-10">
        <div className="space-y-2">
          <div
            className="h-7 w-52 rounded"
            style={{ background: "#e0ddd6", animation: "pulse 1.5s infinite" }}
          />
          <div
            className="h-4 w-80 rounded"
            style={{ background: "#e0ddd6", animation: "pulse 1.5s infinite" }}
          />
        </div>
        <div className="h-4 w-28 rounded" style={{ background: "#e0ddd6" }} />
      </div>

      {/* Cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded overflow-hidden"
            style={{ background: "#e8e4dc" }}
          >
            <div className="aspect-[4/3]" style={{ background: "#dedad2" }} />
            <div className="p-4 space-y-2">
              <div
                className="h-3 w-32 rounded"
                style={{ background: "#dedad2" }}
              />
              <div
                className="h-5 w-40 rounded"
                style={{ background: "#dedad2" }}
              />
              <div
                className="h-4 w-20 rounded"
                style={{ background: "#dedad2" }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ─────────────────────────────────────────────────────────────────────────────
   Individual Product Card — light editorial style
───────────────────────────────────────────────────────────────────────────── */
interface CardProps {
  id: string | number;
  image: string;
  name: string;
  price: string;
  tags?: string[]; // e.g. ["RECYCLED ALUMINUM", "MODULAR"]
}

const HardwareCard = ({ id, image, name, price, tags }: CardProps) => {
  const slugDesc = convertToSlug(name);
  const priceNum = parseInt(price);

  return (
    <Link
      href={`/home-item/product/${slugDesc}-${id}`}
      className="group flex flex-col gap-3 transition-transform duration-300 hover:-translate-y-1"
    >
      {/* White image box — image ONLY, no text inside */}
      <div
        className="relative w-full h-64 sm:h-72 md:h-80 overflow-hidden shrink-0"
        style={{ background: "#ffffff" }}
      >
        <Picture
          src={image}
          alt={name}
          className="absolute inset-0 w-full h-full object-contain p-6 transition-transform duration-700 group-hover:scale-105"
        />
      </div>

      {/* Text content — sits on the cream background BELOW the white box */}
      <div className="flex flex-col gap-1 px-1">
        {/* Material tags */}
        {tags && tags.length > 0 && (
          <div className="flex items-center gap-3 flex-wrap">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-[9px] font-semibold tracking-[0.18em] uppercase"
                style={{ color: "#999992" }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Product name */}
        <p
          className="text-base font-semibold leading-snug line-clamp-1 transition-opacity duration-200 group-hover:opacity-60"
          style={{
            color: "#1a1a1a",
            fontFamily: "'Barlow Condensed', 'Arial Narrow', sans-serif",
          }}
        >
          {name}
        </p>

        {/* Price */}
        <span className="text-sm font-medium" style={{ color: "#1a1a1a" }}>
          {priceNum ? <FormatMoney2 value={priceNum} /> : "N/A"}
        </span>
      </div>
    </Link>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   Main Section
───────────────────────────────────────────────────────────────────────────── */
export default function ConsciousHardware() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await WooCommerce.get(
          "products?orderby=date&order=desc&per_page=50",
        );
        setProducts(response?.data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (isLoading) return <ConsciousHardwareLoader />;

  return (
    <section
      className="w-full py-14 md:py-20"
      style={{
        fontFamily: "'Barlow Condensed', 'Arial Narrow', sans-serif",
        background: "#F4F4ED",
      }}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
        {/* ── Section header ── */}
        <div className="flex items-start justify-between mb-10 md:mb-14">
          {/* Left: title + description */}
          <div className="flex flex-col gap-2 max-w-md">
            <h2
              className="text-2xl md:text-3xl font-bold leading-tight"
              style={{
                fontFamily: "'Barlow Condensed', 'Arial Narrow', sans-serif",
              }}
            >
              Conscious Hardware
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: "#888880" }}>
              Carefully refurbished devices, upgraded with bio-based materials
              and modular components for a lifetime of use.
            </p>
          </div>

          {/* Right: view all link */}
          <Link
            href="/category"
            className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.2em] uppercase shrink-0 mt-1 transition-opacity duration-200 hover:opacity-60"
            style={{ color: "#1a1a1a" }}
          >
            View
            <span
              className="inline-block h-px w-6"
              style={{ background: "#1a1a1a" }}
              aria-hidden="true"
            />
            All Products
          </Link>
        </div>

        {/* ── Product grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {products.slice(0, 3).map((product: ProductType) => (
            <HardwareCard
              key={product.id}
              id={product.id}
              image={product.images[0]?.src}
              name={product.name}
              price={product.price}
              tags={
                product.tags?.map((t: { name: string }) => t.name) || [
                  "Recycled",
                  "Modular",
                ]
              }
            />
          ))}
        </div>

        {/* ── Empty state ── */}
        {!products.length && (
          <div className="text-center py-20">
            <p className="text-sm" style={{ color: "#888880" }}>
              No products available at the moment.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
