import "next";

declare module "next" {
  export interface NextApiRequest {
    user?: { id: string; role?: string };
  }
}
