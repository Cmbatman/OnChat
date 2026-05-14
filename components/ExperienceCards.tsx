"use client";

import React from "react";
import { motion } from "framer-motion";
import { SvgIcon, defaultAvatarUrl } from "@/lib/ui-utils";

const cards = [
  {
    icon: "bot",
    title: "Talk Without the Noise",
    description: "Start with a clean anonymous profile, see useful context, and avoid clutter before the first message.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC5FNEdquY8NhytZxOj_PQ_zaVuaCzw7H1U8IOO92PY55Ty96cY01Sa3BlWVgQkJo6PcDQyRkXGPTmY-cmABUhaI84CIjWhQ7ENo3Uf153uZE79-gT4MUK1XR7ByZbVXiHzd9oExpgXpTKsUAnbQwbtkGJd_SzoAObFOu1xjCi962P0DQ7iwbH5KJTcr5eH3l2F0zZAK5cbK2e6L_RIq2vFaW5Ib5oJcnoTWwIE8FxWaQqSwCGNwo4CrYipscbsxhler3pTWQuRUpw",
    iconClass: "featureIconBot"
  },
  {
    icon: "bolt",
    title: "Choose Your Chat",
    description: "Browse online people, start a random match, or keep your session chats in one easy place.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB_kpJvtBdt1yC85T6YLDbzmV2iwmimuSm3ooMGqdPyP6GK86qcASNWPehhoq6VXFx1PKWzU_B4ejasrnOFnvEp3kXdukoFPJN6gYxpMY-0A0mb6aD2UGKgSv_xWGctOfsx0spR1hKUlF_MCPCNvQja001lNmDVEQB0FrkuRpPSBSY8aqKTxg4saLQeuEbHj4EeT8VsJch5cREJxTfNy6u3bpqJs4VmfFi_itEKCU7WChXfn20q1ArtJvN7gDXvWZTHHJPIRATvpoA",
    iconClass: "featureIconBolt"
  },
  {
    icon: "devices",
    title: "Built for Safer Chats",
    description: "Blocking, reporting, link limits, first-message guardrails, and session expiry are built into the flow.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAIOE3u6tXYczD1RODGvMGFASXqBJpAydssAe1-XbPjcT92noIWCD3FbE6_B6Cz3qZvesg1GpmQrtR09H-2vnqleLv_hzsWBPrY7So20c-algRSEIEmVuMdzgGZ_sYREpQK6MJTJLdFPWe7dlZSQjELngbcjs_c8vG2qrsj2JioEeB85kLP9ieEjLP0cLb7-j8z_XdS11uOmjHDacKiVIs-7RrlVErZdLZq_ogRyeoNpWxHefIumltL1tHOW4tUSjVnla5UV_9CFfA",
    iconClass: "featureIconDevices",
    padded: true
  },
  {
    icon: "devices",
    title: "Works Wherever You Are",
    description: "OnChat stays lightweight and responsive across phones, tablets, and desktop browsers.",
    avatar: "non_binary",
    iconClass: "featureIconBolt",
    padded: true,
    avatarFrame: true
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const cardVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15
    }
  }
};

export function ExperienceCards() {
  return (
    <motion.div 
      className="experienceCards"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      {cards.map((card, index) => (
        <motion.article 
          key={index}
          variants={cardVariants}
          whileHover={{ y: -8, transition: { duration: 0.2 } }}
        >
          <div className="featureCopy">
            <span className={`featureIcon ${card.iconClass}`}>
              <SvgIcon name={card.icon as any} />
            </span>
            <h3>{card.title}</h3>
            <p>{card.description}</p>
          </div>
          <div className={`featureFrame ${card.padded ? "featureFramePadded" : ""} ${card.avatarFrame ? "avatarFeatureFrame" : ""}`}>
            {card.avatar ? (
              <img alt="OnChat category avatar" src={defaultAvatarUrl(card.avatar as any)} />
            ) : (
              <img alt={card.title} src={card.image} />
            )}
          </div>
        </motion.article>
      ))}
    </motion.div>
  );
}
