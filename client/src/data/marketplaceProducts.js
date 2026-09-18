// Placeholder product catalog for the Trainly Marketplace.
// To connect a real backend later, replace PRODUCTS with a fetch call
// (e.g. api.getMarketplaceProducts()) — every component below only
// expects an array shaped like this, so nothing else needs to change.
//
// Shape:
//   image     -> first image (kept so existing components don't break)
//   images    -> 2-3 images for galleries/carousels
//   aiPoster  -> AI generated attractive poster service for that product

export const CATEGORIES = ["Products", "Courses & Services"];

export const PRODUCTS = [
  {
    id: "mp-1",
    name: "Branded College Bag",
    price: 149,
    category: "Products",
    images: [
      "https://images.pexels.com/photos/1546003/pexels-photo-1546003.jpeg?auto=compress&cs=tinysrgb&w=600",
      "https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg?auto=compress&cs=tinysrgb&w=600",
      "https://images.pexels.com/photos/1545998/pexels-photo-1545998.jpeg?auto=compress&cs=tinysrgb&w=600",
    ],
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUyri0pM7xADuhWFfPDfbbA4YnpCWX2Et7X6pXLesRlw&s=10",
    aiPoster: { available: true, label: "Generate AI Poster" },
  },
  {
    id: "mp-2",
    name: "Aesthetic Tumbler / Sipper Bottle",
    price: 99,
    category: "Products",
    images: [
      "https://images.pexels.com/photos/1793035/pexels-photo-1793035.jpeg?auto=compress&cs=tinysrgb&w=600",
      "https://images.pexels.com/photos/4443464/pexels-photo-4443464.jpeg?auto=compress&cs=tinysrgb&w=600",
    ],
    image: "https://m.media-amazon.com/images/I/51tEnRqPkuL._SY300_SX300_QL70_FMwebp_.jpg",
    aiPoster: { available: true, label: "Generate AI Poster" },
  },
  {
    id: "mp-3",
    name: "Foldable Laptop Table",
    price: 199,
    category: "Products",
    images: [
      "https://images.pexels.com/photos/4145153/pexels-photo-4145153.jpeg?auto=compress&cs=tinysrgb&w=600",
      "https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg?auto=compress&cs=tinysrgb&w=600",
      "https://images.pexels.com/photos/4050347/pexels-photo-4050347.jpeg?auto=compress&cs=tinysrgb&w=600",
    ],
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbjoAMDPpHns880aeVoipZrJukT_EV5KGJx3-CWz9fVRM6QH_Z1DRvo0c&s=10",
    aiPoster: { available: true, label: "Generate AI Poster" },
  },
  {
    id: "mp-4",
    name: "Wireless Headphones",
    price: 299,
    category: "Products",
    images: [
      "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=600",
      "https://images.pexels.com/photos/3945667/pexels-photo-3945667.jpeg?auto=compress&cs=tinysrgb&w=600",
    ],
    image: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQl4YRgNySRBxae85WGWCeMashiu1znPdwayv7WEiBvG4qArezM7XYgRsM1w3Gh-R9U3rUforD1_GORFyMQDSZpUnGxFDlLqlO-MwOmGxtL9VzUjNsJHv9z4EZjNbj-&usqp=CAc",
    aiPoster: { available: true, label: "Generate AI Poster" },
  },
  {
    id: "mp-5",
    name: "Python: Basic to Advanced Bootcamp",
    price: 79,
    category: "Courses & Services",
    images: [
      "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=600",
      "https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=600",
    ],
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKAUbOMiv-OHnM77_P2miw9evGxZPSn0MkzB8C1eEXoA&s=10",
    aiPoster: { available: true, label: "Generate AI Poster" },
  },
  {
    id: "mp-6",
    name: "Lunch Box",
    price: 399,
    category: "Products",
    images: [
      "https://images.pexels.com/photos/8985454/pexels-photo-8985454.jpeg?auto=compress&cs=tinysrgb&w=600",
      "https://images.pexels.com/photos/6210959/pexels-photo-6210959.jpeg?auto=compress&cs=tinysrgb&w=600",
    ],
    image: "https://images.pexels.com/photos/8985454/pexels-photo-8985454.jpeg?auto=compress&cs=tinysrgb&w=600",
    aiPoster: { available: true, label: "Generate AI Poster" },
  },
  {
    id: "mp-7",
    name: "Crockery Set",
    price: 699,
    category: "Products",
    images: [
      "https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=600",
      "https://images.pexels.com/photos/6270541/pexels-photo-6270541.jpeg?auto=compress&cs=tinysrgb&w=600",
      "https://images.pexels.com/photos/6270543/pexels-photo-6270543.jpeg?auto=compress&cs=tinysrgb&w=600",
    ],
    image: "https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=600",
    aiPoster: { available: true, label: "Generate AI Poster" },
  },
  {
    id: "mp-8",
    name: "Room Decor Set",
    price: 549,
    category: "Products",
    images: [
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=600",
      "https://images.pexels.com/photos/1571471/pexels-photo-1571471.jpeg?auto=compress&cs=tinysrgb&w=600",
    ],
    image: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=600",
    aiPoster: { available: true, label: "Generate AI Poster" },
  },
  {
    id: "mp-9",
    name: "Desk Lamp",
    price: 599,
    category: "Products",
    images: [
      "https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=600",
      "https://images.pexels.com/photos/1112599/pexels-photo-1112599.jpeg?auto=compress&cs=tinysrgb&w=600",
      "https://images.pexels.com/photos/1112601/pexels-photo-1112601.jpeg?auto=compress&cs=tinysrgb&w=600",
    ],
    image: "https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=600",
    aiPoster: { available: true, label: "Generate AI Poster" },
  },
  {
    id: "mp-10",
    name: "Wall-Mount Book Shelves",
    price: 1099,
    category: "Products",
    images: [
      "https://images.pexels.com/photos/1907785/pexels-photo-1907785.jpeg?auto=compress&cs=tinysrgb&w=600",
      "https://images.pexels.com/photos/1907784/pexels-photo-1907784.jpeg?auto=compress&cs=tinysrgb&w=600",
    ],
    image: "https://images.pexels.com/photos/1907785/pexels-photo-1907785.jpeg?auto=compress&cs=tinysrgb&w=600",
    aiPoster: { available: true, label: "Generate AI Poster" },
  },
  {
    id: "mp-11",
    name: "Power Bank (10000mAh)",
    price: 899,
    category: "Products",
    images: [
      "https://images.pexels.com/photos/4526483/pexels-photo-4526483.jpeg?auto=compress&cs=tinysrgb&w=600",
      "https://images.pexels.com/photos/4526484/pexels-photo-4526484.jpeg?auto=compress&cs=tinysrgb&w=600",
    ],
    image: "https://images.pexels.com/photos/4526483/pexels-photo-4526483.jpeg?auto=compress&cs=tinysrgb&w=600",
    aiPoster: { available: true, label: "Generate AI Poster" },
  },
  {
    id: "mp-12",
    name: "Resume Builder Website",
    price: 0,
    category: "Courses & Services",
    images: [
      "https://images.pexels.com/photos/5989925/pexels-photo-5989925.jpeg?auto=compress&cs=tinysrgb&w=600",
      "https://images.pexels.com/photos/5989926/pexels-photo-5989926.jpeg?auto=compress&cs=tinysrgb&w=600",
    ],
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRn27s8jT7C0jqkquv-SFTHjmXakO5QYFpw_HbIfCDW2A&s=10",
    aiPoster: { available: true, label: "Generate AI Poster" },
  },
  {
    id: "mp-13",
    name: "AI / ML Course",
    price: 3499,
    category: "Courses & Services",
    images: [
      "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=600",
      "https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=600",
      "https://images.pexels.com/photos/8386441/pexels-photo-8386441.jpeg?auto=compress&cs=tinysrgb&w=600",
    ],
    image: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=600",
    aiPoster: { available: true, label: "Generate AI Poster" },
  },
];

export default PRODUCTS;