import React, { useEffect, useState } from 'react';
import { CHIEF_INFO } from '../data/portfolioData';
import './HeroSection.css';

/**
 * Interactive artwork hero ("canvas mode").
 *
 * The personalised illustration is the stage. Invisible, accessible buttons are
 * laid over each paper card (and the character) using percentage boxes measured
 * from the artwork, so they stay aligned at every screen size.
 *
 * - On load (and on "Replay") the figure is drawn in stage by stage, like the intro video
 * - Hover / focus a card  -> red ring, soft tint and a tooltip
 * - Click a card          -> project showcase modal
 * - Click the character   -> "About me" drawer
 * - Phones                -> the same cards are repeated as tappable chips under the art
 *
 * The artwork lives in /public/images/hero/anim/*.webp (one file per layer). If you change it,
 * re-cut the layers and re-measure the hotspot boxes below (percent of stage width / height).
 */

interface WorkItem {
  title: string;
  tag: string;
  /** optional link (external URL or #section) */
  href?: string;
}

interface Skill {
  id: string;
  label: string;
  description: string;
  /** hotspot box over the artwork, in percent, plus the card's tilt */
  l: number;
  t: number;
  w: number;
  h: number;
  rot: number;
  pill?: boolean;
  work: WorkItem[];
}

/**
 * EDIT YOUR SKILLS HERE.
 * - `label`: the text printed on the paper card (use short names, 1-3 words; it is drawn as live text)
 * - `description`: shown in the popup when the card is clicked
 * - `work`: your projects for that skill (title, tag, optional link)
 * You can rename the cards freely; to add or remove a card you also need to move/copy a hotspot box (l, t, w, h, rot).
 *
 * Add your real work here. Categories with no items show a "get in touch" state
 * instead of made-up numbers.
 */
const SKILLS: Skill[] = [
  {
    id: 'video-editing',
    label: 'Projects',
    description: 'High-retention short-form reels, commercial cuts, motion graphics and colour grading.',
    l: 13.7, t: 54.4, w: 9.3, h: 9.7, rot: -4,
    work: [],
  },
  {
    id: 'ai-content',
    label: 'AI CONTENT CREATION',
    description: 'Generative visual workflows, character consistency and AI-driven creatives.',
    l: 12.0, t: 83.3, w: 11.5, h: 10.9, rot: -6,
    work: [],
  },
  {
    id: 'graphic-design',
    label: 'summon cv',
    description: 'Bold poster typography, key visuals and social media design systems.',
    l: 68.75, t: 57.3, w: 9.6, h: 9.4, rot: 2,
    work: [],
  },
  {
    id: 'design',
    label: 'SKILLS',
    description: 'Interactive web experiences, landing pages and visual storytelling.',
    l: 82.1, t: 54.7, w: 8.4, h: 7.6, rot: 12,
    pill: true,
    work: [{ title: 'This interactive portfolio', tag: 'React · TypeScript · Tailwind', href: '#citadel-base' }],
  },
  {
    id: 'brand-creative',
    label: 'BRAND CREATIVE',
    description: 'Visual identity, brand guidelines and creative direction from idea to launch.',
    l: 82.1, t: 83.0, w: 9.6, h: 8.9, rot: -2,
    work: [],
  },
];

/** Layers cut from the illustration (percent of the stage). Drawn in order, bottom to top. */
const LAYERS = [
  { src: 'base', cls: 'base', l: 0.0, t: 0.0, w: 100.0, h: 100.0 },
  { src: 'woven', cls: 'woven', l: 0.0, t: 0.0, w: 100.0, h: 100.0 },
  { src: 'web1', cls: 'web web1', l: 51.781, t: 17.578, w: 5.632, h: 10.417 },
  { src: 'web2', cls: 'web web2', l: 61.41, t: 17.578, w: 4.542, h: 29.297 },
  { src: 'sigAm', cls: 'pop pop1', l: 72.311, t: 79.427, w: 6.904, h: 10.417 },
  { src: 'sigFfe', cls: 'pop pop2', l: 53.779, t: 57.617, w: 5.814, h: 7.487 },
  { src: 'smile', cls: 'pop pop3', l: 89.753, t: 71.615, w: 3.997, h: 7.812 },
  { src: 'spider', cls: 'spider', l: 81.032, t: 62.5, w: 7.994, h: 17.578 },
  { src: 'fig_white', cls: 'white', l: 26.853, t: 32.031, w: 46.693, h: 67.122 },
  { src: 'hatch_hair', cls: 'hatch hh', l: 26.853, t: 32.031, w: 46.693, h: 67.122 },
  { src: 'hatch_shirt', cls: 'hatch hs', l: 26.853, t: 32.031, w: 46.693, h: 67.122 },
  { src: 'hatch_pants', cls: 'hatch hp', l: 26.853, t: 32.031, w: 46.693, h: 67.122 },
  { src: 'fig_hair', cls: 'fill hair', l: 26.853, t: 32.031, w: 46.693, h: 67.122 },
  { src: 'fig_shirt', cls: 'fill shirt', l: 26.853, t: 32.031, w: 46.693, h: 67.122 },
  { src: 'fig_skin', cls: 'fill skin', l: 26.853, t: 32.031, w: 46.693, h: 67.122 },
  { src: 'fig_pants', cls: 'fill pants', l: 26.853, t: 32.031, w: 46.693, h: 67.122 },
  { src: 'fig_shoes', cls: 'fill shoes', l: 26.853, t: 32.031, w: 46.693, h: 67.122 },
  { src: 'fig_line', cls: 'line', l: 26.853, t: 32.031, w: 46.693, h: 67.122 },
] as const;


/** Red thread bundle that shoots from the hand across the letters (SVG units = illustration px, 2752 x 1536). */
const THREADS = [
  'M1798 712 L1814 702 L1830 691 L1846 681 L1862 671 L1878 660 L1894 650 L1901 645 L1909 640 L1916 636 L1924 631 L1931 626 L1939 621 L1946 617 L1954 612 L1961 607 L1969 603 L1976 598 L1984 594 L1991 589 L1999 584 L2006 580 L2014 575 L2021 571 L2029 566 L2036 562 L2044 557 L2051 552 L2059 548 L2066 543 L2074 539 L2081 534 L2089 529 L2096 525 L2104 520 L2111 515 L2118 511 L2126 506 L2133 501 L2141 497 L2148 492 L2155 487 L2163 483 L2170 478 L2177 473 L2185 469 L2192 464 L2200 460 L2207 455 L2214 451 L2222 447 L2229 442 L2236 438 L2244 434 L2251 430 L2259 426 L2266 422 L2274 418 L2281 414 L2288 410 L2296 406 L2303 402 L2311 399 L2318 395 L2326 392 L2333 388 L2341 385 L2348 382 L2356 379 L2363 376 L2371 373 L2379 370 L2386 367 L2394 364 L2401 361 L2409 358 L2416 356 L2424 353 L2432 350 L2439 348 L2447 345 L2454 342 L2462 340 L2469 337 L2477 335 L2485 333 L2492 330 L2500 328 L2507 325 L2515 323 L2522 320 L2530 318 L2537 315 L2545 313 L2552 310 L2560 307 L2567 305 L2575 302 L2582 299 L2590 297 L2597 294 L2605 291 L2612 289 L2619 286 L2627 283 L2634 280 L2641 277 L2649 274 L2656 271 L2663 268 L2671 265 L2678 262 L2685 259 L2693 256 L2700 254 L2707 251 L2715 248 L2722 245 L2729 242 L2737 239 L2744 236',
  'M1798 712 L1814 702 L1830 691 L1846 681 L1862 671 L1878 660 L1894 650 L1902 646 L1909 641 L1917 637 L1924 632 L1932 628 L1939 624 L1947 619 L1954 615 L1961 610 L1969 606 L1976 601 L1984 597 L1991 592 L1999 588 L2006 583 L2014 578 L2021 574 L2028 569 L2036 564 L2043 559 L2050 555 L2058 550 L2065 545 L2073 540 L2080 536 L2087 531 L2095 526 L2102 522 L2109 517 L2117 513 L2124 508 L2132 504 L2139 500 L2147 496 L2154 492 L2161 488 L2169 484 L2177 480 L2184 476 L2192 473 L2199 469 L2207 466 L2214 462 L2222 459 L2230 456 L2237 453 L2245 450 L2252 446 L2260 443 L2268 440 L2275 437 L2283 434 L2290 431 L2298 428 L2306 425 L2313 422 L2321 419 L2328 416 L2336 413 L2343 410 L2351 407 L2358 404 L2366 400 L2373 397 L2381 394 L2388 391 L2396 387 L2403 384 L2410 380 L2418 377 L2425 373 L2432 370 L2440 366 L2447 362 L2454 359 L2462 355 L2469 352 L2476 348 L2483 344 L2491 341 L2498 337 L2505 334 L2513 330 L2520 327 L2527 324 L2535 320 L2542 317 L2549 314 L2557 311 L2564 308 L2571 306 L2579 303 L2586 300 L2594 298 L2601 295 L2609 293 L2616 291 L2624 289 L2631 287 L2639 285 L2647 283 L2654 282 L2662 280 L2670 278 L2677 277 L2685 275 L2693 274 L2700 272 L2708 271 L2716 270 L2723 268 L2731 267 L2739 265 L2746 264',
  'M1798 712 L1814 702 L1830 691 L1846 681 L1862 671 L1878 660 L1894 650 L1901 646 L1909 642 L1916 637 L1924 633 L1931 629 L1939 625 L1946 621 L1954 616 L1961 612 L1969 608 L1976 603 L1983 599 L1991 595 L1998 590 L2006 586 L2013 581 L2021 577 L2028 573 L2035 568 L2043 564 L2050 560 L2058 555 L2065 551 L2072 547 L2080 542 L2087 538 L2095 534 L2102 530 L2109 526 L2117 522 L2124 518 L2132 514 L2139 510 L2147 507 L2154 503 L2162 499 L2169 496 L2177 492 L2184 489 L2192 485 L2199 482 L2207 479 L2215 475 L2222 472 L2230 469 L2237 466 L2245 463 L2252 460 L2260 457 L2268 454 L2275 451 L2283 448 L2290 445 L2298 442 L2305 439 L2313 436 L2321 433 L2328 430 L2336 427 L2343 424 L2351 422 L2358 419 L2366 416 L2373 413 L2381 410 L2388 407 L2396 404 L2403 401 L2411 398 L2418 395 L2425 392 L2433 389 L2440 386 L2448 383 L2455 380 L2462 376 L2470 373 L2477 370 L2485 367 L2492 364 L2499 361 L2507 358 L2514 355 L2521 351 L2529 348 L2536 345 L2543 342 L2550 339 L2558 336 L2565 333 L2572 330 L2580 327 L2587 324 L2594 321 L2602 318 L2609 316 L2617 313 L2624 310 L2631 307 L2639 305 L2646 302 L2654 300 L2661 297 L2668 295 L2676 293 L2683 291 L2691 288 L2698 286 L2706 284 L2713 282 L2721 280 L2729 278 L2736 276 L2744 275',
  'M1798 712 L1814 702 L1830 691 L1846 681 L1862 671 L1878 660 L1894 650 L1901 645 L1909 640 L1917 635 L1924 630 L1932 624 L1939 619 L1947 614 L1954 609 L1962 604 L1969 599 L1977 594 L1984 589 L1992 584 L1999 578 L2006 573 L2014 568 L2021 563 L2029 557 L2036 552 L2043 546 L2051 541 L2058 535 L2065 530 L2073 524 L2080 519 L2087 513 L2095 508 L2102 502 L2109 497 L2117 492 L2124 486 L2132 481 L2139 476 L2146 471 L2154 466 L2161 462 L2169 457 L2176 453 L2184 448 L2191 444 L2199 440 L2207 436 L2214 432 L2222 428 L2229 425 L2237 421 L2245 417 L2252 414 L2260 411 L2268 407 L2275 404 L2283 400 L2291 397 L2298 394 L2306 390 L2313 387 L2321 383 L2329 380 L2336 377 L2344 373 L2351 369 L2359 366 L2366 362 L2374 358 L2381 354 L2388 351 L2396 347 L2403 343 L2410 339 L2418 334 L2425 330 L2432 326 L2439 322 L2447 318 L2454 314 L2461 309 L2468 305 L2476 301 L2483 297 L2490 293 L2497 289 L2505 286 L2512 282 L2519 278 L2527 275 L2534 271 L2541 268 L2549 265 L2556 262 L2564 259 L2571 257 L2579 254 L2586 252 L2594 249 L2601 247 L2609 245 L2617 243 L2624 242 L2632 240 L2640 238 L2648 237 L2655 235 L2663 234 L2671 232 L2678 231 L2686 229 L2694 228 L2702 226 L2709 224 L2717 223 L2725 221 L2732 219 L2740 217 L2747 215',
  'M1798 712 L1814 702 L1830 691 L1846 681 L1862 671 L1878 660 L1894 650 L1901 646 L1909 641 L1916 636 L1924 632 L1931 627 L1939 623 L1946 618 L1953 614 L1961 609 L1968 605 L1976 600 L1983 596 L1990 591 L1998 587 L2005 583 L2013 578 L2020 574 L2028 570 L2035 566 L2043 562 L2050 558 L2058 554 L2065 550 L2073 546 L2081 543 L2088 539 L2096 535 L2103 532 L2111 528 L2118 525 L2126 521 L2134 518 L2141 514 L2149 511 L2156 507 L2164 504 L2172 500 L2179 497 L2187 493 L2194 489 L2202 486 L2209 482 L2217 478 L2224 475 L2231 471 L2239 467 L2246 463 L2254 460 L2261 456 L2268 452 L2276 448 L2283 444 L2291 440 L2298 436 L2305 432 L2313 428 L2320 424 L2327 420 L2334 416 L2342 412 L2349 409 L2356 405 L2364 401 L2371 397 L2378 393 L2386 390 L2393 386 L2400 383 L2408 379 L2415 376 L2422 372 L2430 369 L2437 366 L2444 363 L2452 360 L2459 357 L2467 354 L2474 352 L2482 349 L2489 347 L2497 344 L2504 342 L2512 340 L2520 337 L2527 335 L2535 333 L2542 332 L2550 330 L2558 328 L2565 326 L2573 325 L2581 323 L2588 321 L2596 320 L2604 318 L2611 317 L2619 315 L2627 313 L2634 312 L2642 310 L2650 308 L2657 307 L2665 305 L2672 303 L2680 301 L2688 299 L2695 297 L2703 295 L2710 293 L2718 291 L2725 289 L2732 286 L2740 284 L2747 281',
  'M1798 712 L1814 702 L1830 691 L1846 681 L1862 671 L1878 660 L1894 650 L1901 646 L1909 642 L1916 638 L1924 634 L1931 630 L1939 626 L1946 622 L1954 618 L1961 614 L1969 611 L1976 607 L1984 603 L1991 600 L1999 596 L2006 592 L2014 589 L2021 585 L2029 582 L2036 578 L2044 575 L2051 571 L2059 567 L2067 564 L2074 560 L2082 557 L2089 553 L2096 549 L2104 545 L2111 542 L2119 538 L2126 534 L2134 530 L2141 526 L2148 522 L2156 518 L2163 514 L2170 510 L2178 506 L2185 502 L2192 498 L2200 494 L2207 490 L2214 486 L2222 482 L2229 478 L2236 474 L2244 471 L2251 467 L2259 463 L2266 460 L2273 457 L2281 453 L2288 450 L2296 447 L2303 444 L2311 441 L2318 438 L2326 435 L2333 433 L2341 430 L2348 427 L2356 425 L2364 423 L2371 420 L2379 418 L2387 416 L2394 414 L2402 411 L2409 409 L2417 407 L2425 405 L2432 403 L2440 401 L2448 399 L2455 397 L2463 394 L2470 392 L2478 390 L2485 388 L2493 385 L2500 383 L2508 380 L2515 378 L2523 375 L2530 372 L2537 369 L2545 367 L2552 364 L2559 361 L2567 358 L2574 355 L2581 352 L2589 349 L2596 346 L2603 343 L2610 339 L2618 336 L2625 333 L2632 330 L2640 327 L2647 324 L2654 321 L2661 319 L2669 316 L2676 313 L2684 310 L2691 308 L2698 306 L2706 303 L2713 301 L2721 299 L2728 297 L2736 295 L2743 293',
  'M1798 712 L1814 702 L1830 691 L1846 681 L1862 671 L1878 660 L1894 650 L1901 645 L1909 640 L1916 634 L1924 629 L1931 624 L1939 619 L1946 614 L1953 609 L1961 603 L1968 598 L1976 593 L1983 588 L1991 583 L1998 579 L2006 574 L2013 569 L2021 564 L2028 559 L2036 555 L2043 550 L2051 545 L2058 541 L2066 536 L2074 532 L2081 527 L2089 523 L2096 519 L2104 514 L2111 510 L2119 505 L2126 501 L2134 497 L2141 492 L2149 488 L2156 483 L2164 479 L2171 474 L2179 470 L2186 465 L2194 461 L2201 456 L2208 452 L2216 447 L2223 443 L2231 438 L2238 433 L2245 429 L2253 424 L2260 420 L2267 415 L2275 411 L2282 407 L2289 402 L2297 398 L2304 394 L2311 389 L2319 385 L2326 381 L2334 377 L2341 373 L2348 369 L2356 365 L2363 361 L2371 358 L2378 354 L2385 350 L2393 347 L2400 344 L2408 340 L2415 337 L2423 334 L2430 331 L2438 328 L2445 325 L2453 323 L2461 320 L2468 317 L2476 315 L2483 312 L2491 310 L2498 307 L2506 305 L2514 303 L2521 300 L2529 298 L2537 296 L2544 294 L2552 291 L2559 289 L2567 287 L2574 285 L2582 282 L2590 280 L2597 278 L2605 275 L2612 273 L2620 270 L2627 268 L2635 265 L2642 263 L2650 260 L2657 258 L2664 255 L2672 252 L2679 249 L2686 246 L2694 243 L2701 240 L2708 237 L2716 234 L2723 231 L2730 228 L2738 225 L2745 222',
  'M1798 712 L1814 702 L1830 691 L1846 681 L1862 671 L1878 660 L1894 650 L1902 645 L1909 641 L1916 636 L1924 632 L1931 627 L1939 623 L1946 618 L1954 613 L1961 608 L1969 603 L1976 598 L1983 594 L1991 589 L1998 584 L2005 579 L2013 574 L2020 569 L2028 564 L2035 559 L2042 554 L2050 549 L2057 544 L2065 540 L2072 535 L2079 531 L2087 526 L2094 522 L2102 518 L2110 514 L2117 510 L2125 507 L2132 503 L2140 499 L2148 496 L2155 492 L2163 489 L2171 486 L2178 482 L2186 479 L2193 476 L2201 472 L2209 469 L2216 466 L2224 462 L2232 459 L2239 455 L2247 452 L2254 448 L2262 444 L2269 440 L2276 437 L2284 433 L2291 429 L2299 424 L2306 420 L2313 416 L2320 412 L2328 407 L2335 403 L2342 399 L2349 394 L2357 390 L2364 386 L2371 382 L2378 377 L2386 373 L2393 369 L2400 365 L2407 361 L2415 358 L2422 354 L2429 351 L2437 347 L2444 344 L2452 341 L2459 338 L2467 336 L2474 333 L2482 331 L2489 329 L2497 326 L2505 325 L2512 323 L2520 321 L2528 319 L2536 318 L2543 316 L2551 315 L2559 313 L2567 312 L2574 310 L2582 309 L2590 307 L2598 305 L2605 304 L2613 302 L2620 300 L2628 298 L2636 296 L2643 294 L2651 291 L2658 288 L2665 286 L2673 283 L2680 280 L2687 277 L2695 274 L2702 270 L2709 267 L2716 263 L2723 260 L2730 256 L2738 252 L2745 249',
  'M1798 712 L1814 702 L1830 691 L1846 681 L1862 671 L1878 660 L1894 650 L1901 646 L1909 642 L1916 638 L1924 634 L1931 630 L1939 626 L1946 622 L1954 618 L1961 614 L1969 610 L1976 606 L1984 603 L1991 599 L1999 595 L2006 591 L2014 587 L2021 583 L2029 579 L2036 575 L2044 571 L2051 568 L2059 564 L2066 560 L2074 556 L2081 552 L2089 548 L2096 544 L2103 539 L2111 535 L2118 531 L2126 527 L2133 523 L2140 519 L2148 515 L2155 511 L2162 507 L2170 503 L2177 499 L2185 495 L2192 491 L2199 487 L2207 483 L2214 479 L2222 476 L2229 472 L2236 468 L2244 465 L2251 461 L2259 458 L2266 454 L2274 451 L2281 447 L2288 444 L2296 441 L2303 438 L2311 435 L2318 432 L2326 429 L2333 426 L2341 423 L2349 420 L2356 418 L2364 415 L2371 412 L2379 410 L2386 407 L2394 405 L2401 402 L2409 400 L2417 398 L2424 395 L2432 393 L2439 391 L2447 388 L2455 386 L2462 384 L2470 382 L2477 379 L2485 377 L2492 375 L2500 372 L2507 370 L2515 368 L2522 365 L2530 363 L2537 361 L2545 358 L2552 356 L2560 353 L2567 351 L2575 348 L2582 346 L2590 343 L2597 340 L2604 338 L2612 335 L2619 332 L2626 330 L2634 327 L2641 324 L2648 321 L2656 318 L2663 316 L2670 313 L2678 310 L2685 307 L2692 304 L2700 301 L2707 299 L2714 296 L2722 293 L2729 290 L2736 288 L2744 285',
  'M2300 440 L2301 439 L2305 438 L2310 435 L2317 431 L2325 427 L2334 422 L2343 418 L2352 413 L2361 408 L2369 404 L2376 400 L2381 397 L2385 396 L2386 395 L2387 395 L2388 395 L2391 395 L2394 395 L2398 394 L2404 394 L2409 394 L2416 394 L2423 393 L2430 393 L2437 392 L2445 391 L2452 391 L2459 390 L2466 389 L2472 388 L2477 387 L2482 386 L2486 384 L2489 383 L2491 382 L2492 381 L2492 379 L2491 378 L2489 377 L2486 376 L2482 374 L2477 373 L2472 372 L2466 371 L2459 370 L2452 369 L2445 369 L2437 368 L2430 367 L2423 367 L2416 366 L2409 366 L2404 366 L2398 366 L2394 365 L2391 365 L2388 365 L2387 365 L2386 365 L2387 365 L2388 365 L2391 365 L2394 365 L2398 364 L2404 364 L2409 364 L2416 364 L2423 363 L2430 363 L2437 362 L2445 361 L2452 361 L2459 360 L2466 359 L2472 358 L2477 357 L2482 356 L2486 354 L2489 353 L2491 352 L2492 351 L2492 349 L2491 348 L2489 347 L2486 346 L2482 344 L2477 343 L2472 342 L2466 341 L2459 340 L2452 339 L2445 339 L2437 338 L2430 337 L2423 337 L2416 336 L2409 336 L2404 336 L2398 336 L2394 335 L2391 335 L2388 335 L2387 335 L2386 335 L2395 334 L2404 334 L2413 333 L2422 333 L2431 332 L2440 331 L2449 330 L2458 329 L2467 327 L2476 326 L2485 324 L2494 323 L2503 321 L2512 319 L2521 317 L2530 315 L2539 312 L2548 310 L2557 307 L2566 305 L2574 303 L2583 300 L2592 298 L2601 295 L2610 293 L2619 291 L2628 289 L2637 287 L2646 286 L2655 284 L2664 283 L2673 281 L2682 280 L2691 279 L2700 278 L2709 277 L2718 277 L2727 276 L2736 276 L2745 275',
  'M2300 420 L2301 419 L2305 418 L2310 415 L2316 412 L2324 408 L2332 404 L2341 400 L2350 396 L2358 392 L2366 388 L2372 385 L2377 382 L2381 381 L2382 380 L2410 386 L2417 385 L2425 385 L2433 385 L2441 384 L2448 384 L2456 383 L2464 382 L2471 381 L2477 380 L2482 378 L2487 377 L2491 375 L2494 374 L2495 372 L2496 371 L2496 369 L2494 368 L2491 366 L2488 365 L2483 363 L2477 362 L2471 361 L2464 360 L2457 359 L2449 358 L2441 357 L2433 357 L2426 356 L2418 356 L2411 356 L2404 356 L2398 356 L2393 356 L2389 356 L2386 357 L2383 357 L2382 357 L2382 358 L2383 358 L2385 359 L2388 359 L2393 359 L2398 360 L2404 360 L2410 360 L2417 359 L2425 359 L2433 359 L2441 358 L2448 358 L2456 357 L2464 356 L2471 355 L2477 354 L2482 352 L2487 351 L2491 349 L2494 348 L2495 346 L2496 345 L2496 343 L2494 342 L2491 340 L2488 339 L2483 337 L2477 336 L2471 335 L2464 334 L2457 333 L2449 332 L2441 331 L2433 331 L2426 330 L2418 330 L2411 330 L2404 330 L2398 330 L2393 330 L2389 330 L2386 331 L2383 331 L2382 331 L2382 332 L2383 332 L2385 333 L2388 333 L2393 333 L2398 334 L2404 334 L2412 337 L2421 335 L2429 334 L2438 332 L2446 330 L2455 328 L2463 325 L2472 323 L2480 320 L2489 318 L2497 315 L2506 312 L2515 309 L2523 306 L2532 303 L2540 301 L2549 298 L2557 295 L2566 292 L2574 290 L2583 287 L2591 285 L2600 283 L2608 280 L2617 279 L2625 277 L2634 275 L2643 274 L2651 272 L2660 271 L2668 270 L2677 269 L2685 268 L2694 267 L2702 266 L2711 264 L2719 263 L2728 262 L2736 261 L2745 260',
  'M2300 455 L2301 454 L2305 453 L2310 450 L2317 446 L2326 442 L2335 437 L2344 432 L2353 428 L2362 423 L2371 419 L2378 415 L2383 412 L2387 411 L2388 410 L2457 412 L2462 411 L2468 410 L2473 409 L2477 408 L2481 407 L2484 406 L2487 405 L2489 404 L2490 403 L2490 402 L2490 401 L2488 400 L2487 399 L2484 398 L2481 397 L2477 396 L2472 395 L2467 394 L2462 393 L2456 392 L2450 391 L2444 390 L2438 390 L2432 389 L2426 388 L2420 388 L2414 387 L2409 386 L2404 386 L2400 385 L2396 385 L2393 385 L2391 384 L2389 384 L2388 383 L2388 383 L2389 383 L2390 382 L2392 382 L2395 381 L2398 381 L2402 380 L2407 380 L2412 379 L2418 379 L2423 378 L2429 378 L2436 377 L2442 376 L2448 375 L2454 375 L2460 374 L2465 373 L2470 372 L2475 371 L2479 370 L2483 369 L2486 368 L2488 367 L2489 366 L2490 365 L2490 364 L2489 363 L2487 361 L2485 360 L2482 359 L2479 358 L2474 357 L2470 356 L2464 355 L2459 355 L2453 354 L2447 353 L2441 352 L2434 351 L2428 351 L2422 350 L2417 349 L2411 349 L2406 348 L2402 348 L2398 347 L2394 347 L2392 347 L2390 346 L2388 346 L2388 345 L2388 345 L2389 345 L2398 349 L2407 348 L2416 346 L2425 344 L2434 342 L2443 340 L2452 338 L2460 336 L2469 334 L2478 332 L2487 330 L2496 328 L2505 326 L2514 324 L2523 323 L2532 321 L2540 320 L2549 319 L2558 317 L2567 316 L2576 316 L2585 315 L2594 314 L2603 314 L2612 314 L2621 313 L2629 313 L2638 313 L2647 313 L2656 313 L2665 312 L2674 312 L2683 312 L2692 311 L2701 311 L2709 310 L2718 309 L2727 308 L2736 307 L2745 306',
  'M2200 296 C2230 275 2260 270 2300 276',
  'M2190 312 C2230 290 2270 286 2310 292',
];

/** Inline style helper that allows CSS custom properties. */
const css = (v: Record<string, string | number>) => v as unknown as React.CSSProperties;

const place = (s: Pick<Skill, 'l' | 't' | 'w' | 'h' | 'rot'>) =>
  css({ '--l': `${s.l}%`, '--t': `${s.t}%`, '--w': `${s.w}%`, '--h': `${s.h}%`, '--rot': `${s.rot}deg` });

const go = (href: string) => document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });

export const HeroSection: React.FC = () => {
  const [open, setOpen] = useState<Skill | null>(null);
  const [aboutOpen, setAboutOpen] = useState(false);
  /** bumping this remounts the layers, which restarts the CSS animation */
  const [run, setRun] = useState(0);

  const overlay = open !== null || aboutOpen;
  useEffect(() => {
    if (!overlay) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(null);
        setAboutOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [overlay]);

  return (
    <section id="citadel-base" className="hero relative w-full p-0">
      <div className="hc" role="group" aria-label={`${CHIEF_INFO.name} interactive portfolio hero`}>
        {/* The illustration, built from layers so it can be "drawn in" like the intro video */}
        <div
          className="hc__layers"
          key={run}
          role="img"
          aria-label="Illustration of Milan Kumar Modak in a dynamic pose in front of the giant word PORTFOLIO, surrounded by paper notes labelled Video Editing, AI Content Creation, Graphic Design, Design and Brand Creative"
        >
          {LAYERS.map((L) => (
            <img
              key={L.src}
              className={`hc__l ${L.cls.split(' ').map((c) => `hc__l--${c}`).join(' ')}`}
              src={`/images/hero/anim/${L.src}.webp`}
              alt=""
              aria-hidden="true"
              draggable={false}
              decoding="async"
              style={{ left: `${L.l}%`, top: `${L.t}%`, width: `${L.w}%`, height: `${L.h}%` }}
              {...(L.src === 'base' ? { fetchPriority: 'high' as const } : {})}
            />
          ))}
          <svg className="hc__threads" viewBox="0 0 2752 1536" preserveAspectRatio="none" aria-hidden="true">
            {THREADS.map((d, i) => (
              <path key={i} d={d} pathLength={1} style={{ '--d': `${6 + i * 0.18}s` } as React.CSSProperties} />
            ))}
          </svg>
        </div>

        <button type="button" className="hc__replay" onClick={() => setRun((n) => n + 1)} aria-label="Replay intro animation">
          ↻ Replay
        </button>

        {/* Smiley note easter egg */}
        <div className="hc__egg" style={place({ l: 18.8, t: 3.5, w: 9.6, h: 18.5, rot: 0 })} aria-hidden="true">
          <span className="hc__tip">Hi, I’m {CHIEF_INFO.name.split(' ')[0]} 👋</span>
        </div>

        {/* Character -> About */}
        <button
          type="button"
          className="hc__char"
          onClick={() => setAboutOpen(true)}
          aria-label="About me"
        >
          <span className="hc__tip">About me</span>
        </button>

        {/* Skill cards */}
        {SKILLS.map((s, i) => (
          <button
            key={s.id}
            type="button"
            className={`hc__spot${s.pill ? ' hc__spot--pill' : ''}`}
            style={{ ...place(s), '--i': i } as React.CSSProperties}
            onClick={() => setOpen(s)}
            aria-label={`View ${s.label} work`}
          >
            <span className={`hc__lab${s.pill ? ' hc__lab--pill' : ''}`} style={css({ '--n': Math.max(...s.label.split(' ').map((w) => w.length)) })}>
              {s.label}
            </span>
            <span className="hc__tip">Click to explore {s.label.toLowerCase()}</span>
          </button>
        ))}
      </div>

      {/* Tappable chips for phones (the cards on the art are small there) */}
      <div className="hc-chips" aria-label="Skill categories">
        {SKILLS.map((s) => (
          <button key={s.id} type="button" className="hc-chip" onClick={() => setOpen(s)}>
            {s.label}
          </button>
        ))}
      </div>

      {/* Intro strip: name, bio, CTAs (existing anchors preserved) */}
      <div className="hc-strip">
        <div className="hc-strip__text">
          <p className="hc-strip__name">{CHIEF_INFO.name}</p>
          <p className="hc-strip__bio">{CHIEF_INFO.bio}</p>
        </div>
        <div className="hc-strip__cta">
          <a href="#war-log" className="hc-btn hc-btn--red">
            <span className="material-symbols-outlined text-[18px]">explore</span> View Projects
          </a>
          <a href="#clan-recruitment" className="hc-btn hc-btn--ghost">
            <span className="material-symbols-outlined text-[18px]">description</span> Resume &amp; Contact
          </a>
        </div>
      </div>

      {/* Skill modal */}
      {open && (
        <div className="hc-modal" role="presentation" onClick={() => setOpen(null)}>
          <div className="hc-modal__card" role="dialog" aria-modal="true" aria-label={open.label} onClick={(e) => e.stopPropagation()}>
            <div className="hc-modal__top">
              <span className="hc-modal__badge">Skill Category</span>
              <button type="button" className="hc-modal__x" onClick={() => setOpen(null)} aria-label="Close" autoFocus>✕</button>
            </div>
            <h2 className="hc-modal__title">{open.label}</h2>
            <p className="hc-modal__desc">{open.description}</p>

            {open.work.length > 0 ? (
              <div className="hc-modal__list">
                {open.work.map((w) => (
                  <a
                    key={w.title}
                    className="hc-work"
                    href={w.href ?? '#'}
                    onClick={(e) => {
                      if (w.href?.startsWith('#')) {
                        e.preventDefault();
                        setOpen(null);
                        go(w.href);
                      }
                    }}
                    {...(w.href && !w.href.startsWith('#') ? { target: '_blank', rel: 'noreferrer' } : {})}
                  >
                    <div>
                      <div className="hc-work__title">{w.title}</div>
                      <div className="hc-work__tag">{w.tag}</div>
                    </div>
                    <span className="hc-work__go">→</span>
                  </a>
                ))}
              </div>
            ) : (
              <div className="hc-empty">
                <p>Samples for this category are shared on request.</p>
                <a
                  href="#clan-recruitment"
                  className="hc-btn hc-btn--red"
                  onClick={(e) => {
                    e.preventDefault();
                    setOpen(null);
                    go('#clan-recruitment');
                  }}
                >
                  Get in touch
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* About drawer */}
      {aboutOpen && (
        <div className="hc-modal hc-modal--drawer" role="presentation" onClick={() => setAboutOpen(false)}>
          <aside className="hc-drawer" role="dialog" aria-modal="true" aria-label="About me" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="hc-modal__x hc-drawer__x" onClick={() => setAboutOpen(false)} aria-label="Close" autoFocus>✕</button>
            <span className="hc-modal__badge">About me</span>
            <h2 className="hc-modal__title">{CHIEF_INFO.name}</h2>
            <p className="hc-modal__desc">{CHIEF_INFO.bio}</p>
            <div className="hc-drawer__cta">
              <a href="#war-log" className="hc-btn hc-btn--red" onClick={() => setAboutOpen(false)}>View Projects</a>
              <a href="#clan-recruitment" className="hc-btn hc-btn--dark" onClick={() => setAboutOpen(false)}>Contact</a>
            </div>
          </aside>
        </div>
      )}
    </section>
  );
};
