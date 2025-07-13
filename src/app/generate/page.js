"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge, Button, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Switch, Textarea } from "@/components/ui/forms"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Download, Settings, Share2, Sparkles, ArrowLeft, Zap, Clock, Star, Database, Cpu, Rocket, Gauge, Car, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { useAuth } from "@clerk/nextjs";
import { redirect } from "next/navigation"

const models = [
  {
    value: "sdxl",
    label: "SDXL",
    description: "Stable Diffusion XL - High quality, versatile",
    speed: "Medium",
    icon: Database,
    color: "text-blue-600",
  },
  {
    value: "sd35-large",
    label: "SD 3.5 Large",
    description: "Latest Stable Diffusion - Best quality",
    speed: "Slow",
    icon: Cpu,
    color: "text-green-600",
  },
  {
    value: "flux-dev",
    label: "Flux Dev",
    description: "Development model - Great for experimentation",
    speed: "Fast",
    icon: Rocket,
    color: "text-purple-600",
  },
  {
    value: "flux-schnell",
    label: "Flux Schnell",
    description: "Ultra-fast generation - Quick results",
    speed: "Very Fast",
    icon: Gauge,
    color: "text-orange-600",
  },
]

const profiles = [
  {
    value: "lightning",
    label: "Lightning",
    description: "Fastest generation, good quality",
    icon: Zap,
    steps: "4-8 steps",
  },
  {
    value: "balanced",
    label: "Balanced",
    description: "Good balance of speed and quality",
    icon: Clock,
    steps: "20-30 steps",
  },
  {
    value: "professional",
    label: "Professional",
    description: "Highest quality, slower generation",
    icon: Star,
    steps: "50+ steps",
  },
]

export default function Generate(){

  const { getToken, isSignedIn } = useAuth();

  if(!isSignedIn) {
    return redirect("/")
  }

  const [prompt, setPrompt] = useState("")
  const [isPublic, setIsPublic] = useState(true)
  const [model, setModel] = useState("flux-dev")
  const [profile, setProfile] = useState("balanced")
  const [batchSize, setBatchSize] = useState([1])
  const [loading, setLoading] = useState(false)
  const [generatedImages, setGeneratedImages] = useState([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isRefining, setIsRefining] = useState(false)

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setLoading(true)
    setGeneratedImages([])
    setCurrentImageIndex(0)

    try {
      const token = await getToken();

      console.log("Generating images:", { prompt, model, profile, isPublic, batchSize: batchSize[0] })
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          prompt,
          model,
          profile,
          isPublic,
          batchSize: batchSize[0],
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setGeneratedImages(data.images)
      }
    } catch (error) {
      console.error("Generation failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    console.log("Saving images:", { prompt, model, profile, isPublic, images: generatedImages })
  }

  const handleImagine = async () => {
    setIsRefining(true)

    try {
      if (prompt.trim()) {
        const response = await fetch("/api/refine-prompt", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt }),
        })

        if (response.ok) {
          const data = await response.json()
          setPrompt(data.refinedPrompt)
        }
      } else {
        const response = await fetch("/api/inspire-prompt", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        })

        if (response.ok) {
          const data = await response.json()
          setPrompt(data.inspirationPrompt)
        }
      }
    } catch (error) {
      console.error("Imagine/Refine failed:", error)
    } finally {
      setIsRefining(false)
    }
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % generatedImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + generatedImages.length) % generatedImages.length)
  }

  const selectedModel = models.find((m) => m.value === models)
  const selectedProfile = profiles.find((p) => p.value === profiles)
  const currentImage = generatedImages[currentImageIndex]

  return (
    <div className="w-full">
      <div className="grid lg:grid-cols-2 gap-8">
          {/* Generation Panel */}
          <div className="space-y-6">
            {/* <Card className="border-none shadow-none rounded-none bg-transparent sm:border sm:shadow-sm sm:rounded-xl sm:bg-white"> */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Generation Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="prompt">Describe your image</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleImagine}
                      disabled={isRefining}
                      className="text-purple-600 border-purple-200 hover:bg-purple-50 bg-transparent"
                    >
                      {isRefining ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-purple-600"></div>
                          {prompt.trim() ? "Refining..." : "Inspiring..."}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-3 w-3" />
                          {prompt.trim() ? "Refine Prompt" : "Imagine"}
                        </div>
                      )}
                    </Button>
                  </div>
                  <Textarea
                    id="prompt"
                    placeholder="A majestic dragon flying over a mystical forest at sunset..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                  <p className="text-xs text-gray-500">Be specific and descriptive for better results</p>
                </div>

                <div className="space-y-3">
                  <Label>AI Model</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {models.map((modelOption) => {
                      const IconComponent = modelOption.icon
                      return (
                        <div
                          key={modelOption.value}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            model === modelOption.value
                              ? "border-purple-500 bg-purple-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => setModel(modelOption.value)}
                        >
                          <div className="flex items-center gap-3">
                            <IconComponent className={`h-5 w-5 ${modelOption.color}`} />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{modelOption.label}</span>
                                <Badge variant="outline" className="text-xs">
                                  {modelOption.speed}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600">{modelOption.description}</p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Generation Profile</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {profiles.map((profileOption) => {
                      const IconComponent = profileOption.icon
                      return (
                        <div
                          key={profileOption.value}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            profile === profileOption.value
                              ? "border-purple-500 bg-purple-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => setProfile(profileOption.value)}
                        >
                          <div className="flex items-center gap-3">
                            <IconComponent className="h-5 w-5 text-purple-600" />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{profileOption.label}</span>
                                <Badge variant="outline" className="text-xs">
                                  {profileOption.steps}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600">{profileOption.description}</p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Batch Size</Label>
                    <Badge variant="secondary">
                      {batchSize[0]} image{batchSize[0] > 1 ? "s" : ""}
                    </Badge>
                  </div>
                  <div className="px-2">
                    <Slider
                      value={batchSize}
                      onValueChange={setBatchSize}
                      max={4}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>1</span>
                      <span>2</span>
                      <span>3</span>
                      <span>4</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    Generate multiple variations at once. Higher batch sizes take longer.
                  </p>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <Label htmlFor="public" className="font-medium">
                      Share publicly
                    </Label>
                    <p className="text-sm text-gray-600">Allow others to see and interact with this image</p>
                  </div>
                  <Switch id="public" checked={isPublic} onCheckedChange={setIsPublic} />
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || loading}
                  className="w-full bg-purple-600 hover:bg-purple-700 h-12"
                  size="lg"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Generating...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      Generate Image
                    </div>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Preview Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Preview</CardTitle>
                  {generatedImages.length > 1 && (
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={prevImage} disabled={loading}>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Badge variant="outline">
                        {currentImageIndex + 1} of {generatedImages.length}
                      </Badge>
                      <Button variant="outline" size="sm" onClick={nextImage} disabled={loading}>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden">
                  {loading ? (
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                      <p className="text-gray-600">Creating your masterpiece{batchSize[0] > 1 ? "s" : ""}...</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Using {selectedModel?.label} with {selectedProfile?.label} profile
                      </p>
                    </div>
                  ) : currentImage ? (
                    <div className="w-full h-full relative">
                      <Image
                        src={currentImage || "/placeholder.svg"}
                        alt="Generated image"
                        fill
                        className="object-cover rounded-lg"
                      />
                      {generatedImages.length > 1 && (
                        <div className="absolute bottom-2 left-2 right-2">
                          <div className="flex gap-1 justify-center">
                            {generatedImages.map((_, index) => (
                              <button
                                key={index}
                                className={`w-2 h-2 rounded-full transition-colors ${
                                  index === currentImageIndex ? "bg-white" : "bg-white/50"
                                }`}
                                onClick={() => setCurrentImageIndex(index)}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center">
                      <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">
                        Your generated image{batchSize[0] > 1 ? "s" : ""} will appear here
                      </p>
                      <p className="text-sm text-gray-500 mt-1">Ready to create with {selectedModel?.label}</p>
                    </div>
                  )}
                </div>

                {generatedImages.length > 0 && (
                  <div className="mt-6 space-y-4">
                    <div className="flex gap-2">
                      <Button onClick={handleSave} className="flex-1">
                        Save {generatedImages.length > 1 ? "All" : ""} to Gallery
                      </Button>
                      <Button variant="outline" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {generatedImages.length > 1 && (
                      <div className="grid grid-cols-4 gap-2">
                        {generatedImages.map((img, index) => (
                          <button
                            key={img.id}
                            className={`aspect-square relative rounded-lg overflow-hidden border-2 transition-colors ${
                              index === currentImageIndex ? "border-purple-500" : "border-gray-200"
                            }`}
                            onClick={() => setCurrentImageIndex(index)}
                          >
                            <Image
                              src={img || "/placeholder.svg"}
                              alt={`Generated image ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}

                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-700 mb-1">Generation Details</p>
                      <p className="text-xs text-gray-600 mb-2">{prompt}</p>
                      <div className="flex gap-2 flex-wrap">
                        <Badge variant="secondary" className="text-xs">
                          {selectedModel?.label}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {selectedProfile?.label}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {generatedImages.length} image{generatedImages.length > 1 ? "s" : ""}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {isPublic ? "Public" : "Private"}
                        </Badge>
                        {currentImage?.seed && (
                          <Badge variant="secondary" className="text-xs">
                            Seed: {currentImage.seed}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>



      </div>
    </div>
  )
}