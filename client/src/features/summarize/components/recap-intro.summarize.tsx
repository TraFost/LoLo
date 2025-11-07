import { motion } from 'motion/react';
import { getChampionIdForDDragon } from '../utils/champion/parse-champion-name.util';
import { RankSummaryDTO } from 'shared/src/types/account.type';
import { getLevelBorder } from '../utils/recap-intro/getLevelBorder';

interface Props {
  gameName: string;
  tagName: string;
  championName: string;
  profilePict: string;
  rank: RankSummaryDTO;
  summonerLevel: number;
}

export function RecapIntro({
  gameName,
  tagName,
  championName,
  profilePict,
  rank,
  summonerLevel,
}: Props) {
  const championId = getChampionIdForDDragon(championName);
  const levelBorder = getLevelBorder(summonerLevel);

  return (
    <section className="w-full h-screen flex flex-col justify-center items-center text-center relative overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${championId}_0.jpg')`,
          maskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
        }}
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2, ease: 'easeOut' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/60 to-transparent" />

      <motion.div
        className="flex flex-col gap-4 items-center z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      >
        <div className="relative -z-10">
          <img
            src={profilePict}
            alt="profile"
            className="relative rounded-full"
            width={128}
            height={128}
          />
          <img
            src={`assets/level-border/theme-${levelBorder}-border.webp`}
            alt="level-border"
            className="absolute top-4 scale-[2.5]"
          />
          <span className="absolute flex items-center justify-center bottom-0 translate-y-1/2 left-1/2 -translate-x-1/2 text-white bg-slate-900 border-2 border-primary rounded-full py-1 px-2 text-xs font-semibold">
            {summonerLevel}
          </span>
        </div>

        <motion.h1
          className="text-3xl md:text-5xl font-bold tracking-wide mt-12"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1 }}
        >
          {gameName}#<span className="text-primary">{tagName}</span>
        </motion.h1>
      </motion.div>
      <motion.div
        className="mt-8 flex items-center gap-4 bg-slate-900/60 px-6 py-3 z-10 backdrop-blur-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 1 }}
      >
        <img
          src={`https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/${rank.tier.toLowerCase()}.png`}
          alt={rank.tier}
          className="w-14 h-14"
        />
        <div className="text-left">
          <p className="text-lg font-semibold text-white">{rank.display}</p>
          <p className="text-sm text-slate-400">
            {rank.leaguePoints} LP • {rank.wins}W {rank.losses}L
          </p>
        </div>
      </motion.div>

      <motion.div
        className="w-2/3 max-w-3xl mt-12 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1.2 }}
      >
        <p className="text-lg lg:text-xl text-slate-300 font-light leading-relaxed">
          Collaboration defines your journey this season. You fought side by side, learned from
          every battle, and discovered the power of persistence. Now it's time to reflect, and
          celebrate how far you've come.
        </p>
      </motion.div>
    </section>
  );
}
