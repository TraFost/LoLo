import { useNavigate } from 'react-router';

import { MainNavbar } from '@/ui/organisms/navbar.organism';
import { Button } from '@/ui/atoms/button.atom';

export function NotFoundPage() {
  const navigate = useNavigate();

  const goHome = () => {
    navigate('/home');
  };

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <MainNavbar />

      <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
        <p className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.25em] text-white/60">
          404
        </p>
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Lost in the Rift</h1>
        <p className="max-w-xl text-base text-white/70 md:text-lg">
          We can&apos;t find the page you were looking for. Head back to the Rift to continue your
          League adventures with LoLo.
        </p>
        <Button
          variant="flat"
          color="primary"
          size="lg"
          className="font-semibold text-white"
          onClick={goHome}
        >
          Return Home
        </Button>
      </section>
    </div>
  );
}
