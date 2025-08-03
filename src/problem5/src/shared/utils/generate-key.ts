import { v4 as uuidv4 } from 'uuid';

export const sessionIdCacheKey = (cacheKey = uuidv4()): string => {
    return `app:session:${cacheKey}`;
};
