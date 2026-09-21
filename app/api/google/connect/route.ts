import crypto from "crypto";

import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  google,
} from "googleapis";

export const runtime =
  "nodejs";

const GOOGLE_SCOPES = [
  "https://www.googleapis.com/auth/calendar.events",
  "https://www.googleapis.com/auth/calendar.events.freebusy",
];

function isLocalRequest(
  request: NextRequest
) {
  return [
    "localhost",
    "127.0.0.1",
  ].includes(
    request.nextUrl.hostname
  );
}

function createSignedState(
  secret: string
) {
  const payload =
    Buffer.from(
      JSON.stringify({
        nonce:
          crypto
            .randomBytes(24)
            .toString("hex"),

        createdAt:
          Date.now(),
      })
    ).toString(
      "base64url"
    );

  const signature =
    crypto
      .createHmac(
        "sha256",
        secret
      )
      .update(
        payload
      )
      .digest(
        "base64url"
      );

  return `${payload}.${signature}`;
}

export async function GET(
  request: NextRequest
) {
  if (
    !isLocalRequest(
      request
    )
  ) {
    return NextResponse.json(
      {
        error:
          "Google Calendar connection is only available locally.",
      },
      {
        status: 403,
      }
    );
  }

  const clientId =
    process.env
      .GOOGLE_CLIENT_ID;

  const clientSecret =
    process.env
      .GOOGLE_CLIENT_SECRET;

  if (
    !clientId ||
    !clientSecret
  ) {
    return NextResponse.json(
      {
        error:
          "GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET is missing from .env.local.",
      },
      {
        status: 500,
      }
    );
  }

  const redirectUri =
    `${request.nextUrl.origin}/api/google/callback`;

  const oauth2Client =
    new google.auth.OAuth2(
      clientId,
      clientSecret,
      redirectUri
    );

  const state =
    createSignedState(
      clientSecret
    );

  const authorizationUrl =
    oauth2Client.generateAuthUrl(
      {
        access_type:
          "offline",

        prompt:
          "consent",

        include_granted_scopes:
          true,

        scope:
          GOOGLE_SCOPES,

        state,
      }
    );

  return NextResponse.redirect(
    authorizationUrl
  );
}