# Architecture

This document explains how the app is organised. It's meant to be read in order the first time.

## Folder map

```
src/
  app/                      Routes only (Expo Router). Each file is a URL and stays thin.
    _layout.tsx             Root Stack: fonts, status bar, gesture root, screen transitions
    (tabs)/_layout.tsx      Bottom tabs with the custom tab bar
    (tabs)/index.tsx        "/"          → screens/discover
    (tabs)/cart.tsx         "/cart"      → screens/cart
    (tabs)/map|profile|docs "/map" ...   → screens/placeholder
    product/[id].tsx        "/product/:id" → screens/product-detail
  screens/<name>/           Screen bodies. Screen-only components go next to them here.
  components/               Shared building blocks (one named export per file)
    icons/                  Generated from assets/svg/icons by `pnpm icons`. Don't edit by hand.
    tab-bar/                The custom tab bar (bar shape, selected tile, behaviour)
  data/                     Typed local catalog (products, categories)
  store/                    Zustand stores (cart, favourites, coupon)
  utils/                    Pure functions (cart totals, price formatting)
  hooks/                    Shared hooks (safe-area insets, design scale)
  theme/                    Tokens CSS can't hold (motion configs, layout constants)
  global.css                Tailwind/Uniwind entry and design tokens (@theme)
assets/
  images/products/          Product photos exported from Figma (cropped, transparent PNG)
  svg/icons/                Source SVGs for the icon components
  svg/shapes/               Reference SVGs for shapes drawn in code (background, tab bar, tile)
docs/figma/                 Figma frame exports, used as references by `pnpm shot`
scripts/shot.mjs            Screenshot contact-sheet tool
```

Route files only read params and render a screen. Code under `src/app` becomes routes, so keeping logic in `src/screens` keeps the route tree readable and the screens easy to move around.

## Navigation: how the layouts nest

Expo Router turns folders into navigators. Each `_layout.tsx` decides how its children are presented:

```
Root Stack                      (src/app/_layout.tsx)
├── (tabs)  → Tabs navigator    (src/app/(tabs)/_layout.tsx)
│   ├── index    Discover
│   ├── map      placeholder
│   ├── cart     Cart (tab bar hidden)
│   ├── profile  placeholder
│   └── docs     placeholder
└── product/[id] Product Detail (pushed over the tabs)
```

- **The root Stack** holds the whole tab group as one screen and pushes `product/[id]` on top of it. Because the product page lives *outside* `(tabs)`, it covers the tab bar, as in the design. `animation: 'slide_from_right'` gives the "right to left swipe" from the MOTION section.
- **`(tabs)`** is a *group*: the parentheses keep it out of the URL, so Discover is `/`, not `/tabs`. Its layout uses `Tabs` from `expo-router/js-tabs` with `animation: 'shift'`, so switching tabs slides the screens sideways. `backBehavior="history"` makes the Cart's back button return to whichever tab you came from.
- **Linking**: `<Link href="/product/peugeot-lr01">` or `router.push('/product/peugeot-lr01')`. Typed routes are on, so TypeScript catches broken hrefs.
- **Params**: `product/[id].tsx` reads `useLocalSearchParams<{ id: string }>()` and passes `id` to the screen.

### The tab bar

`components/tab-bar/tab-bar.tsx` replaces the default bar through the `tabBar` prop. It reads each route's `tabBarIcon` option, so icons are declared in the layout next to the routes. It is positioned absolutely, which lets screen content scroll underneath the slanted top edge. Things to know:

- On tab screens, pad scroll content by `useScreenInsets().tabBar`.
- A screen can hide the bar with `tabBarStyle: { display: 'none' }` (Cart does this). The bar then slides off-screen.
- The selected tile springs between tabs (`springs.tab`). It always stays at least 17dp from the screen edge, as the Figma tile does on the first tab.

## Theming with Uniwind

[Uniwind](https://docs.uniwind.dev) compiles Tailwind CSS v4 into React Native styles at build time. `metro.config.js` wraps the Metro config with `withUniwindConfig` (it must stay the outermost wrapper) and points it at `src/global.css`.

**Tokens live in one place: the `@theme` block in `src/global.css`.** Each CSS variable becomes utility classes automatically:

| Variable in `@theme`              | Class you write              |
| --------------------------------- | ---------------------------- |
| `--color-bg`                      | `bg-bg`, `text-bg`, `border-bg` |
| `--color-accent-from` / `-to`     | `bg-linear-to-br from-accent-from to-accent-to` |
| `--radius-card`                   | `rounded-card`               |
| `--shadow-raised`                 | `shadow-raised`              |
| `--inset-shadow-skeuo`            | `inset-shadow-skeuo`         |
| `--text-title` (+ `--line-height`) | `text-title` (sets size and line height) |
| `--tracking-tight`                | `tracking-tight`             |
| `--font-poppins-bold`             | `font-poppins-bold`          |

Tokens are named by **role** (`surface-raised`, `fg-muted`), not by value. The app is dark-only, so there are no light/dark variants. Comments next to each value give its Figma origin (node id).

**When a value is needed in JS** (SVG gradient stops, navigator `contentStyle`), read it with `useCSSVariable('--color-…')` from `uniwind` instead of copying the hex code. The block is declared `@theme static` so every variable is emitted even if no class uses it.

**Fonts**: React Native can't synthesise bold for custom fonts, so every weight is its own family. `@expo-google-fonts/poppins` loads `Poppins_400Regular` … `Poppins_700Bold` in the root layout, and `--font-poppins[-medium|-semibold|-bold]` map those names to classes. `AppText` hides all of this behind `weight="bold"`.

**`src/theme/`** holds what CSS can't: `motion.ts` (Reanimated spring and timing configs) and `layout.ts` (design width, gutters, tab bar geometry).

**`style` vs `className`**: style with classes. Use `style` only for values computed at runtime (sizes derived from the window width, safe-area padding) and for Reanimated animated styles. Third-party components without `className` support (`Svg`, `GestureHandlerRootView`) also take `style`.

**Avoid conflicting classes.** Uniwind doesn't merge classes, so `text-fg text-fg-muted` on the same element has no well-defined winner. Shared components therefore expose props (`tone`, `weight`, `variant`) for anything they style themselves, and keep `className` for layout (margins, flex, size).

## Responsive approach

The Figma frames are 390×844. The rules:

1. **Type and spacing stay fixed.** A 15pt label is 15pt on every phone, which matches how iOS and Android treat text.
2. **Widths are fluid.** Layout uses flex, so rows stretch to fill the screen.
3. **Hero art scales with width.** `useDesignScale()` returns `windowWidth / 390`. Multiply Figma sizes by it for the background shape, hero image and product cards, so they keep their proportions.
4. **Insets are floored at the Figma device.** `useScreenInsets()` uses the real safe area but never less than Figma's 44dp status bar and 34dp home indicator. As a result web, Android and iPhone all match the mockup's vertical rhythm. `top` is where the 44dp navigation row starts (y = 60 in Figma).

`pnpm shot` checks 375, 390 and 440 wide side by side with the Figma frame.

## Motion

All motion uses Reanimated 4, and all configs come from `src/theme/motion.ts`:

| Figma MOTION note                         | Implementation                                                         |
| ----------------------------------------- | ---------------------------------------------------------------------- |
| In between screens: right-to-left swipe   | Root Stack `animation: 'slide_from_right'`; tabs use `animation: 'shift'` |
| Accent buttons shrink on press            | `PressableScale` springs to `PRESS_SCALE` (130/160, from frames 2:73/2:87) |
| Skeuomorphic buttons: smooth transition   | `SkeuoButton` crossfades raised ↔ pressed with `timings.skeuo`          |
| Checkout slides left to right             | Cart screen (Phase 2)                                                  |

Conventions:

- Write to shared values with `.set()` and read them with `.get()`, not `.value`. This keeps the React Compiler (enabled in `app.json`) happy.
- Animate `transform` and `opacity` only, never layout properties.
- Prefer springs for anything the user drives (press, drag) and timings for state crossfades.

## Shared components

| Component          | Purpose                                                                           |
| ------------------ | --------------------------------------------------------------------------------- |
| `AppText`          | Poppins on the Figma type ramp: `variant`, `weight`, `tone`, `tracking`           |
| `PressableScale`   | Pressable that shrinks while held                                                 |
| `GradientButton`   | Accent-gradient call-to-action ("Add to Cart", "Apply")                           |
| `IconButton`       | 44×44 accent square with an icon (search, back, checkout)                         |
| `SkeuoSurface`     | Raised or sunken skeuomorphic container (`raised`, `pressed`, `well`, `stepper`, `field`) |
| `SkeuoButton`      | Segmented-control button that animates between pressed and raised                 |
| `ScreenBackground` | Page container with the app background and the optional diagonal shape           |
| `BackgroundShape`  | The diagonal gradient shape, scaled to the window                                 |
| `icons/*`          | Generated SVG icons; each takes `size` (longest side) and `color`                 |

## State and data

- `data/products.ts`: the typed `Product` catalog and `getProduct(id)`. Images are local `require`s, so they work offline and in Expo Go.
- `store/cart.ts`: a Zustand store (`useCart`) holding cart lines, favourites and the applied coupon. Select narrowly (`useCart((s) => s.items)`) so components only re-render when their slice changes. `useCartLines()` joins lines with products, and `useCartTotals()` calculates the totals.
- `utils/cart-totals.ts`: pure, framework-free maths in integer cents: free-shipping threshold, delivery fee and coupons.

## How to add a screen

1. Create the body in `src/screens/<name>/index.tsx` as a named export (`export function OrdersScreen()`). Start from `ScreenBackground`, use `useScreenInsets().top` for the navigation row, and add `.tabBar` as bottom padding if the screen lives in a tab.
2. Add a thin route file:
   - a new tab: `src/app/(tabs)/<name>.tsx`, plus a `<Tabs.Screen name="<name>" options={{ title, tabBarIcon }} />` entry in `(tabs)/_layout.tsx`;
   - a pushed page: `src/app/<name>.tsx` or `src/app/<name>/[param].tsx`, plus a `<Stack.Screen>` entry in the root layout.
   The route file only reads params and renders the screen.
3. Need a new icon? Drop the Figma SVG into `assets/svg/icons/<kebab-name>.svg` (replace white fills with `currentColor`) and run `pnpm icons`.
4. Run `pnpm check` and `pnpm shot --routes=/<name>`.
