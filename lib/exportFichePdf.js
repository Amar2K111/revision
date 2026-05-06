/**
 * Exporte un nœud DOM en PDF (A4, multi-pages si besoin).
 * @param {HTMLElement} element
 * @param {string} filename
 */
export async function downloadElementAsPdf(element, filename) {
  const [{ jsPDF }, { default: html2canvas }] = await Promise.all([
    import("jspdf"),
    import("html2canvas"),
  ]);

  const scale = Math.min(2, (typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1) * 1.5);

  const canvas = await html2canvas(element, {
    scale,
    useCORS: true,
    logging: false,
    backgroundColor: "#ffffff",
    scrollX: 0,
    scrollY: 0,
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight,
  });

  const imgWpx = canvas.width;
  const imgHpx = canvas.height;
  const pdf = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 11;
  const usableW = pageWidth - 2 * margin;
  const usableH = pageHeight - 2 * margin;

  const totalHeightMm = (imgHpx / imgWpx) * usableW;

  let yPxAcc = 0;
  while (yPxAcc < imgHpx) {
    let slicePx = Math.ceil((usableH / totalHeightMm) * imgHpx);
    if (!Number.isFinite(slicePx) || slicePx < 1) {
      slicePx = imgHpx - yPxAcc;
    }
    slicePx = Math.min(slicePx, imgHpx - yPxAcc);

    const sliceCanvas = document.createElement("canvas");
    sliceCanvas.width = imgWpx;
    sliceCanvas.height = slicePx;
    const ctx = sliceCanvas.getContext("2d");
    if (!ctx) {
      throw new Error("Canvas non disponible");
    }
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, imgWpx, slicePx);
    ctx.drawImage(canvas, 0, yPxAcc, imgWpx, slicePx, 0, 0, imgWpx, slicePx);
    const sliceData = sliceCanvas.toDataURL("image/jpeg", 0.92);
    const sliceMm = (slicePx / imgWpx) * usableW;

    if (yPxAcc > 0) {
      pdf.addPage();
    }
    pdf.addImage(sliceData, "JPEG", margin, margin, usableW, sliceMm);

    yPxAcc += slicePx;
  }

  pdf.save(filename);
}

export function fichePdfFileName(topicLabel) {
  if (!topicLabel || typeof topicLabel !== "string") {
    return "fiche-revision-facile.pdf";
  }
  const ascii = topicLabel
    .normalize("NFD")
    .replace(/\p{M}+/gu, "")
    .trim();
  const slug = ascii
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);
  return `${slug || "fiche-revision-facile"}.pdf`;
}
