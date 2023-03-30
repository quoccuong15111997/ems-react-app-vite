var currentUrl = window.location.href;
//var currentUrl = "https://ttn.firstems.net/";
var comcode = currentUrl
  .replace("https://", "")
  .replace("http://","")
  .split(".")[0];
var domain = "https://api.firstems.com/";
if (
  comcode === "ttn" ||
  comcode === "pima" ||
  comcode === "jyj" ||
  comcode === "tys"
) {
  domain = "https://api.firstems.com/";
}else{
  comcode = "PMC";
  domain = "https://api-dev.firstems.com/";
}

export const comCodeCommon = comcode;
export const baseUrl = domain;
export const staticToken =
  "CUiPyc6WM5l76rni97QCakTmqeFQZNU2nVnj++PInm88yfXbEYrclLk/2v/JTDQLMFtd2pItPcwiihmZWzZMgADowUkxKIgP4HCOI9fZEHA=";
export const apiUrl = {
  config: {
    label: "Cấu hình",
    value: "Api/data/runApi_Syst?run_Code=SYS001",
  },
  label: {
    label: "Nhãn",
    value: "Api/data/runApi_Syst?run_Code=SYS002",
  },
  sysLogin: {
    label: "Đăng nhập hệ thống",
    value: "Api/data/runApi_Syst?run_Code=SYS005",
  },
  locationLogin: {
    label: "Đăng nhập vào công ty",
    value: "Api/data/runApi_Syst?run_Code=SYS006",
  },
  listCommon: {
    label: "Danh sách chuẩn",
    value: "Api/data/runApi_Data?run_Code=DTA002",
  },
  listCustomer: {
    label: "Danh sách khách hàng",
    value: "Api/data/runApi_Data?run_Code=DTA004",
  },
  listProduct: {
    label: "Danh sách sản phẩm",
    value: "Api/data/runApi_Data?run_Code=DTA004",
  },
  postDocument: {
    label: "Lưu chứng từ",
    value: "Api/data/runApi_Data?run_Code=DTA007",
  },
  updateDocument: {
    label: "Cập nhật chứng từ",
    value: "Api/data/runApi_Data?run_Code=DTA008",
  },
  lockDocument: {
    label: "Khóa chứng từ",
    value: "Api/data/runApi_data?run_Code=DTA015",
  },
  detailDocument: {
    label: "Chi tiết chứng từ",
    value: "Api/data/runApi_Data?run_Code=DTA005",
  },
  listDocument: {
    label: "Danh sách chứng từ",
    value: "Api/data/runApi_Data?run_Code=DTA003",
  },
  deleteDocument: {
    label: "Xóa chứng từ",
    value: "Api/data/runApi_data?run_Code=DTA009",
  },
  postFile: {
    label: "Post File",
    value: "Api/data/runApi_File?run_Code=DTA011",
  },
  deleteFile: {
    label: "Delete File",
    value: "/Api/data/runApi_File?run_Code=DTA012",
  },
  reviewStep: {
    label: "Quá trình xét duyệt",
    value: "Api/data/runApi_data?run_Code=DTA017",
  },
  progessStep: {
    label: "Quy trình phê duyệt",
    value: "Api/data/runApi_data?run_Code=DTA013",
  },
  listObjectBillPayment: {
    label: "Danh sách đối tượng thanh toán",
    value: "Api/data/runApi_data?run_Code=DTA018",
  },
  defaultDocument: {
    label: "Danh sách đối tượng thanh toán",
    value: "Api/data/runApi_data?run_Code=DTA006",
  },
};
export const errorMessage = {
  oders: {
    customerUndefined: "Chưa chọn khách hàng",
    rcvUndefined: "Chưa nhập thông tin giao hàng",
    detailsUndefined: "Chưa chọn sản phẩm",
  },
  billPayment: {
    dcmnsbcdUndefined: "Chưa chọn loại đề nghị thanh toán",
    scntcodeUndefined: "Chưa chọn loại chi tiêu",
    objcTypeUndefined: "Chưa chọn loại đối tượng",
    objccodeUndefined: "Chưa chọn đối tượng",
    noteUndefined: "Chưa nhập nội dung",
    detailsUndefined: "Chưa thêm chi tiết",
  },
};
