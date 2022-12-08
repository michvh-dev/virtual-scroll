interface VirtualScrollBoundaries {
    minX?: number;
    minY?: number;
    maxX?: number;
    maxY?: number;
}
interface VirtualScrollEventPayload {
    currentX: number;
    currentY: number;
    offsetX: number;
    offsetY: number;
}
interface VirtualScrollConfig {
    horizontal?: boolean;
    vertical?: boolean;
    keyboardOffset?: number;
    boundaries?: VirtualScrollBoundaries;
}
declare class VirtualScroll {
    static Events: {
        scroll: string;
    };
    element: Window | HTMLElement;
    vertical: boolean;
    horizontal: boolean;
    keyboardOffset: number;
    boundaries: VirtualScrollBoundaries;
    pageX: number;
    pageY: number;
    keyBindings: {
        [key: string]: [number, number];
    };
    private mobileConfig;
    constructor({ vertical, horizontal, keyboardOffset, boundaries, }?: VirtualScrollConfig);
    private scroll;
    recalculateScroll(): void;
    private handleMouseScroll;
    private handleKeyDownMove;
    private trackMobile;
    private mobileTouchStart;
    private mobileTouchMove;
    private mobileAutoScroll;
    private mobileTouchEnd;
    private scrollEventKey;
    private setEventListeners;
    /**
     * EVENTS
     */
    private eventWrappers;
    private triggerEvent;
    on(key: keyof typeof VirtualScroll.Events, cb: (payload: VirtualScrollEventPayload) => void): void;
}
export default VirtualScroll;
