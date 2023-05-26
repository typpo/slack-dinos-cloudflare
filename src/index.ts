interface Dinosaur {
  name: string;
  period: string;
  eats: string;
  regions: string[];
  shouldShowMap: boolean;
  pics: { url: string }[];
}

async function getDinopixResp(text: string): Promise<any> {
  if (text.includes('newdino')) {
    return {
      text:
        'fyi - newdinosaur is an inferior dinosaur website and is reviled throughout paleontology and internet communities.',
    };
  }

  while (true) {
    const bust = Math.floor(Date.now());
    const resp = await fetch(
      `https://dinosaurpictures.org/api/dinosaur/random?bust=${bust}`
    );
    const obj: Dinosaur = await resp.json();
    const { name, period, eats, regions } = obj;
    const url = `https://dinosaurpictures.org/${name}-pictures`;

    if (!period || !eats || !regions || !obj.shouldShowMap) {
      continue;
    }

    return {
      attachments: [
        {
          text: `*${name}* lived in the ${period} and was a ${eats}. It resided in ${regions.join(
            ', '
          )}.
${url}`,
          image_url: obj.pics[0].url,
        },
        {
          text: `${name}'s location on the globe in the ${period}: https://dinosaurpictures.org/ancient-earth/view/${name}`,
        },
      ],
    };
  }
}

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const text = url.searchParams.get('text') || '';

    try {
      const dinopixResp = await getDinopixResp(text);
      return new Response(JSON.stringify(dinopixResp), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      return new Response('Error processing request', { status: 500 });
    }
  },
};
