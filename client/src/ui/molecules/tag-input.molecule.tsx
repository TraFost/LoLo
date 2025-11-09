import { validateAndSplitRiotId } from '@/features/analyze/utils/validate-riot-id';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../atoms/button.atom';

const REGION = {
  na1: 'North America',
  euw1: 'Europe West',
  eun1: 'Europe Nordic & Eastern',
  kr: 'Korea',
  jp1: 'Japan',
  br1: 'Brazil',
  la1: 'Latin America South',
  la2: 'Latin America North',
  tr1: 'Turkey',
  ru: 'Russia',
} as const;

export default function TagInput() {
  const [username, setUsername] = useState('');
  const [region, setRegion] = useState(Object.keys(REGION)[0]);
  const [invalidMessage, setInvalidMessage] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = () => {
    const { isValid, gameName, tagName } = validateAndSplitRiotId(username);

    if (isValid) {
      navigate(`/summarize?game=${gameName}&tag=${tagName}&region=${region}`);
    } else {
      setInvalidMessage('Please enter a valid Riot ID (example: LoLo#AI)');
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3, duration: 0.6 }}
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      className="flex flex-col items-center gap-8"
    >
      <div className="flex flex-col md:flex-row items-stretch gap-0 bg-gradient-to-br from-slate-900/40 to-slate-800/20 backdrop-blur-xl shadow-2xl p-1 relative z-10">
        <AnimatePresence mode="wait">
          {invalidMessage && (
            <motion.p
              key={invalidMessage}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="absolute -top-6 left-0 text-red-400 text-sm font-medium"
            >
              {invalidMessage}
            </motion.p>
          )}
        </AnimatePresence>
        <div className="relative">
          <input
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setInvalidMessage('');
            }}
            className="p-5 w-80 bg-slate-900/60 text-white placeholder-slate-500 focus:outline-none focus:bg-slate-900/80 transition-all duration-300 font-medium tracking-wide"
            placeholder="LoLo#AI"
          />
          <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300 group-focus-within:w-full"></div>
        </div>

        <div className="relative w-full lg:w-fit">
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="p-5 bg-slate-900/80 text-white focus:outline-none focus:bg-slate-900 transition-all duration-300 w-full font-medium appearance-none cursor-pointer"
          >
            {Object.entries(REGION).map(([region, name]) => (
              <option value={region} key={region}>
                {name}
              </option>
            ))}
          </select>
          <div className="absolute inset-0 pointer-events-none flex items-center justify-end pr-2">
            <div className="w-2 h-2 border-r-2 border-b-2 border-white rotate-45 transform"></div>
          </div>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="relative z-10"
      >
        <Button variant={'flat'} color="primary" size={'lg'}>
          Start Analyze
        </Button>
      </motion.div>
    </motion.form>
  );
}
