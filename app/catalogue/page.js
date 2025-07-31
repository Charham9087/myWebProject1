"use client"

import CataloguePage from "@/components/FrontendComponents/catalogue/page"; 
import { GetCatalogueWithProducts, SaveCatalogue, showCatalogue } from "@/server/catalogue-functions";
export default function CATALOGUE(){

    return (
        <CataloguePage GetCatalogueWithProducts={GetCatalogueWithProducts} />
    
    )
}