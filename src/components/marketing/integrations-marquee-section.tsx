'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { BRAND_ICONS } from '@/features/integrations/components/brand-icons';

const LOGOS = [
  { name: 'Linear', icon: BRAND_ICONS.linear, color: '#5E6AD2' },
  { name: 'Jira', icon: BRAND_ICONS.jira, color: '#0052CC' },
  { name: 'Notion', icon: BRAND_ICONS.notion, color: '#000000' },
  { name: 'Asana', icon: BRAND_ICONS.asana, color: '#F06A6A' },
  { name: 'GitHub', icon: BRAND_ICONS.github, color: '#181717' },
  { name: 'Trello', icon: BRAND_ICONS.trello, color: '#0052CC' },
  { name: 'GitLab', icon: BRAND_ICONS.gitlab, color: '#FC6D26' },
  { name: 'Zendesk', icon: BRAND_ICONS.zendesk, color: '#03363D' },
  { name: 'Salesforce', icon: BRAND_ICONS.salesforce, color: '#00A1E0' },
  { name: 'Monday', icon: BRAND_ICONS.monday, color: '#6161FF' },
  { name: 'HubSpot', icon: BRAND_ICONS.hubspot, color: '#FF7A59' },
  { name: 'Intercom', icon: BRAND_ICONS.intercom, color: '#286EFA' },
  { name: 'Zapier', icon: BRAND_ICONS.zapier, color: '#FF4A00' },
  { name: 'Make', icon: BRAND_ICONS.make, color: '#18BFFF' },
];

export function IntegrationsMarqueeSection() {
  return (
    <section className="py-24 bg-[#FAFAFC] relative overflow-hidden border-t border-black/5">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 mb-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 text-indigo-500 text-xs font-bold tracking-widest uppercase">
            <Sparkles className="size-3.5" />
            Zero Setup Required
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-zinc-900">
            Works with the tools you already use.
          </h2>
          <p className="text-zinc-500 font-medium text-sm sm:text-base">
            Wallflower securely syncs with your existing financial, operational, and productivity stack in one click.
          </p>
        </div>
      </div>

      {/* Infinite Marquee */}
      <div className="relative flex overflow-x-hidden group">
        <div className="absolute top-0 bottom-0 left-0 w-32 bg-gradient-to-r from-[#FAFAFC] to-transparent z-10" />
        <div className="absolute top-0 bottom-0 right-0 w-32 bg-gradient-to-l from-[#FAFAFC] to-transparent z-10" />
        
        <motion.div
          className="flex whitespace-nowrap items-center py-4"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ ease: "linear", duration: 30, repeat: Infinity }}
        >
          {/* Duplicate the logos array 2 times for seamless looping */}
          {[...LOGOS, ...LOGOS, ...LOGOS, ...LOGOS].map((logo, i) => (
            <div 
              key={i} 
              className="flex items-center gap-2 mx-8 sm:mx-12 opacity-40 hover:opacity-100 transition-opacity grayscale hover:grayscale-0"
              style={{ color: logo.color }}
            >
              <logo.icon className="w-8 h-8 sm:w-10 sm:h-10" />
              <span className="font-display font-bold text-lg sm:text-xl text-zinc-400 hidden sm:block">{logo.name}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
