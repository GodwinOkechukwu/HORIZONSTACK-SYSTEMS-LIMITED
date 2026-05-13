"use client";
import React, { useEffect, useRef, useState } from "react";

import Picture from "../picture/Picture";
import { useCategories, WooCommerce } from "../lib/woocommerce";
import ProductCard from "../Cards/ProductCard";
import HomeCard from "../Cards/HomeCard";
import Carousel from "../Reusables/Carousel";
import Link from "next/link";
import { convertToSlug, convertToSlug2 } from "@constants";
import { useEncryptionHelper } from "../EncryptedData";
import { useDispatch } from "react-redux";
import { updateCategorySlugId } from "../config/features/subCategoryId";
import { useRouter } from "next/navigation";
import HeroCarousel from "../Cards/HeroCarousel";
import Image from "next/image";
import {
  speedImage,
  securityImage,
  supportImage,
  heroBg,
} from "@public/images";

const AllCategorySection = () => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [maxScrollTotal, setMaxScrollTotal] = useState(0);
  const [scrollLeftTotal, setScrollLeftTotal] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const dispatch = useDispatch();
  const router = useRouter();

  // State to hold products by category
  const [categoryProductsMap, setCategoryProductsMap] = useState<{
    [key: string]: ProductType[];
  }>({});
  // WooCommerce API Category
  const {
    data: categories,
    isLoading: categoryWpIsLoading,
    isError: categoryIsError,
  } = useCategories("");

  const Categories: CategoryType[] = categories;
  const TotalCatgory = Categories?.length - 1;

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setIsLoading(true);

        const filteredCategories = categories
          ?.filter((category: CategoryType) => category?.count > 0)
          ?.slice(0, 5);

        if (filteredCategories) {
          const productsPromises = filteredCategories.map(
            async (category: CategoryType) => {
              const response = await WooCommerce.get(
                `products?category=${category?.id}`,
              );

              // Check if there is at least one product in the category
              const firstProductImage =
                response?.data.length > 0
                  ? response?.data[0]?.images[0]?.src
                  : null;

              return {
                categoryId: category?.id,
                firstProductImage: firstProductImage, // Store the first product's image
              };
            },
          );

          const productsResults = await Promise.all(productsPromises);

          // Update the state with the first product images mapped by category
          const productsMap = productsResults.reduce(
            (acc: any, result: any) => ({
              ...acc,
              [result.categoryId]: result.firstProductImage,
            }),
            {},
          );

          setCategoryProductsMap(productsMap);
        }
      } catch (error) {
        console.error("Error fetching category products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (categories?.length) {
      fetchCategoryProducts();
    }
  }, [categories]);

  const handleNext = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      const maxScroll = scrollWidth - clientWidth;
      setScrollLeftTotal(scrollLeft);
      setMaxScrollTotal(maxScroll);

      sliderRef.current.scrollLeft += 600; // Adjust the scroll distance as needed
      setCurrentIndex((prevIndex) =>
        prevIndex < TotalCatgory - 1 ? prevIndex + 1 : prevIndex,
      );
    }
  };

  const handlePrev = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      const maxScroll = scrollWidth - clientWidth;
      setScrollLeftTotal(scrollLeft);
      setMaxScrollTotal(maxScroll);
      // console.log(scrollLeft);
      if (scrollLeft > 0) {
        sliderRef.current.scrollLeft -= 600; // Adjust the scroll distance as needed
        setCurrentIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : prevIndex,
        );
      }
    }
  };

  return (
    <>
      <section
        className="relative overflow-hidden flex items-center min-h-[70dvh] sm:min-h-screen pt-32 md:pt-20"
        style={{
          fontFamily: "'Barlow Condensed', 'Arial Narrow', sans-serif",
          background: "#F4F4ED",
        }}
      >
        {/* ══════════════════════════════════════════════════════════════
      INNER GRID — text left · product right
  ══════════════════════════════════════════════════════════════ */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-8 sm:px-12 md:px-16 lg:px-24 py-16 md:py-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-0 items-center min-h-[70dvh] sm:min-h-screen">
            {/* ── LEFT · Text content ── */}
            <div className="flex flex-col items-start text-left space-y-6 md:pr-10">
              {/* Label */}
              <p
                className="text-[10px] sm:text-[11px] tracking-[0.3em] uppercase font-medium"
                style={{ color: "#888880" }}
              >
                Sustainable Innovation
              </p>

              {/* Headline */}
              <h1
                className="font-bold text-[#1a1a1a] leading-[1.1]
            text-4xl sm:text-5xl md:text-5xl lg:text-6xl"
                style={{
                  fontFamily: "'Barlow Condensed', 'Arial Narrow', sans-serif",
                  letterSpacing: "-0.02em",
                }}
              >
                Discover Timeless
                <br />
                Elegance with
                <br />
                Timezone
              </h1>

              {/* Sub-copy */}
              <p
                className="leading-relaxed max-w-sm text-sm sm:text-[15px]"
                style={{ color: "#666660" }}
              >
                We believe that every second counts. Our carefully curated
                collection of luxury and everyday timepieces offers more than
                just a way to keep time — they reflect your style, precision,
                and craftsmanship.
              </p>

              {/* CTA */}
              <Link
                href="/category"
                className="
            inline-block mt-2
            text-white text-[11px] sm:text-xs font-semibold
            tracking-[0.2em] uppercase
            px-8 py-4
            transition-all duration-200 hover:opacity-90 hover:scale-105
            focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
          "
                style={{ background: "#525F55" }}
              >
                Explore the Collection
              </Link>
            </div>

            {/* ── RIGHT · Product image ── */}
            <div className="relative flex items-center justify-center md:justify-end">
              <div className="relative  h-[300px] w-[300px] md:h-[564px] md:w-[564px]">
                <Picture
                  src={heroBg}
                  alt="Featured product"
                  className="absolute inset-0 w-full h-full object-cover rounded-tl-[460px] rounded-tr-[104px] rounded-bl-[129px] rounded-br-[434px] opacity-90"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Section Styling Idea */}
      {/* <h5 className="max-w-[1350px] mx-auto mt-[50px] pl-2 md:pl-0 text-#181818 font-bold text-[30px] lg:text-[48px]">
        Popular Products
      </h5>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 mx-auto max-w-[1350px] px-2 lg:px-0  mt-6 gap-10">
        {Categories?.slice(0, 5).map((cat) => {
          const productImage = categoryProductsMap[cat?.id];
          return (
            <Link
              key={cat.id}
              href={`/category/${convertToSlug(cat.name)}-${cat.id}`}
              className="group relative h-40 sm:h-48 bg-[#111] rounded-2xl overflow-hidden border border-white/5 hover:border-blue-500/50 transition-all"
            >
              <Picture
                src={cat.image?.src ?? productImage}
                alt={cat.image?.name}
                className="w-full h-full object-contain opacity-60 group-hover:scale-110 transition-transform duration-700"
              />

              <div className="absolute bottom-4 left-4">
                <h3 className="text-sm sm:text-lg font-bold text-white uppercase">
                  {cat.name}
                </h3>
              </div>
            </Link>
          );
        })}
      </div> */}
      {/* </Carousel> */}
    </>
  );
};

export default AllCategorySection;
