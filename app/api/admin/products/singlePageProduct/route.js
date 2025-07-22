import { getSingleProduct } from "@/server/singlePageProducts";

export async function POST(req) {
    const { _id } = await req.json();
    const data = await getSingleProduct(_id);
    return Response.json(data, { status: 200 });
}
