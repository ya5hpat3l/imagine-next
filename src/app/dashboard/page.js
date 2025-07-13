"use server"
import { auth, clerkClient } from "@clerk/nextjs/server";
import { ImageGrid } from "@/components/ui/image-grid";
import Link from "next/link";
import { redirect } from "next/navigation";
// import {useAuth}

async function getData() {
  const { userId, getToken } = await auth();
  // console.log(userId)

  if (!userId) {
    return redirect("/");
  }

  const token = await getToken();

  const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/generations`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  if (resp.ok) {
    // console.log("resp", resp)
    const data = await resp.json()
    // console.log("data", data)
    return data
  }
  else {
    console.log("ERROR:", resp.status)
    return new Response("Server Error", { status: 500 })
  }
}

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function Dashboard() {
  const images = await getData();
  const publicImages = images.filter((image) => image.visibility === "PUBLIC")
  const privateImages = images.filter((image) => image.visibility !== "PUBLIC")
  const loading = false;

  // const data = {"userId": userId, "a":0}

  if (!images || images.length === 0) {
    return (
      <div className="w-full">
        <div className="mb-8">
          {/* <h1 className="text-4xl text-gray-900 font-bold">Your Dashboard</h1> */}
          {/* <p className="text-gray-600 mt-2">Manage your generated images and see your creative journey</p> */}
        </div>
        <div>
          <div className="text-center">
            <div className="flex flex-col items-center justify-center py-16">
              <svg
                className="w-24 h-24 text-indigo-300 mb-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none" viewBox="0 0 64 64" stroke="currentColor"
              >
                {/* Example artwork icon */}
                <rect width="52" height="36" x="6" y="14" rx="4" strokeWidth="2" />
                <circle cx="20" cy="28" r="4" strokeWidth="2" />
                <path d="M6 50l16-20 12 14 12-16 16 24" strokeWidth="2" />
              </svg>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                No images yet
              </h2>
              <p className="text-gray-600 mb-6 text-center max-w-xs">
                Describe your idea and let’s generate something amazing.
              </p>
              <Link href="/generate">
                <button
                  // onClick={onGenerate}
                  className="inline-block px-6 py-2 bg-purple-600 text-white font-medium rounded-md hover:bg-purple-700 focus:outline-none"
                >
                  Generate Image
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }


  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-4xl text-gray-900 font-bold">Your Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage your generated images and see your creative journey</p>
      </div>
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          {/* <TabsTrigger value="all">All Images ({images.length})</TabsTrigger>
            <TabsTrigger value="public">Public ({publicImages.length})</TabsTrigger>
            <TabsTrigger value="private">Private ({privateImages.length})</TabsTrigger> */}
          <TabsTrigger value="all">All Images</TabsTrigger>
          <TabsTrigger value="public">Public</TabsTrigger>
          <TabsTrigger value="private">Private</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <ImageGrid images={images} loading={loading} />
        </TabsContent>

        <TabsContent value="public">
          <ImageGrid images={publicImages} loading={loading} />
        </TabsContent>

        <TabsContent value="private">
          <ImageGrid images={privateImages} loading={loading} />
        </TabsContent>
      </Tabs>
      {/* <ImageGrid images={data} /> */}
    </div>
  )
}