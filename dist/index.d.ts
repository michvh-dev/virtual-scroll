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
    horizontal: boolean;
    vertical: boolean;
    keyBoardOffset: number;
    boundaries?: VirtualScrollBoundaries;
}
declare class VirtualScroll {
    static Events: {
        scroll: string;
    };
    element: Window | HTMLElement;
    config: VirtualScrollConfig;
    pageX: number;
    pageY: number;
    keyBindings: {
        [key: string]: [number, number];
    };
    get boundaries(): VirtualScrollBoundaries;
    private mobileConfig;
    constructor(config?: VirtualScrollConfig);
    private scroll;
    handleMouseScroll: (e: WheelEvent) => void;
    handleKeyDownMove: (e: KeyboardEvent) => void;
    trackMobile(): void;
    mobileTouchStart(e: any): boolean;
    mobileTouchMove(e: any): boolean;
    mobileAutoScroll: () => void;
    mobileTouchEnd(e: any): boolean;
    scrollEventKey: string;
    setEventListeners(): void;
    /**
     * EVENTS
     */
    eventWrappers: any[];
    triggerEvent(eventName: string, object: VirtualScrollEventPayload): void;
    on(key: keyof typeof VirtualScroll.Events, cb: (payload: VirtualScrollEventPayload) => void): void;
}

export { VirtualScroll };
