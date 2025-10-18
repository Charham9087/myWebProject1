"use server"
import ConnectDB from "@/components/mongoConnect";
import orders from "@/components/models/orders";
import Products from "@/components/models/products";
import nodemailer from "nodemailer";

export async function saveCheckout(data) {
  console.log("RECEIVED DATA FROM FRONTEND", data);
  await ConnectDB();
  console.log("connected to DB successfully");

  const {
    name,
    email,
    phone,
    address,
    city,
    postal,
    comments,
    productID,  // for normal checkout
    products,   // for admin checkout
    orderID,
    total,
  } = data;

  // ✅ Handle both types of data (productID string OR products array)
  let finalProducts = [];

  if (Array.isArray(products) && products.length > 0) {
    // Admin Checkout – full product details
    finalProducts = products.map((p) => ({
      id: p._id,
      name: p.name,
      quantity: p.quantity,
      price: Number(p.manualPrice) || 0,
    }));
  } else if (productID) {
    // Normal Checkout – just IDs
    finalProducts = productID.split(",").map((id) => ({ id }));
  }

  // ✅ Save to DB
  await orders.create({
    name,
    email,
    phone,
    address,
    city,
    postal,
    comments,
    productID: finalProducts.map((p) => p.id), // for backward compatibility
    products: finalProducts,                   // full structured data
    orderID,
    total,
  });

  console.log("✅ Order saved to DB successfully");

  // ✅ Send confirmation email to customer
  async function sendEmail(email) {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 587,
      secure: false,
      auth: {
        user: process.env.User_ID,
        pass: process.env.User_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Ghari Point" <${process.env.User_ID}>`,
      to: email,
      subject: "Ghari Point - Your Order",
      html: `
        <div style="font-family: Arial, sans-serif; background-color:#f9f9f9; padding:20px;">
    <div style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 6px rgba(0,0,0,0.1);">
      <div style="background:#000; color:#fff; text-align:center; padding:20px;">
        <div style="background:#000; color:#fff; text-align:center; padding:20px;">
  
  <p style="margin:10px 0 0; font-size:16px; color:#fff;">Ghari Point</p>
  <p style="margin:0; font-size:14px;">Flex Different. Wear Authentic.</p>
</div>

        <p style="margin:0; font-size:14px;">Flex Different. Wear Authentic.</p>
      </div>

      <div style="padding:20px;">
        <h2 style="font-size:20px; margin-bottom:10px; color:#333;">Order Confirmation</h2>
        <p style="font-size:14px; color:#555;">
          Hi <strong>${name}</strong>,<br><br>
          Thank you for shopping with <strong>Ghari Point</strong>. We’ve received your order ${orderID} and it’s now being processed.
        </p>

        <div style="margin:20px 0; padding:15px; background:#f3f3f3; border-radius:6px;">
          <p style="margin:0; font-size:14px; color:#333;">
            <b>Order Summary</b><br>
            Order ID: <strong>${orderID}</strong><br>
            Total Amount: <strong>Rs. ${total}</strong><br>
            Shipping Address: <br>
            ${address}, ${city}, ${postal}<br>
            Phone: ${phone}
          </p>
        </div>

  

        <div style="margin-top:20px; text-align:center;">
          <a href="gharipoint.com" 
             style="display:inline-block; padding:10px 20px; background:#000; color:#fff; text-decoration:none; border-radius:4px; font-size:14px;">
            Visit Ghari Point
          </a>
        </div>
      </div>

      <div style="background:#f1f1f1; text-align:center; padding:15px; font-size:12px; color:#888;">
        © ${new Date().getFullYear()} Ghari Point. All rights reserved.
      </div>
    </div>
  </div>
`,
    });

    console.log("📩 Customer email sent successfully");
  }
  await sendEmail(email);

  // ✅ Send admin notification email
  async function sendAdminEmail() {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 587,
      secure: false,
      auth: {
        user: process.env.User_ID,
        pass: process.env.User_PASS,
      },
    });

    const productListHTML = finalProducts
      .map(
        (p) =>
          `<li>${p.name || "Unknown"} — Qty: ${p.quantity || "-"} — Rs ${p.price || "-"}</li>`
      )
      .join("");

    await transporter.sendMail({
      from: `"Ghari Point" <${process.env.User_ID}>`,
      to: "gharipoint@gmail.com",
      subject: `New Order - ${orderID}`,
      html: `
        <h2>New Order Received</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Address:</b> ${address}, ${city}, ${postal}</p>
        <p><b>Total:</b> Rs. ${total}</p>
        <p><b>Order ID:</b> ${orderID}</p>
        <p><b>Comments:</b> ${comments || "None"}</p>
        <h3>Products:</h3>
        <ul>${productListHTML}</ul>
      `,
    });

    console.log("📩 Admin email sent successfully");
  }

  await sendAdminEmail();

  console.log("✅ saveCheckout() completed successfully");
}


export async function getCheckout(_id) {
  console.log("RECEIVED DATA FROM FRONTEND", _id)
  await ConnectDB();
  console.log("connected to DB Successfully")

  // Normalize ID(s)
  const ids = Array.isArray(_id) ? _id : _id.includes(',') ? _id.split(',') : [_id];

  // Fetch products
  const data = await Products.find({ _id: { $in: ids } }).lean();

  if (!data || data.length === 0) {
    console.log("No products found in DB");
    return [];
  }

  console.log('Products found:', data);

  // Convert ObjectIds to strings
  return data.map(item => ({ ...item, _id: item._id.toString() }));
}





