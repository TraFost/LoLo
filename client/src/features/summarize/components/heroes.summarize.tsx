import { motion } from 'motion/react';
import { useRef } from 'react';

type Champions = { name: string; image: string; matches: number; wins: number; winrate: number }[];

const champions: Champions = [
  {
    name: 'Yuumi',
    matches: 543,
    wins: 30,
    winrate: 66.7,
    image: 'https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Yuumi_0.jpg',
  },
  {
    name: 'Aatrox',
    matches: 346,
    wins: 30,
    winrate: 66.7,
    image: 'https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Aatrox_0.jpg',
  },
  {
    name: 'Ahri',
    matches: 247,
    wins: 30,
    winrate: 66.7,
    image: 'https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Ahri_0.jpg',
  },
  {
    name: 'Jinx',
    matches: 215,
    wins: 30,
    winrate: 66.7,
    image: 'https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Jinx_0.jpg',
  },
  {
    name: 'Lee Sin',
    matches: 145,
    wins: 30,
    winrate: 66.7,
    image: 'https://ddragon.leagueoflegends.com/cdn/img/champion/loading/LeeSin_0.jpg',
  },
];

export function HeroesSummarize() {
  const ref = useRef(null);

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
          You've battled with 108 different champions across 1000 games. Talk about versatility!
        </p>
      </div>

      <Champions champions={champions} />
    </section>
  );
}

function Champions({ champions }: { champions: Champions }) {
  return (
    <div className="absolute top-[100vh] left-0 w-full flex flex-col items-center">
      {champions.map((champ, i) => {
        const isEven = i % 2 === 0;
        return (
          <motion.div
            key={i}
            className={`w-full flex justify-${isEven ? 'start' : 'end'} px-24 ${
              i !== 0 ? '-mt-24' : ''
            }`}
            initial={{ opacity: 0, x: isEven ? -100 : 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="relative overflow-hidden">
              <img
                src={champ.image}
                alt={champ.name}
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col">
                <h2 className="text-4xl font-bold text-white font-[Bebas_Neue] mb-2">
                  {champ.name}
                </h2>
                <div className="flex justify-between text-white/90 text-lg font-medium">
                  <p>{champ.matches} Matches</p>
                  <p>{champ.wins} Wins</p>
                  <p>{champ.winrate}% WR</p>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
