import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '@/ui/atoms/button.atom';
import { REGION_MAP } from 'shared/src/constants/match.constant';
import { useNavigate } from 'react-router';

const validateAndSplitRiotId = (fullRiotId: string) => {
  const regex = /^(.+)#(.+)$/;
  const match = fullRiotId.trim().match(regex);
  if (!match) return { isValid: false, gameName: '', tagName: '' };
  return { isValid: true, gameName: match[1], tagName: match[2] };
};

export function TagInput() {
  const [username, setUsername] = useState('');
  const [region, setRegion] = useState('na');
  const navigate = useNavigate();

  const handleSubmit = () => {
    const { isValid, gameName, tagName } = validateAndSplitRiotId(username);

    if (isValid) {
      navigate(`/summarize?game=${gameName}&tag=${tagName}`);
    } else {
      console.error('Error in tag input');
    }
  };

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center gap-12 bg-gradient-to-br from-black via-[#0a0b1f] to-[#02030a] text-white px-6 relative">
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

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="flex flex-col md:flex-row items-stretch gap-0 bg-gradient-to-br from-slate-900/40 to-slate-800/20 backdrop-blur-xl shadow-2xl p-1 relative z-10"
      >
        <div className="relative">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="p-5 w-80 bg-slate-900/60 text-white placeholder-slate-500 focus:outline-none focus:bg-slate-900/80 transition-all duration-300 font-medium tracking-wide"
            placeholder="LoLo#AI"
          />
          <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300 group-focus-within:w-full"></div>
        </div>

        <div className="relative w-fit">
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="p-5 bg-slate-900/80 text-white focus:outline-none focus:bg-slate-900 transition-all duration-300 w-40 font-medium appearance-none cursor-pointer"
          >
            {Object.keys(REGION_MAP).map((region) => (
              <option value={region} key={region}>
                {region.toUpperCase()}
              </option>
            ))}
          </select>
          <div className="absolute inset-0 pointer-events-none flex items-center justify-end pr-4">
            <div className="w-2 h-2 border-r-2 border-b-2 border-white rotate-45 transform"></div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="relative z-10"
      >
        <Button variant={'flat'} color="primary" size={'lg'} onClick={handleSubmit}>
          Start Analyze
        </Button>
      </motion.div>

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
  );
}
