"use client";

import { useState, useRef } from "react";
import { GoldButton } from "@/components/ui/gold-button";

interface ParsedRow {
  so_dien_thoai: string;
  gia: number;
  nha_mang: string;
  loai_sim: string;
  mo_ta: string;
  phong_thuy: string;
  noi_bat: boolean;
}

interface ImportResult {
  success: number;
  failed: number;
  errors: { row: number; message: string }[];
}

const VALID_CARRIERS = ["viettel", "vinaphone", "mobifone"];

export default function ImportPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [parseError, setParseError] = useState("");

  const parseCSV = (text: string): ParsedRow[] => {
    const lines = text.split("\n").map((l) => l.trim()).filter((l) => l);
    if (lines.length < 2) throw new Error("File CSV phải có ít nhất 1 dòng dữ liệu");

    const header = lines[0].split(",").map((h) => h.trim().toLowerCase());
    const expected = ["so_dien_thoai", "gia", "nha_mang", "loai_sim", "mo_ta", "phong_thuy", "noi_bat"];
    const missingCols = expected.filter((col) => !header.includes(col));
    if (missingCols.length > 0) {
      throw new Error(`Thiếu cột: ${missingCols.join(", ")}`);
    }

    const parsed: ParsedRow[] = [];
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(",").map((c) => c.trim());
      if (cols.length < 7) {
        throw new Error(`Dòng ${i + 1}: thiếu cột (có ${cols.length}/7 cột)`);
      }

      const [so_dien_thoai, giaStr, nha_mang, loai_sim, mo_ta, phong_thuy, noi_batStr] = cols;

      if (!/^\d{10,11}$/.test(so_dien_thoai)) {
        throw new Error(`Dòng ${i + 1}: số điện thoại không hợp lệ (${so_dien_thoai})`);
      }

      const gia = parseInt(giaStr);
      if (isNaN(gia) || gia < 0) {
        throw new Error(`Dòng ${i + 1}: giá không hợp lệ (${giaStr})`);
      }

      if (!VALID_CARRIERS.includes(nha_mang.toLowerCase())) {
        throw new Error(`Dòng ${i + 1}: nhà mạng không hợp lệ (${nha_mang}). Chấp nhận: ${VALID_CARRIERS.join(", ")}`);
      }

      parsed.push({
        so_dien_thoai,
        gia,
        nha_mang: nha_mang.toLowerCase(),
        loai_sim,
        mo_ta,
        phong_thuy,
        noi_bat: noi_batStr.toLowerCase() === "true",
      });
    }

    return parsed;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setParseError("");
    setResult(null);
    setFileName(file.name);
    setLoading(true);

    try {
      const text = await file.text();
      const parsed = parseCSV(text);
      setRows(parsed);
    } catch (err) {
      setParseError(err instanceof Error ? err.message : "Lỗi khi đọc file");
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    if (rows.length === 0) return;

    setImporting(true);
    setResult(null);

    try {
      const res = await fetch("/api/admin/sims/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rows }),
      });

      const data = await res.json();

      if (!res.ok) {
        setResult({ success: 0, failed: rows.length, errors: [{ row: 0, message: data.error }] });
      } else {
        setResult(data);
        if (data.success > 0) {
          setRows([]);
          setFileName("");
          if (fileInputRef.current) fileInputRef.current.value = "";
        }
      }
    } catch {
      setResult({ success: 0, failed: rows.length, errors: [{ row: 0, message: "Không thể kết nối đến server" }] });
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-cormorant font-bold text-gold-primary">Import Sim Từ CSV</h1>
        <p className="text-text-secondary mt-2">Tải lên file CSV để thêm nhiều sim cùng lúc</p>
      </div>

      <div className="bg-surface border border-gold-border rounded-sm p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gold-primary">Định dạng file CSV</h2>
        <p className="text-text-secondary text-sm">
          File CSV phải có header và các cột theo định dạng sau:
        </p>
        <pre className="bg-surface-elevated border border-gold-border rounded-sm p-4 text-xs text-text-primary overflow-x-auto">
{`so_dien_thoai,gia,nha_mang,loai_sim,mo_ta,phong_thuy,noi_bat
0989999999,150000000,viettel,sim-ngu-quy,Ngũ quý 9,Cửu ngũ chí tôn,true
0918888888,135000000,vinaphone,sim-ngu-quy,Ngũ quý 8,Phát lộc,true`}
        </pre>
        <ul className="text-text-secondary text-sm space-y-1 list-disc list-inside">
          <li><strong>so_dien_thoai</strong>: 10-11 chữ số</li>
          <li><strong>gia</strong>: số nguyên (VNĐ)</li>
          <li><strong>nha_mang</strong>: viettel, vinaphone, hoặc mobifone</li>
          <li><strong>loai_sim</strong>: slug loại sim (sim-tu-quy, sim-ngu-quy, sim-loc-phat, ...)</li>
          <li><strong>mo_ta</strong>: mô tả (có thể để trống)</li>
          <li><strong>phong_thuy</strong>: ý nghĩa phong thủy (có thể để trống)</li>
          <li><strong>noi_bat</strong>: true hoặc false</li>
        </ul>
      </div>

      <div className="bg-surface border border-gold-border rounded-sm p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gold-primary">Tải lên file CSV</h2>

        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="block w-full text-sm text-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-sm file:font-semibold file:bg-gold-primary/10 file:text-gold-primary hover:file:bg-gold-primary/20 file:cursor-pointer file:transition-colors"
        />

        {loading && <p className="text-text-secondary text-sm">Đang đọc file...</p>}

        {parseError && (
          <div className="bg-error/10 border border-error/30 text-error px-4 py-3 rounded-sm text-sm">
            {parseError}
          </div>
        )}
      </div>

      {rows.length > 0 && (
        <div className="bg-surface border border-gold-border rounded-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gold-primary">
              Preview ({rows.length} sim)
            </h2>
            <span className="text-text-secondary text-sm">File: {fileName}</span>
          </div>

          <div className="overflow-x-auto max-h-96">
            <table className="w-full text-sm">
              <thead className="bg-surface-elevated sticky top-0">
                <tr>
                  <th className="px-4 py-2 text-left text-text-secondary font-medium">Số điện thoại</th>
                  <th className="px-4 py-2 text-left text-text-secondary font-medium">Giá</th>
                  <th className="px-4 py-2 text-left text-text-secondary font-medium">Nhà mạng</th>
                  <th className="px-4 py-2 text-left text-text-secondary font-medium">Loại sim</th>
                  <th className="px-4 py-2 text-left text-text-secondary font-medium">Nổi bật</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold-border">
                {rows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-surface-elevated/50">
                    <td className="px-4 py-2 text-text-primary font-mono">{row.so_dien_thoai}</td>
                    <td className="px-4 py-2 text-gold-primary">{row.gia.toLocaleString("vi-VN")}đ</td>
                    <td className="px-4 py-2 text-text-primary capitalize">{row.nha_mang}</td>
                    <td className="px-4 py-2 text-text-secondary">{row.loai_sim}</td>
                    <td className="px-4 py-2">
                      {row.noi_bat ? (
                        <span className="text-success">✓</span>
                      ) : (
                        <span className="text-text-muted">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex space-x-4">
            <GoldButton
              onClick={handleImport}
              variant="primary"
              size="lg"
              disabled={importing}
            >
              {importing ? "Đang import..." : `Import ${rows.length} sim`}
            </GoldButton>
            <GoldButton
              onClick={() => {
                setRows([]);
                setFileName("");
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              variant="secondary"
              size="lg"
            >
              Hủy
            </GoldButton>
          </div>
        </div>
      )}

      {result && (
        <div className="bg-surface border border-gold-border rounded-sm p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gold-primary">Kết quả import</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-success/10 border border-success/30 rounded-sm p-4">
              <p className="text-success text-2xl font-bold">{result.success}</p>
              <p className="text-text-secondary text-sm">Thêm thành công</p>
            </div>
            <div className="bg-error/10 border border-error/30 rounded-sm p-4">
              <p className="text-error text-2xl font-bold">{result.failed}</p>
              <p className="text-text-secondary text-sm">Thất bại</p>
            </div>
          </div>

          {result.errors.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-text-secondary font-medium">Chi tiết lỗi:</h3>
              <ul className="space-y-1 text-sm text-error">
                {result.errors.map((err, idx) => (
                  <li key={idx}>Dòng {err.row}: {err.message}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
