"use server"
import ConnectDB from "@/components/mongoConnect";
import orders from "@/components/models/orders";
import Products from "@/components/models/products";
import nodemailer from "nodemailer";


export async function saveCheckout(data) {
    console.log("RECEIVED DATA FROM FRONTEND", data);
    await ConnectDB();
    console.log('connected to DB successfully')

    const { name, email, phone, address, city, postal, comments, productID, orderID, total } = data;

    const _id = productID.split(",")


    await orders.create({
        name: name,
        email: email,
        phone: phone,
        address: address,
        city: city,
        postal: postal,
        comments: comments,
        productID: _id,
        orderID: orderID,
        total: total,
    })
    // this is the function to send order email to customer
    async function sendEmail(email) {
        // const email = email
        console.log("creating node mailer transporter")
        const transporter = nodemailer.createTransport({
            service: "gmail",
            port: 587,
            secure: false,
            auth: {
                user: process.env.User_ID,
                pass: process.env.User_PASS,
            },
        });
        console.log("transporter created")
        console.log("sending emails")
        transporter.sendMail({
            from: `"Ghari Point" <${process.env.User_ID}>`,
            to: email,
            subject: "Ghari Point-your Order ",
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
          Thank you for shopping with <strong>Ghari Point</strong>. We’ve received your order <b>#${orderID}</b> and it’s now being processed.
        </p>

        <div style="margin:20px 0; padding:15px; background:#f3f3f3; border-radius:6px;">
          <p style="margin:0; font-size:14px; color:#333;">
            <b>Order Summary</b><br>
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
`
        })

        console.log("email sent successfully successfully")

    }
    sendEmail(email)

    console.log("data saved to DB successfully")

}

export async function getCheckout(_id) {
    console.log("RECEIVED DATA FROM FRONTEND", _id)
    await ConnectDB();
    console.log("connected to DB Successfully")

    // Split in case _id comes as "id1,id2,id3"
    const ids = _id.split(',');

    // Find products and convert to plain objects
    const data = await Products.find({ _id: { $in: ids } }).lean();

    if (data) {
        console.log('products found', data);

        // ✅ Convert _id from ObjectId to string
        const plainData = data.map(item => ({
            ...item,
            _id: item._id.toString()
        }));

        return plainData;
    } else {
        console.log("data not found in DB");
        return [];
    }
}




