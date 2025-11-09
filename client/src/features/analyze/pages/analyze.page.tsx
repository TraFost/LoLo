import TagInput from '@/ui/molecules/tag-input.molecule';
import { motion } from 'motion/react';

export function AnalyzePage() {
  return (
    <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
      <div className="h-screen w-full flex flex-col items-center justify-center gap-12 bg-gradient-to-br from-black via-[#0a0b1f] to-[#02030a] text-white px-6 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 blur-[100px] rounded-full animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-blue-600/10 blur-[80px] rounded-full animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-cyan-500/5 blur-[60px] rounded-full animate-pulse delay-500"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="text-center relative z-10"
        >
          <h1 className="text-6xl font-black tracking-tighter bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent drop-shadow-2xl mb-4">
            ENTER YOUR TAG NAME
          </h1>
        </motion.div>

        <TagInput />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="text-center relative z-10 max-w-lg text-slate-400/80 text-sm tracking-wide leading-relaxed"
        >
          <p>LoLo will analyze your competitive journey and summarize your Season Arc.</p>
          <p>Data is securely fetched via Riot API.</p>
        </motion.div>
      </div>
    </div>
  );
}
