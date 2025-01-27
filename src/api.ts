const addHeaders =
  (customHeaders: Record<string, string>) =>
  ({ headers, ...req }: RequestInit) => ({
    ...req,
    headers: {
      ...headers,
      ...customHeaders,
    },
  });

const addTokenHeader = (token: string) =>
  addHeaders({ Authorization: `Bearer ${token}` });

const withContentType = addHeaders({ "Content-Type": "application/json" });

export const fetchJson = async <R>(
  url: string,
  init: RequestInit = {}
): Promise<R> => {
  const response = await fetch(url, withContentType(init));

  let json: R & { error?: unknown; message?: unknown };

  try {
    json = await response.json();
  } catch {
    return;
  }

  if (!response.ok || json.error) {
    throw json.message || json.error;
  }
  return json as R;
};

function withToken(
  fetchFn: typeof fetchJson,
  tokenGetter: () => Promise<string>
): typeof fetchJson {
  return async (url, init = {}) => {
    const token = await tokenGetter();
    const withAuth = addTokenHeader(token);
    return await fetchFn(url, withAuth(init));
  };
}

// this is the fetch function used in store, so far no authorization is in use,
// this should be addressed in the future

export const fetchFn = fetchJson;
