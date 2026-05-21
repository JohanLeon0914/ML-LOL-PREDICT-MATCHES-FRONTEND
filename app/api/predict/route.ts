import { NextResponse } from "next/server";

const PREDICT_API_URL = process.env.PREDICT_API_URL;

export async function POST(req: Request) {
  if (!PREDICT_API_URL) {
    return NextResponse.json({ error: "PREDICT_API_URL no está configurada." }, { status: 500 });
  }

  try {
    const body = await req.json();
    const response = await fetch(PREDICT_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json({ error: "Error al conectar con el servicio de predicción." }, { status: 500 });
  }
}
