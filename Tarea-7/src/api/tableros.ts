
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const BASE_URL = "http://localhost:4321"; // URL donde corre json-server

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      // Pasamos cualquier query param que venga
      const query = new URLSearchParams(req.query as any).toString();
      const response = await axios.get(`${BASE_URL}/tableros?${query}`);
      res.status(200).json(response.data);
    } else if (req.method === "POST") {
      const response = await axios.post(`${BASE_URL}/tableros`, req.body);
      res.status(201).json(response.data);
    } else {
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
