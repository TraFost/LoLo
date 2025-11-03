import { motion } from 'motion/react';
import { useRef } from 'react';
import { ChampionStats } from 'shared/src/types/statistics.type';
import { getChampionIdForDDragon } from '../utils/champion/parse-champion-name.util';

interface Props {
  champions: ChampionStats[] | [];
}

export function ChampionsSummarize({ champions }: Props) {
  return (
    <>
      <div className="hidden lg:block w-full">
        <ChampionsDesktop champions={champions} />
      </div>
      <div className="block lg:hidden">
        <ChampionsMobile champions={champions} />
      </div>
    </>
  );
}

function ChampionsDesktop({ champions }: Props) {
  const ref = useRef(null);

  function ChampionCardDesktop({ champ, i }: { champ: ChampionStats; i: number }) {
    const isEven = i % 2 === 0;
    const championId = getChampionIdForDDragon(champ.name);

    return (
      <div
        key={i}
        className={`w-full flex justify-${isEven ? 'start' : 'end'} px-24 ${
          i !== 0 ? 'lg:-mt-24' : ''
        }`}
      >
        <motion.div
          initial={{ opacity: 0, rotateY: isEven ? -90 : 90 }}
          whileInView={{ opacity: 1, rotateY: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          viewport={{ once: true, amount: 0.3 }}
          style={{
            transformStyle: 'preserve-3d',
            transformOrigin: isEven ? 'left center' : 'right center',
          }}
        >
          <div className="relative overflow-hidden">
            <img
              src={`https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${championId}_0.jpg`}
              alt={champ.name}
              className="h-72 lg:h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-4xl font-bold text-white font-[Bebas_Neue] leading-none">
                  {champ.name}
                </h2>
                <div className="flex items-center">
                  <img
                    src={`/assets/mastery_banner/Mastery_${
                      champ.mastery!.level < 10 ? `${champ.mastery?.level}` : '10+'
                    }_Banner.png`}
                    alt={`Mastery ${champ.mastery!.level}`}
                    width={52}
                  />
                  <div>
                    <p className="relative -top-1 font-semibold text-lg">
                      Lv {champ.mastery!.level}
                    </p>
                    <p className="relative -top-1 text-white/50 text-sm">
                      {champ.mastery!.points.toLocaleString()} pts
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-white/90 text-center lg:text-lg font-medium">
                  <p>{champ.matches} Matches</p>
                  <p>{champ.wins} Wins</p>
                  <p>{champ.winrate.toFixed(1)}% WR</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <section ref={ref} className="relative h-[380vh] w-full flex flex-col items-center">
      <div className="sticky top-0 h-screen flex flex-col justify-center items-center text-center">
        <motion.div
          className="flex flex-col justify-center items-center text-7xl lg:text-9xl font-bold font-[Bebas_Neue] tracking-wide"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p>Most</p>
          <p>Champions</p>
          <p>Played</p>
        </motion.div>
        <p className="text-2xl lg:text-4xl mt-6 max-w-3xl">
          You've faced the Rift with countless champions, proving your adaptability and unshakable
          resolve.
        </p>
      </div>

      <div className="lg:absolute top-[100vh] left-0 w-full flex flex-col items-center">
        {champions.length !== 0 && (
          <>
            {champions.map((champ, i) => (
              <ChampionCardDesktop champ={champ} i={i} />
            ))}
          </>
        )}
      </div>
    </section>
  );
}

function ChampionsMobile({ champions }: Props) {
  return (
    <section className="relative w-full flex flex-col items-center py-8">
      {/* Header */}
      <div className="w-full px-4 mb-6">
        <p className="text-center text-4xl font-bold tracking-wide text-white">
          MOST PLAYED CHAMPIONS
        </p>
        <p className="text-center text-base text-gray-300">
          You've faced the Rift with countless champions, proving your adaptability and unshakable
          resolve.
        </p>
      </div>

      {/* Champion List */}
      <div className="flex flex-col w-full px-4 divide-y divide-gray-700">
        {champions.map((champ, i) => (
          <div key={i} className="flex items-center gap-3 py-3">
            <img
              src={`https://ddragon.leagueoflegends.com/cdn/15.20.1/img/champion/${champ.name.replace(
                /\s+/g,
                '',
              )}.png`}
              alt={champ.name}
              className="w-[52px] h-[52px] object-cover"
            />
            <div className="flex flex-col text-white">
              <h2 className="text-lg font-[Bebas_Neue] tracking-wide">{champ.name}</h2>
              <div className="flex gap-3 text-sm text-gray-300">
                <p>{champ.matches} Matches</p>
                <p>{champ.wins} Wins</p>
                <p>{champ.winrate}% WR</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
