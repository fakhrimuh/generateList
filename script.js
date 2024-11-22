// Header CSV yang sudah ditentukan
const headerCSV = [
  "SellerCode",
  "BuyerCode",
  "InvoiceCurrency",
  "Amount",
  "InvoiceReference",
  "InvoiceDate",
  "PaymentTerm",
  "Remark",
];

// Array untuk menyimpan data input pengguna
let dataInput = [];

// Array untuk menyimpan referensi yang sudah digunakan
let existingReferences = [];

// Menangani form submit
document.getElementById("dataForm").addEventListener("submit", function (e) {
  e.preventDefault(); // Mencegah form untuk submit biasa

  // Mengambil nilai input dari form sesuai dengan header
  const SellerCode = document.getElementById("SellerCode").value;
  const BuyerCode = document.getElementById("BuyerCode").value;
  const InvoiceCurrency = document.getElementById("InvoiceCurrency").value;
  const Amount = document.getElementById("Amount").value;
  const InvoiceReference = document.getElementById("InvoiceReference").value;
  const InvoiceDate = document.getElementById("InvoiceDate").value;
  const PaymentTerm = document.getElementById("PaymentTerm").value;
  const Remark = document.getElementById("remark").value;
  const referenceCount = parseInt(
    document.getElementById("referenceCount").value
  );

  // Fungsi untuk mengonversi tanggal ke format yyyymmdd
  function formatDateToYYYYMMDD(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const day = d.getDate().toString().padStart(2, "0");
    return `${year}${month}${day}`;
  }

  // Mengonversi tanggal ke format yyyymmdd
  const formattedInvoiceDate = formatDateToYYYYMMDD(InvoiceDate);

  // Menangani tombol reset
  document.getElementById("resetBtn").addEventListener("click", function () {
    // Reset form
    document.getElementById("dataForm").reset();

    // Kosongkan daftar data yang ditampilkan
    document.getElementById("dataList").innerHTML = "";

    // Kosongkan array dataInput
    dataInput = [];

    // Kosongkan array existingReferences jika ingin menghapus referensi yang sudah ada
    existingReferences = [];
  });

  // Fungsi untuk menambah angka pada referensi jika sudah ada
  function generateUniqueReference(reference, count) {
    let references = [];
    let newReference = reference + "1"; // Tambahkan angka 1 pada referensi pertama
    if (!existingReferences.includes(newReference)) {
      references.push(newReference); // Menambahkan referensi pertama dengan angka 1
      existingReferences.push(newReference); // Menambahkan referensi ke daftar existingReferences
    }

    // Menambahkan angka untuk referensi yang lainnya
    for (let i = 2; i <= count; i++) {
      // Mulai dari angka 2 untuk referensi selanjutnya
      let finalReference = reference + i;
      // Mengecek apakah referensi sudah ada sebelumnya
      while (existingReferences.includes(finalReference)) {
        i++;
        finalReference = reference + i;
      }
      references.push(finalReference); // Menambahkan referensi baru
      existingReferences.push(finalReference); // Menambahkan ke daftar existingReferences
    }

    return references;
  }

  // Menghasilkan referensi unik berdasarkan jumlah yang diminta
  const uniqueInvoiceReferences = generateUniqueReference(
    InvoiceReference,
    referenceCount
  );

  // Menambahkan data ke array untuk setiap referensi
  uniqueInvoiceReferences.forEach((ref) => {
    const newData = [
      SellerCode,
      BuyerCode,
      InvoiceCurrency,
      Amount,
      ref, // Referensi yang sudah diubah
      formattedInvoiceDate, // Menggunakan tanggal yang sudah diformat
      PaymentTerm,
      Remark,
    ];
    dataInput.push(newData);
  });

  // Menampilkan data pada list
  displayData();

  // Reset form setelah data disimpan
  e.target.reset();
});

// Menampilkan data yang sudah dimasukkan ke dalam list
function displayData() {
  const dataList = document.getElementById("dataList");
  dataList.innerHTML = ""; // Kosongkan list sebelum menambah data baru
  dataInput.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = `SellerCode: ${item[0]}, BuyerCode: ${item[1]}, InvoiceCurrency: ${item[2]}, Amount: ${item[3]}, InvoiceReference: ${item[4]}, InvoiceDate: ${item[5]}, PaymentTerm: ${item[6]}, Remark: ${item[7]}`;
    dataList.appendChild(li);
  });
}

// Menangani ekspor ke CSV
document.getElementById("exportBtn").addEventListener("click", function () {
  exportToCSV();
});

// Fungsi untuk mengonversi data menjadi format CSV dan mengunduhnya
function exportToCSV() {
  // Menyusun data untuk file CSV, menambahkan header dan data
  const rows = [headerCSV, ...dataInput];

  // Mengonversi data menjadi format CSV
  const csvContent = rows.map((row) => row.join(",")).join("\n");

  // Membuat file CSV untuk diunduh
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "data.csv"; // Nama file CSV
  link.click();
}
