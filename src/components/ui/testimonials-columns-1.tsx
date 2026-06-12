"use client";
import React from "react";
import { motion } from "motion/react";

export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: { text: string; image: string; name: string; role: string }[];
  duration?: number;
}) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6 bg-transparent"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.testimonials.map(({ text, image, name, role }, i) => (
                <div className="p-10 rounded-3xl border border-white/10 shadow-lg bg-[#120F17] max-w-xs w-full" key={i}>
                  <div className="text-gray-300 leading-relaxed text-sm">"{text}"</div>
                  <div className="flex items-center gap-3 mt-5">
                    <img
                      src={image}
                      alt={name}
                      className="h-10 w-10 rounded-full border border-white/20 object-cover"
                    />
                    <div className="flex flex-col">
                      <div className="font-bold text-white tracking-tight leading-5">{name}</div>
                      <div className="text-xs text-blue-400 tracking-tight">{role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          )),
        ]}
      </motion.div>
    </div>
  );
};
