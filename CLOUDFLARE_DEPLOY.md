# 🚀 Deploy lên Cloudflare Pages

## 📋 Tổng quan
App này sử dụng **localStorage** để lưu trữ dữ liệu người dùng (không cần database). Deploy lên Cloudflare Pages miễn phí và đơn giản.

## 🔧 Yêu cầu
- Tài khoản GitHub (để push code)
- Tài khoản Cloudflare (miễn phí tại https://dash.cloudflare.com)

## 📝 Các bước Deploy

### 1. Chuẩn bị code
```bash
# Đảm bảo code đã được commit
git add .
git commit -m "Ready for Cloudflare Pages deployment"
git push origin main
```

### 2. Deploy trên Cloudflare Pages

1. **Truy cập Cloudflare Pages**
   - Vào https://dash.cloudflare.com
   - Chọn **Workers & Pages** → **Create application** → **Pages**
   - Chọn **Connect to Git**

2. **Kết nối GitHub repository**
   - Chọn repository của bạn
   - Nếu lần đầu, authorize Cloudflare truy cập GitHub

3. **Cấu hình Build Settings**
   ```
   Production branch: main
   Build command: npm run build
   Build output directory: dist
   ```

4. **Environment Variables**
   - Thêm biến môi trường:
     - **VITE_GEMINI_API_KEY**: API key của Google Gemini AI
     - Lấy tại: https://aistudio.google.com/apikey

5. **Deploy**
   - Click **Save and Deploy**
   - Chờ 2-3 phút để build xong

### 3. Truy cập website
- URL sẽ có dạng: `https://your-project.pages.dev`
- Có thể custom domain miễn phí

## ✨ Tính năng

### Lưu trữ dữ liệu
- **localStorage**: Lưu trữ toàn bộ dữ liệu người dùng trên trình duyệt
- **Không cần database**: Đơn giản, nhanh chóng
- **Dữ liệu cá nhân**: Mỗi người dùng có dữ liệu riêng trên máy của họ

### AI Features
- **Google Gemini AI**: Tạo câu chuyện, giải thích ngữ pháp
- **Text-to-Speech**: Phát âm từ vựng (Web Speech API - miễn phí)

## 🔄 Auto Deploy
Mỗi khi bạn push code lên GitHub, Cloudflare Pages tự động build và deploy phiên bản mới.

```bash
git add .
git commit -m "Update features"
git push origin main
# Cloudflare Pages tự động deploy sau 2-3 phút
```

## 🌐 Custom Domain (Optional)
1. Vào **Settings** → **Custom domains**
2. Thêm domain của bạn (miễn phí SSL)

## 📊 Giới hạn Free Plan
- ✅ Unlimited requests
- ✅ Unlimited bandwidth
- ✅ 500 builds/month
- ✅ SSL miễn phí
- ✅ Auto deploy from GitHub

## 🛠️ Troubleshooting

### Build failed
```bash
# Kiểm tra local trước
npm install
npm run build
# Nếu build được local thì sẽ build được trên Cloudflare
```

### VITE_GEMINI_API_KEY không hoạt động
1. Vào **Settings** → **Environment variables**
2. Kiểm tra biến `VITE_GEMINI_API_KEY` đã được thêm chưa
3. Redeploy lại: **Deployments** → **...** → **Retry deployment**

## 📱 Local Development
```bash
npm install
npm run dev
# Mở http://localhost:5173
```

## 🎯 Kết luận
- ✅ Miễn phí 100%
- ✅ Không cần quản lý server
- ✅ Không cần database
- ✅ Auto deploy from GitHub
- ✅ Fast & Simple
