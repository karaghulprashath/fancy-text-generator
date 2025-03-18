"use client"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { getFonts, transform } from "convert-unicode-fonts"
import { Copy } from "lucide-react"
import Script from "next/script"
import { useEffect, useRef, useState } from "react"

// Define the style names for the UI
const styleNames = {
  // Standard Unicode styles
  normal: "Normal",
  bold: "Bold",
  italic: "Italic",
  boldItalic: "Bold Italic",
  script: "Script",
  boldScript: "Bold Script",
  fraktur: "Fraktur",
  boldFraktur: "Bold Fraktur",
  doubleStruck: "Double Struck",
  monospace: "Monospace",
  sansSerif: "Sans Serif",
  sansSerifBold: "Sans Serif Bold",
  sansSerifItalic: "Sans Serif Italic",
  sansSerifBoldItalic: "Sans Serif Bold Italic",
  circled: "Circled",
  parenthesized: "Parenthesized",
  fullWidth: "Full Width",
  smallCaps: "Small Caps",
  superscript: "Superscript",
  subscript: "Subscript",
  
  // Custom styles
  bubbles: "Bubbles",
  squares: "Squares",
  invertedSquares: "Inverted Squares",
  medieval: "Medieval",
  cursive: "Cursive",
  oldEnglish: "Old English",
  wireframe: "Wireframe",
  hearts: "Hearts",
  stars: "Stars",
  brackets: "Brackets",
  strikethrough: "Strikethrough",
  underline: "Underline",
  dotted: "Dotted",
  wavy: "Wavy",
  retro: "Retro",
  vaporwave: "Vaporwave",
  glitch: "Glitch",
  sparkles: "Sparkles",
  flowers: "Flowers",
  blocks: "Blocks",
  outlined: "Outlined",
  neon: "Neon",
  shadow: "Shadow",
  mirror: "Mirror",
  upside: "Upside Down",
  zalgo: "Zalgo",
  morse: "Morse Code",
  binary: "Binary",
  leetspeak: "Leetspeak",
  emoji: "Emoji"
}

// Sample texts for the examples
const sampleTexts = [
  { text: "NOOB", style: "boldFraktur" },
  { text: "LOVE", style: "boldScript" },
  { text: "PRO GAMER", style: "sansSerifBold" },
  { text: "COOL BIO", style: "doubleStruck" },
  { text: "FORTNITE", style: "fraktur" },
  { text: "TIKTOK", style: "monospace" },
  { text: "AESTHETIC", style: "vaporwave" },
  { text: "SAVAGE", style: "brackets" },
  { text: "QUEEN", style: "hearts" }
]

type AdsenseTypes = {
  pid: string;
}

const AdSense = ({ pid }: AdsenseTypes) => {
  return (
    <Script 
    async
    src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${pid}`}
    crossOrigin="anonymous"
    strategy="afterInteractive"
    />
  )
}

// Flag to determine if we're on the client side
const isClient = typeof window !== 'undefined';

// Custom character mappings for styles not available in the package
type StyleMapWithChars = {
  chars: string;
  base: string;
  prefix?: string;
  suffix?: string;
  join?: string;
};

type StyleMapWithTransform = {
  transform: (text: string) => string;
  clientSideOnly?: boolean; // Flag for transforms that should only run on client
};

type StyleMap = StyleMapWithChars | StyleMapWithTransform;

const customStyleMaps: Record<string, StyleMap> = {
  bubbles: {
    chars: "ⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏ0123456789",
    base: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  },
  squares: {
    chars: "🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉0123456789",
    base: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  },
  invertedSquares: {
    chars: "🅰🅱🅲🅳🅴🅵🅶🅷🅸🅹🅺🅻🅼🅽🅾🅿🆀🆁🆂🆃🆄🅅🅆🅇🅈🅉🅰🅱🅲🅳🅴🅵🅶🅷🅸🅹🅺🅻🅼🅽🅾🅿🆀🆁🆂🆃🆄🅅🅆🅇🅈🅉0123456789",
    base: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  },
  medieval: {
    chars: "𝖆𝖇𝖈𝖉𝖊𝖋𝖌𝖍𝖎𝖏𝖐𝖑𝖒𝖓𝖔𝖕𝖖𝖗𝖘𝖙𝖚𝖛𝖜𝖝𝖞𝖟𝕬𝕭𝕮𝕯𝕰𝕱𝕲𝕳𝕴𝕵𝕶𝕷𝕸𝕹𝕺𝕻𝕼𝕽𝕾𝕿𝖀𝖁𝖂𝖃𝖄𝖅0123456789",
    base: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  },
  hearts: {
    chars: "αв¢∂єƒgнιנкℓмησρqяѕтυνωχуzαв¢∂єƒgнιנкℓмησρqяѕтυνωχуz0123456789",
    base: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    prefix: "❤️ ",
    suffix: " ❤️"
  },
  stars: {
    chars: "αв¢∂єƒgнιנкℓмησρqяѕтυνωχуzαв¢∂єƒgнιנкℓмησρqяѕтυνωχуz0123456789",
    base: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    prefix: "⭐ ",
    suffix: " ⭐"
  },
  brackets: {
    chars: "⟨ᗷᑕᗪᗴᖴᘜᕼIᒍKᒪᗰᑎOᑭᑫᖇᔕTᑌᐯᗯ᙭YᘔᗩᗷᑕᗪᗴᖴᘜᕼIᒍKᒪᗰᑎOᑭᑫᖇᔕTᑌᐯᗯ᙭Yᘔ0123456789",
    base: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    prefix: "『 ",
    suffix: " 』"
  },
  vaporwave: {
    chars: "ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ０１２３４５６７８９",
    base: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    join: " "
  },
  sparkles: {
    chars: "αв¢∂єƒgнιנкℓмησρqяѕтυνωχуzαв¢∂єƒgнιנкℓмησρqяѕтυνωχуz0123456789",
    base: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    prefix: "✨ ",
    suffix: " ✨",
    join: " "
  },
  upside: {
    chars: "ɐqɔpǝɟƃɥᴉɾʞlɯuodbɹsʇnʌʍxʎzⱯꓭͻᗡƎℲ⅁ꓧIſꓘꓶꓯNOԀÒꓤSꓕՈΛϺX⅄Z0ІᘔƐᔭϛ9ㄥ86",
    base: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  },
  glitch: {
    transform: (text: string): string => {
      const glitchChars = ['̷̧', '̵̨', '̸̧', '̷̠', '̸̢', '̶̡', '̵̪'];
      let result = '';
      for (let i = 0; i < text.length; i++) {
        result += text[i] + (Math.random() > 0.7 ? glitchChars[Math.floor(Math.random() * glitchChars.length)] : '');
      }
      return result;
    },
    clientSideOnly: true // Mark as client-side only due to random elements
  },
  leetspeak: {
    transform: (text: string): string => {
      const leetMap: Record<string, string> = {
        'a': '4', 'e': '3', 'i': '1', 'o': '0', 's': '5', 't': '7', 'b': '8', 'l': '1'
      };
      return text.toLowerCase().split('').map((char: string) => leetMap[char] || char).join('');
    }
  },
  morse: {
    transform: (text: string): string => {
      const morseMap: Record<string, string> = {
        'a': '.-', 'b': '-...', 'c': '-.-.', 'd': '-..', 'e': '.', 'f': '..-.', 'g': '--.', 'h': '....',
        'i': '..', 'j': '.---', 'k': '-.-', 'l': '.-..', 'm': '--', 'n': '-.', 'o': '---', 'p': '.--.',
        'q': '--.-', 'r': '.-.', 's': '...', 't': '-', 'u': '..-', 'v': '...-', 'w': '.--', 'x': '-..-',
        'y': '-.--', 'z': '--..', '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
        '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.'
      };
      return text.toLowerCase().split('').map((char: string) => morseMap[char] || char).join(' ');
    }
  },
  binary: {
    transform: (text: string): string => {
      return text.split('').map((char: string) => char.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
    }
  },
  zalgo: {
    transform: (text: string): string => {
      const zalgoUp = [
        '\u030d', '\u030e', '\u0304', '\u0305', '\u033f', '\u0311', '\u0306', '\u0310',
        '\u0352', '\u0357', '\u0351', '\u0307', '\u0308', '\u030a', '\u0342', '\u0343',
        '\u0344', '\u034a', '\u034b', '\u034c', '\u0303', '\u0302', '\u030c', '\u0350',
        '\u0300', '\u0301', '\u030b', '\u030f', '\u0312', '\u0313', '\u0314', '\u033d',
        '\u0309', '\u0363', '\u0364', '\u0365', '\u0366', '\u0367', '\u0368', '\u0369',
        '\u036a', '\u036b', '\u036c', '\u036d', '\u036e', '\u036f', '\u033e', '\u035b',
      ];
      
      let result = '';
      for (let i = 0; i < text.length; i++) {
        result += text[i];
        // Add 1-3 random zalgo characters
        const zalgoCount = Math.floor(Math.random() * 3) + 1;
        for (let j = 0; j < zalgoCount; j++) {
          const randomZalgo = zalgoUp[Math.floor(Math.random() * zalgoUp.length)];
          result += randomZalgo;
        }
      }
      return result;
    },
    clientSideOnly: true // Mark as client-side only due to random elements
  },
  emoji: {
    transform: (text: string): string => {
      // Convert text to emoji representation by adding emoji between chars
      const emojis = ['🔥', '💯', '✨', '💖', '👑', '🌟', '💫', '🎯', '🌈'];
      let result = '';
      for (let i = 0; i < text.length; i++) {
        result += text[i];
        if (i < text.length - 1 && text[i] !== ' ' && text[i+1] !== ' ') {
          result += emojis[Math.floor(Math.random() * emojis.length)];
        }
      }
      return result;
    },
    clientSideOnly: true // Mark as client-side only due to random elements
  }
};

// Custom mapping for fraktur since the package one might not work well
function transformToFraktur(text: string) {
  const frakturMap: Record<string, string> = {
    'a': '𝔞', 'b': '𝔟', 'c': '𝔠', 'd': '𝔡', 'e': '𝔢', 'f': '𝔣', 'g': '𝔤', 'h': '𝔥', 'i': '𝔦', 'j': '𝔧',
    'k': '𝔨', 'l': '𝔩', 'm': '𝔪', 'n': '𝔫', 'o': '𝔬', 'p': '𝔭', 'q': '𝔮', 'r': '𝔯', 's': '𝔰', 't': '𝔱',
    'u': '𝔲', 'v': '𝔳', 'w': '𝔴', 'x': '𝔵', 'y': '𝔶', 'z': '𝔷',
    'A': '𝔄', 'B': '𝔅', 'C': 'ℭ', 'D': '𝔇', 'E': '𝔈', 'F': '𝔉', 'G': '𝔊', 'H': 'ℌ', 'I': 'ℑ', 'J': '𝔍',
    'K': '𝔎', 'L': '𝔏', 'M': '𝔐', 'N': '𝔑', 'O': '𝔒', 'P': '𝔓', 'Q': '𝔔', 'R': 'ℜ', 'S': '𝔖', 'T': '𝔗',
    'U': '𝔘', 'V': '𝔙', 'W': '𝔚', 'X': '𝔛', 'Y': '𝔜', 'Z': 'ℨ'
  };
  
  return text.split('').map(char => frakturMap[char] || char).join('');
}

// Custom mapping for double struck since the package one might not work well
function transformToDoubleStruck(text: string) {
  const doubleStruckMap: Record<string, string> = {
    'a': '𝕒', 'b': '𝕓', 'c': '𝕔', 'd': '𝕕', 'e': '𝕖', 'f': '𝕗', 'g': '𝕘', 'h': '𝕙', 'i': '𝕚', 'j': '𝕛',
    'k': '𝕜', 'l': '𝕝', 'm': '𝕞', 'n': '𝕟', 'o': '𝕠', 'p': '𝕡', 'q': '𝕢', 'r': '𝕣', 's': '𝕤', 't': '𝕥',
    'u': '𝕦', 'v': '𝕧', 'w': '𝕨', 'x': '𝕩', 'y': '𝕪', 'z': '𝕫',
    'A': '𝔸', 'B': '𝔹', 'C': 'ℂ', 'D': '𝔻', 'E': '𝔼', 'F': '𝔽', 'G': '𝔾', 'H': 'ℍ', 'I': '𝕀', 'J': '𝕁',
    'K': '𝕂', 'L': '𝕃', 'M': '𝕄', 'N': 'ℕ', 'O': '𝕆', 'P': 'ℙ', 'Q': 'ℚ', 'R': 'ℝ', 'S': '𝕊', 'T': '𝕋',
    'U': '𝕌', 'V': '𝕍', 'W': '𝕎', 'X': '𝕏', 'Y': '𝕐', 'Z': 'ℤ',
    '0': '𝟘', '1': '𝟙', '2': '𝟚', '3': '𝟛', '4': '𝟜', '5': '𝟝', '6': '𝟞', '7': '𝟟', '8': '𝟠', '9': '𝟡'
  };
  
  return text.split('').map(char => doubleStruckMap[char] || char).join('');
}

// Group styles by category
const styleCategories = {
  "Unicode Styles": ["normal", "bold", "italic", "boldItalic", "script", "boldScript", "fraktur", "boldFraktur", 
                     "doubleStruck", "monospace", "sansSerif", "sansSerifBold", "sansSerifItalic", "sansSerifBoldItalic"],
  "Symbols & Shapes": ["circled", "parenthesized", "bubbles", "squares", "invertedSquares"],
  "Decorative": ["hearts", "stars", "brackets", "sparkles"],
  "Transformations": ["vaporwave", "glitch", "upside", "zalgo", "mirror"],
  "Encodings": ["morse", "binary", "leetspeak"],
  "Fun": ["emoji"]
};

// Safer conversion function that handles package errors
const safeTransform = (text: string, fontName: string): string => {
  try {
    const fonts = getFonts();
    if (!fonts[fontName]) {
      console.warn(`Font not found: ${fontName}`);
      return text;
    }
    return transform(text, fonts[fontName]);
  } catch (error) {
    console.error(`Error transforming with font ${fontName}:`, error);
    return text;
  }
};

// Convert text to the selected style using the package or custom mappings
const convertText = (text: string, style: string) => {
  if (!text) return "";
  
  // Use the normal style (no transformation) if style is "normal"
  if (style === "normal") return text;
  
  try {
    // Special case for fraktur and doubleStruck, use custom mapping
    if (style === "fraktur") {
      return transformToFraktur(text);
    } else if (style === "doubleStruck") {
      return transformToDoubleStruck(text);
    }
    
    // Check if this is a custom style with appropriate mapping
    const styleMap = customStyleMaps[style as keyof typeof customStyleMaps];
    
    if (styleMap) {
      // If it's a client-side only transform and we're on the server, return original text
      if ('transform' in styleMap && styleMap.clientSideOnly && !isClient) {
        return text;
      }
      
      // Check if this is a transform-based style
      if ('transform' in styleMap) {
        return styleMap.transform(text);
      }
      
      // Otherwise it's a character mapping style
      const prefix = (styleMap as StyleMapWithChars).prefix || '';
      const suffix = (styleMap as StyleMapWithChars).suffix || '';
      const join = (styleMap as StyleMapWithChars).join || '';
      
      let resultArray = text.split('').map(char => {
        const index = (styleMap as StyleMapWithChars).base.indexOf(char);
        if (index !== -1) {
          return (styleMap as StyleMapWithChars).chars[index] || char;
        }
        return char;
      });
      
      const resultString = join ? resultArray.join(join) : resultArray.join('');
      return prefix + resultString + suffix;
    }
    
    // Otherwise use the package with safe transformation
    return safeTransform(text, style);
  } catch (error) {
    console.error("Error converting text:", error);
    return text;
  }
}

export default function FancyTextGenerator() {
  const [inputText, setInputText] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("bold");
  const [convertedText, setConvertedText] = useState("");
  const [adCount, setAdCount] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("Unicode Styles");
  const [sampleButtonTexts, setSampleButtonTexts] = useState<Record<number, string>>({});
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Focus the textarea on page load
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  // Convert text when input or style changes
  useEffect(() => {
    setConvertedText(convertText(inputText, selectedStyle));
  }, [inputText, selectedStyle]);

  // Pre-compute sample button text conversions on client side
  useEffect(() => {
    const precomputedTexts: Record<number, string> = {};
    sampleTexts.forEach((sample, index) => {
      precomputedTexts[index] = convertText(sample.text, sample.style);
    });
    setSampleButtonTexts(precomputedTexts);
  }, []);

  // Show popup ad after 3 style conversions
  useEffect(() => {
    if (adCount === 3) {
      const timer = setTimeout(() => {
        toast({
          title: "Ad",
          description: "This would be a popup ad in a real implementation",
          variant: "default",
        });
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [adCount]);

  // Handle style button click
  const handleStyleClick = (style: string) => {
    setSelectedStyle(style);
    setAdCount((prev) => prev + 1);
  };

  // Copy text to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(convertedText);
    toast({
      title: "Copied! ✅",
      description: "Paste into Instagram/TikTok.",
      variant: "default",
    });
  };

  // Apply sample text
  const applySampleText = (sample: { text: string; style: string }) => {
    setInputText(sample.text);
    setSelectedStyle(sample.style);
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white">
      {/* Ad placeholder - Leaderboard */}
      <div className="w-full h-4 flex items-center justify-center mb-6">
        <AdSense pid="ca-pub-9710534353231565" />
      </div>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-5xl font-bold text-center mb-2 bg-gradient-to-r from-green-400 to-purple-500 bg-clip-text text-transparent">
          Turn Boring Text to 𝓕𝓪𝓷𝓬𝔂 Fonts in 1 Click!
        </h1>
        <h2 className="text-lg md:text-xl text-center mb-8 text-gray-300">
          Copy-Paste Ready for Instagram, TikTok, Fortnite, and More!
        </h2>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar ad placeholder */}
          <div className="hidden lg:block w-[200px] h-[600px] flex-shrink-0 self-start sticky top-4">
            <div className="flex items-center justify-center h-full">
              <AdSense pid="ca-pub-9710534353231565" />
            </div>
          </div>

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

            {/* Style category tabs */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Choose a category:</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {Object.keys(styleCategories).map((category) => (
                  <Button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`${
                      selectedCategory === category
                        ? "bg-purple-600 text-white"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    } rounded-lg transition-all`}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            {/* Style buttons */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Choose a style:</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6">
                {styleCategories[selectedCategory as keyof typeof styleCategories].map((styleKey) => (
                  <Button
                    key={styleKey}
                    onClick={() => handleStyleClick(styleKey)}
                    className={`border ${
                      selectedStyle === styleKey
                        ? "border-green-400 bg-gray-800 shadow-[0_0_10px_rgba(74,222,128,0.5)]"
                        : "border-purple-500 bg-gray-900 hover:bg-gray-800"
                    } text-white rounded-lg transition-all`}
                  >
                    {styleNames[styleKey as keyof typeof styleNames]}
                  </Button>
                ))}
              </div>
            </div>

            {/* Preview area */}
            <div className="mb-6">
              <div className="p-4 bg-gray-900 border-2 border-green-400 rounded-lg shadow-[0_0_10px_rgba(74,222,128,0.3)] min-h-16">
                <p className="text-xl break-words">{convertedText || "Preview will appear here"}</p>
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
                    onClick={() => applySampleText(sample)}
                    variant="outline"
                    className="border border-purple-500 bg-gray-900 hover:bg-gray-800 text-white"
                  >
                    {sample.text} {isClient && "→"} {isClient ? sampleButtonTexts[index] || sample.text : sample.text}
                  </Button>
                ))}
              </div>
            </div>

            {/* Mobile ad placeholder */}
            <div className="lg:hidden w-full h-20 flex items-center justify-center mb-6">
              <AdSense pid="ca-pub-9710534353231565" />
            </div>
          </div>

          {/* Sidebar ad placeholder */}
          <div className="hidden lg:block w-[200px] h-[600px] flex-shrink-0  self-start sticky top-4">
            <div className="flex items-center justify-center h-full">
              <AdSense pid="ca-pub-9710534353231565" />
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
            <Button 
              className="bg-purple-500 hover:bg-purple-600"
              onClick={() => window.open('https://www.namecheap.com/domains/domain-name-search/?aff=148051', '_blank')}
            >
              Check Availability on Namecheap
            </Button>
            <Button 
              className="bg-green-500 hover:bg-green-600"
              onClick={() => window.open('https://www.godaddy.com/offers/domains?isc=gofhlkwd&utm_source=affiliate', '_blank')}
            >
              Browse GoDaddy Domains
            </Button>
          </div>
        </div>
      </main>

      <footer className="mt-12 py-6 bg-gray-900 text-center text-gray-400">
        <p>© {new Date().getFullYear()} Fancy Text Generator - Make your social media profiles stand out!</p>
      </footer>
    </div>
  )
}

