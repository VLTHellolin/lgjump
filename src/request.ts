import { randomInt, sample } from 'es-toolkit';
import ky from 'ky';

export async function submitSelection(value: string): Promise<void> {
  let page = randomInt(1, 51);
  let html = '';

  while (html === '') {
    try {
      html = await ky.get('https://www.luogu.com.cn/problem/list', {
        searchParams: {
          type: 'luogu',
          difficulty: value,
          page,
        },
      }).text();
    } catch {
      html = '';
      page = randomInt(1, page);
    }
  }

  const rawContext = new DOMParser().parseFromString(html, 'text/html').querySelector('#lentille-context')?.textContent;
  const context = JSON.parse(rawContext || '{}')?.data?.problems?.result as { pid: string }[];

  const pid = sample(context).pid;
  if (pid) {
    const url = `https://www.luogu.com.cn/problem/${pid}`;
    // navigate to the problem
    window.location.href = url;
  } else {
    // eslint-disable-next-line no-alert
    alert('Plz try again');
    // Try again
    // void submitSelection(value);
  }
}
