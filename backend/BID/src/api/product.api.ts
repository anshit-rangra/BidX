import { productCallInstance } from "./instance.ts";

export async function BidOnProductCall(productId: string, bidAmount: string, token: string) {
    try {
        const result = await productCallInstance.patch(`/api/product/bid/${productId}?bid=${bidAmount}`, {}, {
            headers: {
                "authorization": `Bearer ${token}`
            }
        })
        return result.data;
        
    } catch (error) {
        console.log(error)
        return 0;
    }
}
