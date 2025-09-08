"use client"
import {Button} from "@/components/ui/button"
import { DownloadIcon } from "lucide-react"

export default function DownloadButton({urls}){
    return (
        <Button
            variant="ghost"
            size="sm"
            className="text-gray-500"
            onClick={() => urls.forEach(url => window.open(url))}
        >
            <DownloadIcon className="h-4 w-4 mr01" />
            Download
        </Button>
    )
}