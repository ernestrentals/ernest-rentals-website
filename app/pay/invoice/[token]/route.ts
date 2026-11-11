import {
  redirect,
} from "next/navigation";

type RouteContext = {
  params: Promise<{
    token: string;
  }>;
};

export async function GET(
  _request: Request,
  {
    params,
  }: RouteContext
) {
  const {
    token,
  } = await params;

  redirect(
    `https://crm.ernestrentals.com/pay/invoice/${encodeURIComponent(
      token
    )}`
  );
}
