import { NextRequest, NextResponse } from 'next/server';
import { Storage } from '@google-cloud/storage';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import OpenAI from 'openai';

const storage = new Storage({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

const visionClient = new ImageAnnotatorClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const uploadImageToStorage = async (
  imageBuffer: Buffer,
  playlistId: string,
  metadata: { contentType: string },
): Promise<string> => {
  const bucket = storage.bucket('your-bucket-name');
  const file = bucket.file(`playlists/${playlistId}/${new Date().toISOString()}.png`);

  await file.save(imageBuffer, { metadata });
  const downloadUrl = await file.getSignedUrl({
    action: 'read',
    expires: '03-09-2491',
  });

  return downloadUrl[0];
};

export async function POST(req: NextRequest) {
  try {
    const { query, imageUrl, playlistId } = await req.json();

    const imageBuffer = Buffer.from(imageUrl.split(',')[1], 'base64');
    const metadata = { contentType: 'image/png' };

    const imageUrlResult = await uploadImageToStorage(imageBuffer, playlistId, metadata);

    if (!imageUrlResult) {
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }

    // OCR 처리
    const [ocrResult] = await visionClient.textDetection(imageUrlResult);
    const detections = ocrResult.textAnnotations;
    const text = detections?.length ? detections[0].description : '';

    // OpenAI API 호출
    const prompt = `Context: ${text}\n\nQuery: ${query}\n\nResponse:`;
    const response = await openai.completions.create({
      model: 'text-davinci-003',
      prompt,
      max_tokens: 150,
    });

    const analysis = response.choices[0].text.trim();

    return NextResponse.json({ analysis }, { status: 200 });
  } catch (error) {
    console.error('Error processing request:', error);

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
