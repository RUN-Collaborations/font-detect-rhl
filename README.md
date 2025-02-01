## Font-Detect-RHL <sub><sup>[ [npm](https://www.npmjs.com/package/font-detect-rhl) | [github](https://github.com/RUN-Collaborations/font-detect-rhl) | [netlify](https://font-detect-rhl.netlify.app/) ]</sup></sub>
Font-Detect-RHL is a [React.js](https://reactjs.org/) Hook Library (RHL) that:
1. Detects if fonts are locally installed and returns the status, catering to a stylable font dropdown list.
1. Considers [Graphite](https://graphite.sil.org/)-enabled [fonts](https://software.sil.org/fonts/) and supporting environments.
1. Calculates the text direction ratio by identifying characters as either LTR, RTL, neutral, or markup (optional) as per RegEx.

Use the exported arrays listing over 1000 *font families<sup id="a1">[[1]](#f1)</sup>*, and/or supplied RegEx, customizing as needed.

See also: [How To Tell If A Font Is Copyrighted & Why You Should Always Check](https://logosbynick.com/how-to-tell-if-a-font-is-copyrighted/).

<span id="toc">————————————————————————————</span>

### Contents:
1. [Font Families](#1-font-families)
2. [Font Detection Approach](#2-font-detection-approach)
<br />2.1 [Font Test String](#2-1-font-test-string)
3. [Font Features](#3-font-features)
<br />3.1 [Graphite-enabled Smart Font Features](#3-1-graphite-enabled-smart-font-features)
<br />3.2 [Both Graphite-Enabled and OpenType Font Features](#3-2-both-graphite-enabled-and-opentype-font-features)
<br />3.3 [OpenType Font Features](#3-3-opentype-font-features)
<br />3.4 [All-in-one Graphite-Enabled and OpenType Setting](#3-4-all-in-one-graphite-enabled-and-opentype-setting)
4. [Handling Right-to-Left (RTL) and Left-to-Right (LTR) Text](#4-handling-rtl-and-ltr-text)
5. [Getting Started](#5-getting-started)
<br />3.1 [Web Fonts](#5-1-web-fonts)
<br />3.2 [To Quote or Not to Quote](#5-2-to-quote-or-not-to-quote)
<br />3.3 [Minor Browser Differences Possible](#5-3-minor-browser-differences-possible)
6. [Endnotes](#6-endnotes)

————————————————————————————

<span id="1-font-families">&nbsp;</span>
## Font Families <sub><sup>[ [fontList](https://font-detect-rhl.netlify.app/#/Example?id=usedetectfonts) | [graphiteEnabledFontList](https://font-detect-rhl.netlify.app/#/Example?id=graphiteenabledfontlist) ] ... [↩](#toc)</sup></sub>

Provided font lists focus on normal, regular, roman, and plain fonts. The primary exported font array is [fontList.json](https://github.com/RUN-Collaborations/font-detect-rhl/blob/main/src/fonts/fontList.json) ([fontList](https://font-detect-rhl.netlify.app/#/Example?id=usedetectfonts)), which ***includes***:
* Windows 11 system and supplemental font families
* MacOS system and downloadable font families thru Sonoma (v14)
* Over 250 fonts common to multiple *Linux desktop environments/distributions<sup id="a2">[[2]](#f2)</sup>*
* Pre-installed *Android fonts and a few common App fonts<sup id="a3">[[3]](#f3)</sup>*
* iOS system *fonts<sup id="a4">[[4]](#f4)</sup>*

Note, however that this provided font list ***excludes***:
* Font names that include hairline, thin, ultra-light, extra-light, light, book, medium, demi-bold, semi-bold, bold, extra-bold, heavy, extra heavy, black, extra-black, ultra-black, ultra, italic, slanted, and oblique.
* Thick fonts such as Impact and Cooper
* Symbols, icons, emojis, assets, wingdings, webdings, dingbats, ornaments, math, music, hieroglyphs, cuneiform, numbers, Marlett, etc.
* MS Office Cloud fonts or MacOS document fonts except where there is overlap

A separate array of [Graphite-enabled](https://software.sil.org/fonts/) fonts is also exported -- [graphiteEnabledFontList.json](https://github.com/RUN-Collaborations/font-detect-rhl/blob/main/src/fonts/graphiteEnabledFontList.json) ([graphiteEnabledFontList](https://font-detect-rhl.netlify.app/#/Example?id=graphiteenabledfontlist)):
* These fonts are for use in applications with [Graphite](https://scripts.sil.org/cms/scripts/page.php?site_id=projects&item_id=graphite_about) implemented, a rendering engine for complex scripts that supports “smart fonts” capable of advanced behaviors, including combination and positioning of letters in complex ways.
  * *Firefox<sup id="a5">[[5]](#f5)</sup>* is an application in which Graphite is implemented, and [Electronite](https://www.npmjs.com/package/electronite) is a framework that can be used to build and [package](https://www.npmjs.com/package/electronite-packager) others.
  * Addition of line-height settings and font-size settings are recommended for Graphite-enabled fonts, for purposes of mitigating collisions or near collisions across rows, and for presentation optimization.

<span id="2-font-detection-approach">&nbsp;</span>
## Font Detection Approach <sub><sup>[ [useDetectFonts](https://font-detect-rhl.netlify.app/#/Example?id=usedetectfonts) ] ... [↩](#toc)</sup></sub>
The current approach compares the width of a test string in each font to that of a baseline generic-family, defaulted to monospace<span style="white-space:nowrap;">.*<sup id="a6">[[6]](#f6)</sup>*</span> Apps can also define their own baseline generic-family if preferred. Some other font detect approaches use multiple fallback generic-families, such as `serif, sans-serif, monospace`, though not always in that order.

<span id="2-1-font-test-string">&nbsp;</span>
### Font Test String <sub><sup>... [↩](#toc)</sup></sub>
The default test string is currently `'abcdefghijklmnopqrstuvwxyz0123456789'`. If a font exists that does not support any of these characters, then that font will not be detected. That use-case can be mitigated through use of a custom test string that exists in both the baseline font and the tested font. Some test strings observed in other font detect approaches include `'abcdefghijklmnopqrstuvwxyz& #0123456789'`, `'random_words_#!@#$^&*()+mdvejreu_RANDOM_WORDS'`, and the following suggestion (which seem to have originated with *Lalit Patel<sup id="a7">[[7]](#f7)</sup>*): *"Use m or w because these two characters take up the maximum width."* See *endnotes<sup>[[7]](#f7)</sup>* for links to additional information.

<span id="3-font-features">&nbsp;</span>
## Font Features <sub><sup> ... [↩](#toc)</sup></sub>

<span id="3-1-graphite-enabled-smart-font-features">&nbsp;</span>
### Graphite-enabled Smart Font Features <sub><sup>[ [graphiteEnabledFeatures](https://font-detect-rhl.netlify.app/#/Example?id=graphiteenabledfeatures) ] ... [↩](#toc)</sup></sub>
Graphite-enabled font features have been compiled into json from the following sources as of the indicated font versions. Reference implementations are provided showcasing available font variations for user selection from a Graphite-enabled environment (e.g., Firefox or [Electronite](https://github.com/unfoldingWord/electronite)). Options range from collision avoidance and spacing to regional character variation and other adjustable font-specific display features.

| Links to Smart Font Settings source | Font Version | # of Feature Settings | Brief Font Description |
| :---  | :---: | :---: | :---  |
| [Awami Nastaliq](https://software.sil.org/awami/features/) | 3.300 | 10 | wide variety of languages of South Asia, including but not limited to Urdu |

<span id="3-2-both-graphite-enabled-and-opentype-font-features">&nbsp;</span>
### Both Graphite-Enabled and OpenType Font Features <sub><sup> ... [↩](#toc)</sup></sub>
The following fonts are both Graphite enabled and OpenType enabled. They are included in both [openTypeEnabledFeatures](https://font-detect-rhl.netlify.app/#/Example?id=opentypeenabledfeatures) and  [graphiteEnabledFeatures](https://font-detect-rhl.netlify.app/#/Example?id=graphiteenabledfeatures) as the 'RenderingUnknown' test confirms both RenderingOpenType and RenderingGraphite, depending on the environment. The font features settings are the same in both arrays.

| Links to Smart Font Settings source | Font Version | # of Feature Settings | Brief Font Description |
| :---  | :---: | :---: | :---  |
| [Abyssinica SIL](https://software.sil.org/abyssinica/features/) | 2.201 | 29 | many of the languages of Ethiopia and Eritrea |
| [Padauk](https://software.sil.org/downloads/r/padauk/Padauk-features.pdf) | 5.100 | 15 | writing systems that use the Myanmar script. |

The following font currently utilize *some different* font feature settings when rendered in Graphite vs. when rendered in OpenType enabled. It is included in both [graphiteEnabledFeatures](https://font-detect-rhl.netlify.app/#/Example?id=graphiteenabledfeatures) and [openTypeEnabledFeatures](https://font-detect-rhl.netlify.app/#/Example?id=opentypeenabledfeatures) with differing font feature settings.

| Links to Smart Font Settings source | Font Version | # of Feature Settings | Brief Font Description |
| :---  | :---: | :---: | :---  |
| [Annapurna SIL](https://software.sil.org/downloads/r/annapurna/AnnapurnaSIL-features.pdf) | 2.100 | 18 | writing systems that use the Devanagari script |


<span id="3-3-opentype-font-features">&nbsp;</span>
### OpenType Font Features <sub><sup>[ [openTypeEnabledFeatures](https://font-detect-rhl.netlify.app/#/Example?id=opentypeenabledfeatures) ] ... [↩](#toc)</sup></sub>

| Links to Font Settings source | Font Version | # of Feature Settings | Brief Font Description |
| :---  | :---: | :---: | :---  |
| [Alkalami](https://software.sil.org/alkalami/features/) | 3.000 | 7 | the Kano region of Nigeria and in Niger |
| [Andika](https://software.sil.org/andika/features/) | 6.200 | 53 | comprehensive support for thousands of languages around the world written with Latin and Cyrillic letters and their many variants, including a wide range of additional characters and symbols useful for linguistic and literacy work. |
| [Charis SIL](https://software.sil.org/charis/features/) | 6.200 | 41 | wide range of languages that use the Latin and Cyrillic scripts. |
| [Doulos SIL](https://software.sil.org/doulos/features/) | 6.200 | 40 | wide range of languages that use the Latin and Cyrillic scripts |
| [Gentium Plus](https://software.sil.org/gentium/features/) | 6.200 | 45 | Latin, Cyrillic, and Greek scripts |
| [Harmattan](https://software.sil.org/harmattan/features/) | 4.300 | 19 | languages using the Arabic script in West Africa. |
| [Kanchenjunga](https://software.sil.org/kanchenjunga/features/) | 2.001 | 4 | Kirat Rai script of South Asia. |
| [Lateef](https://software.sil.org/lateef/features/) | 4.300 | 17 | Sindhi and other languages of southern Asia |
| [Ruwudu](https://software.sil.org/ruwudu/features/) | 3.000 | 7 | style of writing is used by the Manga people in Niger, West Africa |
| [Scheherazade New](https://software.sil.org/scheherazade/features/) | 4.300 | 18 | a “simplified” rendering of Arabic script, using basic - connecting glyphs but not including a wide variety of additional ligatures or contextual alternates (only the required lam-alef ligatures) |
| [Tagmukay](https://software.sil.org/tagmukay/smart-font-features/)<sup>(*)</sup> | 2.000 | 2 | a Shifinagh script font with support for the Tawallammat Tamajaq language |

 (*) The [Tagumukay font desription](https://software.sil.org/tagmukay/) indicates both "Graphite and OpenType tables..." The 'RenderingUnknown' test leads to 'RenderingUnknown' with version 2.000. The font features settings are presently only included in [openTypeEnabledFeatures](https://font-detect-rhl.netlify.app/#/Example?id=opentypeenabledfeatures). However, it is rendering in Graphite in Firefox, the OpenType font features settings will still work.

<span id="3-4-all-in-one-graphite-enabled-and-opentype-setting">&nbsp;</span>
### All-in-one Graphite-Enabled and OpenType Setting <sub><sup>[ [fontFeatureSettings](https://font-detect-rhl.netlify.app/#/Example?id=fontfeaturesettings) ] ... [↩](#toc)</sup></sub>

Indicators are included to adjust for the following difference in providing graphite-enabled settings and open type enabled settings combined in one json resource:

- **Awami Nastaliq**:
    - *settings that require Graphite (not available in Open Type)*:
        - everything
- **Annapurna SIL**:
    - *settings that require Graphite*:
        - Jha alternates (cv01)
        - Digit nine alternates" (cv10)
    - *settings that require Open Type*:
        - Jha alternates - ss01 (ss01)
        - Jha alternates - ss02 (ss02)
        - Digit nine alternates - ss10 (ss10)
        - Digit nine alternates - ss11 (ss11)
    - *settings that require Open Type (not available in Graphite)*:
        - Fractions (frac)
- **Padauk**:
    - *settings that require Graphite (not available in Open Type)*:
        - Lower dot shifts left (lldt)
        - Long U with Yayit, long UU with Hato (ulon)
        - U and UU always full height (utal)
        - Insert dotted circles for errors (any combining mark) (dotc)
        - Disable great nnya (nnya)
        - Variant tta (vtta)
        - Move ldot right when possible (dotr)

<span id="4-handling-rtl-and-ltr-text">&nbsp;</span>
## Handling Right-to-Left (RTL) and Left-to-Right (LTR) Text <sub><sup>[&nbsp;[useDetectDir](https://font-detect-rhl.netlify.app/#/Example?id=usedetectdir)&nbsp;] ... [↩](#toc)</sup></sub>
The useDetectDir hook enables simple autodetection of RTL/LTR text through examining the range of unicode values of characters of the text. Code utilized in this hook originated from [Christopher Klapp](https://github.com/klappy)'s [detectRTL.js](https://github.com/unfoldingWord-box3/simple-text-editor-rcl/blob/9e34aa5618cf1b06409b2c169ba5bd86229e6d45/src/helpers/detectRTL.js).

While a custom RTL scope can be utilized, the default RTL scope is comprehensive for all RTL unicode ranges in v16.0 standards, as follows:
* Contemporary Scripts
  * Adlam (U+1E900 - U+1E95F)
  * Arabic, Arabic Supplement, Arabic Presentation Forms-A, Arabic Presentation Forms-B, Arabic Extended-A, Arabic Extended-B, Arabic Extended-C (U+0600 - U+06FF, U+0750 - U+077F, U+FB50 - U+FDFF, U+FE70 - U+FEFF, U+08A0 – U+08FF, U+0870 – U+089F, U+10EC0 – U+10EFF)
  * Garay (U+10D40 - U+10D8F)
  * Hanifi Rohingya (U+10D00 - U+10D3F)
  * Hebrew, Alphabetic Presentation Forms (U+0590 - U+05FF, U+FB00 - U+FB4F)
  * Mandaic (U+0840 - U+085F)
  * Mende Kikakui (U+1E800 - U+1E8DF)
  * N'Ko (U+07C0 - U+07FF)
  * Samaritan (U+0800 - U+083F)
  * Syriac (U+0700 - U+074F)
  * Thaana (U+0780 - U+07BF)
  * Yezidi (U+10E80 - U+10EBF)
* Ancient Scripts
  * Old South Arabian (U+10A60 - U+10A7F)
  * Old North Arabian (U+10A80 - U+10A9F)
  * Imperial Aramaic (U+10840 - U+1085F)
  * Avestan (U+10B00 - U+10B3F)
  * Cypriot Syllabary (U+10800 - U+1083F)
  * Egyptian Hieroglyphs, Egyptian Hieroglyph Format Controls, Egyptian Hieroglyphs Extended-A (U+13000 - U+1342F, U+13430 - U+1345F, U+13460 – U+143FF)
  * Ethiopic, Ethiopic Supplement, Ethiopic Extended, Ethiopic Extended-A, Ethiopic Extended-B (U+1200 - U+137F, U+1380 - U+139F, U+2D80 - U+2DDF, U+AB00 - U+AB2F, U+1E7E0 - U+1E7FF)
  * Hatran (U+108E0 - U+108FF)
  * Old Hungarian (U+10C80 - U+10CFF)
  * Old Italic (U+10300 - U+1032F)
  * Kharoshthi (U+10A00 - U+10A5F)
  * Lydian (U+10920 - U+1093F)
  * Nabataean (U+10880 - U+108AF)
  * Inscriptional Pahlavi, Inscriptional Parthian, Psalter Pahlavi (U+10B60 - U+10B7F, U+10B40 - U+10B5F, U+10B80 - U+10BAF)
  * Old Persian (U+103A0 - U+103DF)
  * Phoenician (U+10900 - U+1091F)
  * Sogdian, Old Sogdian (U+10F30 - U+10F6F , U+10F00 - U+10F2F)
  * Todhri (U+105C0 - U+105FF)
  * Old Turkic (U+10C00 - U+10C4F)

A custom neutral character scope can also be utilized to specify text that is not meant to be considered in the RTL or LTR direction test. The default neutral scope includes:
* line breaks -- /\r?\n|\r/g (also matches unix \n and old Mac's single \r)
* periods -- /\./g
* hyphen-minus -- /-/g
* no-break space (NBSP) -- U+00A0
* narrow no-break space (NNBSP) -- U+202F
* Directionality characters
  * left-to-right mark (LRM) -- U+200E
  * right-to-left-mark (RLM) --  U+200F
* Zero Width Characters
  * zero width space (ZWSP) -- U+200B
  * ‌zero width non-joiner (ZWNJ) - U+200C
  * ‍zero width joiner (ZWJ) -- U+200D
  * word joiner (WJ) -- U+2060
  * zero-width no-break space (ZWNBSP) -- U+FEFF
* [Characters that Act Like Spaces](https://unicode-explorer.com/articles/space-characters)
  * mongolian vowel separator (MVS) -- U+180e
  * braille pattern blank -- U+2800
  * hangul filler -- U+3164
* Visible Spaces
 * symbol for space -- U+2420
 * blank symbol -- U+2422
 * open box -- U+2423
* [Bidirectional "White Space" Characters](https://www.compart.com/en/unicode/bidiclass/WS)
  * Form Feed -- U+000C = \f
  * Space -- U+0020
  * Ogham Space Mark -- U+1680
  * En Quad -- U+2000
  * Em Quad -- U+2001
  * En Space -- U+2002
  * Em Space -- U+2003
  * Three-Per-Em Space -- U+2004
  * Four-Per-Em Space -- U+2005
  * Six-Per-Em Space -- U+2006
  * Figure Space -- U+2007
  * Punctuation Space -- U+2008
  * Thin Space -- U+2009
  * Hair Space -- U+200A
  * Line Separator -- U+2028
  * Medium Mathematical Space -- U+205F
  * Ideographic Space -- U+3000

<span id="5-getting-started">&nbsp;</span>
## Getting Started <sub><sup>... [↩](#toc)</sup></sub>
1. Explore the [Style Guide Example](#/Example) and documentation of [useDetectFonts](#/Example?id=usedetectfonts), [fontList](#/Example?id=fontlist), [useAssumeGraphite](#/Example?id=useassumegraphite), [useDetectRender](#/Example?id=usedetectrender), [graphiteEnabledFontList](#/Example?id=graphiteenabledfontlist), [graphiteEnabledFeatures](#/Example?id=graphiteenabledfeatures), [openTypeEnabledFeatures](#/Example?id=opentypeenabledfeatures), [fontFeatureSettings](#/Example?id=fontfeaturesettings), and [useDetectDir](#/Example?id=usedetectdir).

1. Then take advantage of these CodeSandbox examples applying font-detect-rhl:
  * Material UI Examples: [Font Dropdown](https://codesandbox.io/p/devbox/mui-font-detect-rhl-xui47y?file=/src/components/SelectMUI.jsx) | [with type your font](https://codesandbox.io/p/devbox/mui-font-detect-rhl-type-your-font-8xqw6p)<br />
     *See also [Simple USFM Editor App](https://simple-usfm-editor-app.netlify.app/) | [source code](https://github.com/klappy/simple-usfm-editor-app/blob/main/src/components/font-configuration/)*
  * Tailwind CSS Examples with Tailwind Elements with sliders for Font Size and Height: [Font Dropdown](https://codesandbox.io/p/devbox/font-detect-rhl-react18-tailwindcss3-tw-elements-5lzvjg?file=/src/components/Example.jsx) | [with type your font](https://codesandbox.io/p/devbox/font-detect-rhl-react18-tailwindcss3-tw-elements-type-your-font-pjd3qs)
  * Tailwind CSS Examples with Headless UI: [Font Dropdown](https://codesandbox.io/p/devbox/font-detect-rhl-react18-tailwindcss3-headlessui-sfcneo?file=/src/components/Example.jsx) | [with type your font](https://codesandbox.io/p/devbox/font-detect-rhl-react18-tailwindcss3-headlessui-type-your-font-zpcprs)<br />
  *See also [Simple USFM Alignment Prototype](https://simple-usfm-alignment-prototype.netlify.app/) | [source code](https://github.com/RUN-Collaborations/simple-usfm-alignment-prototype/blob/master/src/components/FontDropdown.jsx)*
  * [useDetectDir](https://codesandbox.io/p/devbox/usedetectdir-font-detect-rhl-280fws?file=/src/components/DetectDir.jsx)
  * [useAssumeGraphite](https://codesandbox.io/p/devbox/useassumegraphite-font-detect-rhl-dnlqs1?file=/src/components/UtilizeGraphiteFonts.jsx)

<span id="5-1-web-fonts">&nbsp;</span>
### Web Fonts <sub><sup>... [↩](#toc)</sup></sub>
Web fonts are not addressed by this rhl, though are an additional app concern for developers to consider. There are multiple ways in which web fonts can be delivered, such as base64, woff2, woff, ttf, otf, packaged with an app, self hosted, or third-party-hosted.

If providing a web font for which a user may also have a local version, consider making allowances for the possibility that version differences can exist. Consider giving users maximum control by allowing selection of either a web font or a locally installed version of the font, taking care not to override one with the other.

For one approach to web fonts coupled with locally detected fonts, see:
  * [Font-Detect-RHL + Embedded Web Fonts with MUI](https://codesandbox.io/p/devbox/mui-font-detect-rhl-embedded-web-fonts-rtn566?file=/src/components/SelectMUI.jsx)
  * [Font-Detect-RHL + Embedded Web Fonts with TailwindCSS and Tailwind Elements with sliders for Font Size and Height](https://codesandbox.io/p/devbox/font-detect-rhl-react18-tailwindcss3-tw-elements-embedded-web-fonts-cpzhl8?file=%2Fsrc%2Fcomponents%2FExample.jsx)
  * [Font-Detect-RHL + Embedded Web Fonts with TailwindCSS and HeadlessUI](https://codesandbox.io/p/devbox/font-detect-rhl-react18-tailwindcss3-headlessui-embedded-web-fonts-6m4gdt?file=/src/components/Example.jsx)

And for further insight on application of web fonts, see *[How to Optimize Web Font Loading Performance with Best Practices](https://www.holisticseo.digital/pagespeed/loading-font/)*.

<span id="5-2-to-quote-or-not-to-quote">&nbsp;</span>
### To Quote or Not to Quote <sub><sup>... [↩](#toc)</sup></sub>
Font lists provided here do not include any Generic Font Families. It is recommended<sup id="a8">[[8]](#f8)</sup> to add quotes around detected font results. useDetectFonts tests fonts with quotes around them against a baseline generic font without quotes.

Generic<sup id="a9">[[9]](#f9)</sup> font families, global values<sup id="a10">[[10]](#f10)</sup>, and Apple's aliases<sup id="a11">[[11]](#f11)</sup> for default fonts must be requested without quotes. Adding quotes requests a specific font by that name rather than applying the keyword.

<span id="5-3-minor-browser-differences-possible">&nbsp;</span>
### Minor Browser Differences Possible <sub><sup>... [↩](#toc)</sup></sub>
There are some one-off cases in which at least one web browser does not properly apply a few locally installed fonts to pages served over the Internet. So, if your browser is not cooperating with an installed font in the detectable list used, then try a different browser or serve your page locally.<sup id="a12">[[12]](#f12)</sup>
___

<span id="6-endnotes">&nbsp;</span>
## Endnotes <sub><sup>... [↩](#toc)</sup></sub>
[<b id="f1">1</b>] ... "Font family refers to all the variations of a typeface that share a common name. For example, Times Roman, Times Italic, Times Bold, and Times Bold Italic are all members of the same font family." [[source](http://theworldsgreatestbook.com/choosing-book-font/)] ... [↩](#a1)

[<b id="f2">2</b>] ... Fonts installed with linux vary significantly by desktop environment and [distribution](https://distrowatch.com/). The compiled list included here represents style="Regular", style="Normal", and style="Roman" from an `fc-list` that overlap in four or more of the following combinations:
* Cinnamon - Linux Mint 20.3
* Fluxbox - MX Linux 22.1
* Gnome - Manjaro 21.2.6
* Gnome - Ubuntu 22.04
* KDE (Plasma) - MX Linux 22.1
* Mate - Linux Mint 20.3
* Mate - Ubuntu 20.04.4
* Xfce - Endeavour Apollo 22.1
* Xfce - Linux Mint 20.3
* Xfce - MX Linux 22.1 ... [↩](#a2)

[<b id="f3">3</b>] ... Android: Droid Sans, Droid Serif, Droid Sans Mono, Roboto, Lato, Montserrat, Source Sans Pro, Raleway, Merriweather, Nunito Sans, and Poppins. [[source 1](https://www.designyourway.net/blog/best-fonts-for-android/) | [[source 2](https://stackoverflow.com/questions/3532397/how-to-retrieve-a-list-of-available-installed-fonts-in-android)] ... [↩](#a3)

[<b id="f4">4</b>] ... iOS: New York, SF Pro Text, SF Pro Display, SF Pro, SF Compact, SF Mono, SF Arabic, SF Armenian, SF Georgian, and SF Hebrew. [[source 1](https://developer.apple.com/fonts/) | [source 2](https://9to5mac.com/2021/10/25/apple-refreshes-design-resources-for-ios-15-with-new-templates-fonts-and-website/)], and many pre-installed fonts that overlap with MacOS system and downloadable font families [[source](https://developer.apple.com/fonts/system-fonts/)]  ... [↩](#a4)

[<b id="f5">5</b>] ... If [gfx.font_rendering.graphite.enabled](https://silnrsi.github.io/FDBP/en-US/Browsers%20as%20a%20font%20test%20platform.html) is ever set to false in about:config in [Firefox](https://www.mozilla.org/firefox/all/), then Graphite will not be enabled and graphite-enabled fonts will not render properly. To access this setting in [Firefox Configuration Editor](https://support.mozilla.org/en-US/kb/about-config-editor-firefox):
* Type about:config in your address bar and press Enter.
* Click on the "I'll be careful, I promise" button.
* Type "graphite" in your search bar to look for gfx.font_rendering.graphite.enabled.
* Double-click on the preference name line to toggle the value between false and true. [A bold line indicates a setting that is set to true.](https://support.mozilla.org/en-US/kb/about-config-editor-firefox) ... [↩](#a5)

[<b id="f6">6</b>] ... Closely followed logic in [Detect Whether a Font is Installed](https://www.kirupa.com/html5/detect_whether_font_is_installed.htm), then after implementation found [fontexist.js](https://gist.github.com/alloyking/4154494). Uncertain of the original source. ... [↩](#a6)

[<b id="f7">7</b>] ... Additional references:
* [JavaScript/CSS Font Detector by Lalit Patel](https://gist.github.com/szepeviktor/d28dfcfc889fe61763f3)
* Additional reference links are available in the Alternatives section of https://github.com/rwoodr/fontcheck
* Consider also the following search strings to look for further information:
  * Detect Font
  * Font Detect
  * Font Detector
  * Font Check
  * Font Checker
  * Available Fonts
  * Is Font Available ... [↩](#a7)

[<b id="f8">8</b>] ... While fonts technically can be requested without quotes, that calls for escaping special characters. See [Unquoted font family names in CSS](https://mathiasbynens.be/notes/unquoted-font-family). ... [↩](#a8)

[<b id="f9">9</b>] ... serif. sans-serif, cursive, fantasy, system-ui, monospace, ui-serif, ui-sans-serif, ui-monospace, ui-rounded, math, emoji, and fangsong, as in: `font-family: monospace;`,.... For explanations and examples, see the [`<generic=name>` section of this font-family CSS property documentation](https://developer.mozilla.org/en-US/docs/Web/CSS/font-family#generic-name). ... [↩](#a9)

[<b id="f10">10</b>] ... inherit, initial, revert, revert-layer, and unset, as in: `font-family: inherit;` ... [↩](#a10)

[<b id="f11">11</b>] ... BlinkMacSystemFont, -apple-system, -apple-system-body, -apple-system-headline, -apple-system-subheadline, -apple-system-caption1, -apple-system-caption2, -apple-system-footnote, -apple-system-short-body, -apple-system-short-headline, -apple-system-short-subheadline, -apple-system-short-caption1, -apple-system-short-footnote, and -apple-system-tall-body", as in `font-family: -apple-system;` ... [↩](#a11)

[<b id="f12">12</b>] ... On Windows 11, Brave Version 1.64.113 (Chromium: 123.0.6312.86 (Official Build) (64-bit)) recognizes the following fonts on pages served locally, but not when served over the Internet (tested via CodeSandbox and Netlify). On the other hand, Firefox 124.0.1 (64-bit) renders these properly in each case: [Aldhabi](https://learn.microsoft.com/en-us/typography/font-list/aldhabi), [Andalus](https://learn.microsoft.com/en-us/typography/font-list/andalus), [Arabic Typesetting](https://learn.microsoft.com/en-us/typography/font-list/arabic-typesetting), [Leelawadee](https://learn.microsoft.com/en-us/typography/font-list/leelawadee), [Microsoft Uighur](https://learn.microsoft.com/en-us/typography/font-list/microsoft-uighur), [Noto Sans](https://fonts.google.com/noto/specimen/Noto+Sans), [Sakkal Majalla](https://learn.microsoft.com/en-us/typography/font-list/sakkal-majalla), [Simplified Arabic](https://learn.microsoft.com/en-us/typography/font-list/simplified-arabic), [Traditional Arabic](https://learn.microsoft.com/en-us/typography/font-list/traditional-arabic), and [Urdu Typesetting](https://learn.microsoft.com/en-us/typography/font-list/urdu-typesetting). There may be others, and Brave/Chromium may improve this over time. ... [↩](#a12)