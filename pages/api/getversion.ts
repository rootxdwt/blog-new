import type { NextApiRequest, NextApiResponse } from 'next'

interface versions {
    envVersion: number | undefined;
    env: string;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    let jsn: versions
    if (typeof process.env.PROD_VERSION !== "undefined") {
        jsn = { envVersion: parseFloat(process.env.PROD_VERSION), env: "Production" }
    } else {
        jsn = { envVersion: parseFloat(process.env.PREVIEW_VERSION!), env: "Preview" }
    }
    res.status(200).json(jsn)
}