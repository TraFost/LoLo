import { Button } from '../atoms/button.atom';
import { useNavigate } from 'react-router';

interface Props {
  error: string;
}

export function ErrorSection({ error }: Props) {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-full flex flex-col gap-4 justify-center items-center bg-gray-950 text-white overflow-hidden">
      <p className="text-4xl lg:text-7xl font-bold">Oops!</p>
      <p className="text-lg lg:text-2xl font-semibold">{error}</p>
      <Button color="custom" onClick={() => navigate('/analyze')}>
        Go Back
      </Button>
    </div>
  );
}
