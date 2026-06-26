import { Response, NextFunction } from "express";

/**
 * RBAC Authorization middleware.
 * Reads role exclusively from the JWT-decoded req.user object.
 * The x-mock-role header fallback has been removed for security.
 */
export const authorize =
  (...roles: string[]) =>
  (req: any, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;
    if (!userRole || !roles.includes(userRole)) {
      return res.status(403).json({
        message: "Forbidden: insufficient role privileges.",
      });
    }
    next();
  };

/**
 * Department scoping middleware.
 * Non-admin users can only see MAPs assigned to their department.
 * Reads department exclusively from JWT — no header overrides allowed.
 */
export const scopeByDepartment = (req: any, res: Response, next: NextFunction) => {
  const userRole = req.user?.role;
  const userDept = req.user?.department;

  if (userRole && userRole !== "ADMIN" && userDept && userDept !== "All") {
    req.departmentFilter = { assignedTo: userDept };
  } else {
    req.departmentFilter = {};
  }

  next();
};
