const SERVER = "http://localhost:8080";

const postData = async (url = '', data = {}) => {
    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(data)
    });
    return response.json();
};

export const getGameRound = async () => {
    const result = await fetch(`${SERVER}/round`);
    const data = await result.json();
    return data;
};

export const getGameHistory = async () => {
    const result = await fetch(`${SERVER}/history`);
    const { history } = await result.json();
    return history;
};

export const postAction = async (action: string, payload: any = null) => {
  const data = await postData(`${SERVER}/action?action=${action}${payload ? '&payload=' + payload : ''}`);
    return data;
};

export const simulateRounds = async (methods: string, noOfSimulations: string) => {
  const result = await fetch(`${SERVER}/simulate?methods=${methods}&simulations=${noOfSimulations}`);
  const data = await result.json();
  return data;
};