export interface ProductModel {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface ProductVariant {
  company: string;
  quantity: number;
  price: number;
  id: string;
  models: ProductModel[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  variants: ProductVariant[];
}

export interface Category {
  id: string;
  name: string;
  products: Product[];
}

export interface SubProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  parentProductId: string;
}

// Define the product categories according to the flowchart
export const categories: Category[] = [
  {
    id: "cat1",
    name: "Electronics",
    products: [
      {
        id: "prod1",
        name: "SmartPhone",
        description: "A high-quality product with multiple variants",
        image:
          "https://images.unsplash.com/photo-1605236453806-6ff36851218e?q=80&w=200",
        variants: [
          {
            id: "var1",
            company: "Apple",
            quantity: 50,
            price: 999.99,
            models: [
              {
                id: "model1",
                name: "iPhone 13",
                price: 699.99,
                quantity: 10,
                image:
                  "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?q=80&w=200",
              },
              {
                id: "model2",
                name: "iPhone 14",
                price: 799.99,
                quantity: 15,
                image:
                  "https://m.media-amazon.com/images/I/618Bb+QzCmL.jpg",
              },
              {
                id: "model3",
                name: "iPhone 14 Pro",
                price: 999.99,
                quantity: 8,
                image:
                  "https://www.imagineonline.store/cdn/shop/files/iPhone_14_Pro_Gold_PDP_Image_Position-1a__WWEN_a2e743f3-400b-4123-99a5-78df9643980c.jpg?v=1692349379",
              },
              {
                id: "model4",
                name: "iPhone 15",
                price: 1099.99,
                quantity: 12,
                image:
                  "https://iplanet.one/cdn/shop/files/iPhone_15_Plus_Green_PDP_Image_Position-1__en-IN.jpg?v=1695429498&width=1920",
              },
              {
                id: "model5",
                name: "iPhone 15 Pro Max",
                price: 1399.99,
                quantity: 5,
                image:
                  "https://m.media-amazon.com/images/I/81fxjeu8fdL.jpg",
              },
            ],
          },
          {
            id: "var2",
            company: "Samsung",
            quantity: 62,
            price: 899.99,
            models: [
              {
                id: "model6",
                name: "Galaxy S22",
                price: 699.99,
                quantity: 14,
                image:
                  "https://m.media-amazon.com/images/I/51W2KpbkmWL.jpg",
              },
              {
                id: "model7",
                name: "Galaxy S23",
                price: 799.99,
                quantity: 18,
                image:
                  "https://rukminim2.flixcart.com/image/750/900/xif0q/mobile/p/w/p/-original-imah4zp8tfzndmmh.jpeg?q=20&crop=false",
              },
              {
                id: "model8",
                name: "Galaxy S23 Ultra",
                price: 1099.99,
                quantity: 10,
                image:
                  "https://m.media-amazon.com/images/I/71lD7eGdW-L._AC_UF1000,1000_QL80_.jpg",
              },
              {
                id: "model9",
                name: "Galaxy Z Flip 5",
                price: 999.99,
                quantity: 12,
                image:
                  "https://m.media-amazon.com/images/I/61Tl1z+Hn0L.jpg",
              },
              {
                id: "model10",
                name: "Galaxy Z Fold 5",
                price: 1799.99,
                quantity: 8,
                image:
                  "https://images.unsplash.com/photo-1662947715106-bca395af6143?q=80&w=200",
              },
            ],
          },
          {
            id: "var3",
            company: "Realme",
            quantity: 30,
            price: 699.99,
            models: [
              {
                id: "model11",
                name: "Realme 11 Pro",
                price: 349.99,
                quantity: 7,
                image:
                  "https://images.unsplash.com/photo-1598965402089-897e8000c0b1?q=80&w=200",
              },
              {
                id: "model12",
                name: "Realme GT 5",
                price: 499.99,
                quantity: 6,
                image:
                  "https://images.unsplash.com/photo-1598965402089-897e8000c0b1?q=80&w=200",
              },
              {
                id: "model13",
                name: "Realme C55",
                price: 249.99,
                quantity: 8,
                image:
                  "https://images.unsplash.com/photo-1598965402089-897e8000c0b1?q=80&w=200",
              },
              {
                id: "model14",
                name: "Realme 11 5G",
                price: 399.99,
                quantity: 5,
                image:
                  "https://images.unsplash.com/photo-1598965402089-897e8000c0b1?q=80&w=200",
              },
              {
                id: "model15",
                name: "Realme GT Neo 5",
                price: 599.99,
                quantity: 4,
                image:
                  "https://images.unsplash.com/photo-1598965402089-897e8000c0b1?q=80&w=200",
              },
            ],
          },
        ],
      },
      {
        id: "prod2",
        name: "Laptop",
        description: "Another excellent product with various options",
        image:
          "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=200",
        variants: [
          {
            id: "var4",
            company: "Apple",
            quantity: 25,
            price: 1299.99,
            models: [
              {
                id: "model16",
                name: 'MacBook Air 13"',
                price: 999.99,
                quantity: 5,
                image:
                  "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=200",
              },
              {
                id: "model17",
                name: 'MacBook Air 15"',
                price: 1199.99,
                quantity: 7,
                image:
                  "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=200",
              },
              {
                id: "model18",
                name: 'MacBook Pro 14"',
                price: 1599.99,
                quantity: 4,
                image:
                  "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=200",
              },
              {
                id: "model19",
                name: 'MacBook Pro 16"',
                price: 1999.99,
                quantity: 6,
                image:
                  "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=200",
              },
              {
                id: "model20",
                name: "MacBook Pro M3 Max",
                price: 2499.99,
                quantity: 3,
                image:
                  "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=200",
              },
            ],
          },
          {
            id: "var5",
            company: "Samsung",
            quantity: 36,
            price: 1199.99,
            models: [
              {
                id: "model21",
                name: "Galaxy Book3",
                price: 899.99,
                quantity: 8,
                image:
                  "https://images.unsplash.com/photo-1661961110671-77b71b929d52?q=80&w=200",
              },
              {
                id: "model22",
                name: "Galaxy Book3 Pro",
                price: 1199.99,
                quantity: 10,
                image:
                  "https://images.unsplash.com/photo-1661961110671-77b71b929d52?q=80&w=200",
              },
              {
                id: "model23",
                name: "Galaxy Book3 360",
                price: 1299.99,
                quantity: 7,
                image:
                  "https://images.unsplash.com/photo-1661961110671-77b71b929d52?q=80&w=200",
              },
              {
                id: "model24",
                name: "Galaxy Book3 Ultra",
                price: 1799.99,
                quantity: 6,
                image:
                  "https://images.unsplash.com/photo-1661961110671-77b71b929d52?q=80&w=200",
              },
              {
                id: "model25",
                name: "Galaxy Book Pro 360",
                price: 1399.99,
                quantity: 5,
                image:
                  "https://images.unsplash.com/photo-1661961110671-77b71b929d52?q=80&w=200",
              },
            ],
          },
          {
            id: "var6",
            company: "Asus",
            quantity: 43,
            price: 999.99,
            models: [
              {
                id: "model26",
                name: "ZenBook 14",
                price: 799.99,
                quantity: 9,
                image:
                  "https://images.unsplash.com/photo-1605871499262-41e10c193bbf?q=80&w=200",
              },
              {
                id: "model27",
                name: "ROG Zephyrus G14",
                price: 1299.99,
                quantity: 8,
                image:
                  "https://images.unsplash.com/photo-1605871499262-41e10c193bbf?q=80&w=200",
              },
              {
                id: "model28",
                name: "TUF Gaming A15",
                price: 999.99,
                quantity: 12,
                image:
                  "https://images.unsplash.com/photo-1605871499262-41e10c193bbf?q=80&w=200",
              },
              {
                id: "model29",
                name: "VivoBook 15",
                price: 699.99,
                quantity: 7,
                image:
                  "https://images.unsplash.com/photo-1605871499262-41e10c193bbf?q=80&w=200",
              },
              {
                id: "model30",
                name: "ProArt StudioBook 16",
                price: 1699.99,
                quantity: 7,
                image:
                  "https://images.unsplash.com/photo-1605871499262-41e10c193bbf?q=80&w=200",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "cat2",
    name: "Accessories",
    products: [
      {
        id: "prod3",
        name: "Mouse",
        description: "Essential accessories for your devices",
        image:
          "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=200",
        variants: [
          {
            id: "var7",
            company: "Apple",
            quantity: 82,
            price: 149.99,
            models: [
              {
                id: "model31",
                name: "Magic Mouse",
                price: 99.99,
                quantity: 20,
                image:
                  "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=200",
              },
              {
                id: "model32",
                name: "Magic Mouse Pro",
                price: 149.99,
                quantity: 22,
                image:
                  "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=200",
              },
              {
                id: "model33",
                name: "Magic Trackpad",
                price: 129.99,
                quantity: 15,
                image:
                  "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=200",
              },
              {
                id: "model34",
                name: "Magic Mouse - Space Black",
                price: 109.99,
                quantity: 12,
                image:
                  "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=200",
              },
              {
                id: "model35",
                name: "Magic Trackpad - Space Black",
                price: 139.99,
                quantity: 13,
                image:
                  "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=200",
              },
            ],
          },
          {
            id: "var8",
            company: "Cosmic Byte",
            quantity: 70,
            price: 39.99,
            models: [
              {
                id: "model36",
                name: "Nebula RGB Gaming Mouse",
                price: 29.99,
                quantity: 15,
                image:
                  "https://images.unsplash.com/photo-1618499890638-3f8a704158e7?q=80&w=200",
              },
              {
                id: "model37",
                name: "Pulsar Wireless",
                price: 39.99,
                quantity: 12,
                image:
                  "https://images.unsplash.com/photo-1618499890638-3f8a704158e7?q=80&w=200",
              },
              {
                id: "model38",
                name: "Eclipse Pro",
                price: 44.99,
                quantity: 18,
                image:
                  "https://images.unsplash.com/photo-1618499890638-3f8a704158e7?q=80&w=200",
              },
              {
                id: "model39",
                name: "Asteroid Lightweight",
                price: 34.99,
                quantity: 14,
                image:
                  "https://images.unsplash.com/photo-1618499890638-3f8a704158e7?q=80&w=200",
              },
              {
                id: "model40",
                name: "Comet RGB",
                price: 32.99,
                quantity: 11,
                image:
                  "https://images.unsplash.com/photo-1618499890638-3f8a704158e7?q=80&w=200",
              },
            ],
          },
          {
            id: "var9",
            company: "Razor Blade",
            quantity: 47,
            price: 129.99,
            models: [
              {
                id: "model41",
                name: "DeathAdder V3 Pro",
                price: 129.99,
                quantity: 10,
                image:
                  "https://images.unsplash.com/photo-1618499890638-3f8a704158e7?q=80&w=200",
              },
              {
                id: "model42",
                name: "Viper V2 Pro",
                price: 149.99,
                quantity: 12,
                image:
                  "https://images.unsplash.com/photo-1618499890638-3f8a704158e7?q=80&w=200",
              },
              {
                id: "model43",
                name: "Basilisk V3 Pro",
                price: 159.99,
                quantity: 8,
                image:
                  "https://images.unsplash.com/photo-1618499890638-3f8a704158e7?q=80&w=200",
              },
              {
                id: "model44",
                name: "Naga Pro",
                price: 139.99,
                quantity: 9,
                image:
                  "https://images.unsplash.com/photo-1618499890638-3f8a704158e7?q=80&w=200",
              },
              {
                id: "model45",
                name: "Orochi V2",
                price: 99.99,
                quantity: 8,
                image:
                  "https://images.unsplash.com/photo-1618499890638-3f8a704158e7?q=80&w=200",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "cat3",
    name: "Storage",
    products: [
      {
        id: "prod4",
        name: "SSD",
        description: "Storage solutions for all your needs",
        image:
          "https://proaudiovideo.in/wp-content/uploads/Samsung-T7-Shield-1TB-Portable-SSD-1050-MBs-Black-Online-Buy-India_01.webp",
        variants: [
          {
            id: "var10",
            company: "Sandisk",
            quantity: 40,
            price: 149.99,
            models: [
              {
                id: "model46",
                name: "Extreme PRO 1TB",
                price: 149.99,
                quantity: 8,
                image:
                  "https://images.unsplash.com/photo-1597764690523-15bea4c581c9?q=80&w=200",
              },
              {
                id: "model47",
                name: "Extreme 2TB",
                price: 199.99,
                quantity: 10,
                image:
                  "https://images.unsplash.com/photo-1597764690523-15bea4c581c9?q=80&w=200",
              },
              {
                id: "model48",
                name: "Ultra 500GB",
                price: 79.99,
                quantity: 7,
                image:
                  "https://images.unsplash.com/photo-1597764690523-15bea4c581c9?q=80&w=200",
              },
              {
                id: "model49",
                name: "Extreme PRO 4TB",
                price: 299.99,
                quantity: 6,
                image:
                  "https://images.unsplash.com/photo-1597764690523-15bea4c581c9?q=80&w=200",
              },
              {
                id: "model50",
                name: "Ultra 1TB",
                price: 129.99,
                quantity: 9,
                image:
                  "https://images.unsplash.com/photo-1597764690523-15bea4c581c9?q=80&w=200",
              },
            ],
          },
          {
            id: "var11",
            company: "Samsung",
            quantity: 58,
            price: 129.99,
            models: [
              {
                id: "model51",
                name: "970 EVO Plus 1TB",
                price: 119.99,
                quantity: 12,
                image:
                  "https://images.unsplash.com/photo-1597764690523-15bea4c581c9?q=80&w=200",
              },
              {
                id: "model52",
                name: "980 PRO 2TB",
                price: 179.99,
                quantity: 15,
                image:
                  "https://images.unsplash.com/photo-1597764690523-15bea4c581c9?q=80&w=200",
              },
              {
                id: "model53",
                name: "T7 Shield 1TB",
                price: 129.99,
                quantity: 11,
                image:
                  "https://images.unsplash.com/photo-1597764690523-15bea4c581c9?q=80&w=200",
              },
              {
                id: "model54",
                name: "870 EVO 2TB",
                price: 159.99,
                quantity: 10,
                image:
                  "https://images.unsplash.com/photo-1597764690523-15bea4c581c9?q=80&w=200",
              },
              {
                id: "model55",
                name: "990 PRO 2TB",
                price: 199.99,
                quantity: 10,
                image:
                  "https://images.unsplash.com/photo-1597764690523-15bea4c581c9?q=80&w=200",
              },
            ],
          },
          {
            id: "var12",
            company: "Cursior",
            quantity: 20,
            price: 99.99,
            models: [
              {
                id: "model56",
                name: "MP600 PRO 1TB",
                price: 99.99,
                quantity: 4,
                image:
                  "https://images.unsplash.com/photo-1597764690523-15bea4c581c9?q=80&w=200",
              },
              {
                id: "model57",
                name: "MP600 PRO 2TB",
                price: 159.99,
                quantity: 5,
                image:
                  "https://images.unsplash.com/photo-1597764690523-15bea4c581c9?q=80&w=200",
              },
              {
                id: "model58",
                name: "MP510 1TB",
                price: 89.99,
                quantity: 3,
                image:
                  "https://images.unsplash.com/photo-1597764690523-15bea4c581c9?q=80&w=200",
              },
              {
                id: "model59",
                name: "MP600 PRO XT 2TB",
                price: 189.99,
                quantity: 4,
                image:
                  "https://images.unsplash.com/photo-1597764690523-15bea4c581c9?q=80&w=200",
              },
              {
                id: "model60",
                name: "MP600 CORE 1TB",
                price: 79.99,
                quantity: 4,
                image:
                  "https://images.unsplash.com/photo-1597764690523-15bea4c581c9?q=80&w=200",
              },
            ],
          },
        ],
      },
    ],
  },
];

// Recommendation products (sub-products)
export const subProducts: SubProduct[] = [
  {
    id: "sub1",
    name: "Different sub-product of Product 1",
    description: "A complementary product for Product 1",
    price: 49.99,
    image:
      "https://images.unsplash.com/photo-1604937455095-ef2fe3d46fcd?q=80&w=200",
    parentProductId: "prod1",
  },
  {
    id: "sub2",
    name: "Different sub-product of Product 2",
    description: "A complementary product for Product 2",
    price: 59.99,
    image:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=200",
    parentProductId: "prod2",
  },
  {
    id: "sub3",
    name: "Another sub-product for Product 1",
    description: "An additional complementary product for Product 1",
    price: 29.99,
    image:
      "https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1697017239/Croma%20Assets/Computers%20Peripherals/Computer%20Accessories%20and%20Tablets%20Accessories/Images/252045_0_gyj7k2.png",
    parentProductId: "prod1",
  },
];

// Legacy product data for compatibility
export const products = [
  {
    id: "1",
    name: "Smartphone X Pro",
    description:
      "High-end smartphone with advanced camera and long battery life.",
    price: 899.99,
    image:
      "https://images.unsplash.com/photo-1605236453806-6ff36851218e?q=80&w=200",
    category: "Electronics",
    stock: 50,
    related: ["4", "5", "8"],
  },
  {
    id: "2",
    name: 'Business Laptop 15"',
    description:
      "Powerful laptop for business and professional use with premium build quality.",
    price: 1299.99,
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=200",
    category: "Electronics",
    stock: 30,
    related: ["3", "7", "9"],
  },
];
