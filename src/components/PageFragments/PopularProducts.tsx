// /**
//  * PopularProducts.tsx
//  * ─────────────────────────────────────────────────────────────────────────────
//  * Displays a paginated grid of popular products fetched from WooCommerce.
//  *
//  * Popularity logic:
//  *   Primary query  → `orderby=popularity`  (WooCommerce sorts by total_sales)
//  *   Fallback query → `orderby=rating`      (used if popularity returns empty)
//  *
//  * WooCommerce product fields consumed:
//  *   • product.id
//  *   • product.name
//  *   • product.images[0].src
//  *   • product.price             → newAmount
//  *   • product.regular_price     → oldAmount  (shows strike-through when set)
//  *   • product.categories[0].name → category  label on card
//  *   • product.average_rating    → rating     star score on card
//  *   • product.rating_count      → ratingCount review count on card
//  * ─────────────────────────────────────────────────────────────────────────────
//  */

// "use client";

// import React, { useEffect, useState, useCallback } from "react";
// import { WooCommerce } from "@src/components/lib/woocommerce";
// import NewArrivalCard from "../Cards/NewArrivalCard";
// import PopularProductCard from "../Cards/PopularProductCard";

// /* ─────────────────────────────────────────────────────────────────────────────
//    Constants
// ───────────────────────────────────────────────────────────────────────────── */

// /** How many products to load per page. */
// const PAGE_SIZE = 6;

// /* ─────────────────────────────────────────────────────────────────────────────
//    Skeleton Loader
//    Mirrors the card proportions so the layout does not shift when data arrives.
// ───────────────────────────────────────────────────────────────────────────── */
// export const PopularProductsLoader = () => (
//   <div className="w-full py-12 md:py-16">
//     <div className="max-w-[1400px] mx-auto px-4 md:px-6">
//       {/* Section heading skeleton */}
//       <div className="flex items-center justify-between mb-8 md:mb-12">
//         <div className="space-y-2">
//           <div className="h-8 bg-gray-200 animate-pulse rounded-lg w-56 md:w-72" />
//           <div className="h-4 bg-gray-200 animate-pulse rounded-lg w-36 md:w-52" />
//         </div>
//         <div className="h-6 w-24 bg-gray-200 animate-pulse rounded" />
//       </div>

//       {/* Card skeletons — identical column layout to the real grid */}
//       <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 lg:gap-5">
//         {Array.from({ length: PAGE_SIZE }).map((_, i) => (
//           <div
//             key={i}
//             className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100"
//           >
//             {/* Image placeholder */}
//             <div className="w-full h-[180px] bg-gray-100 animate-pulse" />

//             {/* Text placeholders */}
//             <div className="p-4 space-y-2.5">
//               <div className="h-3 bg-gray-200 animate-pulse rounded w-1/3" />
//               <div className="h-4 bg-gray-200 animate-pulse rounded w-full" />
//               <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4" />
//               <div className="h-3 bg-gray-200 animate-pulse rounded w-1/4 mt-1" />

//               {/* Price + button placeholder */}
//               <div className="flex items-center justify-between pt-1">
//                 <div className="h-5 bg-gray-200 animate-pulse rounded w-1/3" />
//                 <div className="h-8 w-16 bg-gray-200 animate-pulse rounded-lg" />
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   </div>
// );

// /* ─────────────────────────────────────────────────────────────────────────────
//    Empty State
// ───────────────────────────────────────────────────────────────────────────── */
// const EmptyState = () => (
//   <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
//     {/* Simple icon */}
//     <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-2">
//       <svg
//         className="w-8 h-8 text-gray-400"
//         fill="none"
//         viewBox="0 0 24 24"
//         stroke="currentColor"
//       >
//         <path
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           strokeWidth={1.5}
//           d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0H4"
//         />
//       </svg>
//     </div>
//     <p className="text-gray-700 font-semibold text-lg">
//       No popular products yet
//     </p>
//     <p className="text-gray-400 text-sm max-w-xs">
//       Check back soon — trending items will appear here once sales data is
//       available.
//     </p>
//   </div>
// );

// /* ─────────────────────────────────────────────────────────────────────────────
//    Main Component
// ───────────────────────────────────────────────────────────────────────────── */
// export default function PopularProducts() {
//   const [products, setProducts] = useState<ProductType[]>([]);
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const [hasError, setHasError] = useState<boolean>(false);
//   const [page, setPage] = useState<number>(1);
//   const [hasMore, setHasMore] = useState<boolean>(true);
//   const [isFetchingMore, setIsFetchingMore] = useState<boolean>(false);

//   /* ── Fetch helpers ─────────────────────────────────────────────────────── */

//   /**
//    * Builds the WooCommerce query string.
//    * Tries `orderby=popularity` first; the caller falls back to `orderby=rating`
//    * if the primary response returns an empty array.
//    */
//   const buildQuery = (orderby: "popularity" | "rating", pageNum: number) =>
//     `products?orderby=${orderby}&order=desc&per_page=${PAGE_SIZE}&page=${pageNum}&status=publish`;

//   /**
//    * Fetches one page of products.
//    * Returns the data array or throws so the caller can handle errors.
//    */
//   const fetchPage = async (
//     orderby: "popularity" | "rating",
//     pageNum: number,
//   ): Promise<ProductType[]> => {
//     const res = await WooCommerce.get(buildQuery(orderby, pageNum));
//     return res?.data || [];
//   };

//   /* ── Initial load ──────────────────────────────────────────────────────── */
//   useEffect(() => {
//     const loadInitial = async () => {
//       try {
//         setIsLoading(true);
//         setHasError(false);

//         /* Primary: sort by WooCommerce sales data */
//         let data = await fetchPage("popularity", 1);

//         /* Fallback: if no popularity data exists, sort by average rating */
//         if (!data.length) {
//           data = await fetchPage("rating", 1);
//         }

//         setProducts(data);

//         /* If fewer results than PAGE_SIZE came back, there are no more pages */
//         setHasMore(data.length === PAGE_SIZE);
//       } catch (err) {
//         console.error("[PopularProducts] initial fetch failed:", err);
//         setHasError(true);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     loadInitial();
//   }, []);

//   /* ── Load more (pagination) ────────────────────────────────────────────── */
//   const loadMore = useCallback(async () => {
//     if (isFetchingMore || !hasMore) return;

//     try {
//       setIsFetchingMore(true);
//       const nextPage = page + 1;
//       const data = await fetchPage("popularity", nextPage);

//       setProducts((prev) => [...prev, ...data]);
//       setPage(nextPage);
//       setHasMore(data.length === PAGE_SIZE);
//     } catch (err) {
//       console.error("[PopularProducts] load-more fetch failed:", err);
//     } finally {
//       setIsFetchingMore(false);
//     }
//   }, [page, isFetchingMore, hasMore]);

//   /* ── Render: loading ───────────────────────────────────────────────────── */
//   if (isLoading) {
//     return (
//       <div className="min-h-screen pt-24">
//         <PopularProductsLoader />
//       </div>
//     );
//   }

//   /* ── Render: error ─────────────────────────────────────────────────────── */
//   if (hasError) {
//     return (
//       <div className="min-h-screen pt-24 flex items-center justify-center">
//         <div className="text-center space-y-3">
//           <p className="text-gray-700 font-semibold text-lg">
//             Something went wrong
//           </p>
//           <p className="text-gray-400 text-sm">
//             We couldn&apos;t load popular products. Please try again later.
//           </p>
//           <button
//             onClick={() => window.location.reload()}
//             className="mt-2 px-5 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 transition-colors"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   /* ── Render: main ──────────────────────────────────────────────────────── */
//   return (
//     <div className="min-h-screen bg-[#121414] ">
//       <div className="max-w-[1400px] mx-auto px-4  md:px-6 lg:px-8 py-8 md:py-12">
//         {/* ── Page Header ─────────────────────────────────────────────── */}
//         <div className="mb-4 md:mb-6">
//           <h1
//             style={{
//               fontFamily: "'Barlow Condensed', 'Arial Narrow', sans-serif",
//             }}
//             className="uppercase font-semibold text-3xl md:text-4xl lg:text-5xl text-[#E3E2E2] mb-3"
//           >
//             All Products
//           </h1>
//           {/* <p className="text-base md:text-lg text-gray-500">
//             {products.length > 0
//               ? `Trending right now — ${products.length} item${products.length !== 1 ? "s" : ""}`
//               : "Trending products will appear here"}
//           </p> */}
//         </div>

//         {/* ── Products Grid ───────────────────────────────────────────── */}
//         {products.length > 0 ? (
//           <>
//             <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 lg:gap-5">
//               {products.map((product: ProductType) => (
//                 <PopularProductCard
//                   key={product.id}
//                   id={product.id}
//                   image={product.images?.[0]?.src ?? ""}
//                   oldAmount={product.regular_price}
//                   newAmount={product.price}
//                   description={product.name}
//                   /*
//                    * New props introduced by the refactored card:
//                    *   category   — first WooCommerce category name
//                    *   rating     — WooCommerce average_rating (string → float)
//                    *   ratingCount— WooCommerce rating_count
//                    */
//                   category={product.categories?.[0]?.name}
//                   rating={
//                     product.average_rating
//                       ? parseFloat(product.average_rating)
//                       : undefined
//                   }
//                   ratingCount={product.rating_count ?? undefined}
//                 />
//               ))}
//             </div>

//             {/* ── Load More button ──────────────────────────────────────
//                 Shown only while there are more pages to fetch.
//                 Replaced by a spinner while the next page is in-flight.
//             ─────────────────────────────────────────────────────────── */}
//             {hasMore && (
//               <div className="flex justify-center mt-10 md:mt-14">
//                 <button
//                   onClick={loadMore}
//                   disabled={isFetchingMore}
//                   className="
//                     flex items-center gap-2
//                     px-8 py-3
//                     border-2 border-[#78787833]
//                     bg-[#78787833]
//                     text-gray-100 font-semibold text-sm
//                     rounded-lg
//                     hover:bg-[#78787833]/80 hover:text-white
//                     disabled:opacity-50 disabled:cursor-not-allowed
//                     transition-all duration-200
//                   "
//                   style={{
//                     fontFamily:
//                       "'Barlow Condensed', 'Arial Narrow', sans-serif",
//                   }}
//                 >
//                   {isFetchingMore ? (
//                     <>
//                       {/* Inline spinner — no extra dependency */}
//                       <svg
//                         className="animate-spin w-4 h-4"
//                         viewBox="0 0 24 24"
//                         fill="none"
//                       >
//                         <circle
//                           className="opacity-25"
//                           cx="12"
//                           cy="12"
//                           r="10"
//                           stroke="currentColor"
//                           strokeWidth="4"
//                         />
//                         <path
//                           className="opacity-75"
//                           fill="currentColor"
//                           d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
//                         />
//                       </svg>
//                       Loading…
//                     </>
//                   ) : (
//                     "See More"
//                   )}
//                 </button>
//               </div>
//             )}
//           </>
//         ) : (
//           /* ── Empty state ──────────────────────────────────────────── */
//           <EmptyState />
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import React, { useEffect, useState, useCallback } from "react";
import { WooCommerce } from "@src/components/lib/woocommerce";
import Link from "next/link";
import Picture from "../picture/Picture";
import { FormatMoney2 } from "../Reusables/FormatMoney";
import { convertToSlug } from "@constants";

const PAGE_SIZE = 6;

/* ─────────────────────────────────────────────────────────────────────────────
   Skeleton Loader
───────────────────────────────────────────────────────────────────────────── */
export const PopularProductsLoader = () => (
  <section className="w-full py-12 md:py-16" style={{ background: "#f0ede6" }}>
    <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
      <div className="flex items-start justify-between mb-10">
        <div className="space-y-2">
          <div
            className="h-7 w-28 rounded animate-pulse"
            style={{ background: "#e0ddd6" }}
          />
          <div
            className="h-4 w-80 rounded animate-pulse"
            style={{ background: "#e0ddd6" }}
          />
        </div>
        <div className="h-4 w-28 rounded" style={{ background: "#e0ddd6" }} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: PAGE_SIZE }).map((_, i) => (
          <div key={i} className="flex flex-col gap-3">
            <div
              className="w-full h-64 rounded animate-pulse"
              style={{ background: "#e0ddd6" }}
            />
            <div className="space-y-2 px-1">
              <div
                className="h-3 w-32 rounded animate-pulse"
                style={{ background: "#e0ddd6" }}
              />
              <div
                className="h-5 w-40 rounded animate-pulse"
                style={{ background: "#e0ddd6" }}
              />
              <div
                className="h-4 w-20 rounded animate-pulse"
                style={{ background: "#e0ddd6" }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ─────────────────────────────────────────────────────────────────────────────
   Product Card — light editorial style (image-only white box, text below)
───────────────────────────────────────────────────────────────────────────── */
interface CardProps {
  id: string | number;
  image: string;
  name: string;
  price: string;
  tags?: string[];
}

const ProductCard = ({ id, image, name, price, tags }: CardProps) => {
  const slugDesc = convertToSlug(name);
  const priceNum = parseInt(price);

  return (
    <Link
      href={`/home-item/product/${slugDesc}-${id}`}
      className="group flex flex-col gap-3 transition-transform duration-300 hover:-translate-y-1"
    >
      {/* White image box — image ONLY */}
      <div
        className="relative w-full h-56 sm:h-64 md:h-72 overflow-hidden shrink-0"
        style={{
          background: "#ffffff",
          fontFamily: "'Barlow Condensed', 'Arial Narrow', sans-serif",
        }}
      >
        <Picture
          src={image}
          alt={name}
          className="absolute inset-0 w-full h-full object-contain p-6 transition-transform duration-700 group-hover:scale-105"
        />
      </div>

      {/* Text — sits on cream background below white box */}
      <div className="flex flex-col gap-1 px-1">
        {/* Material / category tags */}
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
   Empty State
───────────────────────────────────────────────────────────────────────────── */
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-24 text-center gap-3">
    <p className="font-semibold text-lg" style={{ color: "#1a1a1a" }}>
      No products yet
    </p>
    <p className="text-sm max-w-xs" style={{ color: "#999992" }}>
      Check back soon — products will appear here once available.
    </p>
  </div>
);

/* ─────────────────────────────────────────────────────────────────────────────
   Main Component
───────────────────────────────────────────────────────────────────────────── */
export default function PopularProducts() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const buildQuery = (orderby: "popularity" | "rating", pageNum: number) =>
    `products?orderby=${orderby}&order=desc&per_page=${PAGE_SIZE}&page=${pageNum}&status=publish`;

  const fetchPage = async (
    orderby: "popularity" | "rating",
    pageNum: number,
  ): Promise<ProductType[]> => {
    const res = await WooCommerce.get(buildQuery(orderby, pageNum));
    return res?.data || [];
  };

  useEffect(() => {
    const loadInitial = async () => {
      try {
        setIsLoading(true);
        setHasError(false);
        let data = await fetchPage("popularity", 1);
        if (!data.length) data = await fetchPage("rating", 1);
        setProducts(data);
        setHasMore(data.length === PAGE_SIZE);
      } catch (err) {
        console.error("[PopularProducts] initial fetch failed:", err);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };
    loadInitial();
  }, []);

  const loadMore = useCallback(async () => {
    if (isFetchingMore || !hasMore) return;
    try {
      setIsFetchingMore(true);
      const nextPage = page + 1;
      const data = await fetchPage("popularity", nextPage);
      setProducts((prev) => [...prev, ...data]);
      setPage(nextPage);
      setHasMore(data.length === PAGE_SIZE);
    } catch (err) {
      console.error("[PopularProducts] load-more failed:", err);
    } finally {
      setIsFetchingMore(false);
    }
  }, [page, isFetchingMore, hasMore]);

  if (isLoading) return <PopularProductsLoader />;

  if (hasError) {
    return (
      <section
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#f0ede6" }}
      >
        <div className="text-center space-y-3">
          <p className="font-semibold text-lg" style={{ color: "#1a1a1a" }}>
            Something went wrong
          </p>
          <p className="text-sm" style={{ color: "#999992" }}>
            We couldn&apos;t load products. Please try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-6 py-2.5 text-white text-xs font-semibold tracking-widest uppercase transition-opacity hover:opacity-80"
            style={{ background: "#3d5a4c" }}
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section
      className="w-full min-h-screen py-14 md:py-20"
      style={{
        background: "#F4F4ED",
        fontFamily: "'Barlow Condensed', 'Arial Narrow', sans-serif",
      }}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
        {/* ── Section header ── */}
        <div className="flex items-start justify-between mb-10 md:mb-14">
          <div className="flex flex-col gap-2 max-w-md">
            <h1
              className="text-2xl md:text-3xl font-bold leading-tight"
              style={{
                color: "#1a1a1a",
                fontFamily: "'Barlow Condensed', 'Arial Narrow', sans-serif",
              }}
            >
              Products
            </h1>
            <p className="text-sm leading-relaxed" style={{ color: "#888880" }}>
              Carefully refurbished devices, upgraded with bio-based materials
              and modular components for a lifetime of use.
            </p>
          </div>

          {/* View all link */}
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
        {products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-10">
              {products.map((product: ProductType) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  image={product.images?.[0]?.src ?? ""}
                  name={product.name}
                  price={product.price}
                  tags={
                    product.tags?.map((t: { name: string }) => t.name) ||
                    product.categories?.map(
                      (c: { name: string }) => c.name,
                    ) || ["Recycled", "Modular"]
                  }
                />
              ))}
            </div>

            {/* ── Load more ── */}
            {hasMore && (
              <div className="flex justify-center mt-14">
                <button
                  onClick={loadMore}
                  disabled={isFetchingMore}
                  className="flex items-center gap-2 px-10 py-3.5 text-xs font-semibold tracking-[0.2em] uppercase transition-opacity duration-200 hover:opacity-70 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    border: "1px solid #1a1a1a",
                    color: "#1a1a1a",
                    background: "transparent",
                  }}
                >
                  {isFetchingMore ? (
                    <>
                      <svg
                        className="animate-spin w-3.5 h-3.5"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                        />
                      </svg>
                      Loading…
                    </>
                  ) : (
                    "Load More"
                  )}
                </button>
              </div>
            )}
          </>
        ) : (
          <EmptyState />
        )}
      </div>
    </section>
  );
}
