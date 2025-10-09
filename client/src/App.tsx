import { useState } from 'react';
import type { ApiResponse } from 'shared';

import mainLogo from '../public/assets/icon/lolo-main.webp';

import './App.css';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000';

function App() {
  const [data, setData] = useState<ApiResponse | undefined>();

  async function sendRequest() {
    try {
      const req = await fetch(`${SERVER_URL}/hello`);
      const res: ApiResponse = await req.json();
      setData(res);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div>
        <a href="https://github.com/TraFost/LoLo" target="_blank">
          <img src={mainLogo} className="logo" alt="LoLo logo" />
        </a>
      </div>
      <h1>LoLo</h1>
      <div className="card">
        <div className="button-container">
          <button onClick={sendRequest}>Call API</button>
        </div>
        {data && (
          <pre className="response">
            <code>
              Message: {data.message} <br />
              Success: {data.success.toString()}
            </code>
          </pre>
        )}
      </div>
    </>
  );
}

export default App;
