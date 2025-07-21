// lib/edgestore.ts
'use client'

import { createEdgeStoreProvider } from "@edgestore/react";

export const { EdgeStoreProvider, useEdgeStore } = createEdgeStoreProvider({
  // yahan bucket define karo
  buckets: {
    productImages: {}
  }
});
