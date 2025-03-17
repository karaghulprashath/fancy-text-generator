import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Fancy Text Generator 🔥 [100+ Stylish Fonts for Instagram/TikTok]",
  description:
    "Instantly create cool usernames and bios with 𝗯𝗼𝗹𝗱, 𝘤𝘶𝘳𝘴𝘪𝘷𝘦, and 𝔤𝔬𝔱𝔥𝔦𝔠 text! No app needed—free for Facebook, Discord, and Fortnite.",
  keywords: "Instagram bio fonts, TikTok stylish text, free username generator, Fortnite name, Discord bio, fancy text",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Fancy Text Generator for Social Media" />
        <meta property="og:description" content="Create stylish text for Instagram, TikTok, and gaming usernames" />
        <meta property="og:image" content="/og-image.jpg" />
        <meta property="og:type" content="website" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "How to copy fancy text?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Type your text, select a style, and click the 'Copy to Clipboard' button. Then paste it into your social media profile or username field.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Does this work for Roblox?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes, our fancy text generator works for Roblox usernames and chat. Simply copy the generated text and paste it into Roblox.",
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'