import QRCode from "qrcode";
import { config } from "dotenv";
import { Category } from "../models/category.model.js";
import { Product } from "../models/product.model.js";

config({ quiet: true });
const BASE_URL = process.env.BASE_URL || "http://localhost:4000";

class QrController {
  
  getQrPage = async (req, res, next) => {
    try {
      const categories = await Category.find({ deletedAt: null }).lean();
      const products = await Product.find({ deletedAt: null }).populate("category").lean();

      
      const menuQr = await QRCode.toDataURL(`${BASE_URL}/menu`, {
        width: 300,
        margin: 2,
        color: { dark: "#3D2009", light: "#FAF6F0" },
      });

      
      const categoryQrs = await Promise.all(
        categories.map(async (cat) => ({
          ...cat,
          qr: await QRCode.toDataURL(`${BASE_URL}/menu?category=${cat._id}`, {
            width: 200, margin: 2,
            color: { dark: "#3D2009", light: "#FAF6F0" },
          }),
        }))
      );

      
      const productQrs = await Promise.all(
        products.map(async (p) => ({
          ...p,
          qr: await QRCode.toDataURL(`${BASE_URL}/menu/${p._id}`, {
            width: 200, margin: 2,
            color: { dark: "#3D2009", light: "#FAF6F0" },
          }),
        }))
      );

      res.render("admin/qr", {
        user: req.user,
        menuQr,
        menuUrl: `${BASE_URL}/menu`,
        categoryQrs,
        productQrs,
      });
    } catch (error) {
      next(error);
    }
  };

  
  getViewerQr = async (req, res, next) => {
    try {
      const menuQr = await QRCode.toDataURL(`${BASE_URL}/menu`, {
        width: 400, margin: 3,
        color: { dark: "#3D2009", light: "#FAF6F0" },
      });
      res.render("qr-viewer", { menuQr, menuUrl: `${BASE_URL}/menu` });
    } catch (error) {
      next(error);
    }
  };
}

export default new QrController();
