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

function escapeHtml(
  value: string
) {
  return value
    .replaceAll(
      "&",
      "&amp;"
    )
    .replaceAll(
      "<",
      "&lt;"
    )
    .replaceAll(
      ">",
      "&gt;"
    )
    .replaceAll(
      '"',
      "&quot;"
    )
    .replaceAll(
      "'",
      "&#039;"
    );
}

function verifySignedState(
  state: string,
  secret: string
) {
  try {
    const [
      payload,
      signature,
    ] =
      state.split(".");

    if (
      !payload ||
      !signature
    ) {
      return false;
    }

    const expectedSignature =
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

    const actualBuffer =
      Buffer.from(
        signature
      );

    const expectedBuffer =
      Buffer.from(
        expectedSignature
      );

    if (
      actualBuffer.length !==
      expectedBuffer.length
    ) {
      return false;
    }

    if (
      !crypto.timingSafeEqual(
        actualBuffer,
        expectedBuffer
      )
    ) {
      return false;
    }

    const decoded =
      JSON.parse(
        Buffer.from(
          payload,
          "base64url"
        ).toString(
          "utf8"
        )
      ) as {
        nonce?: string;
        createdAt?: number;
      };

    if (
      !decoded.nonce ||
      !decoded.createdAt
    ) {
      return false;
    }

    const age =
      Date.now() -
      decoded.createdAt;

    const tenMinutes =
      10 * 60 * 1000;

    if (
      age < 0 ||
      age >
        tenMinutes
    ) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

function page(
  title: string,
  body: string
) {
  return `
    <!doctype html>

    <html lang="en">
      <head>
        <meta charset="utf-8" />

        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />

        <title>
          ${escapeHtml(
            title
          )}
        </title>

        <style>
          body {
            margin: 0;
            background: #f5f8fc;
            color: #071226;
            font-family:
              Arial,
              Helvetica,
              sans-serif;
          }

          .wrap {
            max-width: 760px;
            margin: 70px auto;
            padding: 24px;
          }

          .card {
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 18px;
            padding: 32px;
            box-shadow:
              0 10px 30px rgba(15,23,42,.08);
          }

          .eyebrow {
            color: #f97316;
            font-size: 12px;
            font-weight: 800;
            letter-spacing: .12em;
            text-transform: uppercase;
          }

          h1 {
            margin: 8px 0 12px;
          }

          p {
            color: #64748b;
            line-height: 1.7;
          }

          .token {
            margin-top: 20px;
            padding: 18px;
            background: #f8fafc;
            border: 1px solid #cbd5e1;
            border-radius: 12px;
            word-break: break-all;
            font-family:
              Consolas,
              monospace;
            font-size: 13px;
            color: #0f172a;
          }

          .warning {
            margin-top: 20px;
            background: #fff7ed;
            border: 1px solid #fed7aa;
            color: #9a3412;
            border-radius: 12px;
            padding: 16px;
            line-height: 1.5;
          }

          .success {
            color: #15803d;
          }
        </style>
      </head>

      <body>
        <div class="wrap">
          <div class="card">
            ${body}
          </div>
        </div>
      </body>
    </html>
  `;
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
          "Google Calendar callback is only available locally during setup.",
      },
      {
        status: 403,
      }
    );
  }

  const googleError =
    request.nextUrl.searchParams.get(
      "error"
    );

  if (
    googleError
  ) {
    return new NextResponse(
      page(
        "Google Authorization Cancelled",
        `
          <p class="eyebrow">
            Ernest Rentals Scheduling
          </p>

          <h1>
            Authorization was not completed
          </h1>

          <p>
            Google returned:
            <strong>
              ${escapeHtml(
                googleError
              )}
            </strong>
          </p>
        `
      ),
      {
        status: 400,

        headers: {
          "Content-Type":
            "text/html; charset=utf-8",
        },
      }
    );
  }

  const code =
    request.nextUrl.searchParams.get(
      "code"
    );

  const incomingState =
    request.nextUrl.searchParams.get(
      "state"
    );

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
          "Google OAuth credentials are missing.",
      },
      {
        status: 500,
      }
    );
  }

  if (
    !incomingState ||
    !verifySignedState(
      incomingState,
      clientSecret
    )
  ) {
    return new NextResponse(
      page(
        "Invalid Google Authorization",
        `
          <p class="eyebrow">
            Ernest Rentals Scheduling
          </p>

          <h1>
            Security check failed
          </h1>

          <p>
            The authorization request could not be verified.
          </p>

          <p>
            Please restart the Google Calendar connection.
          </p>
        `
      ),
      {
        status: 400,

        headers: {
          "Content-Type":
            "text/html; charset=utf-8",
        },
      }
    );
  }

  if (
    !code
  ) {
    return new NextResponse(
      page(
        "Missing Authorization Code",
        `
          <p class="eyebrow">
            Ernest Rentals Scheduling
          </p>

          <h1>
            Authorization code missing
          </h1>

          <p>
            Please restart the Google Calendar connection.
          </p>
        `
      ),
      {
        status: 400,

        headers: {
          "Content-Type":
            "text/html; charset=utf-8",
        },
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

  try {
    const {
      tokens,
    } =
      await oauth2Client.getToken(
        code
      );

    const refreshToken =
      tokens.refresh_token;

    if (
      !refreshToken
    ) {
      return new NextResponse(
        page(
          "Refresh Token Missing",
          `
            <p class="eyebrow">
              Ernest Rentals Scheduling
            </p>

            <h1>
              Google connected, but no refresh token was returned
            </h1>

            <p>
              Restart the connection and approve access again.
            </p>

            <div class="warning">
              Google may not issue another refresh token if this
              Google account has already authorized this application.
            </div>
          `
        ),
        {
          status: 400,

          headers: {
            "Content-Type":
              "text/html; charset=utf-8",
          },
        }
      );
    }

    return new NextResponse(
      page(
        "Google Calendar Connected",
        `
          <p class="eyebrow">
            Ernest Rentals Scheduling
          </p>

          <h1 class="success">
            Google Calendar connected successfully
          </h1>

          <p>
            Copy the refresh token below into
            <strong>.env.local</strong>.
          </p>

          <div class="token">
            ${escapeHtml(
              refreshToken
            )}
          </div>

          <div class="warning">
            Treat this token like a password.
            Do not send it to anyone, paste it into ChatGPT,
            or commit it to GitHub.
          </div>

          <p>
            Set it as:
            <strong>
              GOOGLE_CALENDAR_REFRESH_TOKEN
            </strong>
          </p>
        `
      ),
      {
        headers: {
          "Content-Type":
            "text/html; charset=utf-8",

          "Cache-Control":
            "no-store",
        },
      }
    );
  } catch (
    error
  ) {
    console.error(
      "Google OAuth callback error:",
      error
    );

    return new NextResponse(
      page(
        "Google Calendar Connection Failed",
        `
          <p class="eyebrow">
            Ernest Rentals Scheduling
          </p>

          <h1>
            Unable to connect Google Calendar
          </h1>

          <p>
            Check the development terminal for the error details.
          </p>
        `
      ),
      {
        status: 500,

        headers: {
          "Content-Type":
            "text/html; charset=utf-8",
        },
      }
    );
  }
}