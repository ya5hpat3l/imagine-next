"use client"
// import { SignIn } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, MessageCircle, Sparkles, Users, Zap, Palette, Car } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  // const searchParams = useSearchParams();
  // const redirectUrl = searchParams.get("redirect_url") || "/dashboard";

  // return (
  //     <div className="h-full flex justify-between items-center">
  //       <SignIn routing="hash" fallbackRedirectUrl={redirectUrl} />
  //     </div>
  // )

  const { isSignedIn } = useUser();
  const router = useRouter();


  useEffect(() => {
    if (isSignedIn) {
      router.push("/dashboard"); // or any route you want
    }
  }, [isSignedIn]);

  return (
    // null
    <div className="w-full bg-">
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">Generate Amazing Images with AI</h2>
          <p className="text-xl text-gray-600 mb-8">
            Create stunning images from text prompts, share them with the community, and discover incredible creations
            from other artists.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/explore">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
              Explore Gallery
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-11/12 mx-auto rounded-lg bg-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-4">Ready to Create?</h3>
          <p className="text-xl mb-8 opacity-90">Join thousands of creators sharing their AI-generated masterpieces</p>
          <Link href="/sign-up">
            <Button size="lg" variant="secondary">
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-0 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {/* <Card>
            <CardHeader>
              <Sparkles className="h-12 w-12 text-purple-600 mb-4" />
              <CardTitle>AI Image Generation</CardTitle>
              <CardDescription>Transform your ideas into stunning visuals with advanced AI technology</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-12 w-12 text-blue-600 mb-4" />
              <CardTitle>Community Sharing</CardTitle>
              <CardDescription>Share your creations publicly and discover amazing art from other users</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 mb-4">
                <Heart className="h-12 w-12 text-red-500" />
              </div>
              <CardTitle>Social Features</CardTitle>
              <CardDescription>Like, comment, and engage with the creative community</CardDescription>
            </CardHeader>
          </Card> */}

            <Card className="text-center p-6 bg-white rounded-xl shadow-sm">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
              <p className="text-gray-600">Generate high-quality images in seconds with our advanced AI models.</p>
            </Card>
            
            <Card className="text-center p-6 bg-white rounded-xl shadow-sm">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Palette className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Endless Creativity</h3>
              <p className="text-gray-600">From photorealistic to artistic styles, create any image you can imagine.</p>
            </Card>

            <Card className="text-center p-6 bg-white rounded-xl shadow-sm">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Share & Discover</h3>
              <p className="text-gray-600">Join our community to share your creations and discover amazing art.</p>
            </Card>

        </div>
      </section>

    </div>
  );
}
