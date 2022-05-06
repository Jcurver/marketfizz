import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  console.log(req.session);
  const { token } = req.body;
  const tokenExists = await client.token.findUnique({
    where: {
      payload: token,
    },
    // include: {user:true}
  });
  if (!tokenExists) res.status(404).end();
  console.log(tokenExists)
  req.session.user = {
    id: tokenExists?.userId
  }
  await req.session.save()
  res.status(200).end();
}

export default withIronSessionApiRoute(withHandler("POST", handler), {
  cookieName: "jhSession",
  password: "123412341289082340598234016723489142364891423",
});
