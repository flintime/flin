"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { createClient } from '@supabase/supabase-js';

type PartnerCardData = {
  id: string;
  name: string;
  website?: string | null;
  coverImageUrl?: string | null;
};

export default function Partners() {
  const [cards, setCards] = useState<PartnerCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const isPausedRef = useRef(false);
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(url, anon);

    (async () => {
      try {
        // 1) Load vendors first
        const { data: vendors, error: vendorsError } = await supabase
          .from('vendors')
          .select('id, name, website')
          .order('created_at', { ascending: false })
          .limit(48);
        if (vendorsError) throw vendorsError;

        const vendorIds = (vendors || []).map(v => v.id);
        if (vendorIds.length === 0) {
          setCards([]);
          return;
        }
        
        // 2) Load vendor cover images (first by sort_order)
        const { data: images, error: imagesError } = await supabase
          .from('vendor_images')
          .select('vendor_id, image_url, sort_order')
          .in('vendor_id', vendorIds)
          .order('sort_order', { ascending: true });
        if (imagesError) {
          // Non-fatal, proceed without images
          console.warn('Images fetch failed in Partners:', imagesError.message);
        }

        // Build lookup maps
        const coverByVendor: Record<string, string | undefined> = {};
        (images || []).forEach(img => {
          if (!coverByVendor[img.vendor_id]) {
            coverByVendor[img.vendor_id] = img.image_url;
          }
        });

        const merged: PartnerCardData[] = (vendors || []).map(v => ({
          id: v.id,
          name: v.name,
          website: v.website ?? null,
          coverImageUrl: coverByVendor[v.id] ?? null
        }));

        setCards(merged);
      } catch (e) {
        console.error('Failed to load partners:', e);
        setCards([]);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const repeatedCards = useMemo(() => cards.length > 0 ? [...cards, ...cards] : [], [cards]);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || repeatedCards.length === 0) return;

    // Reset scroll position on data change
    scroller.scrollLeft = 0;

    let rafId = 0;
    const speedPxPerFrame = 0.6; // ~36px/sec at 60fps

    const step = () => {
      if (!isPausedRef.current && scrollerRef.current && trackRef.current) {
        const container = scrollerRef.current;
        const track = trackRef.current;
        container.scrollLeft += speedPxPerFrame;
        const halfWidth = track.scrollWidth / 2;
        if (container.scrollLeft >= halfWidth) {
          container.scrollLeft -= halfWidth;
        }
      }
      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(rafId);
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    };
  }, [repeatedCards.length]);

  return (
    <section className="py-16 md:py-20 lg:py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-black mb-6 tracking-tight">
            Our <span className="text-[#fb541c]">Partners</span>
          </h2>
          <p className="text-xl text-black/70 max-w-3xl mx-auto leading-relaxed">
            Brands and local businesses partnering with Flin
          </p>
        </div>

        {isLoading ? (
          <div className="h-20 flex items-center justify-center text-black/60">Loading…</div>
        ) : cards.length === 0 ? (
          <div className="h-20 flex items-center justify-center text-black/60">Coming soon</div>
        ) : (
          <div className="relative -mx-4">
            <div
              ref={scrollerRef}
              className="overflow-x-auto px-4 scrollbar-none"
              onMouseEnter={() => { isPausedRef.current = true; }}
              onMouseLeave={() => { isPausedRef.current = false; }}
              onPointerDown={() => {
                isPausedRef.current = true;
                if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
                resumeTimeoutRef.current = setTimeout(() => { isPausedRef.current = false; }, 2000);
              }}
              onWheel={() => {
                isPausedRef.current = true;
                if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
                resumeTimeoutRef.current = setTimeout(() => { isPausedRef.current = false; }, 1500);
              }}
              onTouchStart={() => {
                isPausedRef.current = true;
                if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
                resumeTimeoutRef.current = setTimeout(() => { isPausedRef.current = false; }, 2000);
              }}
            >
              <div ref={trackRef} className="flex items-stretch gap-6">
                {repeatedCards.map((card, idx) => {
                  const content = (
                    <div className="group w-64 flex-shrink-0 rounded-xl border border-black/10 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      <div className="relative w-full h-40 md:h-44">
                        {card.coverImageUrl ? (
                          <Image
                            src={card.coverImageUrl}
                            alt={card.name}
                            fill
                            sizes="256px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-black/5" />
                        )}
                      </div>
                      <div className="px-4 py-3">
                        <div className="text-sm font-semibold text-black truncate">{card.name}</div>
                      </div>
                    </div>
                  );
                  return card.website ? (
                    <a key={`${card.id}-${idx}`} href={card.website} target="_blank" rel="noopener noreferrer" className="block">
                      {content}
                    </a>
                  ) : (
                    <div key={`${card.id}-${idx}`}>{content}</div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
}

// Auto-scroll logic
// Keep this below the component to avoid re-creating functions unnecessarily
// but within the same module so it can access types if needed.

