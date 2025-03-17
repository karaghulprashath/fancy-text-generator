"use client"

import { useState, useEffect, useRef } from "react"
import { Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"

// Unicode character mappings for different styles
const fontStyles = {
  normal: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
  bold: "𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳𝟎𝟏𝟐𝟑𝟒𝟓𝟔𝟕𝟖𝟗",
  italic: "𝘈𝘉𝘊𝘋𝘌𝘍𝘎𝘏𝘐𝘑𝘒𝘓𝘔𝘕𝘖𝘗𝘘𝘙𝘚𝘛𝘜𝘝𝘞𝘟𝘠𝘡𝘢𝘣𝘤𝘥𝘦𝘧𝘨ｈｉｊｋｌｍｎｏｐ𝘲𝘳𝘴ｔｕ𝘷ｗ𝘹ｙｚ0123456789",
  boldItalic: "𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉𝚊𝚋𝚌𝚍𝚎𝚏𝚐ｈｉｊｋｌｍｎ𝚘𝚙𝚚𝚛𝚜𝚝𝚞ｖ𝚠𝚡𝚢ｚ0123456789",
  script: "𝒜ℬ𝒞𝒟ℰℱ𝒢ℋℐ𝒥𝒦ℒℳ𝒩𝒪𝒫𝒬ℛ𝒮𝒯𝒰𝒱𝒲𝒳𝒴𝒵𝒶𝒷𝒸𝒹ℯ𝒻ℊ𝒽𝒾𝒿𝓀𝓁𝓂𝓃ℴ𝓅𝓆𝓇𝓈𝓉𝓊𝓋𝓌𝓍𝓎𝓏0123456789",
  fraktur: "𝔄𝔅ℭ𝔇𝔈𝔉𝔊ℌℑ𝔍𝔎𝔏𝔐𝔑𝔒𝔓𝔔ℜ𝔖𝔗𝔘𝔙𝔚𝔛𝔜ℨ𝔞𝔟𝔠𝔡𝔢𝔣𝔤𝔥𝔦𝔧𝔨𝔩𝔪𝔫𝔬𝔭𝔮𝔯𝔰𝔱𝔲𝔳𝔴𝔵𝔶𝔷0123456789",
  monospace: "𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉𝚊𝚋𝚌𝚍𝚎𝚏𝚐ｈｉｊｋｌｍｎ𝚘𝚙𝚚𝚛𝚜𝚝𝚞ｖ𝚠𝚡𝚢ｚ𝟶𝟷𝟸𝟹𝟺𝟻𝟼𝟽𝟾𝟿",
  doubleStruck: "𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫𝟘𝟙𝟚𝟛𝟜𝟝𝟞𝟟𝟠𝟡",
  smallCaps: "ABCDEFGHIJKLMNOPQRSTUVWXYZᴀʙᴄᴅᴇғɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢ0123456789",
  superscript: "ᴬᴮᶜᴰᴱᶠᴳᴴᴵᴶᴷᴸᴹᴺᴼᴾᵠᴿˢᵀᵁⱽᵂˣʸᶻᵃᵇᶜᵈᵉᶠᵍʰⁱʲᵏˡᵐⁿᵒᵖᵠʳˢᵗᵘᵛʷˣʸᶻ⁰¹²³⁴⁵⁶⁷⁸⁹",
  subscript: "ₐBCDₑFGₕᵢⱼₖₗₘₙₒₚQᵣₛₜᵤᵥWₓYZₐᵦ𝒸𝒹ₑ𝒻𝓰ₕᵢⱼₖₗₘₙₒₚᵩᵣₛₜᵤᵥ𝓌ₓᵧ𝓏₀₁₂₃₄₅₆₇₈₉",
  // New styles
  circled: "ⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩ⓪①②③④⑤⑥⑦⑧⑨",
  negativeCircled: "🅐🅑🅒🅓🅔🅕🅖🅗🅘🅙🅚🅛🅜🅝🅞🅟🅠🅡🅢🅣🅤🅥🅦🅧🅨🅩🅐🅑🅒🅓🅔🅕🅖🅗🅘🅙🅚🅛🅜🅝🅞🅟🅠🅡🅢🅣🅤🅥🅦🅧🅨🅩⓿❶❷❸❹❺❻❼❽❾",
  squared: "🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉0123456789",
  negativeSquared: "🅰🅱🅲🅳🅴🅵🅶🅷🅸🅹🅺🅻🅼🅽🅾🅿🆀🆁🆂🆃🅄🅅🅆🆇🆈🆉🅰🅱🅲🅳🅴🅵🅶🅷🅸🅹🅺🅻🅼🅽🅾🅿🆀🆁🆂🆃🅄🅅🅆🆇🆈🆉0123456789",
  cursive: "𝓐𝓑𝓒𝓓𝓔𝓕𝓖𝓗𝓘𝓙𝓚𝓛𝓜𝓝𝓞𝓟𝓠𝓡𝓢𝓣𝓤𝓥𝓦𝓧𝓨𝓩𝓪𝓫𝓬𝓭𝓮𝓯𝓰𝓱𝓲𝓳𝓴𝓵𝓶𝓷𝓸𝓹𝓺𝓻𝓼𝓽𝓾𝓿𝔀𝔁𝔂𝔃0123456789",
  oldEnglish: "𝔄𝔅ℭ𝔇𝔈𝔉𝔊ℌℑ𝔍𝔎𝔏𝔐𝔑𝔒𝔓𝔔ℜ𝔖𝔗𝔘𝔙𝔚𝔛𝔜ℨ𝔞𝔟𝔠𝔡𝔢𝔣𝔤𝔥𝔦𝔧𝔨𝔩𝔪𝔫𝔬𝔭𝔮𝔯𝔰𝔱𝔲𝔳𝔴𝔵𝔶𝔷0123456789",
  wide: "ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ\uff41\uff42\uff43\uff44\uff45\uff46\uff47\uff48\uff49\uff4a\uff4b\uff4c\uff4d\uff4e\uff4f\uff50\uff51\uff52\uff53\uff54\uff55\uff56\uff57\uff58\uff59\uff5a\uff10\uff11\uff12\uff13\uff14\uff15\uff16\uff17\uff18\uff19",
  inverted: "ɐqɔpǝɟƃɥᴉɾʞlɯuodbɹsʇnʌʍxʎzɐqɔpǝɟƃɥᴉɾʞlɯuodbɹsʇnʌʍxʎz0ƖᄅƐㄣϛ9ㄥ86",
  mirror: "AdↃbƎꟻGHIJK⅃MᴎOꟼpᴙꙄTUVWXYZɒdↃbɘꟻgʜiꞁʞlmnoqpɿꙅTuvwxyz0123456789",
  tiny: "ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢᵃᵇᶜᵈᵉᶠᵍʰⁱʲᵏˡᵐⁿᵒᵖᵠʳˢᵗᵘᵛʷˣʸᶻ⁰¹²³⁴⁵⁶⁷⁸⁹",
  outline: "𝕬𝕭𝕮𝕯𝕰𝕱𝕲𝕳𝕴𝕵𝕶𝕷𝕸𝕹𝕺𝕻𝕼𝕽𝕾𝕿𝖀𝖁𝖂𝖃𝖄𝖅𝖆𝖇𝖈𝖉𝖊𝖋𝖌𝖍𝖎𝖏𝖐𝖑𝖒𝖓𝖔𝖕𝖖𝖗𝖘𝖙𝖚𝖛𝖜𝖝𝖞𝖟0123456789",
  strikethrough: "A̶B̶C̶D̶E̶F̶G̶H̶I̶J̶K̶L̶M̶N̶O̶P̶Q̶R̶S̶T̶U̶V̶W̶X̶Y̶Z̶a̶b̶c̶d̶e̶f̶g̶h̶i̶j̶k̶l̶m̶n̶o̶p̶q̶r̶s̶t̶u̶v̶w̶x̶y̶z̶0̶1̶2̶3̶4̶5̶6̶7̶8̶9̶",
  underline: "A̲B̲C̲D̲E̲F̲G̲H̲I̲J̲K̲L̲M̲N̲O̲P̲Q̲R̲S̲T̲U̲V̲W̲X̲Y̲Z̲a̲b̲c̲d̲e̲f̲g̲h̲i̲j̲k̲l̲m̲n̲o̲p̲q̲r̲s̲t̲u̲v̲w̲x̲y̲z̲0̲1̲2̲3̲4̲5̲6̲7̲8̲9̲",
  dotted: "Ä̤B̤̈C̤̈D̤̈Ë̤F̤̈G̤̈Ḧ̤Ï̤J̤̈K̤̈L̤̈M̤̈N̤̈Ö̤P̤̈Q̤̈R̤̈S̤̈T̤̈Ṳ̈V̤̈Ẅ̤Ẍ̤Ÿ̤Z̤̈ä̤b̤̈c̤̈d̤̈ë̤f̤̈g̤̈ḧ̤ï̤j̤̈k̤̈l̤̈m̤̈n̤̈ö̤p̤̈q̤̈r̤̈s̤̈ẗ̤ṳ̈v̤̈ẅ̤ẍ̤ÿ̤z̤̈0̤̈1̤̈2̤̈3̤̈4̤̈5̤̈6̤̈7̤̈8̤̈9̤̈",
  wavy: "A͂B͂C͂D͂E͂F͂G͂H͂I͂J͂K͂L͂M͂N͂O͂P͂Q͂R͂S͂T͂U͂V͂W͂X͂Y͂Z͂a͂b͂c͂d͂e͂f͂g͂h͂i͂j͂k͂l͂m͂n͂o͂p͂q͂r͂s͂t͂u͂v͂w͂x͂y͂z͂0͂1͂2͂3͂4͂5͂6͂7͂8͂9͂",
}

// Update the sample texts to include some of the new styles
// Sample texts for the examples
const sampleTexts = [
  { text: "NOOB", style: "doubleStruck" },
  { text: "LOVE", style: "cursive" },
  { text: "PRO GAMER", style: "bold" },
  { text: "COOL BIO", style: "circled" },
  { text: "FORTNITE", style: "negativeSquared" },
  { text: "TIKTOK", style: "outline" },
]

export default function FancyTextGenerator() {
  const [inputText, setInputText] = useState("")
  const [selectedStyle, setSelectedStyle] = useState("bold")
  const [convertedText, setConvertedText] = useState("")
  const [adCount, setAdCount] = useState(0)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Focus the textarea on page load
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [])

  // Convert text when input or style changes
  useEffect(() => {
    setConvertedText(convertText(inputText, selectedStyle))
  }, [inputText, selectedStyle])

  // Show popup ad after 3 style conversions
  useEffect(() => {
    if (adCount === 3) {
      const timer = setTimeout(() => {
        // This would be replaced with actual ad code
        toast({
          title: "Ad",
          description: "This would be a popup ad in a real implementation",
          variant: "default",
        })
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [adCount])

  // Function to convert text to the selected style
  const convertText = (text: string, style: string) => {
    if (!text) return ""

    const normalChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split("")
    const styleChars = fontStyles[style as keyof typeof fontStyles]?.split("") || normalChars

    // Special handling for styles with combining characters
    if (["strikethrough", "underline", "dotted", "wavy"].includes(style)) {
      return text
        .split("")
        .map((char) => {
          const index = normalChars.indexOf(char)
          if (index !== -1) {
            return styleChars[index] || char
          }
          return char
        })
        .join("")
    }

    // Special handling for inverted and mirror text
    if (style === "inverted") {
      return text
        .split("")
        .map((char) => {
          const index = normalChars.indexOf(char)
          if (index !== -1) {
            return styleChars[index] || char
          }
          return char
        })
        .join("")
        .split("")
        .reverse()
        .join("")
    }

    if (style === "mirror") {
      return text
        .split("")
        .map((char) => {
          const index = normalChars.indexOf(char)
          if (index !== -1) {
            return styleChars[index] || char
          }
          return char
        })
        .join("")
    }

    // Standard conversion for other styles
    return text
      .split("")
      .map((char) => {
        const index = normalChars.indexOf(char)
        if (index !== -1) {
          return styleChars[index] || char
        }
        return char
      })
      .join("")
  }

  // Handle style button click
  const handleStyleClick = (style: string) => {
    setSelectedStyle(style)
    setAdCount((prev) => prev + 1)
  }

  // Copy text to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(convertedText)
    toast({
      title: "Copied! ✅",
      description: "Paste into Instagram/TikTok.",
      variant: "success",
    })
  }

  // Apply sample text
  const applySampleText = (text: string, style: string) => {
    setInputText(text)
    setSelectedStyle(style)
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-white">
      {/* Ad placeholder - Leaderboard */}
      <div className="w-full h-24 bg-gray-800 flex items-center justify-center border border-purple-500 mb-6">
        <p className="text-gray-400">Ad Slot - Leaderboard (728x90)</p>
      </div>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-5xl font-bold text-center mb-2 bg-gradient-to-r from-green-400 to-purple-500 bg-clip-text text-transparent">
          Turn Boring Text to 𝓕𝓪𝓷𝓬𝔂 Fonts in 1 Click!
        </h1>
        <h2 className="text-lg md:text-xl text-center mb-8 text-gray-300">
          Copy-Paste Ready for Instagram, TikTok, Fortnite, and More!
        </h2>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            {/* Input area */}
            <div className="mb-6">
              <Textarea
                ref={textareaRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your text here... (e.g., 'COOL USERNAME')"
                className="w-full h-32 p-4 bg-gray-900 border-2 border-purple-500 rounded-lg shadow-[0_0_10px_rgba(149,76,233,0.5)] focus:outline-none focus:ring-2 focus:ring-green-400 text-white"
              />
            </div>

            {/* Style buttons */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Choose a style:</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-6 max-h-[400px] overflow-y-auto p-2">
                {Object.keys(fontStyles).map((style) => (
                  <Button
                    key={style}
                    onClick={() => handleStyleClick(style)}
                    className={`border ${
                      selectedStyle === style
                        ? "border-green-400 bg-gray-800 shadow-[0_0_10px_rgba(74,222,128,0.5)]"
                        : "border-purple-500 bg-gray-900 hover:bg-gray-800"
                    } text-white rounded-lg transition-all`}
                  >
                    {convertText(style, style)}
                  </Button>
                ))}
              </div>
            </div>

            {/* Preview area */}
            <div className="mb-6">
              <div className="p-4 bg-gray-900 border-2 border-green-400 rounded-lg shadow-[0_0_10px_rgba(74,222,128,0.3)] min-h-16 flex items-center">
                <p className="text-xl break-words w-full">{convertedText || "Preview will appear here"}</p>
              </div>
            </div>

            {/* Copy button */}
            <Button
              onClick={copyToClipboard}
              disabled={!convertedText}
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-green-400 hover:from-purple-600 hover:to-green-500 text-white rounded-lg flex items-center justify-center gap-2 mb-8"
            >
              <Copy size={20} />
              <span className="text-lg">Copy to Clipboard</span>
            </Button>

            {/* Sample texts */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-3">Try these examples:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {sampleTexts.map((sample, index) => (
                  <Button
                    key={index}
                    onClick={() => applySampleText(sample.text, sample.style)}
                    variant="outline"
                    className="border border-purple-500 bg-gray-900 hover:bg-gray-800 text-white"
                  >
                    {sample.text} → {convertText(sample.text, sample.style)}
                  </Button>
                ))}
              </div>
            </div>

            {/* Mobile ad placeholder */}
            <div className="lg:hidden w-full h-20 bg-gray-800 flex items-center justify-center border border-purple-500 mb-6">
              <p className="text-gray-400">Ad Slot - Mobile Footer</p>
            </div>
          </div>

          {/* Sidebar ad placeholder */}
          <div className="hidden lg:block w-[300px] h-[600px] bg-gray-800 flex-shrink-0 border border-purple-500 self-start sticky top-4">
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-400">Ad Slot - Sidebar (300x600)</p>
            </div>
          </div>
        </div>

        {/* Affiliate section */}
        <div className="mt-8 p-6 bg-gray-900 border border-purple-500 rounded-lg">
          <h3 className="text-xl font-semibold mb-3">Need a Unique Username?</h3>
          <p className="text-gray-300 mb-4">
            If all the good usernames are taken, consider getting your own custom domain name!
          </p>
          <div className="flex flex-wrap gap-4">
            <Button className="bg-purple-500 hover:bg-purple-600">Check Availability on Namecheap</Button>
            <Button className="bg-green-500 hover:bg-green-600">Browse GoDaddy Domains</Button>
          </div>
        </div>
      </main>

      <footer className="mt-12 py-6 bg-gray-900 text-center text-gray-400">
        <p>© {new Date().getFullYear()} Fancy Text Generator - Make your social media profiles stand out!</p>
      </footer>
    </div>
  )
}

