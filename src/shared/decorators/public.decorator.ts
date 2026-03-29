import { SetMetadata } from '@nestjs/common';

/**
 * Marks an endpoint as publicly accessible (no auth required).
 * Used by the Wealth Matrix controller for development-mode access.
 */
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
