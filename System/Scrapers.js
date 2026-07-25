import axios from 'axios';
import { load as cheerioLoad } from 'cheerio';
const cheerio = { load: cheerioLoad };

async function pinterest(querry) {
  const { data } = await axios.get(
    'https://id.pinterest.com/search/pins/?autologin=true&q=' + querry,
    {
      headers: {
        cookie:
          '_auth=1; _b="AVna7S1p7l1C5I9u0+nR3YzijpvXOPc6d09SyCzO+DcwpersQH36SmGiYfymBKhZcGg="; _pinterest_sess=TWc9PSZHamJOZ0JobUFiSEpSN3Z4a2NsMk9wZ3gxL1NSc2k2NkFLaUw5bVY5cXR5alZHR0gxY2h2MVZDZlNQalNpUUJFRVR5L3NlYy9JZkthekp3bHo5bXFuaFZzVHJFMnkrR3lTbm56U3YvQXBBTW96VUgzVUhuK1Z4VURGKzczUi9hNHdDeTJ5Y2pBTmxhc2owZ2hkSGlDemtUSnYvVXh5dDNkaDN3TjZCTk8ycTdHRHVsOFg2b2NQWCtpOWxqeDNjNkk3cS85MkhhSklSb0hwTnZvZVFyZmJEUllwbG9UVnpCYVNTRzZxOXNJcmduOVc4aURtM3NtRFo3STlmWjJvSjlWTU5ITzg0VUg1NGhOTEZzME9SNFNhVWJRWjRJK3pGMFA4Q3UvcHBnWHdaYXZpa2FUNkx6Z3RNQjEzTFJEOHZoaHRvazc1c1UrYlRuUmdKcDg3ZEY4cjNtZlBLRTRBZjNYK0lPTXZJTzQ5dU8ybDdVS015bWJKT0tjTWYyRlBzclpiamdsNmtpeUZnRjlwVGJXUmdOMXdTUkFHRWloVjBMR0JlTE5YcmhxVHdoNzFHbDZ0YmFHZ1VLQXU1QnpkM1FqUTNMTnhYb3VKeDVGbnhNSkdkNXFSMXQybjRHL3pyZXRLR0ZTc0xHZ0JvbTJCNnAzQzE0cW1WTndIK0trY05HV1gxS09NRktadnFCSDR2YzBoWmRiUGZiWXFQNjcwWmZhaDZQRm1UbzNxc21pV1p5WDlabm1UWGQzanc1SGlrZXB1bDVDWXQvUis3elN2SVFDbm1DSVE5Z0d4YW1sa2hsSkZJb1h0MTFpck5BdDR0d0lZOW1Pa2RDVzNySWpXWmUwOUFhQmFSVUpaOFQ3WlhOQldNMkExeDIvMjZHeXdnNjdMYWdiQUhUSEFBUlhUVTdBMThRRmh1ekJMYWZ2YTJkNlg0cmFCdnU2WEpwcXlPOVZYcGNhNkZDd051S3lGZmo0eHV0ZE42NW8xRm5aRWpoQnNKNnNlSGFad1MzOHNkdWtER0xQTFN5Z3lmRERsZnZWWE5CZEJneVRlMDd2VmNPMjloK0g5eCswZUVJTS9CRkFweHc5RUh6K1JocGN6clc1JmZtL3JhRE1sc0NMTExZaTE=; _ir=0',
      },
    }
  );
  const $ = cheerio.load(data);
  const result = [];
  const fetchedresult = [];
  $('div > a')
    .get()
    .map((b) => {
      const link = $(b).find('img').attr('src');
      result.push(link);
    });
  result.forEach((v) => {
    if (v == undefined) return;
    fetchedresult.push(v.replace(/236/g, '736'));
  });
  fetchedresult.shift();
  return fetchedresult;
}

async function wallpaper(title, page = '1') {
  const { data } = await axios.get(
    `https://www.besthdwallpaper.com/search?CurrentPage=${page}&q=${encodeURIComponent(title)}`,
    { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36" } }
  );
  const $ = cheerio.load(data);
  const fetchedresult = [];
  $('div.grid-item').each(function (a, b) {
    fetchedresult.push({
      title: $(b).find('div.info > a > h3').text(),
      type: $(b).find('div.info > a:nth-child(2)').text(),
      source:
        'https://www.besthdwallpaper.com/' +
        $(b).find('div > a:nth-child(3)').attr('href'),
      image: [
        $(b).find('picture > img').attr('data-src') ||
          $(b).find('picture > img').attr('src'),
        $(b).find('picture > source:nth-child(1)').attr('srcset'),
        $(b).find('picture > source:nth-child(2)').attr('srcset'),
      ],
    });
  });
  return fetchedresult;
}

async function wikimedia(title) {
  const res = await axios.get(
    `https://commons.wikimedia.org/w/index.php?search=${title}&title=Special:MediaSearch&go=Go&type=image`
  );
  const $ = cheerio.load(res.data);
  const fetchedresult = [];
  $('.sdms-search-results__list-wrapper > div > a').each(function (a, b) {
    fetchedresult.push({
      title: $(b).find('img').attr('alt'),
      source: $(b).attr('href'),
      image:
        $(b).find('img').attr('data-src') || $(b).find('img').attr('src'),
    });
  });
  return fetchedresult;
}

async function quotesAnime() {
  const page = Math.floor(Math.random() * 184);
  const { data } = await axios.get(
    'https://otakotaku.com/quote/feed/' + page
  );
  const $ = cheerio.load(data);
  const fetchedresult = [];
  $('div.kotodama-list').each(function (l, h) {
    fetchedresult.push({
      link: $(h).find('a').attr('href'),
      gambar: $(h).find('img').attr('data-src'),
      karakter: $(h).find('div.char-name').text().trim(),
      anime: $(h).find('div.anime-title').text().trim(),
      episode: $(h).find('div.meta').text(),
      up_at: $(h).find('small.meta').text(),
      quotes: $(h).find('div.quote').text().trim(),
    });
  });
  return fetchedresult;
}

async function aiovideodl(link) {
  const src = await axios({
    url: 'https://aiovideodl.ml/',
    method: 'GET',
    headers: {
      'user-agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      cookie:
        'PHPSESSID=69ce1f8034b1567b99297eee2396c308; _ga=GA1.2.1360894709.1632723147; _gid=GA1.2.1782417082.1635161653',
    },
  });
  const a = cheerio.load(src.data);
  const token = a('#token').attr('value');
  const { data } = await axios({
    url: 'https://aiovideodl.ml/wp-json/aio-dl/video-data/',
    method: 'POST',
    headers: {
      'user-agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      cookie:
        'PHPSESSID=69ce1f8034b1567b99297eee2396c308; _ga=GA1.2.1360894709.1632723147; _gid=GA1.2.1782417082.1635161653',
    },
    data: new URLSearchParams(Object.entries({ url: link, token: token })),
  });
  return data;
}

async function umma(url) {
  const res = await axios.get(url);
  const $ = cheerio.load(res.data);
  const image = [];
  $('#article-content > div')
    .find('img')
    .each(function (a, b) {
      image.push($(b).attr('src'));
    });
  return {
    title: $('#wrap > div.content-container.font-6-16 > h1').text().trim(),
    author: {
      name: $(
        '#wrap > div.content-container.font-6-16 > div.content-top > div > div.user-ame.font-6-16.fw'
      )
        .text()
        .trim(),
      profilePic: $(
        '#wrap > div.content-container.font-6-16 > div.content-top > div > div.profile-photo > img.photo'
      ).attr('src'),
    },
    caption: $('#article-content > div > p').text().trim(),
    media: $('#article-content > div > iframe').attr('src')
      ? [$('#article-content > div > iframe').attr('src')]
      : image,
    type: $('#article-content > div > iframe').attr('src') ? 'video' : 'image',
    like: $(
      '#wrap > div.bottom-btns > div > button:nth-child(1) > div.text.font-6-12'
    ).text(),
  };
}

async function ringtone(title) {
  const { data } = await axios.get(
    'https://meloboom.com/en/search/' + title
  );
  const $ = cheerio.load(data);
  const fetchedresult = [];
  $(
    '#__next > main > section > div.jsx-2244708474.container > div > div > div > div:nth-child(4) > div > div > div > ul > li'
  ).each(function (a, b) {
    fetchedresult.push({
      title: $(b).find('h4').text(),
      source: 'https://meloboom.com/' + $(b).find('a').attr('href'),
      audio: $(b).find('audio').attr('src'),
    });
  });
  return fetchedresult;
}

async function styletext(teks) {
  const { data } = await axios.get(
    'http://qaz.wtf/u/convert.cgi?text=' + teks
  );
  const $ = cheerio.load(data);
  const fetchedresult = [];
  $('table > tbody > tr').each(function (a, b) {
    fetchedresult.push({
      name: $(b).find('td:nth-child(1) > span').text(),
      result: $(b).find('td:nth-child(2)').text().trim(),
    });
  });
  return fetchedresult;
}

export { pinterest, wallpaper, wikimedia, quotesAnime, aiovideodl, umma, ringtone, styletext };
export default { pinterest, wallpaper, wikimedia, quotesAnime, aiovideodl, umma, ringtone, styletext };
