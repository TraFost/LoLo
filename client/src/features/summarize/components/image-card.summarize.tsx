import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/ui/atoms/button.atom';
import { HextechDivider } from '@/ui/atoms/hextech-divider';
import { ChampionStats, RoleDistribution, StatisticItem } from 'shared/src/types/statistics.type';
import { downloadToPng } from '../utils/image-card/download-to-png.util';
import { getChampionIdForDDragon } from '../utils/champion/parse-champion-name.util';
import { ProComparisonDTO } from 'shared/src/types/analyze.dto';
import type { ShareCardType } from 'shared/src/types/share.type';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/ui/atoms/carousel';
import {
  FacebookIcon,
  FacebookShareButton,
  TwitterShareButton,
  RedditShareButton,
  XIcon,
  RedditIcon,
} from 'react-share';
import { Popover, PopoverContent, PopoverTrigger } from '@/ui/atoms/popover';
import { Share } from 'lucide-react';

import { PLAYER_IMAGES } from '@/core/constants/player.constant';
import { getOrCreateShareUrl } from '../utils/share/get-or-create-share-url.util';

interface Props {
  children: React.ReactNode;
}

interface CardProps {
  playerName: string;
  puuid: string;
}

interface PlayerOverviewProps extends CardProps {
  statistics: StatisticItem[];
  roleDistribution: RoleDistribution[];
}

interface MostPlayedChampionsProps extends CardProps {
  playerName: string;
  champions: ChampionStats[];
}

interface PlayerComparisonProps extends CardProps {
  comparison: ProComparisonDTO;
}

export function ImageCardSection({ children }: Props) {
  return (
    <section className="w-full px-4 flex flex-col lg:flex-row items-center justify-center font-bold mt-24 lg:-mt-48">
      <div className="text-center -mb-96 md:-mb-64 lg:-mb-0 z-50 px-2 lg:order-2 lg:max-w-1/4 lg:w-full">
        <p className="text-5xl 2xl:text-6xl font-bold">Share your achievements</p>
        <p className="text-lg font-light text-gray-300 text-center mt-2 mb-8">
          Let everyone see your top champions and proudest moments
        </p>
      </div>
      <Carousel className="w-full md:w-3/4 lg:w-1/2 2xl:w-5/12">
        <CarouselContent className="flex">
          {Array.isArray(children) ? (
            children.map((child, idx) => (
              <CarouselItem
                key={idx}
                className="flex justify-center scale-[0.4] md:scale-[0.6] select-none"
              >
                {child}
              </CarouselItem>
            ))
          ) : (
            <CarouselItem className="flex justify-center">{children}</CarouselItem>
          )}
        </CarouselContent>

        <CarouselPrevious className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10" />
        <CarouselNext className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10" />
      </Carousel>
    </section>
  );
}

export function MostPlayedChampionsCard({
  playerName,
  champions,
  puuid,
}: MostPlayedChampionsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [isPreparingShare, setIsPreparingShare] = useState(false);
  const bgImageUrl = '/assets/background/Demacia_City.webp';
  const cardType: ShareCardType = 'most-played';

  useEffect(() => {
    setShareUrl(null);
    setIsPreparingShare(false);
  }, [puuid]);

  const handlePrepareShare = useCallback(async () => {
    if (shareUrl || isPreparingShare) return;
    setIsPreparingShare(true);

    try {
      const url = await getOrCreateShareUrl({
        puuid,
        cardType,
        ref,
      });
      setShareUrl(url);
    } catch (error) {
      console.error('[MostPlayedChampionsCard] Failed to prepare share image', error);
      throw error;
    } finally {
      setIsPreparingShare(false);
    }
  }, [cardType, isPreparingShare, puuid, shareUrl]);

  function Stat({
    label,
    value,
    highlight = false,
  }: {
    label: string;
    value: string | number;
    highlight?: boolean;
  }) {
    return (
      <div className="flex-1">
        <p className={`font-bold ${highlight ? 'text-yellow-400' : 'text-white'} tracking-tight`}>
          {value}
        </p>
        <p className="text-gray-300 text-xs tracking-wider mt-1">{label}</p>
      </div>
    );
  }

  function ChampionCard({
    champion,
    size = 'sm',
  }: {
    champion: ChampionStats;
    size?: 'lg' | 'sm';
  }) {
    const sizes = {
      sm: { img: 'h-[330px]', name: 'text-3xl', stat: 'text-sm', pad: 'py-4', overlay: 'pt-16' },
      lg: { img: 'h-[400px]', name: 'text-5xl', stat: 'text-base', pad: 'py-5', overlay: 'pt-20' },
    }[size];
    const championId = getChampionIdForDDragon(champion.name);

    return (
      <div className="relative overflow-hidden bg-gray-900 border border-yellow-800/30">
        <img
          src={`https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${championId}_0.jpg`}
          alt={champion.name}
          className={`object-cover w-full ${sizes.img}`}
        />

        <div
          className={`absolute bottom-0 w-full bg-gradient-to-t from-black via-black/90 to-transparent ${sizes.overlay}`}
        >
          <div className={`flex flex-col items-center text-white ${sizes.pad} space-y-3`}>
            <p className={`font-bebas-neue font-bold tracking-wide ${sizes.name} text-white`}>
              {champion.name}
            </p>

            {/* Stats */}
            <div className={`flex justify-between w-full px-1 text-center ${sizes.stat} space-x-2`}>
              <Stat label="MATCHES" value={champion.matches} highlight={false} />
              <Stat label="WINS" value={champion.wins} highlight={false} />
              <Stat
                label="WINRATE"
                value={`${champion.winrate.toFixed(1)}%`}
                highlight={champion.winrate >= 50}
              />
            </div>
          </div>
        </div>

        <div className="absolute top-0 w-full h-20 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        ref={ref}
        className="relative w-[900px] h-[1200px] text-white bg-cover bg-center
                 border border-yellow-900/60 p-2.5"
        style={{
          backgroundImage: `url(${bgImageUrl})`,
        }}
      >
        <div className="relative w-full h-full flex flex-col border border-yellow-600/40">
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/90" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-900/30 via-transparent to-transparent opacity-50" />

          <div className="relative z-10 flex flex-col h-full gap-4 px-8 py-16">
            {/* Header */}
            <header className="text-center">
              <p className="text-6xl font-bebas-neue tracking-wider">Most Played Champions</p>
              <p className="text-3xl tracking-wide opacity-80 font-light mt-1">{playerName}</p>
              <div className="mt-5 flex justify-center">
                <HextechDivider />
              </div>
            </header>

            {/* Content */}
            <main className="flex-grow flex justify-evenly items-center mt-6">
              <div className="flex flex-col justify-around h-[720px]">
                <ChampionCard champion={champions[1]} size="sm" />
                <ChampionCard champion={champions[3]} size="sm" />
              </div>

              <div className="flex flex-col items-center justify-center">
                <ChampionCard champion={champions[0]} size="lg" />
              </div>

              <div className="flex flex-col justify-around h-[720px]">
                <ChampionCard champion={champions[2]} size="sm" />
                <ChampionCard champion={champions[4]} size="sm" />
              </div>
            </main>

            <footer className="relative flex flex-col items-center text-center mt-auto">
              <HextechDivider />
              <p className="uppercase text-sm tracking-[0.3em] mt-6 text-gray-400">Generated by</p>
              <p className="text-3xl font-bebas-neue tracking-widest mt-1">LoLo</p>
            </footer>
          </div>
        </div>
      </div>
      <div className="flex gap-24 justify-center w-full">
        <Button
          size="lg"
          variant="flat"
          className="scale-125"
          onClick={() => downloadToPng(ref, 'LoLo - Most Champions Played')}
        >
          Download
        </Button>
        <ShareButton
          title={`On the grind with ${champions[0].name}: ${
            champions[0].matches
          } games and ${champions[0].winrate.toFixed(1)}% wins!`}
          shareUrl={shareUrl}
          onPrepareShare={handlePrepareShare}
          isPreparing={isPreparingShare}
        />
      </div>
    </div>
  );
}

export function PlayerOverviewCard({
  playerName,
  statistics,
  roleDistribution,
  puuid,
}: PlayerOverviewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [isPreparingShare, setIsPreparingShare] = useState(false);
  const bgImageUrl = '/assets/background/Shurima.webp';
  const cardType: ShareCardType = 'player-overview';

  useEffect(() => {
    setShareUrl(null);
    setIsPreparingShare(false);
  }, [puuid]);

  const handlePrepareShare = useCallback(async () => {
    if (shareUrl || isPreparingShare) return;
    setIsPreparingShare(true);

    try {
      const url = await getOrCreateShareUrl({ puuid, cardType, ref });
      setShareUrl(url);
    } catch (error) {
      console.error('[PlayerOverviewCard] Failed to prepare share image', error);
      throw error;
    } finally {
      setIsPreparingShare(false);
    }
  }, [cardType, isPreparingShare, puuid, shareUrl]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        ref={ref}
        className="relative w-[900px] h-[1200px] flex flex-col text-white overflow-hidden border border-yellow-900/60 p-2.5"
        style={{
          backgroundImage: `url(${bgImageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="relative w-full h-full flex flex-col border border-yellow-600/40">
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/90" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-900/30 via-transparent to-transparent opacity-50" />

          {/* HEADER */}
          <header className="relative flex flex-col items-center text-center mt-20 z-10">
            <p className="text-6xl font-bebas-neue tracking-wider">PLAYER OVERVIEW</p>
            <p className="text-3xl tracking-wide opacity-80 font-light">{playerName}</p>
            <div className="mt-6">
              <HextechDivider />
            </div>
          </header>

          {/* STATISTICS */}
          <main className="relative z-10 flex flex-col items-center flex-grow mt-16">
            <p className="text-3xl font-bebas-neue mb-4 tracking-wider">YOUR STATS</p>

            <div className="grid grid-cols-3 gap-x-12 text-center px-24 mb-12">
              {statistics.slice(0, 3).map((stat, i) => (
                <div key={i} className="flex flex-col items-center">
                  <p className="text-6xl font-bebas-neue text-yellow-400 tracking-wider leading-none">
                    {stat.value}
                  </p>
                  <p className="text-xl uppercase tracking-[0.2em] opacity-90 mt-2">{stat.title}</p>
                  <p className="text-lg opacity-60 mt-1.5 font-light">{stat.subtitle}</p>
                </div>
              ))}
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-2 gap-x-20 text-center">
              {statistics.slice(3, 5).map((stat, i) => (
                <div key={i} className="flex flex-col items-center">
                  <p className="text-6xl font-bebas-neue text-yellow-400 tracking-wider leading-none">
                    {stat.value}
                  </p>
                  <p className="text-xl uppercase tracking-[0.2em] opacity-90 mt-2">{stat.title}</p>
                  <p className="text-lg opacity-60 mt-1.5 font-light">{stat.subtitle}</p>
                </div>
              ))}
            </div>
          </main>

          {/* ROLE DISTRIBUTION */}
          <section className="relative z-10 flex flex-col items-center mt-auto mb-20 px-20">
            <p className="text-3xl font-bebas-neue mb-4 tracking-wider">ROLE DISTRIBUTION</p>
            <div className="w-full flex justify-between text-center space-x-4">
              {roleDistribution.map((role, i) => (
                <div key={i} className="flex flex-col items-center w-full">
                  <p className="text-lg font-semibold tracking-widest opacity-90 uppercase">
                    {role.role}
                  </p>

                  <div
                    className="w-24 h-24 my-3 flex items-center justify-center 
                                border-2 border-gray-600 bg-black/30"
                  >
                    <img src={`/assets/icon/${role.role}_icon.webp`} alt={`${role.role} Icon`} />
                  </div>

                  <p className="text-4xl font-bebas-neue text-yellow-400 tracking-wider mt-1">
                    {role.value}
                  </p>
                  <p className="text-sm uppercase tracking-widest opacity-70">Games</p>
                </div>
              ))}
            </div>
          </section>

          {/* FOOTER */}
          <footer className="relative z-10 flex flex-col items-center text-center pb-12 opacity-70">
            <HextechDivider />
            <p className="uppercase text-sm tracking-[0.3em] mt-6">Generated by</p>
            <p className="text-3xl font-bebas-neue tracking-widest mt-1">LoLo</p>
          </footer>
        </div>
      </div>
      <div className="flex gap-24 justify-center w-full">
        <Button
          size="lg"
          variant="flat"
          className="scale-125"
          onClick={() => downloadToPng(ref, 'LoLo - Player Overview')}
        >
          Download
        </Button>
        <ShareButton
          title={`My LoLo snapshot: ${statistics[0].value} ${statistics[0].title} and ${statistics[1].value} ${statistics[1].title}!`}
          shareUrl={shareUrl}
          onPrepareShare={handlePrepareShare}
          isPreparing={isPreparingShare}
        />
      </div>
    </div>
  );
}

export function PlayerComparisonCard({ playerName, comparison, puuid }: PlayerComparisonProps) {
  const { playerAnalysis, proPlayer } = comparison;

  const ref = useRef<HTMLDivElement>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [isPreparingShare, setIsPreparingShare] = useState(false);
  const bgImageUrl = '/assets/background/Poro_King.webp';
  const proPlayerImageUrl = PLAYER_IMAGES[proPlayer.name.toLowerCase()];
  const cardType: ShareCardType = 'pro-comparison';

  useEffect(() => {
    setShareUrl(null);
    setIsPreparingShare(false);
  }, [puuid]);

  const handlePrepareShare = useCallback(async () => {
    if (shareUrl || isPreparingShare) return;
    setIsPreparingShare(true);

    try {
      const url = await getOrCreateShareUrl({ puuid, cardType, ref });
      setShareUrl(url);
    } catch (error) {
      console.error('[PlayerComparisonCard] Failed to prepare share image', error);
      throw error;
    } finally {
      setIsPreparingShare(false);
    }
  }, [cardType, isPreparingShare, puuid, shareUrl]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        ref={ref}
        className="relative w-[900px] h-[1200px] flex flex-col text-white overflow-hidden border border-yellow-900/60 p-2.5"
        style={{
          backgroundImage: `url(${bgImageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="relative w-full h-full flex flex-col border border-yellow-600/40 overflow-hidden">
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/90" />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 via-transparent to-transparent opacity-40" />

          <div className="relative z-10 flex flex-col h-full overflow-hidden hide-scrollbar px-12 py-8">
            {/* HEADER */}
            <header className="flex flex-col items-center text-center mb-6 mt-4">
              <p className="text-6xl font-bebas-neue tracking-wider">PRO PLAYER ANALYSIS</p>
              <div className="my-3">
                <HextechDivider />
              </div>
            </header>

            {/* GRID SECTION */}
            <main className="grid grid-cols-[1.1fr_0.9fr] gap-x-10">
              {/* PLAYER PROFILE */}
              <div>
                <p className="text-4xl font-bebas-neue tracking-wider mb-4">YOUR PROFILE</p>
                <div className="flex flex-col gap-3">
                  {playerAnalysis.map((item) => (
                    <div key={item.label}>
                      <p className="text-lg uppercase tracking-[0.2em] opacity-70">{item.label}</p>
                      <p className="text-xl tracking-wide text-yellow-400 font-semibold">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>

                <p className="text-4xl font-bebas-neue tracking-wider mt-6 mb-3">
                  CORE SIMILARITIES
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {proPlayer.similarities.map((sim) => (
                    <span
                      key={sim}
                      className="py-1 px-3 bg-yellow-600/10 border border-yellow-600/40 
                               text-yellow-300 text-base font-semibold tracking-wider uppercase"
                    >
                      {sim}
                    </span>
                  ))}
                </div>
              </div>

              {/* PRO PLAYER IMAGE */}
              <div className="flex flex-col items-center">
                <p className="text-4xl mt-2">{playerName}</p>
                <p className="text-lg tracking-widest opacity-90">YOU PLAY LIKE</p>
                <p className="text-5xl font-bebas-neue text-yellow-400 tracking-wider leading-none mt-1">
                  {proPlayer.name.toUpperCase()}
                </p>
                <div
                  className="w-full h-[360px]"
                  style={{
                    backgroundImage: `url(${proPlayerImageUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'top center',
                  }}
                />
                <div className="mt-4">
                  <p className="text-lg opacity-80">{proPlayer.role}</p>
                  <p className="text-lg opacity-80">{proPlayer.playstyle}</p>
                </div>
              </div>
            </main>

            {/* ANALYSIS */}
            <section className="mt-6">
              <p className="text-4xl font-bebas-neue tracking-wider mb-3">PLAYSTYLE BREAKDOWN</p>
              <div className="flex flex-col gap-2.5 font-light opacity-90 text-sm leading-relaxed">
                {proPlayer.playstyleDetails.map((detail, i) => (
                  <div key={i} className="flex flex-row items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-yellow-600/70 rotate-45 mt-2 flex-shrink-0" />
                    <p className="text-xl">{detail}</p>
                  </div>
                ))}
              </div>
              <div className="w-full h-[1px] bg-gradient-to-r from-yellow-600/50 via-yellow-400/20 to-transparent my-4" />
              <p className="text-lg italic text-yellow-200/90 text-center leading-snug">
                "{proPlayer.summary}"
              </p>
            </section>

            {/* FOOTER */}
            <footer className="flex flex-col items-center text-center mt-5 opacity-70">
              <HextechDivider />
              <p className="uppercase text-sm tracking-[0.3em] mt-4">Generated by</p>
              <p className="text-3xl font-bebas-neue tracking-widest mt-1">LoLo</p>
            </footer>
          </div>
        </div>
      </div>
      <div className="flex gap-24 justify-center w-full">
        <Button
          size="lg"
          variant="flat"
          className="scale-125"
          onClick={() => downloadToPng(ref, 'LoLo - Pro Player Analysis')}
        >
          Download
        </Button>
        <ShareButton
          title={`Apparently I channel ${proPlayer.name} every game!`}
          shareUrl={shareUrl}
          onPrepareShare={handlePrepareShare}
          isPreparing={isPreparingShare}
        />
      </div>
    </div>
  );
}

interface ShareButtonProps {
  title: string;
  shareUrl: string | null;
  onPrepareShare: () => Promise<void> | void;
  isPreparing: boolean;
}

function ShareButton({ title, shareUrl, onPrepareShare, isPreparing }: ShareButtonProps) {
  const fallbackUrl =
    typeof window !== 'undefined' && typeof window.origin === 'string'
      ? `${window.origin}/analyze`
      : '/analyze';
  const targetUrl = shareUrl ?? fallbackUrl;
  const appUrl =
    typeof window !== 'undefined' && typeof window.origin === 'string'
      ? `${window.origin}/analyze`
      : 'https://d35c9ic8mbrtt5.cloudfront.net/analyze';
  const shareText = `${title}\nTry LoLo yourself: ${appUrl}`;

  const handleTriggerClick = () => {
    if (shareUrl) return;
    Promise.resolve(onPrepareShare()).catch((error) => {
      console.error('[ShareButton] Failed to prepare share image', error);
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'flat'}
          size={'lg'}
          color="accent"
          className="scale-125 flex items-center gap-2"
          onClick={handleTriggerClick}
          disabled={isPreparing}
        >
          <Share />
          {isPreparing ? 'Preparing...' : 'Share'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit flex flex-col gap-2 bg-neutral-900/90 rounded-none text-white">
        {isPreparing && !shareUrl ? (
          <div className="px-4 py-2 text-sm text-gray-300">Preparing preview...</div>
        ) : (
          <>
            <TwitterShareButton
              url={targetUrl}
              title={shareText}
              className="flex items-center gap-4 w-full"
            >
              <XIcon size={36} />
              <span>X</span>
            </TwitterShareButton>
            <FacebookShareButton
              url={targetUrl}
              title={shareText}
              className="flex items-center gap-4 w-full"
            >
              <FacebookIcon size={36} />
              <span>Facebook</span>
            </FacebookShareButton>
            <RedditShareButton
              url={targetUrl}
              title={shareText}
              className="flex items-center gap-4 w-full"
            >
              <RedditIcon size={36} />
              <span>Reddit</span>
            </RedditShareButton>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
