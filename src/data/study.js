// OLL and PLL case data for the Lab study mode.
// Cases, names and algorithms come from @moishy/algsets (MIT License, Copyright (c) moishy-r),
// which sources its algorithms from SpeedCubeDB. The first alg of each case is the main one.

export const OLL_CASES = [
  {
    id: "oll-1",
    name: "OLL 1",
    subset: "dot",
    algs: [
      "R U2 R' R' F R F' U2 R' F R F'",
      "R U2 R2 F R F' U2 R' F R F'",
      "U R U' R2 D' r U' r' D R2 U R'",
    ],
  },
  {
    id: "oll-2",
    name: "OLL 2",
    subset: "dot",
    algs: [
      "f U R U' R' f' F U R U' R' F'",
      "F R U R' U' F' f R U R' U' f'",
      "U' R U' R2 D' r U r' D R2 U R'",
    ],
  },
  {
    id: "oll-3",
    name: "OLL 3",
    subset: "dot",
    algs: [
      "U' f R U R' U' f' U' F R U R' U' F'",
      "U R' F2 R2 U2 R' F R U2 R2 F2 R",
      "r' R2 U R' U r U2 r' U M'",
    ],
  },
  {
    id: "oll-4",
    name: "OLL 4",
    subset: "dot",
    algs: [
      "U' f R U R' U' f' U F R U R' U' F'",
      "U' R' F2 R2 U2 R' F' R U2 R2 F2 R",
      "R' F R F' U' S R' U' R U R S'",
    ],
  },
  {
    id: "oll-5",
    name: "OLL 5",
    subset: "square",
    algs: [
      "r' U2 R U R' U r",
      "U2 l' U2 L U L' U l",
      "U2 R' F2 r U r' F R",
    ],
  },
  {
    id: "oll-6",
    name: "OLL 6",
    subset: "square",
    algs: [
      "r U2 R' U' R U' r'",
      "F U' R2 D R' U' R D' R2 U F'",
      "U2 l U2 L' U' L U' l'",
    ],
  },
  {
    id: "oll-7",
    name: "OLL 7",
    subset: "lightning-bolt",
    algs: [
      "r U R' U R U2 r'",
      "S' R U R' U R U2 R' U S",
      "L' U2 L U2 L F' L' F",
    ],
  },
  {
    id: "oll-8",
    name: "OLL 8",
    subset: "lightning-bolt",
    algs: [
      "U2 r' U' R U' R' U2 r",
      "l' U' L U' L' U2 l",
      "R U2 R' U2 R' F R F'",
    ],
  },
  {
    id: "oll-9",
    name: "OLL 9",
    subset: "fish-shape",
    algs: [
      "U R U R' U' R' F R R U R' U' F'",
      "U R U R' U' R' F R2 U R' U' F'",
      "R U2 R' U' S' R U' R' S",
    ],
  },
  {
    id: "oll-10",
    name: "OLL 10",
    subset: "fish-shape",
    algs: [
      "R U R' U R' F R F' R U2 R'",
      "U F U F' R' F R U' R' F' R",
      "U M' R' U2 R U R' U R U M",
    ],
  },
  {
    id: "oll-11",
    name: "OLL 11",
    subset: "lightning-bolt",
    algs: [
      "M R U R' U R U2 R' U M'",
      "r' R2 U R' U R U2 R' U M'",
      "U2 r U R' U R' F R F' R U2 r'",
    ],
  },
  {
    id: "oll-12",
    name: "OLL 12",
    subset: "lightning-bolt",
    algs: [
      "U' M' R' U' R U' R' U2 R U' M",
      "F R U R' U' F' U F R U R' U' F'",
      "U' S R' U' R U' R' U2 R U2 S'",
    ],
  },
  {
    id: "oll-13",
    name: "OLL 13",
    subset: "knight-shape",
    algs: [
      "r U' r' U' r U r' F' U F",
      "F U R U2 R' U' R U R' F'",
      "F U R U' R2 F' R U R U' R'",
    ],
  },
  {
    id: "oll-14",
    name: "OLL 14",
    subset: "knight-shape",
    algs: [
      "R' F R U R' F' R F U' F'",
      "r U R' U' r' F R2 U R' U' F'",
      "l' U l U l' U' l F U' F'",
    ],
  },
  {
    id: "oll-15",
    name: "OLL 15",
    subset: "knight-shape",
    algs: [
      "r' U' r R' U' R U r' U r",
      "U2 l' U' l L' U' L U l' U l",
      "r' U' M' U' R U r' U r",
    ],
  },
  {
    id: "oll-16",
    name: "OLL 16",
    subset: "knight-shape",
    algs: [
      "r U r' R U R' U' r U' r'",
      "r U M U R' U' r U' r'",
      "U2 R' F R U R' U' F' R U' R' U2 R",
    ],
  },
  {
    id: "oll-17",
    name: "OLL 17",
    subset: "dot",
    algs: [
      "R U R' U R' F R F' U2 R' F R F'",
      "U2 F R' F' R U S' R U' R' S",
      "U2 F R' F' R2 r' U R U' R' U' M'",
    ],
  },
  {
    id: "oll-18",
    name: "OLL 18",
    subset: "dot",
    algs: [
      "U R U2 R' R' F R F' U2 M' U R U' r'",
      "U R U2 R2 F R F' U2 M' U R U' r'",
      "r U R' U R U2 r2 U' R U' R' U2 r",
    ],
  },
  {
    id: "oll-19",
    name: "OLL 19",
    subset: "dot",
    algs: [
      "M U R U R' U' M' R' F R F'",
      "U S' R U R' S U' R' F R F'",
      "R' U2 F R U R' U' F2 U2 F R",
    ],
  },
  {
    id: "oll-20",
    name: "OLL 20",
    subset: "dot",
    algs: [
      "r U R' U' M2 U R U' R' U' M'",
      "r U R' U' M2 U R U' R' U' M'",
      "M' U2 M U2 M' U M U2 M' U2 M",
    ],
  },
  {
    id: "oll-21",
    name: "OLL 21",
    subset: "cross",
    algs: [
      "R U R' U R U' R' U R U2 R'",
      "R U R' U R U' R' U R U2 R'",
      "U R U2 R' U' R U R' U' R U' R'",
    ],
  },
  {
    id: "oll-22",
    name: "OLL 22",
    subset: "cross",
    algs: [
      "R' U2 R2 U R2 U R2 U2 R'",
      "R U2 R2 U' R2 U' R2 U' U' R",
      "R U2 R2 U' R2 U' R2 U2 R",
    ],
  },
  {
    id: "oll-23",
    name: "OLL 23",
    subset: "cross",
    algs: [
      "R2 D R' U2 R D' R' U2 R'",
      "U2 R2 D' R U2 R' D R U2 R",
      "R U R' U R U2 R2 U' R U' R' U2 R",
    ],
  },
  {
    id: "oll-24",
    name: "OLL 24",
    subset: "cross",
    algs: [
      "r U R' U' r' F R F'",
      "U2 R' F' r U R U' r' F",
      "U' x' R U R' D R U' R' D' x",
    ],
  },
  {
    id: "oll-25",
    name: "OLL 25",
    subset: "cross",
    algs: [
      "U F' r U R' U' r' F R",
      "R U2 R D R' U2 R D' R2",
      "F R' F' r U R U' r'",
    ],
  },
  {
    id: "oll-26",
    name: "OLL 26",
    subset: "cross",
    algs: [
      "U R U2 R' U' R U' R'",
      "R' U' R U' R' U2 R",
      "U2 L' U' L U' L' U2 L",
    ],
  },
  {
    id: "oll-27",
    name: "OLL 27",
    subset: "cross",
    algs: [
      "R U R' U R U2 R'",
      "U' R' U2 R U R' U R",
      "U L' U2 L U L' U L",
    ],
  },
  {
    id: "oll-28",
    name: "OLL 28",
    subset: "corners-oriented",
    algs: [
      "r U R' U' M U R U' R'",
      "R' F R S R' F' R S'",
      "r U R' U' r' R U R U' R'",
    ],
  },
  {
    id: "oll-29",
    name: "OLL 29",
    subset: "awkward-shape",
    algs: [
      "U R U R' U' R U' R' F' U' F R U R'",
      "r2 D' r U r' D r2 U' r' U' r",
      "U S' R U R' U' R' F R F' U S",
    ],
  },
  {
    id: "oll-30",
    name: "OLL 30",
    subset: "awkward-shape",
    algs: [
      "U2 F U R U2 R' U' R U2 R' U' F'",
      "U' r' D' r U' r' D r2 U' r' U r U r'",
      "U2 F R' F R2 U' R' U' R U R' F2",
    ],
  },
  {
    id: "oll-31",
    name: "OLL 31",
    subset: "p-shape",
    algs: [
      "R' U' F U R U' R' F' R",
      "U2 S' L' U' L U L F' L' f",
      "U S R U R' U' f' U' F",
    ],
  },
  {
    id: "oll-32",
    name: "OLL 32",
    subset: "p-shape",
    algs: [
      "S R U R' U' R' F R f'",
      "U2 L U F' U' L' U L F L'",
      "R U B' U' R' U R B R'",
    ],
  },
  {
    id: "oll-33",
    name: "OLL 33",
    subset: "t-shape",
    algs: [
      "R U R' U' R' F R F'",
      "U2 L' U' L U L F' L' F",
      "U2 r' F' r U r U' r' F",
    ],
  },
  {
    id: "oll-34",
    name: "OLL 34",
    subset: "c-shape",
    algs: [
      "U2 R U R2 U' R' F R U R U' F'",
      "U f R f' U' r' U' R U M'",
      "F R U R' U' R' F' r U R U' r'",
    ],
  },
  {
    id: "oll-35",
    name: "OLL 35",
    subset: "fish-shape",
    algs: [
      "R U2 R' R' F R F' R U2 R'",
      "R U2 R2 F R F' R U2 R'",
      "f R U R' U' f' R U R' U R U2 R'",
    ],
  },
  {
    id: "oll-36",
    name: "OLL 36",
    subset: "w-shape",
    algs: [
      "U2 L' U' L U' L' U L U L F' L' F",
      "U R U R2 F' U' F U R2 U2 R'",
      "U2 R U R' F' R U R' U' R' F R U' R' F R F'",
    ],
  },
  {
    id: "oll-37",
    name: "OLL 37",
    subset: "fish-shape",
    algs: [
      "F R U' R' U' R U R' F'",
      "F R' F' R U R U' R'",
      "U F' r U r' U' r' F r",
    ],
  },
  {
    id: "oll-38",
    name: "OLL 38",
    subset: "w-shape",
    algs: [
      "R U R' U R U' R' U' R' F R F'",
      "U F R U' R' S U' R U R' f'",
      "r U R' U' r' F R U R U' R' F'",
    ],
  },
  {
    id: "oll-39",
    name: "OLL 39",
    subset: "lightning-bolt",
    algs: [
      "U L F' L' U' L U F U' L'",
      "U' f' r U r' U' r' F r S",
      "U' R U R' F' U' F U R U2 R'",
    ],
  },
  {
    id: "oll-40",
    name: "OLL 40",
    subset: "lightning-bolt",
    algs: [
      "U R' F R U R' U' F' U R",
      "U' f R' F' R U R U' R' S'",
      "R r D r' U r D' r' U' R'",
    ],
  },
  {
    id: "oll-41",
    name: "OLL 41",
    subset: "awkward-shape",
    algs: [
      "U2 R U R' U R U2 R' F R U R' U' F'",
      "U2 F U R2 D R' U' R D' R2 F'",
      "U' S U' R' F' U' F U R S'",
    ],
  },
  {
    id: "oll-42",
    name: "OLL 42",
    subset: "awkward-shape",
    algs: [
      "R' U' R U' R' U2 R F R U R' U' F'",
      "U F S' R U R' U' F' U S",
      "U R' F R F' R' F R F' R U R' U' R U R'",
    ],
  },
  {
    id: "oll-43",
    name: "OLL 43",
    subset: "p-shape",
    algs: [
      "U R' U' F' U F R",
      "U2 F' U' L' U L F",
      "f' L' U' L U f",
    ],
  },
  {
    id: "oll-44",
    name: "OLL 44",
    subset: "p-shape",
    algs: [
      "f R U R' U' f'",
      "U2 F U R U' R' F'",
      "U R U B U' B' R'",
    ],
  },
  {
    id: "oll-45",
    name: "OLL 45",
    subset: "t-shape",
    algs: [
      "F R U R' U' F'",
      "U R' F' U' F U R",
      "U2 f U R U' R' f'",
    ],
  },
  {
    id: "oll-46",
    name: "OLL 46",
    subset: "c-shape",
    algs: [
      "R' U' R' F R F' U R",
      "R' F' U' F R U' R' U2 R",
      "U F R U R' U' F' U' R U R' U R U2 R'",
    ],
  },
  {
    id: "oll-47",
    name: "OLL 47",
    subset: "l-shape",
    algs: [
      "F' L' U' L U L' U' L U F",
      "U' F R' F' R U2 R U' R' U R U2 R'",
      "R' U' R' F R F' R' F R F' U R",
    ],
  },
  {
    id: "oll-48",
    name: "OLL 48",
    subset: "l-shape",
    algs: [
      "F R U R' U' R U R' U' F'",
      "U2 f U R U' R' U R U' R' f'",
      "R U2 R' U' R U R' U2 R' F R F'",
    ],
  },
  {
    id: "oll-49",
    name: "OLL 49",
    subset: "l-shape",
    algs: [
      "U2 r U' r2 U r2 U r2 U' r",
      "l U' l2 U l2 U l2 U' l",
      "R B' R2 F R2 B R2 F' R",
    ],
  },
  {
    id: "oll-50",
    name: "OLL 50",
    subset: "l-shape",
    algs: [
      "r' U r2 U' r2 U' r2 U r'",
      "U2 R' F R2 B' R2 F' R2 B R'",
      "U' R U2 R' U' R U' R' F R U R' U' F'",
    ],
  },
  {
    id: "oll-51",
    name: "OLL 51",
    subset: "i-shape",
    algs: [
      "f R U R' U' R U R' U' f'",
      "U2 F U R U' R' U R U' R' F'",
      "U' R' U' R' F R F' R U' R' U2 R",
    ],
  },
  {
    id: "oll-52",
    name: "OLL 52",
    subset: "i-shape",
    algs: [
      "F R U R' d R' U' R U' R'",
      "U2 R' F' U' F U' R U R' U R",
      "R U R' U R U' B U' B' R'",
    ],
  },
  {
    id: "oll-53",
    name: "OLL 53",
    subset: "l-shape",
    algs: [
      "r' U2 R U R' U' R U R' U r",
      "r' U' R U' R' U R U' R' U2 r",
      "U2 l' U' L U' L' U L U' L' U2 l",
    ],
  },
  {
    id: "oll-54",
    name: "OLL 54",
    subset: "l-shape",
    algs: [
      "r U2 R' U' R U R' U' R U' r'",
      "r U R' U R U' R' U R U2 r'",
      "U' r U2 R' U' R U R' U' R U' r'",
    ],
  },
  {
    id: "oll-55",
    name: "OLL 55",
    subset: "i-shape",
    algs: [
      "R U2 R2 U' R U' R' U2 F R F'",
      "U R' F U R U' R2 F' R2 U R' U' R",
      "U R' F R U R U' R2 F' R2 U' R' U R U R'",
    ],
  },
  {
    id: "oll-56",
    name: "OLL 56",
    subset: "i-shape",
    algs: [
      "r U r' U R U' R' U R U' R' r U' r'",
      "r U r' U R U' R' M' U R U2 r'",
      "F R U R' U' R F' r U R' U' r'",
    ],
  },
  {
    id: "oll-57",
    name: "OLL 57",
    subset: "corners-oriented",
    algs: [
      "R U R' U' M' U R U' r'",
      "U R U' R' S' R U R' S",
      "U R U R' S' R U' R' S",
    ],
  },
]

export const PLL_CASES = [
  {
    id: "aa",
    name: "Aa Permutation",
    subset: "edge-swap",
    algs: [
      "x R2 D2 R U R' D2 R U' R x'",
      "x R2 D2 R U R' D2 R U' R x'",
      "U x' R U' R D2 R' U R D2 R2 x",
    ],
  },
  {
    id: "ab",
    name: "Ab Permutation",
    subset: "edge-swap",
    algs: [
      "x R' U R' D2 R U' R' D2 R2 x'",
      "x R' U R' D2 R U' R' D2 R2 x'",
      "U x' R2 D2 R' U' R D2 R' U R' x",
    ],
  },
  {
    id: "e",
    name: "E Permutation",
    subset: "edge-swap",
    algs: [
      "x' D R U R' D' R U' R' D R U' R' D' R U R' x",
      "U x' R U' R' D R U R' D' R U R' D R U' R' D' x",
      "U R' U' R' D' R U' R' D R U R' D' R U R' D R2",
    ],
  },
  {
    id: "f",
    name: "F Permutation",
    subset: "adjacent-swap",
    algs: [
      "R' U' F' R U R' U' R' F R2 U' R' U' R U R' U R",
      "R' U' R U' R' U R U R2 F' R U R U' R' F U R",
      "U R' U' F' R U R' U' R' F R2 U' R' U' R U R' U R",
    ],
  },
  {
    id: "ga",
    name: "Ga Permutation",
    subset: "adjacent-swap",
    algs: [
      "R' U' R D' U R2 U R' U R U' R U' R2 D",
      "R' U' R U D' R2 U R' U R U' R U' R2 D",
      "D R' U' R U D' R2 U R' U R U' R U' R2",
    ],
  },
  {
    id: "gb",
    name: "Gb Permutation",
    subset: "adjacent-swap",
    algs: [
      "R2 U R' U R' U' R U' R2 D U' R' U R D'",
      "R2 U R' U R' U' R U' R2 D U' R' U R D'",
      "R2 u R' U R' U' R u' R2 F' U F",
    ],
  },
  {
    id: "gc",
    name: "Gc Permutation",
    subset: "adjacent-swap",
    algs: [
      "D' R U R' U' D R2 U' R U' R' U R' U R2",
      "R U R' U' D R2 U' R U' R' U R' U R2 D'",
      "D' R U R' U' D R2 U' R U' R' U R' U R2",
    ],
  },
  {
    id: "gd",
    name: "Gd Permutation",
    subset: "adjacent-swap",
    algs: [
      "R2 U' R U' R U R' U R2 D' U R U' R' D",
      "R2 U' R U' R U R' U R2 D' U R U' R' D",
      "U2 R2 F2 R U2 R U2 R' F R U R' U' R' F R2",
    ],
  },
  {
    id: "h",
    name: "H Permutation",
    subset: "epll",
    algs: [
      "M2 U M2 U2 M2 U M2",
      "M2 U M2 U2 M2 U M2",
      "M2 U' M2 U2 M2 U' M2",
    ],
  },
  {
    id: "ja",
    name: "Ja Permutation",
    subset: "adjacent-swap",
    algs: [
      "L' R' U2 R U R' U2 L U' R",
      "U R' U L' U2 R U' R' U2 R L",
      "U2 x R2 F R F' R U2 r' U r U2 x'",
    ],
  },
  {
    id: "jb",
    name: "Jb Permutation",
    subset: "adjacent-swap",
    algs: [
      "R U R2 F' R U R U' R' F R U' R'",
      "R U R' F' R U R' U' R' F R2 U' R'",
      "R U2 R' U' R U2 L' U R' U' L",
    ],
  },
  {
    id: "na",
    name: "Na Permutation",
    subset: "diagonal-swap",
    algs: [
      "R U R' U2 R U R2 F' R U R U' R' F R U' R' U' R U' R'",
      "R U R' U R U R' F' R U R' U' R' F R2 U' R' U2 R U' R'",
      "F' R U R' U' R' F R2 F U' R' U' R U F' R'",
    ],
  },
  {
    id: "nb",
    name: "Nb Permutation",
    subset: "diagonal-swap",
    algs: [
      "F r' F' r U r U' r2 D' F r U r' F' D r",
      "R' U R U' R' F' U' F R U R' F R' F' R U' R",
      "r' D' F r U' r' F' D r2 U r' U' r' F r F'",
    ],
  },
  {
    id: "ra",
    name: "Ra Permutation",
    subset: "adjacent-swap",
    algs: [
      "R U2 R D R' U R D' R' U' R' U R U R'",
      "U R U' R' U' R U R D R' U' R D' R' U2 R'",
      "U R U R' F' R U2 R' U2 R' F R U R U2 R'",
    ],
  },
  {
    id: "rb",
    name: "Rb Permutation",
    subset: "adjacent-swap",
    algs: [
      "R' U R U R' U' R' D' R U R' D R U2 R",
      "R' U2 R U2 R' F R U R' U' R' F' R2",
      "U R2 F R U R U' R' F' R U2 R' U2 R",
    ],
  },
  {
    id: "t",
    name: "T Permutation",
    subset: "adjacent-swap",
    algs: [
      "R U R' U' R' F R2 U' R' U' R U R' F'",
      "F R U' R' U R U R2 F' R U R U' R'",
      "l b d' L' U' F U2 L' U' L' U L U' f' S M r u E U' R'",
    ],
  },
  {
    id: "ua",
    name: "Ua Permutation",
    subset: "epll",
    algs: [
      "M2 U' M' U2 M U' M2",
      "U2 M2 U' M U2 M' U' M2",
      "R' U R' U' R' U' R' U R U R2",
    ],
  },
  {
    id: "ub",
    name: "Ub Permutation",
    subset: "epll",
    algs: [
      "M2 U M' U2 M U M2",
      "U2 M2 U M U2 M' U M2",
      "R U R' U R' U' R2 U' R' U R' U R",
    ],
  },
  {
    id: "v",
    name: "V Permutation",
    subset: "diagonal-swap",
    algs: [
      "D2 R' U R D' R2 U' R' U R' U R' D' R U2 R'",
      "R' U R' U' R D' R' D R' U D' R2 U' R2 D R2",
      "R' U R U' R' f' U' R U2 R' U' R U' R' f R",
    ],
  },
  {
    id: "U",
    name: "U Permutation",
    subset: "diagonal-swap",
    algs: [
      "F R' F' R U R U' R' F R U' R' U R U R' F'",
      "F R U' R' U' R U R' F' R U R' U' R' F R F'",
      "F R' F R2 U' R' U' R U R' F' R U R' U' F'",
    ],
  },
  {
    id: "z",
    name: "Z Permutation",
    subset: "epll",
    algs: [
      "M U2 M2 U2 M U' M2 U' M2",
      "M2 U M2 U M' U2 M2 U2 M'",
      "M' U' M2 U' M2 U' M' U2 M2",
    ],
  },
]
