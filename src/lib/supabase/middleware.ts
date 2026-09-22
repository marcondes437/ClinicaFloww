import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { getSupabaseConfig } from "./config";

type CookieToSet = { name: string; value: string; options?: CookieOptions };
import {
  getPrimaryRole,
  HOME_BY_ROLE,
  normalizeRoles,
  ROLE_ROUTES,
} from "@/lib/roles";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const { supabaseUrl, supabasePublishableKey } = getSupabaseConfig();

  const supabase = createServerClient(
    supabaseUrl,
    supabasePublishableKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: CookieToSet[], headers?: Record<string, string>) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
          Object.entries(headers ?? {}).forEach(([key, value]) =>
            response.headers.set(key, value)
          );
        },
      },
    }
  );

  const { data } = await supabase.auth.getClaims();
  const userId = typeof data?.claims?.sub === "string" ? data.claims.sub : null;

  const path = request.nextUrl.pathname;
  const protectedPrefixes = Object.values(ROLE_ROUTES);
  const isProtected = protectedPrefixes.some((p) => path === p || path.startsWith(p + "/"));

  if (!userId && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = "/portal-paciente";
    url.searchParams.set("redirect", path);
    return NextResponse.redirect(url);
  }

  if (userId && (isProtected || path === "/cadastro")) {
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);

    const userRoles = normalizeRoles((roles ?? []).map((r) => r.role));
    const primary = getPrimaryRole(userRoles);

    if (path === "/cadastro") {
      const url = request.nextUrl.clone();
      url.pathname = HOME_BY_ROLE[primary];
      return NextResponse.redirect(url);
    }

    const allowed = userRoles.some((role) => {
      const base = ROLE_ROUTES[role];
      return path === base || path.startsWith(base + "/");
    });

    if (!allowed) {
      const url = request.nextUrl.clone();
      url.pathname = HOME_BY_ROLE[primary];
      return NextResponse.redirect(url);
    }
  }

  return response;
}
