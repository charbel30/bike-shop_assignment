# Bike Shop

A dark, skeuomorphic bike-shop app built with Expo and React Native from the "Design To Ship" Figma file. It has four screens: Discover, Product Detail (Description and Specification tabs) and Cart, with a custom tab bar. The app runs in **Expo Go** and needs no development build. used expo go because its faster usually i always use developement mode 

Stack: Expo SDK 57 · Expo Router · React Native 0.86 · TypeScript · [Uniwind](https://uniwind.dev) (Tailwind CSS v4 for React Native) · Reanimated 4 · Zustand · react-native-svg.



See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for how the code is organised.

## Test it on your iPhone (Expo Go)

You need no development build, Apple developer account, Xcode or Mac. The app uses only modules that ship inside Expo Go.

1. On the iPhone, install **[Expo Go](https://apps.apple.com/app/expo-go/id982107779)** from the App Store.
2. On your computer (Node.js 20+ and pnpm), run:

   ```bash
   git clone <this-repo> bike-shop && cd bike-shop
   pnpm i
   pnpm start
   ```

3. Open the iPhone **Camera**, point it at the QR code in the terminal, and tap **Open in Expo Go**.
4. The first time, Expo Go asks for permission to find devices on your local network. Tap **Allow**.

The app loads and should just work. Keep the phone on the same Wi-Fi as the computer. If it can't connect (corporate Wi-Fi, VPN, firewall), stop the server and run `pnpm start --tunnel`, then scan again.

**Android:** install Expo Go from the Play Store and scan the same QR code from inside the Expo Go app.

### What to try

- **Discover:** filter with the category chips, toggle the hearts, and tap the search button to filter by name. Tap a card or the "30% Off" hero to open it; the screen slides in from right to left.
- **Product Detail:** swipe the photo carousel, then switch between **Description** and **Specification**. Specification shows the live Montréal ride-conditions card. Tap **Add to Cart**; accent buttons shrink when pressed.
- **Cart:** use the +/− steppers, swipe a row left to remove it, try a wrong coupon (the field shakes) and then `Bike30`. Drag the **Checkout** knob from left to right to complete the order.

`pnpm web` opens a web build. It is useful for quick layout checks, but Expo Go on a device is the reference.

## Scripts

| Script        | What it does                                                                                                                                                                   |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `pnpm start`  | Start the Metro dev server (Expo Go).                                                                                                                                          |
| `pnpm check`  | Typecheck (`tsc --noEmit`) and lint (`expo lint`).                                                                                                                             |
| `pnpm shot`   | Export the web build, screenshot routes at 375×812, 390×844 and 440×956 and print the path of one contact sheet, with each Figma frame placed next to its route. Options: `--routes=/,/cart,/product/peugeot-lr01` and `--out=<dir>`. |
| `pnpm icons`  | Regenerate `src/components/icons/` from `assets/svg/icons/*.svg` (SVGR).                                                                                                       |
| `pnpm lint`   | Lint only.                                                                                                                                                                     |

`pnpm shot` expects Playwright's Chromium at `~/.cache/ms-playwright/chromium-1248`. Install it with `npx playwright-core install chromium`.

## Assumptions

- **Map, Profile and Docs tabs** aren't in the design. so i showed it as coming soon 
- **Cart tab** follows the Figma cart frame, where the tab bar layer is hidden and a back button is shown. The tab bar slides away on Cart and the back button returns to the previous tab.
- **The cart starts with the three mockup items** 
- **Free shipping** applies when the subtotal is $500 or more. Below that, delivery is a flat $25, and an empty cart pays nothing. The design shows "$0" and "Your cart qualifies for free shipping".
- **Totals** are calculated in integer cents. The three mockup prices add up to $6,119.98. The design prints $6119.99, which looks like an arithmetic slip. The 30% total, $4,283.99, matches the design.
- **Specification tab**: the design's "FREE DATA" placeholder shows live riding conditions for Montréal from the free [Open-Meteo](https://open-meteo.com) API (no key needed)
- **Scaling strategy**: type sizes and spacing stay fixed at their Figma values. Widths are fluid. The hero image, background shape and cards scale with the window width (`width / 390`), so the layout is exact at 390×844 and looks right from 375 to 440 wide.
- **Lottie** is only used for the checkout success animation.
- **Rive** isn't used, so the app stays compatible with Expo Go.


## video gdrive or from repo 

https://drive.google.com/file/d/1HXLMsdStW2YBu_YXoVhH0gRo15uvfTwV/view?usp=sharing
timezone difference because im travelling 

## thoughts 

- i followed the design one to one to the figma but in my opinion this type of UI/ux is not feasable for the user because it just feels like generate mocks and not actual UI that should be used by the  end users.
