import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  // Security check: Verify admin token from cookie
  const cookieStore = await cookies();
  const adminToken = cookieStore.get("admin_token");
  
  if (!adminToken || !adminToken.value) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const [user, pwd] = atob(adminToken.value).split(":");
    const adminUser = process.env.ADMIN_USER || "admin";
    const adminPassword = process.env.ADMIN_PASSWORD || "password123";
    
    if (user !== adminUser || pwd !== adminPassword) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }
  } catch (e) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Create public/uploads directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Sanitize file name
    const sanitizedName = Date.now() + "_" + file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filePath = path.join(uploadDir, sanitizedName);
    
    // Write buffer to local disk
    fs.writeFileSync(filePath, buffer);
    
    return NextResponse.json({ 
      success: true, 
      url: `/uploads/${sanitizedName}` 
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}
