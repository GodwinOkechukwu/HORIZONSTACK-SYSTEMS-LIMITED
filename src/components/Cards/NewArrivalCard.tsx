"use client";
import React, { useState } from "react";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { RiShoppingBagFill } from "react-icons/ri";
import { FiHeart } from "react-icons/fi";
import { useCart } from "react-use-cart";
import Link from "next/link";
import Picture from "../picture/Picture";
import { FormatMoney2 } from "../Reusables/FormatMoney";
import { convertToSlug } from "@constants";

interface NewArrivalCardProps {
  id: string | number;
  image: string;
  oldAmount?: string;
  newAmount: string;
  description: string;
  isNew?: boolean;
  /** Watermark label shown bottom-right of image e.g. "TITANIUM CORE" */
  seriesLabel?: string;
  /** Short spec line shown below product name e.g. "Standard issue bio-metric interface." */
  subtitle?: string;
}

const NewArrivalCard = ({
  id,
  image,
  oldAmount,
  newAmount,
  description,
  isNew,
  seriesLabel,
  subtitle,
}: NewArrivalCardProps) => {
  const { addItem, removeItem, updateItem, getItem } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);

  const ID = id.toString();
  const cartItem = getItem(ID);
  const quantity = cartItem?.quantity || 0;
  const price = parseInt(newAmount);
  const slugDesc = convertToSlug(description);

  const discount = oldAmount
    ? Math.round(((parseInt(oldAmount) - price) / parseInt(oldAmount)) * 100)
    : 0;

  const addToCart = () =>
    addItem({ id: ID, name: description, price, quantity: 1, image });
  const increase = () => updateItem(ID, { quantity: quantity + 1 });
  const decrease = () => {
    if (quantity <= 1) removeItem(ID);
    else updateItem(ID, { quantity: quantity - 1 });
  };

  return (
    <div
      className="group relative  flex flex-col w-full overflow-hidden transition-transform duration-300 hover:-translate-y-1"
      style={{ background: "#0E0E0F" }}
    >
      {/* ═══════════════════════════════════════
          IMAGE
      ═══════════════════════════════════════ */}
      <Link
        href={`/home-item/product/${slugDesc}-${id}`}
        className="relative block w-full overflow-hidden"
        style={{ paddingBottom: "85%" }}
      >
        <Picture
          src={image}
          alt={description}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Dark vignette bottom — helps watermark + info read cleanly */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 45%)",
          }}
        />

        {/* Series / collection watermark — bottom right */}
        {seriesLabel && (
          <span
            className="absolute bottom-3 right-3 text-[9px] tracking-[0.2em] uppercase"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            {seriesLabel}
          </span>
        )}

        {/* Discount badge */}
        {discount > 0 && !isNew && (
          <span
            className="absolute top-3 left-3 text-[10px] font-bold tracking-wider uppercase px-2 py-1"
            style={{ background: "#B040C7", color: "#0e0e0e" }}
          >
            -{discount}%
          </span>
        )}

        {/* New badge */}
        {isNew && (
          <span
            className="absolute top-3 left-3 text-[10px] font-bold tracking-wider uppercase px-2 py-1"
            style={{ background: "#B040C7", color: "#0e0e0e" }}
          >
            New
          </span>
        )}

        {/* Wishlist — appears on hover */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsWishlisted(!isWishlisted);
          }}
          className="absolute top-3 right-3 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: "rgba(255,255,255,0.08)" }}
          aria-label="Add to wishlist"
        >
          <FiHeart
            className={`w-4 h-4 ${isWishlisted ? "fill-red-500 text-red-500" : "text-white"}`}
          />
        </button>
      </Link>

      {/* ═══════════════════════════════════════
          CONTENT
      ═══════════════════════════════════════ */}
      <div className="flex flex-col px-3 pt-3 pb-4 gap-1.5">
        {/* Name + Price on same row */}
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/home-item/product/${slugDesc}-${id}`}
            className="text-xs sm:text-sm font-bold uppercase tracking-wider leading-snug line-clamp-1 flex-1 transition-colors duration-200"
            style={{
              color: "#E8E6E0",
              fontFamily: "'Barlow Condensed', 'Arial Narrow', sans-serif",
              letterSpacing: "0.08em",
            }}
            dangerouslySetInnerHTML={{ __html: description }}
          />
          <span
            className="text-sm font-bold shrink-0"
            style={{ color: "#B040C7" }}
          >
            {price ? <FormatMoney2 value={price} /> : "N/A"}
          </span>
        </div>

        {/* Subtitle / spec line */}
        {subtitle && (
          <p
            className="text-[11px] leading-relaxed line-clamp-2"
            style={{ color: "#666" }}
          >
            {subtitle}
          </p>
        )}

        {/* Old price if present */}
        {oldAmount && (
          <span className="text-[10px] line-through" style={{ color: "#444" }}>
            <FormatMoney2 value={parseInt(oldAmount)} />
          </span>
        )}

        {/* Cart controls — compact, dark themed */}
        <div className="mt-2">
          {quantity === 0 ? (
            <button
              onClick={(e) => {
                e.preventDefault();
                addToCart();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-[11px] font-semibold tracking-[0.15em] uppercase transition-all duration-200"
              style={{
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#999",
                background: "transparent",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  "#B040C7";
                (e.currentTarget as HTMLButtonElement).style.color = "#B040C7";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  "rgba(255,255,255,0.12)";
                (e.currentTarget as HTMLButtonElement).style.color = "#999";
              }}
              aria-label="Add to cart"
            >
              <RiShoppingBagFill size={13} />
              Add to Cart
            </button>
          ) : (
            <div
              className="w-full flex items-center justify-between px-3 py-2"
              style={{ border: "1px solid rgba(255,255,255,0.12)" }}
            >
              <button
                onClick={(e) => {
                  e.preventDefault();
                  decrease();
                }}
                className="w-7 h-7 flex items-center justify-center transition-colors"
                style={{ background: "#222", color: "#aaa" }}
                aria-label="Decrease"
              >
                <AiOutlineMinus size={11} />
              </button>
              <span className="text-xs font-bold" style={{ color: "#E8E6E0" }}>
                {quantity}
              </span>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  increase();
                }}
                className="w-7 h-7 flex items-center justify-center transition-colors"
                style={{ background: "#B040C7", color: "#0e0e0e" }}
                aria-label="Increase"
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

export default NewArrivalCard;
