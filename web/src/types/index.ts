
export interface PageProps {
  params: {
    [key: string]: string | string[];
  };
  searchParams?: {
    [key: string]: string | string[] | undefined;
  };
}

export type APIResponse = {
  success: boolean;
  message: string;
  data: any;
  status: number;
  [x: string]: unknown;
};

export type Slide = {
  title: string;
  description: string;
  image: string;
  [x: string]: unknown;
};

export type ErrorState = {
  status: boolean;
  message: string;
  [x: string]: unknown;
};

export type OptionItem = {
  id: string | number;
  name: string;
  label?: string;
  value?: string;
  code?: string;
  [x: string]: any;
};

export type systemActionType = {
  id: string;
  name: string;
};

export type PricingPlan = {
  id?: any;
  title: React.ReactNode | string;
  description: string;
  value: number;
  quantityOfCredits: number;
  discount: number;
  price: number;
};
