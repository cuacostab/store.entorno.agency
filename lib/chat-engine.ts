import OpenAI from "openai";
import { buildSystemPrompt } from "./bot-context";
import { searchProducts, getProduct } from "./syscom-client";
import { stripProduct, stripProductDetail } from "./strip-prices";
import type { Product, ProductDetail } from "./syscom-types";

// ─── Types ───────────────────────────────────────────────────────────────────

type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

export type ProductCardData = {
  producto_id: number;
  titulo: string;
  modelo: string;
  marca: string;
  img_portada: string;
  stock: "disponible" | "agotado" | "bajo";
  link: string;
  precio: number;
  precio_formato: string;
};

export type ChatResult = {
  text: string;
  products: ProductCardData[];
  leadData: { name?: string; email?: string; phone?: string } | null;
};

// ─── Session store ───────────────────────────────────────────────────────────

const sessions = new Map<string, { messages: ChatMessage[]; ts: number }>();
const TTL = 30 * 60_000;
const MAX_HISTORY = 10;

function cleanSessions() {
  const now = Date.now();
  for (const [id, s] of sessions) {
    if (now - s.ts > TTL) sessions.delete(id);
  }
}

// ─── OpenAI Function definitions ─────────────────────────────────────────────

const tools: OpenAI.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "search_products",
      description: "Busca productos en el catálogo de Syscom. Usa esto cuando el cliente pida productos, equipos o soluciones.",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string", description: "Palabras clave de búsqueda (ej: 'cámara domo 4mp', 'switch poe 8 puertos')" },
          category: { type: "string", description: "ID de categoría Syscom (ej: '22' para Videovigilancia)" },
          brand: { type: "string", description: "ID de marca (ej: 'hikvision', 'ubiquiti')" },
        },
        required: [],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_product_detail",
      description: "Obtiene el detalle completo de un producto por su ID. Usa esto cuando el cliente quiera más info de un producto específico.",
      parameters: {
        type: "object",
        properties: {
          product_id: { type: "number", description: "El producto_id numérico del producto" },
        },
        required: ["product_id"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "capture_lead",
      description: "Captura los datos de contacto del cliente cuando los proporciona voluntariamente.",
      parameters: {
        type: "object",
        properties: {
          name: { type: "string", description: "Nombre del cliente" },
          email: { type: "string", description: "Email del cliente" },
          phone: { type: "string", description: "Teléfono del cliente" },
        },
        required: [],
      },
    },
  },
];

// ─── Tool execution ──────────────────────────────────────────────────────────

function toCardData(p: Product | ProductDetail): ProductCardData {
  return {
    producto_id: p.producto_id,
    titulo: p.titulo,
    modelo: p.modelo,
    marca: p.marca,
    img_portada: p.img_portada,
    stock: p.stock,
    link: `/productos/${p.producto_id}`,
    precio: p.precio,
    precio_formato: p.precio_formato,
  };
}

async function executeTool(
  name: string,
  args: Record<string, unknown>,
): Promise<{ result: string; products: ProductCardData[]; leadData: ChatResult["leadData"] }> {
  let products: ProductCardData[] = [];
  let leadData: ChatResult["leadData"] = null;

  if (name === "search_products") {
    const data = await searchProducts({
      query: args.query as string | undefined,
      category: args.category as string | undefined,
      brand: args.brand as string | undefined,
    });
    const stripped = await Promise.all((data.productos ?? []).map(stripProduct));
    products = stripped.slice(0, 6).map(toCardData);
    const summary = stripped.slice(0, 6).map(p =>
      `- **${p.titulo}** (${p.modelo}) — ${p.marca} — ${p.precio_formato} — Stock: ${p.stock}`
    ).join("\n");
    return {
      result: `Encontré ${data.cantidad} productos. Los primeros ${products.length}:\n${summary}`,
      products,
      leadData: null,
    };
  }

  if (name === "get_product_detail") {
    const detail = await getProduct(args.product_id as number);
    const stripped = await stripProductDetail(detail);
    products = [toCardData(stripped)];
    const chars = (stripped.caracteristicas ?? []).slice(0, 5).map(c => `- ${c}`).join("\n");
    return {
      result: `**${stripped.titulo}** (${stripped.modelo})\nMarca: ${stripped.marca}\nPrecio: ${stripped.precio_formato}\nStock: ${stripped.stock}\n${stripped.descripcion ? `Descripción: ${stripped.descripcion.slice(0, 300)}` : ""}\n${chars ? `Características:\n${chars}` : ""}`,
      products,
      leadData: null,
    };
  }

  if (name === "capture_lead") {
    leadData = {};
    if (args.name) leadData.name = args.name as string;
    if (args.email) leadData.email = args.email as string;
    if (args.phone) leadData.phone = args.phone as string;
    return {
      result: "Datos de contacto guardados correctamente. Se le contactará con su cotización.",
      products: [],
      leadData,
    };
  }

  return { result: "Herramienta no reconocida", products: [], leadData: null };
}

// ─── Main chat function ──────────────────────────────────────────────────────

export async function chat(sessionId: string, userMessage: string): Promise<ChatResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY not configured");

  if (Math.random() < 0.1) cleanSessions();

  let session = sessions.get(sessionId);
  if (!session) {
    session = { messages: [], ts: Date.now() };
    sessions.set(sessionId, session);
  }
  session.ts = Date.now();
  session.messages.push({ role: "user", content: userMessage });

  if (session.messages.length > MAX_HISTORY * 2) {
    session.messages = session.messages.slice(-MAX_HISTORY * 2);
  }

  const openai = new OpenAI({ apiKey });
  const systemPrompt = buildSystemPrompt();

  let allProducts: ProductCardData[] = [];
  let allLeadData: ChatResult["leadData"] = null;

  const messages: OpenAI.ChatCompletionMessageParam[] = [
    { role: "system", content: systemPrompt },
    ...session.messages,
  ];

  // Loop to handle tool calls
  let maxIterations = 5;
  while (maxIterations-- > 0) {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.7,
      max_tokens: 800,
      messages,
      tools,
    });

    const choice = completion.choices[0];
    const assistantMessage = choice.message;

    if (!assistantMessage.tool_calls?.length) {
      // No tool calls — return text response
      const text = assistantMessage.content ?? "";
      session.messages.push({ role: "assistant", content: text });
      return { text, products: allProducts, leadData: allLeadData };
    }

    // Process tool calls
    messages.push(assistantMessage);

    for (const toolCall of assistantMessage.tool_calls) {
      try {
        const args = JSON.parse(toolCall.function.arguments);
        const { result, products, leadData } = await executeTool(toolCall.function.name, args);
        allProducts = [...allProducts, ...products];
        if (leadData) allLeadData = { ...(allLeadData ?? {}), ...leadData };

        messages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: result,
        });
      } catch (err) {
        messages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: `Error: ${err instanceof Error ? err.message : "Unknown error"}`,
        });
      }
    }
  }

  // Fallback if max iterations exceeded
  const fallback = "Disculpa, tuve un problema procesando tu solicitud. ¿Puedes intentar de nuevo?";
  session.messages.push({ role: "assistant", content: fallback });
  return { text: fallback, products: allProducts, leadData: allLeadData };
}
