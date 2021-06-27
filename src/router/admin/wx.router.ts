import { Router } from "express";
import AdminWxMsg from "../../controllers/admin/wx.controller";
const router: Router = Router({ caseSensitive: true });

router.get("/checkPushMsg", AdminWxMsg.checkWxPushToken);
export default router;
