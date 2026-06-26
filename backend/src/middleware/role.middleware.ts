import { Response, NextFunction } from "express";

export const authorize =
  (...roles: string[]) =>
  (req: any, res: Response, next: NextFunction) => {
    const userRole = req.user?.role || req.headers["x-mock-role"] || "ADMIN";
    if (!roles.includes(userRole)) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    next();
  };

export const scopeByDepartment = (req: any, res: Response, next: NextFunction) => {
  const userRole = req.user?.role || req.headers["x-mock-role"] || "ADMIN";
  const userDept = req.user?.department || req.headers["x-mock-department"] || req.query.department;

  if (userRole !== "ADMIN" && userDept && userDept !== "All") {
    req.departmentFilter = { assignedTo: userDept };
  } else {
    req.departmentFilter = {};
  }

  next();
};
