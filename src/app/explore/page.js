"use server"
// import {ImageGrid} from "@/components/image-grid"
import {ImageGrid} from "@/components/ui/image-grid"


async function getData() {

  const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/explore`)
  if(resp.ok){
    // console.log("resp", resp)
    const data = await resp.json()
    // console.log("data", data)
    return data
  }
  else{
    console.log("ERROR:", resp.status)
    return new Response("Server Error", { status: 500 })
  }
}

export default async function PublicFeed(){
  const data = await getData();
  // return ;
  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-4xl text-gray-900 font-bold">Community Gallery</h1>
        <p className="text-gray-600 mt-2">Discover amazing AI-generated images from our creative community</p>
      </div>
      {/* <>{JSON.stringify(data)}</> */}
      <ImageGrid images={data} />
    </div>
  )
}