import * as d3 from 'd3';

export interface TooltipData {
  label: string;
  description?: string;
}

let tooltipTimeoutRef: NodeJS.Timeout | null = null;

export const createTooltip = (className: string): HTMLDivElement => {
  return d3
    .select('body')
    .append('div')
    .attr('class', className)
    .style('position', 'absolute')
    .style('padding', '6px 10px')
    .style('background', 'rgba(255, 255, 255, 0.9)')
    .style('border', '1px solid #ccc')
    .style('border-radius', '4px')
    .style('pointer-events', 'none')
    .style('font', '12px sans-serif')
    .style('color', '#222')
    .style('box-shadow', '0 2px 6px rgba(0,0,0,0.15)')
    .style('visibility', 'hidden')
    .style('z-index', '1000')
    .style('max-width', '300px')
    .style('word-wrap', 'break-word')
    .style('white-space', 'normal')
    .node() as HTMLDivElement;
};

export const showTooltip = (
  tooltipRef: HTMLDivElement | null,
  event: MouseEvent,
  data: TooltipData
): void => {
  if (!tooltipRef) return;

  // Clear any existing hide timeout
  if (tooltipTimeoutRef) {
    clearTimeout(tooltipTimeoutRef);
    tooltipTimeoutRef = null;
  }

  tooltipRef.style.visibility = 'visible';
  tooltipRef.innerHTML = `
    <strong>Name:</strong> ${data.label}${
    data.description
      ? `<br><strong>Description:</strong> ${data.description}`
      : ''
  }
  `;
  tooltipRef.style.left = `${event.pageX + 10}px`;
  tooltipRef.style.top = `${event.pageY + 10}px`;
};

export const hideTooltip = (tooltipRef: HTMLDivElement | null): void => {
  if (!tooltipRef) return;

  // Set a timeout to hide the tooltip after 200ms
  tooltipTimeoutRef = setTimeout(() => {
    if (tooltipRef) {
      tooltipRef.style.visibility = 'hidden';
    }
    tooltipTimeoutRef = null;
  }, 200);
};

export const moveTooltip = (
  tooltipRef: HTMLDivElement | null,
  event: MouseEvent
): void => {
  if (!tooltipRef) return;

  // Clear any existing hide timeout when moving
  if (tooltipTimeoutRef) {
    clearTimeout(tooltipTimeoutRef);
    tooltipTimeoutRef = null;
  }

  tooltipRef.style.left = `${event.pageX + 10}px`;
  tooltipRef.style.top = `${event.pageY + 10}px`;
};

export const cleanupTooltip = (tooltipRef: HTMLDivElement | null): void => {
  if (tooltipTimeoutRef) {
    clearTimeout(tooltipTimeoutRef);
    tooltipTimeoutRef = null;
  }
  tooltipRef?.remove();
};
