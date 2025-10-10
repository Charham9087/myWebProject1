"use server";

import { cache } from "react";
import { revalidateTag } from "next/cache";
import ConnectDB from "@/components/mongoConnect";
import Products from "@/components/models/products";
import catalogue from "@/components/models/catalogue";

// ✅ Remove revalidate here – not allowed in use server file

export const GetCatalogueWithProducts = cache(async function () {
  await ConnectDB();
  // ...
}, { tags: ["catalogues"] });

export async function SaveCatalogue(data) {
  await ConnectDB();
  await catalogue.create({ name: data.name });
  revalidateTag("catalogues");
}

export const showCatalogue = cache(async function () {
  await ConnectDB();
  const catalogues = await catalogue.find();
  return catalogues.map(c => c.name);
}, { tags: ["catalogues"] });
