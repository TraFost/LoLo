import { HeroesSummarize } from '../components/heroes.summarize';
import { RecapIntro } from '../components/recap-intro.summarize';
import { Statistics } from '../components/statistics.summarize';

export function SummarizePage() {
  return (
    <div className="flex flex-col items-center bg-gray-950 text-white">
      <RecapIntro />
      <Statistics />
      <HeroesSummarize />
      <div className="h-[1000px]">
        <p className="text-5xl lg:text-7xl font-bold my-24 text-center mt-40 px-52">
          enough with the stats — let's see how your gameplay really looks!
        </p>
      </div>
    </div>
  );
}
