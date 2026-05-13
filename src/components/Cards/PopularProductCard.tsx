"use client";

import React from "react";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { RiShoppingCart2Fill } from "react-icons/ri";
import { useCart } from "react-use-cart";
import Link from "next/link";
import Picture from "../picture/Picture";
import { FormatMoney2 } from "../Reusables/FormatMoney";
import { convertToSlug } from "@constants";

/* ─────────────────────────────────────────────────────────────────────────────
   Props
───────────────────────────────────────────────────────────────────────────── */
interface PopularProductCardProps {
  id: string | number;
  image: string;
  oldAmount?: string;
  newAmount: string;
  description: string;
  isNew?: boolean;
  /** Small muted category label  e.g. "WIRELESS AUDIO" */
  category?: string;
  /** Star rating value  e.g. 4.0 */
  rating?: number;
  /** Number of reviews  e.g. 120 */
  ratingCount?: number;
  /** Watermark label bottom-right of image  e.g. "TITANIUM CORE" */
  seriesLabel?: string;
  /** Short spec / subtitle line below the name */
  subtitle?: string;
}

/* ─────────────────────────────────────────────────────────────────────────────
   Component
───────────────────────────────────────────────────────────────────────────── */
const PopularProductCard = ({
  id,
  image,
  oldAmount,
  newAmount,
  description,
  isNew,
  category,
  rating,
  ratingCount,
  seriesLabel,
  subtitle,
}: PopularProductCardProps) => {
  const { addItem, removeItem, updateItem, getItem } = useCart();

  const ID = id.toString();
  const cartItem = getItem(ID);
  const quantity = cartItem?.quantity || 0;
  const price = parseInt(newAmount);
  const slugDesc = convertToSlug(description);

  // const discount = oldAmount
  //   ? Math.round(((parseInt(oldAmount) - price) / parseInt(oldAmount)) * 100)
  //   : 0;

  const addToCart = () =>
    addItem({ id: ID, name: description, price, quantity: 1, image });
  const increase = () => updateItem(ID, { quantity: quantity + 1 });
  const decrease = () => {
    if (quantity <= 1) removeItem(ID);
    else updateItem(ID, { quantity: quantity - 1 });
  };

  return (
    <div
      className="group relative flex flex-col w-full overflow-hidden transition-transform duration-300 hover:-translate-y-1"
      style={{ background: "#1c1c1c" }}
    >
      {/* ═══════════════════════════════════════════════════════════════════
          IMAGE AREA
      ═══════════════════════════════════════════════════════════════════ */}
      <Link
        href={`/home-item/product/${slugDesc}-${id}`}
        className="relative block w-full overflow-hidden"
        style={{ paddingBottom: "85%" }}
        aria-label={description}
      >
        {/* Product image */}
        <Picture
          src={image}
          alt={description}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Bottom vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 45%)",
          }}
        />

        {/* Series watermark — bottom right */}
        {seriesLabel && (
          <span
            className="absolute bottom-3 right-3 text-[9px] tracking-[0.2em] uppercase pointer-events-none"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            {seriesLabel}
          </span>
        )}

        {/* Discount badge */}
        {/* {discount > 0 && !isNew && (
          <span
            className="absolute top-3 left-3 text-[10px] font-bold tracking-wider uppercase px-2 py-1"
            style={{ background: "#B040C7", color: "#0e0e0e" }}
          >
            -{discount}%
          </span>
        )} */}

        {/* New badge */}
        {isNew && (
          <span
            className="absolute top-3 left-3 text-[10px] font-bold tracking-wider uppercase px-2 py-1"
            style={{ background: "#B040C7", color: "#0e0e0e" }}
          >
            New
          </span>
        )}
      </Link>

      {/* ═══════════════════════════════════════════════════════════════════
          CONTENT AREA
      ═══════════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col px-3 pt-3 pb-4 gap-1.5">
        {/* ── Name + Price on same row ──────────────────────────────────── */}
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/home-item/product/${slugDesc}-${id}`}
            className="text-xs sm:text-sm font-bold uppercase tracking-wider leading-snug line-clamp-1 flex-1 transition-opacity duration-200 group-hover:opacity-75"
            style={{ color: "#E8E6E0", letterSpacing: "0.08em" }}
            dangerouslySetInnerHTML={{ __html: description }}
          />
          <span
            className="text-sm font-bold shrink-0"
            style={{ color: "#B040C7" }}
          >
            {price ? <FormatMoney2 value={price} /> : "N/A"}
          </span>
        </div>

        {/* ── Category label (optional) ─────────────────────────────────── */}
        {category && (
          <span
            className="text-[10px] uppercase tracking-[0.15em]"
            style={{ color: "#555" }}
          >
            {category}
          </span>
        )}

        {/* ── Subtitle / spec line ──────────────────────────────────────── */}
        {subtitle && (
          <p
            className="text-[11px] leading-relaxed line-clamp-2"
            style={{ color: "#666" }}
          >
            {subtitle}
          </p>
        )}

        {/* ── Star rating (optional) ────────────────────────────────────── */}
        {rating !== undefined && (
          <div className="flex items-center gap-1">
            <svg
              className="w-3 h-3 shrink-0"
              viewBox="0 0 20 20"
              aria-hidden="true"
              style={{ fill: "#B040C7" }}
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.286 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.286-3.957a1 1 0 00-.364-1.118L2.062 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.05 2.927z" />
            </svg>
            <span
              className="text-[10px] font-medium leading-none"
              style={{ color: "#666" }}
            >
              {rating.toFixed(1)}
              {ratingCount !== undefined && (
                <span className="ml-0.5">({ratingCount})</span>
              )}
            </span>
          </div>
        )}

        {/* ── Old price ─────────────────────────────────────────────────── */}
        {oldAmount && (
          <span className="text-[10px] line-through" style={{ color: "#444" }}>
            <FormatMoney2 value={parseInt(oldAmount)} />
          </span>
        )}

        {/* ── Cart CTA ──────────────────────────────────────────────────── */}
        <div className="mt-2">
          {quantity === 0 ? (
            <button
              onClick={(e) => {
                e.preventDefault();
                addToCart();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-[11px] font-semibold tracking-[0.15em] uppercase transition-all duration-200"
              style={{
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#888",
                background: "transparent",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  "#B040C7";
                (e.currentTarget as HTMLButtonElement).style.color = "#B040C7";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  "rgba(255,255,255,0.1)";
                (e.currentTarget as HTMLButtonElement).style.color = "#888";
              }}
              aria-label="Add to cart"
            >
              <RiShoppingCart2Fill size={13} />
              Add to Cart
            </button>
          ) : (
            <div
              className="w-full flex items-center justify-between px-3 py-2"
              style={{ border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <button
                onClick={(e) => {
                  e.preventDefault();
                  decrease();
                }}
                className="w-7 h-7 flex items-center justify-center transition-colors duration-150"
                style={{ background: "#222", color: "#aaa" }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.background =
                    "#2a2a2a")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.background =
                    "#222")
                }
                aria-label="Decrease quantity"
              >
                <AiOutlineMinus size={11} />
              </button>

              <span
                className="text-xs font-bold select-none"
                style={{ color: "#E8E6E0" }}
              >
                {quantity}
              </span>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  increase();
                }}
                className="w-7 h-7 flex items-center justify-center transition-colors duration-150"
                style={{ background: "#B040C7", color: "#0e0e0e" }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.background =
                    "#d4ae40")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.background =
                    "#B040C7")
                }
                aria-label="Increase quantity"
              >
                <AiOutlinePlus size={11} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PopularProductCard;
