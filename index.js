import express from "express";
import session from "express-session";
import passport from "./src/config/passport.config.js";
import dotenv from "dotenv";
import cors from "cors";

import errorHandler from "./src/middlewares/error.handler.js";
import authRoutes from "./src/routes/auth.routes.js";
import dashboardRoutes from "./src/routes/dashboard.routes.js";
import organizationMenuRoutes from "./src/routes/organization-menu.routes.js";
import menuRoutes from "./src/routes/menu.routes.js";
import tenantRoutes from "./src/routes/tenant.routes.js";
import organizationRoutes from "./src/routes/organization.routes.js";
import roleRoutes from "./src/routes/role.routes.js";
import subscriptionRoutes from "./src/routes/subscription.routes.js";

dotenv.config();

const app = express();

app.use("/uploads", express.static("uploads"));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.PASSPORT_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

const apiRoutes = express.Router();

apiRoutes.use("/auth", authRoutes);
apiRoutes.use("/dashboard", dashboardRoutes);
apiRoutes.use("/roles", roleRoutes);
apiRoutes.use("/subscriptions", subscriptionRoutes);
apiRoutes.use("/organization-menus", organizationMenuRoutes);
apiRoutes.use("/menus", menuRoutes);
apiRoutes.use("/organizations", organizationRoutes);
apiRoutes.use("/tenants", tenantRoutes);

app.use("/api", apiRoutes);

app.use(errorHandler);

app.listen(3000, () => console.log("Server running on port 3000"));
