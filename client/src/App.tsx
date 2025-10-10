import mainLogo from '@assets/icon/lolo-main.webp';

import { Button } from '@/components/ui/atoms/button';

// import { useState } from 'react';
// import type { ApiResponse } from 'shared';

// const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000';

function App() {
  // const [data, setData] = useState<ApiResponse | undefined>();

  // async function sendRequest() {
  //   try {
  //     const req = await fetch(`${SERVER_URL}/hello`);
  //     const res: ApiResponse = await req.json();
  //     setData(res);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  return (
    <section className="flex items-center justify-center size-full flex-col">
      <div>
        <a href="https://github.com/TraFost/LoLo" target="_blank">
          <img src={mainLogo} className="bg-white" alt="LoLo logo" />
        </a>
      </div>

      <h1>LoLo</h1>

      <Button className="">test</Button>
    </section>
  );
}

export default App;
