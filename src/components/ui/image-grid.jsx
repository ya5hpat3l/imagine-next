import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
// import React from "react"
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle } from "lucide-react";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { timeAgo } from "@/lib/utils";

function Post({ data }) {
    return (
        <div key={data.id} className={"overflow-hidden shadow-lg"}>
            {/* <Card> */}
            {
                /* <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card Description</CardDescription>
            <CardAction><Button>report</Button></CardAction>
        </CardHeader> */
            }
            <div className={"aspect-square relative"}>
                <Carousel>
                    <CarouselContent>
                        {data.files.map((i) => {
                            return (
                                <CarouselItem key={i.key}>
                                    <Image
                                        src={i.url}
                                        width={1024}
                                        height={1024}
                                        alt={data.inputPrompt}
                                    />
                                </CarouselItem>
                            );
                        })}
                    </CarouselContent>
                    {/* <CarouselPrevious /> */}
                    {/* <CarouselNext /> */}
                </Carousel>
            </div>
            <CardContent className={"p-4"}>
                <div className="flex items-center gap-3 my-4">
                    {/* <Avatar className="w-8 h-8"> */}
                    {/* <AvatarImage src={image.userAvatar || "/placeholder.svg"} /> */}
                    {/* <AvatarFallback>{image.username[0].toUpperCase()}</AvatarFallback> */}
                    {/* </Avatar> */}
                    <div className="flex items-center gap-2 overflow-scroll scrollbar-hidden">
                        <Badge
                            variant={"secondary"}
                            className="font-medium text-sm"
                        >
                            {data.visibility}
                        </Badge>
                        <Badge
                            variant={"secondary"}
                            className="font-medium text-sm"
                        >
                            {data.model}
                        </Badge>
                        <Badge
                            variant={"secondary"}
                            className="font-medium text-sm"
                        >
                            {data.profile}
                        </Badge>
                        <Badge
                            variant={"secondary"}
                            className="font-medium text-sm"
                        >
                            {data.files.length}{" "}
                            {(data.files.length > 1) ? "IMAGES" : "IMAGE"}
                        </Badge>
                    </div>
                </div>

                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {data.inputPrompt}
                </p>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            // onClick={() => handleLike(image.id)}
                            className={false ? "text-red-500" : "text-gray-500"}
                        >
                            <Heart
                                className={`h-4 w-4 mr-1 ${
                                    false ? "fill-current" : ""
                                }`}
                            />
                            {data._count.likes}
                        </Button>
                        <Link href={`/image/${data.id}`}>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-gray-500"
                            >
                                <MessageCircle className="h-4 w-4 mr-1" />
                                {data._count.comments}
                            </Button>
                        </Link>
                    </div>
                    <span className="text-xs text-gray-400">
                        {timeAgo(new Date(data.createdAt))}
                    </span>
                </div>
            </CardContent>
        </div> /* </ Card> */
    );
}

export function ImageGrid({ images, loadmore }) {
    // console.log(images)
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {images.map((i) => (
                <Post data={i} key={new Date().getTime() + i.id} />
            ))}
        </div>
    );
}
