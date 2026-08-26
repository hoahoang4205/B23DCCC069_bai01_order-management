
// GIẢI THÍCH THIẾT KẾ

/**
1. ENUM
- OrderStatus, ProductCategory, PaymentMethod là tập giá trị cố định.
- Dùng enum giúp tránh nhầm lẫn khi so sánh chuỗi, dễ kiểm tra lỗi,và khi thay đổi giá trị chỉ cần sửa một chỗ.
- Ví dụ: khi tạo đơn, status chỉ có thể là 'paid' | 'pending' | 'cancelled'.

2. GENERIC HELPERS
- ApiResponse<T>: Chuẩn hóa mọi phản hồi từ server (statusCode, message, data) giúp frontend xử lý đồng bộ, dễ viết interceptor.
- Paginated<T>: Hỗ trợ phân trang cho danh sách (đơn hàng, sản phẩm, khách hàng).
- HasId: Đảm bảo mọi entity đều có id, dùng cho DeleteDto.

3. ENTITY RELATION
- Customer (1) – (n) Order: một khách có nhiều đơn.
- Order (1) – (n) OrderItem: một đơn có nhiều dòng sản phẩm.
- Product (1) – (n) OrderItem: một sản phẩm có thể xuất hiện ở nhiều đơn.
- OrderItem lưu snapshot của Product tại thời điểm đặt hàng.

4. SNAPSHOT TRONG ORDERITEM
- Vì giá sản phẩm có thể thay đổi theo thời gian, việc lưu lại tên và giá tại thời điểm đặt hàng giúp giữ nguyên lịch sử giao dịch.

5. UTILITY TYPES (Omit, Partial, Pick)
- Omit: Loại bỏ các trường tự sinh (id, createdAt...) khi tạo mới.
- Partial: Cho phép cập nhật từng phần (rất cần cho form sửa).
- Pick: Lấy một vài trường, dùng cho DeleteDto (chỉ lấy id) và Preview.

6. PREVIEW TYPES
- Dùng khi hiển thị danh sách (ví dụ danh sách đơn hàng) để giảm băng thông.
- Không dùng trong popup tạo/sửa vì cần nhập đủ thông tin.
 *
7. LUỒNG NGƯỜI DÙNG CHI TIẾT
  BƯỚC 1: Nhân viên quét/nhập mã sản phẩm → thêm vào giỏ hàng.
  BƯỚC 2: Sau khi có giỏ, hỏi khách: "Chị có muốn tích điểm không?"
  BƯỚC 3:
    - Nếu KHÔNG: giữ nguyên, customerId = undefined → đơn vãng lai.
    - Nếu CÓ: nhập SĐT hoặc tên → tìm kiếm.
      + TÌM THẤY: hiển thị thông tin + nút "Sử dụng" → gán customerId.
      + KHÔNG TÌM THẤY: nút "Thêm khách hàng mới" → tạo mới → tự động gán.
  BƯỚC 4: Chọn phương thức thanh toán (tiền mặt / QR).
  BƯỚC 5: Bấm "Xác nhận" → gửi CreateOrderDto lên server.
  BƯỚC 6: Server tính total, earnedPoints, tạo Order, cập nhật Customer.
  BƯỚC 7: Trả về ApiResponse<Order> để hiển thị hóa đơn.

 */