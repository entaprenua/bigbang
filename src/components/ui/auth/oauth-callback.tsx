import { createEffect, type JSX } from 'solid-js';
import { useSearchParams } from '@solidjs/router';
import { useAuth } from './auth-provider';
import { QueryProvider, useQueryState } from '~/components/ui/query';

interface OAuthCallbackHandlerProps {
  fallbackRedirect?: string;
  autoRedirect?: boolean;
  children?: JSX.Element;
}

const OAuthCallbackHandler = (props: OAuthCallbackHandlerProps) => {
  const [searchParams] = useSearchParams();
  const code = searchParams.code as string | undefined;
  const state = searchParams.state as string | undefined;
  const auth = useAuth();

  if (!code || !state) {
    return <>{props.children}</>;
  }

  const queryFn = async () => {
    const provider = sessionStorage.getItem(`oauth:${state}`);
    if (!provider) throw new Error('OAuth session expired');

    const result = await auth.completeOAuth(code, state);
    if (!result.success) throw new Error(result.error || 'OAuth authentication failed');
    return result;
  };

  return (
    <QueryProvider
      queryKey={['oauth-callback', code, state]}
      queryFn={queryFn}
      retry={false}
      staleTime={0}
      gcTime={0}
    >
      <OAuthCallbackAutoRedirect
        fallbackRedirect={props.fallbackRedirect}
        autoRedirect={props.autoRedirect}
      >
        {props.children}
      </OAuthCallbackAutoRedirect>
    </QueryProvider>
  );
};

const OAuthCallbackAutoRedirect = (props: {
  fallbackRedirect?: string;
  autoRedirect?: boolean;
  children?: JSX.Element;
}) => {
  const query = useQueryState();

  createEffect(() => {
    if (query?.isSuccess && query?.data) {
      const data = query.data as { redirectUrl?: string };
      if (props.autoRedirect !== false) {
        const redirect = data.redirectUrl || props.fallbackRedirect || '/';
        window.location.href = redirect;
      }
    }
  });

  return <>{props.children}</>;
};

export { OAuthCallbackHandler };
