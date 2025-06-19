# Mã lỗi 2xx

| Mã  | Ý nghĩa    | Dùng khi                              |
| --- | ---------- | ------------------------------------- |
| 200 | OK         | Request thành công, có dữ liệu trả về |
| 201 | Created    | Đã tạo mới thành công (POST)          |
| 204 | No Content | Thành công, không trả dữ liệu         |

# Mã lỗi 4xx

| Mã  | Ý nghĩa              | Dùng khi                                              |
| --- | -------------------- | ----------------------------------------------------- |
| 400 | Bad Request          | Dữ liệu không hợp lệ (thiếu field, sai định dạng...)  |
| 401 | Unauthorized         | Thiếu token hoặc token không hợp lệ                   |
| 403 | Forbidden            | Không đủ quyền (ví dụ: user thường gọi API của admin) |
| 404 | Not Found            | Không tìm thấy dữ liệu hoặc endpoint                  |
| 409 | Conflict             | Trùng dữ liệu (VD: email đã tồn tại)                  |
| 422 | Unprocessable Entity | Dữ liệu đúng định dạng nhưng không hợp lệ             |

# Mã lỗi 5xx

| Mã  | Ý nghĩa               | Dùng khi                                |
| --- | --------------------- | --------------------------------------- |
| 500 | Internal Server Error | Có lỗi bên server, chưa rõ nguyên nhân  |
| 503 | Service Unavailable   | Dịch vụ không sẵn sàng (tạm thời ngừng) |
