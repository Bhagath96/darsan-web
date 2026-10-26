import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { routes } from '@/router'
import { makeStore, type RootState } from '@/store'

interface Options {
  /** Starting URL, e.g. "/darshan?temple=tm-sastha". */
  url?: string
  preloadedState?: Partial<RootState>
}

/** Renders the whole app (real routes, store and sagas) inside a memory router. */
export function renderApp({ url = '/', preloadedState = {} }: Options = {}) {
  const store = makeStore(preloadedState)
  const router = createMemoryRouter(routes, { initialEntries: [url] })
  const user = userEvent.setup()
  const view = render(
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>,
  )
  return { ...view, store, router, user }
}

/** Current path + query of the memory router, e.g. "/darshan?temple=tm-krishna". */
export function currentUrl(router: ReturnType<typeof createMemoryRouter>): string {
  const { pathname, search } = router.state.location
  return pathname + search
}
