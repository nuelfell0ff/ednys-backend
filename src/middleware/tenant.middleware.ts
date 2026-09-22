import { NextFunction, Request, Response } from 'express';

import { School } from '../modules/schools/school.model';

const BASE_DOMAIN =
  'ednys.com.ng';

const PLATFORM_SUBDOMAINS = new Set([
  'www',
  'api',
]);

const getHostname = (
  req: Request
): string => {
  const forwardedHost =
    req.headers['x-forwarded-host'];

  if (typeof forwardedHost === 'string') {
    const firstHost =
      forwardedHost
        .split(',')[0]
        ?.trim();

    if (firstHost) {
      return firstHost
        .split(':')[0]
        ?.toLowerCase() || '';
    }
  }

  return req.hostname
    .trim()
    .toLowerCase();
};

const getSubdomain = (
  hostname: string
): string | null => {
  if (
    hostname === 'localhost' ||
    hostname === '127.0.0.1'
  ) {
    return null;
  }

  if (
    hostname === BASE_DOMAIN
  ) {
    return null;
  }

  if (
    !hostname.endsWith(
      `.${BASE_DOMAIN}`
    )
  ) {
    return null;
  }

  const subdomain =
    hostname.slice(
      0,
      -`.${BASE_DOMAIN}`.length
    );

  if (
    !subdomain ||
    subdomain.includes('.')
  ) {
    return null;
  }

  return subdomain;
};

export const tenantMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const hostname =
      getHostname(req);

    const subdomain =
      getSubdomain(hostname);

    if (!subdomain) {
      next();
      return;
    }

    if (
      PLATFORM_SUBDOMAINS.has(
        subdomain
      )
    ) {
      next();
      return;
    }

    const school =
      await School.findOne({
        subdomain,
        isActive: true,
      });

    if (!school) {
      res.status(404).json({
        success: false,
        message:
          'School tenant not found',
      });

      return;
    }

    req.school = school;

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'Failed to resolve school tenant',
    });
  }
};