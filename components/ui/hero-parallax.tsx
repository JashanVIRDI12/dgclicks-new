"use client";
import React from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
  MotionValue,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import MagneticButton from "@/components/MagneticButton";
import { scrollToSection } from "@/lib/gsap";

export const HeroParallax = ({
  products,
}: {
  products: {
    title: string;
    link: string;
    thumbnail: string;
  }[];
}) => {
  const firstRow = products.slice(0, 5);
  const secondRow = products.slice(5, 10);
  const thirdRow = products.slice(10, 15);
  const ref = React.useRef(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 1000]),
    springConfig
  );
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -1000]),
    springConfig
  );
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [15, 0]),
    springConfig
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
    springConfig
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [20, 0]),
    springConfig
  );
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [-700, 500]),
    springConfig
  );

  if (reduceMotion) {
    // Static fallback: header + first row of work, no scroll choreography
    return (
      <div className="relative flex flex-col pt-24">
        <Header />
        <div className="flex gap-6 overflow-x-auto px-5 pb-16 sm:px-8">
          {firstRow.map((product) => (
            <ProductCard product={product} key={product.title} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className="relative flex h-[300vh] flex-col self-auto overflow-hidden py-40 antialiased [perspective:1000px] [transform-style:preserve-3d]"
    >
      <Header />
      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
        className=""
      >
        <motion.div className="mb-10 flex flex-row-reverse space-x-10 space-x-reverse md:mb-20 md:space-x-20">
          {firstRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
            />
          ))}
        </motion.div>
        <motion.div className="mb-10 flex flex-row space-x-10 md:mb-20 md:space-x-20">
          {secondRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateXReverse}
              key={product.title}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row-reverse space-x-10 space-x-reverse md:space-x-20">
          {thirdRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export const Header = () => {
  return (
    <div className="relative left-0 top-0 z-10 mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 md:py-32 lg:px-12">
      <p className="eyebrow mb-6">
        <span className="h-1.5 w-1.5 rounded-full bg-sky-deep" aria-hidden="true" />
        Digital growth studio · Canada + India
      </p>
      <h1 className="font-display text-display-xl font-semibold text-ink">
        Clicks are cheap.
        <br />
        Clients are the point.
      </h1>
      <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate md:text-xl">
        DG Clicks builds search, paid, and web systems that turn strangers into
        booked calls — measured in revenue, not impressions. This is the work.
      </p>
      <div className="mt-9 flex flex-wrap items-center gap-4">
        <MagneticButton>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("#contact");
            }}
            className="inline-block rounded-full bg-ink px-8 py-4 font-medium text-white transition-colors hover:bg-sky-deep"
          >
            Book a free growth audit
          </a>
        </MagneticButton>
        <MagneticButton strength={0.2}>
          <a
            href="#results"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("#results");
            }}
            className="glass-chip inline-block rounded-full px-8 py-4 font-medium text-ink transition-shadow hover:shadow-glass-hover"
          >
            See the proof
          </a>
        </MagneticButton>
      </div>
    </div>
  );
};

export const ProductCard = ({
  product,
  translate,
}: {
  product: {
    title: string;
    link: string;
    thumbnail: string;
  };
  translate?: MotionValue<number>;
}) => {
  return (
    <motion.div
      style={translate ? { x: translate } : undefined}
      whileHover={{
        y: -20,
      }}
      key={product.title}
      className="group/product relative h-64 w-80 flex-shrink-0 md:h-96 md:w-[30rem]"
    >
      <Link
        href={product.link}
        className="block h-full overflow-hidden rounded-glass border border-white/60 shadow-glass group-hover/product:shadow-glass-hover"
      >
        <Image
          src={product.thumbnail}
          height="600"
          width="600"
          sizes="(min-width: 768px) 30rem, 20rem"
          className="absolute inset-0 h-full w-full object-cover object-left-top"
          alt={product.title}
        />
        <div className="img-tint absolute inset-0" />
      </Link>
      <div className="pointer-events-none absolute inset-0 h-full w-full rounded-glass bg-ink opacity-0 transition-opacity duration-300 group-hover/product:opacity-70" />
      <h2 className="absolute bottom-4 left-4 font-display text-lg font-semibold text-white opacity-0 transition-opacity duration-300 group-hover/product:opacity-100">
        {product.title}
      </h2>
    </motion.div>
  );
};
