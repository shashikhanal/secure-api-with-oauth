import { claimCheck } from 'express-oauth2-jwt-bearer';

export const checkPermissions = (requiredPermissions) => {
    return claimCheck((claims) => {
        const permissions = claims.permissions || [];
        const hasAllPermissions = requiredPermissions.every(
            (permission) => permissions.includes(permission)
        );
        
        if (!hasAllPermissions) {
            throw new Error('Insufficient permissions');
        }
        return true;
    });
}; 