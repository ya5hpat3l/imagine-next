"use client"

import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { useEffect, useState } from "react"

export default function LikeButton({data}){

    const [liked, setLiked] = useState(false)

    useEffect(() => {
        console.log(data)
        if(data?.likes?.length > 0){
            setLiked(true)
        }
    }, [])

    return(
        <Button
            variant="ghost"
            size="sm"
            onClick={() => handleLike(data)}
            className={liked ? "text-red-500" : "text-gray-500"}
        >
            <Heart
                className={`h-4 w-4 mr-1 ${
                    false ? "fill-current" : ""
                }`}
            />
            {data._count.likes}
        </Button>
    )
}