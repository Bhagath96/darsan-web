import { z } from 'zod'

/**
 * The app's single zod entry point. "jitless" stops zod from probing for
 * `new Function` (eval), which the Content-Security-Policy blocks; validation works
 * the same, just without the generated fast path.
 */
z.config({ jitless: true })

export { z }
