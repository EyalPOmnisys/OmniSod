const encodeSvgToBase64 = (svgMarkup: string): string => {
  const encoded = btoa(unescape(encodeURIComponent(svgMarkup)));
  return `data:image/svg+xml;base64,${encoded}`;
};

export const composeMapIconFromSvg = (
  iconSvg: SVGElement,
  backgroundColor: string,
  iconColor?: string
): string => {
  const iconClone = iconSvg.cloneNode(true) as SVGElement;
  iconClone.setAttribute("width", "24");
  iconClone.setAttribute("height", "24");

  const iconMarkup = iconColor
    ? iconClone.outerHTML
        .replace(/fill=["']white["']/gi, `fill="${iconColor}"`)
        .replace(/fill:[\s]*white/gi, `fill:${iconColor}`)
    : iconClone.outerHTML;

  const iconOnlyInner = iconMarkup.replace(/^<svg[^>]*>/i, "").replace(/<\/svg>$/i, "");

  const wrappedSvg = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">`,
    `<circle cx="24" cy="24" r="21" fill="${backgroundColor}" />`,
    `<g transform="translate(12 12)">${iconOnlyInner}</g>`,
    `</svg>`,
  ].join("");

  return encodeSvgToBase64(wrappedSvg);
};

export const composeMapIconFromImage = (
  iconImage: HTMLImageElement,
  backgroundColor: string,
  fallbackIconPath: string
): string => {
  const canvas = document.createElement("canvas");
  canvas.width = 48;
  canvas.height = 48;

  const context = canvas.getContext("2d");
  if (!context) {
    return fallbackIconPath;
  }

  context.fillStyle = backgroundColor;
  context.beginPath();
  context.arc(24, 24, 21, 0, Math.PI * 2);
  context.fill();

  context.drawImage(iconImage, 12, 12, 24, 24);
  return canvas.toDataURL("image/png");
};