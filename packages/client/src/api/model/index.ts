export type HandleProduct = {
  id: string;
  name: string;
  description: string;
  categories: { id: string; name: string }[];
  image: string;
  stock: number;
};

export type Manufacturer = {
  id: string;
  name: string;
  description: string;
};
